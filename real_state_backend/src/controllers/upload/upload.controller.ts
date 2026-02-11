import { Request, Response } from "express";
import { createPresignedUpload, uploadFileToS3 } from "../../services/s3.service";
import { uploadSchema } from "../../validators/upload.validator";
import z from "zod";

export async function presignedUpload(req: Request, res: Response) {
    try {
        type UploadInput = z.infer<typeof uploadSchema>;
        const { fileName, contentType, purpose } = req.body as UploadInput;
        const result = await createPresignedUpload({
            fileName,
            contentType,
            purpose,
            userId: req.user?.id,
        });
        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error: any) {
        console.error("presignUpload error:", error);
        if (
            error?.message?.includes("Unsupported contentType") ||
            error?.message?.includes("Missing AWS env vars")
        ) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
        return res.status(500).json({
            success: false,
            message: "Failed to create upload URL",
        });
    }
}

export async function directUpload(req: Request, res: Response) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const { purpose } = req.body;

        if (!purpose) {
            return res.status(400).json({
                success: false,
                message: "Purpose is required",
            });
        }

        const result = await uploadFileToS3({
            fileBuffer: req.file.buffer,
            fileName: req.file.originalname,
            contentType: req.file.mimetype,
            purpose: purpose,
            userId: req.user?.id,
        });

        return res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            data: {
                key: result.key,
                fileUrl: result.fileUrl,
                bucket: result.bucket,
                size: result.size,
                fileName: req.file.originalname,
                contentType: req.file.mimetype,
            },
        });
    } catch (error: any) {
        console.error("directUpload error:", error);
        if (
            error?.message?.includes("Unsupported contentType") ||
            error?.message?.includes("Missing AWS env vars")
        ) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
        return res.status(500).json({
            success: false,
            message: "Failed to upload file",
        });
    }
}