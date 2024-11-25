import express from 'express';
import { createPost,getPosts,getPostById,updatePost,deletePosts} from '../controllers/postControllers';
import upload from '../middlewares/fileUpload';
import { checkOwnership } from '../middlewares/checkOwnership';
const  router=express.Router();
import { authenticateUser } from '../middlewares/authenticateUser';

// Yeni endpointler
router.post('/add', authenticateUser,upload.single('file'), createPost);
router.get('/', authenticateUser,getPosts);
router.get('/:id', authenticateUser,getPostById); // ID'ye göre getir
router.put('/update/:id',authenticateUser,checkOwnership, upload.single('file'), updatePost); // Güncelle
router.delete('/delete/:id', authenticateUser,checkOwnership,deletePosts); // Sil


export default router