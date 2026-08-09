# Guía de Contenido

## Blog Post

Ubicación: `src/content/blog/{es,en}/<slug>.md`

### Frontmatter Template

```yaml
---
title: "Título del Post"
description: "Breve descripción para SEO y listados."
date: 2023-10-27
category: "Kindle"          # Tema. Opcional, ver lista abajo
type: "Research Notes"      # Formato. Opcional, ver lista abajo
tags: ["tag1", "tag2"]
draft: false
pinned: false
cover: "/images/blog/mi-post/cover.png" # Opcional
series: "Nombre de la Serie" # Opcional
---
```

### Categorías (`category`)

Tema de la entrada. Cada categoría con al menos una entrada genera su página en
`/es/blog/categoria/<slug>`; las que no tienen contenido no aparecen en ningún
sitio, así que la lista puede crecer sin dejar secciones vacías.

`Research` · `Kindle` · `Amazon Devices` · `Fire TV` · `Echo Show` · `Ring` ·
`Browser Security` · `Web Security` · `Fuzzing` · `Reverse Engineering` ·
`Memory Corruption` · `Hardware` · `Bug Bounty` · `Pentesting` · `AI + Security` ·
`Writeups` · `Bitácora`

### Tipos (`type`)

Formato de la entrada, independiente del tema:

`Research Notes` · `Deep Dive` · `Vulnerability Writeup` · `Lab Notes` ·
`Fuzzing` · `AI Research Workflow` · `Lessons Learned`

La lista viva de ambos campos está en `src/content/config.ts`
(`BLOG_CATEGORIES` y `POST_TYPES`): el build falla si usas un valor que no exista.

### Divulgación

Antes de publicar detalles de una vulnerabilidad, separa lo que ya es público de
lo que sigue bajo divulgación coordinada. Ante la duda, mantenlo genérico. No
inventes CVEs, recompensas, severidades ni impactos.

## Writeup

Ubicación: `src/content/writeups/{es,en}/<slug>.md`

### Frontmatter Template

```yaml
---
title: "HTB: Machine Name"
description: "Writeup de la máquina..."
date: 2023-10-27
platform: "HTB" # HTB, BugBounty, Crackmyapp, TryHackMe, Other
category: "web" # web, pwn, reversing, mobile, infra, misc
difficulty: "medium" # easy, medium, hard, insane, n/a
status: "published" # draft, published, retired
tags: ["sqli", "rce"]
target: "10.10.10.10" # Opcional
program: "HackerOne Program" # Opcional
redacted: false # true para mostrar banner de confidencialidad
---
```

## Imágenes

Guarda las imágenes en `public/images/<tipo>/<slug>/`.
Ejemplo: `public/images/blog/mi-post/screenshot.png`.

En el markdown, úsalas así:

```markdown
![Descripción](/images/blog/mi-post/screenshot.png)
```

## Series

Si agregas la propiedad `series: "Nombre"` en el frontmatter, el post se agrupará visualmente (feature pendiente de implementación visual específica, pero el dato ya existe).
