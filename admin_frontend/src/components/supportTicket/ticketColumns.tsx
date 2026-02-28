"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Check, Clock, EyeOff, LocationEditIcon } from "lucide-react"
import { ArrowUpDown } from "lucide-react"

export type TicketTableInterface = {
    userName: string;
    email: string;
    description: string;
    date: string;
    status: string;
}

export const columns: ColumnDef<TicketTableInterface>[] = [
    {
        accessorKey: "userName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className=""
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    User Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const user = row.original
            return <div className="font-medium pl-4">{user.userName}</div>
        },
    },
    {
        accessorKey: "email",
        header: () => {
            return (
                <Button
                    variant="ghost"
                    className=""
                >
                    Email
                </Button>
            )
        },
        cell: ({ row }) => {
            const user = row.original
            return <div className="font-medium text-blue-500">{user.email}</div>

        }
    },
    {
        accessorKey: "description",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className=""
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Description
                </Button>
            )
        },
        cell: ({ row }) => {
            const user = row.original;
            const truncatedDescription = user.description.length > 30 ? user.description.slice(0, 30) + '...' : user.description;
            return <div className="font-medium">
                {truncatedDescription}</div>
        },
    },
    {
        accessorKey: "date",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className=""
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const user = row.original
            return <div className="font-medium ">{user.date}</div>
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const { status } = row.original

            const statusConfig: Record<
                string,
                { className: string; icon: React.ReactNode }
            > = {
                Active: {
                    className: "text-green-700",
                    icon: <Clock className="size-4" />,
                },
                Resolved: {
                    className: "text-blue-500",
                    icon: <Check className="size-4" />,
                },
                Unseen: {
                    className: "text-orange-700",
                    icon: <EyeOff className="size-4" />,
                },
            }

            const config = statusConfig[status]

            return (
                <div
                    className={`flex items-center gap-1 py-1 rounded-full font-medium w-fit ${config?.className || "bg-gray-100 text-gray-700 "
                        }`}
                >
                    {config?.icon}
                    {status}
                </div>
            )
        },
    },
]
