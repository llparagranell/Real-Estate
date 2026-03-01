"use client"

import Image from "next/image"
import { MapPin, ChevronRight } from "lucide-react"

export interface PendingApprovalData {
    id: string
    title: string
    location: string
    imageUrl: string
}

interface PendingApprovalCardProps {
    property: PendingApprovalData
    onClick?: (id: string) => void
}

export function PendingApprovalCard({ property, onClick }: PendingApprovalCardProps) {
    return (
        <button
            onClick={() => onClick?.(property.id)}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition group"
        >
            <Image
                src={property.imageUrl}
                alt={property.title}
                width={48}
                height={48}
                className="w-12 h-12 rounded-lg object-cover shrink-0"
            />
            <div className="flex-1 text-left min-w-0">
                <h4 className="text-sm font-semibold truncate">{property.title}</h4>
                <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="size-3 shrink-0" />
                    <span className="truncate">{property.location}</span>
                </p>
            </div>
            <ChevronRight className="size-4 text-gray-400 group-hover:text-gray-600 shrink-0" />
        </button>
    )
}
