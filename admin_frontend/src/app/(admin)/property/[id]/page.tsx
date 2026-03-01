"use client"

import { PropertyImageCarousel } from "@/components/propertyDetails/propertyImageCarousel"
import { PropertyBrokerInfo } from "@/components/propertyDetails/propertyBrokerInfo"
import { PropertyActionBar } from "@/components/propertyDetails/propertyActionBar"
import { PropertyDetailsPanel } from "@/components/propertyDetails/propertyDetailsPanel"
import { PropertyAbout } from "@/components/propertyDetails/propertyAbout"
import type { BrokerInfoData } from "@/components/propertyDetails/propertyBrokerInfo"
import type { PropertyDetailsPanelData } from "@/components/propertyDetails/propertyDetailsPanel"

const mockImages = [
    "/largeBuilding2.png",
    "/largeBuilding.png",
    "/smallBuilding.png",
    "/largeBuilding2.png",
    "/largeBuilding.png",
    "/smallBuilding.png",
]

const mockBroker: BrokerInfoData = {
    name: "RealBro Exclusive",
    logoUrl: "/smallBuilding.png",
    isVerified: true,
    postedDate: "12 January, 2025",
}

const mockDetails: PropertyDetailsPanelData = {
    status: "Active",
    statusLabel: "Ready to move",
    title: "3BHK Flat in Arera Colony",
    location: "Arera Colony, Bhopal",
    tags: [
        { label: "Residential", icon: "residential" },
        { label: "Apartment / Flat", icon: "apartment" },
        { label: "0-1 Year", icon: "age" },
        { label: "Fully Furnished", icon: "furnishing" },
        { label: "East Facing", icon: "facing" },
    ],
    specs: {
        price: "42 Lakh",
        pricePerSqft: "₹2584/sqft",
        areaSqft: "1440 sqft",
        areaSqm: "132 sqm",
        rooms: 3,
        bathrooms: 2,
        balcony: 1,
        floors: 1,
    },
}

const mockDescription =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

export default function PropertyPage() {
    return (
        <div>
            <h1 className="font-medium text-xl p-2 pl-4">Property Details</h1>

            <div className="flex gap-6 mt-4 px-4">
                <div className="w-1/2">
                    <PropertyImageCarousel
                        images={mockImages}
                        isExclusive
                        gems={44588}
                    />
                    <PropertyBrokerInfo broker={mockBroker} />
                    <PropertyActionBar variant="exclusive" />
                </div>

                <div className="w-1/2">
                    <PropertyDetailsPanel data={mockDetails} />
                    <PropertyAbout description={mockDescription} />
                </div>
            </div>
        </div>
    )
}
