"use client";

import { ChevronRight, Calendar, CalendarClockIcon, CalendarCheck2, CalendarSyncIcon, PencilLine, Building2, Gem } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { SendGemsDialog } from "../shared/sendGemsDialog";

export default function TopBar() {
    return (
        <div>
            <div className="flex justify-between items-center">
                <h1 className="font-medium text-xl">Financials</h1>
                <div className="flex gap-2">
                    <SendGemsDialog
                        trigger={
                            <Button>
                                <PencilLine />
                                Send Gems to User
                            </Button>
                        }
                    />

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
