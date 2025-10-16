"use client";

import React, { createContext, useState, useContext, useMemo } from 'react';

// Dados iniciais dos cômodos
const initialRooms = [
    { id: 'sala_de_estar', name: 'Sala de Estar' },
    { id: 'cozinha', name: 'Cozinha' },
    { id: 'quarto', name: 'Quarto' },
];

const RoomContext = createContext();

export function RoomProvider({ children }) {
    const [rooms, setRooms] = useState(initialRooms);
    const [selectedRoom, setSelectedRoom] = useState('all');

    // Função para adicionar um novo cômodo
    const addRoom = (roomName) => {
        if (roomName && !rooms.find(r => r.name === roomName)) {
            const newId = roomName.toLowerCase().replace(/\s+/g, '_').replace(/[^\w-]+/g, '');
            const newRoom = { id: newId, name: roomName };
            setRooms([...rooms, newRoom]);
        }
    };

    // Função para renomear um cômodo existente
    const renameRoom = (roomId, newName) => {
        if (!newName) return;
        setRooms(rooms.map(room =>
            room.id === roomId ? { ...room, name: newName } : room
        ));
    };

    // Função para remover um cômodo
    const removeRoom = (roomIdToRemove) => {
        // Se o cômodo a ser removido for o selecionado, volta para "todos"
        if (selectedRoom === roomIdToRemove) {
            setSelectedRoom('all');
        }
        setRooms(rooms.filter(room => room.id !== roomIdToRemove));
    };

    // Gera os rótulos dinamicamente para outros componentes usarem
    const roomLabels = useMemo(() => {
        const labels = { all: 'Selecionar Área' };
        rooms.forEach(room => {
            labels[room.id] = room.name;
        });
        return labels;
    }, [rooms]);


    const value = {
        rooms,
        addRoom,
        renameRoom,
        removeRoom,
        selectedRoom,
        setSelectedRoom,
        roomLabels,
    };

    return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}

export function useRoom() {
    const context = useContext(RoomContext);
    if (!context) {
        throw new Error('useRoom must be used within a RoomProvider');
    }
    return context;
}