import { ui } from './dict';

export const defaultLang = 'es';
export const languages = {
    es: 'ES',
    en: 'EN',
};

export function getLangFromUrl(url: URL) {
    const [, lang] = url.pathname.split('/');
    if (lang in ui) return lang as keyof typeof ui;
    return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
    return function t(key: keyof typeof ui[typeof defaultLang]) {
        return ui[lang][key] || ui[defaultLang][key];
    }
}

export function getRouteFromUrl(url: URL): string {
    const [, lang, ...rest] = url.pathname.split('/');
    if (lang in ui) {
        return '/' + rest.join('/');
    }
    return url.pathname;
}

// Helper to translate current path to another language
export function translatePath(path: string, lang: string) {
    const parts = path.split('/').filter(Boolean);
    if (parts[0] in ui) {
        parts[0] = lang;
    } else {
        parts.unshift(lang);
    }
    return '/' + parts.join('/');
}
