import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_CONFIG, mergeConfig, type SiteConfig } from '../config/siteConfig';
import { AdminApiError, adminCall } from './api';
import { AutoEditor, MediaPickerContext, Toggle } from './fields';
import { CONTENT_KEY, SECTION_NAMES, TABS } from './labels';
import { MediaGrid, MediaPickerModal } from './Media';

const card = 'rounded-xl border border-neutral-800 bg-neutral-900/70';

/** Immutable set at a path. */
function setIn(root: any, path: (string | number)[], value: any): any {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  const copy = Array.isArray(root) ? [...root] : { ...root };
  (copy as any)[head] = setIn((root as any)[head], rest, value);
  return copy;
}
const getIn = (root: any, path: (string | number)[]) => path.reduce((o, k) => o?.[k], root);

// ── sign in ───────────────────────────────────────────────────────────────────────────
const Login: React.FC<{ onDone: () => void; configured: boolean }> = ({ onDone, configured }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      await adminCall('login', { method: 'POST', body: { email, password } });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? (err.message === 'Wrong email or password.' ? 'الإيميل أو كلمة المرور غلط.' : err.message) : 'حصل خطأ');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-canvas px-4">
      <form onSubmit={submit} className={`${card} w-full max-w-sm space-y-4 p-7`}>
        <div>
          <h1 className="text-2xl font-black text-white">لوحة التحكم</h1>
          <p className="mt-1 text-sm text-neutral-400">سجّل الدخول لتعديل الموقع.</p>
        </div>
        {!configured && (
          <p className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-200">
            لوحة التحكم لسه مش مفعّلة على السيرفر: ضيف ADMIN_EMAIL و ADMIN_PASSWORD في إعدادات البيئة (Environment Variables).
          </p>
        )}
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-neutral-300">الإيميل</span>
          <input dir="ltr" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-neutral-700 bg-canvas px-3 py-2.5 text-sm text-white focus:border-brand focus:outline-none" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-neutral-300">كلمة المرور</span>
          <input dir="ltr" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-neutral-700 bg-canvas px-3 py-2.5 text-sm text-white focus:border-brand focus:outline-none" />
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button disabled={busy} className="w-full rounded-md bg-brand py-3 text-sm font-black text-white hover:bg-brand-hover disabled:opacity-60 cursor-pointer">
          {busy ? 'جاري الدخول…' : 'دخول'}
        </button>
      </form>
    </div>
  );
};

// ── sections: order + visibility ───────────────────────────────────────────────────────
const SectionsEditor: React.FC<{ cfg: SiteConfig; setCfg: (c: SiteConfig) => void; goTab: (id: string) => void }> = ({ cfg, setCfg, goTab }) => {
  const list = cfg.sections;
  const update = (next: typeof list) => setCfg({ ...cfg, sections: next });
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    update(next);
  };
  return (
    <div className="space-y-3">
      <p className="text-sm text-neutral-400">رتّب السكاشن بالأسهم، واقفل اللي مش عايزه يظهر. الترتيب ده هو ترتيب الصفحة الرئيسية بالظبط.</p>
      {list.map((s, i) => (
        <div key={s.id} className={`${card} flex items-center gap-3 px-4 py-3 ${s.visible ? '' : 'opacity-55'}`}>
          <span className="w-6 text-center font-mono text-xs text-neutral-500">{i + 1}</span>
          <div className="flex-1">
            <div className="text-sm font-bold text-white">{SECTION_NAMES[s.type] ?? s.type}</div>
            <button type="button" onClick={() => goTab(CONTENT_KEY[s.type] ?? s.type)} className="text-[11px] text-accent hover:underline cursor-pointer">تعديل المحتوى ←</button>
          </div>
          <Toggle on={s.visible} onChange={(v) => update(list.map((x, k) => (k === i ? { ...x, visible: v } : x)))} label={s.visible ? 'ظاهر' : 'مخفي'} />
          <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="h-8 w-8 rounded border border-neutral-700 text-neutral-300 disabled:opacity-30 cursor-pointer" aria-label="فوق">↑</button>
          <button type="button" disabled={i === list.length - 1} onClick={() => move(i, 1)} className="h-8 w-8 rounded border border-neutral-700 text-neutral-300 disabled:opacity-30 cursor-pointer" aria-label="تحت">↓</button>
        </div>
      ))}
      <p className="text-[11px] text-neutral-500">لو خفيت "بدائل الأطعمة" هنا، اخفي كمان رابطها من تبويب "النافبار والأزرار". الصفحة المستقلة /substitutions بتفضل شغالة.</p>
    </div>
  );
};

// ── backups ───────────────────────────────────────────────────────────────────────────
const Backups: React.FC<{ onRestored: () => void; notify: (m: string, bad?: boolean) => void }> = ({ onRestored, notify }) => {
  const [list, setList] = useState<{ id: string; createdAt: string }[] | null>(null);
  useEffect(() => {
    adminCall<{ backups: { id: string; createdAt: string }[] }>('backups').then((d) => setList(d.backups)).catch((e) => notify(e.message, true));
  }, [notify]);
  const restore = async (id: string) => {
    if (!window.confirm('هتحمّل النسخة دي كمسودة (مش هتتنشر لحد ما تدوس "نشر"). تكمل؟')) return;
    try {
      await adminCall('restore', { method: 'POST', body: { id } });
      notify('اتحملت النسخة كمسودة. راجعها وانشرها.');
      onRestored();
    } catch (e) {
      notify(e instanceof Error ? e.message : 'فشل الاسترجاع', true);
    }
  };
  return (
    <div className="space-y-2">
      <p className="text-sm text-neutral-400">في كل مرة تنشر، النسخة الحالية بتتحفظ هنا (آخر 25 نسخة).</p>
      {list === null && <p className="text-sm text-neutral-500">جاري التحميل…</p>}
      {list?.length === 0 && <p className="text-sm text-neutral-500">لسه مفيش نسخ احتياطية (هتظهر بعد أول نشر).</p>}
      {list?.map((b) => (
        <div key={b.id} className={`${card} flex items-center justify-between px-4 py-3`}>
          <span className="text-sm text-white" dir="ltr">{new Date(b.createdAt).toLocaleString('ar-EG')}</span>
          <button type="button" onClick={() => restore(b.id)} className="rounded-md border border-neutral-700 px-3 py-1.5 text-xs font-bold text-neutral-200 hover:border-brand cursor-pointer">استرجاع كمسودة</button>
        </div>
      ))}
    </div>
  );
};

// ── dashboard ─────────────────────────────────────────────────────────────────────────
const Dashboard: React.FC<{ email: string; onLogout: () => void }> = ({ email, onLogout }) => {
  const [cfg, setCfgState] = useState<SiteConfig | null>(null);
  const [savedJson, setSavedJson] = useState('');
  const [unpublished, setUnpublished] = useState(false);
  const [tab, setTab] = useState('general');
  const [busy, setBusy] = useState<'' | 'save' | 'publish'>('');
  const [toast, setToast] = useState<{ text: string; bad?: boolean } | null>(null);
  const [picker, setPicker] = useState<{ folder: string; done: (id: string) => void } | null>(null);

  const notify = useCallback((text: string, bad?: boolean) => {
    setToast({ text, bad });
    window.setTimeout(() => setToast(null), bad ? 6000 : 3000);
  }, []);

  const load = useCallback(async () => {
    try {
      const data = await adminCall<{ draft: unknown; published: unknown; dirty: boolean }>('config');
      const base = mergeConfig(DEFAULT_CONFIG, data.draft ?? data.published ?? {});
      setCfgState(base);
      setSavedJson(JSON.stringify(base));
      setUnpublished(data.draft ? !data.published || data.dirty : false);
    } catch (e) {
      if (e instanceof AdminApiError && e.status === 401) return onLogout();
      notify(e instanceof Error ? e.message : 'تعذر تحميل الإعدادات', true);
    }
  }, [notify, onLogout]);

  useEffect(() => { load(); }, [load]);

  const json = useMemo(() => (cfg ? JSON.stringify(cfg) : ''), [cfg]);
  const dirty = cfg !== null && json !== savedJson;

  const save = useCallback(async (): Promise<boolean> => {
    if (!cfg) return false;
    setBusy('save');
    try {
      await adminCall('save-draft', { method: 'POST', body: { config: cfg } });
      setSavedJson(JSON.stringify(cfg));
      setUnpublished(true);
      notify('اتحفظت المسودة ✓');
      return true;
    } catch (e) {
      notify(e instanceof Error ? e.message : 'فشل الحفظ', true);
      return false;
    } finally {
      setBusy('');
    }
  }, [cfg, notify]);

  const publish = async () => {
    if (dirty && !(await save())) return;
    if (!window.confirm('هتنشر التعديلات على الموقع الحقيقي دلوقتي (والأسعار هتتغير فعلًا عند الدفع). تكمل؟')) return;
    setBusy('publish');
    try {
      await adminCall('publish', { method: 'POST' });
      setUnpublished(false);
      notify('اتنشر الموقع ✓');
    } catch (e) {
      notify(e instanceof Error ? e.message : 'فشل النشر', true);
    } finally {
      setBusy('');
    }
  };

  const preview = async () => {
    if (dirty && !(await save())) return;
    window.open('/?preview=draft', '_blank', 'noopener');
  };

  // Discard: unsaved edits revert to the last saved state; a saved-but-unpublished draft reverts to the live site.
  const discard = async () => {
    if (dirty) {
      if (!window.confirm('هتلغي التعديلات اللي ما اتحفظتش وترجع لآخر نسخة محفوظة. تكمل؟')) return;
      setCfgState(JSON.parse(savedJson));
      notify('اتلغت التعديلات غير المحفوظة.');
      return;
    }
    if (!window.confirm('هتمسح المسودة وترجع لآخر نسخة منشورة على الموقع، وتعديلاتك هتضيع. تكمل؟')) return;
    setBusy('save');
    try { await adminCall('discard-draft', { method: 'POST' }); await load(); notify('رجعت المسودة لآخر نسخة منشورة.'); }
    catch (e) { notify(e instanceof Error ? e.message : 'فشل', true); }
    finally { setBusy(''); }
  };

  // Ctrl/Cmd+S saves; warn before leaving with unsaved edits
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); if (dirty) save(); } };
    const onLeave = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('keydown', onKey);
    window.addEventListener('beforeunload', onLeave);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('beforeunload', onLeave); };
  }, [dirty, save]);

  if (!cfg) return <div className="grid min-h-screen place-items-center bg-canvas text-neutral-400">جاري التحميل…</div>;

  const def = TABS.find((t) => t.id === tab) ?? TABS[0];
  const status = dirty ? { t: 'فيه تعديلات غير محفوظة', c: 'text-amber-300' } : unpublished ? { t: 'محفوظ كمسودة (لسه ما اتنشرش)', c: 'text-sky-300' } : { t: 'منشور ومتطابق', c: 'text-emerald-300' };

  return (
    <MediaPickerContext.Provider value={{ pick: (folder, done) => setPicker({ folder, done }) }}>
      <div dir="rtl" className="min-h-screen bg-canvas font-cairo text-white">
        <header className="sticky top-0 z-40 border-b border-neutral-800 bg-canvas/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
            <div className="me-auto">
              <h1 className="text-base font-black">لوحة تحكم الموقع</h1>
              <p className={`text-xs font-semibold ${status.c}`}>{status.t}</p>
            </div>
            <button onClick={preview} disabled={!!busy} className="rounded-md border border-neutral-700 px-3 py-2 text-xs font-bold hover:border-neutral-500 disabled:opacity-50 cursor-pointer">معاينة المسودة ↗</button>
            <button onClick={discard} disabled={(!dirty && !unpublished) || !!busy} className="rounded-md border border-neutral-700 px-3 py-2 text-xs font-bold text-neutral-300 hover:border-red-500 hover:text-red-400 disabled:opacity-40 cursor-pointer">تجاهل التعديلات</button>
            <button onClick={() => save()} disabled={!dirty || !!busy} className="rounded-md border border-brand/70 px-3 py-2 text-xs font-bold text-accent hover:bg-brand/10 disabled:opacity-40 cursor-pointer">
              {busy === 'save' ? 'جاري الحفظ…' : 'حفظ المسودة'}
            </button>
            <button onClick={publish} disabled={!!busy || (!dirty && !unpublished)} className="rounded-md bg-brand px-4 py-2 text-xs font-black text-white hover:bg-brand-hover disabled:opacity-40 cursor-pointer">
              {busy === 'publish' ? 'جاري النشر…' : 'نشر على الموقع'}
            </button>
            <button onClick={async () => { await adminCall('logout', { method: 'POST' }).catch(() => {}); onLogout(); }} className="text-xs text-neutral-400 hover:text-white cursor-pointer" title={email}>خروج</button>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[15rem_1fr]">
          <nav className="lg:sticky lg:top-20 lg:self-start">
            <div className="flex gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
              {TABS.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`shrink-0 rounded-md px-3 py-2 text-start text-sm font-semibold transition-colors cursor-pointer ${tab === t.id ? 'bg-brand text-white' : 'text-neutral-300 hover:bg-neutral-800'}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </nav>

          <main className="min-w-0 space-y-6">
            <h2 className="text-xl font-black">{def.label}</h2>
            {def.custom === 'sections' && <SectionsEditor cfg={cfg} setCfg={setCfgState} goTab={setTab} />}
            {def.custom === 'media' && <div className={`${card} p-5`}><MediaGrid /></div>}
            {def.custom === 'backups' && <Backups notify={notify} onRestored={() => { load(); setTab('general'); }} />}
            {def.paths?.map((p) => (
              <section key={p.path.join('.')} className={`${card} p-5`}>
                {p.title && <h3 className="mb-4 text-sm font-black text-accent">{p.title}</h3>}
                <AutoEditor
                  value={getIn(cfg, p.path)}
                  path={p.path}
                  onChange={(v) => setCfgState((c) => setIn(c, p.path, v))}
                />
              </section>
            ))}
            {tab === 'transformations' && (
              <p className="text-xs text-neutral-500">صور معرض التحولات بتتسحب تلقائيًا من فولدر Cloudinary المخصص لها. ارفع صور جديدة من تبويب "مكتبة الصور".</p>
            )}
          </main>
        </div>

        {toast && (
          <div className={`fixed bottom-5 start-1/2 z-[110] -translate-x-1/2 rounded-lg px-5 py-3 text-sm font-bold shadow-xl ${toast.bad ? 'bg-red-600' : 'bg-emerald-600'} text-white`} role="status">
            {toast.text}
          </div>
        )}
        {picker && <MediaPickerModal folder={picker.folder} onPick={picker.done} onClose={() => setPicker(null)} />}
      </div>
    </MediaPickerContext.Provider>
  );
};

// ── entry ─────────────────────────────────────────────────────────────────────────────
const AdminApp: React.FC = () => {
  const [state, setState] = useState<{ checked: boolean; authenticated: boolean; email: string; configured: boolean }>({
    checked: false, authenticated: false, email: '', configured: true,
  });

  const check = useCallback(async () => {
    try {
      const s = await adminCall<{ authenticated: boolean; email: string | null }>('session');
      setState({ checked: true, authenticated: s.authenticated, email: s.email ?? '', configured: true });
    } catch (e) {
      setState({ checked: true, authenticated: false, email: '', configured: !(e instanceof AdminApiError && e.status === 503) });
    }
  }, []);

  useEffect(() => {
    check();
    // keep the admin out of search engines
    const meta = document.createElement('meta');
    meta.name = 'robots'; meta.content = 'noindex,nofollow';
    document.head.appendChild(meta);
    return () => { meta.remove(); };
  }, [check]);

  if (!state.checked) return <div className="grid min-h-screen place-items-center bg-canvas text-neutral-400">…</div>;
  if (!state.authenticated) return <div dir="rtl" className="font-cairo"><Login configured={state.configured} onDone={check} /></div>;
  return <Dashboard email={state.email} onLogout={() => setState((s) => ({ ...s, authenticated: false }))} />;
};

export default AdminApp;
