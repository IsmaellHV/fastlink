import { ui, defaultLang, type Lang, type UIKey } from './ui';

export const isLang = (v: string): v is Lang => v === 'en' || v === 'es';

export function getLangFromUrl(url: URL): Lang {
  const [, seg] = url.pathname.split('/');
  if (isLang(seg)) return seg;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

// Build the equivalent URL in the other locale.
// "/about" + "es" -> "/es/about"
// "/es/about" + "en" -> "/about"
export function localizePath(pathname: string, target: Lang): string {
  const stripped = pathname.replace(/^\/(en|es)(\/|$)/, '/');
  if (target === defaultLang) return stripped;
  return `/${target}${stripped === '/' ? '' : stripped}` || '/';
}
