---
title: "RCE on Private Program"
description: "How I achieved Remote Code Execution on a Bug Bounty program."
date: 2023-12-10
platform: "BugBounty"
category: "web"
difficulty: "insane"
status: "published"
tags: ["rce", "java", "deserialization"]
program: "Private Program"
redacted: true
---

## Summary

I found an insecure deserialization vulnerability in an API endpoint.

## Technical Details

The endpoint `/api/v1/user/data` accepted a base64 serialized object.

> [!WARNING]
> Specific payload details have been redacted.

I was able to generate a gadget chain using `ysoserial`.

## Impact

Remote Code Execution (RCE) on the production server.
