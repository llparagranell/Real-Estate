import { Request, Response } from "express";
import { propertyCategoryTypeLabels } from "../../utils/propertyTaxonomy";

export async function getPropertyCategories(req: Request, res: Response) {
    try {
        return res.status(200).json({
            success: true,
            data: propertyCategoryTypeLabels
        });
    } catch (error: any) {
        console.error("Get property categories error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to fetch property categories"
        });
    }
}
