"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { LockKeyholeOpen, Mail, ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios"; // Import axios
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

type AuthStep = "LOGIN" | "SETUP_2FA" | "VERIFY_2FA";

// Define the response types for better type safety
interface LoginResponse {
    requireSetup: boolean;
    require2fa: boolean;
    otpauth_url?: string; // Only present if requireSetup is true
    tempToken?: string;   // Likely needed for the next step to identify the session
}

export const SigninCard = () => {
    const router = useRouter();
    const [step, setStep] = useState<AuthStep>("LOGIN");
    
    // Form Inputs
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [qrCodeUrl, setQrCodeUrl] = useState("otpauth://totp/RealBros:admin@test.com?secret=JBSWY3DPEHPK3PXP&issuer=RealBros");
    
    // Helper to extract error message from Axios
    const getErrorMessage = (error: unknown) => {
        if (error instanceof AxiosError) {
            return error.response?.data?.message || error.message || "An error occurred";
        }
        return "An unexpected error occurred";
    };

    // --- MUTATION 1: LOGIN ---
    const loginMutation = useMutation({
        mutationFn: async () => {
            // Adjust the URL to match your actual backend endpoint
            const response = await axios.post<LoginResponse>('/api/auth/login', { 
                email, 
                password 
            });
            return response.data;
        },
        onSuccess: (data) => {
            if (data.requireSetup && data.otpauth_url) {
                setQrCodeUrl(data.otpauth_url);
                setStep("SETUP_2FA");
            } else if (data.require2fa) {
                setStep("VERIFY_2FA");
            } else {
                // If 2FA is not required/enabled at all (edge case), just go to dashboard
                router.push("/dashboard");
            }
        },
        // onError handled by isError state below
    });

    // --- MUTATION 2: VERIFY OTP ---
    const verifyOtpMutation = useMutation({
        mutationFn: async () => {
            // Determine which endpoint to hit based on the current step
            const endpoint = step === "SETUP_2FA" 
                ? '/api/auth/2fa/setup/verify' 
                : '/api/auth/2fa/verify';
            
            // You might need to send the email or a temp token along with the code
            const response = await axios.post(endpoint, { 
                email, 
                token: otpCode 
            });
            return response.data;
        },
        onSuccess: () => {
            router.push("/dashboard");
        }
    });

    // -- RENDER: 2FA Setup --
    if (step === "SETUP_2FA") {
        return (
            <div className="flex items-center justify-center">
                <div className="w-full max-w-md text-center">
                    <h1 className="text-[24px] font-semibold mb-2">Secure Your Account</h1>
                    <p className="text-gray-500 mb-6 text-sm">
                        Scan the QR code with Google Authenticator to enable 2FA.
                    </p>

                    <div className="flex justify-center mb-6 bg-white p-4 rounded-lg border">
                        {qrCodeUrl && <QRCodeSVG value={qrCodeUrl} size={180} />}
                    </div>

                    <div className="flex justify-center mb-6">
                        <InputOTP 
                            maxLength={6} 
                            value={otpCode} 
                            onChange={setOtpCode}
                            pattern={REGEXP_ONLY_DIGITS}
                        >
                             <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>

                    {/* Show error from mutation */}
                    {verifyOtpMutation.isError && (
                        <p className="text-red-500 text-sm mb-4">
                            {getErrorMessage(verifyOtpMutation.error)}
                        </p>
                    )}

                    <Button 
                        className="w-full rounded-3xl py-6 text-[16px]"
                        onClick={() => verifyOtpMutation.mutate()}
                        disabled={verifyOtpMutation.isPending || otpCode.length < 6}
                    >
                        {verifyOtpMutation.isPending ? "Verifying..." : "Verify & Enable 2FA"}
                    </Button>
                </div>
            </div>
        );
    }

    // -- RENDER: 2FA Verification --
    if (step === "VERIFY_2FA") {
        return (
             <div className="flex items-center justify-center">
                <div className="w-full max-w-md text-center">
                    <h1 className="text-[24px] font-semibold mb-2">Two-Factor Authentication</h1>
                    <p className="text-gray-500 mb-8 text-sm">
                        Enter the 6-digit code from your authenticator app.
                    </p>

                    <div className="flex justify-center mb-8">
                        <InputOTP 
                            maxLength={6} 
                            value={otpCode} 
                            onChange={setOtpCode}
                            pattern={REGEXP_ONLY_DIGITS}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>

                    {verifyOtpMutation.isError && (
                        <p className="text-red-500 text-sm mb-4">
                            {getErrorMessage(verifyOtpMutation.error)}
                        </p>
                    )}

                    <Button 
                        className="w-full rounded-3xl py-6 text-[16px]"
                        onClick={() => verifyOtpMutation.mutate()}
                        disabled={verifyOtpMutation.isPending || otpCode.length < 6}
                    >
                        {verifyOtpMutation.isPending ? "Verifying..." : "Verify Login"}
                    </Button>
                    
                    <button 
                        onClick={() => setStep("LOGIN")}
                        className="mt-4 text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-2 mx-auto"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Login
                    </button>
                </div>
            </div>
        );
    }

    // -- RENDER: Default Login --
    return (
        <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
                <h1 className="text-center text-[24px] font-semibold">
                    Sign In
                </h1>
                <div className="flex flex-col gap-4 mt-12">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
                        <Input
                            type="email"
                            placeholder="Enter Email / number"
                            className="pl-10 py-6"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div className="relative">
                        <LockKeyholeOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
                        <Input
                            type="password"
                            placeholder="Enter password"
                            className="pl-10 py-6"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    {loginMutation.isError && (
                        <p className="text-red-500 text-sm text-center">
                            {getErrorMessage(loginMutation.error)}
                        </p>
                    )}

                    <Button 
                        className="rounded-3xl py-6 text-[16px]"
                        onClick={() => loginMutation.mutate()}
                        disabled={loginMutation.isPending}
                    >
                        {loginMutation.isPending ? "Signing in..." : "Sign in"}
                    </Button>
                </div>
                
                <div className="text-center text-[15px] font-bold mt-4 text-blue-600">
                    <Link href="/reset-password">
                        Reset your password
                    </Link>
                </div>
            </div>
        </div>
    );
};