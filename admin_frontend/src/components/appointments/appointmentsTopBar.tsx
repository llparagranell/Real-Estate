import { ChevronRight, Calendar, CalendarClockIcon, CalendarCheck2, CalendarSyncIcon, TimerReset, CalendarDaysIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function AppointmentsTopBar() {
    return (
        <div>
            <div className="flex justify-between items-center">
                <h1 className="font-medium text-xl">Appointments</h1>
            </div>
            <div className="grid grid-cols-5 gap-3 mt-3">
                <Card className="border py-3 gap-1">
                    <CardHeader className="px-4 py-0 font-extralight">
                        <CardTitle className="flex justify-between items-center gap-2">
                            <CalendarDaysIcon className={`size-7 font-extralight text-blue-500`} strokeWidth={1.5} />
                            <ChevronRight className="size-8 font-extralight text-blue-500" strokeWidth={1.5} />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4">
                        <h1 className="font-bold text-2xl">45</h1>
                        <p className="text-gray-500 font-medium text-[12px]">Total Scheduled</p>
                    </CardContent>
                </Card>
                <Card className="border py-3 gap-1">
                    <CardHeader className="px-4 py-0 font-extralight">
                        <CardTitle className="flex justify-between items-center gap-2">
                            <TimerReset className={`size-7 font-extralight text-orange-500`} strokeWidth={1.5} />
                            <ChevronRight className="size-8 font-extralight text-blue-500" strokeWidth={1.5} />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4">
                        <h1 className="font-bold text-2xl">12</h1>
                        <p className="text-gray-500 font-medium text-[12px]">Pending Approvals</p>
                    </CardContent>
                </Card>
                <Card className="col-span-3 border py-3 gap-2">
                    <CardHeader className="px-4 py-0">
                        <CardTitle className="flex justify-between items-center">
                            <h1 className="font-medium text-base">Day Insights</h1>
                            <Button variant="outline" className="shadow-none h-7 px-2 text-[11px]" size="sm">
                                <Calendar size={12} />
                                Today (15-02-2026)
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4">
                        <div className="grid grid-cols-3 gap-3 ml-16">
                            <div className="flex items-center gap-2">
                                <CalendarClockIcon size={20} className="text-blue-500" strokeWidth={1.5} />
                                <div>
                                    <h1 className="text-[15px] font-bold">12</h1>
                                    <p className="text-[12px] text-gray-500 font-medium">Scheduled for Today</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <CalendarCheck2 size={20} className="text-green-500" strokeWidth={1.5} />
                                <div>
                                    <h1 className="text-[15px] font-bold">25</h1>
                                    <p className="text-[12px] text-gray-500 font-medium">Completed Today</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <CalendarSyncIcon size={20} className="text-red-500" strokeWidth={1.5} />
                                <div>
                                    <h1 className="text-[15px] font-bold text-red-500">04</h1>
                                    <p className="text-[12px] text-gray-500 font-medium">Didn&apos;t Showed Up</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
