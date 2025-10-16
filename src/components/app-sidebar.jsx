"use client"

import * as React from "react";
import {
    Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton,
    SidebarSeparator, SidebarContent, SidebarGroup, SidebarGroupLabel
} from "@/components/ui/sidebar";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useRoom} from "@/context/RoomContext";
import {useTariff} from "@/context/TariffContext";

function TariffManager() {
    const {tariffs, activeTariff, setActiveTariffId, updateTariffValue} = useTariff();
    const [inputValue, setInputValue] = React.useState('');

    React.useEffect(() => {
        if (activeTariff) {
            // Formata o número para string com vírgula para exibição
            setInputValue(activeTariff.value.toFixed(2).replace('.', ','));
        }
    }, [activeTariff]);

    const handleValueChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleValueBlur = () => {
        const numericValue = parseFloat(inputValue.replace(',', '.'));
        if (!isNaN(numericValue)) {
            updateTariffValue(activeTariff.id, numericValue);
            setInputValue(numericValue.toFixed(2).replace('.', ','));
        } else {
            setInputValue(activeTariff.value.toFixed(2).replace('.', ','));
        }
    };

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Tarifa de Energia</SidebarGroupLabel>
            <div className="flex flex-col gap-3 p-2">
                <Select value={activeTariff?.id} onValueChange={setActiveTariffId}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a bandeira..."/>
                    </SelectTrigger>
                    <SelectContent>
                        {tariffs.map((tariff) => (
                            <SelectItem key={tariff.id} value={tariff.id}>
                                {tariff.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="relative">
                    <span
                        className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-muted-foreground">
                        R$/kWh
                    </span>
                    <Input
                        className="pl-16 text-right"
                        value={inputValue}
                        onChange={handleValueChange}
                        onBlur={handleValueBlur}
                        placeholder="0,00"
                    />
                </div>
            </div>
        </SidebarGroup>
    );
}

function RoomManager() {
    const {rooms, addRoom, renameRoom, removeRoom} = useRoom();
    const [newRoomName, setNewRoomName] = React.useState("");
    const handleAddRoom = (e) => {
        e.preventDefault();
        addRoom(newRoomName);
        setNewRoomName("");
    };
    const handleRename = (roomId, currentName) => {
        const newName = prompt("Digite o novo nome:", currentName);
        if (newName) {
            renameRoom(roomId, newName);
        }
    };
    const handleRemove = (roomId, roomName) => {
        if (window.confirm(`Remover "${roomName}"?`)) {
            removeRoom(roomId);
        }
    };
    return (<div className="p-4 flex flex-col gap-6">
        <div>
            <h3 className="text-lg font-semibold mb-2">Minhas Áreas</h3>
            <div className="flex flex-col gap-2">{rooms.map((room) => (
                <div key={room.id} className="flex items-center justify-between gap-2 p-2 rounded-md bg-accent/50">
                    <span className="text-sm font-medium">{room.name}</span>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="sm"
                                onClick={() => handleRename(room.id, room.name)}>Renomear</Button>
                        <Button variant="destructive" size="sm"
                                onClick={() => handleRemove(room.id, room.name)}>Remover</Button>
                    </div>
                </div>)
            )}
            </div>
        </div>
        <form onSubmit={handleAddRoom} className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Adicionar Cômodo</h3>
            <Input placeholder="Nome do novo cômodo" value={newRoomName}
                   onChange={(e) => setNewRoomName(e.target.value)}/>
            <Button type="submit">Adicionar</Button>
        </form>
    </div>);
}

export function AppSidebar() {
    const {rooms, selectedRoom, setSelectedRoom, roomLabels} = useRoom();

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Sheet>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton>
                                        {roomLabels[selectedRoom] || "Selecionar Área"}
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                                    <DropdownMenuItem onClick={() => setSelectedRoom('all')}>
                                        <span>Todas as Áreas</span>
                                    </DropdownMenuItem>
                                    {rooms.map(room => (
                                        <DropdownMenuItem key={room.id} onClick={() => setSelectedRoom(room.id)}>
                                            <span>{room.name}</span>
                                        </DropdownMenuItem>
                                    ))}
                                    <SidebarSeparator className="my-1"/>
                                    <SheetTrigger asChild>
                                        <DropdownMenuItem>
                                            <span>Gerenciar Áreas...</span>
                                        </DropdownMenuItem>
                                    </SheetTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <SheetContent className="w-[300px] sm:w-[400px]">
                                <SheetHeader>
                                    <SheetTitle>Gerenciar Áreas</SheetTitle>
                                </SheetHeader>
                                <RoomManager/>
                            </SheetContent>
                        </Sheet>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <TariffManager/>
            </SidebarContent>
        </Sidebar>
    );
}