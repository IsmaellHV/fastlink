// Server-only helpers. NEVER import from client components — leaks AUTH_BASIC.

const API_URL = import.meta.env.BACKEND_API_URL || '';
const SCHEMA = import.meta.env.BACKEND_API_SCHEMA || 'Utilitie';
const ENTITY = import.meta.env.BACKEND_API_ENTITY || 'FastLink';
const AUTH_BASIC = import.meta.env.BACKEND_API_AUTH_BASIC || '';

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
    });
  } catch (err) {
    return { error: true, message: (err as Error).message || 'Network error', status: 502 };
  }

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    /* may be empty */
  }

  if (!res.ok) {
    return {
      error: true,
      errorDescription: body?.errorDescription,
      message: body?.errorDescription || body?.message || `Backend ${res.status}`,
      status: res.status,
    };
  }

  if (!body || typeof body.shortLink !== 'string' || typeof body.originalLink !== 'string') {
    return { error: true, message: 'Malformed response from backend', status: 502 };
  }

  return { shortLink: body.shortLink, originalLink: body.originalLink };
}
