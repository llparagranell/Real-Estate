import { GemTxnReason, GemTxnType } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

const reasonLabels: Record<GemTxnReason, string> = {
    ACQUISITION_REWARD: "Exclusive Acquisition Reward",
    EXCLUSIVE_SALE_REWARD: "Exclusive Sale Reward",
    REFERRAL_BONUS_5_PERCENT: "Referral Reward",
    REDEMPTION: "Redemption",
    GEM_REDEEM: "Gem Redeem",
};

function getPurposeLabel(reason: GemTxnReason): string {
    return reasonLabels[reason] ?? reason.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function getUserTransactionHistory(req: Request, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const page = Math.max(Number(req.query.page ?? 1), 1);
        const limit = Math.min(Math.max(Number(req.query.limit ?? 10), 1), 100);
        const skip = (page - 1) * limit;

        const reason = typeof req.query.reason === "string" ? req.query.reason : undefined;
        const txnType = typeof req.query.txnType === "string" ? req.query.txnType : undefined;

        const where: {
            userId: string;
            reason?: GemTxnReason;
            txnType?: GemTxnType;
        } = { userId };

        if (reason && Object.values(GemTxnReason).includes(reason as GemTxnReason)) {
            where.reason = reason as GemTxnReason;
        }

        if (txnType && Object.values(GemTxnType).includes(txnType as GemTxnType)) {
            where.txnType = txnType as GemTxnType;
        }

        const [user, transactions, total] = await Promise.all([
            prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    points: true,
                    firstName: true,
                    lastName: true,
                },
            }),
            prisma.gemTransaction.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    requestId: true,
                    reason: true,
                    txnType: true,
                    amount: true,
                    balanceBefore: true,
                    balanceAfter: true,
                    createdAt: true,
                    request: {
                        select: {
                            status: true,
                            propertyId: true,
                            type: true,
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

        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const data = transactions.map((transaction) => ({
            id: transaction.id,
            requestId: transaction.requestId,
            purpose: getPurposeLabel(transaction.reason),
            reason: transaction.reason,
            txnType: transaction.txnType,
            amount: transaction.amount,
            signedAmount: transaction.txnType === "DEBIT" ? -transaction.amount : transaction.amount,
            balanceBefore: transaction.balanceBefore,
            balanceAfter: transaction.balanceAfter,
            status: transaction.request.status,
            requestType: transaction.request.type,
            propertyId: transaction.request.propertyId,
            staffHandler: transaction.createdByStaff
                ? `${transaction.createdByStaff.firstName} ${transaction.createdByStaff.lastName}`.trim()
                : "SYSTEM",
            createdAt: transaction.createdAt,
        }));

        return res.status(200).json({
            success: true,
            summary: {
                userId: user.id,
                userName: `${user.firstName} ${user.lastName}`.trim(),
                currentBalance: user.points,
                totalTransactions: total,
            },
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get user transaction history error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}