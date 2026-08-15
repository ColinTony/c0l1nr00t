# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

```bash
npm run dev       # servidor de desarrollo en http://localhost:4321 (sin API)
npm run build     # genera dist/ (SSG puro, sin adapter)
npm run preview   # sirve dist/ localmente
npm run dev:api   # build + wrangler dev en :8788 — sitio Y /api/reactions
npm run deploy    # build + wrangler deploy
```

`npm run dev` no sirve `/api/reactions`, así que el bloque de reacciones no aparece; para verlo hay que usar `npm run dev:api`. Ver **Reacciones** más abajo.

No hay tests, linter ni `astro check` instalado (`@astrojs/check` no está en dependencias). La única verificación disponible es que `npm run build` complete sin errores: los esquemas Zod de `src/content/config.ts` fallan el build si un frontmatter es inválido.

## Arquitectura

Sitio personal en **Astro 5** (blog + writeups + CV), estética "terminal hacker". Sin framework de UI, sin JS de cliente más allá de scripts inline en componentes.

Las páginas son estáticas (SSG puro, sin adapter). Lo único dinámico es la API de reacciones, que vive en un Worker aparte (`worker/index.js`) y no interviene en el render.

### Enrutamiento e i18n — el punto más importante

La configuración declara `es` y `en`, pero **solo existe español**. Antes de tocar cualquier cosa relacionada con idiomas, ten presente que:

- `src/pages/` solo contiene `es/`. La raíz `src/pages/index.astro` redirige a `/es`.
- `src/i18n/dict.ts` solo define el objeto `es`; `languages` en `utils.ts` solo lista `es`.
- `LangSwitch.astro` existe pero **no lo importa nadie**: es código huérfano que apunta a `/en/...` (404 si se montara). `astro.config.mjs` sigue declarando `locales: ['es','en']`.
- Las páginas bajo `src/pages/es/` **hardcodean** `const lang = "es"` en lugar de usar `getLangFromUrl()`; los componentes compartidos (`Header`, `BaseLayout`) sí lo derivan de la URL.

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

La identidad del sitio (**c0l1nr00t — Security Researcher**) no está escrita en las plantillas: vive en **`src/data/research.ts`**, que es la fuente única para la home, `/es/research`, `/es/about` y la terminal — áreas de investigación, plataformas (Kindle, Fire TV, Echo Show, Ring), registro de investigación, metodología, hardware, timeline y trabajo de pentesting. Para actualizar el mensaje del sitio se edita ese archivo, no el HTML.

Reglas al tocar ese contenido:

- **Aquí no se publica ninguna vulnerabilidad.** Ni la clase de bug, ni la superficie concreta donde apareció, ni el impacto. Los reportes siguen divulgación coordinada; si algún día uno se hace público, se publica como writeup, no ampliando el registro.
- **Nada de dinero.** Ni cifras de recompensa, ni totales, ni por hallazgo. El estado de un reporte se expresa con una etiqueta (`Bounty`, `Aceptado`, `Reportado`, `En curso`) y ahí se acaba.
- `identity.standing` ("Top hacker · Amazon Devices") es el **texto de reserva** de la insignia; la posición real la pone `Standing.astro` desde `/api/rank`. Ver **Posición en HackerOne** más abajo.
- `researchLog` dice **qué hice y en qué estado quedó**, nunca qué encontré. Una entrada es como mucho "Investigación en dispositivo Amazon" más su plataforma y su estado.
- Cuidado con los cruces: `platforms[].surfaces` se mantiene en categorías amplias porque la lista de funcionalidades concretas, junto al registro, sería un mapa de dónde mirar.
- **Nunca inventar** CVEs, recompensas, severidades, impactos ni vulnerabilidades. Solo entra lo que el autor ha confirmado.
- El pentesting es trabajo profesional **secundario**; la identidad principal es security research. Las clases de vulnerabilidad de `pentesting.findings` sí son públicas: describen el servicio, no la investigación privada.
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

### Interacción y movimiento

`BaseLayout` marca `<html class="js">` con un script inline **y vuelve a ponerlo en `astro:after-swap`**: ViewTransitions reescribe los atributos de `<html>` en cada navegación. Toda regla que oculte algo para animarlo después cuelga de `.js`, así que sin JavaScript el sitio se ve completo. Si añades un efecto que oculta contenido, respeta esa condición.

`src/components/Motion.astro` (cargado una vez desde `BaseLayout`) implementa cuatro contratos por atributo, más la barra de lectura:

| Atributo | Efecto |
| --- | --- |
| `data-reveal` | Aparece al entrar en pantalla; `--reveal-delay` escalona una lista |
| `data-spotlight` | Foco de puntero sobre la tarjeta: escribe `--px` / `--py` |
| `data-scramble` | El texto se descifra al entrar en pantalla |
| `data-count` | El número cuenta hacia arriba (respeta prefijo y sufijo del texto) |
| `.read-progress` | Barra de progreso; `BaseLayout` la pinta solo con `type="article"` |

Los listeners de documento se enlazan al evaluar el módulo (una vez) y el escaneo del DOM se repite en `astro:page-load`; las animaciones avanzan con `Date.now()` y `setTimeout`, no con `requestAnimationFrame`, para que una pestaña en segundo plano no deje el texto cifrado a medias. Con `prefers-reduced-motion` no se anima nada.

`CommandPalette.astro` es la navegación por teclado (`Ctrl/⌘ + K` o `/`). Pinta sus elementos en el HTML y el filtro solo los oculta. Cualquier elemento con `data-palette-open` la abre.

`Terminal.astro` (solo en la home) trae el arranque ya escrito en el HTML y, con JavaScript, lo teclea y añade un prompt real. Los datos de los comandos salen de `src/data/research.ts` serializados a un `<script type="application/json">`, para no duplicar contenido. Al añadir un comando, acuérdate de `help`.

**Ojo con los estilos scoped**: los nodos que crea el JavaScript no llevan el atributo `data-astro-cid-*`, así que en `Terminal.astro` las líneas de salida se estilan como `.term-log :global(.out)`. Cualquier estilo para markup generado en cliente necesita ese `:global()`.

## Reacciones

Cada entrada (blog y writeups) lleva cuatro reacciones con contador, sin comentarios. Es lo único del sitio que no es estático.

- **UI**: `src/components/Reactions.astro`, montado al final de `blog/[slug].astro` y `writeups/[slug].astro`.
- **API**: `worker/index.js`, ruta `/api/reactions`. El resto de peticiones las sigue sirviendo el enrutador de assets de Cloudflare; el worker solo responde lo que no es un archivo de `dist/` (y en ese caso devuelve la 404 del propio sitio).
- **Datos**: Cloudflare D1, tablas en `migrations/0001_reactions.sql`.

La clave de cada entrada es **la ruta publicada** (`/es/blog/<slug>`), no el nombre del archivo. Al renombrar un `.md` cambia la URL y las reacciones acumuladas quedan huérfanas.

Reglas del endpoint:

- `GET /api/reactions?entry=…` devuelve `{ counts, you }`; `you` es la reacción de quien pregunta.
- `POST` alterna: la misma reacción otra vez la quita, otra distinta sustituye a la anterior. Una persona, una reacción por entrada.
- El votante es un hash con sal de IP + user agent (`REACTIONS_SALT`, opcional). **No se guarda ninguna IP.** Dos personas tras la misma IP y navegador cuentan como una: es un contador, no una urna.
- El worker valida la forma de `entry` y además comprueba con el binding `ASSETS` que la página exista de verdad, para que nadie cree filas de entradas inventadas.
- Los tipos válidos son `up`, `fire`, `mind`, `heart`, en el worker y en el componente. Si añades uno, tócalo en los dos sitios.

Alta de la base (una sola vez, requiere cuenta de Cloudflare):

```bash
npm run db:create          # devuelve el database_id
# pega ese id en wrangler.jsonc (hoy: PENDIENTE_PEGAR_ID_DE_wrangler_d1_create)
npm run db:migrate:local   # crea las tablas para wrangler dev
npm run db:migrate         # crea las tablas en producción
```

Si `env.DB` no está configurado, la API responde 503 y **el bloque de reacciones se oculta solo**: el sitio nunca muestra un contador roto. El componente arranca con `hidden` y solo se descubre cuando la API contesta.

Cuidado con el patrón de doble arranque: el `setup` marca `data-ready` **antes** del primer `await`. Como la función corre dos veces (carga directa y `astro:page-load`), marcarlo después engancha dos listeners y cada clic manda dos votos que se anulan entre sí.

## Posición en HackerOne

La insignia del programa de bug bounty se actualiza sola. El HTML sale siempre con el texto genérico de `identity.standing` y, si la API responde, `src/components/Standing.astro` lo sustituye por la posición real ("Top 11 · Amazon Devices") y añade el detalle en el `title`.

- **Origen**: la tabla pública de agradecimientos del programa (`hackerone.com/amazonvrp-devices/thanks`). Esa página es un shell de JavaScript, así que el worker consulta el mismo **GraphQL** que usa la web de HackerOne (`POST https://hackerone.com/graphql`, campo `team.thanks_items`).
- **Ojo**: ese endpoint **no es una API documentada** y puede cambiar o cerrarse sin aviso. `refreshRank()` no lanza nunca: si falla, se conserva el último valor bueno y, si no hay ninguno, la insignia se queda con el texto del HTML. Nada del sitio depende de que funcione.
- **Cron**: `triggers.crons` en `wrangler.jsonc`, una vez al día (06:20 UTC). El `scheduled` del worker es el único escritor habitual.
- **Lecturas**: `GET /api/rank` sirve lo que hay en D1. Solo consulta en caliente cuando **no hay ninguna fila** (primer arranque); si el dato pasa de 24 h, se devuelve igual y el refresco se manda a segundo plano con `waitUntil`.
- **Configuración**: `HACKERONE_PROGRAM` y `HACKERONE_USERNAME` en `vars` de `wrangler.jsonc`. Cambiar de programa no toca código.
- **Datos**: tabla `hackerone_rank` en `migrations/0002_hackerone_rank.sql`, una fila por programa.

Para probarlo en local: `npx wrangler dev --test-scheduled` y `curl "http://localhost:8788/__scheduled?cron=20+6+*+*+*"` dispara el refresco a mano.

## Servicios externos

- **Formulario de contacto**: FormSubmit.co vía `fetch` a `https://formsubmit.co/ajax/<token>` (`src/pages/es/contact.astro`), con fallback al `action` del `<form>`. No usa Netlify Forms.
- **Analytics**: beacon de Cloudflare Web Analytics hardcodeado en `BaseHead.astro`, más un script de Plausible condicionado a `PUBLIC_ANALYTICS_ID`.
- **Despliegue**: Cloudflare vía `wrangler.jsonc` (assets desde `./dist`).

## SEO

Las **tarjetas sociales se generan en build**: `src/pages/og/[...slug].png.ts` emite un PNG por entrada publicada y por página fija, dibujando el SVG de `src/utils/og.ts` y rasterizándolo con `sharp` (Astro ya lo trae; no hay dependencia nueva). Cada página pasa su `image` a `BaseLayout`.

Dos cosas al tocarlo:

- El ancho del texto se **estima** (`perChar = size * 0.64`, medido sobre DejaVu Sans Bold) porque no hay motor de layout. Si cambias el tipo o el tamaño, comprueba que el título no se salga del panel.
- Las fuentes son las del sistema donde se compila. Se piden por familia concreta con alternativas; en una máquina sin DejaVu el resultado cambia.

`BaseHead.astro` emite canonical, Open Graph, Twitter Card, keywords y **JSON-LD**: siempre un `Person` (rol, `knowsAbout`, `sameAs`) y, cuando la página pasa `publishedDate`, un `BlogPosting`. Las páginas de detalle deben pasar `type="article"`, `publishedDate` y `tags` a `BaseLayout`. El feed vive en `src/pages/es/rss.xml.ts`.

**Pendiente conocido** (ahora importa más: la URL de `og:image` es absoluta, así que con el placeholder ningún crawler carga las tarjetas): `site` en `astro.config.mjs` sigue siendo el placeholder `https://c0l1nr00t.netlify.app` — decisión explícita del autor de dejarlo por ahora. Es lo que se emite en canonical, sitemap, Open Graph y JSON-LD, así que hay que cambiarlo cuando exista dominio propio (también aparece como fallback en `rss.xml.ts`).

`docs/deploy.md` describe un estado anterior (Netlify Forms y despliegue en Netlify); el proyecto usa Cloudflare + FormSubmit.

## Idioma

Todo el contenido, la UI y los commits están en español. Escribe textos visibles y documentación en español, con acentuación correcta.
