"use client";

import { useState } from "react";
import { BellRing, BookOpen, CalendarCheck, Plane, Send } from "lucide-react";
import { ALUMNO, Asignacion, BLOQUES, DIAS, DIAS_CORTOS, EstadoSolicitud, FASES, Franja, INSTRUCTORES, SEMANA, finBloque } from "@/lib/data";
import { useDemo } from "@/lib/store";

export const ESTADOS: Record<EstadoSolicitud, { texto: string; clase: string }> = {
  pendiente: { texto: "Pendiente de aprobación", clase: "bg-alerta-suave text-alerta" },
  confirmado: { texto: "Confirmado", clase: "bg-ok-suave text-ok" },
  reprogramado: { texto: "Reprogramado", clase: "bg-cielo-suave text-cielo" },
};

export function Pastilla({ estado }: { estado: EstadoSolicitud }) {
  const e = ESTADOS[estado];
  return <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${e.clase}`}>{e.texto}</span>;
}

export default function Programacion() {
  const { reservas, solicitudes, avisos, enviarSolicitud, marcarAvisosLeidos } = useDemo();
  const [modo, setModo] = useState<"vuelo" | "teoria">("vuelo");
  const [marcas, setMarcas] = useState<Record<string, "vuelo" | "teoria">>({});
  const [fase, setFase] = useState(ALUMNO.fase);
  const [instructor, setInstructor] = useState("Kevin Alemán");
  const [comentario, setComentario] = useState("");

  const mias = solicitudes.filter((s) => s.alumno === ALUMNO.nombre);
  const misReservas = reservas.filter((r) => r.alumno === ALUMNO.nombre).sort((a, b) => a.dia - b.dia || a.bloque.localeCompare(b.bloque));
  const misAvisos = avisos.filter((a) => a.para === ALUMNO.nombre);
  const franjas: Franja[] = Object.entries(marcas).map(([k, tipo]) => {
    const [dia, bloque] = k.split("|");
    return { dia: Number(dia), bloque, tipo };
  });
  const nVuelo = franjas.filter((f) => f.tipo === "vuelo").length;
  const nTeoria = franjas.length - nVuelo;

  const alternar = (k: string) =>
    setMarcas((m) => {
      const copia = { ...m };
      if (copia[k] === modo) delete copia[k];
      else copia[k] = modo;
      return copia;
    });

  return (
    <div className="space-y-8">
      {misAvisos.length > 0 && (
        <section className="entrar rounded-2xl border-2 border-ok bg-ok-suave p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-bold">
              <BellRing className="h-5 w-5 text-ok" aria-hidden="true" /> Avisos de despacho
            </h2>
            {misAvisos.some((a) => !a.leido) && (
              <button onClick={marcarAvisosLeidos} className="text-sm font-semibold underline underline-offset-4">
                Marcar como leídos
              </button>
            )}
          </div>
          <ul className="mt-3 space-y-2">
            {misAvisos.map((a) => (
              <li key={a.id} className="flex gap-3">
                <span className="cifra shrink-0 text-sm text-plomo">{a.hora}</span>
                <span className={a.leido ? "" : "font-semibold"}>{a.texto}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold">Marca cuándo puedes venir</h2>
          <p className="mt-1 text-plomo">
            {SEMANA}. Elige si marcas para vuelo o para teoría y toca los bloques que tienes libres. Despacho te asigna avión e
            instructor.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex gap-1 rounded-full border border-acero p-1" role="group" aria-label="Qué estás marcando">
              <button
                onClick={() => setModo("vuelo")}
                aria-pressed={modo === "vuelo"}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold ${modo === "vuelo" ? "bg-marca text-white" : "text-plomo"}`}
              >
                <Plane className="h-4 w-4" aria-hidden="true" /> Vuelo
              </button>
              <button
                onClick={() => setModo("teoria")}
                aria-pressed={modo === "teoria"}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold ${modo === "teoria" ? "bg-cielo text-white" : "text-plomo"}`}
              >
                <BookOpen className="h-4 w-4" aria-hidden="true" /> Clase teórica
              </button>
            </div>
            {franjas.length > 0 && (
              <button onClick={() => setMarcas({})} className="text-sm font-semibold text-plomo underline underline-offset-4">
                Borrar selección
              </button>
            )}
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-acero bg-hangar p-2">
            <table className="w-full min-w-[640px] table-fixed border-separate border-spacing-1">
              <thead>
                <tr>
                  <th className="w-24 px-1 text-left text-xs font-semibold text-plomo">Bloque</th>
                  {DIAS.map((d, i) => (
                    <th key={d} className="py-1 text-center text-sm font-bold">
                      <span className="hidden md:inline">{d}</span>
                      <span className="md:hidden">{DIAS_CORTOS[i]}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BLOQUES.map((b) => (
                  <tr key={b}>
                    <th scope="row" className="cifra px-1 text-left text-xs font-semibold text-plomo">
                      {b} a {finBloque(b)}
                    </th>
                    {DIAS.map((d, i) => {
                      const k = `${i}|${b}`;
                      const marca = marcas[k];
                      const reservado = misReservas.find((r) => r.dia === i && r.bloque === b);
                      if (reservado)
                        return (
                          <td key={k}>
                            <div className="grid h-11 place-items-center rounded-md bg-ok text-xs font-bold text-white" title={`Ya confirmado en ${reservado.recurso}`}>
                              <CalendarCheck className="h-4 w-4" aria-label="Ya confirmado" />
                            </div>
                          </td>
                        );
                      return (
                        <td key={k}>
                          <button
                            onClick={() => alternar(k)}
                            aria-pressed={!!marca}
                            aria-label={`${d} ${b}${marca ? `, marcado para ${marca === "vuelo" ? "vuelo" : "teoría"}` : ""}`}
                            className={`grid h-11 w-full place-items-center rounded-md text-xs font-bold transition-colors ${
                              marca === "vuelo"
                                ? "bg-marca text-white"
                                : marca === "teoria"
                                  ? "bg-cielo text-white"
                                  : "border border-dashed border-acero bg-white text-transparent hover:border-tinta"
                            }`}
                          >
                            {marca === "vuelo" ? "Vuelo" : marca === "teoria" ? "Teoría" : "·"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <form
          className="self-start rounded-2xl bg-hangar p-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!franjas.length) return;
            enviarSolicitud({ fase, instructorPreferido: instructor, comentario, franjas });
            setMarcas({});
            setComentario("");
          }}
        >
          <h3 className="text-lg font-bold">Tu solicitud</h3>
          <p className="mt-1 text-sm text-plomo">
            {franjas.length === 0
              ? "Todavía no marcas ningún bloque."
              : `${nVuelo} ${nVuelo === 1 ? "bloque" : "bloques"} de vuelo y ${nTeoria} de teoría.`}
          </p>
          <label className="mt-4 block text-sm font-semibold">
            Fase actual
            <select value={fase} onChange={(e) => setFase(e.target.value)} className="mt-1 w-full rounded-lg border border-acero bg-white px-3 py-2.5 text-base">
              {FASES.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label className="mt-4 block text-sm font-semibold">
            Instructor de preferencia
            <select value={instructor} onChange={(e) => setInstructor(e.target.value)} className="mt-1 w-full rounded-lg border border-acero bg-white px-3 py-2.5 text-base">
              <option value="">Sin preferencia</option>
              {INSTRUCTORES.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label className="mt-4 block text-sm font-semibold">
            Nota para despacho <span className="font-normal text-plomo">(opcional)</span>
            <textarea
              rows={2}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Ej. el jueves solo puedo hasta las 10"
              className="mt-1 w-full rounded-lg border border-acero bg-white px-3 py-2.5 text-base"
            />
          </label>
          <button
            disabled={!franjas.length}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-marca px-4 py-3.5 font-bold text-white hover:bg-marca-fuerte disabled:cursor-not-allowed disabled:bg-acero disabled:text-plomo"
          >
            <Send className="h-4 w-4" aria-hidden="true" /> Enviar disponibilidad de la semana
          </button>
        </form>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="min-w-0">
          <h2 className="text-xl font-bold">Mis solicitudes</h2>
          {mias.length === 0 ? (
            <p className="mt-3 rounded-xl border border-dashed border-acero p-5 text-plomo">
              Aún no envías disponibilidad para esta semana. Marca tus bloques arriba y envíala.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {mias.map((s) => (
                <li key={s.id} className="entrar rounded-xl border border-acero p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm text-plomo">Enviada: {s.enviada}</span>
                    <Pastilla estado={s.estado} />
                  </div>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {(s.asignaciones ?? s.franjas).map((f, i) => (
                      <li
                        key={i}
                        className={`rounded-md px-2 py-1 text-xs font-semibold ${f.tipo === "vuelo" ? "bg-marca-suave text-marca-fuerte" : "bg-cielo-suave text-cielo"}`}
                      >
                        {DIAS_CORTOS[f.dia]} {f.bloque}
                        {"recurso" in f ? `, ${(f as Asignacion).recurso}, ${(f as Asignacion).instructor}` : f.tipo === "vuelo" ? ", vuelo" : ", teoría"}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold">Mi semana confirmada</h2>
          {misReservas.length === 0 ? (
            <p className="mt-3 rounded-xl border border-dashed border-acero p-5 text-plomo">
              Cuando despacho apruebe tu solicitud, tus vuelos y clases aparecen aquí con avión e instructor.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {misReservas.map((r) => (
                <li key={r.id} className="entrar flex items-center gap-4 rounded-xl bg-hangar p-4">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-white ${r.tipo === "teoria" ? "bg-cielo" : "bg-marca"}`}>
                    {r.tipo === "teoria" ? <BookOpen className="h-5 w-5" aria-hidden="true" /> : <Plane className="h-5 w-5" aria-hidden="true" />}
                  </span>
                  <span>
                    <span className="block font-bold">
                      {DIAS[r.dia]}, {r.bloque} a {finBloque(r.bloque)}
                    </span>
                    <span className="block text-sm text-plomo">
                      <span className="matricula text-tinta">{r.recurso}</span> con {r.instructor}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
