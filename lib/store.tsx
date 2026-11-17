"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  ALUMNO,
  Asignacion,
  Aviso,
  DIAS,
  Franja,
  INSTRUCTORES,
  Prospecto,
  RECURSOS,
  RESERVAS_INICIALES,
  Reserva,
  SOLICITUDES_INICIALES,
  Solicitud,
} from "./data";

type Estado = {
  reservas: Reserva[];
  solicitudes: Solicitud[];
  avisos: Aviso[];
  prospectos: Prospecto[];
  firmas: Record<string, string>;
};

const INICIAL: Estado = {
  reservas: RESERVAS_INICIALES,
  solicitudes: SOLICITUDES_INICIALES,
  avisos: [],
  prospectos: [],
  firmas: {},
};

const CLAVE = "flight-training-demo-v1";

type Contexto = Estado & {
  listo: boolean;
  toast: string | null;
  mostrarToast: (texto: string) => void;
  enviarSolicitud: (datos: { fase: string; instructorPreferido: string; comentario: string; franjas: Franja[] }) => void;
  aprobarSolicitud: (id: string, asignaciones: Asignacion[]) => void;
  alternarMantenimiento: (recurso: string, dia: number, bloque: string) => void;
  agregarProspecto: (p: Omit<Prospecto, "id" | "hora">) => void;
  firmarVuelo: (id: string) => void;
  marcarAvisosLeidos: () => void;
  reiniciar: () => void;
};

const Ctx = createContext<Contexto | null>(null);

const ahora = () => new Date().toLocaleTimeString("es-SV", { hour: "2-digit", minute: "2-digit" });

export function Proveedor({ children }: { children: React.ReactNode }) {
  const [estado, setEstado] = useState<Estado>(INICIAL);
  const [listo, setListo] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Carga única desde localStorage después de hidratar.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CLAVE);
      if (guardado) setEstado({ ...INICIAL, ...JSON.parse(guardado) });
    } catch {}
    setListo(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!listo) return;
    try {
      localStorage.setItem(CLAVE, JSON.stringify(estado));
    } catch {}
  }, [estado, listo]);

  const mostrarToast = useCallback((texto: string) => {
    setToast(texto);
    window.setTimeout(() => setToast((t) => (t === texto ? null : t)), 4500);
  }, []);

  const valor = useMemo<Contexto>(
    () => ({
      ...estado,
      listo,
      toast,
      mostrarToast,
      enviarSolicitud: (datos) => {
        const nueva: Solicitud = {
          id: `s-${Date.now()}`,
          alumno: ALUMNO.nombre,
          programa: ALUMNO.programa,
          estado: "pendiente",
          enviada: `Hoy, ${ahora()}`,
          ...datos,
        };
        setEstado((e) => ({ ...e, solicitudes: [nueva, ...e.solicitudes] }));
        mostrarToast("Disponibilidad enviada. Despacho ya la tiene en su bandeja.");
      },
      aprobarSolicitud: (id, asignaciones) => {
        setEstado((e) => {
          const sol = e.solicitudes.find((s) => s.id === id);
          if (!sol) return e;
          const movida = asignaciones.some((a) => a.movida);
          const nuevas: Reserva[] = asignaciones.map((a) => ({
            id: `${a.recurso}-${a.dia}-${a.bloque}-${Date.now()}`,
            recurso: a.recurso,
            dia: a.dia,
            bloque: a.bloque,
            tipo: a.tipo,
            alumno: sol.alumno,
            instructor: a.instructor,
            nota: a.tipo === "teoria" ? `Asesoría de teoría · ${sol.alumno}` : undefined,
            nuevo: true,
          }));
          const resumen = asignaciones
            .map((a) => `${DIAS[a.dia]} ${a.bloque} en ${a.recurso} con ${a.instructor}`)
            .join("; ");
          const aviso: Aviso = {
            id: `a-${Date.now()}`,
            para: sol.alumno,
            texto: movida
              ? `Tu programación fue reprogramada: ${resumen}.`
              : `Tu programación fue confirmada: ${resumen}.`,
            hora: ahora(),
            leido: false,
          };
          return {
            ...e,
            reservas: [...e.reservas.map((r) => ({ ...r, nuevo: false })), ...nuevas],
            solicitudes: e.solicitudes.map((s) =>
              s.id === id ? { ...s, estado: movida ? "reprogramado" : "confirmado", asignaciones } : s
            ),
            avisos: [aviso, ...e.avisos],
          };
        });
        const sol = estado.solicitudes.find((s) => s.id === id);
        mostrarToast(`Tablero actualizado. Notificación enviada a ${sol?.alumno ?? "el alumno"} por WhatsApp y correo.`);
      },
      alternarMantenimiento: (recurso, dia, bloque) => {
        setEstado((e) => {
          const existente = e.reservas.find((r) => r.recurso === recurso && r.dia === dia && r.bloque === bloque);
          if (existente && existente.tipo !== "mantenimiento") return e;
          if (existente) return { ...e, reservas: e.reservas.filter((r) => r !== existente) };
          return {
            ...e,
            reservas: [
              ...e.reservas,
              { id: `m-${recurso}-${dia}-${bloque}`, recurso, dia, bloque, tipo: "mantenimiento", nota: "Bloqueado por despacho" },
            ],
          };
        });
      },
      agregarProspecto: (p) => {
        setEstado((e) => ({
          ...e,
          prospectos: [{ ...p, id: `p-${Date.now()}`, hora: `Hoy, ${ahora()}` }, ...e.prospectos],
        }));
      },
      firmarVuelo: (id) => {
        const fecha = new Date().toLocaleString("es-SV", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
        setEstado((e) => ({ ...e, firmas: { ...e.firmas, [id]: fecha } }));
        mostrarToast("Debriefing firmado. Queda registrado en tu expediente.");
      },
      marcarAvisosLeidos: () => setEstado((e) => ({ ...e, avisos: e.avisos.map((a) => ({ ...a, leido: true })) })),
      reiniciar: () => {
        setEstado(INICIAL);
        mostrarToast("Demo reiniciada a su estado original.");
      },
    }),
    [estado, listo, toast, mostrarToast]
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useDemo() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useDemo fuera de Proveedor");
  return c;
}

// ---------- Ayudas de disponibilidad ----------

export function ocupado(reservas: Reserva[], recurso: string, dia: number, bloque: string) {
  return reservas.some((r) => r.recurso === recurso && r.dia === dia && r.bloque === bloque);
}

export function instructorOcupado(reservas: Reserva[], instructor: string, dia: number, bloque: string) {
  return reservas.some((r) => r.instructor === instructor && r.dia === dia && r.bloque === bloque);
}

export function recursosLibres(reservas: Reserva[], f: Franja) {
  return RECURSOS.filter((x) => (f.tipo === "teoria" ? x.tipo === "aula" : x.tipo !== "aula")).filter(
    (x) => !ocupado(reservas, x.id, f.dia, f.bloque)
  );
}

// Propone aeronave e instructor para cada franja sin generar choques.
export function sugerir(reservas: Reserva[], sol: Solicitud): Asignacion[] {
  const usadas: Reserva[] = [...reservas];
  return sol.franjas.map((f) => {
    const libres = recursosLibres(usadas, f);
    const preferidos = f.tipo === "vuelo" ? libres.filter((x) => x.tipo === "aeronave" && x.id !== "YS-234-PE") : libres;
    const recurso = (preferidos[0] ?? libres[0])?.id ?? "";
    const instructor =
      [sol.instructorPreferido, ...INSTRUCTORES].find((i) => i && INSTRUCTORES.includes(i) && !instructorOcupado(usadas, i, f.dia, f.bloque)) ??
      INSTRUCTORES[0];
    usadas.push({ id: "tmp", recurso, dia: f.dia, bloque: f.bloque, tipo: f.tipo, instructor });
    return { ...f, recurso, instructor };
  });
}
