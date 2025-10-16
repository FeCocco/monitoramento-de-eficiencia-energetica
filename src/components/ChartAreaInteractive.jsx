"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useRoom } from "@/context/RoomContext";
import { useData } from "@/context/DataContext"; // Pega os dados em tempo real

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart"

export function ChartAreaInteractive() {
    const { selectedRoom, roomLabels, rooms } = useRoom();
    const { chartData } = useData(); // Usa os dados em tempo real do nosso

    const chartConfig = React.useMemo(() => {
        const config = { consumo: { label: "Consumo (W)" } };
        const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
        rooms.forEach((room, index) => {
            config[room.id] = { label: room.name, color: colors[index % colors.length] };
        });
        return config;
    }, [rooms]);

    const cardTitle = selectedRoom === 'all'
        ? "Consumo de Energia por Cômodo"
        : `Consumo de Energia - ${roomLabels[selectedRoom]}`;

    return (
        <Card className="pt-0 shadow-2xl shadow-violet-500/10">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>{cardTitle}</CardTitle>
                    <CardDescription>
                        Exibindo dados em tempo real
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <AreaChart data={chartData}>
                        <defs>
                            {rooms.map(room => (<linearGradient key={`fill-${room.id}`} id={`fill-${room.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={`var(--color-${room.id})`} stopOpacity={0.8} /><stop offset="95%" stopColor={`var(--color-${room.id})`} stopOpacity={0.1} /></linearGradient>))}
                            {rooms.map(room => (<filter key={`shadow-${room.id}`} id={`shadow-${room.id}`} height="140%"><feDropShadow dx="0" dy="4" stdDeviation="5" floodColor={`var(--color-${room.id})`} floodOpacity="0.5" /></filter>))}
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => new Date(value).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                        {rooms.map(room => {
                            if (selectedRoom === 'all' || selectedRoom === room.id) {
                                return (<Area key={room.id} dataKey={room.id} type="natural" fill={`url(#fill-${room.id})`} stroke={`var(--color-${room.id})`} strokeWidth={2} stackId="a" filter={`url(#shadow-${room.id})`} />);
                            }
                            return null;
                        })}
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}