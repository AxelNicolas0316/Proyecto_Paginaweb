import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CarritoProvider } from "./context/CarritoContext";
import { AuthProvider } from "./context/AuthContext";
import ChatBot from "./components/ChatBot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Suministros y Suministros Ecuador",
  description: "Todo en suministros industriales, ferretería y seguridad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <CarritoProvider>
            {children}
            <ChatBot />
          </CarritoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}