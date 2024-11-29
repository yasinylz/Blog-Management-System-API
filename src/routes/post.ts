import express from 'express';
import { createPost,getPosts,getPostById,updatePost,deletePosts} from '../controllers/postControllers';
import upload from '../middlewares/fileUpload';
import { checkOwnership } from '../middlewares/checkOwnership';
const  router=express.Router();
import { authenticateUser ,authorizeRoles} from '../middlewares/authenticateUser';


// Yeni endpointler
router.post('/add', authorizeRoles(["author", "admin"]),authenticateUser,upload.single('file'), createPost);
router.get('/',authorizeRoles(["author", "admin"]),authenticateUser,getPosts);
router.get('/:id', authorizeRoles(["author", "admin"]),authenticateUser,getPostById); // ID'ye göre getir
router.put('/update/:id',authorizeRoles(["author", "admin"]),authenticateUser,checkOwnership, upload.single('file'), updatePost); // Güncelle
router.delete('/delete/:id', authorizeRoles(["author", "admin"]),authenticateUser,checkOwnership,deletePosts); // Sil


export default router