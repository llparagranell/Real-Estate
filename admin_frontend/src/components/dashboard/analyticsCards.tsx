import { Building2, ChevronRight, FileTextIcon, Gem, Users2, WalletIcon } from "lucide-react"
import { Card } from "../ui/card"
import { CardHeader, CardTitle, CardContent } from "../ui/card"

export const analyticsCards = [
    {
        title: "Active Listings",
        value: 845,
        icon: Building2,
        color: "text-blue-500",
    },
    {
        title: "Total Users",
        value: 12545,
        icon: Users2,
        color: "text-purple-500",
    },
    {
        title: "Pending Requirements",
        value: 23,
        icon: FileTextIcon,
        color: "text-orange-500",
    },
    {
        title: "Revenue",
        value: 42000,
        icon: WalletIcon,
        color: "text-green-500",
    },
    {
        title: "Payable Gems",
        value: 21581,
        icon: Gem,
        color: "text-blue-400",
    },
]

export const AnalyticsCards = () => {
    return (
        <div className="grid grid-cols-5 gap-2 mt-1">
            {
                analyticsCards.map((card, index) => (
                    <Card key={index} className="border-2">
                        <CardHeader className="font-extralight">
                            <CardTitle className="flex justify-between items-center gap-2">
                                <card.icon className={`size-7 font-extralight ${card.color}`} strokeWidth={1.5}/>
                                <ChevronRight className="size-8 font-extralight text-blue-500" strokeWidth={1.5}/>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h1 className="font-bold text-3xl">{card.value}</h1>
                            <p className="text-gray-500 font-medium">{card.title}</p>
                        </CardContent>
                    </Card>
                ))
            }
        </div>
    )
}