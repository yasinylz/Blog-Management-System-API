import { Request, Response } from 'express';
import User from '../models/User';
import Post from '../models/Post';

// Kullanıcı bilgilerini ve postlarını getir
export const getUserInfoAndPosts = async (req: any, res: Response):Promise<any> => {
  try {
    // JWT'den gelen userId'yi al
    const { userId } = req.user;

    // Kullanıcı bilgilerini al
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
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
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};
