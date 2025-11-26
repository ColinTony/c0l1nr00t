# c0l1nr00t Personal Site

Sitio personal de c0l1nr00t con estética "underground hacker / low-level lab".
Construido con Astro, TypeScript y Markdown.

## Requisitos

- Node.js v18+
- npm

## Instalación

```bash
npm install
```

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

El sitio estará disponible en `http://localhost:4321`.

## Estructura del Proyecto

```text
src/
  components/       # Componentes UI (Header, Card, etc.)
  content/          # Contenido Markdown (Blog, Writeups)
    blog/
      es/           # Posts en Español
      en/           # Posts en Inglés
    writeups/
      es/           # Writeups en Español
      en/           # Writeups en Inglés
  i18n/             # Diccionarios y utilidades de traducción
  layouts/          # Layouts base
  pages/            # Rutas del sitio (/es, /en)
  styles/           # CSS Global
```

## i18n (Internacionalización)

El sitio utiliza un sistema de rutas manual para control total:
- `/es/...` para contenido en Español.
- `/en/...` para contenido en Inglés.
- La raíz `/` redirige a `/es`.

## Cómo publicar contenido

1.  Crea un archivo `.md` en la carpeta correspondiente (`src/content/blog/es`, `src/content/writeups/en`, etc.).
2.  Asegúrate de incluir el frontmatter requerido (ver `docs/content-guide.md`).
3.  ¡Listo! Astro detectará el archivo y lo publicará.

## Analytics

El sitio está preparado para usar Plausible o Umami.
Para activar analytics, define la variable de entorno `PUBLIC_ANALYTICS_ID` en tu archivo `.env` o en el panel de Netlify.

```env
PUBLIC_ANALYTICS_ID=true
```

(El script actual es un placeholder para Plausible, edita `src/components/BaseHead.astro` para cambiar el proveedor).

## Checklist de Aceptación

- [x] Agregar .md crea entrada.
- [x] Drafts ocultos.
- [x] TOC automático.
- [x] Syntax Highlighting.
- [x] Filtros en Writeups.
- [x] i18n funcionando.
- [x] Responsive.
- [x] Netlify Forms.
