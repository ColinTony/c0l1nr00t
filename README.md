# c0l1nr00t — Security Researcher

Sitio personal de **c0l1nr00t**, security researcher mexicano: investigación en
dispositivos Amazon (Kindle, Fire TV, Echo Show, Ring), navegadores embebidos,
parsers, fuzzing y memory corruption.

Construido con Astro, TypeScript y Markdown. Estático, sin framework de UI.

## Requisitos

- Node.js v18+
- npm

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:4321 (sin API de reacciones)
npm run build    # genera dist/
npm run preview  # sirve dist/
npm run dev:api  # http://localhost:8788 — sitio + /api/reactions con D1 local
```

## Estructura

```text
src/
  components/       # Header, Footer, Card, PostRow, BaseHead,
                    # Terminal, CommandPalette, Motion
  content/
    blog/es/        # Research log (Markdown)
    writeups/es/    # Writeups técnicos (Markdown)
  data/
    research.ts     # Identidad, plataformas, hallazgos, timeline → home/research/about
  i18n/             # Diccionario de textos
  layouts/          # BaseLayout
  pages/es/         # Rutas del sitio
  styles/           # Sistema de diseño (global.css) + CSS por página
  utils/            # reading-time, slug
worker/             # API de reacciones (Cloudflare Worker)
migrations/         # Esquema de la base D1
```

## Secciones

| Ruta | Qué es |
| --- | --- |
| `/es` | Hero con terminal interactiva, áreas de investigación activas, hallazgos destacados, últimos posts |
| `/es/research` | Plataformas investigadas, hallazgos, metodología, hardware |
| `/es/blog` | Research log: research notes, lab notes, deep dives |
| `/es/blog/categoria/<slug>` | Entradas por categoría (solo las que tienen contenido) |
| `/es/writeups` | Writeups técnicos completos (fuera del menú mientras esté vacío) |
| `/es/about` | Perfil, evolución profesional, toolset y trabajo de pentesting |
| `/es/contact` | Contacto por protocolo (FormSubmit) |
| `/es/rss.xml` | Feed del blog |

La narrativa del sitio se edita en `src/data/research.ts`, no en las plantillas.

## Publicar contenido

1. Crea un `.md` en `src/content/blog/es/`.
2. Incluye el frontmatter requerido (ver `docs/content-guide.md`).
3. Astro lo detecta y lo publica. Con `draft: true` o `visible: false` queda oculto.

Regla de contenido: nada de CVEs, recompensas o impactos inventados, y los
detalles de vulnerabilidades bajo divulgación coordinada se mantienen a alto
nivel.

## Idioma

El sitio es en español. La marca, los titulares y la terminología técnica van en
inglés. La infraestructura i18n existe (`src/i18n/`) pero solo está poblada la
clave `es`.

## Diseño

Sistema de tokens en `src/styles/global.css`. Convenciones en
`docs/style-guide.md`.

## Reacciones

Cada entrada tiene cuatro reacciones (👍 🔥 🤯 ❤️) con contador. Sin comentarios.
Las cuentas viven en **Cloudflare D1** y las sirve `worker/index.js` en
`/api/reactions`. Una reacción por persona y entrada: pulsar la misma la quita y
pulsar otra la sustituye.

Alta de la base, una sola vez:

```bash
npm run db:create          # crea la base y devuelve el database_id
                           # pega ese id en wrangler.jsonc
npm run db:migrate:local   # tablas para el entorno local (npm run dev:api)
npm run db:migrate         # tablas en producción
npm run deploy
```

Opcional, para que el identificador de votante no dependa de un valor por
defecto:

```bash
npx wrangler secret put REACTIONS_SALT
```

No se guarda ninguna IP: el votante es un hash con sal de IP + user agent, y
solo sirve para evitar el voto repetido. Mientras la base no esté configurada,
la API responde 503 y el bloque de reacciones no se muestra.

## Interacción

- `Ctrl/⌘ + K` (o `/`) abre la paleta de comandos para navegar el sitio.
- La terminal de la home acepta comandos: `help`, `targets`, `focus`,
  `findings`, `hardware`, `posts`, `open <sección>`, `clear`.
- Todo el movimiento (aparición al hacer scroll, foco de puntero, texto que se
  descifra, contadores) vive en `src/components/Motion.astro` y se apaga con
  `prefers-reduced-motion`. Sin JavaScript el contenido se ve completo.

## Analytics

Cloudflare Web Analytics está integrado en `src/components/BaseHead.astro`. Para
activar Plausible, define `PUBLIC_ANALYTICS_ID` en `.env`.

## Despliegue

Cloudflare, según `wrangler.jsonc`: el enrutador de assets sirve `dist/` y el
worker atiende `/api/reactions`.

```bash
npm run deploy   # equivale a: astro build && wrangler deploy
```

> Pendiente: `site` en `astro.config.mjs` sigue apuntando al placeholder
> `https://c0l1nr00t.netlify.app`. Cámbialo al dominio real para que canonical,
> sitemap, Open Graph y JSON-LD sean correctos.
