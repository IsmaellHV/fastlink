import { useRef, useState } from 'react';
import Turnstile, { useTurnstile } from 'react-turnstile';
import { ui, defaultLang, type Lang } from '~/i18n/ui';

interface Props {
  turnstileSiteKey: string;
  lang?: Lang;
}

interface ApiOk {
  shortLink: string;
  originalLink: string;
}
interface ApiErr {
  error: true;
  message: string;
}
type ApiResp = ApiOk | ApiErr;

export default function ShortenerForm({ turnstileSiteKey, lang = defaultLang }: Props) {
  const tr = ui[lang] || ui[defaultLang];

  const [url, setUrl] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [shortLink, setShortLink] = useState('');
  const [originalLink, setOriginalLink] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const turnstile = useTurnstile();
  const inputRef = useRef<HTMLInputElement>(null);

  const validUrl = (s: string): boolean => {
    try {
      const u = new URL(s);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const onSubmit = async (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    setError('');

    if (submitting) return;
    if (!validUrl(url)) {
      setError(tr['form.errInvalidUrl']);
      inputRef.current?.focus();
      return;
    }
    if (!captcha) {
      setError(tr['form.errCaptcha']);
      return;
    }

    setSubmitting(true);
    try {
      const r = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalLink: url, captcha }),
      });
      const data = (await r.json()) as ApiResp;
      if (!r.ok || 'error' in data) {
        throw new Error(('error' in data && data.message) || `${tr['form.errGeneric']} (${r.status})`);
      }
      setShortLink(data.shortLink);
      setOriginalLink(data.originalLink);
      setUrl('');
      setCaptcha('');
      try {
        turnstile?.reset();
      } catch {
        /* noop */
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const onCopy = async () => {
    if (!shortLink) return;
    try {
      await navigator.clipboard.writeText(shortLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError(tr['form.errClipboard']);
    }
  };

  const onReset = () => {
    setShortLink('');
    setOriginalLink('');
    setError('');
  };

  if (shortLink) {
    return (
      <div className="rounded-xl border p-6" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-card)' }}>
        <h2 className="mb-2 text-2xl font-bold">{tr['form.readyTitle']}</h2>
        <p className="mb-4 text-sm" style={{ color: 'var(--color-fg-muted)' }}>
          {tr['form.readyLead']}
        </p>

        <div className="mb-4 flex gap-2">
          <input
            type="text"
            readOnly
            value={shortLink}
            className="flex-1 rounded-md border bg-transparent px-3 py-2 text-sm"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-fg)' }}
            onFocus={(e) => e.target.select()}
          />
          <button
            type="button"
            onClick={onCopy}
            className="rounded-md px-4 py-2 text-sm font-semibold transition"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            {copied ? tr['form.copied'] : tr['form.copy']}
          </button>
        </div>

        <p className="mb-4 break-all text-xs" style={{ color: 'var(--color-fg-muted)' }}>
          {tr['form.original']}&nbsp;
          <a href={originalLink} target="_blank" rel="noreferrer">
            {originalLink}
          </a>
        </p>

        <div className="flex gap-2">
          <a
            href={shortLink}
            target="_blank"
            rel="noreferrer"
            className="flex-1 rounded-md px-4 py-2 text-center text-sm font-semibold no-underline"
            style={{ background: 'var(--color-accent-2)', color: '#fff' }}
          >
            {tr['form.visit']}
          </a>
          <button
            type="button"
            onClick={onReset}
            className="flex-1 rounded-md border px-4 py-2 text-sm"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-fg)' }}
          >
            {tr['form.again']}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-card)' }}
    >
      <label htmlFor="url" className="mb-2 block text-sm font-semibold">
        {tr['form.label']}
      </label>
      <div className="mb-4 flex gap-2">
        <input
          ref={inputRef}
          id="url"
          type="url"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          required
          maxLength={2048}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmit(e);
          }}
          placeholder={tr['form.placeholder']}
          className="flex-1 rounded-md border bg-transparent px-3 py-2 text-sm focus:outline-none"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-fg)' }}
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md px-5 py-2 text-sm font-semibold transition disabled:opacity-60"
          style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
        >
          {submitting ? tr['form.ctaLoading'] : tr['form.cta']}
        </button>
      </div>

      <Turnstile
        sitekey={turnstileSiteKey}
        onVerify={(t) => setCaptcha(t)}
        onExpire={() => setCaptcha('')}
        size="normal"
        action="submit"
        language={lang}
      />

      {error && (
        <p className="mt-3 text-sm" role="alert" style={{ color: '#ff6b6b' }}>
          {error}
        </p>
      )}

      <p className="mt-4 text-xs" style={{ color: 'var(--color-fg-muted)' }}>
        {tr['form.policy']}
      </p>
    </form>
  );
}
