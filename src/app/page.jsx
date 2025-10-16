import { ChartAreaInteractive } from "@/components/ChartAreaInteractive";
import {DashboardWidgets} from "@/components/DashboardWidgets";

export default function Home() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <ChartAreaInteractive />
            </div>
            <div className="lg:col-span-1">
                <DashboardWidgets />
            </div>
        </div>
    );
}