import express from 'express';
import { getUserInfoAndPosts } from '../controllers/UserController'; // fonksiyon import ediliyor
import { authenticateUser ,authorizeRoles} from '../middlewares/authenticateUser'; // JWT doğrulama için middleware

const router = express.Router();

// Kullanıcı bilgilerini ve postlarını getir
router.get('/user-info', authenticateUser,authorizeRoles(["author", "admin"]), getUserInfoAndPosts);

export default router;
