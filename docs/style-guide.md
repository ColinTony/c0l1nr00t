# Guía de Estilo

Sistema de diseño en `src/styles/global.css`. Terminal oscura, sobria y legible:
un solo acento, sin glows decorativos, tipografía y espaciado por escala.

## Principios

1. **Un acento manda.** El verde (`--accent`) marca lo interactivo y lo activo. El
   resto de colores son semánticos (`--warn`, `--danger`, `--purple` para
   dificultades) o de enlace (`--link`). No se usan como decoración.
2. **La jerarquía es de tamaño y peso, no de brillo.** Nada de `text-shadow` para
   destacar; se destaca con contraste de color de texto y escala tipográfica.
3. **Sin valores mágicos.** Todo espaciado, tamaño, radio y duración sale de un
   token. Si hace falta un valor nuevo, se añade al sistema.
4. **La mono es señal.** `--font-mono` marca metadatos, rutas, etiquetas y estados
   (lo "de máquina"); la sans es para leer.

## Tokens

| Grupo | Tokens |
| --- | --- |
| Superficies | `--bg`, `--bg-soft`, `--surface`, `--surface-2`, `--surface-3` |
| Bordes | `--border`, `--border-strong` |
| Texto | `--text-strong`, `--text`, `--text-dim`, `--text-faint` |
| Acento | `--accent`, `--accent-strong`, `--accent-soft`, `--accent-line` |
| Semánticos | `--link`, `--link-hover`, `--warn`, `--danger`, `--purple` |
| Tipografía | `--fs-xs` … `--fs-3xl`, `--lh-tight/snug/body`, `--tracking-wide/wider` |
| Espaciado | `--sp-1` … `--sp-9`, `--sp-section` |
| Forma | `--radius-sm`, `--radius`, `--radius-lg`, `--radius-pill` |
| Profundidad | `--shadow-sm`, `--shadow`, `--shadow-lg` |
| Movimiento | `--dur`, `--ease` |
| Medidas | `--measure` (68ch de lectura), `--container`, `--container-narrow`, `--header-h` |

Los nombres antiguos (`--bg0`, `--muted`, `--accent2`, `--neon-green`…) siguen
existiendo como alias al final del bloque `:root`, solo por compatibilidad. En
código nuevo usa los tokens de la tabla.

## Componentes globales

```html
<!-- Botones -->
<a class="btn btn-primary">acción principal</a>
<a class="btn btn-outline">acción secundaria</a>
<button class="btn btn-ghost btn-sm">terciaria</button>

<!-- Encabezado de página -->
<header class="page-header">
  <p class="eyebrow">&gt; ~/blog</p>
  <h1>Blog</h1>
  <p class="lead">Subtítulo de una línea.</p>
</header>

<!-- Título de sección (con línea de continuación) -->
<h2 class="section-title">Últimos posts</h2>

<!-- Panel -->
<section class="panel">
  <div class="panel-header"><span>01_BIO_DATA</span></div>
  <div class="panel-content">…</div>
</section>

<!-- Metadatos -->
<span class="chip">#tag</span>
<span class="badge">Status: Active</span>
<span class="difficulty hard">hard</span>

<!-- Estado vacío -->
<p class="empty-state"><strong>WRITEUPS: 0</strong>Nada publicado todavía.</p>

<!-- Ventana de terminal -->
<div class="terminal">
  <div class="terminal-bar">
    <span class="dot"></span><span class="dot"></span><span class="dot is-live"></span>
    <span class="terminal-title">archivo.sh</span>
  </div>
  <div class="terminal-body">
    <p><span class="prompt">➜</span> comando</p>
    <p><span class="caret"></span></p>
  </div>
</div>
```

Contenedores: `.container` (1140px), `.container-narrow` (820px), `.section`
(padding vertical grande), `.section-sm`. Rejilla de tarjetas: `.grid-cards`.

## Prosa

Todo el Markdown renderizado va dentro de `<div class="prose">`. Los estilos de
titulares, listas, código, citas, imágenes y tablas viven en `global.css` — no
los redefinas por página. El ancho de lectura está fijado en `--measure` (68ch).

## Componentes Astro

- `Card.astro` — tarjeta para writeups y rejillas (título, fecha, plataforma,
  dificultad, tags).
- `PostRow.astro` — fila de listado editorial para el blog (fecha + tiempo de
  lectura a un lado, título y descripción al otro).
- `Header.astro` — marca el enlace activo con `aria-current="page"`.
- `Terminal.astro` — terminal interactiva de la home (arranque tecleado + prompt).
- `CommandPalette.astro` — navegación por teclado, `Ctrl/⌘ + K` o `/`.
- `Motion.astro` — capa de movimiento común, cargada desde `BaseLayout`.
- `Reactions.astro` — reacciones al pie de cada entrada. Nace con `hidden` y solo
  aparece si la API responde: nunca deja un contador roto a la vista.

## Movimiento

Transiciones de `--dur` (160 ms) sobre color, borde y desplazamientos de 2-3 px.
Nada de escalados ni sombras animadas. La entrada de página usa `.fade-in`, y
todo queda anulado bajo `prefers-reduced-motion: reduce`.

Los efectos que dependen de JavaScript se piden por atributo y los resuelve
`Motion.astro`:

| Atributo | Efecto |
| --- | --- |
| `data-reveal` | Aparece al entrar en pantalla (`--reveal-delay` escalona) |
| `data-spotlight` | Foco de puntero sobre la tarjeta |
| `data-scramble` | El texto se descifra al entrar en pantalla |
| `data-count` | El número cuenta hacia arriba |

Dos reglas al usarlos:

1. Todo lo que oculte contenido para animarlo cuelga de `.js` (la pone
   `BaseLayout`), para que sin JavaScript el sitio se vea entero.
2. `data-spotlight` necesita que el elemento tenga fondo y borde propios: el
   foco se pinta en un `::after` que hereda su `border-radius`.

Un ciclo (`.loop`) enciende sus pasos por turnos con `--i` como índice y
`loop-pulse` como animación; se repite en la home, en research y en about.

## Accesibilidad

- `:focus-visible` global con outline de acento a 2 px.
- Enlace "Saltar al contenido" al inicio del `body`.
- Etiquetas reales (o `.visually-hidden`) en todos los campos de formulario.
- Texto normal ≥ 7:1 de contraste; `--text-faint` solo para metadatos cortos.
