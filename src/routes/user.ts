// user.ts
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
import { authenticateUser } from '../middlewares/authenticateUser';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', authenticateUser,getAllUsers);
router.get('/:id', authenticateUser,getUserById);
router.put('/:id', authenticateUser,updateUser);
router.delete('/:id',authenticateUser, deleteUser);
export default router;
