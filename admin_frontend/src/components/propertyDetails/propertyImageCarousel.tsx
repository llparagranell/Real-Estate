"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Crown, Gem, ImageIcon, Video } from "lucide-react"

/** User-facing display status for property image overlay */
export type PropertyDisplayStatus = "AVAILABLE" | "SOLD" | "UNLISTED"

export type MediaItem = { url: string; mediaType: string }

interface PropertyImageCarouselProps {
    /** @deprecated Use media instead. Fallback when media is empty. */
    images?: string[]
    /** Media items (images + videos) ordered by display order */
    media?: MediaItem[]
    /** Property display status for overlay badge */
    status?: PropertyDisplayStatus
    /** When set, show exclusive badge and gems */
    isExclusive?: boolean
    /** Gems count for exclusive properties (shown top-left with Crown + gems) */
    gems?: number
}

const statusStyles: Record<PropertyDisplayStatus, string> = {
    AVAILABLE: "bg-green-600",
    SOLD: "bg-red-600",
    UNLISTED: "bg-gray-600",
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

export function PropertyImageCarousel({ images, media, status = "AVAILABLE", isExclusive, gems }: PropertyImageCarouselProps) {
    const items = resolveMediaItems(media, images)
    const [currentIndex, setCurrentIndex] = useState(0)
    const currentItem = items[currentIndex]
    const isVideo = currentItem?.mediaType === "VIDEO"

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
                {status && (
                    <span className={`${statusStyles[status]} text-white text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wide`}>
                        {status}
                    </span>
                )}
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
