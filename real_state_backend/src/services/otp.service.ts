import { prisma } from "../config/prisma";
import { OtpType } from "@prisma/client";
import { Resend } from "resend";

const OTP_EXPIRY_MINUTES = 5;
const OTP_LENGTH = 6;
const resend = new Resend(process.env.RESEND_API_KEY);

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

    const code:string = generateOtpCode();
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

export async function sendOtpEmail (email: string, otp: string){
    try {
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: [email],
            subject: 'Your OTP code is here',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">OTP Verification</h2>
              <p>Your OTP code is:</p>
              <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
                <span style="font-size: 24px; font-weight: bold; color: #007bff; letter-spacing: 2px;">${otp}</span>
              </div>
              <p style="color: #666;">This code is valid for 5 minutes.</p>
              <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
            </div>
          `,
        });
        if (error) {
            throw new Error(`Failed to send email: ${error}`);
        }
        return data;
    } catch (error) {
        throw new Error(`Failed to send email: ${error}`);
    }
}