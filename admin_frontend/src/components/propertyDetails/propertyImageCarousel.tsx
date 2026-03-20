"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Crown, Gem, ImageIcon, Video } from "lucide-react"

export type PropertyStatus =
    | "ACTIVE"
    | "UNLISTED"
    | "SOLDOFFLINE"
    | "SOLDTOREALBRO"
    | "SOLDFROMLISTINGS"
    | "DRAFT"
    | "SOLDEXCLUSIVEPROPERTY"
    | "PENDING_EXCLUSIVE_ACQUISITION"

export type ExclusivePropertyStatus = "ACTIVE" | "SOLD_OUT" | "UNLISTED"

export type MediaItem = { url: string; mediaType: string }

interface PropertyImageCarouselProps {
    /** @deprecated Use media instead. Fallback when media is empty. */
    images?: string[]
    /** Media items (images + videos) ordered by display order */
    media?: MediaItem[]
    /** Normal property status (used when not exclusive) */
    propertyStatus?: PropertyStatus | null
    /** Exclusive property status (used when property is exclusive) */
    exclusiveStatus?: ExclusivePropertyStatus | null
    /** When set, show exclusive badge and gems */
    isExclusive?: boolean
    /** Gems count for exclusive properties (shown top-left with Crown + gems) */
    gems?: number
}

function getStatusBadge(
    isExclusive: boolean,
    propertyStatus?: PropertyStatus | null,
    exclusiveStatus?: ExclusivePropertyStatus | null
): { label: string; className: string } {
    const formatStatusLabel = (value: string): string => {
        const knownLabels: Record<string, string> = {
            SOLDTOREALBRO: "SOLD TO REAL BRO",
            SOLDFROMLISTINGS: "SOLD FROM LISTINGS",
            SOLDOFFLINE: "SOLD OFFLINE",
            SOLDEXCLUSIVEPROPERTY: "SOLD EXCLUSIVE PROPERTY",
            PENDING_EXCLUSIVE_ACQUISITION: "PENDING EXCLUSIVE ACQUISITION",
            SOLD_OUT: "SOLD OUT",
        }
        if (knownLabels[value]) return knownLabels[value]
        return value.replace(/_/g, " ").replace(/\s+/g, " ").trim()
    }

    if (isExclusive) {
        const status = exclusiveStatus ?? "ACTIVE"
        if (status === "SOLD_OUT") return { label: formatStatusLabel("SOLD_OUT"), className: "bg-red-600" }
        if (status === "UNLISTED") return { label: formatStatusLabel("UNLISTED"), className: "bg-gray-600" }
        return { label: formatStatusLabel("ACTIVE"), className: "bg-green-600" }
    }

    const status = propertyStatus ?? "ACTIVE"
    if (status === "ACTIVE") return { label: formatStatusLabel("ACTIVE"), className: "bg-green-600" }
    if (status === "UNLISTED") return { label: formatStatusLabel("UNLISTED"), className: "bg-gray-600" }
    if (status === "DRAFT") return { label: formatStatusLabel("DRAFT"), className: "bg-yellow-600" }
    if (status === "PENDING_EXCLUSIVE_ACQUISITION") {
        return { label: formatStatusLabel("PENDING_EXCLUSIVE_ACQUISITION"), className: "bg-blue-600" }
    }
    return { label: formatStatusLabel(status), className: "bg-red-600" }
}

function resolveMediaItems(media?: MediaItem[], images?: string[]): MediaItem[] {
    if (media?.length) {
        return media
    }
    if (images?.length) {
        return images.map((url) => ({ url, mediaType: "IMAGE" }))
    }
    return []
}

export function PropertyImageCarousel({
    images,
    media,
    propertyStatus,
    exclusiveStatus,
    isExclusive = false,
    gems,
}: PropertyImageCarouselProps) {
    const items = resolveMediaItems(media, images)
    const [currentIndex, setCurrentIndex] = useState(0)
    const currentItem = items[currentIndex]
    const isVideo = currentItem?.mediaType === "VIDEO"
    const badge = getStatusBadge(isExclusive, propertyStatus, exclusiveStatus)

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))
    }

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1))
    }

    if (items.length === 0) return null

    return (
        <div className="relative rounded-xl overflow-hidden bg-gray-100">
            {isVideo ? (
                <video
                    key={currentItem.url}
                    src={currentItem.url}
                    controls
                    playsInline
                    className="w-full h-[340px] object-cover"
                />
            ) : (
                <Image
                    src={currentItem.url}
                    alt={`Property image ${currentIndex + 1}`}
                    width={600}
                    height={400}
                    className="w-full h-[340px] object-cover"
                    loading={currentIndex === 0 ? "eager" : "lazy"}
                    priority={currentIndex === 0}
                />
            )}

            <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className={`${badge.className} text-white text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wide`}>
                    {badge.label}
                </span>
                {isExclusive && (
                    <span className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 w-fit">
                        <Crown className="size-3.5" />
                        {gems != null ? (
                            <>
                                <Gem className="size-3.5" />
                                {gems.toLocaleString()} Gems
                            </>
                        ) : (
                            "Exclusive"
                        )}
                    </span>
                )}
            </div>

            <button
                onClick={goToPrevious}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition shadow-sm"
            >
                <ChevronLeft className="size-5 text-gray-700" />
            </button>

            <button
                onClick={goToNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition shadow-sm"
            >
                <ChevronRight className="size-5 text-gray-700" />
            </button>

            <div className="absolute bottom-4 right-4">
                <span className="bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5">
                    {isVideo ? <Video className="size-3.5" /> : <ImageIcon className="size-3.5" />}
                    {currentIndex + 1}/{items.length}
                </span>
            </div>
        </div>
    )
}
