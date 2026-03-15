import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { CreateRequirementInput, UpdateRequirementInput } from "../../validators/requirement.validators";

export async function createRequirement(req: Request, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { preferredLocation, subLocation, propertyType, budgetMin, budgetMax, currency } =
            req.body as CreateRequirementInput;

        const requirement = await prisma.propertyRequirement.create({
            data: {
                userId,
                preferredLocation,
                subLocation,
                propertyType,
                budgetMin,
                budgetMax,
                currency,
            },
        });

        return res.status(201).json({ success: true, data: requirement });
    } catch (error) {
        console.error("Create requirement error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getMyRequirements(req: Request, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const page = Math.max(Number(req.query.page ?? 1), 1);
        const limit = Math.min(Math.max(Number(req.query.limit ?? 10), 1), 100);
        const skip = (page - 1) * limit;

        const status = typeof req.query.status === "string" ? req.query.status : undefined;

        const where: { userId: string; status?: string } = { userId };
        const validStatuses = ["NEW", "ACTIVE", "FULFILLED", "CLOSED"];
        if (status && validStatuses.includes(status)) {
            where.status = status;
        }

        const [requirements, total] = await Promise.all([
            prisma.propertyRequirement.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.propertyRequirement.count({ where }),
        ]);

        return res.status(200).json({
            success: true,
            data: requirements,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get requirements error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function updateRequirement(req: Request, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { id } = req.params as { id: string };
        const body = req.body as UpdateRequirementInput;

        const existing = await prisma.propertyRequirement.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ message: "Requirement not found" });
        }
        if (existing.userId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const data: Partial<typeof body> = {};
        if (body.preferredLocation !== undefined) data.preferredLocation = body.preferredLocation;
        if (body.subLocation !== undefined) data.subLocation = body.subLocation;
        if (body.propertyType !== undefined) data.propertyType = body.propertyType;
        if (body.budgetMin !== undefined) data.budgetMin = body.budgetMin;
        if (body.budgetMax !== undefined) data.budgetMax = body.budgetMax;
        if (body.currency !== undefined) data.currency = body.currency;
        if (body.status !== undefined) data.status = body.status;

        if (Object.keys(data).length === 0) {
            return res.status(400).json({ message: "No fields provided to update" });
        }

        const updated = await prisma.propertyRequirement.update({ where: { id }, data });

        return res.status(200).json({ success: true, data: updated });
    } catch (error) {
        console.error("Update requirement error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteRequirement(req: Request, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { id } = req.params as { id: string };

        const existing = await prisma.propertyRequirement.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ message: "Requirement not found" });
        }
        if (existing.userId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await prisma.propertyRequirement.delete({ where: { id } });

        return res.status(200).json({ success: true, message: "Requirement deleted" });
    } catch (error) {
        console.error("Delete requirement error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
