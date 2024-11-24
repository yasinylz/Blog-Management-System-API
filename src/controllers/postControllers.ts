import { Request, Response, NextFunction } from 'express';
import path from 'path';
import  Post  from '../models/Post';  // Post modelinizi uygun şekilde import edin
import fs from 'fs';
import { RequestHandler } from 'express';

export const createPost = async (req: Request, res: Response, next: Function) => {
  const { title, content, author } = req.body;
  const file = req.file;

  try {
    let imagePath: string | undefined = undefined;
    let videoPath: string | undefined = undefined;

    // Dosya türüne göre doğru dosya yolunu oluştur
    if (file) {
      const uploadDir = path.join(__dirname, '..', 'uploads');  // 'uploads' dizininin tam yolu
      const filePath = path.join(uploadDir, file.mimetype.startsWith('image/') ? 'images' : 'videos', file.filename);

      // Eğer resimse
      if (file.mimetype.startsWith('image/')) {
        imagePath = filePath;
      }
      // Eğer video ise
      else if (file.mimetype.startsWith('video/')) {
        videoPath = filePath;
      }
    }

    // Yeni post oluştur
    const newPost = new Post({
      title,
      content,
      author,
      image: imagePath,
      video: videoPath
    });

    // Postu kaydet
    await newPost.save();
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    res.status(400).json({ error });
  }
};
export const getPosts = async (req: Request, res: Response, next: Function) => { 
    try {
      const posts = await Post.find();
      res.status(200).json({ posts: posts });
    } catch (error) {
      res.status(400).json({ error });
    }
  }


  export const deletePosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
  
    try {
      const post = await Post.findById(id);
      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return; // İşlem devam etmesin
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
      next(error); // Hata yakalama
    }
  };
  

// Post için bir interface tanımlayın
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


export const updatePost = async (
  req: Request,
  res: Response,
  next: Function
): Promise<void> => {
  const { id } = req.params;
  const { title, content, author } = req.body;
  const file = req.file as MulterFile | undefined;

  try {
    const post = (await Post.findById(id)) as IPost | null;
    if (!post) {
      res.status(404).json({ message: "No post found" });
      return; // Hata durumunda `return` ile çıkıyoruz
    }

    let imagePath = post.image;
    let videoPath = post.video;

    if (file) {
      if (file.mimetype.startsWith("image/")) {
        if (post.image) {
          try {
            await fs.promises.unlink(post.image);
          } catch (error) {
            console.error(`Failed to delete old image file: ${error}`);
          }
        }
        imagePath = path.join(__dirname, '..', 'uploads/images', file.filename);
      } else if (file.mimetype.startsWith("video/")) {
        if (post.video) {
          try {
            await fs.promises.unlink(post.video);
          } catch (error) {
            console.error(`Failed to delete old video file: ${error}`);
          }
        }
        videoPath = path.join(__dirname, '..', 'uploads/videos', file.filename);
      }
    }

    post.title = title;
    post.content = content;
    post.author = author;
    post.image = imagePath;
    post.video = videoPath;

    await post.save();

    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "An error occurred while updating the post" });
  }
};


export const getPostById = async(req:Request,res:Response): Promise<void> =>{
const {id}=req.params
try {
  const post=(await Post.findById(id))as  IPost
  if (!post) {
     res.status(404).json({ message: "No post found" });
     return
  }
res.status(200).json({ message:post});

} catch  (error){
  res.status(500).json({ error});
}

}