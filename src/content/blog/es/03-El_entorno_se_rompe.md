---
title: "Bitácora 0x03 — El entorno también se rompe"
description: "Cuando la herramienta deja de funcionar y el problema no es el exploit, sino el Kernel. De Docker a Vagrant."
date: 2026-01-07
tags: ["bitácora", "docker", "vagrant", "qemu", "reversing", "laboratorio"]
draft: false
---

## Introducción

Dije que quería fricción real.  
Y la encontré antes de tirar una sola línea de código en el debugger.

Pensé que mi entorno estaba listo.  
Tenía mis Dockerfiles, mis scripts y mi repositorio organizado para aprender Reversing.

Pero hoy, **nada funcionó**.

Y en lugar de estar aprendiendo sobre stack overflows, pasé las últimas horas aprendiendo por qué un Kernel moderno odia ejecutar binarios viejos.

---

## Mi laboratorio (que ya no sirve)

Hasta ayer, mi flujo de trabajo vivía aquí:  
[https://github.com/ColinTony/learn-reversing-like-pro](https://github.com/ColinTony/learn-reversing-like-pro)

Era una configuración de Docker que levantaba un entorno de 32 bits.  
Simple. Rápido.

Pero "de un día para otro", dejó de funcionar.

El error no estaba en mis archivos.  
El error era un mensaje constante: `ptrace-traceme: Function not implemented`.

Intenté arreglarlo:
- Forcé arquitecturas con `linux32` y `setarch`
- Desactivé protecciones de seguridad (`seccomp`, `apparmor`)
- Jugué con `--privileged` hasta lo peligroso

Nada.  
El binario arrancaba, pero no podía depurarlo.

---

## La lección técnica

Aquí fue donde me di de bruces con la realidad de **Docker**:  
Docker no es una máquina virtual. Docker comparte el Kernel del Host.

Mi Host (Kali Linux) tiene un Kernel moderno, endurecido y de 64 bits.  
Mi contenedor quería ser un sistema inseguro de 32 bits de hace 10 años.

El Kernel simplemente dijo: **"No"**.

No importa cuántas banderas le pases a Docker; si el Kernel del host bloquea la syscall `ptrace` para procesos de 32 bits por seguridad, **estás jodido**.

---

## La solución "sucia" vs. La solución real

Descubrí que podía usar **QEMU User Mode**.  
Emular el binario por software y conectar Radare2 a un puerto GDB.

Funcionó.  
Pude ver las instrucciones.

Pero se sentía... **culero**.  
Se sentía artificial.

No quiero emular una traducción de instrucciones.  
Quiero ver cómo el sistema operativo gestiona la memoria de verdad.  
Quiero ver el sistema operativo crashear si lo hago mal.

QEMU es una herramienta increíble (y la usaré para IoT y ARM), pero para aprender la base, necesito algo nativo.

---

## El siguiente paso: Vagrant

Me resistía a usar máquinas virtuales completas por "pesadas".  
Pero entendí que para Reversing de sistemas (Kernel, Browsers, Exploiting nativo), **el aislamiento es rey**.

Docker es para despliegue.  
**Vagrant** es para investigación.

Los "grandes" no usan Docker para depurar el Kernel o WebKit porque necesitan que, si todo explota, solo se reinicie la VM, no su computadora.

Así que toca migrar.

---

## Lo que viene

Voy a dejar de pelear con configuraciones imposibles en Docker.  
No voy a borrar mi repo, pero voy a evolucionarlo.

El plan ahora es:

1.  Aprender a configurar **Vagrant** correctamente.
2.  Levantar una VM con Kernel nativo de 32 bits.
3.  Entender cómo integrar esto en mi flujo sin perder la comodidad de la terminal.

Perdí un día de "hacking", sí.  
Pero gané entendimiento sobre cómo funcionan los syscalls, la virtualización y los límites de mis herramientas.

Montar el laboratorio **también es parte del hackeo**.

Seguimos.

— **c0l1nr00t**