import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import Role from './Role';  // Role modelini import ediyoruz.

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  phone: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  roles: mongoose.Schema.Types.ObjectId[]; 
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    isActive: { type: Boolean, default: true },
    phone: { type: String, default: "" },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }] , // Roller referans olarak ekleniyor
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      postalCode: { type: String, default: "" },
      country: { type: String, default: "" },
    },
   
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (this.isNew) {
    // Kullanıcı yeni kaydediliyorsa, "author" rolünü ekle
    const authorRole = await Role.findOne({ name: 'author' });  // "author" rolünü bul
    if (authorRole) {
      this.roles.push(authorRole.id);  // Bu rolü kullanıcının rollerine ekle
    }
  }
  next();
});

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default User;
