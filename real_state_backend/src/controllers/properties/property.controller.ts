import { prisma } from "../../config/prisma";
import { Request, Response } from "express";
import { addPropertySchema } from "../../validators/property.validators";
import z from "zod";

type Params = {
    id: string;
};

export async function addProperty(req: Request, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(201).json("UnAuthorized User");
        }
        type AddPropertyInput = z.infer<typeof addPropertySchema>;
        const body = req.body as AddPropertyInput;
        const { media, ...propertyData } = body;
        const property = await prisma.property.create({
            data: {
                ...propertyData,
                userId: userId,
                media: {
                    createMany: {
                        data: media.map((m, index) => ({
                            ...m,
                            order: m.order ?? index
                        })),
                    },
                },
            },
            include: {
                media: true
            },
        });
        return res.status(201).json({
            success: true,
            data: property
        });
    } catch (error) {
        console.error("Add property error", error);
        return res.status(500).json({ message: "Internal server Error" })
    }
}
//Get All Properties
export async function getAllProperties(req: Request, res: Response) {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const skip = (page - 1) * limit
        const [properties, total] = await Promise.all([
            prisma.property.findMany({
                where: { status: "ACTIVE" },
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: { media: true },
            }),
            prisma.property.count({
                where: { status: "ACTIVE" },
            }),
        ]);
        return res.status(200).json({ data: properties, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internval server Error" })
    }
}   
//get my properties

export async function getMyProperties(req: Request, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" })
        };
        const properties = await prisma.property.findMany({
            where: { userId: userId },
            include: {
                media: true
            },
            orderBy: { createdAt: "desc" },
        });
        if (properties.length === 0) {
            return res.status(200).json({
                data: [],
                message: "No properties found",
            });
        }
        return res.status(200).json({ data: properties });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Interval server error" })
    }
}

//get specific properties
export async function getProperty(req: Request<Params>, res: Response) {
    try {
        const { id } = req.params;
        const property = await prisma.property.findUnique({
            where: { id },
            include: { media: true }
        });
        if (!property) {
            return res.status(404).json({ message: "No property found for the property id" })
        }
        return res.status(200).json({ data: property })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Interval server error" })
    }
}

