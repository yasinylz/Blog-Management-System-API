import { Response,Request,NextFunction } from "express";
import Post from "../models/Post";
export interface CustomRequest extends Request {
    user?: { id: string; email: string }; // Kullanıcı bilgisi burada özelleştirildi
  }
export  const  checkOwnership=async(req:CustomRequest,res:Response,next:NextFunction)=>{
try {
    const postId=req.params.id;
    const userId=req.user?.id;
    const  post=await Post.findById(postId);
    if (!post) {
         res.status(404).json({ message: "Post not found" });return
    }
    if(post.author.toString()!==userId) {
        res.status(403).json({ message: "You are not authorized to perform this action" });
        return;
    }
    next();
} catch (error) {
    console.error("Error in ownership check:", error);
    res.status(500).json({ message: "Internal server error" });
}
}