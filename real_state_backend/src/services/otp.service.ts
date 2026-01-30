import { prisma } from "../config/prisma";
import { OtpType } from "@prisma/client";

const OTP_EXPIRY_MINUTES = 5;
const OTP_LENGTH = 6;

export function generateOtpCode(length: number = OTP_LENGTH): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
}

export async function createOtp(userId: string, type: OtpType) {
    // Revoke any existing OTPs of the same type for this user
    await prisma.otp.updateMany({
        where: {
            userId,
            type,
            isRevoked: false
        },
        data: {
            isRevoked: true
        }
    });

    const code = generateOtpCode();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    const otp = await prisma.otp.create({
        data: {
            code,
            type,
            expiresAt,
            userId
        }
    });

    return { otp, code };
}

export async function verifyOtp(userId: string, code: string, type: OtpType) {
    const otp = await prisma.otp.findFirst({
        where: {
            userId,
            code,
            type,
            isRevoked: false,
            expiresAt: { gt: new Date() }
        }
    });

    if (!otp) {
        return { valid: false, message: "Invalid or expired OTP" };
    }

    // Mark OTP as used (revoked)
    await prisma.otp.update({
        where: { id: otp.id },
        data: { isRevoked: true }
    });

    return { valid: true, message: "OTP verified successfully" };
}

export async function revokeOtp(otpId: string) {
    return prisma.otp.update({
        where: { id: otpId },
        data: { isRevoked: true }
    });
}

export async function revokeAllUserOtps(userId: string, type?: OtpType) {
    return prisma.otp.updateMany({
        where: {
            userId,
            isRevoked: false,
            ...(type && { type })
        },
        data: {
            isRevoked: true
        }
    });
}

export async function cleanupExpiredOtps() {
    return prisma.otp.deleteMany({
        where: {
            OR: [
                { expiresAt: { lt: new Date() } },
                { isRevoked: true }
            ]
        }
    });
}

export async function getLatestValidOtp(userId: string, type: OtpType) {
    return prisma.otp.findFirst({
        where: {
            userId,
            type,
            isRevoked: false,
            expiresAt: { gt: new Date() }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}
