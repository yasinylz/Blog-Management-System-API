import { Request,Response } from "express"
import { Category } from "../models/Category";
import Post from "../models/Post";
export const createCategory= async(req:Request,res:Response)=> {
    const  {name}=req.body;
    try {
        const category=await Category.findOne({name:name});
        if(category){
            res.json({mag:"BU Kategori zaten  mevcut"})
        }
        const newCategory=new Category({name});
        await newCategory.save();
        res.json({newCategory:newCategory})
    } catch (error) {
        res.json({error});
    }
}
export const  viewCategory = async(req:Request,res:Response)=>{
    try {
        const  category=await Category.find({})
        res.json({category})
    } catch (error) {
        res.json({error});
        
    }
}

export const  editCategory = async(req:Request,res:Response)=>{
const id=req.params;
const  name=req.body
try {
    const  category=await Category.findById(id)
    if(!category){
        res.json({mag:"BU Kategori zaten  mevcut değil"})

    }
    await Category.findByIdAndUpdate(id,{name},{new:true,runValidators:true})
} catch (error) {
    res.json({error});
    
}


}
export const  deleeteCategory=async(req:Request,res:Response)=>{ 
    const id=req.params;
    try {
        const  category=await Category.findById(id)
        if(!category){
            res.json({mag:"BU Kategori zaten  mevcut değil"})
        }
        await Category.findByIdAndDelete(id)
        res.json({mag:"Kategori silindi"})
    } catch (error) {
        res.json({error});
        
    }
}
export const  filterCategories=async(req:Request,res:Response,):Promise<void>=>{
const  categoryNames:string[]=req.body.categoryNames;


try {
    const  categories=await Category.find({name:{$in:categoryNames}})
    if(!categories){
        res.json({mag:"Bir veya daha fazla kategori bulunamadı"})
    }
    const categoryId = categories.map(category => category.id);
    const  post=await Post.findOne({category:{$in:categoryId}}).populate('category');
    if(!post){
        res.json({mag:"Bir veya daha fazla post bulunamadı"})
    }
    res.json({post})
   
} catch (error) {
    res.json({error});
    
}
}