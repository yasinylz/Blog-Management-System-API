import { Request, Response } from 'express';
import User from '../models/User'; // Kullanıcı modelini import edin
import Role from '../models/Role'; // Role modelini import edin

export const addRoleToUser = async (req: Request, res: Response): Promise<void> => {
  const { userId, role } = req.body; // Role burada rol ID'si

  try {
    // Kullanıcıyı bul
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Rolün Role modelinde olup olmadığını kontrol et
    const existingRole = await Role.findById({name: { $in: role}} );
    if (!existingRole) {
      res.status(400).json({ message: "Role does not exist in the system" });
      return;
    }

    // Kullanıcının zaten bu role sahip olup olmadığını kontrol et
    if (user.roles.includes(role)) {
      res.status(400).json({ message: "User already has this role" });
      return;
    }

    // Rolü kullanıcıya ekle
    user.roles.push(role.id);

    // Değişiklikleri kaydet
    await user.save();

    res.status(200).json({ message: "Role successfully added to user", user });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};


// Kullanıcının rollerini görüntüleme
export const getUserRoles = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "Kullanıcı bulunamadı" });
      return; // Return after sending the response
    }

    res.status(200).json({ roles: user.roles });
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu", error });
  }
};
