/**
 * Fuente única de la narrativa de investigación.
 * La consumen la home, /es/research, /es/about y la terminal.
 *
 * REGLA: aquí no se publica ninguna vulnerabilidad. Ni la clase de bug, ni la
 * superficie concreta donde apareció, ni el impacto, ni cifras de recompensa.
 * Lo que sí puede contarse es la actividad y en qué estado quedó (ver
 * `researchLog`). Tampoco se inventan CVEs, severidades ni impactos.
 */

export const identity = {
    handle: "c0l1nr00t",
    role: "Security Researcher",
    location: "México",
    tagline:
        "I break browsers, devices and weird attack surfaces to understand how they work.",
    lead: "Investigo Kindle, Fire TV, Echo Show y Ring: browsers embebidos, parsers, fuzzing y memory corruption.",
    short: "Empecé rompiendo aplicaciones web. Ahora paso la mayor parte del tiempo intentando entender qué ocurre por debajo: dispositivos, navegadores embebidos y las superficies raras que quedan entre unos y otros.",
};

/** Bloque "Currently Researching". */
export const researchAreas = [
    {
        title: "Kindle Security",
        summary: "Browser, parsers, internal APIs y recursos locales.",
        status: "active",
    },
    {
        title: "Fire TV / Vega OS",
        summary: "IPC, browsers, WebViews, servicios y componentes nativos.",
        status: "active",
    },
    {
        title: "Echo Show",
        summary:
            "Superficies de entrada inalámbricas, browsers y vectores externos.",
        status: "active",
    },
    {
        title: "Ring",
        summary: "Aplicación móvil, APIs, WebRTC y componentes nativos.",
        status: "early",
    },
    {
        title: "Browser Security",
        summary:
            "WebViews, componentes basados en Chromium y superficies de navegador embebido.",
        status: "active",
    },
    {
        title: "Fuzzing",
        summary:
            "Parsers, librerías nativas y formatos de entrada alcanzables desde fuera.",
        status: "building",
    },
    {
        title: "Memory Corruption",
        summary: "Crash analysis y estudio de explotabilidad.",
        status: "learning",
    },
    {
        title: "AI-Assisted Vulnerability Research",
        summary:
            "Workflows con agentes para acelerar análisis, automatización y fuzzing.",
        status: "building",
    },
];

export const statusLabels: Record<string, string> = {
    active: "En curso",
    early: "Fase inicial",
    building: "Construyendo",
    learning: "Aprendiendo",
};

/** Plataformas investigadas, con el detalle que sí es publicable. */
export const platforms = [
    {
        id: "kindle",
        name: "Kindle",
        // El nombre de la plataforma ya encabeza el panel: aquí solo el modelo
        device: "Paperwhite Signature Edition · 12th Gen",
        intro: "La plataforma que más he investigado. Donde el web security clásico se cruza con un dispositivo real.",
        // A propósito en categorías amplias: la lista de funcionalidades
        // concretas, junto al registro de abajo, sería un mapa de dónde mirar.
        surfaces: [
            "Experimental Browser",
            "Contenido remoto",
            "APIs internas",
            "Navegación interna",
            "Parsing de contenido",
            "Recursos locales",
            "Persistencia",
        ],
    },
    {
        id: "fire-tv",
        name: "Fire TV",
        device: "Vega OS",
        intro: "Mucha más capacidad de instrumentación que Kindle, así que sirve de banco de pruebas para bugs que puedan existir en otros dispositivos que reutilicen componentes.",
        surfaces: [
            "Vega OS",
            "WebViews",
            "Silk",
            "Integración con YouTube",
            "DIAL",
            "Deeplinks",
            "IPC",
            "Servicios internos",
            "HDMI / HDMI-CEC",
            "Parsers",
            "Componentes nativos",
        ],
    },
    {
        id: "echo-show",
        name: "Echo Show",
        device: "Echo Show 5 · 3rd gen",
        intro: "Investigación centrada en lo que se alcanza desde fuera, sin acceso privilegiado al dispositivo.",
        surfaces: [
            "Wi-Fi discovery",
            "Bluetooth discovery",
            "Silk / WebView",
            "Captive portals",
            "Voice interfaces",
            "Browser rendering",
            "Malformed input",
            "Device onboarding",
            "Fastboot / USB",
            "Audio injection",
            "Resource exhaustion",
        ],
    },
    {
        id: "ring",
        name: "Ring",
        device: "Ecosistema app + cloud + dispositivo",
        intro: "Líneas iniciales: extracción y análisis de APKs y librerías nativas para localizar superficies de reversing y fuzzing.",
        surfaces: [
            "Aplicación Android",
            "APIs",
            "OAuth y sesiones",
            "WebRTC",
            "Componentes nativos",
            "Librerías incluidas en la app",
            "Interfaces app → cloud → dispositivo",
        ],
    },
];

/**
 * Registro de investigación: qué hice y en qué estado quedó. Nunca qué
 * encontré.
 *
 * Aquí NO entra la clase de vulnerabilidad, ni la superficie concreta, ni el
 * impacto, ni el dinero. Mientras la divulgación siga abierta, una entrada es
 * como mucho "Investigación en dispositivo Amazon" y su estado. Si algún día
 * un hallazgo se hace público, se publica como writeup, no ampliando esto.
 */
export const researchLog = [
    {
        entry: "Investigación en dispositivo Amazon",
        platform: "Kindle",
        status: "Bounty",
    },
    {
        entry: "Investigación en dispositivo Amazon",
        platform: "Kindle",
        status: "Aceptado",
    },
    {
        entry: "Investigación en dispositivo Amazon",
        platform: "Kindle",
        status: "Reportado",
    },
    {
        entry: "Investigación en dispositivo Amazon",
        platform: "Echo Show",
        status: "Reportado",
    },
    {
        entry: "Fuzzing de parsers y componentes nativos",
        platform: "Fire TV",
        status: "En curso",
    },
    {
        entry: "Reversing de aplicación y librerías nativas",
        platform: "Ring",
        status: "En curso",
    },
];

/** Lo que sale de la investigación además de los bugs. */
export const methodology = {
    loop: ["observar", "cuestionar", "experimentar", "romper", "entender", "demostrar"],
    questions: [
        "¿Qué superficie está expuesta?",
        "¿Qué asume el dispositivo que nunca debería recibir?",
        "¿Qué componentes están reutilizados?",
        "¿Dónde existen parsers interesantes?",
        "¿Qué entradas controla realmente un atacante?",
        "¿Qué ocurre si llevo una funcionalidad fuera de sus condiciones normales?",
        "¿Puedo convertir un comportamiento extraño en un bug reproducible?",
        "¿Cuál es el impacto real?",
        "¿Existe una ruta desde un bug simple hacia algo más profundo?",
    ],
};

/** Hardware que uso para llegar al dispositivo por vías que no son software. */
export const hardware = [
    { name: "ESP32 DevKit", use: "BLE, Bluetooth Classic y Wi-Fi" },
    { name: "Raspberry Pi", use: "Automatización y soporte de laboratorio" },
    { name: "Adaptadores Bluetooth / Wi-Fi", use: "Discovery y onboarding" },
    { name: "Capturadora HDMI", use: "Fire TV, HDMI y HDMI-CEC" },
    { name: "Kindle · Fire TV · Echo Show 5 · Ring", use: "Dispositivos bajo investigación" },
];

/** Evolución profesional, de web a device research. */
export const timeline = [
    {
        stage: "Web Security",
        detail: "Bug bounty y aplicaciones web. El punto de partida.",
    },
    {
        stage: "Complex Web Applications",
        detail: "APIs, access control, lógica de negocio y contextos internos.",
    },
    {
        stage: "Kindle",
        detail: "Una plataforma donde el web security se cruza con un dispositivo.",
    },
    {
        stage: "Amazon Devices",
        detail: "La investigación se expande a Echo Show, Fire TV y Ring.",
    },
    {
        stage: "Embedded / Browser Research",
        detail: "Browsers, WebViews, protocolos, hardware e interfaces externas.",
    },
    {
        stage: "Fuzzing / Memory Corruption",
        detail: "Parsers, código nativo, crash analysis y research de bajo nivel.",
        current: true,
    },
    {
        stage: "AI-Assisted Research",
        detail: "Agentes que aceleran análisis y fuzzing sin sustituir el criterio.",
        current: true,
    },
];

/** Trabajo profesional. Secundario respecto a la investigación. */
export const pentesting = {
    intro: "Además de la investigación independiente hago pentesting profesional: aplicaciones web con múltiples roles y arquitecturas complejas.",
    findings: [
        "IDOR / BOLA",
        "Broken Access Control",
        "Authentication issues",
        "Stored XSS",
        "HTML Injection",
        "Information Disclosure",
        "User Enumeration",
        "Lógica de negocio",
        "APIs",
        "Session management",
    ],
    process: [
        "Reconocimiento",
        "Mapping de funcionalidades",
        "Testing manual",
        "Validación del impacto",
        "Proof of Concept",
        "Reporte técnico",
        "Explicación con desarrolladores",
        "Retesting tras el parche",
    ],
};

/** Tipos de entrada que publico en el blog. */
export const postTypes = [
    { name: "Research Notes", detail: "Investigaciones pequeñas, terminen o no en vulnerabilidad." },
    { name: "Deep Dives", detail: "Investigaciones largas sobre una superficie concreta." },
    { name: "Vulnerability Writeups", detail: "Cuando una vulnerabilidad puede hacerse pública." },
    { name: "Lab Notes", detail: "Experimentos con ESP32, Bluetooth, Wi-Fi, Fire TV, Kindle." },
    { name: "Fuzzing", detail: "Harnesses, targets interesantes y análisis de crashes." },
    { name: "AI Research Workflow", detail: "Cómo uso agentes dentro de vulnerability research." },
    { name: "Lessons Learned", detail: "Bug bounty, eventos y metodología." },
];
