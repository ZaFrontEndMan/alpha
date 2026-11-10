/**
 * Single source of truth for everything the admin dashboard can edit.
 * The default values live in `site-config.default.json` (generated from the current site by
 * `scripts/generate-default-config.ts`). The live config (published from /admin) is stored in
 * Cloudinary and merged over these defaults, so a missing/failed fetch never breaks the site.
 */

/** A bilingual text. Every user-visible string is one of these. */
export interface L {
  en: string;
  ar: string;
}

/** An image: either one bundled with the site (`asset` key) or one uploaded to Cloudinary. */
export interface ImageRef {
  /** Key of a bundled default image (see `src/config/assets.ts`, added in phase 2). */
  asset?: string;
  /** Cloudinary public_id, e.g. "assem/hero/person_1". Wins over `asset` when set. */
  cloudinaryId?: string;
  alt?: L;
}

export interface Cta {
  visible: boolean;
  label: L;
  /** '#packages', '/checkout', 'https://…' */
  href?: string;
}

export type SectionType =
  | 'hero'
  | 'transformations'
  | 'packages'
  | 'testimonials'
  | 'workouts'
  | 'substitutions'
  | 'banner'
  | 'whyChoose'
  | 'coach'
  | 'features'
  | 'comparison'
  | 'howItWorks'
  | 'faqs'
  // generic blocks the admin can add (phase 4)
  | 'custom-text-image'
  | 'custom-cards'
  | 'custom-faq'
  | 'custom-cta'
  | 'custom-gallery';

export interface SectionEntry {
  /** Anchor id used by the navbar (#packages …) */
  id: string;
  type: SectionType;
  visible: boolean;
  /** Key into `content` (built-in sections) or into `customSections` (added sections). */
  contentKey?: string;
}

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  visible: boolean;
}

export interface NavLink {
  key: string;
  href: string;
  visible: boolean;
  label: L;
}

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
}

export interface SiteConfig {
  version: number;
  site: {
    name: string;
    seo: { title: L; description: L };
    favicon: ImageRef;
    logo: ImageRef & { style: 'lime' | 'mixed' };
    colors: ThemeColors;
    copyright: L;
  };
  contact: {
    whatsapp: string;
    /** Used in the footer / mailto links. */
    email: string;
    instagramHandle: string;
    socials: SocialLink[];
  };
  navbar: { links: NavLink[]; langToggle: L };
  ctas: { start: Cta; packages: Cta; footerWhatsapp: Cta };
  sections: SectionEntry[];
  /** Per-section copy and images, keyed by `SectionEntry.contentKey`. Shapes differ per section. */
  content: Record<string, unknown>;
  footer: {
    description: L;
    navTitle: L;
    channelsTitle: L;
    channelsText: L;
    platformLabel: string;
    privacy: L;
    terms: L;
    links: NavLink[];
  };
  customSections: Record<string, unknown>;
}
