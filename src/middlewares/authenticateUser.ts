import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtUtils";
import Role from "../models/Role";
import { AppError } from "../utils/appError";


interface User {
  id: string;
  email: string;
  roles?: string[];  // Kullanıcı rollerini opsiyonel yaptık
}

interface CustomRequest extends Request {
  user?: User;  // Kullanıcı bilgisi isteğe bağlı
}
export const authenticateUser = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
     res.status(401).json({ message: "Authorization token is required" });return
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;  // Token doğrulandı, kullanıcıyı ekliyoruz
    next();
  } catch (error) {
     next(new AppError('No token provided', 401));
  }
};


// Kullanıcı rolleri ile yetkilendirme middleware'i

export const authorizeRoles = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Kullanıcının rollerini req.user'den alıyoruz
      const userRoles = (req as any).user?.roles;
      console.log("User Roles from Request:", userRoles);  // Kullanıcının rollerini yazdır

      // Eğer userRoles null veya undefined ise, 403 döndürüyoruz
      if (!userRoles || userRoles.length === 0) {
        console.log("No roles found for the user");  // Hata durumunda yazdırılacak mesaj
        res.status(403).json({ message: 'No roles found for this user' });
        return;
      }

      // Veritabanındaki rollerle eşleşecek şekilde döngüye giriyoruz
      const roleInDb = await Role.find({ name: { $in: roles } });
      console.log("Roles found in Database:", roleInDb);  // Veritabanından gelen rollerin tamamını yazdır

      if (roleInDb.length === 0) {
        console.log("No roles found in the database for the given role names");  // Veritabanında roller bulunamadığında yazdırılacak mesaj
        res.status(403).json({ message: 'No roles found in the database' });
        return;
      }

      // Veritabanındaki rollerin isimlerini alıyoruz
      const roleInDbNames = roleInDb.map((role: any) => role.name);
      console.log("Role Names in Database:", roleInDbNames);  // Veritabanındaki rollerin isimlerini yazdır

      // Eğer kullanıcının sahip olduğu roller arasında veritabanındaki rollerle eşleşen bir isim varsa, işlem devam eder
      const roleMatch = userRoles.some((role: string) => roleInDbNames.includes(role));
      console.log("Role Match Found:", roleMatch);  // Roller arasında eşleşme var mı yazdır

      // Eğer eşleşme varsa, next() çağırılır
      if (roleMatch) {
        console.log("Role match found, proceeding to next middleware");  // Eşleşme varsa bir sonraki middleware'e geçilir
        return next();
      }

      // Eğer eşleşme bulunamazsa, 403 hatası veriyoruz
      console.log("No matching role found, Unauthorized access");  // Eşleşme yoksa yetkisiz erişim mesajı
      res.status(403).json({ message: 'Unauthorized: User does not have the required role' });

    } catch (error) {
     next(new AppError('Error in authorizeRoles', 401));

     
    }
  };
};
