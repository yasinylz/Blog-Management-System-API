import { NextFunction, Request, Response } from 'express';
import Role from '../models/Role';
import { AppError } from "../utils/appError";


// Tüm Rolleri Görüntüle
export const getAllRoles = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (error) {
  
    return next(new AppError('An error occurred', 500));
    
  }
};

// Rol Ekle
export const createRole = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
  const { name } = req.body;

  try {
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
     
    return next(new AppError('Role already exists', 400));

    }

    const newRole = new Role({ name });
    await newRole.save();
    res.status(201).json({ message: 'Role created successfully', role: newRole });
  } catch (error) {
    
    return next(new AppError('An error occurred', 500));

  }
};

// Rol Güncelle
export const updateRole = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const role = await Role.findById(id);
    if (!role) {
    
    return next(new AppError('Role not found', 404));

    }

    role.name = name;
    await role.save();
    res.status(200).json({ message: 'Role updated successfully', role });
  } catch (error) {
   
    return next(new AppError('An error occurred', 500));

  }
};

// Rol Sil
export const deleteRole = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
  const { id } = req.params;

  try {
    const role = await Role.findById(id);
    if (!role) {
      return next(new AppError('Role not found', 404));

    }

    await Role.findByIdAndDelete(id);
    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    return next(new AppError('An error occurred', 500));

  }
};
