import { Request,Response,NextFunction } from "express";
import { AppError } from "../utils/appError";
import logger from "../config/logger";
import path from "path";
export const  globalErrorHandler =(
    err: AppError|any,
    req: Request,
    res: Response,
    next: NextFunction
)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||'internal server error';
    logger.error({
        message:err.message,
        stack:err.stack,
        path:req.originalUrl,
    })
    res.status(statusCode).json({
        status:'error',
        message
    })
}