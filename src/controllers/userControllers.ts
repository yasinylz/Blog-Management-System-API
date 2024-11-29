import  {Request, Response} from 'express'
import bcrypt from 'bcryptjs';
import User from '../models/User'
import Role from '../models/Role';
import { generateToken } from '../utils/jwtUtils';



export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, ...options } = req.body;
  try {
    // Kullanıcı zaten var mı diye kontrol et
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
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
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

  export interface CustomRequest extends Request {
    user?: { id: string; email: string }; // Kullanıcı bilgisi burada özelleştirildi
  }
  export const loginUser = async (req: CustomRequest, res: Response) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email }).populate('roles');  // Kullanıcıyı email ile bul ve rollerini doldur
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      const isMatch = await bcrypt.compare(password, user.password); // Şifre kontrolü
      if (!isMatch) {
        res.status(400).json({ message: 'Invalid password' });
        return;
      }
  
      // `roles` kontrolü ve dönüştürme
      if (!user.roles || !Array.isArray(user.roles)) {
        res.status(500).json({ message: 'User roles are not defined or invalid' });
        return;
      }
  
      console.log('User roles:', user.roles);  // Roller doğru geliyor mu kontrol et
  
      const roles = user.roles.map((role: any) => role.name); // Role ismini döndür (veya toString kullanabilirsin)
      console.log('Roles extracted from user:', roles); // Roller doğru şekilde alınıyor mu kontrol et
  
      // Token oluştur
      const token = generateToken({ id: user.id, email: user.email, roles });
      console.log('Generated token:', token);  // Token doğru oluşturuluyor mu kontrol et
  
      res.json({ message: 'User logged in', token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  
  


export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Kullanıcıları ve rollerini almak için populate kullan
    const users = await User.find().populate('roles', 'name -_id').select('-password');  // roles alanını 'name' ile popüle et, _id'yi hariç tut

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const getUserById = async (req: Request, res: Response): Promise<void>  => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).populate('roles'); // "roles" alanını doldur
    if (!user) {
       res.status(404).json({ message: 'User not found' });return
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const body = req.body;
  
    if (!id) {
      res.status(400).json({ message: 'User ID is required' });
      return;
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
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      // Güncellenmiş kullanıcıyı döndür
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error); // Hata loglama
      res.status(500).json({ message: 'An error occurred while updating user', error });
    }
  };
export const deleteUser=async(req:Request,res:Response):Promise<void>=>{
    const {id}=req.params;
    try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
       res.status(404).json({ message: 'User not found' });
       return
    }
    res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error });
    }
}