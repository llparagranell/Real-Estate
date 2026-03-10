"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { PropertyGrid } from "@/components/properties/propertyGrid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter } from "@/components/appointments/filterAppointments"
import { ExportButton } from "@/components/role_management/exportButton"
import { ArrowUpDown, ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import type { PropertyCardData } from "@/components/properties/propertyCard"
import { api } from "@/lib/api"

type Tab = "pending-approvals" | "pending-exclusive"

export default function PendingApprovalsPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState<Tab>("pending-approvals")
    const [globalFilter, setGlobalFilter] = useState("")
    const [properties, setProperties] = useState<PropertyCardData[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const isSuperAdmin = user?.role === "SUPER_ADMIN"

    useEffect(() => {
        let isMounted = true

        const fetchProperties = async () => {
            const endpoint =
                activeTab === "pending-approvals"
                    ? "/staff/properties/pending-approvals"
                    : "/staff/properties/pending-exclusive"

            try {
                setIsLoading(true)
                setError(null)
                const response = await api.get<{ success: boolean; data: PropertyCardData[] }>(endpoint, {
                    params: { page: 1, limit: 50 },
                })

                if (!isMounted) return
                setProperties(response.data.data ?? [])
            } catch (err) {
                if (!isMounted) return
                setError("Failed to load properties")
                setProperties([])
                if (activeTab === "pending-exclusive" && (err as { response?: { status?: number } })?.response?.status === 403) {
                    setError("You do not have permission to view this section")
                }
                console.error("Failed to fetch pending properties:", err)
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        fetchProperties()
        return () => {
            isMounted = false
        }
    }, [activeTab])

    const filteredProperties = useMemo(() => {
        const query = globalFilter.trim().toLowerCase()
        if (!query) return properties
        return properties.filter(
            (p) =>
                p.title.toLowerCase().includes(query) ||
                p.location.toLowerCase().includes(query) ||
                p.status.toLowerCase().includes(query),
        )
    }, [properties, globalFilter])

    const handleEdit = (propertyId: string) => {
        router.push(`/property/${propertyId}`)
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="font-medium text-xl p-2 pl-4">Pending Approvals</h1>
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

            <div className="flex items-center gap-2 py-2  justify-center mt-2 border-b bg-zinc-200 rounded-xl w-[352px]">
                <Button
                    variant={activeTab === "pending-approvals" ? "default" : "ghost"}
                    size="sm"
                    className={activeTab === "pending-approvals" ? "bg-blue-600 hover:bg-blue-700" : ""}
                    onClick={() => setActiveTab("pending-approvals")}
                >
                    Pending Approvals
                </Button>
                {isSuperAdmin && (
                    <Button
                        variant={activeTab === "pending-exclusive" ? "default" : "ghost"}
                        size="sm"
                        className={activeTab === "pending-exclusive" ? "bg-blue-600 hover:bg-blue-700" : ""}
                        onClick={() => setActiveTab("pending-exclusive")}
                    >
                        Pending Exclusive Properties
                    </Button>
                )}
            </div>

            <div className="flex gap-4 mt-4 px-2">
                {isLoading && <p className="text-sm text-gray-500 px-4">Loading...</p>}
                {error && <p className="text-sm text-red-500 px-4">{error}</p>}
                {!isLoading && !error && (
                    <PropertyGrid
                        properties={filteredProperties}
                        variant="default"
                        onEdit={handleEdit}
                    />
                )}
            </div>
        </div>
    )
}
