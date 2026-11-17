// Datos de demostración. Todo lo que aparece en el prototipo sale de este archivo:
// para adaptar la demo basta con editar aquí.

export const ESCUELA = {
  nombre: "Flight Training",
  ubicacion: "Aeropuerto Internacional de Ilopango, Hangar B-15",
  oaci: "MSSS",
  whatsapp: "50378311782",
  telefono: "+(503) 7831-1782",
  instagram: "@flight.trainingsv",
  facebook: "FlightTrainingES",
};

// Mismos bloques de 1.5 h que usa hoy la hoja "Programacion Flight Training".
export const BLOQUES = ["06:30", "08:00", "09:30", "11:00", "12:30", "14:00", "15:30", "17:00"];
export const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
export const DIAS_CORTOS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
export const SEMANA = "Semana del 23 al 29 de noviembre de 2026";

export function finBloque(bloque: string) {
  const [h, m] = bloque.split(":").map(Number);
  const t = h * 60 + m + 90;
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}

export type TipoRecurso = "aeronave" | "simulador" | "aula";
export type Recurso = {
  id: string;
  modelo: string;
  tipo: TipoRecurso;
  detalle: string;
  uso: string;
};

export const RECURSOS: Recurso[] = [
  { id: "YS-151-PE", modelo: "Piper PA-28-181 Archer", tipo: "aeronave", detalle: "180 hp, 4 plazas", uso: "Navegación y fase comercial" },
  { id: "YS-152-PE", modelo: "Cessna 152", tipo: "aeronave", detalle: "110 hp, 2 plazas", uso: "Instrucción primaria" },
  { id: "YS-157-PE", modelo: "Piper PA-28-151 Warrior", tipo: "aeronave", detalle: "150 hp, 4 plazas", uso: "Instrucción y travesías" },
  { id: "YS-158-PE", modelo: "Piper PA-28-151 Warrior", tipo: "aeronave", detalle: "150 hp, 4 plazas", uso: "Instrucción y travesías" },
  { id: "YS-159-PE", modelo: "Piper PA-28-151 Warrior", tipo: "aeronave", detalle: "150 hp, 4 plazas", uso: "Instrucción y travesías" },
  { id: "YS-234-PE", modelo: "Piper PA-34 Seneca II", tipo: "aeronave", detalle: "Bimotor, 2 × 200 hp", uso: "Habilitación multimotor" },
  { id: "SIM-RB1", modelo: "Simulador Redbird LD", tipo: "simulador", detalle: "Cabina envolvente", uso: "Procedimientos e instrumentos" },
  { id: "AULA 1", modelo: "Aula de teoría", tipo: "aula", detalle: "24 puestos", uso: "Clases de piloto" },
  { id: "AULA 2", modelo: "Cabina de práctica", tipo: "aula", detalle: "Maqueta de cabina", uso: "Tripulantes y counter" },
];

export const INSTRUCTORES = [
  "Kevin Alemán",
  "Daniel Melara",
  "Sofía Acevedo",
  "Roxana Hernández",
  "Iván Moreno",
  "Kevin Salinas",
  "Jason Melgar",
];

export type TipoReserva = "vuelo" | "teoria" | "mantenimiento";
export type Reserva = {
  id: string;
  recurso: string;
  dia: number;
  bloque: string;
  tipo: TipoReserva;
  alumno?: string;
  instructor?: string;
  nota?: string;
  nuevo?: boolean;
};

const r = (recurso: string, dia: number, bloque: string, alumno: string, instructor: string): Reserva => ({
  id: `${recurso}-${dia}-${bloque}`,
  recurso,
  dia,
  bloque,
  tipo: "vuelo",
  alumno,
  instructor,
});
const t = (recurso: string, dia: number, bloque: string, nota: string, instructor: string): Reserva => ({
  id: `${recurso}-${dia}-${bloque}`,
  recurso,
  dia,
  bloque,
  tipo: "teoria",
  nota,
  instructor,
});
const m = (recurso: string, dia: number, bloque: string, nota: string): Reserva => ({
  id: `${recurso}-${dia}-${bloque}`,
  recurso,
  dia,
  bloque,
  tipo: "mantenimiento",
  nota,
});

// Vuelos transcritos de la hoja actual de programación (PDF en _referencias).
export const RESERVAS_INICIALES: Reserva[] = [
  // YS-152-PE
  r("YS-152-PE", 0, "09:30", "Andrea Cruz", "Roxana Hernández"),
  r("YS-152-PE", 0, "11:00", "José López", "Iván Moreno"),
  r("YS-152-PE", 0, "14:00", "Andrea Cruz", "Roxana Hernández"),
  r("YS-152-PE", 1, "11:00", "José López", "Kevin Salinas"),
  r("YS-152-PE", 2, "11:00", "José López", "Iván Moreno"),
  r("YS-152-PE", 3, "11:00", "José López", "Kevin Salinas"),
  r("YS-152-PE", 4, "12:30", "Andrea Cruz", "Roxana Hernández"),
  r("YS-152-PE", 5, "11:00", "José López", "Kevin Salinas"),
  // YS-158-PE
  r("YS-158-PE", 0, "06:30", "Vladimir Bondanza", "Kevin Alemán"),
  r("YS-158-PE", 0, "08:00", "Sebastián Saade", "Kevin Alemán"),
  r("YS-158-PE", 1, "06:30", "Diego Azúcar", "Daniel Melara"),
  r("YS-158-PE", 1, "09:30", "José Calderón", "Kevin Alemán"),
  r("YS-158-PE", 2, "06:30", "Vladimir Bondanza", "Kevin Alemán"),
  r("YS-158-PE", 2, "08:00", "María José Ramírez", "Kevin Alemán"),
  r("YS-158-PE", 2, "14:00", "Caleb Guzmán", "Daniel Melara"),
  r("YS-158-PE", 3, "06:30", "Diego Azúcar", "Daniel Melara"),
  r("YS-158-PE", 3, "09:30", "José Calderón", "Kevin Alemán"),
  r("YS-158-PE", 3, "14:00", "Andrés Pérez", "Kevin Alemán"),
  r("YS-158-PE", 4, "06:30", "Vladimir Bondanza", "Kevin Alemán"),
  r("YS-158-PE", 4, "08:00", "María José Ramírez", "Kevin Alemán"),
  r("YS-158-PE", 4, "09:30", "Sebastián Saade", "Kevin Alemán"),
  r("YS-158-PE", 4, "14:00", "Caleb Guzmán", "Daniel Melara"),
  r("YS-158-PE", 5, "08:00", "Andrés Pérez", "Kevin Alemán"),
  // YS-159-PE
  r("YS-159-PE", 0, "08:00", "Caleb Guzmán", "Daniel Melara"),
  r("YS-159-PE", 0, "09:30", "Tyler Blease", "Jason Melgar"),
  r("YS-159-PE", 1, "12:30", "Andrea Cruz", "Roxana Hernández"),
  r("YS-159-PE", 2, "09:30", "Sebastián Saade", "Kevin Alemán"),
  r("YS-159-PE", 2, "12:30", "Andrea Cruz", "Roxana Hernández"),
  r("YS-159-PE", 3, "09:30", "Luisa Crespín", "Sofía Acevedo"),
  r("YS-159-PE", 3, "12:30", "Andrea Cruz", "Roxana Hernández"),
  r("YS-159-PE", 4, "09:30", "Brandon Martínez", "Sofía Acevedo"),
  r("YS-159-PE", 4, "11:00", "Marcelo Larios", "Sofía Acevedo"),
  r("YS-159-PE", 5, "09:30", "José Calderón", "Kevin Alemán"),
  // Agregados para la demo: mantenimiento, simulador y teoría
  ...["06:30", "08:00", "09:30", "11:00", "12:30", "14:00", "15:30", "17:00"].flatMap((b) => [
    m("YS-157-PE", 0, b, "Inspección de 100 horas"),
    m("YS-157-PE", 1, b, "Inspección de 100 horas"),
  ]),
  m("YS-157-PE", 2, "06:30", "Vuelo de prueba post-mantenimiento"),
  r("SIM-RB1", 1, "14:00", "Sebastián Saade", "Jason Melgar"),
  r("SIM-RB1", 3, "15:30", "Vladimir Bondanza", "Jason Melgar"),
  r("YS-234-PE", 5, "06:30", "Marcelo Larios", "Daniel Melara"),
  t("AULA 1", 0, "17:00", "Meteorología · Grupo PPL-26B", "Iván Moreno"),
  t("AULA 1", 2, "17:00", "Navegación · Grupo PPL-26B", "Kevin Salinas"),
  t("AULA 1", 4, "17:00", "Regulaciones RAC · Grupo PPL-26B", "Iván Moreno"),
  t("AULA 2", 0, "08:00", "Tripulantes de cabina · Semanal 1", "Sofía Acevedo"),
  t("AULA 2", 2, "08:00", "Tripulantes de cabina · Semanal 1", "Sofía Acevedo"),
  t("AULA 2", 4, "08:00", "Tripulantes de cabina · Semanal 1", "Sofía Acevedo"),
  t("AULA 2", 5, "08:00", "Agente de counter · Sabatino", "Roxana Hernández"),
];

// ---------- Alumno de la demo (ficticio) ----------

export const ALUMNO = {
  nombre: "Alejandra Menjívar",
  codigo: "FT-2026-041",
  programa: "Piloto Privado (PPL)",
  fase: "Fase 2 · Circuitos y pre-solo",
  ingreso: "Marzo 2026",
};

export const FASES = [
  "Fase 1 · Maniobras básicas",
  "Fase 2 · Circuitos y pre-solo",
  "Fase 3 · Vuelo solo",
  "Fase 4 · Navegación (travesías)",
  "Fase 5 · Preparación de chequeo",
];

export const HORAS = [
  { clave: "Dual", hechas: 22.1, requeridas: 20, nota: "Con instructor" },
  { clave: "Solo", hechas: 5.3, requeridas: 10, nota: "Piloto al mando" },
  { clave: "Travesía", hechas: 3.2, requeridas: 5, nota: "Cross-country solo" },
  { clave: "Nocturno", hechas: 1.0, requeridas: 3, nota: "Incluye 10 aterrizajes" },
  { clave: "Instrumentos", hechas: 1.5, requeridas: 3, nota: "Avión o simulador" },
];
export const HORAS_TOTAL = { hechas: 27.4, requeridas: 40 };

export const MATERIAS = [
  { nombre: "Legislación aeronáutica (RAC)", nota: 9.2, estado: "aprobada" },
  { nombre: "Conocimiento general de aeronaves", nota: 8.8, estado: "aprobada" },
  { nombre: "Principios de vuelo", nota: 9.5, estado: "aprobada" },
  { nombre: "Performance y planificación", nota: 8.1, estado: "aprobada" },
  { nombre: "Factores humanos", nota: 9.0, estado: "aprobada" },
  { nombre: "Meteorología", nota: null, estado: "en curso" },
  { nombre: "Navegación", nota: null, estado: "en curso" },
  { nombre: "Procedimientos operacionales", nota: null, estado: "pendiente" },
  { nombre: "Comunicaciones", nota: null, estado: "pendiente" },
] as const;

export type Vigencia = {
  titulo: string;
  detalle: string;
  vence?: string; // AAAA-MM-DD
  estadoFijo?: "ok" | "alerta" | "critico";
  accion?: string;
};

export const VIGENCIAS: Vigencia[] = [
  { titulo: "Certificado médico aeronáutico", detalle: "Clase 2 · AAC El Salvador", vence: "2026-12-10", accion: "Agendar renovación" },
  { titulo: "Licencia de alumno piloto", detalle: "N.º AP-4471", vence: "2027-08-22" },
  { titulo: "Competencia lingüística", detalle: "Inglés OACI nivel 4", vence: "2028-05-30" },
  { titulo: "Saldo de horas de vuelo", detalle: "Te quedan 4.5 h abonadas", estadoFijo: "alerta", accion: "Abonar horas" },
  { titulo: "Colegiatura de teoría", detalle: "Noviembre pagado", estadoFijo: "ok" },
  { titulo: "Examen teórico AAC", detalle: "Sin fecha asignada", estadoFijo: "critico", accion: "Solicitar fecha" },
];

export const ESCALA = [
  { valor: 1, texto: "Requiere instrucción" },
  { valor: 2, texto: "Requiere práctica" },
  { valor: 3, texto: "Satisfactorio" },
  { valor: 4, texto: "Estándar de chequeo" },
];

export type Vuelo = {
  id: string;
  fecha: string;
  aeronave: string;
  ruta: string;
  tipo: string;
  duracion: number;
  aterrizajes: number;
  instructor: string;
  leccion: string;
  maniobras: { nombre: string; nota: number }[];
  comentarios: string;
  recomendaciones: string[];
  firmaInstructor: string;
  firmaAlumno: string | null;
};

const man = (a: number, b: number, c: number, d: number, e: number, f: number) => [
  { nombre: "Pre-vuelo", nota: a },
  { nombre: "Despegue", nota: b },
  { nombre: "Virajes", nota: c },
  { nombre: "Aproximación", nota: d },
  { nombre: "Aterrizaje", nota: e },
  { nombre: "Comunicaciones ATC", nota: f },
];

export const VUELOS: Vuelo[] = [
  {
    id: "v7",
    fecha: "2026-11-13",
    aeronave: "YS-158-PE",
    ruta: "MSSS · circuitos pista 15",
    tipo: "Dual",
    duracion: 1.2,
    aterrizajes: 8,
    instructor: "Kevin Alemán",
    leccion: "Lección 14 · Circuitos con viento cruzado",
    maniobras: man(4, 3, 3, 2, 2, 3),
    comentarios:
      "Buen control del circuito y uso correcto de la lista de chequeo. En final con viento cruzado de 8 nudos la corrección de deriva llega tarde: el avión cruza el eje antes de que apliques ala baja. Dos aterrizajes largos por exceso de velocidad en corta final (70 nudos en lugar de 63).",
    recomendaciones: [
      "Fijar 63 nudos en corta final antes del umbral; si pasas de 68, motor y al aire.",
      "Repasar la técnica de ala baja en el simulador antes del próximo vuelo.",
      "Próximo vuelo: 6 circuitos más y evaluación para primer solo.",
    ],
    firmaInstructor: "13 nov 2026, 11:42",
    firmaAlumno: null,
  },
  {
    id: "v6",
    fecha: "2026-11-10",
    aeronave: "YS-158-PE",
    ruta: "MSSS · circuitos pista 33",
    tipo: "Dual",
    duracion: 1.1,
    aterrizajes: 7,
    instructor: "Kevin Alemán",
    leccion: "Lección 13 · Circuitos y emergencias en despegue",
    maniobras: man(4, 3, 3, 3, 2, 3),
    comentarios:
      "Circuito consistente en altura y distancia. Simulacro de falla de motor después del despegue bien resuelto. El recogido sigue alto: empiezas a romper el planeo unos dos metros antes de lo necesario.",
    recomendaciones: ["Mirar al final de la pista durante el recogido.", "Mantener potencia hasta cruzar el umbral."],
    firmaInstructor: "10 nov 2026, 09:15",
    firmaAlumno: "10 nov 2026, 18:03",
  },
  {
    id: "v5",
    fecha: "2026-11-06",
    aeronave: "YS-152-PE",
    ruta: "MSSS · zona de práctica Lago de Ilopango",
    tipo: "Dual",
    duracion: 1.3,
    aterrizajes: 2,
    instructor: "Roxana Hernández",
    leccion: "Lección 12 · Pérdidas y vuelo lento",
    maniobras: man(3, 3, 4, 3, 3, 3),
    comentarios:
      "Recuperación de pérdida sin potencia y con potencia dentro de estándar, con pérdida de altura menor a 100 pies. Virajes de 45° muy bien coordinados.",
    recomendaciones: ["Anunciar en voz alta la verificación de área antes de cada maniobra."],
    firmaInstructor: "6 nov 2026, 12:20",
    firmaAlumno: "6 nov 2026, 20:11",
  },
  {
    id: "v4",
    fecha: "2026-10-30",
    aeronave: "YS-159-PE",
    ruta: "MSSS · El Tamarindo · MSSS",
    tipo: "Dual · Travesía",
    duracion: 2.1,
    aterrizajes: 3,
    instructor: "Daniel Melara",
    leccion: "Lección 11 · Introducción a la navegación",
    maniobras: man(4, 3, 3, 3, 3, 2),
    comentarios:
      "Primera travesía a El Tamarindo. Buen seguimiento del plan y de los puntos de chequeo sobre el Lempa. En la frecuencia de Ilopango Torre faltó colacionar la autorización completa en dos ocasiones.",
    recomendaciones: ["Practicar fraseología de entrada al circuito con el audio de LiveATC.", "Anotar las autorizaciones en la rodillera."],
    firmaInstructor: "30 oct 2026, 13:05",
    firmaAlumno: "30 oct 2026, 19:40",
  },
  {
    id: "v3",
    fecha: "2026-10-24",
    aeronave: "YS-158-PE",
    ruta: "MSSS · El Jagüey · MSSS",
    tipo: "Dual · Travesía",
    duracion: 2.4,
    aterrizajes: 2,
    instructor: "Kevin Alemán",
    leccion: "Lección 10 · Navegación a estima",
    maniobras: man(3, 3, 3, 3, 3, 3),
    comentarios:
      "Cálculos de rumbo y tiempo acertados, llegada a El Jagüey con dos minutos de diferencia. Buena gestión de combustible.",
    recomendaciones: ["Revisar NOTAM de pistas no controladas antes de salir."],
    firmaInstructor: "24 oct 2026, 12:48",
    firmaAlumno: "24 oct 2026, 17:22",
  },
  {
    id: "v2",
    fecha: "2026-10-17",
    aeronave: "SIM-RB1",
    ruta: "Simulador · MSSS",
    tipo: "Instrumentos",
    duracion: 1.0,
    aterrizajes: 0,
    instructor: "Jason Melgar",
    leccion: "Sesión 2 · Vuelo básico por instrumentos",
    maniobras: man(3, 3, 2, 2, 3, 3),
    comentarios:
      "Barrido de instrumentos todavía lento en los virajes: pierdes 150 pies al fijarte solo en el horizonte artificial.",
    recomendaciones: ["Practicar el barrido en T con el instructor tapando el altímetro por intervalos."],
    firmaInstructor: "17 oct 2026, 16:02",
    firmaAlumno: "17 oct 2026, 16:30",
  },
];

// ---------- Solicitudes de programación ----------

export type Franja = { dia: number; bloque: string; tipo: "vuelo" | "teoria" };
export type Asignacion = Franja & { recurso: string; instructor: string; movida?: boolean; original?: string };
export type EstadoSolicitud = "pendiente" | "confirmado" | "reprogramado";
export type Solicitud = {
  id: string;
  alumno: string;
  programa: string;
  fase: string;
  instructorPreferido: string;
  comentario: string;
  franjas: Franja[];
  estado: EstadoSolicitud;
  enviada: string;
  asignaciones?: Asignacion[];
};

export const SOLICITUDES_INICIALES: Solicitud[] = [
  {
    id: "s-diego",
    alumno: "Diego Azúcar",
    programa: "Piloto Privado (PPL)",
    fase: "Fase 3 · Vuelo solo",
    instructorPreferido: "Daniel Melara",
    comentario: "Solo puedo por la mañana, trabajo desde las 10.",
    franjas: [
      { dia: 4, bloque: "06:30", tipo: "vuelo" },
      { dia: 5, bloque: "06:30", tipo: "vuelo" },
    ],
    estado: "pendiente",
    enviada: "Hoy, 07:12",
  },
  {
    id: "s-luisa",
    alumno: "Luisa Crespín",
    programa: "Piloto Comercial (CPL)",
    fase: "Fase 4 · Navegación (travesías)",
    instructorPreferido: "Sofía Acevedo",
    comentario: "Travesía a El Tamarindo pendiente desde la semana pasada.",
    franjas: [
      { dia: 1, bloque: "08:00", tipo: "vuelo" },
      { dia: 1, bloque: "09:30", tipo: "vuelo" },
      { dia: 2, bloque: "15:30", tipo: "teoria" },
    ],
    estado: "pendiente",
    enviada: "Ayer, 19:48",
  },
];

export type Aviso = { id: string; para: string; texto: string; hora: string; leido: boolean };
export type Prospecto = { id: string; nombre: string; telefono: string; programa: string; hora: string };

// ---------- Sitio público ----------

export const PROGRAMAS = [
  {
    id: "ppl",
    sigla: "PPL",
    nombre: "Piloto Privado",
    resumen: "Tu primera licencia. Aprendes a volar un monomotor como piloto al mando, de día y en condiciones visuales.",
    duracion: "8 a 12 meses",
    horas: "40 h de vuelo",
    teoria: "9 materias · 120 h de aula",
    requisitos: ["17 años cumplidos", "Certificado médico Clase 2", "Bachillerato o equivalente", "DUI o pasaporte vigente"],
    contenido: ["Maniobras básicas y circuitos de tránsito", "Primer vuelo solo en Ilopango", "Travesías a El Tamarindo y El Jagüey", "Chequeo de pericia ante inspector de la AAC"],
  },
  {
    id: "cpl",
    sigla: "CPL",
    nombre: "Piloto Comercial",
    resumen: "La licencia para trabajar volando. Construyes horas y dominas la navegación avanzada con estándares de aerolínea.",
    duracion: "12 a 18 meses",
    horas: "200 h totales",
    teoria: "14 materias · 250 h de aula",
    requisitos: ["18 años cumplidos", "Licencia PPL vigente", "Certificado médico Clase 1", "Inglés OACI nivel 4"],
    contenido: ["Progresión de 40 a 200 horas de vuelo", "100 h como piloto al mando", "Travesías largas dentro de Centroamérica", "Maniobras comerciales y aeronave compleja"],
  },
  {
    id: "ifr",
    sigla: "IFR",
    nombre: "Habilitación de Instrumentos",
    resumen: "Vuela con referencia solo a los instrumentos: nubes, lluvia y baja visibilidad dejan de ser un límite.",
    duracion: "3 a 5 meses",
    horas: "40 h de instrumentos",
    teoria: "5 materias · 80 h de aula",
    requisitos: ["Licencia PPL o CPL vigente", "50 h de travesía como piloto al mando", "Certificado médico vigente"],
    contenido: ["Hasta 20 h en el simulador Redbird LD", "Esperas, salidas y llegadas normalizadas", "Aproximaciones VOR, ILS y RNAV", "Gestión de fallas de instrumentos"],
  },
  {
    id: "me",
    sigla: "ME",
    nombre: "Habilitación Multimotor",
    resumen: "El paso al bimotor en nuestro Piper PA-34 Seneca II. Abierto a pilotos que quieren subir de nivel.",
    duracion: "4 a 6 semanas",
    horas: "10 a 15 h en bimotor",
    teoria: "Sistemas y performance · 20 h",
    requisitos: ["Licencia PPL o CPL vigente", "Certificado médico vigente"],
    contenido: ["Sistemas del Seneca II", "Vuelo con un motor inoperativo", "Velocidades críticas (Vmc)", "Aproximaciones monomotor"],
  },
  {
    id: "tcp",
    sigla: "TCP",
    nombre: "Tripulante de Cabina",
    resumen: "Formación profesional en cabina: seguridad primero, servicio después. Con inglés técnico incluido.",
    duracion: "6 meses semanal · 8 meses sabatino",
    horas: "Prácticas en maqueta de cabina",
    teoria: "Semanal L-M-V, semanal M-J o sabatino",
    requisitos: ["18 años cumplidos", "Bachillerato", "Certificado médico", "Inglés intermedio"],
    contenido: ["Seguridad aérea y procedimientos de emergencia", "Primeros auxilios y supervivencia", "Servicio a bordo e imagen profesional", "Inglés técnico de aviación"],
  },
  {
    id: "counter",
    sigla: "CTR",
    nombre: "Agente de Counter",
    resumen: "Diplomado en aviación y turismo para trabajar en aeropuerto: del mostrador a la puerta de abordaje.",
    duracion: "2 meses",
    horas: "Plan semanal o sabatino",
    teoria: "7 módulos",
    requisitos: ["18 años cumplidos", "Bachillerato", "Inglés básico"],
    contenido: ["Check-in en mostrador y sistemas de reservación", "Proceso de abordaje y anfitrión de lobby", "Arribo y manejo de equipaje", "Legislación aeronáutica y terminología de viaje"],
  },
];
