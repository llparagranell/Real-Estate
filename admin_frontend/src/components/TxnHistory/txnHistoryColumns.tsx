"use client"

import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Eye, Gem } from "lucide-react"
import { ArrowUpDown } from "lucide-react"

export type TxnHistoryRow = {
    purpose: string
    staffHandler: string
    amount: string
    details: string
    propertyId: string | null
}

export const txnHistoryColumns: ColumnDef<TxnHistoryRow>[] = [
    {
        accessorKey: "purpose",
        header: () => (
            <Button variant="ghost" className="text-lg">
                Purpose
            </Button>
        ),
        cell: ({ row }) => (
            <div className="font-medium text-blue-500">{row.original.purpose}</div>
        ),
    },
    {
        accessorKey: "staffHandler",
        header: "Staff Handler",
        cell: ({ row }) => (
            <div className="font-semibold text-blue-500">{row.original.staffHandler}</div>
        ),
    },
    {
        accessorKey: "amount",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="text-lg"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Amount
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const { amount } = row.original
            const isDeduct = String(amount).startsWith("-")
            return (
                <div
                    className={`flex items-center gap-1 font-medium pl-5 ${isDeduct ? "text-red-500" : "text-green-500"}`}
                >
                    <Gem className={`size-4 ${isDeduct ? "text-red-500" : "text-green-500"}`} />
                    {amount}
                </div>
            )
        },
    },
    {
        accessorKey: "details",
        header: "Details",
        cell: ({ row }) => <div className="font-medium">{row.original.details}</div>,
    },
    {
        id: "propertyDetail",
        header: "Property Details",
        cell: ({ row }) => {
            const { propertyId } = row.original
            const hasProperty = Boolean(propertyId)
            return (
                <ViewPropertyButton propertyId={propertyId} hasProperty={hasProperty} />
            )
        },
    },
]

function ViewPropertyButton({
    propertyId,
    hasProperty,
}: {
    propertyId: string | null
    hasProperty: boolean
}) {
    const router = useRouter()
    return (
        <div
            className={`flex items-center gap-1 justify-center ${!hasProperty ? "cursor-not-allowed" : ""}`}
        >
            <Button
                variant="ghost"
                size="icon"
                className={
                    hasProperty
                        ? "h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                        : "h-8 w-8 text-gray-400 opacity-50 cursor-not-allowed pointer-events-none"
                }
                onClick={() => hasProperty && propertyId && router.push(`/property/${propertyId}`)}
                disabled={!hasProperty}
            >
                <Eye className="size-4" />
            </Button>
        </div>
    )
}
