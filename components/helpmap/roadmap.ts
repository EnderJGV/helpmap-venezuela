// Product roadmap data — rendered by app/docs/roadmap/page.tsx. This is the
// public "where we are / where we're going" roadmap, by phase, bilingual (Spanish
// base, English secondary). The detailed engineering feature-proposal doc lives in
// ROADMAP.md at the repo root. Every shipped/planned item still obeys CLAUDE.md
// §2/§11 privacy rules.

import type { Lang } from "./data";

// Bilingual string.
export type LS = { es: string; en: string };

export const tr = (o: LS, lang: Lang) => o[lang];

export type PhaseStatus = "done" | "current" | "next" | "later";

export const PHASE_META: Record<PhaseStatus, { dot: string; label: LS }> = {
  done: { dot: "#1c8a4e", label: { es: "Completado", en: "Done" } },
  current: { dot: "#2563eb", label: { es: "En curso · Lanzamiento", en: "In progress · Launch" } },
  next: { dot: "#b45309", label: { es: "Próximo", en: "Next" } },
  later: { dot: "#7b818c", label: { es: "Más adelante", en: "Later" } },
};

export interface Phase {
  id: string;
  title: LS;
  status: PhaseStatus;
  note?: LS;
  items: LS[];
}

export const ROADMAP_TITLE: LS = { es: "Roadmap", en: "Roadmap" };

export const ROADMAP_INTRO: LS = {
  es: "En qué estamos y hacia dónde vamos. HelpMap VE está listo para su lanzamiento: abajo ves lo que ya funciona y lo que viene después. Es una guía de producto que evoluciona; el equipo decide las prioridades.",
  en: "Where we are and where we're headed. HelpMap VE is ready to launch: below is what already works and what comes next. It's an evolving product guide; the team sets the priorities.",
};

// Short banner highlighting the current phase.
export const ROADMAP_NOW: LS = {
  es: "Fase actual: Lanzamiento — listos para salir.",
  en: "Current phase: Launch — ready to go live.",
};

export const ROADMAP_PHASES: Phase[] = [
  {
    id: "p1",
    title: { es: "Fase 1 · Fundación", en: "Phase 1 · Foundation" },
    status: "done",
    items: [
      {
        es: "Mapa interactivo: explorar por estado, municipio y centro.",
        en: "Interactive map: explore by state, municipality and centre.",
      },
      {
        es: "Búsqueda por nombre, apellido o cédula, con filtros por estatus.",
        en: "Search by name, surname or ID, with status filters.",
      },
      {
        es: "Fichas con páginas compartibles (WhatsApp, Telegram, Instagram).",
        en: "Records with shareable pages (WhatsApp, Telegram, Instagram).",
      },
      {
        es: "Funciona sin conexión: abre una vez con datos y consúltala sin señal.",
        en: "Works offline: open it once with data and consult it without signal.",
      },
      {
        es: 'Formulario "Subir info" — revisado por el equipo antes de publicarse.',
        en: '"Upload info" form — reviewed by the team before publishing.',
      },
      {
        es: "Protección reforzada de menores: nunca su foto ni su cédula.",
        en: "Reinforced protection of minors: never their photo or ID.",
      },
    ],
  },
  {
    id: "p2",
    title: { es: "Fase 2 · Lanzamiento", en: "Phase 2 · Launch" },
    status: "current",
    note: { es: "Estamos aquí.", en: "We are here." },
    items: [
      {
        es: "Cobertura inicial: Distrito Capital, La Guaira y Miranda, con estados ampliados habilitados.",
        en: "Initial coverage: Distrito Capital, La Guaira and Miranda, with expanded states enabled.",
      },
      {
        es: "Panel de administración: gestión de centros y personas.",
        en: "Admin panel: manage centres and people.",
      },
      {
        es: 'Voluntariado: roles, alta de voluntarios y "subir listas" (foto de listas).',
        en: 'Volunteering: roles, volunteer onboarding and "upload lists" (photo of lists).',
      },
      {
        es: 'Donaciones: organizaciones aliadas y CTA "quiero aparecer aquí".',
        en: 'Donations: partner organizations and an "add my organization" CTA.',
      },
      {
        es: "Capa de daños / intensidad sentida del sismo.",
        en: "Damage / felt-intensity layer of the quake.",
      },
      {
        es: "Datos confirmados en campo con contactos en centros de salud.",
        en: "Data confirmed in the field with contacts at health centres.",
      },
      {
        es: "Difusión y contacto por redes (@helpmapvzla) — esfuerzo ciudadano.",
        en: "Outreach and contact via social (@helpmapvzla) — a citizen effort.",
      },
    ],
  },
  {
    id: "p3",
    title: { es: "Fase 3 · Después del lanzamiento", en: "Phase 3 · Post-launch" },
    status: "next",
    items: [
      {
        es: 'Centros de acopio con "lo más necesitado hoy" + WhatsApp al coordinador.',
        en: 'Donation centres with "most needed today" + WhatsApp to the coordinator.',
      },
      {
        es: 'Conteos por ubicación y "última actualización" visible para dar confianza.',
        en: 'Per-location counts and a visible "last updated" to build trust.',
      },
      {
        es: "OCR de listas manuscritas hacia la cola de revisión.",
        en: "OCR of handwritten lists into the review queue.",
      },
      {
        es: '"Yo lo vi": actualizaciones de estado aportadas por familiares.',
        en: '"Yo lo vi": status updates contributed by families.',
      },
    ],
  },
  {
    id: "p4",
    title: { es: "Fase 4 · Futuro", en: "Phase 4 · Future" },
    status: "later",
    items: [
      {
        es: "Morgues con manejo digno: solo canal de contacto, sin listas públicas.",
        en: "Morgues handled with dignity: contact channel only, no public lists.",
      },
      {
        es: 'Búsqueda inversa "persona buscada" — tras una revisión de seguridad.',
        en: '"Persona buscada" reverse search — after a safety review.',
      },
      {
        es: "Imagen compartible de la lista de un centro, respetando la privacidad.",
        en: "Shareable image of a centre's list, respecting privacy.",
      },
      {
        es: "Accesibilidad ampliada: alto contraste, búsqueda por voz.",
        en: "Expanded accessibility: high contrast, voice search.",
      },
      {
        es: "Alcance a la diáspora (familiares en el exterior).",
        en: "Diaspora reach (relatives abroad).",
      },
    ],
  },
];
