---
title: "Bitácora 0x04 — La velocidad real del aprendizaje"
description: "Tardar 3 horas en algo de 20 minutos no significa que soy lento. Significa que dejé de confiar ciegamente y empecé a verificar."
date: 2026-01-19
tags: ["bitácora", "assembly", "debugging", "learning", "mindset"]
draft: false
---

## Introducción

Si miras mi historial de comandos de hoy, pensarías que no avancé nada.

Estuve tres horas frente a un binario sencillo. El tipo de ejercicio "Hello World" del Buffer Overflow que cualquier tutorial resuelve en 15 minutos.

Hace un año, me habría frustrado.
Habría pensado: *"Soy lento"*, *"Esto no se me da"*, o *"Ya debería estar explotando cosas más complejas"*.

Pero hoy entiendo algo diferente.

No voy lento porque esté atorado.
Voy lento porque **estoy auditando lo que aprendo**.

---

## La trampa del "Next, Next, Exploit"

Es muy fácil engañarse en esto.
Copias el script de Python, ajustas el offset, lanzas el payload, obtienes la shell.
¡Boom! Hacker.

Pero, ¿realmente entendiste lo que pasó en la memoria? ¿O solo seguiste una receta?

Hoy decidí no buscar la shell.
Hoy decidí sentarme a mirar el **prólogo** y el **epílogo** de la función. Esas instrucciones que siempre ignoramos porque "son código de relleno" del compilador.

Resulta que no son relleno. Son los cimientos.

---

## Ver para creer (literalmente)

Los libros te dicen:
> "El prólogo guarda el Base Pointer anterior y reserva espacio para las variables locales."

Ok, suena lógico. Lo acepto y sigo.

Pero hoy no lo acepté. Hoy abrí el debugger y dije: **"Pruébamelo"**.

Me detuve instrucción por instrucción (`stepi`):

1.  Vi el `push ebp` y miré físicamente cómo el valor de ESP cambiaba en la pila.
2.  Vi el `mov ebp, esp` y comprobé que ambos registros tuvieran la misma dirección exacta.
3.  Vi el `sub esp, 0x20` y calculé si realmente se habían reservado esos 32 bytes o si el compilador había alineado la memoria y me estaba mintiendo.

Y luego, el epílogo.
Ver cómo `leave` deshace todo ese trabajo y cómo `ret` confía ciegamente en lo que haya en el tope del stack para saber a dónde ir.

---

## La satisfacción de la validación

Hay una sensación muy distinta entre:
*"Supongo que esto funciona así"*
y
*"Acabo de ver los bytes moverse y confirmar que funciona así"*.

Me di cuenta de que muchos de mis "huecos" de conocimiento venían de dar por hecho cosas básicas.

Entender el **Stack Frame** no es saberse la definición de memoria.
Es ver cómo se construye y se destruye, y ser capaz de predecir el valor de los registros antes de dar Enter a la siguiente instrucción.

Si no puedo predecir qué va a pasar en el debugger, **entonces no lo entiendo**.

---

## Redefiniendo la velocidad

He aceptado que mi ritmo de aprendizaje ha cambiado.

- **Antes:** Leía 5 artículos en una hora. Retención: 20%.
- **Ahora:** Analizo 5 instrucciones de ensamblador en una hora. Comprensión: 100%.

Parece que voy más lento.
Pero en realidad, estoy construyendo una base tan sólida que cuando las cosas se pongan difíciles (y se pondrán), no tendré que volver atrás a repasar qué hace un `pop`.

---

## Nota mental

No tengas prisa por llegar al exploit.
El exploit es solo la consecuencia de entender el sistema mejor que quien lo programó.

Si te toma toda la tarde entender cómo el sistema operativo limpia el stack al salir de una función, ha sido una tarde productiva.

No estoy perdiendo el tiempo.
Estoy comprobando la realidad.

Seguimos.

— **c0l1nr00t**