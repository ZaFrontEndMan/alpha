import type { TranslationContent } from '../translations.ts';
import { tx } from './siteConfig.ts';
import type { Lang, SiteConfig } from './siteConfig.ts';

/**
 * The config shaped like the old `translations[lang]` object, so every existing component that takes
 * `t` keeps working unchanged. Hidden items (packages, reviews, FAQs) are filtered out here.
 */
export function buildTranslations(cfg: SiteConfig, lang: Lang): TranslationContent {
  const c = cfg.content;
  const r = (v: { en: string; ar: string }) => tx(v, lang);
  const nav = Object.fromEntries(cfg.navbar.links.map((l) => [l.key, r(l.label)])) as Record<string, string>;
  const stat = (s: { value: { en: string; ar: string }; label: { en: string; ar: string } }) => ({
    value: r(s.value),
    label: r(s.label),
  });
  const hs = c.hero.stats;

  return {
    nav: { ...nav, langToggle: r(cfg.navbar.langToggle) } as TranslationContent['nav'],
    hero: {
      headline: r(c.hero.headline),
      subheadline: r(c.hero.subheadline),
      ctaStart: r(cfg.ctas.start.label),
      ctaPackages: r(cfg.ctas.packages.label),
    },
    stats: {
      transformationsCount: stat(hs.transformations).value,
      transformationsLabel: stat(hs.transformations).label,
      weeksChange: stat(hs.weeks).value,
      weeksLabel: stat(hs.weeks).label,
      doctorLabel: r(c.hero.doctorLabel),
      experienceYears: stat(hs.experience).value,
      experienceLabel: stat(hs.experience).label,
    },
    testimonials: {
      title: r(c.testimonials.title),
      heading: r(c.testimonials.heading),
      subheading: r(c.testimonials.subheading),
      reviews: c.testimonials.reviews
        .filter((x) => x.visible !== false)
        .map((x) => ({
          name: r(x.name),
          role: r(x.role),
          quote: r(x.quote),
          highlight: r(x.highlight),
          stats: r(x.stats),
        })),
    },
    whyChoose: {
      tag: r(c.whyChoose.tag),
      heading: r(c.whyChoose.heading),
      subheading: r(c.whyChoose.subheading),
      pillars: c.whyChoose.pillars.map((p) => ({ number: p.number, title: r(p.title), description: r(p.description) })),
    },
    features: {
      tag: r(c.features.tag),
      heading: r(c.features.heading),
      mealPlanTitle: r(c.features.cards[0].title),
      mealPlanDesc: r(c.features.cards[0].description),
      workoutTitle: r(c.features.cards[1].title),
      workoutDesc: r(c.features.cards[1].description),
      locationTitle: r(c.features.cards[2].title),
      locationDesc: r(c.features.cards[2].description),
    },
    comparison: {
      tag: r(c.comparison.tag),
      heading: r(c.comparison.heading),
      subheading: r(c.comparison.subheading),
      table: c.comparison.rows.map((row) => ({
        criteria: r(row.criteria),
        drAssem: r(row.drAssem),
        others: r(row.others),
      })),
    },
    packages: {
      tag: r(c.packages.tag),
      heading: r(c.packages.heading),
      currency: r(c.packages.currencyLabel),
      items: c.packages.items
        .filter((p) => p.visible !== false)
        .map((p) => ({
          id: p.id,
          name: r(p.name),
          price: r(p.price),
          priceNumeric: p.priceNumeric,
          description: r(p.description),
          popular: p.popular,
          features: p.features.map(r),
          note: p.note ? r(p.note) : undefined,
        })),
    },
    howItWorks: {
      tag: r(c.howItWorks.tag),
      heading: r(c.howItWorks.heading),
      steps: c.howItWorks.steps.map((s) => ({ step: s.step, title: r(s.title), desc: r(s.desc) })),
    },
    banner: {
      title: r(c.banner.title),
      quote: r(c.banner.quote),
      pills: c.banner.pills.map(r),
      cta: r(c.banner.cta),
    },
    faqs: {
      title: r(c.faqs.title),
      items: c.faqs.items.filter((f) => f.visible !== false).map((f) => ({ q: r(f.q), a: r(f.a) })),
    },
    footer: {
      rights: r(cfg.site.copyright),
      privacy: r(cfg.footer.privacy),
      terms: r(cfg.footer.terms),
    },
  } as TranslationContent;
}
