"use client";

import React, { createContext, useState, useContext } from 'react';

// Valores iniciais para as bandeiras (R$ por kWh)
const initialTariffs = [
    { id: 'green', name: 'Bandeira Verde', value: 0.70 },
    { id: 'yellow', name: 'Bandeira Amarela', value: 0.73 },
    { id: 'red1', name: 'Bandeira Vermelha P1', value: 0.76 },
    { id: 'red2', name: 'Bandeira Vermelha P2', value: 0.80 },
];

const TariffContext = createContext();

export function TariffProvider({ children }) {
    const [tariffs, setTariffs] = useState(initialTariffs);
    const [activeTariffId, setActiveTariffId] = useState('green');

    // Função para atualizar o valor de uma bandeira específica
    const updateTariffValue = (tariffId, newValue) => {
        const numericValue = parseFloat(newValue);
        if (isNaN(numericValue)) return;

        setTariffs(
            tariffs.map(t =>
                t.id === tariffId ? { ...t, value: numericValue } : t
            )
        );
    };

    const activeTariff = tariffs.find(t => t.id === activeTariffId);

    const value = {
        tariffs,
        activeTariff,
        setActiveTariffId,
        updateTariffValue,
    };

    return <TariffContext.Provider value={value}>{children}</TariffContext.Provider>;
}

export function useTariff() {
    const context = useContext(TariffContext);
    if (!context) {
        throw new Error('useTariff must be used within a TariffProvider');
    }
    return context;
}