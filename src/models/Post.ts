import mongoose, { Schema, Document } from 'mongoose';

interface IPost extends Document {
  title: string;
  content: string;
  author: string;
  image?: string;
  video?: string;
  category: mongoose.Types.ObjectId; // Kategori bağlantısı
}

const PostSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  image: { type: String },
  video: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // İlişki tanımı
}, { timestamps: true });
PostSchema.index({ category: 1 });
PostSchema.index({ title: 'text' });

export default mongoose.model<IPost>('Post', PostSchema);
