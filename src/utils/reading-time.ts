const WORDS_PER_MINUTE = 200;

/**
 * Minutos de lectura estimados a partir del cuerpo Markdown crudo.
 * Descarta bloques de código y sintaxis para no inflar la cuenta.
 */
export function readingTime(body: string, label = "min"): string {
    const text = body
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/`[^`]*`/g, " ")
        .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/[#>*_~\-|]/g, " ");

    const words = text.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));

    return `${minutes} ${label}`;
}
