"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "./LoginForm";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Setup2FA } from "./setup2FA";
import { Verify2FA } from "./verify2FA";

type AuthStep = "LOGIN" | "SETUP_2FA" | "VERIFY_2FA";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/staff/auth`;

interface LoginResponse {
    nextStep: "VERIFY_2FA" | "SETUP_2FA";
    challengeToken: string;
    user: { id: string; role: string; email: string };
}

interface Setup2faResponse {
    message: string;
    data: {
        challengeToken: string;
        email: string;
        qrCodeDataUrl: string;
        manualSetupCode: string;
        otpauthUrl: string;
    };
}

export const SigninCard = () => {
    const router = useRouter();
    const [step, setStep] = useState<AuthStep>("LOGIN");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [manualSetupCode, setManualSetupCode] = useState("");
    const [challengeToken, setChallengeToken] = useState("");
    const [setup2faChallengeToken, setSetup2faChallengeToken] = useState("");

    const getErrorMessage = (error: unknown) => {
        if (error instanceof AxiosError) {
            const data = error.response?.data as { error?: string; message?: string } | undefined;
            return data?.error || data?.message || error.message || "An error occurred";
        }
        return "An unexpected error occurred";
    };

    // Login with email + password
    const loginMutation = useMutation({
        mutationFn: async () => {
            const response = await axios.post<LoginResponse>(`${API_BASE}/signin`, {
                email,
                password,
            });
            return response.data;
        },
        onSuccess: (data) => {
            setChallengeToken(data.challengeToken);
            setStep(data.nextStep);
            if (data.nextStep === "SETUP_2FA") {
                setup2faMutation.mutate(data.challengeToken);
            }
        },
        onError: (error) => {
            console.error("Login error:", error);
        },
    });

    // 2. Fetch QR code when nextStep is SETUP_2FA (called automatically after login)
    const setup2faMutation = useMutation({
        mutationFn: async (token: string) => {
            const response = await axios.post<Setup2faResponse>(`${API_BASE}/setup2fa`, {
                challengeToken: token,
            });
            return response.data;
        },
        onSuccess: (data) => {
            setQrCodeUrl(data.data.otpauthUrl || data.data.qrCodeDataUrl);
            setManualSetupCode(data.data.manualSetupCode);
            setSetup2faChallengeToken(data.data.challengeToken);
        },
        onError: (error) => {
            console.error("Setup2FA fetch error:", error);
        },
    });

    // 3. Confirm 2FA setup (user scanned QR and entered code)
    const confirm2faMutation = useMutation({
        mutationFn: async () => {
            const response = await axios.post(`${API_BASE}/confirm2faSetup`, {
                challengeToken: setup2faChallengeToken,
                code: otpCode,
            });
            return response.data;
        },
        onSuccess: (data: { accessToken?: string; refreshToken?: string }) => {
            if (data.accessToken) localStorage.setItem("accessToken", data.accessToken);
            if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
            router.push("/dashboard");
        },
        onError: (error) => {
            console.error("Confirm 2FA error:", error);
        },
    });

    // 4. Verify 2FA (user already has 2FA, just entering code)
    const verify2faMutation = useMutation({
        mutationFn: async () => {
            const response = await axios.post(`${API_BASE}/verify2fa`, {
                challengeToken,
                code: otpCode,
            });
            return response.data;
        },
        onSuccess: (data: { accessToken?: string; refreshToken?: string }) => {
            if (data.accessToken) localStorage.setItem("accessToken", data.accessToken);
            if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
            router.push("/dashboard");
        },
        onError: (error) => {
            console.error("Verify 2FA error:", error);
        },
    });

    if (step === "SETUP_2FA") {
        return (
            <Setup2FA
                qrCodeUrl={qrCodeUrl}
                manualSetupCode={manualSetupCode}
                otpCode={otpCode}
                onOtpChange={setOtpCode}
                onVerify={() => confirm2faMutation.mutate()}
                isPending={confirm2faMutation.isPending}
                isLoadingQr={setup2faMutation.isPending}
                qrError={setup2faMutation.isError ? getErrorMessage(setup2faMutation.error) : null}
                error={confirm2faMutation.isError ? getErrorMessage(confirm2faMutation.error) : null}
            />
        );
    }
    if (step === "VERIFY_2FA") {
        return (
            <Verify2FA
                otpCode={otpCode}
                onOtpChange={setOtpCode}
                onVerify={() => verify2faMutation.mutate()}
                onBack={() => setStep("LOGIN")}
                isPending={verify2faMutation.isPending}
                error={verify2faMutation.isError ? getErrorMessage(verify2faMutation.error) : null}
            />
        );
    }

    return (
        <LoginForm
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={() => loginMutation.mutate()}
            isPending={loginMutation.isPending}
            error={loginMutation.isError ? getErrorMessage(loginMutation.error) : null}
        />
    );
};
