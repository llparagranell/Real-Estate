import { NextFunction, Request, Response } from "express";
import { TokenPayload, verifyAccessToken } from "../utils/jwt";

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction){
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
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}