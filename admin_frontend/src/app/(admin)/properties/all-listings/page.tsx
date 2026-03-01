"use client"

import { useState } from "react"
import { Filter } from "@/components/appointments/filterAppointments"
import { ExportButton } from "@/components/role_management/exportButton"
import { Input } from "@/components/ui/input"
import { PropertyGrid } from "@/components/properties/propertyGrid"
import { PendingApprovalList } from "@/components/properties/pendingApprovalList"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ChevronDown } from "lucide-react"
import type { PropertyCardData } from "@/components/properties/propertyCard"
import type { PendingApprovalData } from "@/components/properties/pendingApprovalCard"

const mockProperties: PropertyCardData[] = [
    {
        id: "1",
        title: "3BHK Flat in Arera Colony",
        location: "Arera Colony, Bhopal",
        price: "42 Lakh",
        area: "1440 sqft",
        bedrooms: 3,
        bathrooms: 2,
        balconies: 1,
        furnishing: "Fully Furnished",
        status: "Active",
        imageUrl: "/largeBuilding2.png",
        postedDate: "12 January, 2025",
    },
    {
        id: "2",
        title: "3BHK Flat in Arera Colony",
        location: "Arera Colony, Bhopal",
        price: "42 Lakh",
        area: "1440 sqft",
        bedrooms: 3,
        bathrooms: 2,
        balconies: 1,
        furnishing: "Fully Furnished",
        status: "Active",
        imageUrl: "/largeBuilding2.png",
        postedDate: "12 January, 2025",
        isFeatured: true,
        gems: 44588,
    },
    {
        id: "3",
        title: "3BHK Flat in Arera Colony",
        location: "Arera Colony, Bhopal",
        price: "42 Lakh",
        area: "1440 sqft",
        bedrooms: 3,
        bathrooms: 2,
        balconies: 1,
        furnishing: "Semi Furnished",
        status: "Active",
        imageUrl: "/largeBuilding2.png",
        postedDate: "12 January, 2025",
    },
    {
        id: "4",
        title: "3BHK Flat in Arera Colony",
        location: "Arera Colony, Bhopal",
        price: "42 Lakh",
        area: "1440 sqft",
        bedrooms: 3,
        bathrooms: 2,
        balconies: 1,
        furnishing: "Fully Furnished",
        status: "Active",
        imageUrl: "/largeBuilding2.png",
        postedDate: "12 January, 2025",
    },
    {
        id: "5",
        title: "2BHK Apartment in MP Nagar",
        location: "MP Nagar, Bhopal",
        price: "35 Lakh",
        area: "1100 sqft",
        bedrooms: 2,
        bathrooms: 1,
        balconies: 1,
        furnishing: "Unfurnished",
        status: "Sold",
        imageUrl: "/largeBuilding2.png",
        postedDate: "5 February, 2025",
    },
    {
        id: "6",
        title: "4BHK Villa in Hoshangabad Road",
        location: "Hoshangabad Road, Bhopal",
        price: "1.2 Cr",
        area: "2800 sqft",
        bedrooms: 4,
        bathrooms: 3,
        balconies: 2,
        furnishing: "Fully Furnished",
        status: "Active",
        imageUrl: "/largeBuilding2.png",
        postedDate: "20 January, 2025",
        isFeatured: true,
        gems: 12500,
    },
]

const mockPendingApprovals: PendingApprovalData[] = [
    { id: "p1", title: "3BHK Villa in Arera Colony", location: "Arera Colony, Bhopal", imageUrl: "/smallBuilding.png" },
    { id: "p2", title: "3BHK Villa in Arera Colony", location: "Arera Colony, Bhopal", imageUrl: "/largeBuilding.png" },
    { id: "p3", title: "3BHK Villa in Arera Colony", location: "Arera Colony, Bhopal", imageUrl: "/largeBuilding.png" },
    { id: "p4", title: "3BHK Villa in Arera Colony", location: "Arera Colony, Bhopal", imageUrl: "/largeBuilding.png" },
    { id: "p5", title: "3BHK Villa in Arera Colony", location: "Arera Colony, Bhopal", imageUrl: "/largeBuilding.png" },
    { id: "p6", title: "3BHK Villa in Arera Colony", location: "Arera Colony, Bhopal", imageUrl: "/largeBuilding.png" },
    { id: "p6", title: "3BHK Villa in Arera Colony", location: "Arera Colony, Bhopal", imageUrl: "/largeBuilding.png" },
    { id: "p6", title: "3BHK Villa in Arera Colony", location: "Arera Colony, Bhopal", imageUrl: "/largeBuilding.png" },
]

export default function AllPropertiesPage() {
    const [globalFilter, setGlobalFilter] = useState("")

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="font-medium text-xl p-2 pl-4">All Listings</h1>
                <div className="flex items-center gap-4">
                    <Input
                        placeholder="Search Anything"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="h-10 pl-9 border-2 bg-white"
                    />
                    <ExportButton />
                    <Filter />
                    <Button variant="outline" className="hover:bg-zinc-50 gap-2 shadow-none border-2 h-10">
                        <ArrowUpDown className="size-4 text-blue-500" />
                        Sort by
                        <ChevronDown className="size-4" />
                    </Button>
                </div>
            </div>

            <div className="flex gap-4 mt-4 px-2">
                <div className="w-2/3">
                    <PropertyGrid properties={mockProperties} />
                </div>
                <div className="w-1/3">
                    <PendingApprovalList approvals={mockPendingApprovals} />
                </div>
            </div>
        </div>
    )
}
