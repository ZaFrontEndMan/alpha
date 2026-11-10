import React, { createContext, useContext, useRef, useState } from 'react';
import { useSiteConfig } from '../config/SiteConfigContext';
import { uploadImage } from './api';
import { HIDDEN_KEYS, LABELS, humanize } from './labels';

export type Path = (string | number)[];

/** Lets any ImageField open the media library without prop-drilling. */
export const MediaPickerContext = createContext<{ pick: (folder: string, done: (publicId: string) => void) => void }>({
  pick: () => {},
});

const input =
  'w-full bg-canvas border border-neutral-700 rounded-md px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-brand focus:outline-none transition-colors';

export const labelOf = (key: string | number) => (typeof key === 'number' ? `#${key + 1}` : LABELS[key] ?? humanize(key));

// ── value shape helpers ──────────────────────────────────────────────────────────────
const isObj = (v: unknown): v is Record<string, any> => !!v && typeof v === 'object' && !Array.isArray(v);
export const isL = (v: unknown): v is { en: string; ar: string } =>
  isObj(v) && Object.keys(v).length === 2 && typeof v.en === 'string' && typeof v.ar === 'string';
const isImage = (v: unknown) =>
  isObj(v) && Object.keys(v).every((k) => ['asset', 'cloudinaryId', 'alt'].includes(k)) && ('asset' in v || 'cloudinaryId' in v);
const isColor = (v: unknown) => typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v);

const uid = () => Math.random().toString(36).slice(2, 8);

/** An empty item shaped like `sample`, used by "add". */
export function blankLike(sample: any, key?: string | number): any {
  if (typeof sample === 'string') return key === 'id' || key === 'key' ? `new-${uid()}` : '';
  if (typeof sample === 'number') return 0;
  if (typeof sample === 'boolean') return key === 'visible';
  if (Array.isArray(sample)) return [];
  if (isImage(sample)) return { cloudinaryId: '' };
  if (isObj(sample)) return Object.fromEntries(Object.entries(sample).map(([k, v]) => [k, blankLike(v, k)]));
  return null;
}

/** First readable text inside an item, to name its row in a list. */
function summaryOf(v: any): string {
  if (typeof v === 'string') return v;
  if (isL(v)) return v.en || v.ar;
  if (isObj(v)) {
    for (const k of ['name', 'title', 'label', 'q', 'criteria', 'step', 'number']) if (k in v) { const s = summaryOf(v[k]); if (s) return s; }
    for (const val of Object.values(v)) { const s = summaryOf(val); if (s) return s; }
  }
  return '';
}

/** Cloudinary folder an upload from this config path should land in. */
export function folderFor(path: Path): string {
  const area = path[0] === 'content' ? String(path[1]) : path[0] === 'site' ? 'brand' : 'sections';
  const map: Record<string, string> = {
    hero: 'hero', coach: 'coach', whyChoose: 'coach', transformations: 'transformations', testimonials: 'testimonials', brand: 'brand',
  };
  return `assem/${map[area] ?? 'sections'}`;
}

// ── primitives ────────────────────────────────────────────────────────────────────────
export const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
  <label className="block">
    <span className="block text-xs font-bold text-neutral-300 mb-1.5">{label}</span>
    {children}
    {hint && <span className="block text-[11px] text-neutral-500 mt-1">{hint}</span>}
  </label>
);

export const TextInput: React.FC<{
  value: string; onChange: (v: string) => void; multiline?: boolean; ltr?: boolean; placeholder?: string; type?: string;
}> = ({ value, onChange, multiline, ltr, placeholder, type }) =>
  multiline ? (
    <textarea
      className={`${input} min-h-[96px] resize-y leading-relaxed`}
      dir={ltr ? 'ltr' : undefined}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  ) : (
    <input className={input} type={type ?? 'text'} dir={ltr ? 'ltr' : undefined} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
  );

export const Toggle: React.FC<{ on: boolean; onChange: (v: boolean) => void; label?: string }> = ({ on, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    onClick={() => onChange(!on)}
    className="inline-flex items-center gap-2 cursor-pointer select-none"
  >
    <span className={`relative h-5 w-9 rounded-full transition-colors ${on ? 'bg-emerald-500' : 'bg-neutral-700'}`}>
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${on ? 'end-0.5' : 'start-0.5'}`} />
    </span>
    {label && <span className="text-xs font-semibold text-neutral-300">{label}</span>}
  </button>
);

const ColorField: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => (
  <div className="flex items-center gap-2" dir="ltr">
    <input type="color" value={value} onChange={(e) => onChange(e.target.value.toUpperCase())} className="h-9 w-12 cursor-pointer rounded border border-neutral-700 bg-transparent p-0.5" />
    <input className={`${input} font-mono max-w-[9rem]`} value={value} onChange={(e) => onChange(e.target.value)} maxLength={7} />
    <span className="h-9 flex-1 rounded border border-neutral-800" style={{ background: value }} />
  </div>
);

/** English + Arabic side by side. */
export const LField: React.FC<{ label: string; value: { en: string; ar: string }; onChange: (v: { en: string; ar: string }) => void }> = ({
  label, value, onChange,
}) => {
  const long = value.en.length > 70 || value.ar.length > 70 || /\n/.test(value.en + value.ar);
  return (
    <div>
      <span className="block text-xs font-bold text-neutral-300 mb-1.5">{label}</span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="relative">
          <span className="absolute -top-2 end-2 bg-neutral-900 px-1 text-[10px] font-mono text-neutral-500 z-10">EN</span>
          <TextInput ltr multiline={long} value={value.en} onChange={(en) => onChange({ ...value, en })} />
        </div>
        <div className="relative">
          <span className="absolute -top-2 end-2 bg-neutral-900 px-1 text-[10px] font-mono text-neutral-500 z-10">AR</span>
          <TextInput multiline={long} value={value.ar} onChange={(ar) => onChange({ ...value, ar })} />
        </div>
      </div>
    </div>
  );
};

// ── image ─────────────────────────────────────────────────────────────────────────────
const ImageField: React.FC<{ label: string; value: any; onChange: (v: any) => void; path: Path }> = ({ label, value, onChange, path }) => {
  const { img } = useSiteConfig();
  const { pick } = useContext(MediaPickerContext);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const src = img(value, 400);
  const folder = folderFor(path);

  const upload = async (file?: File) => {
    if (!file) return;
    setBusy(true); setError('');
    try {
      const up = await uploadImage(file, folder);
      onChange({ ...value, cloudinaryId: up.public_id });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'فشل الرفع');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div>
      <span className="block text-xs font-bold text-neutral-300 mb-1.5">{label}</span>
      <div className="flex flex-wrap items-start gap-4 rounded-lg border border-neutral-800 bg-canvas p-3">
        <div className="h-28 w-40 shrink-0 overflow-hidden rounded-md border border-neutral-800 bg-black/40 grid place-items-center">
          {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : <span className="text-[11px] text-neutral-600">بدون صورة</span>}
        </div>
        <div className="flex-1 min-w-[14rem] space-y-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={busy} onClick={() => fileRef.current?.click()} className="rounded-md bg-brand px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-hover disabled:opacity-50 cursor-pointer">
              {busy ? 'جاري الرفع…' : 'رفع صورة جديدة'}
            </button>
            <button type="button" onClick={() => pick(folder, (id) => onChange({ ...value, cloudinaryId: id }))} className="rounded-md border border-neutral-700 px-3 py-1.5 text-xs font-bold text-neutral-200 hover:border-neutral-500 cursor-pointer">
              اختيار من المكتبة
            </button>
            {value?.cloudinaryId && value?.asset && (
              <button type="button" onClick={() => onChange({ ...value, cloudinaryId: undefined })} className="rounded-md border border-neutral-700 px-3 py-1.5 text-xs font-bold text-neutral-400 hover:text-white cursor-pointer">
                الرجوع للصورة الأصلية
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files?.[0])} />
          <p className="text-[11px] text-neutral-500" dir="ltr">
            {value?.cloudinaryId ? `Cloudinary: ${value.cloudinaryId}` : value?.asset ? `الصورة الأصلية للموقع (${value.asset})` : ''}
          </p>
          {error && <p className="text-xs text-red-400">{error}</p>}
          {value?.alt && isL(value.alt) && (
            <LField label={labelOf('alt')} value={value.alt} onChange={(alt) => onChange({ ...value, alt })} />
          )}
        </div>
      </div>
    </div>
  );
};

// ── list ──────────────────────────────────────────────────────────────────────────────
const IconBtn: React.FC<{ onClick: () => void; title: string; disabled?: boolean; children: React.ReactNode; danger?: boolean }> = ({ onClick, title, disabled, children, danger }) => (
  <button type="button" onClick={onClick} title={title} aria-label={title} disabled={disabled}
    className={`h-7 w-7 grid place-items-center rounded border border-neutral-700 text-xs ${danger ? 'text-red-400 hover:border-red-500/60' : 'text-neutral-300 hover:border-neutral-500'} disabled:opacity-30 cursor-pointer`}>
    {children}
  </button>
);

const ListEditor: React.FC<{ label: string; items: any[]; onChange: (v: any[]) => void; path: Path }> = ({ label, items, onChange, path }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpenIdx(null);
  };
  const sample = items[items.length - 1] ?? items[0];
  const primitive = items.length > 0 && typeof items[0] === 'string';

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-neutral-300">{label} <span className="text-neutral-600 font-normal">({items.length})</span></span>
        <button type="button" onClick={() => { onChange([...items, blankLike(sample)]); setOpenIdx(items.length); }}
          className="rounded-md border border-brand/60 px-2.5 py-1 text-xs font-bold text-accent hover:bg-brand/10 cursor-pointer">
          + إضافة
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => {
          const hasVisible = isObj(item) && typeof item.visible === 'boolean';
          const open = primitive || openIdx === i;
          return (
            <div key={i} className={`rounded-lg border bg-neutral-900/60 ${hasVisible && !item.visible ? 'border-neutral-800 opacity-60' : 'border-neutral-800'}`}>
              <div className="flex items-center gap-2 px-3 py-2">
                {!primitive && (
                  <button type="button" onClick={() => setOpenIdx(open ? null : i)} className="flex-1 text-start text-sm font-semibold text-white truncate cursor-pointer">
                    <span className="text-neutral-500 me-2 font-mono text-xs">{open ? '▾' : '▸'} {i + 1}</span>
                    {summaryOf(item).slice(0, 70) || 'عنصر جديد'}
                  </button>
                )}
                {primitive && (
                  <input className={`${input} flex-1`} value={item} onChange={(e) => onChange(items.map((x, k) => (k === i ? e.target.value : x)))} />
                )}
                {hasVisible && <Toggle on={item.visible} onChange={(v) => onChange(items.map((x, k) => (k === i ? { ...x, visible: v } : x)))} />}
                <IconBtn title="فوق" disabled={i === 0} onClick={() => move(i, -1)}>↑</IconBtn>
                <IconBtn title="تحت" disabled={i === items.length - 1} onClick={() => move(i, 1)}>↓</IconBtn>
                {!primitive && <IconBtn title="نسخ" onClick={() => onChange([...items.slice(0, i + 1), structuredClone(item) as any, ...items.slice(i + 1)].map((x, k) => (k === i + 1 && isObj(x) && 'id' in x ? { ...x, id: `${x.id}-copy-${uid()}` } : x)))}>⧉</IconBtn>}
                <IconBtn title="حذف" danger onClick={() => { if (window.confirm('تحذف العنصر ده؟')) { onChange(items.filter((_, k) => k !== i)); setOpenIdx(null); } }}>✕</IconBtn>
              </div>
              {open && !primitive && (
                <div className="border-t border-neutral-800 p-3">
                  <AutoEditor value={item} path={[...path, i]} hide={hasVisible ? ['visible'] : []} onChange={(v) => onChange(items.map((x, k) => (k === i ? v : x)))} />
                </div>
              )}
            </div>
          );
        })}
        {items.length === 0 && <p className="text-xs text-neutral-600">مفيش عناصر.</p>}
      </div>
    </div>
  );
};

// ── the generic editor ────────────────────────────────────────────────────────────────
export const AutoEditor: React.FC<{ value: any; onChange: (v: any) => void; path: Path; label?: string; hide?: string[] }> = ({
  value, onChange, path, label, hide = [],
}) => {
  const key = path[path.length - 1];
  const name = label ?? labelOf(key);

  if (isImage(value)) return <ImageField label={name} value={value} onChange={onChange} path={path} />;
  if (isL(value)) return <LField label={name} value={value} onChange={onChange} />;
  if (typeof value === 'boolean') return <Toggle on={value} onChange={onChange} label={name} />;
  if (typeof value === 'number')
    return (
      <Field label={name}>
        <input className={`${input} max-w-[14rem]`} dir="ltr" type="number" step="any" value={value} onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))} />
      </Field>
    );
  if (typeof value === 'string') {
    if (isColor(value)) return <Field label={name}><ColorField value={value} onChange={onChange} /></Field>;
    const ltr = key === 'href' || key === 'email' || key === 'whatsapp' || key === 'paymentWhatsapp' || key === 'platformLabel';
    return (
      <Field label={name}>
        <TextInput ltr={ltr} multiline={value.length > 90 || /\n/.test(value)} value={value} onChange={onChange} />
      </Field>
    );
  }
  if (Array.isArray(value)) return <ListEditor label={name} items={value} onChange={onChange} path={path} />;
  if (isObj(value)) {
    const keys = Object.keys(value).filter((k) => !HIDDEN_KEYS.has(k) && !hide.includes(k));
    // simple fields first, then images, then groups & lists
    const rank = (k: string) => { const v = value[k]; return isImage(v) ? 1 : (isObj(v) && !isL(v)) || Array.isArray(v) ? 2 : 0; };
    keys.sort((a, b) => rank(a) - rank(b));
    const set = (k: string, v: any) => onChange({ ...value, [k]: v });
    const body = (
      <div className="space-y-4">
        {keys.map((k) => {
          const v = value[k];
          const group = (isObj(v) && !isL(v) && !isImage(v)) ;
          return group ? (
            <fieldset key={k} className="rounded-lg border border-neutral-800 p-3">
              <legend className="px-2 text-xs font-black text-accent">{labelOf(k)}</legend>
              <AutoEditor value={v} path={[...path, k]} onChange={(nv) => set(k, nv)} label={labelOf(k)} />
            </fieldset>
          ) : (
            <AutoEditor key={k} value={v} path={[...path, k]} onChange={(nv) => set(k, nv)} />
          );
        })}
      </div>
    );
    return body;
  }
  return null;
};
