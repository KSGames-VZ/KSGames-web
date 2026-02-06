import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google"; // Note: Press_Start_2P might act weird if not variable, but let's try
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
// Just using Inter for now to avoid variable font issues with pixel fonts usually not being variable.
// or use a safe google font import

export const metadata: Metadata = {
  title: "KS Games | Compro tus Videojuegos",
  description: "Vende tus juegos de N64, SNES, PS1 y más. ¡Cotiza al instante!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-black text-slate-200 antialiased selection:bg-amber-500/30 selection:text-amber-100`}>
        <div className="scanline" />
        {children}
      </body>
    </html>
  );
}
