import { prisma } from "../../config/prisma";
import { Request, Response } from "express";
import { comparePassword } from "../../utils/password";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";

export async function signin(req: Request, res: Response) {
    try{
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        };
        const [superAdmin, staff] = await Promise.all([
            prisma.superAdmin.findUnique({
                where: { email }
            }),
            prisma.staff.findUnique({
                where: { email }
            })
        ]);
        let user: any = null;
        let role: string = "";

        if (superAdmin) {
            user = superAdmin;
            role = "SUPER_ADMIN";
        } else if (staff) {
            user = staff;
            role = staff.role;
        } else {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const accessToken = signAccessToken({ id: user.id, role: role });
        const refreshToken = signRefreshToken({ id: user.id, role: role });
        return res.status(200).json({ accessToken, refreshToken, user:{
            id: user.id,
            role: role,
        } });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}