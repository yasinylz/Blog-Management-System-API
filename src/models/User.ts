import mongoose,{Schema,Document,Model} from "mongoose";
import bcrypt from 'bcryptjs';
export interface IUser extends Document{
    name:string,
    email:string,
    password:string,
    isActive:boolean,
    phone:string,
    address:{
    street: string;
    city: string;
    postalCode: string;
    country: string;
    },
    resetToken?:string
}

const  UserSchema = new Schema<IUser>({
name:{type:String, required:true,trim:true},
email:{type:String, required:true,lowercase:true,unique:true},
password:{type:String, required:true, minlength:8},
isActive: {
    type: Boolean,
    default: true,  // Varsayılan olarak true
  },
  phone: {
    type: String,
    default: '',  // Varsayılan olarak boş string
  },
  address: {
    street: {
      type: String,
      default: 'Unknown',  // Varsayılan olarak "Unknown"
    },
    city: {
      type: String,
      default: 'Unknown',  // Varsayılan olarak "Unknown"
    },
    postalCode: {
      type: String,
      default: '00000',  // Varsayılan olarak "00000"
    },
    country: {
      type: String,
      default: 'Unknown',  // Varsayılan olarak "Unknown"
    },
  },
resetToken:{type:String}

},{timestamps:true})

const User:Model<IUser>=mongoose.model<IUser>("User",UserSchema)
export default User;
