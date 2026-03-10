"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Upload, ChevronDown } from "lucide-react"
import { exportToCsv, exportToXlsx, type ExportColumn } from "@/lib/exportTable"

export type { ExportColumn } from "@/lib/exportTable"

type ExportButtonProps = {
    data?: Record<string, unknown>[]
    columns?: ExportColumn[]
    filename?: string
}

export function ExportButton({ data, columns, filename = "export" }: ExportButtonProps) {
    const hasExportData = data && columns && columns.length > 0 && data.length > 0

    const handleExportCsv = () => {
        if (!hasExportData) return
        exportToCsv(data!, columns!, filename ?? "export")
    }

    const handleExportXlsx = () => {
        if (!hasExportData) return
        exportToXlsx(data!, columns!, filename ?? "export")
    }

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="hover:bg-zinc-50 gap-2 shadow-none border-2 h-10">
                        <Upload className="size-4 text-blue-500" />
                        Export
                        <ChevronDown className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            className="font-medium"
                            onClick={handleExportXlsx}
                            disabled={!hasExportData}
                        >
                            Export as XLSX
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="font-medium"
                            onClick={handleExportCsv}
                            disabled={!hasExportData}
                        >
                            Export as CSV
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
