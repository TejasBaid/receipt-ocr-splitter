// src/app/layout.js or layout.tsx (if you're using TypeScript)
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Receiptify",
    description: "Receipt OCR APP",
    manifest: "/manifest.json",
    themeColor: "#4F46E5",
    icons: {
        icon: "/icons/logo1.png",
        apple: "/icons/logo1.png",
    },
};

// ✅ Functional RootLayout
export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ServiceWorkerRegister />
        {children}
        </body>
        </html>
    );
}
