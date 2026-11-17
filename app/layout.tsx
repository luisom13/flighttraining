import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { Proveedor } from "@/lib/store";
import BarraSuperior from "@/components/BarraSuperior";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

// En producción, definir NEXT_PUBLIC_SITE_URL con el dominio final (ej. https://flighttraining.com.sv)
// para que las imágenes Open Graph se publiquen con URL absoluta.
const SITIO = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const DESCRIPCION =
  "Escuela de aviación en el Aeropuerto Internacional de Ilopango. Piloto privado y comercial, instrumentos, multimotor, tripulante de cabina y agente de counter, con flota propia y simulador Redbird.";

export const metadata: Metadata = {
  metadataBase: new URL(SITIO),
  title: {
    default: "Flight Training | Escuela de aviación en El Salvador",
    template: "%s | Flight Training",
  },
  description: DESCRIPCION,
  applicationName: "Flight Training",
  keywords: [
    "escuela de aviación El Salvador",
    "curso de piloto El Salvador",
    "piloto privado",
    "piloto comercial",
    "tripulante de cabina",
    "agente de counter",
    "Ilopango",
    "MSSS",
    "Flight Training",
  ],
  alternates: { canonical: `${BASE}/` },
  openGraph: {
    type: "website",
    locale: "es_SV",
    url: `${BASE}/`,
    siteName: "Flight Training",
    title: "Tu carrera en la aviación comienza en El Salvador",
    description: DESCRIPCION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Tu carrera en la aviación comienza en El Salvador",
    description: DESCRIPCION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${archivo.variable} antialiased`}>
      <body className="min-h-screen">
        <Proveedor>
          <BarraSuperior />
          {children}
        </Proveedor>
      </body>
    </html>
  );
}
