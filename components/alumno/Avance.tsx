"use client";

import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { HORAS, HORAS_TOTAL, MATERIAS, VIGENCIAS, Vigencia } from "@/lib/data";
import { useDemo } from "@/lib/store";

function Anillo({ valor, total, etiqueta }: { valor: number; total: number; etiqueta: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const pct = Math.min(valor / total, 1);
  return (
    <div className="relative h-40 w-40 shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label={`${etiqueta}: ${Math.round(pct * 100)} %`}>
        <circle cx="60" cy="60" r={r} fill="none" stroke="#d9dcd8" strokeWidth="11" />
        <circle cx="60" cy="60" r={r} fill="none" stroke="#ec6a2c" strokeWidth="11" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <span className="cifra block text-3xl font-extrabold leading-none">{Math.round(pct * 100)} %</span>
          <span className="mt-1 block text-xs text-plomo">{etiqueta}</span>
        </div>
      </div>
    </div>
  );
}

function estadoVigencia(v: Vigencia): { estado: "ok" | "alerta" | "critico"; texto: string } {
  if (v.estadoFijo) return { estado: v.estadoFijo, texto: v.estadoFijo === "ok" ? "Al día" : v.estadoFijo === "alerta" ? "Atención" : "Pendiente" };
  const dias = Math.ceil((new Date(v.vence! + "T12:00:00").getTime() - Date.now()) / 86400000);
  const fecha = new Date(v.vence! + "T12:00:00").toLocaleDateString("es-SV", { day: "numeric", month: "short", year: "numeric" });
  if (dias < 0) return { estado: "critico", texto: `Venció el ${fecha}` };
  if (dias <= 45) return { estado: "alerta", texto: `Vence en ${dias} días (${fecha})` };
  return { estado: "ok", texto: `Vigente hasta ${fecha}` };
}

const SEMAFORO = {
  ok: { icono: CheckCircle2, borde: "border-ok", fondo: "bg-ok-suave", color: "text-ok" },
  alerta: { icono: AlertTriangle, borde: "border-alerta", fondo: "bg-alerta-suave", color: "text-alerta" },
  critico: { icono: XCircle, borde: "border-critico", fondo: "bg-critico-suave", color: "text-critico" },
};

export default function Avance() {
  const { mostrarToast } = useDemo();
  const aprobadas = MATERIAS.filter((m) => m.estado === "aprobada");
  const promedio = aprobadas.reduce((s, m) => s + (m.nota ?? 0), 0) / aprobadas.length;

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-bold">Vigencias y documentos</h2>
        <p className="mt-1 text-plomo">Lo que necesitas tener al día para poder salir a volar.</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {VIGENCIAS.map((v) => {
            const e = estadoVigencia(v);
            const s = SEMAFORO[e.estado];
            return (
              <li key={v.titulo} className={`rounded-xl border-l-4 ${s.borde} ${s.fondo} p-4`}>
                <div className="flex items-start gap-3">
                  <s.icono className={`mt-0.5 h-5 w-5 shrink-0 ${s.color}`} aria-hidden="true" />
                  <div className="min-w-0">
                    <h3 className="font-bold">{v.titulo}</h3>
                    <p className="text-sm text-plomo">{v.detalle}</p>
                    <p className={`mt-1 text-sm font-bold ${s.color}`}>{e.texto}</p>
                    {v.accion && e.estado !== "ok" && (
                      <button
                        onClick={() => mostrarToast(`Solicitud enviada a administración: ${v.accion!.toLowerCase()}.`)}
                        className="mt-2 text-sm font-bold underline underline-offset-4"
                      >
                        {v.accion}
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-hangar p-6">
          <h2 className="text-xl font-bold">Horas de vuelo</h2>
          <div className="mt-4 flex flex-wrap items-center gap-6">
            <Anillo valor={HORAS_TOTAL.hechas} total={HORAS_TOTAL.requeridas} etiqueta="de la licencia" />
            <p className="max-w-56">
              <span className="cifra block text-4xl font-extrabold">{HORAS_TOTAL.hechas} h</span>
              <span className="text-plomo">
                de {HORAS_TOTAL.requeridas} h requeridas para el PPL. Te faltan{" "}
                <strong className="cifra text-tinta">{(HORAS_TOTAL.requeridas - HORAS_TOTAL.hechas).toFixed(1)} h</strong>.
              </span>
            </p>
          </div>
          <ul className="mt-6 space-y-4">
            {HORAS.map((h) => {
              const pct = Math.min((h.hechas / h.requeridas) * 100, 100);
              const completo = h.hechas >= h.requeridas;
              return (
                <li key={h.clave}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-bold">
                      {h.clave} <span className="text-sm font-normal text-plomo">{h.nota}</span>
                    </span>
                    <span className="cifra text-sm font-semibold">
                      {h.hechas.toFixed(1)} / {h.requeridas} h
                    </span>
                  </div>
                  <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-acero" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label={h.clave}>
                    <div className={`h-full rounded-full ${completo ? "bg-ok" : "bg-marca"}`} style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-5 text-xs text-plomo">Mínimos de referencia para la demo; se configuran según el programa aprobado por la AAC.</p>
        </div>

        <div className="rounded-2xl bg-hangar p-6">
          <h2 className="text-xl font-bold">Teoría</h2>
          <div className="mt-4 flex flex-wrap items-center gap-6">
            <Anillo valor={aprobadas.length} total={MATERIAS.length} etiqueta="materias aprobadas" />
            <p>
              <span className="cifra block text-4xl font-extrabold">{promedio.toFixed(1)}</span>
              <span className="text-plomo">
                promedio general. {aprobadas.length} de {MATERIAS.length} materias aprobadas.
              </span>
            </p>
          </div>
          <table className="mt-6 w-full text-sm">
            <thead className="sr-only">
              <tr>
                <th>Materia</th>
                <th>Estado</th>
                <th>Nota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-acero">
              {MATERIAS.map((m) => (
                <tr key={m.nombre}>
                  <td className="py-2.5 pr-3 font-semibold">{m.nombre}</td>
                  <td className="py-2.5 pr-3">
                    <span
                      className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-bold ${
                        m.estado === "aprobada" ? "bg-ok-suave text-ok" : m.estado === "en curso" ? "bg-cielo-suave text-cielo" : "bg-white text-plomo"
                      }`}
                    >
                      {m.estado === "aprobada" ? "Aprobada" : m.estado === "en curso" ? "En curso" : "Pendiente"}
                    </span>
                  </td>
                  <td className="cifra py-2.5 text-right text-base font-extrabold">{m.nota?.toFixed(1) ?? "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
