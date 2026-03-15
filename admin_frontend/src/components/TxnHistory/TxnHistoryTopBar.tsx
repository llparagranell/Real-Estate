"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface TxnHistoryTopBarProps {
    userId: string
    userName?: string
}

export function TxnHistoryTopBar({ userId, userName }: TxnHistoryTopBarProps) {
    const router = useRouter()
    const displayName = userName || "User"

    return (
        <div className="flex items-center gap-4 mb-4">
            <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-muted-foreground hover:text-foreground"
                onClick={() => router.push(`/user/${userId}`)}
            >
                <ArrowLeft className="size-4" />
                Back to {displayName}
            </Button>
        </div>
    )
}
