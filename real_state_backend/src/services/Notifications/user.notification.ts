import { NotificationType, Prisma } from "@prisma/client";

export function verificationNotification(input: { userId: string }): {
    type: NotificationType;
    title: string;
    description: string;
    data: Prisma.InputJsonValue;
} {
    return {
        type: NotificationType.USER_VERIFIED,
        title: "Verification Complete 🎉",
        description: "Your identity has been verified as a Seller. Thanks for building trust in the Realbro community!",
        data: {
            action: "user_verified",
            userId: input.userId,
        },
    };
}

export function BlueTickNotification(input: { userId: string }): {
    type: NotificationType;
    title: string;
    description: string;
    data: Prisma.InputJsonValue;
} {
    return {
        type: NotificationType.BLUE_TICK_EARNED,
        title: "Blue Tick Earned 🎉",
        description: "Congratulations! You've earned a blue tick for your contributions to the Realbro Community.",
        data: {
            action: "blue_tick_earned",
            userId: input.userId,
        },
    };
}

export function updateUserProfiledNotification(input: { userId: string }): {
    type: NotificationType;
    title: string;
    description: string;
    data: Prisma.InputJsonValue;
} {
    return {
        type: NotificationType.PROFILE_UPDATED,
        title: "Profile Updated",
        description: "Your profile information has been successfully updated by realbro.",
        data: {
            action: "profile_updated",
            userId: input.userId,
        },
    };
};

export function accountBlockedNotification(input: { userId: string }): {
    type: NotificationType;
    title: string;
    description: string;
    data: Prisma.InputJsonValue;
} {
    return {
        type: NotificationType.ACCOUNT_BLOCKED,
        title: "Account Blocked ⚠️",
        description: "Your account has been suspended. To resolve this, contact: contact@realbro.io | +91-80856-71414",
        data: {
            action: "account_blocked",
            userId: input.userId,
        },
    };
};

export function adharVerificationRejectedNotification(input: { userId: string }): {
    type: NotificationType;
    title: string;
    description: string;
    data: Prisma.InputJsonValue;
} {
    return {
        type: NotificationType.ADHAR_VERIFICATION_REJECTED,
        title: "Adhar Verification Failed ⚠️",
        description: "Your Adhar verification was rejected. Please re-submit your document with correct information.",
        data: {
            action: "adhar_verification_rejected",
            userId: input.userId,
        },
    };
};

export function panVerificationRejectedNotification(input: { userId: string }): {
    type: NotificationType;
    title: string;
    description: string;
    data: Prisma.InputJsonValue;
} {
    return {
        type: NotificationType.PAN_VERIFICATION_REJECTED,
        title: "PAN Verification Failed ⚠️",
        description: "Your PAN verification was rejected. Please re-submit your document with correct information.",
        data: {
            action: "pan_verification_rejected",
            userId: input.userId,
        },
    };
};
