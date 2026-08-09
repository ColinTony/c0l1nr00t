import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { identity } from "../../data/research";

export async function GET(context: APIContext) {
    const posts = await getCollection(
        "blog",
        ({ id, data }) =>
            id.startsWith("es/") && !data.draft && data.visible !== false,
    );

    const sorted = posts.sort(
        (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
    );

    return rss({
        title: `${identity.handle} — Research Log`,
        description: identity.lead,
        site: context.site ?? "https://c0l1nr00t.netlify.app",
        items: sorted.map((post) => ({
            title: post.data.title,
            description: post.data.description,
            pubDate: post.data.date,
            categories: [
                post.data.category,
                ...post.data.tags,
            ].filter(Boolean) as string[],
            link: `/es/blog/${post.slug.split("/")[1]}/`,
        })),
        customData: `<language>es-MX</language>`,
    });
}
