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
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npm run preview  # sirve dist/
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

Cloudflare, sirviendo `dist/` según `wrangler.jsonc`:

```bash
npm run build
npx wrangler deploy
```

> Pendiente: `site` en `astro.config.mjs` sigue apuntando al placeholder
> `https://c0l1nr00t.netlify.app`. Cámbialo al dominio real para que canonical,
> sitemap, Open Graph y JSON-LD sean correctos.
