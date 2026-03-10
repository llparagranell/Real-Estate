"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Eye, Pencil, Trash2, OctagonMinus } from "lucide-react"
import { ArrowUpDown } from "lucide-react"

export type RoleManagement = {
    id: string;
    username: string;
    email: string;
    role: string;
    blockDate?: string;
}

export const columns: ColumnDef<RoleManagement>[] = [
    {
        accessorKey: "username",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    User Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const user = row.original
            return <div className="font-medium pl-4">{user.username}</div>
        },
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const user = row.original
            return <div className="font-medium text-blue-500">{user.email}</div>

        }

    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const user = row.original
            return <div className="font-semibold text-blue-500">{user.role}</div>
        },
    },
    {
        accessorKey: "blockDate",
        header: "Block Date",
        cell: ({ row }) => {
            const user = row.original
            return <div className="font-medium">{user.blockDate}</div>
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const user = row.original

            return (
                <div className="flex items-center gap-1">
                    {/* <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                        onClick={() => console.log("View", user)}
                    >
                        <Eye className="size-4" />
                    </Button> */}
                    <Link
                        href={`/role-management/edit-staff/${user.id}`}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-md text-amber-600 hover:text-amber-800 hover:bg-amber-100"
                    >
                        <Pencil className="size-4" />
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-orange-600 hover:text-orange-800 hover:bg-orange-100"
                        onClick={() => console.log("Block", user)}
                    >
                        <OctagonMinus className="size-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-100"
                        onClick={() => console.log("Delete", user)}
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            )
        },
    },
]