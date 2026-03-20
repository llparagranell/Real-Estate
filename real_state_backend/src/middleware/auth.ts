import { NextFunction, Request, Response } from "express";
import { TokenPayload, verifyAccessToken } from "../utils/jwt";
import { prisma } from "../config/prisma";

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction){
    try{
        // Try cookie first (httpOnly), then Authorization header (backward compatibility)
        let token: string | undefined = req.cookies?.accessToken;
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader?.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
        }
        if (!token) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }
        const payload = verifyAccessToken(token);

        if (payload.role === "user") {
            const user = await prisma.user.findUnique({
                where: { id: payload.id },
                select: { id: true, isBlocked: true },
            });

            if (!user) {
                res.status(401).json({ error: "User not found" });
                return;
            }

            if (user.isBlocked) {
                res.status(403).json({
                    error: "Your account is blocked. Contact contact@realbro.io or 8085671414",
                    code: "ACCOUNT_BLOCKED",
                });
                return;
            }
        }

        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}