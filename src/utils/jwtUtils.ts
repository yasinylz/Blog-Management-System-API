import jwt from 'jsonwebtoken';
import config from '../config';

export const generateToken = (payload: { id: string; email: string }) => {
  return jwt.sign(payload, config.JWT_SECRETKEY, { expiresIn: config.JWT_EXPIRE_IN });
};

export const verifyToken = (token: string): { id: string; email: string } => {
  try {
    return jwt.verify(token, config.JWT_SECRETKEY) as { id: string; email: string }; // Token doğrulama ve tip çıkarımı
  } catch (error) {
    throw new Error('Invalid token');
  }
};
