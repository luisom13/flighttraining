"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle2, Globe, GraduationCap, RadioTower, RotateCcw } from "lucide-react";
import { BASE } from "@/lib/data";
import { useDemo } from "@/lib/store";

// Emblema oficial (recortado de _referencias/Logo FT.jpg, sin fondo).
// "claro" usa la variante con franjas blancas para fondos oscuros.
export function Logo({ claro = false }: { claro?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <Image
        src={claro ? `${BASE}/img/logo-emblema-claro.png` : `${BASE}/img/logo-emblema.png`}
        alt=""
        width={400}
        height={155}
        className="h-8 w-auto"
        priority
      />
      <span className={`hidden text-[17px] font-bold leading-none tracking-tight sm:inline ${claro ? "text-white" : "text-tinta"}`}>
        <span className="text-marca">Flight</span>Training
      </span>
    </span>
  );
}

const ROLES = [
  { href: "/", texto: "Sitio público", corto: "Público", icono: Globe },
  { href: "/alumno", texto: "Alumno", corto: "Alumno", icono: GraduationCap },
  { href: "/despacho", texto: "Despacho e instructores", corto: "Despacho", icono: RadioTower },
];

export default function BarraSuperior() {
  const ruta = usePathname();
  const { solicitudes, avisos, toast, reiniciar } = useDemo();
  const pendientes = solicitudes.filter((s) => s.estado === "pendiente").length;
  const sinLeer = avisos.filter((a) => !a.leido && a.para === "Alejandra Menjívar").length;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-acero bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6">
          <Link href="/" aria-label="Flight Training, inicio">
            <Logo />
          </Link>
          <nav aria-label="Vista de la demo" className="ml-auto flex items-center gap-1 rounded-full bg-hangar p-1">
            {ROLES.map((r) => {
              const activo = r.href === "/" ? ruta === "/" : ruta.startsWith(r.href);
              const globo = r.href === "/despacho" ? pendientes : r.href === "/alumno" ? sinLeer : 0;
              return (
                <Link
                  key={r.href}
                  href={r.href}
                  aria-current={activo ? "page" : undefined}
                  className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                    activo ? "bg-marca text-white" : "text-plomo hover:text-tinta"
                  }`}
                >
                  <r.icono className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden md:inline">{r.texto}</span>
                  <span className="hidden sm:inline md:hidden">{r.corto}</span>
                  <span className="sr-only sm:hidden">{r.texto}</span>
                  {globo > 0 && (
                    <span className="cifra absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-tinta px-1 text-[11px] font-bold text-white">
                      {globo}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          <button
            onClick={reiniciar}
            title="Reiniciar la demo"
            className="grid h-9 w-9 place-items-center rounded-full text-plomo hover:bg-hangar hover:text-tinta"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Reiniciar la demo</span>
          </button>
        </div>
      </header>
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
        {toast && (
          <div className="entrar pointer-events-auto flex max-w-xl items-start gap-3 rounded-xl bg-tinta px-4 py-3 text-sm font-medium text-white shadow-2xl">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-marca" aria-hidden="true" />
            {toast}
          </div>
        )}
      </div>
    </>
  );
}
