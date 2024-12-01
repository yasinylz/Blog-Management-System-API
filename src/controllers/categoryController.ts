import { NextFunction, Request,Response } from "express"
import { Category } from "../models/Category";
import Post from "../models/Post";
import { AppError } from "../utils/appError";

export const createCategory= async(req:Request,res:Response,next:NextFunction)=> {
    const  {name}=req.body;
    try {
        const category=await Category.findOne({name:name});
        if(category){
           
    return next(new AppError('BU Kategori zaten  mevcut', 401));

        }
        const newCategory=new Category({name});
        await newCategory.save();
        res.json({newCategory:newCategory})
    } catch (error) {
       
    return next(new AppError('Bir  Hata  Oluştu', 400));

    }
}
export const  viewCategory = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const  category=await Category.find({})
        res.json({category})
    } catch (error) {
        return next(new AppError('Bir  Hata  Oluştu', 400));

        
    }
}

export const  editCategory = async(req:Request,res:Response,next:NextFunction)=>{
const id=req.params;
const  name=req.body
try {
    const  category=await Category.findById(id)
    if(!category){
    return next(new AppError('BU Kategori zaten  mevcut değil', 401));


    }
    await Category.findByIdAndUpdate(id,{name},{new:true,runValidators:true})
} catch (error) {
    return next(new AppError('Bir  Hata  Oluştu', 400));

    
}


}
export const  deleeteCategory=async(req:Request,res:Response,next:NextFunction)=>{ 
    const id=req.params;
    try {
        const  category=await Category.findById(id)
        if(!category){
            return next(new AppError('BU Kategori zaten  mevcut değil', 401));

        }
        await Category.findByIdAndDelete(id)
        res.json({mag:"Kategori silindi"})
    } catch (error) {
        return next(new AppError('Bir  Hata  Oluştu', 400));

        
    }
}
export const  filterCategories=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
const  categoryNames:string[]=req.body.categoryNames;


try {
    const  categories=await Category.find({name:{$in:categoryNames}})
    if(!categories){
        
        return next(new AppError('Bir veya daha fazla kategori bulunamadı', 401));

    }
    const categoryId = categories.map(category => category.id);
    const  post=await Post.findOne({category:{$in:categoryId}}).populate('category');
    if(!post){
        return next(new AppError('Bir veya daha fazla post bulunamadı', 401));

    }
    res.json({post})
   
} catch (error) {
    return next(new AppError('Bir  Hata  Oluştu', 400));

    
}
}