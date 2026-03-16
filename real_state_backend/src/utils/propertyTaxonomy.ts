export const propertyTypeEnum = ["FARMLAND", "DUPLEX", "FLAT", "PLOT"] as const;
export const categoryEnum = ["RESIDENTIAL", "COMMERCIAL", "AGRICULTURAL"] as const;

export type PropertyType = (typeof propertyTypeEnum)[number];
export type PropertyCategory = (typeof categoryEnum)[number];

export const propertyCategoryTypeLabels = [
    {
        category: "RESIDENTIAL" as const,
        types: [
            "Apartment / Flat",
            "Independent House / Villa",
            "Plot / Land",
            "Farmhouse",
        ],
    },
    {
        category: "COMMERCIAL" as const,
        types: [
            "Office Space",
            "Shop / Showroom",
            "Commercial Plot / Land",
            "Warehouse / Godown",
        ],
    },
    {
        category: "AGRICULTURAL" as const,
        types: ["Agricultural / Farm Land"],
    },
] as const;

const propertyTypeAliasMap: Record<string, PropertyType> = {
    FARMLAND: "FARMLAND",
    DUPLEX: "DUPLEX",
    FLAT: "FLAT",
    PLOT: "PLOT",
    "APARTMENT / FLAT": "FLAT",
    "INDEPENDENT HOUSE / VILLA": "DUPLEX",
    "PLOT / LAND": "PLOT",
    FARMHOUSE: "FARMLAND",
    "OFFICE SPACE": "DUPLEX",
    "SHOP / SHOWROOM": "DUPLEX",
    "COMMERCIAL PLOT / LAND": "PLOT",
    "WAREHOUSE / GODOWN": "DUPLEX",
    "AGRICULTURAL / FARM LAND": "FARMLAND",
};

const categoryAliasMap: Record<string, PropertyCategory> = {
    RESIDENTIAL: "RESIDENTIAL",
    COMMERCIAL: "COMMERCIAL",
    AGRICULTURAL: "AGRICULTURAL",
};

function normalizeLookupKey(value: unknown): string | undefined {
    if (typeof value !== "string") return undefined;
    const normalized = value.trim().replace(/\s+/g, " ").toUpperCase();
    return normalized.length > 0 ? normalized : undefined;
}

export function normalizePropertyType(value: unknown): PropertyType | undefined {
    const key = normalizeLookupKey(value);
    if (!key) return undefined;
    return propertyTypeAliasMap[key];
}

export function normalizeCategory(value: unknown): PropertyCategory | undefined {
    const key = normalizeLookupKey(value);
    if (!key) return undefined;
    return categoryAliasMap[key];
}

export function normalizePropertyTypeArray(value: unknown): unknown {
    if (!value) return undefined;
    const list = Array.isArray(value) ? value : [value];
    return list.map((item) => normalizePropertyType(item) ?? item);
}

export function normalizeCategoryArray(value: unknown): unknown {
    if (!value) return undefined;
    const list = Array.isArray(value) ? value : [value];
    return list.map((item) => normalizeCategory(item) ?? item);
}