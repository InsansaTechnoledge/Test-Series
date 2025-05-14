// middleware/uploadExcel.js
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `students_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.xlsx') {
    return cb(new Error('Only .xlsx files are allowed'), false);
  }
  cb(null, true);
};

export const uploadExcel = multer({ storage, fileFilter });
