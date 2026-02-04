import z from "zod";

export const StatusEnum = [
    "ACTIVE",
    "INACTIVE",
    "SOLD",
    "DRAFT",
] as const;
export const propertyTypeEnum = [
    "FARMLAND",
    "DUPLEX",
    "FLAT",
    "PLOT",
]

export const addProperty = z.object({
    title: z.string(),
    description: z.string(),
    status:    z.enum(StatusEnum).default("ACTIVE"),
    propertyType: z.enum(propertyTypeEnum),
    priceMin: z.number(),
    priceMax: z.number(),
    state: z.string(),
    city: z.string(),
    area: z.string(),
    address: z.string(),
    longitude: z.number(),
    latitude: z.number(),
    size: z.number()
})

export type addPropertyInput = z.infer.<typeof addProperty>;
