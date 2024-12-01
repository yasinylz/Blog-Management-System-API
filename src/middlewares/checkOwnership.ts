import { Response,Request,NextFunction } from "express";
import Post from "../models/Post";
import { AppError } from "../utils/appError";

export interface CustomRequest extends Request {
    user?: { id: string; email: string }; // Kullanıcı bilgisi burada özelleştirildi
  }
export  const  checkOwnership=async(req:CustomRequest,res:Response,next:NextFunction)=>{
try {
    const postId=req.params.id;
    const userId=req.user?.id;
    const  post=await Post.findById(postId);
    if (!post) {
         
    return next(new AppError('Post not found', 404));

    }
    if(post.author.toString()!==userId) {
       
    return next(new AppError('You are not authorized to perform this action', 403));

    }
    next();
} catch (error) {
    console.error("Error in ownership check:", error);
  
    return next(new AppError('Internal server error', 500));

    
}}