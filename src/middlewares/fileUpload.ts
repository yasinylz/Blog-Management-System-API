import multer from 'multer';
import path from 'path';
import { Request, Response } from 'express';
import { AppError } from "../utils/appError";


const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, next: Function) => {
    const serverURL = 'http://localhost:5000'; 
    if (file.mimetype.startsWith('image/')) {
      next(null, path.join(__dirname, '../uploads/images')); // Resimler için 'uploads/images'
    } else if (file.mimetype.startsWith('video/')) {
      next(null, path.join(__dirname, '../uploads/videos')); // Videolar için 'uploads/videos'
    } else {
     
      return next(new AppError('Desteklenmeyen dosya türü!', 401));

    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeFileName = file.originalname.replace(/\s+/g, '_').replace(/\.[^/.]+$/, '');
    cb(null, Date.now() + '_' + safeFileName + ext); // Dosya adı oluşturma
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, next: Function) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4'];
  if (allowedTypes.includes(file.mimetype)) {
    next(null, true);
  } else {
    
    return next(new AppError('Desteklenmeyen dosya türü!', 401));

  }
};

const upload = multer({ storage, fileFilter });

export default upload;
