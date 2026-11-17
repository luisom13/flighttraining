"use client";

import { useState } from "react";
import { Wrench } from "lucide-react";
import { BLOQUES, DIAS, DIAS_CORTOS, RECURSOS, Reserva, finBloque } from "@/lib/data";

export function Leyenda() {
  const items = [
    { clase: "bg-marca", texto: "Vuelo confirmado" },
    { clase: "bg-cielo", texto: "Teoría" },
    { clase: "rayado", texto: "Mantenimiento" },
    { clase: "border border-dashed border-acero bg-white", texto: "Disponible" },
  ];
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-plomo">
      {items.map((i) => (
        <li key={i.texto} className="flex items-center gap-2">
          <span className={`h-4 w-4 rounded ${i.clase}`} aria-hidden="true" />
          {i.texto}
        </li>
      ))}
    </ul>
  );
}

function Celda({
  reserva,
  editable,
  resaltar,
  alAlternar,
}: {
  reserva?: Reserva;
  editable: boolean;
  resaltar?: string;
  alAlternar: () => void;
}) {
  if (!reserva) {
    return editable ? (
      <button
        onClick={alAlternar}
        title="Bloquear por mantenimiento"
        className="group grid h-full min-h-14 w-full place-items-center rounded-md border border-dashed border-acero bg-white text-xs text-transparent hover:border-tinta hover:text-plomo"
      >
        <span className="flex items-center gap-1">
          <Wrench className="h-3 w-3" aria-hidden="true" /> Bloquear
        </span>
      </button>
    ) : (
      <div className="h-full min-h-14 rounded-md border border-dashed border-acero bg-white" aria-label="Disponible" />
    );
  }
  if (reserva.tipo === "mantenimiento") {
    const contenido = (
      <>
        <span className="flex items-center gap-1 font-semibold">
          <Wrench className="h-3 w-3" aria-hidden="true" /> Mantenimiento
        </span>
        <span className="block truncate text-white/70">{reserva.nota}</span>
      </>
    );
    return editable ? (
      <button onClick={alAlternar} title="Liberar bloque" className="rayado h-full min-h-14 w-full rounded-md px-2 py-1.5 text-left text-xs text-white">
        {contenido}
      </button>
    ) : (
      <div className="rayado h-full min-h-14 rounded-md px-2 py-1.5 text-xs text-white">{contenido}</div>
    );
  }
  const esTeoria = reserva.tipo === "teoria";
  const mio = resaltar && reserva.alumno === resaltar;
  return (
    <div
      className={`h-full min-h-14 rounded-md px-2 py-1.5 text-xs text-white ${esTeoria ? "bg-cielo" : "bg-marca"} ${
        reserva.nuevo ? "destello ring-2 ring-tinta" : ""
      } ${mio ? "ring-2 ring-tinta" : ""}`}
      title={`${reserva.bloque} a ${finBloque(reserva.bloque)}`}
    >
      <span className="block truncate font-bold">{esTeoria ? reserva.nota : reserva.alumno}</span>
      <span className="block truncate text-white/85">{reserva.instructor}</span>
    </div>
  );
}

export default function Tablero({
  reservas,
  editable = false,
  resaltar,
  alAlternar,
  diaInicial = 0,
}: {
  reservas: Reserva[];
  editable?: boolean;
  resaltar?: string;
  alAlternar?: (recurso: string, dia: number, bloque: string) => void;
  diaInicial?: number;
}) {
  const [vista, setVista] = useState<"dia" | "aeronave">("dia");
  const [dia, setDia] = useState(diaInicial);
  const [recurso, setRecurso] = useState(RECURSOS[3].id);
  const buscar = (rec: string, d: number, b: string) => reservas.find((r) => r.recurso === rec && r.dia === d && r.bloque === b);
  const pestana = (activo: boolean) =>
    `rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${activo ? "bg-tinta text-white" : "text-plomo hover:bg-hangar"}`;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-full border border-acero p-1" role="group" aria-label="Tipo de vista">
          <button className={pestana(vista === "dia")} aria-pressed={vista === "dia"} onClick={() => setVista("dia")}>
            Por día
          </button>
          <button className={pestana(vista === "aeronave")} aria-pressed={vista === "aeronave"} onClick={() => setVista("aeronave")}>
            Por aeronave
          </button>
        </div>
        <Leyenda />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {vista === "dia"
          ? DIAS.map((d, i) => {
              const n = reservas.filter((r) => r.dia === i && r.tipo !== "mantenimiento").length;
              return (
                <button
                  key={d}
                  onClick={() => setDia(i)}
                  aria-pressed={dia === i}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${
                    dia === i ? "border-marca bg-marca-suave text-marca-fuerte" : "border-acero text-plomo hover:border-tinta"
                  }`}
                >
                  <span className="sm:hidden">{DIAS_CORTOS[i]}</span>
                  <span className="hidden sm:inline">{d}</span>
                  <span className="cifra ml-2 text-xs font-medium opacity-70">{n}</span>
                </button>
              );
            })
          : RECURSOS.map((x) => (
              <button
                key={x.id}
                onClick={() => setRecurso(x.id)}
                aria-pressed={recurso === x.id}
                className={`matricula rounded-lg border px-3 py-1.5 text-sm ${
                  recurso === x.id ? "border-marca bg-marca-suave text-marca-fuerte" : "border-acero text-plomo hover:border-tinta"
                }`}
              >
                {x.id}
              </button>
            ))}
      </div>

      <div className="mt-3 overflow-x-auto rounded-xl border border-acero bg-hangar">
        {vista === "dia" ? (
          <table className="w-full min-w-[980px] table-fixed border-separate border-spacing-1.5">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 w-40 bg-hangar px-2 py-1 text-left text-xs font-semibold text-plomo">Aeronave o aula</th>
                {BLOQUES.map((b) => (
                  <th key={b} className="cifra px-1 py-1 text-left text-xs font-semibold text-plomo">
                    {b}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECURSOS.map((x) => (
                <tr key={x.id}>
                  <th scope="row" className="sticky left-0 z-10 bg-hangar px-2 py-1 text-left align-middle">
                    <span className="matricula block text-sm">{x.id}</span>
                    <span className="block truncate text-xs font-normal text-plomo">{x.modelo}</span>
                  </th>
                  {BLOQUES.map((b) => (
                    <td key={b} className="h-14 p-0 align-top">
                      <Celda reserva={buscar(x.id, dia, b)} editable={editable} resaltar={resaltar} alAlternar={() => alAlternar?.(x.id, dia, b)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full min-w-[900px] table-fixed border-separate border-spacing-1.5">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 w-20 bg-hangar px-2 py-1 text-left text-xs font-semibold text-plomo">Hora</th>
                {DIAS.map((d) => (
                  <th key={d} className="px-1 py-1 text-left text-xs font-semibold text-plomo">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BLOQUES.map((b) => (
                <tr key={b}>
                  <th scope="row" className="cifra sticky left-0 z-10 bg-hangar px-2 text-left text-sm font-bold">
                    {b}
                  </th>
                  {DIAS.map((_, i) => (
                    <td key={i} className="h-14 p-0 align-top">
                      <Celda reserva={buscar(recurso, i, b)} editable={editable} resaltar={resaltar} alAlternar={() => alAlternar?.(recurso, i, b)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
