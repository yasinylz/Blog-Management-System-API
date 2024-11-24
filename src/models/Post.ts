import mongoose,{Schema,Document} from "mongoose";
interface IPost extends Document{
    title:string,
    content:string,
    image?:string,
    video?:string
    author:string,
    createdAt:Date,
    updatedAt:Date
}

const postSchema: Schema = new Schema({
    title:{type:String, required:true},
    content:{type:String, required:true},
    image:{type:String},
    video:{type:String},
    author:{type:String, required:true},
   
},{timestamps:true});

const Post=mongoose.model<IPost>('Post',postSchema)
export default Post;
