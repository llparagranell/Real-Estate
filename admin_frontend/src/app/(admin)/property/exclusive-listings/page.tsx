"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
    PropertiesFilter,
    defaultPropertiesFilterState,
    propertiesFilterToParams,
    type PropertiesFilterState,
} from "@/components/properties/propertiesFilter"
import {
    PropertiesSortDropdown,
    sortPropertiesByPrice,
    type PropertySortOption,
} from "@/components/properties/propertiesSortDropdown"
import { ExportButton } from "@/components/role_management/exportButton"
import { Input } from "@/components/ui/input"
import { PropertyGrid } from "@/components/properties/propertyGrid"
import type { PropertyCardData } from "@/components/properties/propertyCard"
import type { ExportColumn } from "@/components/role_management/exportButton"
import { api } from "@/lib/api"
import { fetchBookmarkedPropertyIds, toggleBookmark } from "@/lib/bookmarks"

type ExclusiveApiRow = {
    id: string
    title: string
        status: "ACTIVE" | "SOLD_OUT" | "UNLISTED"
    listingPrice: number | null
    city: string | null
    locality: string | null
    subLocality: string | null
    numberOfRooms: number | null
    numberOfBathrooms: number | null
    numberOfBalcony: number | null
    numberOfFloors: number | null
    furnishingStatus: string | null
    createdAt: string
    fixedRewardGems: number
    media: Array<{ url: string }>
    sourceProperty: { id: string }
}

export default function ExclusivePropertiesPage() {
    const router = useRouter()
    const [globalFilter, setGlobalFilter] = useState("")
    const [priceSort, setPriceSort] = useState<PropertySortOption>("")
    const [propertyFilters, setPropertyFilters] = useState<PropertiesFilterState>(defaultPropertiesFilterState)
    const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set())
    const [exclusiveProperties, setExclusiveProperties] = useState<PropertyCardData[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchExclusiveProperties = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)
            const params: Record<string, string | number> = { page: 1, limit: 50 }
            Object.assign(params, propertiesFilterToParams(propertyFilters))
            const [response, bookmarkIds] = await Promise.all([
                api.get<{ success: boolean; data: ExclusiveApiRow[] }>("/staff/properties/exclusive", { params }),
                fetchBookmarkedPropertyIds(),
            ])
            setBookmarkedIds(bookmarkIds)
            const mapped: PropertyCardData[] = (response.data.data ?? []).map((item) => {
                const location = [item.subLocality, item.locality, item.city].filter(Boolean).join(", ") || "N/A"
                return {
                    id: item.id,
                    detailId: item.sourceProperty.id,
                    title: item.title,
                    location,
                    price: item.listingPrice != null ? String(item.listingPrice) : "N/A",
                    area: "N/A",
                    bedrooms: item.numberOfRooms ?? 0,
                    bathrooms: item.numberOfBathrooms ?? 0,
                    balconies: item.numberOfBalcony ?? 0,
                    floors: item.numberOfFloors ?? 0,
                    furnishing: item.furnishingStatus?.replace(/([a-z])([A-Z])/g, "$1 $2") ?? "N/A",
                    status: item.status,
                    imageUrl: item.media?.[0]?.url ?? "/largeBuilding2.png",
                    postedDate: new Date(item.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                    }),
                    gems: item.fixedRewardGems,
                }
            })
            setExclusiveProperties(mapped)
        } catch (err) {
            setError("Failed to load exclusive properties")
            console.error("Failed to fetch exclusive properties:", err)
        } finally {
            setIsLoading(false)
        }
    }, [propertyFilters])

    const handleToggleBookmark = useCallback(async (propertyId: string) => {
        const currentlyBookmarked = bookmarkedIds.has(propertyId)
        setBookmarkedIds((prev) => {
            const next = new Set(prev)
            if (currentlyBookmarked) next.delete(propertyId)
            else next.add(propertyId)
            return next
        })
        try {
            const nowBookmarked = await toggleBookmark(propertyId, currentlyBookmarked)
            setBookmarkedIds((prev) => {
                const next = new Set(prev)
                if (nowBookmarked) next.add(propertyId)
                else next.delete(propertyId)
                return next
            })
        } catch (err) {
            setBookmarkedIds((prev) => {
                const next = new Set(prev)
                if (currentlyBookmarked) next.add(propertyId)
                else next.delete(propertyId)
                return next
            })
            console.error("Failed to toggle bookmark:", err)
        }
    }, [bookmarkedIds])

    const handleMarkAsSold = useCallback(
        async (sourcePropertyId: string) => {
            const card = exclusiveProperties.find((p) => p.detailId === sourcePropertyId)
            const isCurrentlySold = card?.status === "SOLD_OUT"
            const nextStatus = isCurrentlySold ? "ACTIVE" : "SOLD_OUT"
            try {
                await api.put(`/staff/properties/${sourcePropertyId}/status`, {
                    status: nextStatus,
                    target: "exclusive",
                })
                await fetchExclusiveProperties()
            } catch (err) {
                console.error("Failed to update exclusive property status:", err)
            }
        },
        [exclusiveProperties, fetchExclusiveProperties],
    )

    useEffect(() => {
        void fetchExclusiveProperties()
    }, [fetchExclusiveProperties])

    const filteredExclusiveProperties = useMemo(() => {
        const query = globalFilter.trim().toLowerCase()
        const bookmarkableId = (p: PropertyCardData) => p.detailId ?? p.id
        const withBookmarkState = exclusiveProperties.map((p) => ({
            ...p,
            isBookmarked: bookmarkedIds.has(bookmarkableId(p)),
        }))
        let result = propertyFilters.showOnlyBookmarked
            ? withBookmarkState.filter((p) => p.isBookmarked)
            : withBookmarkState
        if (query) {
            result = result.filter(
                (property) =>
                    property.title.toLowerCase().includes(query) ||
                    property.location.toLowerCase().includes(query) ||
                    property.status.toLowerCase().includes(query),
            )
        }
        return sortPropertiesByPrice(result, priceSort)
    }, [exclusiveProperties, globalFilter, priceSort, bookmarkedIds, propertyFilters.showOnlyBookmarked])

    const exportColumns: ExportColumn[] = [
        { key: "id", header: "ID" },
        { key: "title", header: "Title" },
        { key: "status", header: "Status" },
        { key: "location", header: "Location" },
        { key: "price", header: "Price" },
        { key: "area", header: "Area" },
        { key: "bedrooms", header: "Bedrooms" },
        { key: "bathrooms", header: "Bathrooms" },
        { key: "balconies", header: "Balconies" },
        { key: "floors", header: "Floors" },
        { key: "furnishing", header: "Furnishing" },
        { key: "gems", header: "Gems" },
        { key: "postedDate", header: "Posted Date" },
    ]

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="font-medium text-xl p-2 pl-4">Exclusive Properties</h1>
                <div className="flex items-center gap-4">
                    <Input
                        placeholder="Search Anything"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="h-10 pl-9 border-2 bg-white"
                    />
                    <ExportButton
                        data={filteredExclusiveProperties as unknown as Record<string, unknown>[]}
                        columns={exportColumns}
                        filename="exclusive-listings"
                    />
                    <PropertiesFilter
                        filters={propertyFilters}
                        onFiltersChange={setPropertyFilters}
                        showBookmarkOption
                    />
                    <PropertiesSortDropdown sort={priceSort} onSortChange={setPriceSort} />
                </div>
            </div>

            <div className="flex gap-4 mt-4 px-2">
                <div>
                    {isLoading && <p className="text-sm text-gray-500">Loading exclusive properties...</p>}
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {!isLoading && !error && (
                        <PropertyGrid
                            properties={filteredExclusiveProperties}
                            variant="exclusive"
                            onEdit={(exclusivePropertyId) => router.push(`/property/exclusive-listings/${exclusivePropertyId}/edit`)}
                            onMarkAsSold={handleMarkAsSold}
                            onFavorite={handleToggleBookmark}
                        />
                    )}
                </div>
                {/* <div className="w-1/3">
                    <PendingApprovalList
                        title="Pending Exclusive Approvals"
                        approvals={mockPendingExclusiveApprovals}
                    />
                </div> */}
            </div>
        </div>
    )
}
