import { NextFunction, Request, Response } from 'express';
import User from '../models/User'; // Kullanıcı modelini import edin
import Role from '../models/Role'; // Role modelini import edin
import { AppError } from "../utils/appError";


export const addRoleToUser = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
  const { userId, role } = req.body; // Role burada rol ID'si

  try {
    // Kullanıcıyı bul
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Rolün Role modelinde olup olmadığını kontrol et
    const existingRole = await Role.findById({name: { $in: role}} );
    if (!existingRole) {
      return next(new AppError('Role does not exist in the system', 404));
    }

    // Kullanıcının zaten bu role sahip olup olmadığını kontrol et
    if (user.roles.includes(role)) {
     
      return next(new AppError('User already has this role', 404));

    }

    // Rolü kullanıcıya ekle
    user.roles.push(role.id);

    // Değişiklikleri kaydet
    await user.save();

    res.status(200).json({ message: "Role successfully added to user", user });
  } catch (error) {
     next(new AppError('Bir hata  oluştu', 404));
  }
};


// Kullanıcının rollerini görüntüleme
export const getUserRoles = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
  const { userId } = req.params;
  const  {limit=10,page=1}=req.query;

  try {
    const user = await User.findById(userId).limit(Number(limit)).skip((Number(page)-1)*Number(limit))
    if (!user) {
     
      return next(new AppError('Kullanıcı bulunamadı', 404));

    }

    res.status(200).json({ roles: user.roles });
  } catch (error) {
    next(new AppError('Bir hata  oluştu', 404));

  }
};

//not:redis ve indexleme  yapılacak,dokümantasyon ve test  işlemleri de  yapıalcak  ,sonra da  mikroservis  mimarilerine  bakılacak  
