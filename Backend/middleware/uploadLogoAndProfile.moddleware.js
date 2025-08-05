import multer from 'multer';
import cloudinary from '../utils/cloudinary/cloudinary.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

export const getCloudinaryUploader = (folderName) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
      folder: folderName,
      allowed_formats: ['jpg', 'png', 'jpeg'],
      transformation: [{ width: 500, height: 500, crop: 'limit' }],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}` // Optional
    })
  });

  const multerInstance = multer({ storage });

  return {
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
};
