# Flight Training · prototipo de plataforma

Prototipo navegable (Next.js + Tailwind CSS + Lucide) del sitio público, el portal del alumno y el despacho de vuelos.
Todo funciona en el navegador con React state y localStorage; no hay backend.

```bash
npm install
npm run dev
```

Abrir http://localhost:3000. El cambio de vista está en la barra superior: Sitio público, Alumno, Despacho e instructores.
El botón circular de la derecha reinicia la demo a su estado original.

## Guion sugerido para la demo

1. **Sitio público**: hero, egresados en aerolíneas, programas (pestañas), flota, instalaciones y formulario de admisión. Enviar el formulario.
2. **Alumno › Programación semanal**: marcar bloques de vuelo y teoría, enviar disponibilidad. Queda "Pendiente de aprobación".
3. **Despacho**: la solicitud aparece con aeronave e instructor propuestos sin choques. Aprobar: el tablero salta al día y resalta el bloque nuevo; se registra la notificación. Cambiar día u hora la convierte en "Reprogramado".
4. **Alumno**: aviso de despacho, semana confirmada, luego **Mi avance** (horas, teoría, vigencias) y **Bitácora** (abrir un vuelo y firmar el debriefing).

## Dónde cambiar cosas

- `lib/data.ts`: flota, instructores, programación de la semana, alumno de la demo, vuelos, programas.
- `app/globals.css`: colores de marca.
- `public/img/`: fotos del sitio, logo y emblema.
- `app/layout.tsx`: metadatos y Open Graph. Definir `NEXT_PUBLIC_SITE_URL` con el dominio final al desplegar.
- `app/opengraph-image.jpg`, `app/icon.png`: imagen para compartir y favicon.

## Desplegar

Funciona tal cual en Vercel: importar el repositorio y agregar la variable `NEXT_PUBLIC_SITE_URL` con la URL pública.

El material original de la escuela (carpeta `_referencias/`) no se incluye en el repositorio.
