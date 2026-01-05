---
title: "Testing"
description: "Writeup de la máquina Retired de HackTheBox."
date: 2023-09-20
platform: "HTB"
category: "web"
difficulty: "medium"
status: "published"
tags: ["sqli", "lfi", "linux"]
target: "10.10.10.123"
visible: false
---

## Reconocimiento

Empezamos con un escaneo de Nmap.

```bash
nmap -sC -sV 10.10.10.123
```

## Explotación

Encontramos una vulnerabilidad de SQL Injection en el login.

Payload: `' OR 1=1 -- -`

## Escalada de Privilegios

El usuario corre un script como root...
