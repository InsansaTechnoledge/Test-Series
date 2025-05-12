import multer from "multer";
import cloudinary from "../utils/cloudinary/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";


const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'Profile_pics',
      allowed_formats: ['jpg', 'png', 'jpeg'],
      transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
  });
  
  const multerInstance = multer({ storage });
  
  export const upload = {
    single: (fieldName) => {
      return (req, res, next) => {
        multerInstance.single(fieldName)(req, res, (err) => {
          if (err) {
            console.error('📦 Multer error:', err);
            return res.status(500).json({ error: 'Upload failed', details: err.message });
          }
          next();
        });
      };
    }
  };
  