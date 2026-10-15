import { unstable_cache } from 'next/cache';
import { revalidateTag } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

// Define the complete site data structure
export interface SiteData {
  theme: {
    primaryColor: string;
    primaryColorHover: string;
    backgroundColor: string;
    surfaceColor: string;
    borderColor: string;
    textPrimary: string;
    textSecondary: string;
    ringColor: string;
    fontPrimary: string;
    fontHeading: string;
    borderRadius: string;
  };
  branding: {
    siteName: string;
    tagline: string;
    logo: string;
    coachName: string;
    coachTitle: string;
    coachExperienceYears: string;
  };
  hero: {
    tagline: string;
    headline: string;
    subheadline: string;
    heroImages: string[]; // Changed from heroImage to heroImages array
    bullets: string[];
    ctaPrimary: string;
    ctaSecondary: string;
  };
  stats: {
    transformationsCount: string;
    transformationsLabel: string;
    weeksToChange: string;
    weeksLabel: string;
    experienceYears: string;
    experienceLabel: string;
  };
  transformations: {
    tag: string;
    heading: string;
    subheading: string;
    galleryImages: string[];
  };
  testimonials: {
    tag: string;
    heading: string;
    subheading: string;
    reviews: Array<{
      id: string;
      name: string;
      role: string;
      avatar: string;
      quote: string;
      highlight: string;
      stats: string;
    }>;
  };
  whyChoose: {
    tag: string;
    heading: string;
    subheading: string;
    coachImage: string;
    trackRecordCount: string;
    trackRecordLabel: string;
    trackRecordDescription: string;
    pillars: Array<{
      id: string;
      number: string;
      title: string;
      description: string;
    }>;
  };
  features: {
    tag: string;
    heading: string;
    items: Array<{
      id: string;
      icon: string;
      title: string;
      description: string;
    }>;
  };
  comparison: {
    tag: string;
    heading: string;
    subheading: string;
    table: Array<{
      id: string;
      criteria: string;
      drAssem: string;
      others: string;
    }>;
  };
  packages: {
    tag: string;
    heading: string;
    items: Array<{
      id: string;
      name: string;
      priceEGP: number;
      description: string;
      popular: boolean;
      note?: string;
      features: string[];
    }>;
  };
  howItWorks: {
    tag: string;
    heading: string;
    steps: Array<{
      id: string;
      step: string;
      title: string;
      description: string;
    }>;
  };
  inspirationBanner: {
    title: string;
    quote: string;
    pills: string[];
    ctaText: string;
  };
  faqs: {
    tag: string;
    heading: string;
    items: Array<{
      id: string;
      question: string;
      answer: string;
    }>;
  };
  footer: {
    copyrightText: string;
    privacyLink: string;
    termsLink: string;
    socialLinks: {
      instagram: string;
      facebook: string;
      whatsapp: string;
    };
  };
}

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'site-data.json');

/**
 * Get site data with Next.js caching
 * Cache is tagged with 'site-data' for easy revalidation
 */
export const getSiteData = unstable_cache(
  async (): Promise<SiteData> => {
    try {
      const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
      return JSON.parse(fileContent) as SiteData;
    } catch (error) {
      console.error('Error reading site data:', error);
      throw new Error('Failed to load site data');
    }
  },
  ['site-data'],
  {
    tags: ['site-data'],
    revalidate: 3600, // Revalidate every hour as fallback
  }
);

/**
 * Update site data and revalidate cache
 */
export async function updateSiteData(newData: SiteData): Promise<void> {
  try {
    // Write to file with pretty formatting
    await fs.writeFile(
      DATA_FILE_PATH,
      JSON.stringify(newData, null, 2),
      'utf-8'
    );

    // Revalidate the cache tag
    revalidateTag('site-data');
  } catch (error) {
    console.error('Error updating site data:', error);
    throw new Error('Failed to update site data');
  }
}

/**
 * Manually revalidate site data cache
 */
export function revalidateSiteData(): void {
  revalidateTag('site-data');
}
