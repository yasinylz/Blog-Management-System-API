import { Request, Response } from 'express';
import Role from '../models/Role';

// Tüm Rolleri Görüntüle
export const getAllRoles = async (req: Request, res: Response): Promise<void> => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
};

// Rol Ekle
export const createRole = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;

  try {
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      res.status(400).json({ message: 'Role already exists' });
      return;
    }

    const newRole = new Role({ name });
    await newRole.save();
    res.status(201).json({ message: 'Role created successfully', role: newRole });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
};

// Rol Güncelle
export const updateRole = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const role = await Role.findById(id);
    if (!role) {
      res.status(404).json({ message: 'Role not found' });
      return;
    }

    role.name = name;
    await role.save();
    res.status(200).json({ message: 'Role updated successfully', role });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
};

// Rol Sil
export const deleteRole = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const role = await Role.findById(id);
    if (!role) {
      res.status(404).json({ message: 'Role not found' });
      return;
    }

    await Role.findByIdAndDelete(id);
    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
};
