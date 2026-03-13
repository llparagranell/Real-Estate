import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

export async function getActiveBanners(req: Request, res: Response) {
    try {
        const banners = await prisma.banner.findMany({
            where: { status: "ACTIVE" },
            orderBy: { updatedAt: "desc" },
            select: {
                id: true,
                title: true,
                image: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return res.status(200).json({
            success: true,
            data: banners,
        });
    } catch (error) {
        console.error("Get active banners error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}