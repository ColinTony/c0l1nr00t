/**
 * Tarjetas sociales generadas en build.
 *
 * Se dibuja un SVG a mano y lo rasteriza `sharp`, que Astro ya trae para
 * optimizar imágenes: sin dependencias nuevas y sin llamadas de red. El
 * resultado imita la ventana de terminal del sitio, así que un link compartido
 * se reconoce antes de leerlo.
 *
 * Las fuentes son las del sistema donde se compila. Se piden por familia
 * concreta con alternativas para que un Linux sin DejaVu no se quede sin
 * dibujar nada.
 */
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;

/* Los mismos tokens de global.css, en literal: aquí no hay CSS que resolver */
const BG = "#0b0f14";
const GRID = "#141c25";
const PANEL = "#0e141b";
const BAR = "#161e28";
const BORDER = "#222c38";
const TEXT_STRONG = "#f2f6fa";
const TEXT_DIM = "#98a4b3";
const TEXT_FAINT = "#6b7785";
const ACCENT = "#3fb950";

const SANS = "DejaVu Sans, Liberation Sans, Arial, sans-serif";
const MONO = "DejaVu Sans Mono, Liberation Mono, Courier New, monospace";

/** Margen del panel dentro del lienzo y respiración interior. */
const INSET = 48;
const PAD = 56;
const BAR_H = 64;

export interface OgCard {
    /** Línea de arriba, en mono y acento. Ej. "> ~/blog · BITÁCORA" */
    kicker: string;
    title: string;
    /** Línea de abajo a la derecha. Ej. "2026-08-14 · 3 min" */
    meta?: string;
}

/**
 * Parte el título en líneas.
 *
 * No hay forma de medir texto sin motor de layout, así que se estima el avance
 * medio del carácter. Es aproximado a propósito: el objetivo es no desbordar,
 * y un par de caracteres de margen no se notan a este tamaño.
 */
function wrap(text: string, size: number, maxWidth: number): string[] {
    // 0.64 salió de medir la caja real de la DejaVu Sans Bold: con 0.56 el
    // título se salía del panel. Va con margen a propósito.
    const perChar = size * 0.64;
    const maxChars = Math.max(8, Math.floor(maxWidth / perChar));
    const lines: string[] = [];
    let line = "";

    for (const word of text.split(/\s+/).filter(Boolean)) {
        const candidate = line ? `${line} ${word}` : word;

        if (candidate.length <= maxChars) {
            line = candidate;
            continue;
        }

        if (line) lines.push(line);

        // Una palabra sola más larga que la caja (una URL, por ejemplo)
        if (word.length > maxChars) {
            let rest = word;
            while (rest.length > maxChars) {
                lines.push(rest.slice(0, maxChars - 1) + "-");
                rest = rest.slice(maxChars - 1);
            }
            line = rest;
        } else {
            line = word;
        }
    }

    if (line) lines.push(line);
    return lines;
}

/** Baja el cuerpo hasta que el título quepa en tres líneas; si no, lo corta. */
function fitTitle(title: string, maxWidth: number) {
    for (const size of [60, 52, 46, 40]) {
        const lines = wrap(title, size, maxWidth);
        if (lines.length <= 3) return { size, lines };
    }

    const size = 40;
    const lines = wrap(title, size, maxWidth).slice(0, 3);
    lines[lines.length - 1] = `${lines[lines.length - 1]}…`;
    return { size, lines };
}

function escapeXml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function buildSvg(card: OgCard) {
    const panelW = WIDTH - INSET * 2;
    const panelH = HEIGHT - INSET * 2;
    const textX = INSET + PAD;
    const maxWidth = panelW - PAD * 2;

    const { size, lines } = fitTitle(card.title, maxWidth);
    const lineHeight = Math.round(size * 1.22);

    // El bloque de título se ancla a la línea inferior y crece hacia arriba,
    // así el pie queda siempre a la misma altura tenga 1 línea o 3.
    const footerY = INSET + panelH - PAD;
    const ruleY = footerY - 46;
    const titleBottom = ruleY - 52;
    const titleTop = titleBottom - (lines.length - 1) * lineHeight;

    const grid: string[] = [];
    for (let x = 0; x <= WIDTH; x += 60) {
        grid.push(`<line x1="${x}" y1="0" x2="${x}" y2="${HEIGHT}"/>`);
    }
    for (let y = 0; y <= HEIGHT; y += 60) {
        grid.push(`<line x1="0" y1="${y}" x2="${WIDTH}" y2="${y}"/>`);
    }

    const titleLines = lines
        .map(
            (line, i) =>
                `<text x="${textX}" y="${titleTop + i * lineHeight}" font-family="${SANS}" font-size="${size}" font-weight="bold" fill="${TEXT_STRONG}">${escapeXml(line)}</text>`,
        )
        .join("");

    const meta = card.meta
        ? `<text x="${INSET + panelW - PAD}" y="${footerY}" text-anchor="end" font-family="${MONO}" font-size="22" fill="${TEXT_FAINT}">${escapeXml(card.meta)}</text>`
        : "";

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}"/>
  <g stroke="${GRID}" stroke-width="1">${grid.join("")}</g>

  <rect x="${INSET}" y="${INSET}" width="${panelW}" height="${panelH}" rx="18"
        fill="${PANEL}" stroke="${BORDER}" stroke-width="1"/>
  <path d="M ${INSET} ${INSET + 18} a 18 18 0 0 1 18 -18 h ${panelW - 36} a 18 18 0 0 1 18 18 v ${BAR_H - 18} h -${panelW} z"
        fill="${BAR}"/>
  <line x1="${INSET}" y1="${INSET + BAR_H}" x2="${INSET + panelW}" y2="${INSET + BAR_H}"
        stroke="${BORDER}" stroke-width="1"/>

  <circle cx="${INSET + 30}" cy="${INSET + BAR_H / 2}" r="6" fill="${BORDER}"/>
  <circle cx="${INSET + 52}" cy="${INSET + BAR_H / 2}" r="6" fill="${BORDER}"/>
  <circle cx="${INSET + 74}" cy="${INSET + BAR_H / 2}" r="6" fill="${ACCENT}"/>
  <text x="${INSET + 104}" y="${INSET + BAR_H / 2 + 7}" font-family="${MONO}" font-size="20" fill="${TEXT_DIM}">c0l1nr00t@lab:~</text>

  <text x="${textX}" y="${INSET + BAR_H + 82}" font-family="${MONO}" font-size="24" fill="${ACCENT}" letter-spacing="2">${escapeXml(card.kicker)}</text>

  ${titleLines}

  <line x1="${textX}" y1="${ruleY}" x2="${textX + 120}" y2="${ruleY}" stroke="${ACCENT}" stroke-width="3"/>

  <text x="${textX}" y="${footerY}" font-family="${MONO}" font-size="22" fill="${TEXT_DIM}">c0l1nr00t · security researcher</text>
  ${meta}
</svg>`;
}

export function renderOg(card: OgCard): Promise<Buffer> {
    return sharp(Buffer.from(buildSvg(card))).png().toBuffer();
}
