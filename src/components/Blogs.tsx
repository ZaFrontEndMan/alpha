import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Footer } from './Footer';
import { BrandLogo } from './BrandLogo';
import { Language } from '../translations';
import { cn } from '../utils/cn';
import { useSiteConfig, useTranslations } from '../config/SiteConfigContext';
import { tx, type SiteConfig } from '../config/siteConfig';

type Post = SiteConfig['content']['blogs']['posts'][number];

// ── helpers ───────────────────────────────────────────────────────────────────────────
/** Card colours. They read the theme tokens, so changing the brand colours in /admin recolours the blog too. */
const TONES: Record<string, string> = {
  brand: 'bg-brand text-white',
  dark: 'bg-neutral-900 text-white ring-1 ring-inset ring-white/10',
  light: 'bg-neutral-100 text-canvas',
  accent: 'bg-accent text-white',
};
const toneOf = (p: Post) => TONES[p.tone] ?? TONES.dark;

export const slugOf = (p: Post) => p.slug || p.id;
const hrefOf = (p: Post) => `/blogs/${encodeURIComponent(slugOf(p))}`;

const fmtDate = (iso: string, lang: Language) => {
  const d = new Date(iso);
  if (!iso || Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
};

const headingFont = (lang: Language) => (lang === 'en' ? 'font-sport' : 'font-cairo');

/** Visible posts + labels, from the dashboard. */
function useBlog() {
  const { cfg, img, isSectionVisible, loaded } = useSiteConfig();
  const blog = cfg.content.blogs;
  const posts = useMemo(() => blog.posts.filter((p) => p.visible), [blog.posts]);
  return { cfg, img, blog, posts, labels: blog.labels, enabled: isSectionVisible('blogs'), loaded };
}

// ── small pieces ──────────────────────────────────────────────────────────────────────
const Arrow: React.FC<{ onLight?: boolean; className?: string }> = ({ onLight, className }) => (
  <span
    className={cn(
      'grid h-10 w-10 shrink-0 place-items-center rounded-full transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5',
      onLight ? 'bg-canvas text-white' : 'bg-white text-canvas',
      className
    )}
    aria-hidden="true"
  >
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="rtl:-scale-x-100">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  </span>
);

const Chip: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <span className={cn('inline-block whitespace-nowrap rounded-md border border-current/40 px-2 py-0.5 text-[11px] font-bold uppercase leading-5 tracking-wide', className)}>
    {children}
  </span>
);

// ── cards ─────────────────────────────────────────────────────────────────────────────
/** Coloured card with text only. */
const TextCard: React.FC<{ post: Post; lang: Language; big?: boolean; className?: string }> = ({ post, lang, big, className }) => {
  const { labels } = useBlog();
  return (
    <Link
      to={hrefOf(post)}
      className={cn('group flex h-full min-h-[11.5rem] flex-col justify-between gap-5 overflow-hidden rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-0.5 md:p-6', toneOf(post), className)}
    >
      <div className="flex items-start justify-between gap-3">
        <Chip>{tx(post.category, lang)}</Chip>
        <span className={cn('text-[11px] font-semibold opacity-70', !big && 'max-sm:hidden')}>{fmtDate(post.date, lang)}</span>
      </div>
      <div>
        <h3 className={cn('font-black leading-snug [text-wrap:balance]', headingFont(lang), big ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl')}>
          {tx(post.title, lang)}
        </h3>
        {big && <p className="mt-3 line-clamp-3 text-sm leading-relaxed opacity-80">{tx(post.excerpt, lang)}</p>}
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-wider">{tx(labels.readMore, lang)}</span>
        <Arrow onLight={post.tone !== 'light'} />
      </div>
    </Link>
  );
};

/** Full-bleed photo with the title on top of it. `mono` = black & white until hovered. */
const PhotoCard: React.FC<{ post: Post; lang: Language; mono?: boolean; className?: string }> = ({ post, lang, mono, className }) => {
  const { img } = useBlog();
  return (
    <Link
      to={hrefOf(post)}
      className={cn('group relative block h-full min-h-[15rem] overflow-hidden rounded-2xl bg-neutral-900 text-white', className)}
    >
      <img
        src={img(post.image, 900)}
        alt={tx(post.image.alt, lang) || tx(post.title, lang)}
        loading="lazy"
        className={cn('absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105', mono && 'grayscale group-hover:grayscale-0')}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-5">
        <Chip className="border-white/60 bg-black/25 backdrop-blur-sm">{tx(post.category, lang)}</Chip>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
        <div className="min-w-0">
          <h3 className={cn('text-xl font-black leading-snug [text-wrap:balance] md:text-2xl', headingFont(lang))}>{tx(post.title, lang)}</h3>
          <span className="mt-2 block text-[11px] font-semibold text-white/75">{[fmtDate(post.date, lang), tx(post.readTime, lang)].filter(Boolean).join(' · ')}</span>
        </div>
        <Arrow />
      </div>
    </Link>
  );
};

/** Coloured text on top, photo underneath. */
const SplitCard: React.FC<{ post: Post; lang: Language; className?: string }> = ({ post, lang, className }) => {
  const { img, labels } = useBlog();
  return (
    <Link to={hrefOf(post)} className={cn('group flex h-full flex-col overflow-hidden rounded-2xl', toneOf(post), className)}>
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <Chip className="self-start">{tx(post.category, lang)}</Chip>
        <h3 className={cn('line-clamp-4 text-base font-black leading-snug [text-wrap:balance] md:text-xl', headingFont(lang))}>{tx(post.title, lang)}</h3>
      </div>
      <div className="relative m-1.5 mt-0 h-32 overflow-hidden rounded-xl md:h-52">
        <img src={img(post.image, 700)} alt={tx(post.image.alt, lang) || tx(post.title, lang)} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className="absolute bottom-2.5 start-3 hidden text-[11px] font-bold uppercase tracking-wider text-white sm:block">{tx(labels.readMore, lang)}</span>
        <Arrow className="absolute bottom-2 end-2 !h-9 !w-9" />
      </div>
    </Link>
  );
};

// ── layouts ───────────────────────────────────────────────────────────────────────────
/** Home section: 3 + 4 cells (needs 7 posts). Photos are black & white. */
const HomeBento: React.FC<{ posts: Post[]; lang: Language }> = ({ posts, lang }) => (
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-12 lg:gap-4">
    <PhotoCard mono post={posts[0]} lang={lang} className="col-span-2 aspect-[16/11] lg:col-span-4 lg:aspect-auto lg:h-[24rem]" />
    <TextCard big post={posts[1]} lang={lang} className="col-span-2 lg:col-span-4 lg:h-[24rem]" />
    <PhotoCard mono post={posts[2]} lang={lang} className="col-span-2 aspect-[16/11] lg:col-span-4 lg:aspect-auto lg:h-[24rem]" />
    {posts.slice(3, 7).map((p) => (
      <TextCard key={p.id} post={p} lang={lang} className="col-span-1 lg:col-span-3 lg:h-[16rem]" />
    ))}
  </div>
);

/** Listing page block: 2 / 3 / 2 cells (needs 7 posts). */
const PageBento: React.FC<{ posts: Post[]; lang: Language }> = ({ posts, lang }) => (
  <div className="grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-4">
    <TextCard big post={posts[0]} lang={lang} className="col-span-2 md:col-span-5 md:h-[26rem]" />
    <PhotoCard post={posts[1]} lang={lang} className="col-span-2 aspect-[16/11] md:col-span-7 md:aspect-auto md:h-[26rem]" />
    <SplitCard post={posts[2]} lang={lang} className="col-span-1 md:col-span-4 md:h-[30rem]" />
    <SplitCard post={posts[3]} lang={lang} className="col-span-1 md:col-span-4 md:h-[30rem]" />
    <SplitCard post={posts[4]} lang={lang} className="col-span-2 md:col-span-4 md:h-[30rem]" />
    <PhotoCard post={posts[5]} lang={lang} className="col-span-2 aspect-[16/11] md:col-span-7 md:aspect-auto md:h-[26rem]" />
    <TextCard big post={posts[6]} lang={lang} className="col-span-2 md:col-span-5 md:h-[26rem]" />
  </div>
);

/** Fewer than 7 posts left: a plain responsive grid. */
const SimpleGrid: React.FC<{ posts: Post[]; lang: Language }> = ({ posts, lang }) => (
  <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3">
    {posts.map((p) => (
      <SplitCard key={p.id} post={p} lang={lang} className="md:h-[26rem] odd:last:col-span-2 lg:odd:last:col-span-1" />
    ))}
  </div>
);

// ── home section ──────────────────────────────────────────────────────────────────────
export const BlogsSection: React.FC<{ lang: Language }> = ({ lang }) => {
  const { blog, posts, labels } = useBlog();
  if (posts.length === 0) return null;
  const shown = posts.slice(0, 7);

  return (
    <section id="blogs" className="bg-canvas py-20 @container md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-5 md:mb-12 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">{tx(blog.tag, lang)}</div>
            <h2 className={cn('text-3xl font-black tracking-tight text-white [text-wrap:balance] sm:text-4xl lg:text-5xl', headingFont(lang))}>
              {tx(blog.heading, lang)}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400 md:text-base">{tx(blog.subheading, lang)}</p>
          </div>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-3 self-start whitespace-nowrap rounded-full border border-neutral-700 px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition-colors hover:border-brand hover:text-accent md:self-end"
          >
            {tx(labels.viewAll, lang)}
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="rtl:-scale-x-100" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        {shown.length >= 7 ? <HomeBento posts={shown} lang={lang} /> : <SimpleGrid posts={shown} lang={lang} />}
      </div>
    </section>
  );
};

// ── page shell (header + footer) ──────────────────────────────────────────────────────
interface PageProps {
  lang: Language;
  onToggleLang: () => void;
}

const Shell: React.FC<PageProps & { children: React.ReactNode }> = ({ lang, onToggleLang, children }) => {
  const navigate = useNavigate();
  const en = lang === 'en';
  const t = useTranslations(lang);
  const { cfg } = useSiteConfig();

  return (
    <div className={cn('flex min-h-screen flex-col bg-canvas text-neutral-100 selection:bg-brand selection:text-white', en ? 'font-sans' : 'font-cairo')}>
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex cursor-pointer items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-300 transition-colors hover:text-accent"
          >
            <span className="text-base">{en ? '←' : '→'}</span>
            <span>{en ? 'Home' : 'الرئيسية'}</span>
          </button>
          <Link to="/" className="block">
            <BrandLogo size={30} />
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleLang}
              className="cursor-pointer border border-neutral-700 bg-neutral-900/80 px-3 py-1.5 text-xs font-bold text-neutral-200 transition-colors hover:border-brand hover:text-accent"
            >
              {en ? 'العربية' : 'English'}
            </button>
            {cfg.ctas.start.visible && (
              <button
                type="button"
                onClick={() => navigate('/form')}
                className="hidden cursor-pointer bg-brand px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-white hover:bg-brand-hover sm:inline-flex"
              >
                {en ? 'Apply Now' : 'قدم الآن'}
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Footer t={t} lang={lang} />
    </div>
  );
};

/** Sets the tab title while a blog page is open, and puts the previous one back afterwards. */
function useDocumentTitle(title: string) {
  useEffect(() => {
    if (!title) return;
    const prev = document.title;
    document.title = title;
    return () => { document.title = prev; };
  }, [title]);
}

const Unavailable: React.FC<{ lang: Language; message: string }> = ({ lang, message }) => (
  <div className="mx-auto max-w-xl px-4 py-32 text-center">
    <p className="text-lg font-bold text-white">{message}</p>
    <Link to="/" className="mt-6 inline-block text-sm font-bold text-accent hover:underline">{lang === 'en' ? '← Back to home' : 'الرجوع للرئيسية ←'}</Link>
  </div>
);

/** The blog is switched off (section hidden) or not loaded yet. Returns the element to show, or null when OK. */
function useGate(lang: Language) {
  const { enabled, loaded } = useBlog();
  if (!loaded) return <div className="min-h-[60vh]" aria-busy="true" />;
  if (!enabled) return <Unavailable lang={lang} message={lang === 'en' ? 'This page is not available.' : 'الصفحة دي مش متاحة.'} />;
  return null;
}

// ── /blogs ────────────────────────────────────────────────────────────────────────────
export const BlogsPage: React.FC<PageProps> = ({ lang, onToggleLang }) => {
  const { cfg, blog, posts, labels } = useBlog();
  const gate = useGate(lang);
  const [cat, setCat] = useState('');
  useDocumentTitle(`${tx(blog.page.title, lang)} | ${cfg.site.name}`);

  const categories = useMemo(() => {
    const seen = new Map<string, Post['category']>();
    posts.forEach((p) => { if (p.category.en || p.category.ar) seen.set(p.category.en || p.category.ar, p.category); });
    return [...seen.entries()];
  }, [posts]);

  const filtered = cat ? posts.filter((p) => (p.category.en || p.category.ar) === cat) : posts;
  const chunks: Post[][] = [];
  for (let i = 0; i < filtered.length; i += 7) chunks.push(filtered.slice(i, i + 7));

  return (
    <Shell lang={lang} onToggleLang={onToggleLang}>
      {gate ?? (
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 md:pt-14 lg:px-8">
          <div className="mb-8 max-w-2xl md:mb-10">
            <div className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">{tx(blog.tag, lang)}</div>
            <h1 className={cn('text-4xl font-black tracking-tight text-white [text-wrap:balance] sm:text-5xl lg:text-6xl', headingFont(lang))}>
              {tx(blog.page.title, lang)}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-neutral-400">{tx(blog.page.subtitle, lang)}</p>
          </div>

          {categories.length > 1 && (
            <div className="-mx-4 mb-6 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Categories">
              <div className="flex gap-2 whitespace-nowrap pb-1">
                {[['', labels.all] as const, ...categories].map(([key, label]) => (
                  <button
                    key={key || 'all'}
                    type="button"
                    role="tab"
                    aria-selected={cat === key}
                    onClick={() => setCat(key)}
                    className={cn(
                      'cursor-pointer rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors',
                      cat === key ? 'border-white bg-white text-canvas' : 'border-neutral-700 text-neutral-300 hover:border-neutral-500'
                    )}
                  >
                    {tx(label, lang)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filtered.length === 0 ? (
            <p className="py-20 text-center text-neutral-400">{tx(labels.empty, lang)}</p>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {chunks.map((chunk, i) =>
                chunk.length === 7 ? <PageBento key={i} posts={chunk} lang={lang} /> : <SimpleGrid key={i} posts={chunk} lang={lang} />
              )}
            </div>
          )}
        </div>
      )}
    </Shell>
  );
};

// ── /blogs/:slug ──────────────────────────────────────────────────────────────────────
export const BlogPostPage: React.FC<PageProps> = ({ lang, onToggleLang }) => {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const { cfg, img, blog, posts, labels } = useBlog();
  const gate = useGate(lang);
  const post = posts.find((p) => slugOf(p) === decodeURIComponent(slug));
  useDocumentTitle(post ? `${tx(post.title, lang)} | ${cfg.site.name}` : '');

  useEffect(() => { window.scrollTo({ top: 0 }); }, [slug]);

  const related = post ? posts.filter((p) => p.id !== post.id).slice(0, 3) : [];
  const blocks = post ? tx(post.body, lang).split(/\n{2,}/).map((b) => b.trim()).filter(Boolean) : [];

  return (
    <Shell lang={lang} onToggleLang={onToggleLang}>
      {gate ?? (!post ? (
        <Unavailable lang={lang} message={lang === 'en' ? 'Article not found.' : 'المقال مش موجود.'} />
      ) : (
        <article className="pb-20">
          <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6 md:pt-12">
            <Link to="/blogs" className="mb-6 flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 transition-colors hover:text-accent">
              <span>{lang === 'en' ? '←' : '→'}</span>
              {tx(labels.back, lang)}
            </Link>
            <Chip className="text-accent">{tx(post.category, lang)}</Chip>
            <h1 className={cn('mt-4 text-3xl font-black leading-tight tracking-tight text-white [text-wrap:balance] sm:text-4xl md:text-5xl', headingFont(lang))}>
              {tx(post.title, lang)}
            </h1>
            <p className="mt-3 text-sm font-semibold text-neutral-400">
              {[fmtDate(post.date, lang), tx(post.readTime, lang)].filter(Boolean).join(' · ')}
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-5xl px-4 sm:px-6">
            <img
              src={img(post.image, 1400)}
              alt={tx(post.image.alt, lang) || tx(post.title, lang)}
              className="aspect-[16/10] w-full rounded-2xl object-cover md:aspect-[2/1]"
            />
          </div>

          <div className="mx-auto mt-10 max-w-3xl space-y-6 px-4 text-base leading-8 text-neutral-200 sm:px-6 md:text-lg md:leading-9">
            {blocks.map((b, i) =>
              b.startsWith('## ') ? (
                <h2 key={i} className={cn('pt-4 text-2xl font-black text-white md:text-3xl', headingFont(lang))}>{b.slice(3)}</h2>
              ) : (
                <p key={i} className="whitespace-pre-line">{b}</p>
              )
            )}
          </div>

          {cfg.ctas.start.visible && (
            <div className="mx-auto mt-14 max-w-3xl px-4 sm:px-6">
              <div className="rounded-2xl bg-brand p-6 text-white md:p-8">
                <h3 className={cn('text-xl font-black md:text-2xl', headingFont(lang))}>{tx(labels.cta, lang)}</h3>
                <p className="mt-2 text-sm leading-relaxed opacity-90 md:text-base">{tx(labels.ctaText, lang)}</p>
                <button
                  type="button"
                  onClick={() => navigate('/form')}
                  className="mt-5 cursor-pointer rounded-full bg-white px-6 py-3 text-xs font-black uppercase tracking-wider text-canvas transition-opacity hover:opacity-90"
                >
                  {tx(cfg.ctas.start.label, lang)}
                </button>
              </div>
            </div>
          )}

          {related.length > 0 && (
            <div className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className={cn('mb-6 text-2xl font-black text-white md:text-3xl', headingFont(lang))}>{tx(labels.related, lang)}</h2>
              <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3">
                {related.map((p) => (
                  <SplitCard key={p.id} post={p} lang={lang} className="md:h-[26rem] odd:last:col-span-2 lg:odd:last:col-span-1" />
                ))}
              </div>
            </div>
          )}
        </article>
      ))}
    </Shell>
  );
};
