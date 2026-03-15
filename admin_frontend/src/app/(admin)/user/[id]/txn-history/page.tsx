"use client"

import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { api } from "@/lib/api"
import { txnHistoryColumns } from "@/components/TxnHistory/txnHistoryColumns"
import { TxnHistoryDataTable } from "@/components/TxnHistory/TxnHistoryDataTable"
import { TxnHistoryTopBar } from "@/components/TxnHistory/TxnHistoryTopBar"
import type { TxnHistoryRow } from "@/components/TxnHistory/txnHistoryColumns"

type TransactionHistoryResponse = {
    success: boolean
    data: Array<{
        id: string
        userName?: string
        purpose: string
        staffHandler: string
        amount: string
        dateTime: string
        propertyId: string | null
    }>
    pagination: { total: number; page: number; limit: number; totalPages: number }
}

export default function TxnHistoryPage() {
    const params = useParams<{ id: string }>()
    const userId = Array.isArray(params?.id) ? params.id[0] : params?.id
    const [data, setData] = useState<TxnHistoryRow[]>([])
    const [userName, setUserName] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchTransactions = useCallback(async () => {
        if (!userId) return
        try {
            setIsLoading(true)
            setError(null)
            const response = await api.get<TransactionHistoryResponse>(
                `/staff/users/${userId}/transaction-history`,
                { params: { page: 1, limit: 100 } }
            )
            const raw = response.data.data ?? []
            const mapped: TxnHistoryRow[] = raw.map((txn) => ({
                purpose: txn.purpose,
                staffHandler: txn.staffHandler,
                amount: txn.amount,
                details: txn.dateTime,
                propertyId: txn.propertyId ?? null,
            }))
            setData(mapped)
            const first = raw[0] as { userName?: string } | undefined
            setUserName(first?.userName ?? null)
        } catch (err) {
            console.error("Failed to fetch transaction history:", err)
            setError("Failed to load transaction history")
        } finally {
            setIsLoading(false)
        }
    }, [userId])

    useEffect(() => {
        void fetchTransactions()
    }, [fetchTransactions])

    if (!userId) {
        return <div className="p-4 text-center text-red-500">Invalid user</div>
    }

    return (
        <div className="p-4 mt-4">
            <TxnHistoryTopBar userId={userId} userName={userName ?? undefined} />
            {isLoading && (
                <p className="text-sm text-gray-500 px-4 mt-4">Loading transaction history...</p>
            )}
            {error && (
                <p className="text-sm text-red-500 px-4 mt-4">{error}</p>
            )}
            {!isLoading && !error && (
                <TxnHistoryDataTable columns={txnHistoryColumns} data={data} />
            )}
        </div>
    )
}
