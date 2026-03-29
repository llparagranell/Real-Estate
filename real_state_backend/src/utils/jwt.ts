import Jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
const ACCESS_TOKEN_EXPIRES: SignOptions["expiresIn"] =
    (process.env.ACCESS_TOKEN_EXPIRES ?? "7d") as SignOptions["expiresIn"];
const REFRESH_TOKEN_EXPIRES: SignOptions["expiresIn"] =
    (process.env.REFRESH_TOKEN_EXPIRES ?? "28d") as SignOptions["expiresIn"];
const STAFF_ACCESS_TOKEN_EXPIRES: SignOptions["expiresIn"] =
    (process.env.STAFF_ACCESS_TOKEN_EXPIRES ?? ACCESS_TOKEN_EXPIRES) as SignOptions["expiresIn"];
const STAFF_REFRESH_TOKEN_EXPIRES: SignOptions["expiresIn"] =
    (process.env.STAFF_REFRESH_TOKEN_EXPIRES ?? REFRESH_TOKEN_EXPIRES) as SignOptions["expiresIn"];

if(!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET){
    throw new Error("JWT secrets missing in env")
}

export interface TokenPayload extends JwtPayload {
    id: string,
    role?: string
}

export interface StaffChallengePayload extends JwtPayload {
    id: string,
    role: string,
    accountType: "SUPER_ADMIN" | "STAFF",
    step: "SETUP_2FA" | "VERIFY_2FA",
    purpose: "STAFF_2FA_CHALLENGE"
}

//sign access token 7 days
export function signAccessToken(payload: {
    id: string,
    role: string
}){
    return Jwt.sign(payload,ACCESS_TOKEN_SECRET,{expiresIn: ACCESS_TOKEN_EXPIRES})
}


//sign refresh token 28 days
export function signRefreshToken(payload: {
    id: string,
    role: string
}){
    return Jwt.sign(payload,REFRESH_TOKEN_SECRET,{expiresIn: REFRESH_TOKEN_EXPIRES})
}

export function signStaffAccessToken(payload: {
    id: string,
    role: string
}) {
    return Jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: STAFF_ACCESS_TOKEN_EXPIRES });
}

export function signStaffRefreshToken(payload: {
    id: string,
    role: string
}) {
    return Jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: STAFF_REFRESH_TOKEN_EXPIRES });
}

export function verifyAccessToken(token:string): TokenPayload {
    try {
        return Jwt.verify(token,ACCESS_TOKEN_SECRET) as TokenPayload;
    }catch(err){
        throw err
    }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
    try {
        return Jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
    } catch {
        return null;
    }
}

export function signStaffChallengeToken(payload: {
    id: string,
    role: string,
    accountType: "SUPER_ADMIN" | "STAFF",
    step: "SETUP_2FA" | "VERIFY_2FA"
}) {
    return Jwt.sign(
        {
            ...payload,
            purpose: "STAFF_2FA_CHALLENGE",
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
    );
}

export function verifyStaffChallengeToken(token: string): StaffChallengePayload | null {
    try {
        const payload = Jwt.verify(token, ACCESS_TOKEN_SECRET) as StaffChallengePayload;
        if (payload.purpose !== "STAFF_2FA_CHALLENGE") {
            return null;
        }
        return payload;
    } catch {
        return null;
    }
}
