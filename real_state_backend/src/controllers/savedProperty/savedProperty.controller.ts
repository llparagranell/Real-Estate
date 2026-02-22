import { prisma } from "../../config/prisma";
import { Request, Response } from "express";
import { SavePropertyInput, GetSavedPropertiesQueryInput } from "../../validators/savedProperty.validators";

type Params = {
    propertyId: string;
};

// Save a property to user's favorites
export async function saveProperty(req: Request, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized User" });
        }

        const { propertyId } = req.body as SavePropertyInput;

        // Check if property exists
        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        // Check if property is already saved
        const existingSave = await prisma.savedProperty.findUnique({
            where: {
                userId_propertyId: {
                    userId,
                    propertyId
                }
            }
        });

        if (existingSave) {
            return res.status(400).json({ 
                message: "Property already saved",
                data: existingSave
            });
        }

        // Save the property
        const savedProperty = await prisma.savedProperty.create({
            data: {
                userId,
                propertyId
            },
            include: {
                property: {
                    include: {
                        media: {
                            orderBy: { order: 'asc' }
                        },
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                phone: true,
                                avatar: true
                            }
                        }
                    }
                }
            }
        });

        return res.status(201).json({
            success: true,
            message: "Property saved successfully",
            data: savedProperty
        });
    } catch (error) {
        console.error("Save property error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Remove a saved property
export async function unsaveProperty(req: Request<Params>, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized User" });
        }

        const { propertyId } = req.params;

        // Check if property is saved
        const savedProperty = await prisma.savedProperty.findUnique({
            where: {
                userId_propertyId: {
                    userId,
                    propertyId
                }
            }
        });

        if (!savedProperty) {
            return res.status(404).json({ message: "Saved property not found" });
        }

        // Remove the saved property
        await prisma.savedProperty.delete({
            where: {
                userId_propertyId: {
                    userId,
                    propertyId
                }
            }
        });

        return res.status(200).json({
            success: true,
            message: "Property removed from saved list"
        });
    } catch (error) {
        console.error("Unsave property error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Get all saved properties for the user
export async function getSavedProperties(req: Request, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized User" });
        }

        const queryData = ((req as any).validatedQuery || req.query) as GetSavedPropertiesQueryInput;
        const { page = 1, limit = 10 } = queryData;

        const skip = (page - 1) * limit;

        const [savedProperties, totalCount] = await Promise.all([
            prisma.savedProperty.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    property: {
                        include: {
                            media: {
                                orderBy: { order: 'asc' }
                            },
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                    phone: true,
                                    avatar: true
                                }
                            }
                        }
                    }
                }
            }),
            prisma.savedProperty.count({ where: { userId } })
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return res.status(200).json({
            success: true,
            data: savedProperties,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                limit,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        });
    } catch (error) {
        console.error("Get saved properties error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Check if a property is saved by the user
export async function checkIfPropertySaved(req: Request<Params>, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized User" });
        }

        const { propertyId } = req.params;

        const savedProperty = await prisma.savedProperty.findUnique({
            where: {
                userId_propertyId: {
                    userId,
                    propertyId
                }
            }
        });

        return res.status(200).json({
            success: true,
            isSaved: !!savedProperty,
            data: savedProperty
        });
    } catch (error) {
        console.error("Check property saved error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
