"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Zap, TrendingUp, DollarSign } from 'lucide-react';
import { useTariff } from '@/context/TariffContext';
import { useData } from '@/context/DataContext';
import { useRoom } from '@/context/RoomContext';

function ClockWidget() {
    const [time, setTime] = useState(null);
    useEffect(() => {
        setTime(new Date());
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);
    const formatDate = (date) => date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <Card className="bg-gradient-to-br from-purple-900 to-indigo-900 border-purple-800 shadow-lg">
            <CardHeader>
                <CardTitle className="text-center text-indigo-200 text-base font-medium">Data e Hora Atuais</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-4">
                {time ? (
                    <>
                        <div className="text-5xl font-bold text-white font-mono tracking-wider">{time.toLocaleTimeString('pt-BR', { hour12: false })}</div>
                        <p className="text-sm text-purple-300 mt-2">{formatDate(time)}</p>
                    </>
                ) : (
                    <>
                        <div className="text-5xl font-bold text-white font-mono tracking-wider animate-pulse">--:--:--</div>
                        <p className="text-sm text-purple-300 mt-2 animate-pulse">Carregando...</p>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

function SummaryCard({ title, value, unit, unitPosition = 'suffix', description, icon: Icon }) {
    const formattedValue = unitPosition === 'prefix' ? `${unit} ${value}` : `${value}${unit ? ` ${unit}` : ''}`;
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formattedValue}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}

export function DashboardWidgets() {
    const { activeTariff } = useTariff();
    const { chartData } = useData();
    const { rooms } = useRoom();

    const lastDataPoint = chartData.length > 0 ? chartData[chartData.length - 1] : {};

    const consumoAtualTotalWatts = rooms.reduce((total, room) => {
        return total + (lastDataPoint[room.id] || 0);
    }, 0);

    const consumoAtualTotalKWH = consumoAtualTotalWatts / 1000;

    // *************Placeholder*************
    const consumoTotalMensal = 155.4;

    const custoEstimadoValue = consumoTotalMensal * activeTariff.value;
    const custoEstimado = custoEstimadoValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // *************Placeholder*************
    const picoHoje = 3.5;

    return (
        <div className="flex flex-col gap-6">
            <ClockWidget />
            <div className="flex flex-col gap-4">
                <SummaryCard
                    title="Consumo Atual (Total)"
                    value={consumoAtualTotalKWH.toLocaleString('pt-BR', { minimumFractionDigits: 3 })}
                    unit="kWh"
                    description="Soma de todos os cômodos"
                    icon={Zap}
                />
                <SummaryCard
                    title="Pico de Consumo (Hoje)"
                    value={picoHoje.toLocaleString('pt-BR')}
                    unit="kWh"
                    description="Ocorrido às 19:30"
                    icon={TrendingUp}
                />
                <SummaryCard
                    title="Custo Estimado (Mês)"
                    value={custoEstimado}
                    unit="R$"
                    unitPosition="prefix"
                    description={`Cálculo com ${activeTariff.name}`}
                    icon={DollarSign}
                />
            </div>
        </div>
    );
}