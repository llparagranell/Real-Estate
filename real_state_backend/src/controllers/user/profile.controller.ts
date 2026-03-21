import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { hashPassword } from "../../utils/password";
import { Prisma } from "@prisma/client";
import { createOtp, sendOtpEmail, verifyOtp } from "../../services/otp.service";
import { createAndSendUserNotification } from "../../services/notification.service";
import { updateUserProfiledNotification } from "../../services/Notifications/user.notification";

export async function getProfile(req: Request, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                avatar: true,
                avatarKey: true,
                age: true,
                gender: true,
                referralCode: true,
                referrerId: true,
                points: true,
                isEmailVerified: true,
                blueTick: true,
                isVerifiedSeller: true,
                createdAt: true,
                kyc: {
                    select: {
                        type: true,
                        docNo: true,
                        status: true,
                    }
                }
            }
        })
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }
        
        // Get property statistics
        const [
            totalProperties,
            soldToRealbro,
            soldFromListings,
            soldOffline,
            activePropertyCount
        ] = await Promise.all([
            prisma.property.count({
                where: { userId }
            }),
            prisma.property.count({
                where: { userId, status: "SOLDTOREALBRO" }
            }),
            prisma.property.count({
                where: { userId, status: "SOLDFROMLISTINGS" }
            }),
            prisma.property.count({
                where: { userId, status: "SOLDOFFLINE" }
            }),
            prisma.property.count({
                where: { userId, status: "ACTIVE" }
            })
        ]);

        const totalListed = await prisma.property.count({
            where: {
                userId,
                status: {
                    in: ["ACTIVE", "UNLISTED", "SOLDOFFLINE", "DRAFT"]
                }
            }
        });
        
        // Extract Aadhar and PAN numbers from KYC array
        const aadharKyc = user.kyc.find(k => k.type === 'AADHARCARD');
        const panKyc = user.kyc.find(k => k.type === 'PANCARD');
        
        const { kyc, ...userData } = user;
        
        return res.status(200).json({
            success: true,
            data: {
                ...userData,
                aadharCardNumber: aadharKyc?.docNo || null,
                aadharCardStatus: aadharKyc?.status || null,
                panCardNumber: panKyc?.docNo || null,
                panCardStatus: panKyc?.status || null,
                propertyStats: {
                    totalProperties,
                    soldToRealbro,
                    soldFromListings,
                    soldOffline,
                    totalListed,
                    activePropertyCount
                }
            }
        });
    } catch (error) {
        console.error("Get Profile Error:", error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export async function updateProfile(req: Request, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        };
        const { firstName, lastName, email, password, phone, avatar, avatarKey, age, gender } = req.body as Partial<{
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            password: string;
            avatar: string;
            avatarKey: string;
            age: number;
            gender: string;
        }>;

        const data: Record<string, unknown> = {};
        if (firstName !== undefined) data.firstName = firstName;
        if (lastName !== undefined) data.lastName = lastName;
        if (phone !== undefined) {
            return res.status(400).json({
                message: "Use phone update OTP APIs to change phone number",
            });
        }
        if (avatar !== undefined) data.avatar = avatar;
        if (avatarKey !== undefined) data.avatarKey = avatarKey;
        if (age !== undefined) data.age = age;
        if (gender !== undefined) data.gender = gender;
        if (email !== undefined) {
            data.email = email;
            // If email changes, require re-verification.
            data.isEmailVerified = false;
        }
        if (password !== undefined) {
            data.password = await hashPassword(password);
        }

        if (Object.keys(data).length === 0) {
            return res.status(400).json({ message: "No fields provided to update" });
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                avatar: true,
                avatarKey: true,
                age: true,
                gender: true,
                referralCode: true,
                referrerId: true,
                points: true,
                isEmailVerified: true,
                blueTick: true,
                isVerifiedSeller: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        const payload = updateUserProfiledNotification({ userId: user.id });
        createAndSendUserNotification({
            userId: user.id,
            type: payload.type,
            title: payload.title,
            description: payload.description,
            data: payload.data,
        }).catch((notificationError) => {
            console.error("Profile update notification error:", notificationError);
        });

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error: unknown) {
        console.error("update profile:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return res.status(409).json({
                    message: "Email or phone already in use",
                    meta: error.meta,
                });
            }
            // Record not found
            if (error.code === "P2025") {
                return res.status(404).json({ message: "User does not exist" });
            }
        }
        return res.status(500).json({ message: "Internal server error" })
    }
}

export async function sendPhoneUpdateOtp(req: Request, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { newPhone } = req.body as { newPhone: string };

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, phone: true },
        });
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        if (user.phone === newPhone) {
            return res.status(400).json({ message: "New phone is same as current phone" });
        }

        const existingPhoneUser = await prisma.user.findUnique({
            where: { phone: newPhone },
            select: { id: true },
        });
        if (existingPhoneUser) {
            return res.status(409).json({ message: "Phone number already in use" });
        }

        const otpResult = await createOtp(userId, "PHONE");
        await sendOtpEmail(
            user.email,
            otpResult.code,
        );

        return res.status(200).json({ message: "OTP sent to your registered email" });
    } catch (error) {
        console.error("Send phone update OTP error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function verifyPhoneUpdateOtp(req: Request, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { newPhone, code } = req.body as { newPhone: string; code: string };

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, phone: true },
        });
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        if (user.phone === newPhone) {
            return res.status(400).json({ message: "New phone is same as current phone" });
        }

        const existingPhoneUser = await prisma.user.findUnique({
            where: { phone: newPhone },
            select: { id: true },
        });
        if (existingPhoneUser && existingPhoneUser.id !== userId) {
            return res.status(409).json({ message: "Phone number already in use" });
        }

        const otpCheck = await verifyOtp(userId, code, "PHONE");
        if (!otpCheck.valid) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        try {
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { phone: newPhone },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    age: true,
                    gender: true,
                    blueTick: true,
                    isVerifiedSeller: true,
                    updatedAt: true,
                },
            });

            return res.status(200).json({
                success: true,
                message: "Phone number updated successfully",
                data: updatedUser,
            });
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
                return res.status(409).json({ message: "Phone number already in use" });
            }
            throw error;
        }
    } catch (error) {
        console.error("Verify phone update OTP error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}