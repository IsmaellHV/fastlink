export const languages = {
  en: 'English',
  es: 'Español',
} as const;

export const defaultLang = 'en' as const;

export type Lang = keyof typeof languages;

export const ui = {
  en: {
    'nav.about': 'About',
    'nav.github': 'GitHub',
    'nav.toggleTheme': 'Toggle theme',
    'nav.toggleLang': 'Switch language',

    'home.metaTitle': 'FastLink — Free, fast, privacy-friendly URL shortener',
    'home.metaDescription':
      'Shorten any long URL into a short link in seconds. No tracking by default, captcha-protected, free forever.',
    'home.heroPre': 'Shorten URLs',
    'home.heroAccent': 'fast',
    'home.heroDot': '.',
    'home.heroLead':
      'Free URL shortener with captcha protection. Paste a long link, get a short one. That’s it.',

    'home.whyTitle': 'Why FastLink',
    'home.whyFastTitle': 'Fast',
    'home.whyFastBody': 'Paste a URL, get a short link. No friction, no waiting.',
    'home.whyPrivateTitle': 'Private',
    'home.whyPrivateBody': 'No account needed. No tracking pixels. Captcha keeps bots out.',
    'home.whyFreeTitle': 'Free',
    'home.whyFreeBody': 'Free to use, no sign-up, no hidden limits for personal use.',

    'home.faqTitle': 'FAQ',
    'home.faqQ1': 'Is FastLink free?',
    'home.faqA1': 'Yes. FastLink is free for personal use, no sign-up required.',
    'home.faqQ2': 'Do my links expire?',
    'home.faqA2': 'No. Links never expire — once you create one, it works forever.',
    'home.faqQ3': 'Do you track who clicks my links?',
    'home.faqA3': 'We collect minimal aggregate metrics. No personal profile is built.',

    'about.metaTitle': 'About FastLink — fast, free URL shortener',
    'about.metaDescription': 'FastLink is a free, privacy-friendly URL shortener.',
    'about.title': 'About FastLink',
    'about.body1':
      'FastLink is a small, fast and privacy-friendly URL shortener. Paste a long link, get a short one — no account, no tracking pixels, no clutter.',
    'about.body2':
      'Every request is captcha-protected to keep bots and spam out, so the service stays clean and free for everyone.',
    'about.madeBy': 'Made by',

    'footer.tagline': 'FastLink · Free URL shortener',

    'form.label': 'Paste your long URL',
    'form.placeholder': 'https://example.com/very/long/path?query=value',
    'form.cta': 'Shorten',
    'form.ctaLoading': 'Shortening…',
    'form.errInvalidUrl': 'Enter a valid URL starting with http(s)://',
    'form.errCaptcha': 'Please complete the captcha',
    'form.errClipboard': 'Could not copy to clipboard',
    'form.errGeneric': 'Request failed',
    'form.policy':
      'By shortening a URL you agree to our basic acceptable-use policy. Don’t shorten malware, phishing or illegal content.',
    'form.readyTitle': 'Your link is ready!',
    'form.readyLead': 'Share it anywhere. Links never expire.',
    'form.copy': 'Copy',
    'form.copied': 'Copied!',
    'form.original': 'Original:',
    'form.visit': 'Visit link',
    'form.again': 'Shorten another',
  },
  es: {
    'nav.about': 'Acerca',
    'nav.github': 'GitHub',
    'nav.toggleTheme': 'Cambiar tema',
    'nav.toggleLang': 'Cambiar idioma',

    'home.metaTitle': 'FastLink — Acortador de URLs gratis, rápido y privado',
    'home.metaDescription':
      'Acorta cualquier URL larga en segundos. Sin rastreo, protegido por captcha, gratis para siempre.',
    'home.heroPre': 'Acorta URLs',
    'home.heroAccent': 'rápido',
    'home.heroDot': '.',
    'home.heroLead':
      'Acortador de URLs gratis con protección captcha. Pega un enlace largo, obtén uno corto. Así de simple.',

    'home.whyTitle': 'Por qué FastLink',
    'home.whyFastTitle': 'Rápido',
    'home.whyFastBody': 'Pega una URL y obtén un enlace corto. Sin fricción, sin esperas.',
    'home.whyPrivateTitle': 'Privado',
    'home.whyPrivateBody': 'Sin cuenta. Sin píxeles de rastreo. El captcha bloquea bots.',
    'home.whyFreeTitle': 'Gratis',
    'home.whyFreeBody': 'Gratis, sin registro, sin límites ocultos para uso personal.',

    'home.faqTitle': 'Preguntas frecuentes',
    'home.faqQ1': '¿FastLink es gratis?',
    'home.faqA1': 'Sí. FastLink es gratis para uso personal y no requiere registro.',
    'home.faqQ2': '¿Mis enlaces caducan?',
    'home.faqA2': 'No. Los enlaces nunca caducan — una vez creados funcionan para siempre.',
    'home.faqQ3': '¿Rastrean quién hace clic en mis enlaces?',
    'home.faqA3': 'Recopilamos métricas agregadas mínimas. No construimos perfiles personales.',

    'about.metaTitle': 'Acerca de FastLink — acortador de URLs gratis y rápido',
    'about.metaDescription': 'FastLink es un acortador de URLs gratis y respetuoso con la privacidad.',
    'about.title': 'Acerca de FastLink',
    'about.body1':
      'FastLink es un acortador de URLs pequeño, rápido y privado. Pega un enlace largo y obtén uno corto — sin cuenta, sin píxeles de rastreo, sin desorden.',
    'about.body2':
      'Cada petición está protegida por captcha para mantener fuera bots y spam, así el servicio sigue limpio y gratis para todos.',
    'about.madeBy': 'Hecho por',

    'footer.tagline': 'FastLink · Acortador de URLs gratis',

    'form.label': 'Pega tu URL larga',
    'form.placeholder': 'https://ejemplo.com/ruta/muy/larga?param=valor',
    'form.cta': 'Acortar',
    'form.ctaLoading': 'Acortando…',
    'form.errInvalidUrl': 'Ingresa una URL válida que empiece con http(s)://',
    'form.errCaptcha': 'Completa el captcha',
    'form.errClipboard': 'No se pudo copiar al portapapeles',
    'form.errGeneric': 'La petición falló',
    'form.policy':
      'Al acortar una URL aceptas la política básica de uso aceptable. No acortes malware, phishing ni contenido ilegal.',
    'form.readyTitle': '¡Tu enlace está listo!',
    'form.readyLead': 'Compártelo donde quieras. Los enlaces nunca caducan.',
    'form.copy': 'Copiar',
    'form.copied': '¡Copiado!',
    'form.original': 'Original:',
    'form.visit': 'Visitar enlace',
    'form.again': 'Acortar otro',
  },
} as const;

export type UIKey = keyof (typeof ui)['en'];
