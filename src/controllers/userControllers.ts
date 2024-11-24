import  {Request, Response} from 'express'
import bcrypt from 'bcryptjs';
import User from '../models/User'
import { generateToken } from '../utils/jwtUtils';

export const registerUser = async (req: Request, res: Response) => {  
    const { name, email, password } = req.body;
    try {
        const existingUser=await User.findOne({ email });
        if(existingUser){
            res.status(400).json({ message:"User already exists"})
            return
        }
        const  salt= await bcrypt.genSalt(10);
        const  hashedPassword = await bcrypt.hash(password,salt);
        const  newUser=await User.create({ name,email,password: hashedPassword})
        res.status(201).json({ message: 'User registered', user: newUser });
    } catch (error) {
        res.status(500).json({ error });
    }
  }

  export interface CustomRequest extends Request {
    user?: { id: string; email: string }; // Kullanıcı bilgisi burada özelleştirildi
  }
  export const loginUser = async (req: CustomRequest, res: Response) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email }); // Kullanıcıyı email ile bul
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      const isMatch = await bcrypt.compare(password, user.password); // Şifre kontrolü
      if (!isMatch) {
        res.status(400).json({ message: 'Invalid password' });
        return;
      }
  
      const token = generateToken({ id: user.id, email: user.email }); // Kullanıcı bilgileriyle token oluştur
      res.json({ message: 'User logged in', token });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
      console.log(error);
    }
  };

export const getAllUsers=async(req:Request,res:Response):Promise<void>=>{
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    
    } catch (error) {
        res.status(500).json({ error });
    }
}
export  const getUserById=async(req:Request,res:Response):Promise<void>=>{
const  {id}=req.params;
try {
    const  user = await User.findById(id).select('-password');
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return 
    }
    res.status(200).json(user);
} catch (error) {
    res.status(500).json({ error });
}

}
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