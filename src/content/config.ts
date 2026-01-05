import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        // Transform string to Date object
        date: z.coerce.date(),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().default(false),
        cover: z.string().optional(),
        series: z.string().optional(),
        pinned: z.boolean().default(false),
        visible: z.boolean().default(true),
    }),
});

const writeups = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        platform: z.enum(["HTB", "BugBounty", "Crackmyapp", "TryHackMe", "Other"]),
        category: z.enum(["web", "pwn", "reversing", "mobile", "infra", "misc"]),
        difficulty: z.enum(["easy", "medium", "hard", "insane", "n/a"]),
        status: z.enum(["draft", "published", "retired"]),
        tags: z.array(z.string()).default([]),
        series: z.string().optional(),
        target: z.string().optional(),
        program: z.string().optional(),
        repository: z.string().optional(),
        redacted: z.boolean().default(false),
        visible: z.boolean().default(true),
    }),
});

export const collections = { blog, writeups };
