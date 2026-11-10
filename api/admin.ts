/**
 * /api/admin?action=…  — the only endpoint behind the /admin dashboard (one function on purpose: Vercel counts
 * every file in /api against the plan's function limit).
 *
 *   GET  session            who am I?
 *   POST login              { email, password }
 *   POST logout
 *   GET  config             { draft, published, dirty }
 *   POST save-draft         { config }
 *   POST publish            draft → live (the previous live version is backed up first)
 *   POST discard-draft      draft ← live
 *   GET  backups            list of previous live versions
 *   POST restore            { id } → loads a backup into the draft (publish it to make it live)
 *   POST sign-upload        { folder } → signed params for a direct browser → Cloudinary image upload
 *   GET  media              ?folder=assem&cursor=…
 */
import {
  BACKUP_PREFIX,
  DRAFT_ID,
  MAX_BACKUPS,
  PUBLISHED_ID,
  deleteRaw,
  getCreds,
  listImages,
  listRaw,
  readRawJson,
  signUpload,
  writeRawJson,
} from './_lib/cloudinary';
import {
  adminConfigured,
  checkCredentials,
  clearSessionCookie,
  createSessionCookie,
  isLocked,
  readSession,
  recordFailure,
  recordSuccess,
} from './_lib/auth';

type Req = { method?: string; url?: string; headers: Record<string, string | string[] | undefined>; body?: unknown };
type Res = {
  setHeader: (name: string, value: string | string[]) => void;
  status: (code: number) => { json: (data: unknown) => void };
};

const MAX_CONFIG_BYTES = 1_500_000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const header = (req: Req, name: string) => {
  const v = req.headers[name];
  return Array.isArray(v) ? v[0] : v ?? '';
};
const parseBody = (body: unknown): Record<string, any> => {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return (body ?? {}) as Record<string, any>;
};

/** A config is accepted only if it has the structure the site relies on. */
function validateConfig(c: any): string | null {
  if (!c || typeof c !== 'object' || Array.isArray(c)) return 'Config must be an object.';
  if (JSON.stringify(c).length > MAX_CONFIG_BYTES) return 'Config is too large.';
  if (!Array.isArray(c.sections) || c.sections.some((s: any) => !s || typeof s.type !== 'string' || typeof s.visible !== 'boolean'))
    return 'Invalid sections list.';
  if (!c.site || !c.contact || !c.navbar || !c.ctas || !c.content || !c.footer) return 'Missing required parts of the config.';
  if (!/^\d{8,15}$/.test(String(c.contact.whatsapp ?? ''))) return 'WhatsApp number must be digits only (with country code).';
  const items = c.content?.packages?.items;
  if (!Array.isArray(items) || items.some((p: any) => !p?.id || !(Number(p.priceNumeric) > 0)))
    return 'Every package needs an id and a price greater than zero.';
  return null;
}

export default async function handler(req: Req, res: Res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');

  const url = new URL(req.url ?? '/', 'http://local');
  const action = url.searchParams.get('action') ?? '';
  const method = (req.method ?? 'GET').toUpperCase();
  const host = header(req, 'host');
  const secure = header(req, 'x-forwarded-proto') === 'https' || (!!host && !/^(localhost|127\.0\.0\.1)/.test(host));
  const ip = header(req, 'x-forwarded-for').split(',')[0].trim() || 'unknown';

  try {
    if (!adminConfigured()) {
      return res.status(503).json({ error: 'Admin is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD on the server.' });
    }

    // ── public: session / login / logout ─────────────────────────────────────────
    if (action === 'session' && method === 'GET') {
      const s = readSession(req.headers);
      return res.status(200).json({ authenticated: Boolean(s), email: s?.email ?? null, cloudinary: Boolean(getCreds()) });
    }

    if (action === 'login' && method === 'POST') {
      const locked = isLocked(ip);
      if (locked) return res.status(429).json({ error: `Too many attempts. Try again in ${locked} minutes.` });
      const { email = '', password = '' } = parseBody(req.body);
      if (checkCredentials(String(email), String(password))) {
        recordSuccess(ip);
        res.setHeader('Set-Cookie', createSessionCookie(String(email).trim().toLowerCase(), secure));
        return res.status(200).json({ ok: true });
      }
      recordFailure(ip);
      await sleep(700); // slow down guessing
      return res.status(401).json({ error: 'Wrong email or password.' });
    }

    // ── everything below needs a session ─────────────────────────────────────────
    const session = readSession(req.headers);
    if (!session) return res.status(401).json({ error: 'Not signed in.' });
    if (method !== 'GET' && header(req, 'x-requested-with') !== 'admin') {
      return res.status(403).json({ error: 'Bad request origin.' });
    }
    if (!getCreds()) return res.status(503).json({ error: 'Cloudinary is not configured on the server.' });

    switch (action) {
      case 'logout': {
        res.setHeader('Set-Cookie', clearSessionCookie(secure));
        return res.status(200).json({ ok: true });
      }

      case 'config': {
        const [draft, published] = await Promise.all([readRawJson(DRAFT_ID), readRawJson(PUBLISHED_ID)]);
        const dirty = draft ? JSON.stringify(draft.data) !== JSON.stringify(published?.data ?? null) : false;
        return res.status(200).json({
          draft: draft?.data ?? null,
          published: published?.data ?? null,
          draftVersion: draft?.version ?? null,
          publishedVersion: published?.version ?? null,
          dirty,
        });
      }

      case 'save-draft': {
        const { config } = parseBody(req.body);
        const problem = validateConfig(config);
        if (problem) return res.status(400).json({ error: problem });
        const version = await writeRawJson(DRAFT_ID, config);
        return res.status(200).json({ ok: true, version });
      }

      case 'publish': {
        const draft = await readRawJson<any>(DRAFT_ID);
        if (!draft) return res.status(400).json({ error: 'Nothing to publish: save a draft first.' });
        const problem = validateConfig(draft.data);
        if (problem) return res.status(400).json({ error: problem });
        const current = await readRawJson(PUBLISHED_ID);
        if (current) {
          const stamp = new Date().toISOString().replace(/[:.]/g, '-');
          await writeRawJson(`${BACKUP_PREFIX}site-config-${stamp}.json`, current.data);
        }
        const version = await writeRawJson(PUBLISHED_ID, draft.data);
        // keep only the newest backups
        const backups = await listRaw(BACKUP_PREFIX, 200);
        await deleteRaw(backups.slice(MAX_BACKUPS).map((b) => b.public_id));
        return res.status(200).json({ ok: true, version });
      }

      case 'discard-draft': {
        const live = await readRawJson(PUBLISHED_ID);
        if (live) await writeRawJson(DRAFT_ID, live.data);
        else await deleteRaw([DRAFT_ID]);
        return res.status(200).json({ ok: true });
      }

      case 'backups': {
        const list = await listRaw(BACKUP_PREFIX, 100);
        return res.status(200).json({
          backups: list.map((b) => ({ id: b.public_id, createdAt: b.created_at, bytes: b.bytes })),
        });
      }

      case 'restore': {
        const { id } = parseBody(req.body);
        if (typeof id !== 'string' || !id.startsWith(BACKUP_PREFIX) || id.includes('..'))
          return res.status(400).json({ error: 'Invalid backup id.' });
        const backup = await readRawJson(id);
        if (!backup) return res.status(404).json({ error: 'Backup not found.' });
        await writeRawJson(DRAFT_ID, backup.data);
        return res.status(200).json({ ok: true });
      }

      case 'sign-upload': {
        const { folder } = parseBody(req.body);
        const f = String(folder ?? 'assem/sections');
        if (!/^assem(\/[A-Za-z0-9_-]+){0,3}$/.test(f)) return res.status(400).json({ error: 'Invalid folder.' });
        return res.status(200).json(signUpload(f));
      }

      case 'media': {
        const folder = url.searchParams.get('folder') ?? 'assem';
        if (!/^assem(\/[A-Za-z0-9_-]+){0,3}$/.test(folder)) return res.status(400).json({ error: 'Invalid folder.' });
        return res.status(200).json(await listImages(folder, url.searchParams.get('cursor') ?? undefined));
      }

      default:
        return res.status(404).json({ error: 'Unknown action.' });
    }
  } catch (error) {
    console.error('[api/admin]', action, error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Server error.' });
  }
}
