# Guía de Contenido

## Blog Post

Ubicación: `src/content/blog/{es,en}/<slug>.md`

### Frontmatter Template

```yaml
---
title: "Título del Post"
description: "Breve descripción para SEO y listados."
date: 2023-10-27
tags: ["tag1", "tag2"]
draft: false
pinned: false
cover: "/images/blog/mi-post/cover.png" # Opcional
series: "Nombre de la Serie" # Opcional
---
```

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
