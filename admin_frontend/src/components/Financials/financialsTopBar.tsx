"use client";

import { useMemo, useState } from "react";
import { AxiosError } from "axios";
import { ChevronRight, Calendar, CalendarClockIcon, CalendarCheck2, CalendarSyncIcon, PencilLine, Building2, Gem } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { api } from "@/lib/api";

type GemRequestType = "EXCLUSIVE_ACQUISITION_REWARD" | "EXCLUSIVE_SALE_REWARD";

type PreviewResponse = {
    success: boolean;
    data: {
        baseGems: number;
        referralPercent: number;
        referralGems: number;
        totalGems: number;
        targetUser: {
            email: string;
        };
        referralUser: {
            email: string;
        } | null;
    };
};

export default function TopBar() {
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [baseGems, setBaseGems] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [type, setType] = useState<GemRequestType>("EXCLUSIVE_ACQUISITION_REWARD");
    const [comment, setComment] = useState("");
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [isSendingGems, setIsSendingGems] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [otpError, setOtpError] = useState<string | null>(null);
    const [previewData, setPreviewData] = useState<PreviewResponse["data"] | null>(null);

    const clearMessages = () => {
        setMessage(null);
        setError(null);
        setOtpError(null);
    };

    const getErrorMessage = (err: unknown) => {
        if (err instanceof AxiosError) {
            const response = err.response?.data as { message?: string } | undefined;
            return response?.message ?? err.message;
        }
        return "Something went wrong";
    };

    const resetDialog = () => {
        setConfirmOpen(false);
        setPreviewData(null);
        clearMessages();
    };

    const handleSendOtp = async () => {
        clearMessages();
        if (!email.trim()) {
            setError("Email is required");
            return;
        }

        try {
            setIsSendingOtp(true);
            await api.post("/staff/gems/send-otp", { email: email.trim() });
            setMessage(`OTP sent to ${email.trim()}`);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsSendingOtp(false);
        }
    };

    const canPreview = useMemo(() => {
        return Boolean(email.trim() && Number(baseGems) > 0 && otpCode.trim() && type);
    }, [email, baseGems, otpCode, type]);

    const handlePreview = async () => {
        clearMessages();
        if (!canPreview) {
            setError("Email, base gems, OTP and type are required");
            return;
        }

        try {
            setIsPreviewing(true);
            const response = await api.post<PreviewResponse>("/staff/gems/preview", {
                email: email.trim(),
                baseGems: Number(baseGems),
            });
            setPreviewData(response.data.data);
            setConfirmOpen(true);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsPreviewing(false);
        }
    };

    const handleConfirmSendGems = async () => {
        clearMessages();
        if (!canPreview) {
            setError("Email, base gems, OTP and type are required");
            return;
        }

        try {
            setIsSendingGems(true);
            await api.post("/staff/gems/give", {
                email: email.trim(),
                baseGems: Number(baseGems),
                otpCode: otpCode.trim(),
                type,
                comment: comment.trim() || undefined,
            });
            setConfirmOpen(false);
            setMessage("Gems sent successfully");
        } catch (err) {
            const msg = getErrorMessage(err);
            if (msg.toLowerCase().includes("otp")) {
                setOtpError(msg);
            } else {
                setError(msg);
            }
            setConfirmOpen(false);
        } finally {
            setIsSendingGems(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center">
                <h1 className="font-medium text-xl">Financials</h1>
                <div className="flex gap-2">
                    <Dialog
                        open={open}
                        onOpenChange={(value) => {
                            setOpen(value);
                            if (!value) resetDialog();
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button>
                                <PencilLine />
                                Send Gems to User
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Send Gems to User</DialogTitle>
                                <DialogDescription>
                                    Fill in the user and gems details to continue.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs mb-1 text-gray-600">Email *</p>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter user email"
                                    />
                                </div>
                                <div>
                                    <p className="text-xs mb-1 text-gray-600">Base Gems *</p>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={baseGems}
                                        onChange={(e) => setBaseGems(e.target.value)}
                                        placeholder="Enter base gems"
                                    />
                                </div>
                                <div>
                                    <p className="text-xs mb-1 text-gray-600">OTP *</p>
                                    <Input
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value)}
                                        placeholder="Enter OTP"
                                    />
                                    {otpError && <p className="text-xs mt-1 text-red-500">{otpError}</p>}
                                </div>
                                <div>
                                    <p className="text-xs mb-1 text-gray-600">Type *</p>
                                    <Select value={type} onValueChange={(v) => setType(v as GemRequestType)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="EXCLUSIVE_ACQUISITION_REWARD">EXCLUSIVE_ACQUISITION_REWARD</SelectItem>
                                            <SelectItem value="EXCLUSIVE_SALE_REWARD">EXCLUSIVE_SALE_REWARD</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <p className="text-xs mb-1 text-gray-600">Comment (optional)</p>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Write a short comment"
                                        className="w-full min-h-20 rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                    />
                                </div>
                            </div>

                            {message && <p className="text-sm text-green-600">{message}</p>}
                            {error && <p className="text-sm text-red-500">{error}</p>}

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Close</Button>
                                </DialogClose>
                                <Button variant="outline" onClick={handleSendOtp} disabled={isSendingOtp}>
                                    {isSendingOtp ? "Sending OTP..." : "Send OTP to User"}
                                </Button>
                                <Button onClick={handlePreview} disabled={isPreviewing}>
                                    {isPreviewing ? "Preparing..." : "Send Gems"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Confirm Gem Allocation</DialogTitle>
                                <DialogDescription>
                                    {previewData ? (
                                        <>
                                            <span className="font-bold text-black">{previewData.baseGems}</span> Gems is allotted to email Id{" "}
                                            <span className="font-bold text-black">{previewData.targetUser.email}</span> and 5%{" "}
                                            <span className="font-bold text-black">{previewData.referralGems}</span> Gems is allocated to its referral{" "}
                                            <span className="font-bold text-black">
                                                {previewData.referralUser?.email ?? "N/A"}
                                            </span>.
                                        </>
                                    ) : (
                                        "No preview data available."
                                    )}
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleConfirmSendGems} disabled={isSendingGems || !previewData}>
                                    {isSendingGems ? "Sending..." : "Confirm"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button>
                        <PencilLine />
                        Add New Payout</Button>
                </div>
            </div>
            <div className="grid grid-cols-5 gap-3 mt-3">
                <Card className="border py-3 gap-1">
                    <CardHeader className="px-4 py-0 font-extralight">
                        <CardTitle className="flex justify-between items-center gap-2">
                            <Building2 className={`size-7 font-extralight text-blue-500`} strokeWidth={1.5} />
                            <ChevronRight className="size-8 font-extralight text-blue-500" strokeWidth={1.5} />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4">
                        <h1 className="font-bold text-2xl">152,100</h1>
                        <p className="text-gray-500 font-medium text-[12px]">Total worth of Prop.</p>
                    </CardContent>
                </Card>
                <Card className="border py-3 gap-1">
                    <CardHeader className="px-4 py-0 font-extralight">
                        <CardTitle className="flex justify-between items-center gap-2">
                            <Gem className={`size-7 font-extralight text-green-300`} strokeWidth={1.5} />
                            <ChevronRight className="size-8 font-extralight text-blue-500" strokeWidth={1.5} />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4">
                        <h1 className="font-bold text-2xl">12</h1>
                        <p className="text-gray-500 font-medium text-[12px]">Total worth of Gems</p>
                    </CardContent>
                </Card>
                <Card className="col-span-3 border py-3 gap-2">
                    <CardHeader className="px-4 py-0">
                        <CardTitle className="flex justify-between items-center">
                            <h1 className="font-medium text-base">Insights</h1>
                            <Button variant="outline" className="shadow-none h-7 px-2 text-[11px]" size="sm">
                                <Calendar size={12} />
                                Today (15-02-2026)
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 ">
                        <div className="grid grid-cols-3 gap-3 ml-16">
                            <div className="flex items-center gap-2">
                                <CalendarClockIcon size={20} className="text-blue-500" strokeWidth={1.5} />
                                <div>
                                    <h1 className="text-[15px] font-bold">12</h1>
                                    <p className="text-[12px] text-gray-500 font-medium">Payouts Processed</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <CalendarCheck2 size={20} className="text-green-500" strokeWidth={1.5} />
                                <div>
                                    <h1 className="text-[15px] font-bold">₹250,000</h1>
                                    <p className="text-[12px] text-gray-500 font-medium">Total Sell</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <CalendarSyncIcon size={20} className="text-red-500" strokeWidth={1.5} />
                                <div>
                                    <h1 className="text-[15px] font-bold text-green-500">250,000</h1>
                                    <p className="text-[12px] text-gray-500 font-medium">Cashflow</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
