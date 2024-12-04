import  {NextFunction, Request, Response} from 'express'
import bcrypt from 'bcryptjs';
import User from '../models/User'
import Role from '../models/Role';
import { generateToken } from '../utils/jwtUtils';
import { AppError } from "../utils/appError";




export const registerUser = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
  const { name, email, password, ...options } = req.body;
  try {
    // Kullanıcı zaten var mı diye kontrol et
    const existingUser = await User.findOne({ email });
    if (existingUser) {
    
      return next(new AppError('User already exists', 400));

    }

    // Şifreyi hash'le
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // "author" rolünü bul
    let defaultRole = await Role.findOne({ name: 'author' });
    if (!defaultRole) {
      // Eğer "author" rolü yoksa yeni bir rol oluştur
      defaultRole = new Role({ name: 'author' });
      await defaultRole.save();
    }

    // Yeni kullanıcı oluştur
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      roles: [defaultRole._id], // Kullanıcıya default rol ID'sini ekle
      ...options,
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error(':', error);
   
    return next(new AppError('Error registering user', 400));

  }
};

  export interface CustomRequest extends Request {
    user?: { id: string; email: string }; // Kullanıcı bilgisi burada özelleştirildi
  }
  export const loginUser = async (req: CustomRequest, res: Response,next:NextFunction) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email }).populate('roles');  // Kullanıcıyı email ile bul ve rollerini doldur
      if (!user) {
      
    return next(new AppError('User not found', 400));

        
      }
  
      const isMatch = await bcrypt.compare(password, user.password); // Şifre kontrolü
      if (!isMatch) {
       
    return next(new AppError('Invalid password', 400));

      }
  
      // `roles` kontrolü ve dönüştürme
      if (!user.roles || !Array.isArray(user.roles)) {
      
    return next(new AppError('User roles are not defined or invalid', 400));

      }
  
      console.log('User roles:', user.roles);  // Roller doğru geliyor mu kontrol et
  
      const roles = user.roles.map((role: any) => role.name); // Role ismini döndür (veya toString kullanabilirsin)
      console.log('Roles extracted from user:', roles); // Roller doğru şekilde alınıyor mu kontrol et
  
      // Token oluştur
      const token = generateToken({ id: user.id, email: user.email, roles });
      console.log('Generated token:', token);  // Token doğru oluşturuluyor mu kontrol et
  
      res.json({ message: 'User logged in', token });
    } catch (error) {
      return next(new AppError('internel server  ', 500));

    }
  };
  
  
  


export const getAllUsers = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
  const  {limit=10,page=1}=req.query;
  try {
    // Kullanıcıları ve rollerini almak için populate kullan
    const users = await User.find().populate('roles', 'name -_id').select('-password').limit(Number(limit)).skip((Number(page)-1)*Number(limit)) // roles alanını 'name' ile popüle et, _id'yi hariç tut

    res.status(200).json(users);
  } catch (error) {
    return next(new AppError('internel server  ', 500));

  }
};
export const getUserById = async (req: Request, res: Response,next:NextFunction): Promise<void>  => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).populate('roles'); // "roles" alanını doldur
    if (!user) {
      return next(new AppError('User not  found', 404));

    }

    res.status(200).json(user);
  } catch (error) {
    return next(new AppError('internel server  ', 500));

  }
};
export const updateUser = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    const { id } = req.params;
    const body = req.body;
  
    if (!id) {
      return next(new AppError('User  ID  is required', 404));

    }
  
    try {
      // Eğer parola varsa hash'le
      if (body.password) {
        body.password = await bcrypt.hash(body.password, 10);
      }
  
      // Kullanıcıyı güncelle
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { ...body },
        { new: true, runValidators: true } // `runValidators` şema doğrulamaları uygular.
      );
  
      // Kullanıcı bulunamazsa
      if (!updatedUser) {
        return next(new AppError('User not  found', 404));

      }
  
      // Güncellenmiş kullanıcıyı döndür
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error); // Hata loglama
      return next(new AppError('internel server  ', 500));

    }
  };
export const deleteUser=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    const {id}=req.params;
    try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return next(new AppError('User not  found', 404));

    }
    res.status(200).json({ message: 'User deleted' });
    } catch (error) {
      return next(new AppError('internel server  ', 500));

    }
}