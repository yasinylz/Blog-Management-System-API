import { Router } from 'express';
const router = Router();
import { 
  registerUser, 
  loginUser, 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} from '../controllers/userControllers';
import { authenticateUser, authorizeRoles } from '../middlewares/authenticateUser';

router.post('/register',registerUser);
router.post('/login', loginUser);
router.get('/',  authenticateUser,authorizeRoles(["author", "admin"]),getAllUsers);  // Tüm kullanıcıları listeleme
router.get('/:id',  authenticateUser,authorizeRoles(["author", "admin"]), getUserById);  // "user" ve "admin" yetkisi ile kullanıcı bilgisi
router.put('/:id',  authenticateUser,authorizeRoles(["author", "admin"]), updateUser);  // "user" ve "admin" yetkisi ile kullanıcı bilgisi güncelleme
router.delete('/:id', authenticateUser, authorizeRoles(["admin"]), deleteUser);  // Yalnızca "admin" yetkisi ile kullanıcı silme

export default router;
