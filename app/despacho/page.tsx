"use client";

import { useRef, useState } from "react";
import { AlertTriangle, BookOpen, CheckCheck, Inbox, Plane, Sparkles, UserPlus } from "lucide-react";
import { Asignacion, BLOQUES, DIAS, INSTRUCTORES, RECURSOS, SEMANA, Solicitud, VUELOS, Vuelo } from "@/lib/data";
import { instructorOcupado, ocupado, recursosLibres, sugerir, useDemo } from "@/lib/store";
import Tablero from "@/components/Tablero";
import { Pastilla } from "@/components/alumno/Programacion";
import { FichaDebriefing } from "@/components/alumno/Bitacora";

const sel = "w-full rounded-lg border border-acero bg-white px-2 py-2 text-sm";

function TarjetaSolicitud({ sol, alAprobar }: { sol: Solicitud; alAprobar: (dia: number) => void }) {
  const { reservas, aprobarSolicitud } = useDemo();
  const [asig, setAsig] = useState<Asignacion[]>(() => sugerir(reservas, sol));

  const cambiar = (i: number, cambio: Partial<Asignacion>) =>
    setAsig((lista) =>
      lista.map((a, j) => {
        if (j !== i) return a;
        const n = { ...a, ...cambio };
        const orig = sol.franjas[i];
        n.movida = n.dia !== orig.dia || n.bloque !== orig.bloque;
        n.original = n.movida ? `${DIAS[orig.dia]} ${orig.bloque}` : undefined;
        if (ocupado(reservas, n.recurso, n.dia, n.bloque)) n.recurso = recursosLibres(reservas, n)[0]?.id ?? "";
        return n;
      })
    );

  const choque = (a: Asignacion, i: number) =>
    !a.recurso ||
    ocupado(reservas, a.recurso, a.dia, a.bloque) ||
    asig.some((b, j) => j !== i && b.dia === a.dia && b.bloque === a.bloque && (b.recurso === a.recurso || b.instructor === a.instructor));
  const hayChoque = asig.some(choque);

  return (
    <article className="entrar rounded-2xl border border-acero bg-white p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">{sol.alumno}</h3>
          <p className="text-sm text-plomo">
            {sol.programa}. {sol.fase}
          </p>
        </div>
        <div className="text-right">
          <Pastilla estado={sol.estado} />
          <p className="mt-1 text-xs text-plomo">Recibida: {sol.enviada}</p>
        </div>
      </header>
      {sol.comentario && <p className="mt-3 rounded-lg bg-hangar px-3 py-2 text-sm">“{sol.comentario}”</p>}
      <p className="mt-3 flex items-center gap-1.5 text-sm text-plomo">
        <Sparkles className="h-4 w-4 text-marca" aria-hidden="true" />
        Propuesta sin choques
        {sol.instructorPreferido ? `, con preferencia por ${sol.instructorPreferido}` : ""}. Puedes ajustarla.
      </p>

      <ul className="mt-3 space-y-2">
        {asig.map((a, i) => {
          const libres = recursosLibres(reservas, a);
          const instOcupado = instructorOcupado(reservas, a.instructor, a.dia, a.bloque);
          return (
            <li key={i} className={`rounded-xl p-3 ${a.tipo === "vuelo" ? "bg-marca-suave" : "bg-cielo-suave"}`}>
              <div className="grid items-center gap-2 sm:grid-cols-[5.5rem_1fr_1fr_1.2fr_1.2fr]">
                <span className={`flex items-center gap-1.5 text-sm font-bold ${a.tipo === "vuelo" ? "text-marca-fuerte" : "text-cielo"}`}>
                  {a.tipo === "vuelo" ? <Plane className="h-4 w-4" aria-hidden="true" /> : <BookOpen className="h-4 w-4" aria-hidden="true" />}
                  {a.tipo === "vuelo" ? "Vuelo" : "Teoría"}
                </span>
                <select aria-label="Día" className={sel} value={a.dia} onChange={(e) => cambiar(i, { dia: Number(e.target.value) })}>
                  {DIAS.map((d, n) => (
                    <option key={d} value={n}>
                      {d}
                    </option>
                  ))}
                </select>
                <select aria-label="Bloque" className={sel} value={a.bloque} onChange={(e) => cambiar(i, { bloque: e.target.value })}>
                  {BLOQUES.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
                <select aria-label="Aeronave o aula" className={`${sel} font-bold`} value={a.recurso} onChange={(e) => cambiar(i, { recurso: e.target.value })}>
                  {libres.length === 0 && <option value="">Sin disponibilidad</option>}
                  {libres.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.id} · {x.modelo.replace("Piper ", "")}
                    </option>
                  ))}
                </select>
                <select aria-label="Instructor" className={sel} value={a.instructor} onChange={(e) => cambiar(i, { instructor: e.target.value })}>
                  {INSTRUCTORES.map((x) => (
                    <option key={x} value={x}>
                      {x}
                      {instructorOcupado(reservas, x, a.dia, a.bloque) ? " (ocupado)" : ""}
                    </option>
                  ))}
                </select>
              </div>
              {(a.movida || instOcupado || choque(a, i)) && (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold">
                  {choque(a, i) ? (
                    <>
                      <AlertTriangle className="h-3.5 w-3.5 text-critico" aria-hidden="true" /> Hay un choque en este bloque. Cambia el horario, la aeronave o el
                      instructor.
                    </>
                  ) : instOcupado ? (
                    <>
                      <AlertTriangle className="h-3.5 w-3.5 text-alerta" aria-hidden="true" /> {a.instructor} ya tiene otro alumno en este bloque.
                    </>
                  ) : (
                    <>El alumno pidió {a.original}. Se le avisará del cambio.</>
                  )}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <button
        disabled={hayChoque}
        onClick={() => {
          aprobarSolicitud(sol.id, asig);
          alAprobar(asig[0].dia);
        }}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-marca px-4 py-3 font-bold text-white hover:bg-marca-fuerte disabled:cursor-not-allowed disabled:bg-acero disabled:text-plomo sm:w-auto"
      >
        <CheckCheck className="h-5 w-5" aria-hidden="true" />
        {asig.some((a) => a.movida) ? "Reprogramar y notificar al alumno" : "Aprobar y notificar al alumno"}
      </button>
    </article>
  );
}

export default function Despacho() {
  const { listo, reservas, solicitudes, prospectos, avisos, firmas, alternarMantenimiento } = useDemo();
  const [diaFoco, setDiaFoco] = useState(0);
  const [ficha, setFicha] = useState<Vuelo | null>(null);
  const refTablero = useRef<HTMLDivElement>(null);

  if (!listo) return <main className="min-h-screen bg-hangar" />;

  const pendientes = solicitudes.filter((s) => s.estado === "pendiente");
  const resueltas = solicitudes.filter((s) => s.estado !== "pendiente");
  const vuelos = reservas.filter((r) => r.tipo === "vuelo").length;
  const aeronaves = RECURSOS.filter((x) => x.tipo === "aeronave");
  const capacidad = aeronaves.length * BLOQUES.length * 6;
  const usados = reservas.filter((r) => r.tipo !== "teoria" && r.dia < 6 && aeronaves.some((a) => a.id === r.recurso)).length;
  const enTaller = new Set(reservas.filter((r) => r.tipo === "mantenimiento").map((r) => r.recurso)).size;
  const sinFirma = VUELOS.filter((v) => !v.firmaAlumno && !firmas[v.id]);

  const kpis = [
    { t: "Solicitudes por aprobar", v: pendientes.length, acento: pendientes.length > 0 },
    { t: "Vuelos programados", v: vuelos },
    { t: "Ocupación de la flota", v: `${Math.round((usados / capacidad) * 100)} %` },
    { t: "Aeronaves con taller", v: enTaller },
  ];

  return (
    <main className="bg-hangar">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6">
        <header>
          <p className="text-plomo">{SEMANA}</p>
          <h1 className="rotulo mt-1 text-3xl sm:text-4xl">Despacho de vuelos</h1>
        </header>

        <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.t} className={`rounded-2xl p-4 ${k.acento ? "bg-marca text-white" : "bg-white"}`}>
              <dt className={`text-sm ${k.acento ? "text-white/90" : "text-plomo"}`}>{k.t}</dt>
              <dd className="cifra mt-1 text-3xl font-extrabold">{k.v}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Inbox className="h-6 w-6 text-marca" aria-hidden="true" /> Solicitudes de los alumnos
          </h2>
          <p className="mt-1 text-plomo">Llegan desde el portal, ya no por WhatsApp. Revisa la propuesta y aprueba.</p>
          {pendientes.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-acero bg-white p-6 text-plomo">
              Bandeja al día. Cuando un alumno envíe su disponibilidad aparecerá aquí.
            </p>
          ) : (
            <div className="mt-4 grid gap-4 xl:grid-cols-2">
              {pendientes.map((s) => (
                <TarjetaSolicitud
                  key={s.id}
                  sol={s}
                  alAprobar={(dia) => {
                    setDiaFoco(dia);
                    window.setTimeout(() => refTablero.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
                  }}
                />
              ))}
            </div>
          )}
          {resueltas.length > 0 && (
            <ul className="mt-4 space-y-2">
              {resueltas.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-4 py-3">
                  <span>
                    <strong>{s.alumno}</strong>{" "}
                    <span className="text-sm text-plomo">
                      {s.asignaciones?.map((a) => `${DIAS[a.dia]} ${a.bloque} en ${a.recurso}`).join("; ")}
                    </span>
                  </span>
                  <Pastilla estado={s.estado} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section ref={refTablero} className="mt-12 min-w-0 scroll-mt-20 rounded-2xl bg-white p-4 sm:p-6">
          <h2 className="text-2xl font-bold">Tablero de la semana</h2>
          <p className="mb-5 mt-1 text-plomo">Toca un bloque disponible para bloquearlo por mantenimiento, o un bloque en taller para liberarlo.</p>
          <Tablero key={diaFoco + "-" + reservas.length} reservas={reservas} editable diaInicial={diaFoco} alAlternar={alternarMantenimiento} />
        </section>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl bg-white p-5">
            <h2 className="text-lg font-bold">Notificaciones enviadas</h2>
            {avisos.length === 0 ? (
              <p className="mt-2 text-sm text-plomo">Al aprobar una solicitud, el alumno recibe el aviso por WhatsApp y correo.</p>
            ) : (
              <ul className="mt-3 space-y-3 text-sm">
                {avisos.map((a) => (
                  <li key={a.id}>
                    <span className="font-bold">{a.para}</span> <span className="cifra text-plomo">{a.hora}</span>
                    <span className="block text-plomo">{a.texto}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="rounded-2xl bg-white p-5">
            <h2 className="text-lg font-bold">Debriefings sin firma del alumno</h2>
            {sinFirma.length === 0 ? (
              <p className="mt-2 text-sm text-plomo">Todos los debriefings están firmados por ambas partes.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {sinFirma.map((v) => (
                  <li key={v.id}>
                    <button onClick={() => setFicha(v)} className="w-full rounded-lg bg-alerta-suave px-3 py-2 text-left hover:brightness-95">
                      <span className="font-bold">Alejandra Menjívar</span>, <span className="matricula">{v.aeronave}</span>
                      <span className="block text-plomo">{v.leccion}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="rounded-2xl bg-white p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <UserPlus className="h-5 w-5 text-marca" aria-hidden="true" /> Admisiones desde la web
            </h2>
            {prospectos.length === 0 ? (
              <p className="mt-2 text-sm text-plomo">Las solicitudes del formulario del sitio público llegan aquí.</p>
            ) : (
              <ul className="mt-3 space-y-3 text-sm">
                {prospectos.map((p) => (
                  <li key={p.id}>
                    <span className="font-bold">{p.nombre}</span> <span className="cifra text-plomo">{p.telefono}</span>
                    <span className="block text-plomo">
                      {p.programa}. {p.hora}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
      {ficha && <FichaDebriefing vuelo={ficha} alCerrar={() => setFicha(null)} vistaInstructor />}
    </main>
  );
}
