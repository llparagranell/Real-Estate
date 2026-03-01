"use client"

import { PropertyCard, PropertyCardData } from "./propertyCard"

interface PropertyGridProps {
    properties: PropertyCardData[]
    onEdit?: (id: string) => void
    onBuy?: (id: string) => void
    onMarkAsSold?: (id: string) => void
    onFavorite?: (id: string) => void
}

export function PropertyGrid({ properties, onEdit, onBuy, onMarkAsSold, onFavorite }: PropertyGridProps) {
    return (
        <div className="overflow-y-auto pr-2" style={{ maxHeight: "calc(100vh - 140px)" }}>
            <div className="grid grid-cols-2 gap-4">
                {properties.map((property) => (
                    <PropertyCard
                        key={property.id}
                        property={property}
                        onEdit={onEdit}
                        onBuy={onBuy}
                        onMarkAsSold={onMarkAsSold}
                        onFavorite={onFavorite}
                    />
                ))}
            </div>
        </div>
    )
}
