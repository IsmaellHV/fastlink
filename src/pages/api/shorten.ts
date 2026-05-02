import type { APIRoute } from 'astro';
import { createShortLink } from '~/lib/backend';

export const prerender = false;

const isHttpUrl = (s: string): boolean => {
  try {
    const u = new URL(s);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export const POST: APIRoute = async ({ request }) => {
  let body: { originalLink?: string; captcha?: string } = {};
  try {
    body = await request.json();
  } catch {
    return json({ error: true, message: 'Invalid JSON body' }, 400);
  }

  const originalLink = (body.originalLink || '').trim();
  const captcha = (body.captcha || '').trim();

  if (!originalLink || !isHttpUrl(originalLink)) {
    return json({ error: true, message: 'Invalid URL' }, 400);
  }
  if (originalLink.length > 2048) {
    return json({ error: true, message: 'URL too long (max 2048 chars)' }, 400);
  }
  if (!captcha) {
    return json({ error: true, message: 'Captcha required' }, 400);
  }

  const result = await createShortLink(originalLink, captcha);
  if ('error' in result) {
    return json({ error: true, message: result.message }, result.status);
  }
  return json(result, 200);
};
