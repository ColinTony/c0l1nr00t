/**
 * Worker del sitio. El HTML lo sigue sirviendo el enrutador de assets de
 * Cloudflare; aquí solo llegan las rutas que no son un archivo de `dist/`.
 *
 * Rutas propias, ambas contra D1:
 *
 *   GET  /api/reactions?entry=/es/blog/<slug>
 *   POST /api/reactions   { "entry": "/es/blog/<slug>", "kind": "up" }
 *   GET  /api/rank        posición en la tabla de HackerOne
 *
 * Además hay un `scheduled` que refresca esa posición una vez al día.
 *
 * El POST alterna: la misma reacción otra vez la quita, y una distinta sustituye
 * a la anterior. Una persona, una reacción por entrada.
 *
 * No se guarda la IP: se guarda un hash con sal de IP + user agent. Sirve para
 * evitar el voto repetido, no para identificar a nadie. Dos personas tras la
 * misma IP y el mismo navegador cuentan como una.
 *
 * Escrito en JavaScript a propósito: el worker no pasa por Vite ni por Astro y
 * así no necesita @cloudflare/workers-types para nada.
 */

const KINDS = ["up", "fire", "mind", "heart"];

/** Solo entradas del sitio, y con forma de slug. */
const ENTRY_RE = /^\/es\/(?:blog|writeups)\/[a-z0-9][a-z0-9_-]{0,80}$/;

const JSON_HEADERS = {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
};

/* Posición en HackerOne. Se puede cambiar sin tocar código con las variables
   HACKERONE_PROGRAM y HACKERONE_USERNAME de wrangler.jsonc. */
const DEFAULT_PROGRAM = "amazonvrp-devices";
const DEFAULT_USERNAME = "c0l1nr00t";
const STALE_AFTER_MS = 24 * 60 * 60 * 1000;
const THANKS_UA = "c0l1nr00t.dev rank checker (+https://github.com/ColinTony/c0l1nr00t)";

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        if (url.pathname === "/api/reactions") {
            return withCors(request, await handleReactions(request, env, url));
        }

        if (url.pathname === "/api/rank") {
            return withCors(request, await handleRank(request, env, ctx));
        }

        // Cualquier otra cosa que no fuese un asset: la 404 del propio sitio.
        const asset = await env.ASSETS.fetch(request);
        if (asset.status !== 404) return asset;

        const notFound = await env.ASSETS.fetch(new URL("/404.html", url));
        return new Response(notFound.body, {
            status: 404,
            headers: notFound.headers,
        });
    },

    /** Cron de wrangler.jsonc: refresca la posición una vez al día. */
    async scheduled(event, env, ctx) {
        ctx.waitUntil(refreshRank(env));
    },
};

/* --- Rutas ------------------------------------------------------------- */

async function handleReactions(request, env, url) {
    if (request.method === "OPTIONS") return new Response(null, { status: 204 });

    if (!env.DB) {
        // Sin base configurada el sitio sigue en pie: el bloque de reacciones
        // simplemente no se muestra.
        return json({ error: "reactions_unavailable" }, 503);
    }

    if (request.method === "GET") {
        const entry = url.searchParams.get("entry") ?? "";
        if (!ENTRY_RE.test(entry)) return json({ error: "bad_entry" }, 400);

        return json(await readState(env, entry, await voterId(request, env)));
    }

    if (request.method === "POST") {
        let body;
        try {
            body = await request.json();
        } catch {
            return json({ error: "bad_json" }, 400);
        }

        const entry = typeof body?.entry === "string" ? body.entry : "";
        const kind = typeof body?.kind === "string" ? body.kind : "";

        if (!ENTRY_RE.test(entry)) return json({ error: "bad_entry" }, 400);
        if (!KINDS.includes(kind)) return json({ error: "bad_kind" }, 400);
        if (!(await entryExists(env, url, entry))) {
            return json({ error: "unknown_entry" }, 404);
        }

        const voter = await voterId(request, env);
        const previous = await env.DB.prepare(
            "SELECT kind FROM reaction_votes WHERE entry = ?1 AND voter = ?2",
        )
            .bind(entry, voter)
            .first();

        await applyVote(env, entry, voter, kind, previous?.kind ?? null);

        return json(await readState(env, entry, voter));
    }

    return json({ error: "method_not_allowed" }, 405);
}

/**
 * Posición en la tabla de agradecimientos del programa.
 *
 * Se sirve siempre lo que hay en la base: la consulta a HackerOne la hace el
 * cron, no la visita. Solo se busca en caliente cuando todavía no hay ninguna
 * fila (primer arranque), y si el dato está viejo se devuelve igual y el
 * refresco se manda a segundo plano.
 */
async function handleRank(request, env, ctx) {
    if (request.method === "OPTIONS") return new Response(null, { status: 204 });
    if (request.method !== "GET") {
        return json({ error: "method_not_allowed" }, 405);
    }
    if (!env.DB) return json({ error: "rank_unavailable" }, 503);

    const program = env.HACKERONE_PROGRAM ?? DEFAULT_PROGRAM;
    let row = await readRank(env, program);

    if (!row) {
        row = await refreshRank(env);
        if (!row) return json({ error: "rank_unavailable" }, 503);
    } else if (Date.now() - row.checked_at > STALE_AFTER_MS) {
        ctx?.waitUntil(refreshRank(env));
    }

    return json({
        program: row.program,
        username: row.username,
        rank: row.rank,
        reputation: row.reputation,
        total: row.total,
        checkedAt: row.checked_at,
    });
}

function readRank(env, program) {
    return env.DB.prepare(
        `SELECT program, username, rank, reputation, total, checked_at
           FROM hackerone_rank WHERE program = ?1`,
    )
        .bind(program)
        .first();
}

/**
 * Consulta la tabla pública del programa y guarda la posición.
 *
 * Se apoya en el mismo GraphQL que usa la web de HackerOne, que no es una API
 * documentada: puede cambiar sin aviso. Por eso nunca lanza — si falla, se
 * queda el último valor bueno y el sitio sigue enseñando su texto de siempre.
 */
async function refreshRank(env) {
    const program = env.HACKERONE_PROGRAM ?? DEFAULT_PROGRAM;
    const username = (env.HACKERONE_USERNAME ?? DEFAULT_USERNAME).toLowerCase();

    try {
        const found = await findInThanks(program, username);
        if (!found) return null;

        const checkedAt = Date.now();
        await env.DB.prepare(
            `INSERT INTO hackerone_rank
                 (program, username, rank, reputation, total, checked_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)
             ON CONFLICT(program) DO UPDATE SET
                 username = ?2, rank = ?3, reputation = ?4,
                 total = ?5, checked_at = ?6`,
        )
            .bind(
                program,
                found.username,
                found.rank,
                found.reputation,
                found.total,
                checkedAt,
            )
            .run();

        return { program, ...found, checked_at: checkedAt };
    } catch {
        return null;
    }
}

/** Pagina la tabla hasta encontrar al usuario. Corta a los 10 bloques. */
async function findInThanks(program, username) {
    const query = `query($handle:String!,$after:String){
        team(handle:$handle){
            thanks_items(first:100, after:$after){
                total_count
                pageInfo{ hasNextPage endCursor }
                edges{ node{ rank reputation user{ username } } }
            }
        }
    }`;

    let after = null;

    for (let page = 0; page < 10; page++) {
        const res = await fetch("https://hackerone.com/graphql", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                accept: "application/json",
                "user-agent": THANKS_UA,
            },
            body: JSON.stringify({ query, variables: { handle: program, after } }),
        });

        if (!res.ok) return null;

        const items = (await res.json())?.data?.team?.thanks_items;
        if (!items) return null;

        for (const edge of items.edges ?? []) {
            const node = edge?.node;
            if (node?.user?.username?.toLowerCase() !== username) continue;

            return {
                username: node.user.username,
                rank: Number(node.rank) || 0,
                reputation: Number(node.reputation) || 0,
                total: Number(items.total_count) || 0,
            };
        }

        if (!items.pageInfo?.hasNextPage) return null;
        after = items.pageInfo.endCursor;
    }

    return null;
}

/* --- Datos -------------------------------------------------------------- */

/** Cuentas de la entrada + qué reaccionó esta persona (si es que reaccionó). */
async function readState(env, entry, voter) {
    const [totals, mine] = await Promise.all([
        env.DB.prepare(
            "SELECT kind, count FROM reaction_counts WHERE entry = ?1",
        )
            .bind(entry)
            .all(),
        env.DB.prepare(
            "SELECT kind FROM reaction_votes WHERE entry = ?1 AND voter = ?2",
        )
            .bind(entry, voter)
            .first(),
    ]);

    const counts = Object.fromEntries(KINDS.map((kind) => [kind, 0]));
    for (const row of totals.results ?? []) {
        if (KINDS.includes(row.kind)) counts[row.kind] = Number(row.count) || 0;
    }

    return { entry, counts, you: mine?.kind ?? null };
}

/**
 * Un `batch` de D1 corre como una transacción: o se aplican el voto y sus
 * contadores, o no se aplica nada.
 */
function applyVote(env, entry, voter, kind, previousKind) {
    const decrement = (target) =>
        env.DB.prepare(
            `UPDATE reaction_counts
                SET count = CASE WHEN count > 0 THEN count - 1 ELSE 0 END
              WHERE entry = ?1 AND kind = ?2`,
        ).bind(entry, target);

    const increment = (target) =>
        env.DB.prepare(
            `INSERT INTO reaction_counts (entry, kind, count) VALUES (?1, ?2, 1)
             ON CONFLICT(entry, kind) DO UPDATE SET count = count + 1`,
        ).bind(entry, target);

    const now = Date.now();

    // Misma reacción otra vez: se retira.
    if (previousKind === kind) {
        return env.DB.batch([
            env.DB.prepare(
                "DELETE FROM reaction_votes WHERE entry = ?1 AND voter = ?2",
            ).bind(entry, voter),
            decrement(kind),
        ]);
    }

    // Cambio de reacción: baja la anterior, sube la nueva.
    if (previousKind) {
        return env.DB.batch([
            env.DB.prepare(
                `UPDATE reaction_votes SET kind = ?3, updated_at = ?4
                  WHERE entry = ?1 AND voter = ?2`,
            ).bind(entry, voter, kind, now),
            decrement(previousKind),
            increment(kind),
        ]);
    }

    // Primera reacción de esta persona en esta entrada.
    return env.DB.batch([
        env.DB.prepare(
            `INSERT INTO reaction_votes (entry, voter, kind, updated_at)
             VALUES (?1, ?2, ?3, ?4)
             ON CONFLICT(entry, voter) DO UPDATE SET kind = ?3, updated_at = ?4`,
        ).bind(entry, voter, kind, now),
        increment(kind),
    ]);
}

/* --- Utilidades ---------------------------------------------------------- */

/** Que la entrada exista de verdad en `dist/`: nada de filas basura. */
async function entryExists(env, url, entry) {
    try {
        const probe = await env.ASSETS.fetch(new URL(`${entry}/`, url));
        return probe.ok;
    } catch {
        return false;
    }
}

async function voterId(request, env) {
    const salt = env.REACTIONS_SALT ?? "c0l1nr00t";
    const ip =
        request.headers.get("cf-connecting-ip") ??
        request.headers.get("x-forwarded-for") ??
        "sin-ip";
    const agent = request.headers.get("user-agent") ?? "sin-agente";

    const digest = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(`${salt}:${ip}:${agent}`),
    );

    return [...new Uint8Array(digest)]
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("")
        .slice(0, 32);
}

function json(data, status = 200) {
    return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

/**
 * En producción todo es del mismo origen y no hace falta CORS. Se abre solo
 * para localhost, que es donde el `astro dev` (4321) llama al worker (8787).
 */
function withCors(request, response) {
    const origin = request.headers.get("origin") ?? "";
    if (!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return response;
    }

    const headers = new Headers(response.headers);
    headers.set("access-control-allow-origin", origin);
    headers.set("access-control-allow-methods", "GET, POST, OPTIONS");
    headers.set("access-control-allow-headers", "content-type");
    headers.set("vary", "origin");

    return new Response(response.body, { status: response.status, headers });
}
