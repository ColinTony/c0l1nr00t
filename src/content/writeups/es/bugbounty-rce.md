---
title: "RCE en Programa Privado"
description: "Cómo logré ejecución remota de código en un programa de Bug Bounty."
date: 2023-12-10
platform: "BugBounty"
category: "web"
difficulty: "insane"
status: "published"
tags: ["rce", "java", "deserialization"]
program: "Private Program"
redacted: true
---

## Resumen

Encontré una vulnerabilidad de deserialización insegura en un endpoint de la API.

## Detalles Técnicos

El endpoint `/api/v1/user/data` aceptaba un objeto serializado en base64.

> [!WARNING]
> Los detalles específicos del payload han sido omitidos.

Pude generar un gadget chain usando `ysoserial`.

## Impacto

Ejecución remota de código (RCE) en el servidor de producción.
