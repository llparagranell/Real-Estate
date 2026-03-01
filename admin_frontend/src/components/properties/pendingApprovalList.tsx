"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PendingApprovalCard, PendingApprovalData } from "./pendingApprovalCard"

interface PendingApprovalListProps {
    approvals: PendingApprovalData[]
    onClick?: (id: string) => void
}

export function PendingApprovalList({ approvals, onClick }: PendingApprovalListProps) {
    return (
        <Card className="border py-0 gap-0 h-full">
            <CardHeader className="px-4 py-3">
                <CardTitle className="text-base font-semibold">
                    Pending Property Approvals
                </CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-2">
                <div className="overflow-y-auto space-y-1" style={{ maxHeight: "calc(100vh - 200px)" }}>
                    {approvals.map((approval) => (
                        <PendingApprovalCard
                            key={approval.id}
                            property={approval}
                            onClick={onClick}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}