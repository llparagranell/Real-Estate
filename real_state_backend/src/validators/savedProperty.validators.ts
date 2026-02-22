import z from "zod";

// Save Property Schema
export const savePropertySchema = z.object({
    propertyId: z.string().min(1, "Property ID is required"),
});

// Get Saved Properties Query Schema
export const getSavedPropertiesQuerySchema = z.object({
    page: z.preprocess(
        (val) => val ? parseInt(val as string) : 1,
        z.number().int().min(1).default(1)
    ),
    limit: z.preprocess(
        (val) => val ? Math.min(parseInt(val as string), 100) : 10,
        z.number().int().min(1).max(100).default(10)
    ),
});

export type SavePropertyInput = z.infer<typeof savePropertySchema>;
export type GetSavedPropertiesQueryInput = z.infer<typeof getSavedPropertiesQuerySchema>;
