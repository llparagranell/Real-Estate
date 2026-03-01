"use client"

import Image from "next/image"
import { CalendarDays, BadgeCheck } from "lucide-react"

export interface BrokerInfoData {
    name: string
    logoUrl: string
    isVerified: boolean
    postedDate: string
}

interface PropertyBrokerInfoProps {
    broker: BrokerInfoData
}

export function PropertyBrokerInfo({ broker }: PropertyBrokerInfoProps) {
    return (
        <div className="flex items-center gap-3 mt-4">
            <Image
                src={broker.logoUrl}
                alt={broker.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-xl object-cover"
            />
            <div className="flex-1">
                <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm">{broker.name}</span>
                    {broker.isVerified && (
                        <BadgeCheck className="size-4 text-blue-500" />
                    )}
                </div>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                <span>Posted on</span>
                <CalendarDays className="size-3.5" />
                <span className="font-medium">{broker.postedDate}</span>
            </div>
        </div>
    )
}
