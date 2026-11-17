"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  BookOpen,
  CalendarClock,
  Check,
  Clock,
  GraduationCap,
  MapPin,
  MessageCircle,
  Phone,
  Plane,
  ShieldCheck,
} from "lucide-react";
import { BASE, ESCUELA, PROGRAMAS } from "@/lib/data";
import { useDemo } from "@/lib/store";

const WA = (texto: string) => `https://wa.me/${ESCUELA.whatsapp}?text=${encodeURIComponent(texto)}`;

function Egresados() {
  const fotos = [
    { src: `${BASE}/img/egresados-avianca.jpg`, alt: "Tres egresados de Flight Training con uniforme de piloto sostienen sus diplomas junto a un banner de Avianca", pie: "Egresados recibiendo su diploma en Avianca", pos: "object-[center_60%]" },
    { src: `${BASE}/img/egresados-pilotos.jpg`, alt: "Cuatro egresados de Flight Training con uniforme de piloto de aerolínea, con San Salvador de fondo", pie: "De la plataforma de Ilopango a la cabina de una aerolínea", pos: "object-center" },
  ];
  return (
    <section id="egresados" className="scroll-mt-14 mx-auto max-w-7xl px-4 pt-20 sm:px-6">
      <div className="grid items-end gap-6 lg:grid-cols-[1.2fr_1fr]">
        <h2 className="rotulo text-3xl sm:text-4xl">Nuestros egresados ya vuelan en aerolíneas</h2>
        <p className="text-lg text-plomo">
          Empezaron igual que tú: con un vuelo introductorio en Ilopango. Hoy visten uniforme de aerolínea y operan vuelos comerciales
          en la región.
        </p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {fotos.map((f) => (
          <figure key={f.src} className="relative overflow-hidden rounded-2xl bg-hangar">
            <Image src={f.src} alt={f.alt} width={1200} height={1000} sizes="(min-width: 640px) 50vw, 100vw" className={`aspect-[6/5] w-full object-cover ${f.pos}`} />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-tinta/85 to-transparent px-5 pb-4 pt-12 font-semibold text-white">
              {f.pie}
            </figcaption>
          </figure>
        ))}
        <figure className="relative overflow-hidden rounded-2xl bg-hangar sm:col-span-2">
          <Image
            src={`${BASE}/img/graduacion.jpg`}
            alt="Grupo de alumnos de Flight Training celebra con sus certificados frente al Piper Seneca de la escuela"
            width={1600}
            height={900}
            sizes="100vw"
            className="aspect-[4/3] w-full object-cover object-[center_70%] sm:aspect-[21/9]"
          />
          <figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 bg-gradient-to-t from-tinta/85 to-transparent px-5 pb-4 pt-16 text-white">
            <span className="font-semibold">Cada promoción recibe sus certificados frente al avión en el que voló</span>
            <a href="#admision" className="rounded-full bg-marca px-5 py-2.5 font-bold hover:bg-marca-fuerte">
              Quiero ser el próximo
            </a>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function Programas() {
  const [activo, setActivo] = useState(PROGRAMAS[0].id);
  const p = PROGRAMAS.find((x) => x.id === activo)!;
  return (
    <section id="programas" className="scroll-mt-14 mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <h2 className="rotulo max-w-3xl text-3xl sm:text-4xl">Seis caminos para trabajar en la aviación</h2>
      <p className="mt-4 max-w-2xl text-lg text-plomo">
        Cabina de mando, cabina de pasajeros o aeropuerto. Todos los programas se imparten en Ilopango bajo las regulaciones de la
        Autoridad de Aviación Civil (AAC).
      </p>
      <div className="mt-10 grid gap-6 lg:grid-cols-[20rem_1fr]">
        <div role="tablist" aria-label="Programas" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
          {PROGRAMAS.map((x) => (
            <button
              key={x.id}
              role="tab"
              aria-selected={activo === x.id}
              onClick={() => setActivo(x.id)}
              className={`flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                activo === x.id ? "border-tinta bg-tinta text-white" : "border-acero hover:border-tinta"
              }`}
            >
              <span className={`matricula w-11 text-sm ${activo === x.id ? "text-marca" : "text-marca-fuerte"}`}>{x.sigla}</span>
              <span className="font-semibold">{x.nombre}</span>
            </button>
          ))}
        </div>
        <div key={p.id} role="tabpanel" className="entrar rounded-2xl bg-hangar p-6 sm:p-8">
          <h3 className="rotulo text-2xl sm:text-3xl">{p.nombre}</h3>
          <p className="mt-3 max-w-2xl text-lg">{p.resumen}</p>
          <dl className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { icono: Clock, t: "Duración", v: p.duracion },
              { icono: Plane, t: "Práctica", v: p.horas },
              { icono: BookOpen, t: "Fase teórica", v: p.teoria },
            ].map((d) => (
              <div key={d.t} className="rounded-xl bg-white p-4">
                <dt className="flex items-center gap-1.5 text-sm text-plomo">
                  <d.icono className="h-4 w-4 text-marca" aria-hidden="true" /> {d.t}
                </dt>
                <dd className="mt-1 font-bold">{d.v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <h4 className="font-bold">Qué vas a aprender</h4>
              <ul className="mt-3 space-y-2">
                {p.contenido.map((c) => (
                  <li key={c} className="flex gap-2">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-marca" aria-hidden="true" /> {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold">Requisitos de ingreso</h4>
              <ul className="mt-3 space-y-2">
                {p.requisitos.map((c) => (
                  <li key={c} className="flex gap-2">
                    <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-plomo" aria-hidden="true" /> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <a href="#admision" className="mt-8 inline-flex rounded-full bg-marca px-5 py-3 font-bold text-white hover:bg-marca-fuerte">
            Solicitar admisión a {p.nombre}
          </a>
        </div>
      </div>
    </section>
  );
}

function Flota() {
  const flota = [
    { foto: `${BASE}/img/cessna.jpg`, alt: "Cessna rojo y plateado de Flight Training frente al hangar", modelo: "Cessna", uso: "Instrucción primaria", texto: "Ala alta, noble y estable. Donde casi todos hacen su primer vuelo solo.", pos: "object-center" },
    { foto: `${BASE}/img/piper-warrior.jpg`, alt: "Piper Warrior rojo de Flight Training en la plataforma de Ilopango", modelo: "Piper PA-28 Warrior y Archer", uso: "Instrucción y travesías", texto: "Cuatro Piper en línea: YS-151, YS-157, YS-158 y YS-159. Potencia justa para una formación segura.", pos: "object-center" },
    { foto: `${BASE}/img/pa34-seneca.jpg`, alt: "Piper PA-34 Seneca II bimotor de Flight Training frente al hangar", modelo: "Piper PA-34 Seneca II", uso: "Habilitación multimotor", texto: "Bimotor de 2 × 200 hp para el entrenamiento avanzado y el curso multimotor.", pos: "object-center" },
    { foto: `${BASE}/img/simulador-redbird.jpg`, alt: "Alumno practicando en el simulador Redbird de Flight Training", modelo: "Simulador Redbird LD", uso: "Procedimientos e instrumentos", texto: "Cabina envolvente para practicar navegación y toma de decisiones antes de llevarlas al avión.", pos: "object-[center_35%]" },
  ];
  const instalaciones = [
    { foto: `${BASE}/img/escuela.jpg`, alt: "Fachada del edificio de Flight Training en el Aeropuerto de Ilopango", t: "Sede en el Hangar B-15", d: "Edificio propio dentro del Aeropuerto Internacional de Ilopango, con salida directa a la plataforma.", pos: "object-center" },
    { foto: `${BASE}/img/aulas.jpg`, alt: "Instructora explicando instrumentos de vuelo a un grupo de alumnos en el aula", t: "Aulas de teoría", d: "Grupos reducidos con instructores que vuelan todos los días.", pos: "object-[center_40%]" },
    { foto: `${BASE}/img/equipo.jpg`, alt: "Equipo de instructores y alumnos de Flight Training en el lobby de la escuela", t: "Lobby y cabina de práctica", d: "El punto de encuentro antes de cada vuelo, con maqueta de cabina para tripulantes y counter.", pos: "object-[center_58%]" },
  ];
  return (
    <section id="flota" className="scroll-mt-14 bg-tinta text-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="rotulo max-w-3xl text-3xl sm:text-4xl">La flota en la que vas a volar</h2>
        <p className="mt-4 max-w-2xl text-lg text-white/70">
          Seis aeronaves con matrícula salvadoreña y un simulador, todos en nuestro hangar del Aeropuerto Internacional de Ilopango.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {flota.map((a) => (
            <article key={a.modelo} className="overflow-hidden rounded-2xl bg-white/[0.06]">
              <Image src={a.foto} alt={a.alt} width={1200} height={750} sizes="(min-width: 640px) 50vw, 100vw" className={`aspect-[16/10] w-full object-cover ${a.pos}`} />
              <div className="p-6">
                <p className="text-sm font-bold text-marca">{a.uso}</p>
                <h3 className="mt-1 text-xl font-bold">{a.modelo}</h3>
                <p className="mt-2 text-white/70">{a.texto}</p>
              </div>
            </article>
          ))}
        </div>
        <h3 className="rotulo mt-20 text-2xl sm:text-3xl">Instalaciones en Ilopango</h3>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {instalaciones.map((i) => (
            <article key={i.t}>
              <Image src={i.foto} alt={i.alt} width={1200} height={900} sizes="(min-width: 768px) 33vw, 100vw" className={`aspect-[4/3] w-full rounded-2xl object-cover ${i.pos}`} />
              <h4 className="mt-4 border-t-2 border-marca pt-3 font-bold">{i.t}</h4>
              <p className="mt-1 text-sm text-white/70">{i.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Admision() {
  const { agregarProspecto } = useDemo();
  const [enviado, setEnviado] = useState<string | null>(null);
  const [f, setF] = useState({ nombre: "", telefono: "", programa: PROGRAMAS[0].nombre, interes: "Solicitar admisión", mensaje: "" });
  const campo = "mt-1.5 w-full rounded-lg border border-acero bg-white px-3 py-2.5 text-base focus:border-tinta";
  return (
    <section id="admision" className="scroll-mt-14 mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
      <div>
        <h2 className="rotulo text-3xl sm:text-4xl">Empieza con un vuelo introductorio</h2>
        <p className="mt-4 max-w-xl text-lg text-plomo">
          Despegas de Ilopango con un instructor, tomas los mandos sobre el lago y decides después. Déjanos tus datos y admisiones te
          escribe hoy mismo.
        </p>
        <ul className="mt-8 space-y-4">
          <li className="flex gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-marca" aria-hidden="true" />
            <span>
              {ESCUELA.ubicacion} ({ESCUELA.oaci})
            </span>
          </li>
          <li className="flex gap-3">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-marca" aria-hidden="true" /> {ESCUELA.telefono}
          </li>
          <li className="flex gap-3">
            <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-marca" aria-hidden="true" /> Lunes a sábado, de 6:30 a. m. a 6:30 p. m.
          </li>
        </ul>
        <a
          href={WA(`Hola, quiero información sobre ${f.programa} en Flight Training.`)}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1fa855] px-5 py-3 font-bold text-white hover:bg-[#178a45]"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" /> Escribir por WhatsApp
        </a>
      </div>

      {enviado ? (
        <div className="entrar flex flex-col justify-center rounded-2xl bg-ok-suave p-8">
          <Check className="h-10 w-10 rounded-full bg-ok p-2 text-white" aria-hidden="true" />
          <h3 className="mt-4 text-2xl font-bold">Solicitud recibida, {enviado.split(" ")[0]}</h3>
          <p className="mt-2 text-lg">
            Admisiones te contactará en menos de 24 horas para coordinar tu visita al hangar B-15. Tu solicitud ya aparece en el panel
            de la escuela.
          </p>
          <button onClick={() => setEnviado(null)} className="mt-6 self-start font-bold underline underline-offset-4">
            Enviar otra solicitud
          </button>
        </div>
      ) : (
        <form
          className="rounded-2xl bg-hangar p-6 sm:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            agregarProspecto({ nombre: f.nombre, telefono: f.telefono, programa: `${f.programa} (${f.interes.toLowerCase()})` });
            setEnviado(f.nombre);
          }}
        >
          <fieldset>
            <legend className="font-semibold">¿Qué te interesa?</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {["Solicitar admisión", "Vuelo introductorio"].map((o) => (
                <label
                  key={o}
                  className={`cursor-pointer rounded-lg border px-3 py-2.5 text-center font-semibold ${
                    f.interes === o ? "border-tinta bg-tinta text-white" : "border-acero bg-white"
                  }`}
                >
                  <input type="radio" name="interes" className="sr-only" checked={f.interes === o} onChange={() => setF({ ...f, interes: o })} />
                  {o}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="mt-5 block font-semibold">
            Programa de interés
            <select className={campo} value={f.programa} onChange={(e) => setF({ ...f, programa: e.target.value })}>
              {PROGRAMAS.map((p) => (
                <option key={p.id}>{p.nombre}</option>
              ))}
            </select>
          </label>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="block font-semibold">
              Nombre completo
              <input required className={campo} value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} autoComplete="name" />
            </label>
            <label className="block font-semibold">
              WhatsApp o teléfono
              <input
                required
                type="tel"
                placeholder="7000-0000"
                className={campo}
                value={f.telefono}
                onChange={(e) => setF({ ...f, telefono: e.target.value })}
                autoComplete="tel"
              />
            </label>
          </div>
          <label className="mt-5 block font-semibold">
            Cuéntanos de ti <span className="font-normal text-plomo">(opcional)</span>
            <textarea rows={3} className={campo} value={f.mensaje} onChange={(e) => setF({ ...f, mensaje: e.target.value })} />
          </label>
          <button className="mt-6 w-full rounded-full bg-marca px-5 py-3.5 text-lg font-bold text-white hover:bg-marca-fuerte">
            Enviar solicitud
          </button>
        </form>
      )}
    </section>
  );
}

export default function SitioPublico() {
  return (
    <main>
      <section className="relative overflow-hidden bg-marca">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-24 pt-14 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:pt-20">
          <div>
            <p className="font-semibold text-tinta">Escuela de aviación en el Aeropuerto Internacional de Ilopango</p>
            <h1 className="rotulo mt-4 text-[2.6rem] text-tinta sm:text-6xl lg:text-[4.2rem]">
              Tu carrera en la aviación comienza en El Salvador
            </h1>
            <p className="mt-6 max-w-xl text-xl text-tinta/85">
              Formamos pilotos, tripulantes de cabina y agentes de counter con flota propia, simulador Redbird y programas alineados a
              la AAC.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#admision" className="rounded-full bg-tinta px-6 py-3.5 text-lg font-bold text-white hover:bg-black">
                Solicitar admisión o vuelo introductorio
              </a>
              <Link
                href="/alumno"
                className="flex items-center gap-2 rounded-full border-2 border-tinta px-6 py-3 text-lg font-bold text-tinta hover:bg-tinta hover:text-white"
              >
                <GraduationCap className="h-5 w-5" aria-hidden="true" /> Portal de alumnos
              </Link>
            </div>
          </div>
          <Image
            src={`${BASE}/img/hero.jpg`}
            alt="Piloto egresado de Flight Training frente a una aeronave de la escuela en Ilopango"
            width={1200}
            height={1406}
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="aspect-[6/7] w-full rounded-2xl object-cover object-top shadow-[0_24px_60px_-20px_rgba(18,18,18,0.6)] lg:max-h-[640px]"
          />
        </div>
        {/* Franjas del emblema de la escuela */}
        <div className="absolute bottom-0 left-0 flex flex-col gap-2 pb-6" aria-hidden="true">
          <span className="h-2.5 w-[46vw] bg-tinta" />
          <span className="h-2.5 w-[34vw] bg-tinta" />
          <span className="h-2.5 w-[22vw] bg-tinta" />
        </div>
      </section>

      <Egresados />
      <Programas />
      <Flota />
      <Admision />

      <footer className="border-t border-acero">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-plomo sm:px-6">
          <Image src={`${BASE}/img/logo-ft.png`} alt="Flight Training" width={600} height={318} className="h-14 w-auto" />
          <p>
            {ESCUELA.ubicacion}, El Salvador. Instagram {ESCUELA.instagram}
          </p>
        </div>
      </footer>
    </main>
  );
}
