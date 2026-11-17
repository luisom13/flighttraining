"use client";

import { useState } from "react";
import { CalendarDays, Gauge, NotebookPen } from "lucide-react";
import { ALUMNO } from "@/lib/data";
import { useDemo } from "@/lib/store";
import Programacion from "@/components/alumno/Programacion";
import Avance from "@/components/alumno/Avance";
import Bitacora from "@/components/alumno/Bitacora";

const PESTANAS = [
  { id: "programacion", texto: "Programación semanal", icono: CalendarDays },
  { id: "avance", texto: "Mi avance", icono: Gauge },
  { id: "bitacora", texto: "Bitácora y debriefings", icono: NotebookPen },
] as const;

export default function PortalAlumno() {
  const { listo } = useDemo();
  const [pestana, setPestana] = useState<(typeof PESTANAS)[number]["id"]>("programacion");

  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-plomo">
            {ALUMNO.programa}, carné {ALUMNO.codigo}
          </p>
          <h1 className="rotulo mt-1 text-3xl sm:text-4xl">Hola, {ALUMNO.nombre.split(" ")[0]}</h1>
        </div>
        <p className="rounded-full bg-marca-suave px-4 py-2 text-sm font-bold text-marca-fuerte">{ALUMNO.fase}</p>
      </header>

      <nav className="mt-6 flex gap-1 overflow-x-auto border-b border-acero" role="tablist" aria-label="Secciones del portal">
        {PESTANAS.map((p) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={pestana === p.id}
            onClick={() => setPestana(p.id)}
            className={`-mb-px flex shrink-0 items-center gap-2 border-b-[3px] px-4 py-3 font-bold ${
              pestana === p.id ? "border-marca text-tinta" : "border-transparent text-plomo hover:text-tinta"
            }`}
          >
            <p.icono className="h-4 w-4" aria-hidden="true" /> {p.texto}
          </button>
        ))}
      </nav>

      <div className="mt-8">
        {!listo ? null : pestana === "programacion" ? <Programacion /> : pestana === "avance" ? <Avance /> : <Bitacora />}
      </div>
    </main>
  );
}
