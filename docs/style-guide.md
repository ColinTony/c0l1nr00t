# Guía de Estilo

## Colores

El sistema usa variables CSS definidas en `src/styles/global.css`.

- **Fondo**: `--bg0` (Principal), `--bg1` (Paneles)
- **Acento**: `--accent` (Verde - #2ea043)
- **Secundario**: `--accent2` (Cian - #58a6ff)
- **Texto**: `--text` (#c9d1d9), `--muted` (#8b949e)
- **Estados**: `--warn` (Amarillo), `--danger` (Rojo)

## Tipografía

- **Texto**: Sans-serif (Atkinson Hyperlegible, System UI).
- **Código/UI**: Monospace (ui-monospace, SFMono-Regular, Consolas).

Usa la clase `.mono` para aplicar la fuente monoespaciada a cualquier elemento.

## Componentes

### Botones

```html
<a href="#" class="btn btn-primary mono">Acción Principal</a>
<a href="#" class="btn btn-outline mono">Acción Secundaria</a>
```

### Cards

Usa el componente `Card.astro` o la estructura HTML:

```html
<article class="card">
  <a href="...">
    <h3>Título</h3>
    <p>Descripción</p>
  </a>
</article>
```

### Badges / Tags

```html
<span class="tag">#tagname</span>
<span class="difficulty hard">HARD</span>
```

## Accesibilidad

- Todos los elementos interactivos tienen `:focus-visible` con un outline claro.
- Se respeta `prefers-reduced-motion` desactivando animaciones.
