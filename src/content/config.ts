import { defineCollection, z } from 'astro:content';

/**
 * Categorías del blog. Solo aparecen en la navegación las que tienen entradas,
 * así que la lista puede crecer sin dejar secciones vacías.
 */
export const BLOG_CATEGORIES = [
    "Research",
    "Kindle",
    "Amazon Devices",
    "Fire TV",
    "Echo Show",
    "Ring",
    "Browser Security",
    "Web Security",
    "Fuzzing",
    "Reverse Engineering",
    "Memory Corruption",
    "Hardware",
    "Bug Bounty",
    "Pentesting",
    "AI + Security",
    "Writeups",
    "Bitácora",
] as const;

/** Formato de la entrada, independiente del tema. */
export const POST_TYPES = [
    "Research Notes",
    "Deep Dive",
    "Vulnerability Writeup",
    "Lab Notes",
    "Fuzzing",
    "AI Research Workflow",
    "Lessons Learned",
] as const;

const blog = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        // Transform string to Date object
        date: z.coerce.date(),
        category: z.enum(BLOG_CATEGORIES).optional(),
        type: z.enum(POST_TYPES).optional(),
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
