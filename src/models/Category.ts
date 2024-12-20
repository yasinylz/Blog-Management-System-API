import{Schema,Document,model} from 'mongoose'
//category  interface
interface ICategory extends Document{
    name: string;

}

const  categorySchema=new  Schema({
    name:{type:String, required:true, unique:true}
},{timestamps:true})
categorySchema.index({ name: 1 }, { unique: true });

export const  Category=model<ICategory>('Category',categorySchema)



