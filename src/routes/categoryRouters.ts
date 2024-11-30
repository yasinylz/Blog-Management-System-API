import express from 'express';
import {
  createCategory,
  viewCategory,
  editCategory,
  deleeteCategory,filterCategories
} from '../controllers/categoryController';
import { authenticateUser, authorizeRoles } from "../middlewares/authenticateUser";


const router = express.Router();

// Tüm rolleri listele
router.get('/', authenticateUser,authorizeRoles([ "admin"]),viewCategory);

// Yeni bir rol oluştur
router.post('/',authenticateUser,authorizeRoles([ "admin"]), createCategory);

// Var olan bir rolü güncelle
router.put('/:id',authenticateUser,authorizeRoles([ "admin"]), editCategory);

// Bir rolü sil
router.delete('/:id',authenticateUser,authorizeRoles([ "admin"]), deleeteCategory);

router.get('/filters',authenticateUser,authorizeRoles(["author", "admin"]),filterCategories)

export default router;
