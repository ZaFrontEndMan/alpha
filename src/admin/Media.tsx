import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cloudinaryImageUrl } from '../config/SiteConfigContext';
import { adminCall, uploadImage } from './api';

export const FOLDERS = [
  ['assem', 'كل الصور'],
  ['assem/hero', 'الهيرو'],
  ['assem/coach', 'عن الدكتور'],
  ['assem/transformations', 'التحولات'],
  ['assem/testimonials', 'الآراء'],
  ['assem/brand', 'اللوجو والهوية'],
  ['assem/sections', 'سكاشن أخرى'],
] as const;

interface Img { public_id: string; width: number; height: number; format: string; bytes: number; asset_folder?: string }

/** Browsable grid of the Cloudinary images, with upload into the selected folder. */
export const MediaGrid: React.FC<{ initialFolder?: string; onPick?: (publicId: string) => void }> = ({ initialFolder = 'assem', onPick }) => {
  const [folder, setFolder] = useState(FOLDERS.some(([f]) => f === initialFolder) ? initialFolder : 'assem');
  const [items, setItems] = useState<Img[]>([]);
  const [cursor, setCursor] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async (reset: boolean, next?: string) => {
    setLoading(true); setError('');
    try {
      const data = await adminCall<{ resources: Img[]; next_cursor?: string }>('media', { query: { folder, ...(next ? { cursor: next } : {}) } });
      setItems((prev) => (reset ? data.resources : [...prev, ...data.resources]));
      setCursor(data.next_cursor);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'تعذر تحميل الصور');
    } finally {
      setLoading(false);
    }
  }, [folder]);

  useEffect(() => { load(true); }, [load]);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setLoading(true); setError('');
    try {
      for (const f of Array.from(files)) await uploadImage(f, folder === 'assem' ? 'assem/sections' : folder);
      await load(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'فشل الرفع');
      setLoading(false);
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <select value={folder} onChange={(e) => setFolder(e.target.value)} className="rounded-md border border-neutral-700 bg-canvas px-3 py-2 text-sm text-white">
          {FOLDERS.map(([f, label]) => <option key={f} value={f}>{label} ({f})</option>)}
        </select>
        <button type="button" onClick={() => fileRef.current?.click()} className="rounded-md bg-brand px-3 py-2 text-xs font-bold text-white hover:bg-brand-hover cursor-pointer">
          رفع صور {folder !== 'assem' ? `إلى ${folder}` : ''}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
        <span className="text-xs text-neutral-500">{items.length} صورة</span>
      </div>
      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {items.map((it) => (
          <button
            key={it.public_id}
            type="button"
            onClick={() => {
              if (onPick) return onPick(it.public_id);
              navigator.clipboard?.writeText(it.public_id).then(() => { setCopied(it.public_id); setTimeout(() => setCopied(''), 1500); });
            }}
            className="group relative aspect-square overflow-hidden rounded-lg border border-neutral-800 bg-black/40 text-start hover:border-brand cursor-pointer"
            title={it.public_id}
          >
            <img src={cloudinaryImageUrl(it.public_id, 320)} alt="" loading="lazy" className="h-full w-full object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-black/70 px-2 py-1 text-[10px] text-neutral-200 truncate" dir="ltr">
              {copied === it.public_id ? '✓ تم نسخ المعرّف' : it.public_id.split('/').pop()}
            </span>
          </button>
        ))}
      </div>
      {!loading && items.length === 0 && !error && <p className="py-10 text-center text-sm text-neutral-500">مفيش صور في الفولدر ده.</p>}
      {loading && <p className="py-4 text-center text-sm text-neutral-500">جاري التحميل…</p>}
      {cursor && !loading && (
        <div className="mt-4 text-center">
          <button type="button" onClick={() => load(false, cursor)} className="rounded-md border border-neutral-700 px-4 py-2 text-xs font-bold text-neutral-200 hover:border-neutral-500 cursor-pointer">تحميل المزيد</button>
        </div>
      )}
    </div>
  );
};

export const MediaPickerModal: React.FC<{ folder: string; onPick: (id: string) => void; onClose: () => void }> = ({ folder, onPick, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4" onClick={onClose}>
    <div className="max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-xl border border-neutral-700 bg-neutral-900 p-5" onClick={(e) => e.stopPropagation()}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-black text-white">اختر صورة من المكتبة</h3>
        <button type="button" onClick={onClose} className="text-2xl leading-none text-neutral-400 hover:text-white cursor-pointer" aria-label="إغلاق">×</button>
      </div>
      <MediaGrid initialFolder={folder} onPick={(id) => { onPick(id); onClose(); }} />
    </div>
  </div>
);
