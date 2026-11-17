"use client";

import { useEffect, useState } from "react";
import { ChevronRight, PenLine, ShieldCheck, X } from "lucide-react";
import { ALUMNO, ESCALA, VUELOS, Vuelo } from "@/lib/data";
import { useDemo } from "@/lib/store";

const fechaLarga = (f: string) => new Date(f + "T12:00:00").toLocaleDateString("es-SV", { weekday: "short", day: "numeric", month: "short" });

const COLOR_NOTA = ["", "bg-critico", "bg-alerta", "bg-ok", "bg-ok"];

export function FichaDebriefing({ vuelo, alCerrar, vistaInstructor = false }: { vuelo: Vuelo; alCerrar: () => void; vistaInstructor?: boolean }) {
  const { firmas, firmarVuelo } = useDemo();
  const firmaAlumno = vuelo.firmaAlumno ?? firmas[vuelo.id] ?? null;

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && alCerrar();
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [alCerrar]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-tinta/60 sm:items-center sm:p-6" onClick={alCerrar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-debriefing"
        className="entrar max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-white sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sticky top-0 flex items-start justify-between gap-4 bg-tinta px-6 py-5 text-white">
          <div>
            <p className="text-sm text-white/70">
              Debriefing del {fechaLarga(vuelo.fecha)}, <span className="matricula text-marca">{vuelo.aeronave}</span>
            </p>
            <h2 id="titulo-debriefing" className="mt-1 text-xl font-bold">
              {vuelo.leccion}
            </h2>
          </div>
          <button onClick={alCerrar} className="grid h-9 w-9 shrink-0 place-items-center rounded-full hover:bg-white/15" autoFocus>
            <X className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Cerrar</span>
          </button>
        </header>

        <div className="space-y-7 p-6">
          <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            {[
              ["Ruta", vuelo.ruta],
              ["Tipo", vuelo.tipo],
              ["Duración", `${vuelo.duracion.toFixed(1)} h`],
              ["Aterrizajes", String(vuelo.aterrizajes)],
            ].map(([t, v]) => (
              <div key={t}>
                <dt className="text-plomo">{t}</dt>
                <dd className="font-bold">{v}</dd>
              </div>
            ))}
          </dl>

          <section>
            <h3 className="font-bold">Maniobras evaluadas</h3>
            <ul className="mt-3 space-y-2.5">
              {vuelo.maniobras.map((m) => (
                <li key={m.nombre} className="grid grid-cols-[9rem_1fr] items-center gap-3 sm:grid-cols-[11rem_8rem_1fr]">
                  <span className="font-semibold">{m.nombre}</span>
                  <span className="flex gap-1" role="img" aria-label={`${m.nota} de 4`}>
                    {[1, 2, 3, 4].map((n) => (
                      <span key={n} className={`h-3 flex-1 rounded-sm ${n <= m.nota ? COLOR_NOTA[m.nota] : "bg-acero"}`} />
                    ))}
                  </span>
                  <span className="col-span-2 text-sm text-plomo sm:col-span-1">
                    <strong className="cifra text-tinta">{m.nota}</strong> · {ESCALA[m.nota - 1].texto}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-plomo">Escala: 1 requiere instrucción, 2 requiere práctica, 3 satisfactorio, 4 estándar de chequeo.</p>
          </section>

          <section>
            <h3 className="font-bold">Comentarios de {vuelo.instructor}</h3>
            <p className="mt-2 max-w-[68ch] leading-relaxed">{vuelo.comentarios}</p>
          </section>

          <section className="rounded-xl bg-marca-suave p-5">
            <h3 className="font-bold">Para tu próximo vuelo</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              {vuelo.recomendaciones.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-ok bg-ok-suave p-4">
              <p className="flex items-center gap-2 font-bold text-ok">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" /> Firmado por el instructor
              </p>
              <p className="mt-1 text-sm">
                {vuelo.instructor}, {vuelo.firmaInstructor}
              </p>
            </div>
            {firmaAlumno ? (
              <div className="entrar rounded-xl border border-ok bg-ok-suave p-4">
                <p className="flex items-center gap-2 font-bold text-ok">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" /> Firmado por el alumno
                </p>
                <p className="mt-1 text-sm">
                  {ALUMNO.nombre}, {firmaAlumno}
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-alerta bg-alerta-suave p-4">
                <p className="font-bold text-alerta">Falta la firma del alumno</p>
                {vistaInstructor ? (
                  <p className="mt-1 text-sm">El alumno recibió el aviso para leer y firmar.</p>
                ) : (
                  <button
                    onClick={() => firmarVuelo(vuelo.id)}
                    className="mt-2 flex items-center gap-2 rounded-full bg-tinta px-4 py-2 text-sm font-bold text-white hover:bg-black"
                  >
                    <PenLine className="h-4 w-4" aria-hidden="true" /> Leí el debriefing y firmo
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default function Bitacora() {
  const { firmas } = useDemo();
  const [abierto, setAbierto] = useState<Vuelo | null>(null);
  const total = VUELOS.reduce((s, v) => s + v.duracion, 0);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Bitácora digital</h2>
          <p className="mt-1 text-plomo">Toca un vuelo para leer el debriefing de tu instructor.</p>
        </div>
        <p className="text-sm text-plomo">
          Últimos {VUELOS.length} vuelos, <strong className="cifra text-tinta">{total.toFixed(1)} h</strong>
        </p>
      </div>
      <ul className="mt-5 divide-y divide-acero overflow-hidden rounded-2xl border border-acero">
        {VUELOS.map((v) => {
          const firmado = v.firmaAlumno ?? firmas[v.id];
          const promedio = v.maniobras.reduce((s, m) => s + m.nota, 0) / v.maniobras.length;
          return (
            <li key={v.id}>
              <button
                onClick={() => setAbierto(v)}
                className="grid w-full grid-cols-[1fr_auto] items-center gap-4 px-4 py-4 text-left hover:bg-hangar sm:grid-cols-[7rem_8rem_1fr_4rem_9rem_auto] sm:px-5"
              >
                <span className="hidden font-bold capitalize sm:block">{fechaLarga(v.fecha)}</span>
                <span className="matricula hidden text-sm sm:block">{v.aeronave}</span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold capitalize text-plomo sm:hidden">
                    {fechaLarga(v.fecha)}, {v.aeronave}, {v.duracion.toFixed(1)} h
                  </span>
                  <span className="block truncate font-semibold">{v.leccion}</span>
                  <span className="block truncate text-sm text-plomo">
                    {v.ruta}, con {v.instructor}
                  </span>
                  {!firmado && <span className="mt-1 inline-block rounded-full bg-alerta-suave px-2.5 py-0.5 text-xs font-bold text-alerta sm:hidden">Falta tu firma</span>}
                </span>
                <span className="cifra hidden text-right font-bold sm:block">{v.duracion.toFixed(1)} h</span>
                <span className="hidden sm:block">
                  {firmado ? (
                    <span className="rounded-full bg-ok-suave px-2.5 py-1 text-xs font-bold text-ok">Nota media {promedio.toFixed(1)}</span>
                  ) : (
                    <span className="rounded-full bg-alerta-suave px-2.5 py-1 text-xs font-bold text-alerta">Falta tu firma</span>
                  )}
                </span>
                <ChevronRight className="h-5 w-5 text-plomo" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
      {abierto && <FichaDebriefing vuelo={abierto} alCerrar={() => setAbierto(null)} />}
    </div>
  );
}
