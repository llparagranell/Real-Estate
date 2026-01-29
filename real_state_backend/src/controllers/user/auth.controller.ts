import { prisma } from "../../config/prisma.js";
import { hashPassword } from "../../utils/password.js";
import { signAccessToken, signRefreshToken } from "../../utils/jwt.js";
import { Request, Response } from "express";

export async function signup(req: Request, res: Response) {
    try {
        const { firstName, lastName, email, phone, password, referralCode } = req.body
        if (!req.body) {
            return res.status(404).json("Please fill all the details")
        }
        //check if referral code is provided
        let referrer = null;
        if (referralCode) {
            referrer = await prisma.user.findUnique({
                where: { referralCode }
            });
        } else {
            throw new Error('Invalid referrerCode')
        }
        // create user
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                password: await hashPassword(password),
                referrerId: referrer?.id
            }
        })
        //write logic to award points to one to referrers after clarification from team.
        const accessToken = signAccessToken({ id: user.id, role: "user" });
        const refereshToken = signRefreshToken({ id: user.id, role: "user" })
        return res.json({ accessToken, refereshToken, user })
    } catch (error) {
        return res.status(500).json(error)
    }
}