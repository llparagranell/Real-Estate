"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { PropertyImageCarousel } from "@/components/propertyDetails/propertyImageCarousel"
import { PropertyBrokerInfo } from "@/components/propertyDetails/propertyBrokerInfo"
import { PropertyActionBar } from "@/components/propertyDetails/propertyActionBar"
import { PropertyDetailsPanel } from "@/components/propertyDetails/propertyDetailsPanel"
import { PropertyAbout } from "@/components/propertyDetails/propertyAbout"
import type { BrokerInfoData } from "@/components/propertyDetails/propertyBrokerInfo"
import type { PropertyDetailsPanelData } from "@/components/propertyDetails/propertyDetailsPanel"
import { api } from "@/lib/api"

type PropertyResponse = {
    success: boolean
    data: {
        id: string
        title: string
        description: string | null
        propertyType: string | null
        status: string
        listingPrice: number | null
        city: string | null
        locality: string | null
        subLocality: string | null
        carpetArea: number | null
        carpetAreaUnit: string | null
        size: number | null
        sizeUnit: string | null
        category: string | null
        furnishingStatus: string | null
        availabilityStatus: string | null
        ageOfProperty: string | null
        numberOfRooms: number | null
        numberOfBathrooms: number | null
        numberOfBalcony: number | null
        numberOfFloors: number | null
        propertyFacing: string | null
        createdAt: string
        media: Array<{ url: string }>
        user: {
            firstName: string
            lastName: string
        }
        exclusiveProperty: {
            id: string
            fixedRewardGems: number
        } | null
    }
}

const FALLBACK_IMAGE = "/largeBuilding2.png"

export default function PropertyPage() {
    const params = useParams<{ id: string }>()
    const propertyId = Array.isArray(params?.id) ? params.id[0] : params?.id
    const [property, setProperty] = useState<PropertyResponse["data"] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!propertyId) {
            setError("Invalid property id")
            return
        }

        let isMounted = true

        const loadProperty = async () => {
            try {
                setIsLoading(true)
                setError(null)
                const response = await api.get<PropertyResponse>(`/staff/properties/${propertyId}`)
                if (!isMounted) return
                setProperty(response.data.data)
            } catch (err) {
                if (!isMounted) return
                setError("Failed to load property details")
                console.error("Failed to fetch property details:", err)
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        loadProperty()
        return () => {
            isMounted = false
        }
    }, [propertyId])

    const images = useMemo(() => {
        if (!property?.media?.length) return [FALLBACK_IMAGE]
        return property.media.map((item) => item.url)
    }, [property])

    const broker = useMemo<BrokerInfoData>(() => {
        if (!property) {
            return {
                name: "RealBro",
                logoUrl: FALLBACK_IMAGE,
                isVerified: true,
                postedDate: "-",
            }
        }
        const name = `${property.user.firstName} ${property.user.lastName}`.trim()
        return {
            name: name || "RealBro",
            logoUrl: FALLBACK_IMAGE,
            isVerified: true,
            postedDate: new Date(property.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }),
        }
    }, [property])

    const details = useMemo<PropertyDetailsPanelData | null>(() => {
        if (!property) return null

        const statusMap: Record<string, string> = {
            ACTIVE: "Active",
            UNLISTED: "Unlisted",
            DRAFT: "Pending",
            UNDER_ACQUISITION: "Pending",
            SOLDOFFLINE: "Sold",
            SOLDTOREALBRO: "Sold",
            SOLDFROMLISTINGS: "Sold",
        }
        const location = [property.subLocality, property.locality, property.city].filter(Boolean).join(", ")
        const areaSqftValue = property.carpetArea ?? property.size ?? 0
        const areaSqmValue = areaSqftValue ? (areaSqftValue * 0.092903).toFixed(0) : "0"

        return {
            status: statusMap[property.status] ?? property.status,
            statusLabel: property.availabilityStatus?.replace(/([a-z])([A-Z])/g, "$1 $2"),
            title: property.title,
            location: location || "N/A",
            tags: [
                property.category ? { label: property.category, icon: "residential" as const } : null,
                property.propertyType ? { label: property.propertyType, icon: "apartment" as const } : null,
                property.ageOfProperty ? { label: property.ageOfProperty, icon: "age" as const } : null,
                property.furnishingStatus ? { label: property.furnishingStatus.replace(/([a-z])([A-Z])/g, "$1 $2"), icon: "furnishing" as const } : null,
                property.propertyFacing ? { label: property.propertyFacing.replace(/([a-z])([A-Z])/g, "$1 $2"), icon: "facing" as const } : null,
            ].filter((tag): tag is NonNullable<typeof tag> => Boolean(tag)),
            specs: {
                price: property.listingPrice != null ? String(property.listingPrice) : "0",
                pricePerSqft:
                    property.listingPrice != null && areaSqftValue > 0
                        ? String(Math.round(property.listingPrice / areaSqftValue))
                        : "0",
                areaSqft: `${areaSqftValue} sqft`,
                areaSqm: `${areaSqmValue} sqm`,
                rooms: property.numberOfRooms ?? 0,
                bathrooms: property.numberOfBathrooms ?? 0,
                balcony: property.numberOfBalcony ?? 0,
                floors: property.numberOfFloors ?? 0,
            },
        }
    }, [property])

    return (
        <div>
            <h1 className="font-medium text-xl p-2 pl-4">Property Details</h1>
            {isLoading && <p className="px-4 text-sm text-gray-500">Loading property details...</p>}
            {error && <p className="px-4 text-sm text-red-500">{error}</p>}

            {!isLoading && !error && property && details && (
                <div className="flex gap-6 mt-4 px-4">
                <div className="w-1/2">
                    <PropertyImageCarousel
                        images={images}
                        isExclusive={Boolean(property.exclusiveProperty)}
                        gems={property.exclusiveProperty?.fixedRewardGems}
                    />
                    <PropertyBrokerInfo broker={broker} />
                    <PropertyActionBar variant={property.exclusiveProperty ? "exclusive" : "default"} />
                </div>

                <div className="w-1/2">
                    <PropertyDetailsPanel data={details} />
                    <PropertyAbout description={property.description || "No description provided."} />
                </div>
            </div>
            )}
        </div>
    )
}
