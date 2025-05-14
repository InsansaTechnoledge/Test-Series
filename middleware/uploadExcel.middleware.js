import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join('uploads');

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);

        if (file.fieldname === 'questions') {
            cb(null, `${Date.now()}-${file.fieldname}${ext}`);
        }
        else if (file.fieldname === 'studentExcel') {
            cb(null, `students_${Date.now()}${ext}`);
        }
        else {
            const customName = req.body?.customFileName?.trim().replace(/\s+/g, '_') || 'file';
            cb(null, `${customName}-${Date.now()}${ext}`);
        }
    }

});

export const fileUpload = multer({ storage });
