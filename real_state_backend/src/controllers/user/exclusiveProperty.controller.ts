import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

const exclusiveStatusValues = ["ACTIVE", "SOLD_OUT", "ARCHIVED"] as const;
type ExclusiveStatus = (typeof exclusiveStatusValues)[number];

export async function getExclusivePropertiesForApp(req: Request, res: Response) {
    try {
        const page = Math.max(Number(req.query.page ?? 1), 1);
        const limit = Math.min(Math.max(Number(req.query.limit ?? 10), 1), 100);
        const skip = (page - 1) * limit;

        const rawStatus = String(req.query.status ?? "ACTIVE").toUpperCase();
        const status: ExclusiveStatus = exclusiveStatusValues.includes(rawStatus as ExclusiveStatus)
            ? (rawStatus as ExclusiveStatus)
            : "ACTIVE";

        const [items, total] = await Promise.all([
            prisma.exclusiveProperty.findMany({
                where: { status },
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    title: true,
                    status: true,
                    listingPrice: true,
                    city: true,
                    locality: true,
                    subLocality: true,
                    numberOfRooms: true,
                    numberOfBathrooms: true,
                    numberOfBalcony: true,
                    numberOfFloors: true,
                    furnishingStatus: true,
                    fixedRewardGems: true,
                    createdAt: true,
                    updatedAt: true,
                    media: {
                        where: { mediaType: "IMAGE" },
                        orderBy: { order: "asc" },
                        take: 1,
                        select: { url: true },
                    },
                },
            }),
            prisma.exclusiveProperty.count({ where: { status } }),
        ]);

        const data = items.map((item) => ({
            id: item.id,
            title: item.title,
            status: item.status,
            listingPrice: item.listingPrice,
            city: item.city,
            locality: item.locality,
            subLocality: item.subLocality,
            numberOfRooms: item.numberOfRooms,
            numberOfBathrooms: item.numberOfBathrooms,
            numberOfBalcony: item.numberOfBalcony,
            numberOfFloors: item.numberOfFloors,
            furnishingStatus: item.furnishingStatus,
            fixedRewardGems: item.fixedRewardGems,
            imageUrl: item.media[0]?.url ?? null,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        }));

        return res.status(200).json({
            success: true,
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get exclusive properties for app error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getExclusivePropertyDetailsForApp(req: Request, res: Response) {
    try {
        const { exclusivePropertyId } = req.params as { exclusivePropertyId: string };
        if (!exclusivePropertyId) {
            return res.status(400).json({ message: "exclusivePropertyId is required" });
        }

        const exclusiveProperty = await prisma.exclusiveProperty.findFirst({
            where: {
                id: exclusivePropertyId,
                status: "ACTIVE",
            },
            select: {
                id: true,
                title: true,
                description: true,
                propertyType: true,
                status: true,
                listingPrice: true,
                priceMin: true,
                priceMax: true,
                state: true,
                city: true,
                locality: true,
                subLocality: true,
                flatNo: true,
                area: true,
                address: true,
                latitude: true,
                longitude: true,
                carpetArea: true,
                carpetAreaUnit: true,
                plotLandArea: true,
                plotLandAreaUnit: true,
                size: true,
                sizeUnit: true,
                category: true,
                furnishingStatus: true,
                availabilityStatus: true,
                ageOfProperty: true,
                numberOfRooms: true,
                numberOfBathrooms: true,
                numberOfBalcony: true,
                numberOfFloors: true,
                propertyFloor: true,
                allInclusivePrice: true,
                negotiablePrice: true,
                govtChargesTaxIncluded: true,
                propertyFacing: true,
                amenities: true,
                locationAdvantages: true,
                coveredParking: true,
                uncoveredParking: true,
                fixedRewardGems: true,
                soldOutAt: true,
                notes: true,
                createdAt: true,
                updatedAt: true,
                media: {
                    orderBy: { order: "asc" },
                },
            },
        });

        if (!exclusiveProperty) {
            return res.status(404).json({ message: "Exclusive property not found" });
        }

        return res.status(200).json({ success: true, data: exclusiveProperty });
    } catch (error) {
        console.error("Get exclusive property details for app error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}