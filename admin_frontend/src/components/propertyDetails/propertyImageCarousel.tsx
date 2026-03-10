"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Crown, Gem, ImageIcon } from "lucide-react"

/** User-facing display status for property image overlay */
export type PropertyDisplayStatus = "AVAILABLE" | "SOLD" | "UNLISTED"

interface PropertyImageCarouselProps {
    images: string[]
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

export function PropertyImageCarousel({ images, status = "AVAILABLE", isExclusive, gems }: PropertyImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    return (
        <div className="relative rounded-xl overflow-hidden bg-gray-100">
            <Image
                src={images[currentIndex]}
                alt={`Property image ${currentIndex + 1}`}
                width={600}
                height={400}
                className="w-full h-[340px] object-cover"
            />

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
                    <ImageIcon className="size-3.5" />
                    {currentIndex + 1}/{images.length}
                </span>
            </div>
        </div>
    )
}
