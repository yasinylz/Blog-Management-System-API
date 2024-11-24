import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtUtils';

// CustomRequest arayüzü
export interface CustomRequest extends Request {
  user?: { id: string; email: string }; // Kullanıcı bilgisi burada özelleştirildi
}

export const authenticateUser = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization token is required' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token); // Token doğrulama
    req.user = decoded; // Kullanıcı bilgisi req.user olarak ekleniyor
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
