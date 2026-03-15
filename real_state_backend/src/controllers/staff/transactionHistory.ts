import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

const reasonLabels: Record<string, string> = {
    GEM_REDEEM: "Gem Redeem",
    REFERRAL_BONUS_5_PERCENT: "Referral Reward",
    ACQUISITION_REWARD: "Exclusive Acquisition Reward",
    EXCLUSIVE_SALE_REWARD: "Exclusive Sale Reward",
    REDEMPTION: "Redemption",
};

function getPurposeLabel(reason: string): string {
    return reasonLabels[reason] ?? reason.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function getTransactionHistory(req: Request, res: Response) {
    try {
        const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const page = Math.max(Number(req.query.page ?? 1), 1);
        const limit = Math.min(Math.max(Number(req.query.limit ?? 10), 1), 100);
        const skip = (page - 1) * limit;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const where = {
            userId,
            request: { status: "APPROVED" as const },
        };

        const [transactions, total] = await Promise.all([
            prisma.gemTransaction.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    reason: true,
                    amount: true,
                    txnType: true,
                    balanceBefore: true,
                    balanceAfter: true,
                    createdAt: true,
                    request: {
                        select: { propertyId: true },
                    },
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                    createdByStaff: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            }),
            prisma.gemTransaction.count({ where }),
        ]);

        const data = transactions.map((txn) => {
            const isDebit = txn.txnType === "DEBIT";
            const amountStr = isDebit
                ? `-${txn.amount.toLocaleString()}`
                : txn.amount.toLocaleString();

            return {
                id: txn.id,
                userId,
                userName: `${txn.user.firstName} ${txn.user.lastName}`.trim(),
                purpose: getPurposeLabel(txn.reason),
                staffHandler: txn.createdByStaff
                    ? `${txn.createdByStaff.firstName} ${txn.createdByStaff.lastName}`.trim()
                    : "SYSTEM",
                amount: amountStr,
                amountDetails: {
                    txnType: txn.txnType,
                    balanceBefore: txn.balanceBefore,
                    balanceAfter: txn.balanceAfter,
                },
                dateTime: txn.createdAt.toLocaleString(),
                status: "Completed",
                propertyId: txn.request?.propertyId ?? null,
            };
        });

        return res.status(200).json({
            success: true,
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get transaction history error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}