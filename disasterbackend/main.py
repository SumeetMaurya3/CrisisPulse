from flask import Flask, render_template, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS
from hugchat import hugchat
from hugchat.login import Login
import json
import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.layers import Input, Dense, Flatten, Conv2D, MaxPooling2D, concatenate
from tensorflow.keras.models import Model
from sklearn.model_selection import train_test_split
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.layers import GlobalAveragePooling2D,Dropout
from tensorflow.keras import layers, models
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
from PIL import Image
import io
HUGGINGFACE_EMAIL = "tejasgotavade@gmail.com"
HUGGINGFACE_PASSWORD = "Tejas@999"
app = Flask(__name__)

CORS(app,origins="*")

# Load the saved model
loaded_model1 = joblib.load('model_precip.joblib')
loaded_model2 = joblib.load('model_max.joblib')
loaded_model3 = joblib.load('model_min.joblib')

email = HUGGINGFACE_EMAIL
password = HUGGINGFACE_PASSWORD

sat73 = tf.keras.models.load_model("sat73.h5")


# Log in to huggingface and grant authorization to huggingchat
sign = Login(email, password)
cookies = sign.login()

# Save cookies to the local directory
cookie_path_dir = "./cookies_snapshot"
sign.saveCookiesToDir(cookie_path_dir)

# Load cookies when you restart your program:
# sign = login(email, None)
# cookies = sign.loadCookiesFromDir(cookie_path_dir) # This will detect if the JSON file exists, return cookies if it does and raise an Exception if it's not.

# Create a ChatBot
chatbot = hugchat.ChatBot(cookies=cookies.get_dict())  # or cookie_path="usercookies/<email>.json"

@app.route('/')
def home():
    return 'Hello, this is the homepage!'

# weather prediction
@app.route('/predict', methods=['POST'])
def predict():
    # Get input from the form
    precip = float(request.json.get('precip'))
    temp_max = float(request.json.get('temp_max'))
    temp_min = float(request.json.get('temp_min'))
    month_day_max = float(request.json.get('month_day_max'))
    max_min = float(request.json.get('max_min'))
    monthly_avg = float(request.json.get('monthly_avg'))
    day_of_year_avg = float(request.json.get('day_of_year_avg'))

    # Prepare input data for prediction
    input_data = pd.DataFrame({
        "precip": [precip],
        "temp_max": [temp_max],
        "temp_min": [temp_min],
        "month_day_max": [month_day_max],
        "max_min": [max_min],
        "monthly_avg": [monthly_avg],
        "day_of_year_avg": [day_of_year_avg]
    })

    # Make predictions
    predictions1 = loaded_model1.predict(input_data)
    predictions2 = loaded_model2.predict(input_data)
    predictions3 = loaded_model3.predict(input_data)

    # Display the result
    return jsonify(precip=predictions1[0], max=predictions2[0], min=predictions3[0])

@app.route('/chatbot', methods=['POST'])
def chat():
    query = request.json.get('query')
    print(query)
    # non stream response
    query_result = chatbot.query(query)
    print(query_result)
    return jsonify(result= query_result.text) # or query_result.text or query_result["text"]


@app.route('/allocation', methods=['POST'])
def allocate():
    try:
        input_data = request.json.get('data')

        if not isinstance(input_data, list):
            raise ValueError("Invalid input data format. Please provide a list.")

        multiplied_data = [[item['level'], int(item['population'])] for item in input_data]

        total = sum([value[1] for value in multiplied_data])

        if total == 0:
            raise ValueError("Total sum is zero, cannot calculate percentages.")

        percentage_data = [(value[1] / total) * 100 for value in multiplied_data]

        return jsonify(result=percentage_data)
    except ValueError as e:
        return jsonify(error=str(e)), 400

# satellite image, level of destruction prediction

def load_and_preprocess_image(path):
    img = Image.open(io.BytesIO(path.read()))
    
    # Resize image
    img = img.resize((226, 226))
    
    # Convert to array
    img_array = np.array(img)
    
    # Preprocess for MobileNetV2
    img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
    
    # Expand dimensions to create a batch (required for model input)
    img_array = np.expand_dims(img_array, axis=0)
    return img_array


@app.route('/sat', methods=['POST'])
def sat():
    if 'file' not in request.files:
        return 'No file part'
    file = request.files['file']
    if file.filename == '':
        return 'No selected file'
    if file:
        img_array = load_and_preprocess_image(file)
        predictions = sat73.predict(img_array)
        predicted_label = np.argmax(predictions[0])
        
        return jsonify(predicted_threat_level=int(predicted_label))
    
    
#####

@app.route('/damageAssessment', methods=['POST'])
def generate_report():
    try:
        data = request.json
        level = data.get('level')
        structure = data.get('structure')
        cause = data.get('cause')

        if not all([level is not None, structure, cause]):
            return jsonify(error="Missing data in request"), 400

        if not isinstance(level, int) or not (0 <= level < 4):
            return jsonify(error="Invalid level value"), 400

        query_result = generate_query_and_get_response(level, structure, cause)
        
        return jsonify(result=query_result.text)
    except Exception as e:
        return jsonify(error=str(e)), 500

def generate_query_and_get_response(level, structure, cause):
    damage_levels = ["no damage", "minor damage", "major damage", "totally destroyed"]
    damage_description = damage_levels[level]
    

    id = chatbot.new_conversation()
    chatbot.change_conversation(id)
    query = f'Give me a detailed Damage Assessment on the situation where {structure} had {damage_description} by {cause} without date and location context. Only give the main report dont write any explaination above the report.'
    # Replace the line below with your chatbot query logic
    print(query)
    query_result = chatbot.query(query)
    print(query_result)
    return query_result


#######
print("works")

if __name__ == '__main__':
    app.run(debug=True)