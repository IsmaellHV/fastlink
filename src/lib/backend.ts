// Server-only helpers. NEVER import from client components — leaks AUTH_BASIC.

/**
 * Configuracion leida en tiempo de EJECUCION.
 *
 * Con `import.meta.env` sola, Vite sustituye el valor durante el build: la URL
 * del backend quedaba incrustada en dist/ y cambiarla en el contenedor no tenia
 * ningun efecto. Eso dejo el acortador devolviendo 522 aunque la variable ya
 * apuntaba a un backend sano, y obligaba a reconstruir la imagen para cambiar
 * de destino. `import.meta.env` se queda solo como respaldo para `astro dev`,
 * donde Vite carga el .env pero no puebla process.env.
 */
const runtime = (fromProcess: string | undefined, fromBuild: string | undefined): string =>
  (fromProcess ?? '') || (fromBuild ?? '') || '';

const API_URL = runtime(process.env.BACKEND_API_URL, import.meta.env.BACKEND_API_URL);
const SCHEMA = runtime(process.env.BACKEND_API_SCHEMA, import.meta.env.BACKEND_API_SCHEMA) || 'Utilitie';
const ENTITY = runtime(process.env.BACKEND_API_ENTITY, import.meta.env.BACKEND_API_ENTITY) || 'FastLink';
const AUTH_BASIC = runtime(process.env.BACKEND_API_AUTH_BASIC, import.meta.env.BACKEND_API_AUTH_BASIC);
const BACKEND_TIMEOUT_MS = Number(runtime(process.env.BACKEND_TIMEOUT_MS, import.meta.env.BACKEND_TIMEOUT_MS)) || 8000;

/**
 * Traduce el estado del backend a uno que podamos devolver sin peligro.
 *
 * Reenviar el codigo tal cual nos exploto en produccion: el backend contesto a
 * traves de Cloudflare con un 522, nuestra API lo devolvio igual, y Cloudflare
 * al ver *su propio* codigo saliendo del origen sustituyo el JSON por su pagina
 * de error HTML. El navegador recibia "<!DOCTYPE" y el res.json() del formulario
 * moria con "Unexpected token '<'". Los 4xx si son informacion util del backend;
 * cualquier fallo suyo se normaliza a 502.
 */
const safeStatus = (status: number): number => (status >= 400 && status < 500 ? status : 502);

export interface CreateLinkOk {
  shortLink: string;
  originalLink: string;
}

export interface BackendErr {
  error: true;
  errorDescription?: string;
  message?: string;
  status: number;
}

export async function createShortLink(originalLink: string, captcha: string): Promise<CreateLinkOk | BackendErr> {
  if (!API_URL || !AUTH_BASIC) {
    return { error: true, message: 'Backend not configured', status: 500 };
  }

  const url = `${API_URL}/${SCHEMA}/${ENTITY}/createLink/${encodeURIComponent(originalLink)}/${encodeURIComponent(captcha)}`;
  const auth = 'Basic ' + Buffer.from(AUTH_BASIC).toString('base64');

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'GET',
      headers: { Authorization: auth, Accept: 'application/json' },
      // Sin limite, un backend colgado mantenia la peticion abierta hasta que
      // el proxy de delante cortaba: mejor fallar rapido y con un mensaje util.
      signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS),
    });
  } catch (err) {
    const timedOut = (err as Error).name === 'TimeoutError';
    return {
      error: true,
      message: timedOut ? 'Backend timed out' : (err as Error).message || 'Network error',
      status: timedOut ? 504 : 502,
    };
  }

  let body: Record<string, unknown> | null = null;
  try {
    body = (await res.json()) as Record<string, unknown>;
  } catch {
    /* may be empty */
  }

  const bodyStr = (k: string): string | undefined => {
    const v = body?.[k];
    return typeof v === 'string' ? v : undefined;
  };

  if (!res.ok) {
    return {
      error: true,
      errorDescription: bodyStr('errorDescription'),
      message: bodyStr('errorDescription') || bodyStr('message') || `Backend ${res.status}`,
      status: safeStatus(res.status),
    };
  }

  if (!body || typeof body.shortLink !== 'string' || typeof body.originalLink !== 'string') {
    return { error: true, message: 'Malformed response from backend', status: 502 };
  }

  return { shortLink: body.shortLink, originalLink: body.originalLink };
}
