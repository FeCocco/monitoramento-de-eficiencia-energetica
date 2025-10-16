"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRoom } from '@/context/RoomContext';

// Os dados iniciais
const initialChartData = [
    { date: "2024-10-15T23:40:00.000Z", sala_de_estar: 222, cozinha: 150, quarto: 90 },
    { date: "2024-10-15T23:41:00.000Z", sala_de_estar: 97, cozinha: 180, quarto: 110 },
    { date: "2024-10-15T23:42:00.000Z", sala_de_estar: 167, cozinha: 120, quarto: 80 },
    { date: "2024-10-15T23:43:00.000Z", sala_de_estar: 242, cozinha: 260, quarto: 130 },
    { date: "2024-10-15T23:44:00.000Z", sala_de_estar: 373, cozinha: 290, quarto: 150 },
    { date: "2024-10-15T23:45:00.000Z", sala_de_estar: 446, cozinha: 400, quarto: 250},
];

const DataContext = createContext();

const generateRandomValue = (previousValue) => {
    const min = previousValue * 0.8;
    const max = previousValue * 1.2;
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export function DataProvider({ children }) {
    const [chartData, setChartData] = useState(initialChartData);
    const { rooms } = useRoom(); // Pega a lista de cômodos do outro contexto

    useEffect(() => {
        // O intervalo da atualização
        const updateInterval = 3000; // 3 segundos

        const timer = setInterval(() => {
            setChartData(prevData => {
                const lastDataPoint = prevData[prevData.length - 1];
                const lastDate = new Date(lastDataPoint.date);

                // Cria um novo ponto de dados 1 minuto à frente do último
                const newDate = new Date(lastDate.getTime() + 60000); // Adiciona 1 minuto

                const newDataPoint = {
                    date: newDate.toISOString(),
                };

                // Gera novos valores para cada cômodo existente
                rooms.forEach(room => {
                    const lastValue = lastDataPoint[room.id] || 100; // Usa 100 como base se não houver dado anterior
                    newDataPoint[room.id] = generateRandomValue(lastValue);
                });

                const updatedData = [...prevData, newDataPoint];
                if (updatedData.length > 30) {
                    updatedData.shift(); // Remove o ponto mais antigo
                }

                return updatedData;
            });
        }, updateInterval);

        // Limpa o intervalo quando o componente é desmontado
        return () => clearInterval(timer);
    }, [rooms]); // Roda o efeito novamente se a lista de cômodos mudar

    const value = { chartData };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}