import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";

// Inter para UI y cuerpo (latin extended cubre acentos y enie).
// font-display: swap viene por defecto en next/font.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Newsreader como serif editorial — alternativa libre a Tiempos Headline,
// usada por Anthropic en sus titulares. Solo cargamos los pesos que usamos.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Clariza — Tu reclamo financiero, sin abogado",
  description:
    "Clariza traduce tu problema financiero, lo deriva al regulador correcto (CMF, SERNAC, SUSESO, SUPEN o tribunales) y te avisa antes de que se venza el plazo.",
  applicationName: "Clariza",
  authors: [{ name: "Cruzaders" }],
};

// En Next 16 themeColor va en el export viewport, no en metadata.
export const viewport: Viewport = {
  themeColor: "#FAF7F2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-CL"
      className={`${inter.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
