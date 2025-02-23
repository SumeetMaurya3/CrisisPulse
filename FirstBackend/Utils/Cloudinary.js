import {v2 as cloudinary} from 'cloudinary';
import multer from 'multer';
const upload = multer({dest : './Uploads'})
import fs from 'fs'
          
cloudinary.config({ 
  cloud_name: 'dvwxhfqn4', 
  api_key: '288927926433832', 
  api_secret: 'O2MMcFTVU7uPzZMEZwc4ZV0sNO8' 
});


const uploadOnCloudinary = async (filePath) =>{
    try {
        if (!filePath) {
            return null
        }
        const response = await cloudinary.uploader.upload(filePath,{resource_type : 'auto'})
        return response
    } catch (error) {
        fs.unlinkSync(filePath)
        return null
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './Uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
const multerUpload = multer({ storage })
export {uploadOnCloudinary , multerUpload }
