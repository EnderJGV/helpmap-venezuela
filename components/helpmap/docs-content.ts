// Content for the documentation pages (rendered by app/docs/[slug]/page.tsx).
// Bilingual (Spanish base, English secondary). Faithful to CLAUDE.md, the in-app
// copy and the SOPs — does not over-claim. The roadmap is a separate custom page
// (app/docs/roadmap); these are the text/bullet docs.

import type { LS } from "./roadmap";

export interface DocBlock {
  label?: LS;
  text?: LS;
  bullets?: LS[];
}

export interface DocSection {
  heading: LS;
  blocks: DocBlock[];
}

export interface DocPage {
  slug: string;
  title: LS;
  intro: LS;
  sections: DocSection[];
}

export const DOCS: DocPage[] = [
  // ---------------------------------------------------------------- Guía de uso
  {
    slug: "guia",
    title: { es: "Guía de uso", en: "Usage guide" },
    intro: {
      es: "Cómo usar HelpMap VE para encontrar a un familiar, aportar información y compartir, incluso con conexión inestable.",
      en: "How to use HelpMap VE to find a relative, contribute information and share, even on a flaky connection.",
    },
    sections: [
      {
        heading: { es: "Buscar a un familiar", en: "Search for a relative" },
        blocks: [
          {
            bullets: [
              { es: "Escribe nombre, apellido o cédula en la barra de búsqueda.", en: "Type a name, surname or ID in the search bar." },
              { es: "Filtra por estatus: Ingresado, De alta o Fallecido.", en: "Filter by status: Admitted, Discharged or Deceased." },
              { es: "Toca una persona para ver su ficha y cómo contactar al centro.", en: "Tap a person to see their record and how to contact the centre." },
              { es: "El check verde indica que el dato fue verificado en campo.", en: "The green check means the record was verified in the field." },
            ],
          },
        ],
      },
      {
        heading: { es: "Explorar el mapa", en: "Explore the map" },
        blocks: [
          {
            bullets: [
              { es: "Filtra por estado y municipio para acotar la zona.", en: "Filter by state and municipality to narrow the area." },
              { es: "Toca un centro (hospital, refugio, centro de acopio) para ver quién está ahí.", en: "Tap a centre (hospital, shelter, donation centre) to see who is there." },
              { es: "Los centros de acopio muestran información de contacto, no una lista de personas.", en: "Donation centres show contact info, not a list of people." },
            ],
          },
        ],
      },
      {
        heading: { es: "Subir información", en: "Upload information" },
        blocks: [
          {
            text: {
              es: 'Toca "Subir info" y completa nombre, apellido, edad, cédula y el centro. Tu envío NO se publica de inmediato: lo revisa el equipo y contactos médicos antes de aparecer.',
              en: 'Tap "Upload info" and fill in name, surname, age, ID and the centre. Your submission is NOT published right away: the team and medical contacts review it before it appears.',
            },
          },
          {
            text: {
              es: "Si la persona es menor de edad, el sistema no pide cédula ni foto. Si lo envías sin conexión, queda en cola y se manda solo al volver el internet.",
              en: "If the person is a minor, the system doesn't ask for an ID or photo. If you submit it offline, it queues and sends itself when the connection returns.",
            },
          },
        ],
      },
      {
        heading: { es: "Compartir", en: "Share" },
        blocks: [
          {
            text: {
              es: "Desde una ficha puedes compartir por WhatsApp, Telegram o copiar el enlace para Instagram. Lo compartido respeta la privacidad: nunca muestra fotos de menores.",
              en: "From a record you can share via WhatsApp, Telegram or copy the link for Instagram. Shared content respects privacy: it never shows minors' photos.",
            },
          },
        ],
      },
      {
        heading: { es: "Usar la app sin conexión", en: "Use the app offline" },
        blocks: [
          {
            text: {
              es: "Abre la app al menos una vez con datos: guarda lo último que cargó. Si te quedas sin señal, la vuelves a abrir y sigue mostrando esa información con un aviso de \"datos posiblemente desactualizados\". Se actualiza sola al recuperar conexión.",
              en: "Open the app at least once with data: it saves what it last loaded. If you lose signal, reopen it and it still shows that information with a \"data may be outdated\" notice. It updates itself once the connection is back.",
            },
          },
        ],
      },
      {
        heading: { es: "Instalar en el teléfono", en: "Install on your phone" },
        blocks: [
          {
            bullets: [
              { es: 'Android (Chrome): menú → "Agregar a pantalla de inicio".', en: 'Android (Chrome): menu → "Add to Home screen".' },
              { es: 'iPhone (Safari): Compartir → "Agregar a inicio".', en: 'iPhone (Safari): Share → "Add to Home Screen".' },
            ],
          },
        ],
      },
    ],
  },

  // ------------------------------------------------- Privacidad y manejo de datos
  {
    slug: "privacidad",
    title: { es: "Privacidad y manejo de datos", en: "Privacy & data handling" },
    intro: {
      es: "Esta es una base de datos de personas identificadas durante una catástrofe. Ayuda a reunir familias, y por eso la manejamos con reglas estrictas, varias enforzadas a nivel de base de datos.",
      en: "This is a database of identified people during a disaster. It helps reunite families, so we handle it with strict rules, several enforced at the database layer.",
    },
    sections: [
      {
        heading: { es: "Qué mostramos", en: "What we show" },
        blocks: [
          {
            text: {
              es: "Solo lo necesario para reunir: apellidos, nombres, cédula (adultos), edad, sexo, ubicación, estatus y la insignia de verificado. La foto solo aparece en adultos verificados.",
              en: "Only what's needed to reunite: surnames, names, ID (adults), age, sex, location, status and the verified badge. A photo only appears for verified adults.",
            },
          },
        ],
      },
      {
        heading: { es: "Qué nunca mostramos", en: "What we never show" },
        blocks: [
          {
            bullets: [
              { es: "El barrio o sector de origen (procedencia). Es solo de uso administrativo.", en: "The home neighbourhood/area of origin. Admin-use only." },
              { es: "El servicio médico o sala. También solo administrativo.", en: "The medical service or ward. Also admin-only." },
            ],
          },
        ],
      },
      {
        heading: { es: "Protección reforzada de menores", en: "Reinforced protection of minors" },
        blocks: [
          {
            text: {
              es: "Los menores de edad nunca llevan foto ni cédula: en su lugar se muestra \"MENOR\" y un avatar neutro. Está protegido en varias capas del sistema, así que no depende de quien cargue el dato.",
              en: "Minors never carry a photo or ID: instead we show \"MENOR\" and a neutral avatar. It's protected across several layers of the system, so it doesn't depend on who enters the data.",
            },
          },
        ],
      },
      {
        heading: { es: "Personas fallecidas", en: "Deceased persons" },
        blocks: [
          {
            text: {
              es: "El estatus de fallecido es sensible: solo se publica una vez verificado y se trata con respeto, sin estilos alarmistas y sin convertirse en un conteo de víctimas.",
              en: "Deceased status is sensitive: it's only published once verified and handled respectfully, without alarmist styling and without becoming a casualty count.",
            },
          },
        ],
      },
      {
        heading: { es: "Cómo verificamos", en: "How we verify" },
        blocks: [
          {
            text: {
              es: "Cada dato se confirma en campo con contactos en centros de salud. El flujo es: recepción → limpieza y dedup → verificación humana → publicación. Nada enviado por el público llega directo al mapa.",
              en: "Each record is confirmed in the field with contacts at health centres. The flow is: intake → cleanup and dedup → human verification → publishing. Nothing submitted by the public reaches the map directly.",
            },
          },
        ],
      },
      {
        heading: { es: "Sin rastreo", en: "No tracking" },
        blocks: [
          {
            text: {
              es: "No rastreamos quién busca a quién: las búsquedas son privadas. Es una iniciativa sin fines de lucro: no cobramos, no mostramos publicidad y no vendemos datos.",
              en: "We don't track who searches for whom: searches are private. It's a non-profit initiative: we don't charge, show ads or sell data.",
            },
          },
        ],
      },
    ],
  },

  // ----------------------------------------------------------- Para voluntarios
  {
    slug: "voluntarios",
    title: { es: "Para voluntarios", en: "For volunteers" },
    intro: {
      es: "HelpMap es un esfuerzo ciudadano. Mientras más datos podamos confirmar, más rápido llenamos el mapa y más familias se reúnen.",
      en: "HelpMap is a citizen effort. The more data we can confirm, the faster we fill the map and the more families reunite.",
    },
    sections: [
      {
        heading: { es: "A quién buscamos", en: "Who we're looking for" },
        blocks: [
          {
            text: {
              es: "Médicos, enfermeros, personal de salud y rescatistas con acceso a información veraz desde hospitales y refugios.",
              en: "Doctors, nurses, health workers and rescuers with access to truthful information from hospitals and shelters.",
            },
          },
        ],
      },
      {
        heading: { es: "Cómo sumarse", en: "How to join" },
        blocks: [
          {
            text: {
              es: "Escríbenos con tu perfil y tus fuentes de información para darte acceso. Cada voluntario se verifica antes de habilitarlo: así protegemos la veracidad de los datos.",
              en: "Write to us with your profile and your information sources so we can grant you access. Every volunteer is vetted before being enabled — that's how we protect the accuracy of the data.",
            },
          },
        ],
      },
      {
        heading: { es: "Qué puedes hacer", en: "What you can do" },
        blocks: [
          {
            bullets: [
              { es: "Agregar y editar personas desde el panel de voluntario.", en: "Add and edit people from the volunteer panel." },
              { es: 'Subir listas: fotografía una lista manuscrita o impresa y nosotros la digitalizamos.', en: 'Upload lists: photograph a handwritten or printed list and we digitize it.' },
              { es: "Tus cambios pasan por revisión del equipo antes de publicarse.", en: "Your changes go through team review before publishing." },
              { es: "No puedes eliminar registros ni editar centros (eso es de administración).", en: "You can't delete records or edit centres (that's admin)." },
            ],
          },
        ],
      },
      {
        heading: { es: "Privacidad que debes respetar", en: "Privacy you must respect" },
        blocks: [
          {
            text: {
              es: "Nunca cargues foto ni cédula de un menor (el sistema fuerza \"MENOR\"). No manejes públicamente la procedencia ni el servicio médico.",
              en: "Never upload a minor's photo or ID (the system forces \"MENOR\"). Don't handle the home origin or medical service publicly.",
            },
          },
        ],
      },
      {
        heading: { es: "Contacto", en: "Contact" },
        blocks: [
          {
            text: {
              es: "Escríbenos a info@helpmapvzla.net o por el botón de voluntariado en la app.",
              en: "Write to info@helpmapvzla.net or use the volunteer button in the app.",
            },
          },
        ],
      },
    ],
  },

  // ------------------------------------------------------- Para prensa y aliados
  {
    slug: "prensa",
    title: { es: "Para prensa y aliados", en: "For press & partners" },
    intro: {
      es: "Información para medios, organizaciones y aliados que quieran entender, citar o colaborar con HelpMap VE.",
      en: "Information for media, organizations and partners who want to understand, cite or collaborate with HelpMap VE.",
    },
    sections: [
      {
        heading: { es: "Qué es", en: "What it is" },
        blocks: [
          {
            text: {
              es: "Un mapa humanitario para reunir familias tras el terremoto de junio de 2026, ayudando a ubicar a personas ingresadas en hospitales o en refugios en Caracas (Distrito Capital), La Guaira, Miranda y estados ampliados.",
              en: "A humanitarian map to reunite families after the June 2026 earthquake, helping locate people admitted to hospitals or sheltered in Caracas (Distrito Capital), La Guaira, Miranda and expanded states.",
            },
          },
        ],
      },
      {
        heading: { es: "Quién lo construye", en: "Who builds it" },
        blocks: [
          {
            text: {
              es: "Un equipo voluntario: Tropical Sadness x Imágenes Nacionales, junto a personal de salud y rescate. Es un esfuerzo ciudadano, sin fines de lucro.",
              en: "A volunteer team: Tropical Sadness x Imágenes Nacionales, together with health and rescue staff. It's a non-profit citizen effort.",
            },
          },
        ],
      },
      {
        heading: { es: "Metodología", en: "Methodology" },
        blocks: [
          {
            text: {
              es: "Los datos se confirman en campo con contactos en centros de salud y se verifican manualmente antes de publicarse. Cada registro lleva una insignia de verificación.",
              en: "Data is confirmed in the field with contacts at health centres and verified manually before publishing. Each record carries a verification badge.",
            },
          },
        ],
      },
      {
        heading: { es: "Compromiso con la privacidad", en: "Privacy commitment" },
        blocks: [
          {
            text: {
              es: "No exponemos datos de menores ni direcciones de origen; no cobramos, no mostramos publicidad y no vendemos datos. Las búsquedas son privadas.",
              en: "We don't expose minors' data or home addresses; we don't charge, show ads or sell data. Searches are private.",
            },
          },
        ],
      },
      {
        heading: { es: "Cómo citar o colaborar", en: "How to cite or collaborate" },
        blocks: [
          {
            bullets: [
              { es: "Sitio: helpmapvzla.net · Instagram: @helpmapvzla", en: "Site: helpmapvzla.net · Instagram: @helpmapvzla" },
              { es: "Contacto: info@helpmapvzla.net", en: "Contact: info@helpmapvzla.net" },
            ],
          },
        ],
      },
    ],
  },
];

export const getDoc = (slug: string) => DOCS.find((d) => d.slug === slug);
