import { prisma } from "../../config/prisma";
import { Request, Response } from "express";
export async function getAllUsers(req: Request, res: Response) {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                isBlocked: true,
                points: true,
                isEmailVerified: true,
                createdAt: true,
                updatedAt: true,
                kyc: {
                    select: {
                        status: true,
                    }
                },
                properties: {
                    select: {
                        id: true,
                        status: true,
                    }
                }
            }
        })
        const userWithStats = users.map((u) => {
            const total = u.properties.length;
            const active = u.properties.filter((p) => p.status === "ACTIVE").length;
            const unlisted = u.properties.filter((p) => p.status === "UNLISTED").length;
            const soldStatuses = ["SOLDOFFLINE", "SOLDTOREALBRO", "SOLDFROMLISTINGS"];
            const sold = u.properties.filter((p) =>
                soldStatuses.includes(p.status)
            ).length;
            return {
                ...u,
                propertyStats: {
                    total,
                    sold,
                    active,
                    unlisted,
                }
            }
        })
        return res.status(200).json({ users: userWithStats });
    } catch (error) {
        console.error("Get all users error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}