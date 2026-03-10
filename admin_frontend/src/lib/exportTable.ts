import * as XLSX from "xlsx"

export type ExportColumn = {
    key: string
    header: string
}

function getNestedValue(obj: Record<string, unknown>, key: string): unknown {
    if (key.includes(".")) {
        const parts = key.split(".")
        let val: unknown = obj
        for (const p of parts) {
            val = (val as Record<string, unknown>)?.[p]
        }
        return val
    }
    return obj[key]
}

function escapeCsvValue(value: unknown): string {
    if (value == null) return ""
    const str = String(value)
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`
    }
    return str
}

function triggerDownload(content: string | Blob, filename: string, mimeType: string) {
    const blob = typeof content === "string" ? new Blob([content], { type: mimeType }) : content
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}

/**
 * Export table data to CSV and trigger download.
 */
export function exportToCsv(
    data: Record<string, unknown>[],
    columns: ExportColumn[],
    filename: string
): void {
    if (!data.length || !columns.length) return

    const headers = columns.map((c) => c.header).join(",")
    const rows = data.map((row) =>
        columns.map((c) => escapeCsvValue(getNestedValue(row, c.key))).join(",")
    )
    const csv = [headers, ...rows].join("\n")
    const BOM = "\uFEFF"
    triggerDownload(BOM + csv, `${filename}.csv`, "text/csv;charset=utf-8")
}

/**
 * Export table data to XLSX and trigger download.
 */
export function exportToXlsx(
    data: Record<string, unknown>[],
    columns: ExportColumn[],
    filename: string
): void {
    if (!data.length || !columns.length) return

    const rows = data.map((row) =>
        columns.reduce(
            (acc, col) => {
                acc[col.header] = getNestedValue(row, col.key)
                return acc
            },
            {} as Record<string, unknown>
        )
    )
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1")
    const xlsxBuffer = XLSX.write(wb, { type: "array", bookType: "xlsx" })
    triggerDownload(
        new Blob([xlsxBuffer]),
        `${filename}.xlsx`,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
}
