import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"]
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"]
});

export const metadata: Metadata = {
    title: "Buscador de Imágenes Similares",
    description: "Busca imágenes similares y agrega nuevas al índice."
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {/* Barra de navegación */}
                <nav className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-14 items-center">
                            <span className="text-lg font-bold text-gray-800">
                                Image Search
                            </span>
                            <div className="flex space-x-6">
                                <Link
                                    href="/"
                                    className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    Buscar
                                </Link>
                                <Link
                                    href="/upload"
                                    className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    Subir Imagen
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {children}
            </body>
        </html>
    );
}
