import React, { useState } from 'react';

const Fil = () => {
  const [files, setFiles] = useState([]);
  const [showOutput, setShowOutput] = useState(false);
  const [responseMsg, setresponseMsg] = useState(null);
  const [Level, setLevel] = useState(null);
  const [Architecture, setArchitecture] = useState(null);
  const [Cause, SetCause] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);

    // Display image previews
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    setFiles(selectedFiles);
  };
  const wrappedTextStyle = {
    whiteSpace: 'pre-wrap',
    overflow: 'auto', // or 'hidden' or any other desired value
    maxWidth: '80vw', // Adjust the maxWidth according to your layout
    border: '1px solid #ccc', // Optional: Add a border for better visibility
    padding: '10px', // Optional: Add padding for better appearance
  };
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const formData = new FormData();

      // Append each file to the FormData
      files.forEach((file, index) => {
        formData.append(`file`, file);
      });

      // Your API endpoint for handling file upload
      const apiUrl = 'http://127.0.0.1:5000/sat'; // Replace with your actual API endpoint
      console.log(formData)
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      // Handle the response as needed
      const responseData = await response.json();
      console.log('Response:', responseData);
      const level = responseData?.predicted_threat_level;
      setLevel(level);
      
      const res = await fetch('http://127.0.0.1:5000/damageAssessment', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // Add any additional headers if required
  },
  body: JSON.stringify({ level: Level, structure: Architecture, cause: Cause}),
});

if (!res.ok) {
  throw new Error(`HTTP error! Status: ${res.status}`);
}

      console.log(res)
      const data = await res.json();
console.log('Data received:', data);
setresponseMsg(data.result);
setShowOutput(true);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setLoading(false);
    }
  };

  return (<div className="w-full min-h-[500px] flex align-baseline">
    <div className="p-8 mx-auto bg-gray-200 rounded-md min-h-[200px] my-auto md:max-w-[80%]">
    {loading && (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.8)',
        zIndex: '1000',
      }}
    >
      <div
        style={{
          width: '200px', // Adjust the width if needed
          padding: '10px',
          background: 'rgba(255, 255, 255, 1)', // Adjust the alpha value for the background
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <p className="small p-2 mb-1 rounded-3 bg-gray-500 text-center">
          Loading...
        </p>
      </div>
    </div>
  )}
      {!showOutput ? (
        <form onSubmit={(e) => handleSubmit(e)}>
          {imagePreviews.length > 0 && (
              <div className="mb-4 flex flex-wrap">
                {imagePreviews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index}`}
                    className="mr-2 mb-2 border border-gray-400 rounded-md"
                    style={{ maxWidth: '300px', maxHeight: '300px' }}
                  />
                ))}
              </div>
            )}
          <label className="block mb-4 text-lg font-bold">Choose Satellite Image:</label>
          <input
            type="file"
            onChange={handleFileChange}
            multiple
            required
            className="mb-4 p-2 border border-gray-400 rounded-md block"
          />
          
          <select name="Architecture" id="Architecture" className="block mx-auto w-full my-2 h-10 md:my-4 p-2 border border-gray-400 rounded-md" onChange={e => setArchitecture(e.target.value)}>
          <option value="none">choose Architecture type</option>
            <option value="bridge">bridge</option>
            <option value="building">building</option>
            <option value="city">city</option>
            <option value="others">others</option>
          </select>
          <select name="cause" id="cause" className="block mx-auto w-full my-2 h-10 md:my-4 p-2 border border-gray-400 rounded-md" onChange={e => SetCause(e.target.value)}>
            <option value="none">choose Disaster type</option>
            <option value="Tornado">Tornado</option>
            <option value="Floods">Floods</option>
            <option value="EarthQuakes">EarthQuakes</option>
            <option value="Tsunami">Tsunami</option>
            <option value="others">others</option>
          </select>
          <button className="bg-blue-500 text-white p-2 rounded-md" type='submit'>
            Submit
          </button>
        </form>
        
      ) : (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Output Section:</h2>
          <div className="bg-white p-4 rounded-md shadow-md mb-4">
            {/* Your first output section */}
            {responseMsg && (
    <div style={wrappedTextStyle}
      className="text-gray-700 md:text-2xl"
    >{responseMsg}</div>
  )}
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default Fil;
