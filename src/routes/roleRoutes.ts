import express from 'express';
import {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
} from '../controllers/roleController';
import { authenticateUser, authorizeRoles } from "../middlewares/authenticateUser";


const router = express.Router();

// Tüm rolleri listele
router.get('/', authenticateUser,authorizeRoles([ "admin"]),getAllRoles);

// Yeni bir rol oluştur
router.post('/',authenticateUser,authorizeRoles([ "admin"]), createRole);

// Var olan bir rolü güncelle
router.put('/:id',authenticateUser,authorizeRoles([ "admin"]), updateRole);

// Bir rolü sil
router.delete('/:id',authenticateUser,authorizeRoles([ "admin"]), deleteRole);

export default router;
