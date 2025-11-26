---
title: "HTB: Retired Machine"
description: "Writeup of the Retired machine from HackTheBox."
date: 2023-09-20
platform: "HTB"
category: "web"
difficulty: "medium"
status: "published"
tags: ["sqli", "lfi", "linux"]
target: "10.10.10.123"
---

## Reconnaissance

We start with an Nmap scan.

```bash
nmap -sC -sV 10.10.10.123
```

## Exploitation

We found an SQL Injection vulnerability in the login.

Payload: `' OR 1=1 -- -`

## Privilege Escalation

The user runs a script as root...
