import { GemRequestStatus, GemRequestType } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

export async function gemRequests(req: Request, res: Response) {
    try {
        const staffId = req.user?.id;
        const role = req.user?.role;
        if (!staffId || !role) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const page = Math.max(Number(req.query.page ?? 1), 1);
        const limit = Math.min(Math.max(Number(req.query.limit ?? 10), 1), 100);
        const skip = (page - 1) * limit;

        const status = req.query.status as GemRequestStatus | undefined;
        const type = req.query.type as GemRequestType | undefined;
        const userId = req.query.userId as string | undefined;
        const propertyId = req.query.propertyId as string | undefined;

        if (status && !Object.values(GemRequestStatus).includes(status)) {
            return res.status(400).json({ message: "Invalid status filter" });
        }
        if (type && !Object.values(GemRequestType).includes(type)) {
            return res.status(400).json({ message: "Invalid type filter" });
        }

        const where: any = {};
        if (status) where.status = status;
        if (type) where.type = type;
        if (userId) where.userId = userId;
        if (propertyId) where.propertyId = propertyId;

        // Super admin can see all gem requests. Other staff can see only their own.
        if (role !== "SUPER_ADMIN") {
            where.requestedByStaffId = staffId;
        }

        const [requests, total] = await Promise.all([
            prisma.gemRequest.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phone: true,
                        },
                    },
                    referralUser: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phone: true,
                        },
                    },
                    property: {
                        select: {
                            id: true,
                            title: true,
                            status: true,
                        },
                    },
                    requestedByStaff: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            role: true,
                        },
                    },
                    reviewedByStaff: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            role: true,
                        },
                    },
                },
            }),
            prisma.gemRequest.count({ where }),
        ]);

        return res.status(200).json({
            success: true,
            data: requests,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get gem requests error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}