import { AnalyticsCards } from "@/components/dashboard/analyticsCards";
import { MyChart } from "@/components/dashboard/userAnalytics";

export default function Dashboard() {
    return (
        <div className="space-y-4">
            <div>
                <AnalyticsCards />
            </div>
            <div>
                <MyChart />
            </div>
        </div>
    );
}