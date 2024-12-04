import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import Post from '../models/Post';
import { AppError } from "../utils/appError";


// Kullanıcı bilgilerini ve postlarını getir
export const getUserInfoAndPosts = async (req: any, res: Response,next:NextFunction):Promise<any> => {
  const {limit=10,page=1}=req.query;
  try {
    // JWT'den gelen userId'yi al
    const { userId } = req.user;
  

    // Kullanıcı bilgilerini al
    const user = await User.findById(userId).limit(Number(limit)).skip((Number(page)-1)*Number(limit))
    if (!user) {
      return next(new AppError('Kullanıcı  bulunamadı', 404));

    }

    // Kullanıcının yaptığı postları al
    const posts = await Post.find({ author: userId }).populate('category', 'name');

    // Kullanıcı bilgileri ve postlar ile cevap dön
    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
      posts: posts,
    });
  } catch (error) {
    return next(new AppError('Bir  hata  oluştu', 400));

  }
};
