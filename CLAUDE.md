# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

```bash
npm run dev       # servidor de desarrollo en http://localhost:4321
npm run build     # genera dist/ (SSG puro, sin adapter)
npm run preview   # sirve dist/ localmente
npx wrangler deploy   # publica dist/ en Cloudflare (worker "colintony-site")
```

No hay tests, linter ni `astro check` instalado (`@astrojs/check` no está en dependencias). La única verificación disponible es que `npm run build` complete sin errores: los esquemas Zod de `src/content/config.ts` fallan el build si un frontmatter es inválido.

## Arquitectura

Sitio personal estático en **Astro 5** (blog + writeups + CV), estética "terminal hacker". Sin framework de UI, sin JS de cliente más allá de scripts inline en componentes.

### Enrutamiento e i18n — el punto más importante

La configuración declara `es` y `en`, pero **solo existe español**. Antes de tocar cualquier cosa relacionada con idiomas, ten presente que:

- `src/pages/` solo contiene `es/`. La raíz `src/pages/index.astro` redirige a `/es`.
- `src/i18n/dict.ts` solo define el objeto `es`; `languages` en `utils.ts` solo lista `es`.
- `LangSwitch.astro` sigue pintando un enlace a `/en/...` que devuelve 404. `astro.config.mjs` sigue declarando `locales: ['es','en']`.
- Las páginas bajo `src/pages/es/` **hardcodean** `const lang = "es"` en lugar de usar `getLangFromUrl()`; los componentes compartidos (`Header`, `LangSwitch`, `BaseLayout`) sí lo derivan de la URL.

Si se añade inglés hay que crear `src/pages/en/` completo, la clave `en` en `dict.ts` y en `languages`.

### Colecciones de contenido

Dos colecciones (`blog`, `writeups`) definidas en `src/content/config.ts`, con el **idioma como carpeta**: `src/content/<colección>/es/<slug>.md`.

Consecuencia del layout por carpeta, repetida en todas las páginas:

```js
getCollection("blog", ({ id, data }) => id.startsWith("es/") && ...)
// y para construir la URL:
`/es/blog/${post.slug.split("/")[1]}`   // quita el prefijo "es/" del slug
```

El slug de la URL sale del nombre del archivo en minúsculas conservando guiones bajos (`Bit-02-lo_que_estoy_aprendiendo.md` → `/es/blog/bit-02-lo_que_estoy_aprendiendo`). Renombrar un archivo cambia la URL publicada.

Frontmatter requerido y valores permitidos: ver `docs/content-guide.md` y los `z.enum(...)` de `src/content/config.ts` (`platform`, `category`, `difficulty`, `status`).

Las entradas de blog llevan además `category` (tema, de `BLOG_CATEGORIES`) y `type` (formato, de `POST_TYPES`), ambos opcionales. Cada categoría **con entradas** genera una ruta estática `/es/blog/categoria/<slug>`; las vacías no aparecen en ningún sitio, así que la lista de `BLOG_CATEGORIES` puede crecer sin dejar secciones muertas. El slug sale de `src/utils/slug.ts`.

### Narrativa: identidad e investigación

La identidad del sitio (**c0l1nr00t — Security Researcher**) no está escrita en las plantillas: vive en **`src/data/research.ts`**, que es la fuente única para la home, `/es/research` y `/es/about` — áreas de investigación, plataformas (Kindle, Fire TV, Echo Show, Ring), hallazgos publicables, evento de Las Vegas 2026, metodología, hardware, timeline y trabajo de pentesting. Para actualizar el mensaje del sitio se edita ese archivo, no el HTML.

Reglas al tocar ese contenido:

- **Nunca inventar** CVEs, recompensas, severidades, impactos ni vulnerabilidades. Solo entra lo que el autor ha confirmado.
- Separar lo ya público de lo que sigue bajo divulgación coordinada; ante la duda, mantenerlo genérico y a alto nivel.
- Las cifras de bug bounty son contexto, nunca el titular: la narrativa es la investigación.
- El pentesting es trabajo profesional **secundario**; la identidad principal es security research.
- Voz: titulares y terminología técnica en inglés, explicaciones y cuerpo en español.

### Visibilidad del contenido: dos mecanismos superpuestos

- Blog: `draft: true` lo oculta; `visible: false` también.
- Writeups: `status: "draft"` lo oculta; `visible: false` también.

Todas las páginas de listado y de detalle aplican hoy el mismo filtro (`draft`/`status` + `visible`). Si añades una ruta nueva, replícalo entero.

Hoy los tres writeups existentes tienen `visible: false`, por lo que `/es/writeups` se publica con estado vacío y `writeups/[slug].astro` no genera ninguna ruta. Por eso **Writeups no está en la navegación**: se alcanza desde `/es/research`. Cuando se publique el primero, hay que devolver el enlace a `links` en `Header.astro`.

`getStaticPaths` se extrae a su propio módulo en build: **no puede referenciar constantes definidas en el frontmatter de la página**. Todo lo que use debe estar declarado dentro de la propia función.

### Estilos

Sistema de diseño con tokens en `src/styles/global.css` (superficies, texto, un solo acento, escalas tipográfica y de espaciado, radios, sombras, movimiento). Ahí viven también los componentes globales: `.btn`, `.chip`, `.badge`, `.difficulty`, `.panel`, `.terminal`, `.prose`, `.empty-state`, `.page-header`, `.section-title`. Los nombres de variables antiguos (`--bg0`, `--muted`, `--neon-green`…) quedan como alias al final de `:root` solo por compatibilidad; en código nuevo usa los tokens actuales. Convenciones y ejemplos en `docs/style-guide.md`.

Tres niveles, sin preprocesador ni framework:

1. `global.css` — tokens, base, componentes globales y utilidades.
2. `<style>` scoped en cada `.astro` — solo la composición propia de esa página o componente.
3. `src/styles/pages/{about,contact}.css` — esas dos páginas, por volumen.

Regla práctica: el Markdown renderizado va siempre dentro de `<div class="prose">`; no redefinas estilos de titulares, código o citas por página.

`BaseLayout.astro` envuelve todo: skip-link + `BaseHead` + `Header` + `<slot/>` + `Footer` + acceso flotante al CV (solo ≤820px), con `ViewTransitions`.

Como `ViewTransitions` está activo, **todo script de página debe re-ejecutarse en `astro:page-load`**, no solo al cargar el documento. El patrón usado en el repo es declarar una función `setupX()` y llamarla dos veces (directamente y en el evento).

## Servicios externos

- **Formulario de contacto**: FormSubmit.co vía `fetch` a `https://formsubmit.co/ajax/<token>` (`src/pages/es/contact.astro`), con fallback al `action` del `<form>`. No usa Netlify Forms.
- **Analytics**: beacon de Cloudflare Web Analytics hardcodeado en `BaseHead.astro`, más un script de Plausible condicionado a `PUBLIC_ANALYTICS_ID`.
- **Despliegue**: Cloudflare vía `wrangler.jsonc` (assets desde `./dist`).

## SEO

`BaseHead.astro` emite canonical, Open Graph, Twitter Card, keywords y **JSON-LD**: siempre un `Person` (rol, `knowsAbout`, `sameAs`) y, cuando la página pasa `publishedDate`, un `BlogPosting`. Las páginas de detalle deben pasar `type="article"`, `publishedDate` y `tags` a `BaseLayout`. El feed vive en `src/pages/es/rss.xml.ts`.

**Pendiente conocido**: `site` en `astro.config.mjs` sigue siendo el placeholder `https://c0l1nr00t.netlify.app` — decisión explícita del autor de dejarlo por ahora. Es lo que se emite en canonical, sitemap, Open Graph y JSON-LD, así que hay que cambiarlo cuando exista dominio propio (también aparece como fallback en `rss.xml.ts`).

`docs/deploy.md` describe un estado anterior (Netlify Forms y despliegue en Netlify); el proyecto usa Cloudflare + FormSubmit.

## Idioma

Todo el contenido, la UI y los commits están en español. Escribe textos visibles y documentación en español, con acentuación correcta.
