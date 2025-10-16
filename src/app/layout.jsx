import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { RoomProvider } from "@/context/RoomContext";
import { TariffProvider } from "@/context/TariffContext";
import { DataProvider } from "@/context/DataContext";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Katchau",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} flex`}>
        <TariffProvider>
            <RoomProvider>
                <DataProvider>
                    <SidebarProvider>
                        <AppSidebar />
                        <main className="flex-1 p-4">
                            <header className="flex items-center gap-2 pb-4">
                                <SidebarTrigger />
                                <h1 className="text-lg font-semibold">Dashboard</h1>
                            </header>
                            {children}
                        </main>
                    </SidebarProvider>
                </DataProvider>
            </RoomProvider>
        </TariffProvider>
        </body>
        </html>
    );
}