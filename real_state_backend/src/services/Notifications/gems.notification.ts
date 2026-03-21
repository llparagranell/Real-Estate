import { NotificationType, Prisma } from "@prisma/client";

export function gemRequestNotification(input: {
    userId: string;
    requestedGems: number;
    propertyName?: string | null;
}): {
    type: NotificationType;
    title: string;
    description: string;
    data: Prisma.InputJsonValue;
} {
    const propertyName = input.propertyName ?? "N/A";

    return {
        type: NotificationType.GENERIC,
        title: "Gem Reward Update",
        description: `Your reward request for '${input.requestedGems}' under Property '${propertyName}' has been received by Realbro and will be processed in 1-3 working days.`,
        data: {
            action: "gem_request_received",
            userId: input.userId,
            requestedGems: input.requestedGems,
            propertyName,
        },
    };
}

export function gemRequestApprovalNotification(input: {
    userId: string;
    approvedGems: number;
    propertyName?: string | null;
}): {
    type: NotificationType;
    title: string;
    description: string;
    data: Prisma.InputJsonValue;
} {
    const propertyName = input.propertyName ?? "your property";

    return {
        type: NotificationType.GENERIC,
        title: `${input.approvedGems} Gems Credited!`,
        description: `Congratulations! Your reward for selling '${propertyName}' has been added to your account.`,
        data: {
            action: "gem_request_approved",
            userId: input.userId,
            approvedGems: input.approvedGems,
            propertyName,
        },
    };
}

