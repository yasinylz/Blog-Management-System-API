import { Request, Response, NextFunction } from 'express';
import path from 'path';
import  Post  from '../models/Post';  // Post modelinizi uygun şekilde import edin
import fs from 'fs';
import {Category} from'../models/Category';

import { AppError } from "../utils/appError";
import { setCache } from '../utils/redisUtils';

export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, category } = req.body;

    // Yeni bir gönderi oluşturma
    const newPost = new Post({
      title,
      content,
      category,
    });
    await newPost.save();

    // Redis önbelleğine kaydet
    const cacheKey = `post:${newPost._id}`;
    await setCache(cacheKey, newPost);

    res.status(201).json({
      message: 'Post created and cached successfully',
      data: newPost,
    });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
};
export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  const  {limit=10,page=1}=req.query;
  try {
    const posts = await Post.find().populate('categoryId', 'name').limit(Number(limit)).skip((Number(page)-1)*Number(limit)) // Kategori bilgisiyle birlikte
    res.status(200).json({ posts });
  } catch (error) {
    return next(new AppError('An error occurred', 500));

  }
};



  export const deletePosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
  
    try {
      const post = await Post.findById(id);
      if (!post) {
        return next(new AppError('Post not found', 404));

      }
  
      // Dosya yollarını belirleyin
      const deleteFile = async (filePath: string) => {
        const fullPath = path.resolve(filePath); // Tam dosya yolu
        try {
          if (fs.existsSync(fullPath)) {
            await fs.promises.unlink(fullPath);
            console.log(`Deleted file: ${fullPath}`);
          } else {
            console.warn(`File does not exist: ${fullPath}`);
          }
        } catch (error) {
          console.error(`Error deleting file at ${fullPath}:`, error);
        }
      };
  
      if (post.image) {
        await deleteFile(post.image);
      }
      if (post.video) {
        await deleteFile(post.video);
      }
  
      // Postu veritabanından sil
      await Post.findByIdAndDelete(id);
  
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      return next(new AppError('An error occurred', 500));

    }
  };
  

// Post için bir interface tanımlayıns
interface IPost {
  _id: string;
  title: string;
  content: string;
  author: string;
  image?: string;
  video?: string;
  save: () => Promise<void>;
}

// Multer dosya tipi için bir interface
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { title, content, author, categorName } = req.body;
  const file = req.file;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return next(new AppError('Post not found', 404));

    }

    if (categorName) {
      const category = await Category.findOne({name:categorName});
      if (!category) {
        return next(new AppError('Category not found', 404));

      }
      post.category = category.id;
    }

    if (file) {
      const uploadDir = path.join(__dirname, '..', 'uploads');
      const filePath = path.join(uploadDir, file.mimetype.startsWith('image/') ? 'images' : 'videos', file.filename);

      if (file.mimetype.startsWith('image/')) {
        if (post.image) {
          await fs.promises.unlink(post.image);
        }
        post.image = filePath;
      } else if (file.mimetype.startsWith('video/')) {
        if (post.video) {
          await fs.promises.unlink(post.video);
        }
        post.video = filePath;
      }
    }

    post.title = title;
    post.content = content;
    post.author = author;

    await post.save();
    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    return next(new AppError('An error occurred', 500));

  }
};


export const getPostById = async (req: Request, res: Response,next:NextFunction)=> {
  const { id } = req.params;

  try {
    const post = await Post.findById(id).populate('categoryId', 'name'); // Kategori detaylarıyla
    if (!post) {
      return next(new AppError('Post not found', 404));

    }
    res.status(200).json({ post });
  } catch (error) {
    return next(new AppError('An error occurred', 500));

  }
};
