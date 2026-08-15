/**
 * Tarjetas sociales de cada página, generadas en build.
 *
 * Una ruta por entrada publicada más las páginas fijas. `BaseHead` ya apuntaba
 * a /og/default.png, que hasta ahora no existía: cada enlace compartido
 * referenciaba una imagen rota.
 *
 * Nada aquí puede salir del frontmatter de otra página: `getStaticPaths` vive
 * en su propio módulo.
 */
import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { renderOg, type OgCard } from "../../utils/og";
import { readingTime } from "../../utils/reading-time";

/** Mismo formato de fecha que usan los listados. */
function isoDate(date: Date) {
    return date.toISOString().split("T")[0];
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths: { params: { slug: string }; props: { card: OgCard } }[] = [];

    const posts = await getCollection(
        "blog",
        ({ id, data }) => id.startsWith("es/") && !data.draft && data.visible !== false,
    );

    for (const post of posts) {
        const slug = post.slug.split("/")[1];
        const kicker = post.data.category
            ? `> ~/blog · ${post.data.category.toUpperCase()}`
            : "> ~/blog";

        paths.push({
            params: { slug: `blog-${slug}` },
            props: {
                card: {
                    kicker,
                    title: post.data.title,
                    meta: `${isoDate(post.data.date)} · ${readingTime(post.body)}`,
                },
            },
        });
    }

    const writeups = await getCollection(
        "writeups",
        ({ id, data }) =>
            id.startsWith("es/") && data.status !== "draft" && data.visible !== false,
    );

    for (const writeup of writeups) {
        const slug = writeup.slug.split("/")[1];

        paths.push({
            params: { slug: `writeup-${slug}` },
            props: {
                card: {
                    kicker: `> ~/writeups · ${writeup.data.platform.toUpperCase()}`,
                    title: writeup.data.title,
                    meta: isoDate(writeup.data.date),
                },
            },
        });
    }

    const fixed: Record<string, OgCard> = {
        default: {
            kicker: "> ~/",
            title: "I break browsers, devices and weird attack surfaces to understand how they work.",
        },
        home: {
            kicker: "> ~/",
            title: "Security research en dispositivos Amazon, browsers embebidos y superficies raras.",
        },
        research: {
            kicker: "> ~/research",
            title: "Kindle, Fire TV, Echo Show y Ring: plataformas, metodología y laboratorio.",
        },
        blog: {
            kicker: "> ~/blog",
            title: "Research Log: notas de investigación, lab notes y deep dives.",
        },
        writeups: {
            kicker: "> ~/writeups",
            title: "Writeups técnicos completos.",
        },
        about: {
            kicker: "> ~/about",
            title: "De web security a device research.",
        },
        contact: {
            kicker: "> ~/contact",
            title: "Contacto.",
        },
    };

    for (const [slug, card] of Object.entries(fixed)) {
        paths.push({ params: { slug }, props: { card } });
    }

    return paths;
};

export const GET: APIRoute = async ({ props }) => {
    const png = await renderOg((props as { card: OgCard }).card);

    return new Response(png, {
        headers: {
            "content-type": "image/png",
            "cache-control": "public, max-age=31536000, immutable",
        },
    });
};
