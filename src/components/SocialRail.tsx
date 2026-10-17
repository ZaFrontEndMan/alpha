import React from 'react';

/** Brand marks as inline SVG — no icon-library dependency, crisp at any size, zero extra requests. */
const TikTokIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M16.6 5.82c-.9-.78-1.47-1.89-1.6-3.12h-3.03v13.44c0 1.5-1.22 2.72-2.72 2.72a2.72 2.72 0 0 1 0-5.44c.26 0 .51.03.75.1V10.4a5.74 5.74 0 0 0-.75-.05A5.75 5.75 0 1 0 15 16.1V9.33a8.73 8.73 0 0 0 5.1 1.64V7.94a5.75 5.75 0 0 1-3.5-2.12Z" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
  </svg>
);

const YoutubeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.51 3.5 12 3.5 12 3.5s-7.51 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.87.55 9.38.55 9.38.55s7.51 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81ZM9.6 15.6V8.4l6.27 3.6-6.27 3.6Z" />
  </svg>
);

const WhatsappIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.5 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48a9 9 0 0 1-1.66-2.06c-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35ZM12.04 22h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.22-3.76.98 1-3.66-.24-.38A9.9 9.9 0 0 1 2.1 12.06C2.1 6.53 6.56 2.06 12.07 2.06c2.65 0 5.14 1.04 7.01 2.91a9.83 9.83 0 0 1 2.9 7c0 5.53-4.46 10.03-9.94 10.03ZM12.07 0C5.44 0 .05 5.4.05 12.06c0 2.13.56 4.21 1.6 6.04L0 24l6.03-1.58a12 12 0 0 0 6.03 1.62h.01C19 24.04 24.4 18.64 24.4 12s-5.4-12-12.33-12Z" />
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07ZM12 0C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.26-2.91.56a5.88 5.88 0 0 0-2.13 1.38A5.88 5.88 0 0 0 .63 4.14c-.3.76-.5 1.63-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.66 1.34 1.07 2.13 1.38.76.3 1.63.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.63.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63c-.76-.3-1.63-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-10.2a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z" />
  </svg>
);

const SOCIAL_LINKS = [
  { label: 'TikTok', href: 'https://www.tiktok.com/@dr_ahmedassem', Icon: TikTokIcon },
  { label: 'Facebook', href: 'https://www.facebook.com/Dr.AhmedAssem1', Icon: FacebookIcon },
  { label: 'YouTube', href: 'https://www.youtube.com/@Dr_ahmedassem/featured', Icon: YoutubeIcon },
  { label: 'WhatsApp', href: 'https://wa.me/201002146690', Icon: WhatsappIcon },
  { label: 'Instagram', href: 'https://www.instagram.com/dr_ahmedassem/', Icon: InstagramIcon },
];

/**
 * Fixed social rail: vertically centered on the content edge, on top of every section,
 * on both desktop and mobile. Uses CSS logical `end` so it mirrors correctly in Arabic (RTL).
 */
export const SocialRail: React.FC = () => {
  return (
    <div
      className="fixed top-1/2 end-0 z-30 flex -translate-y-1/2 flex-col gap-1.5 sm:gap-2 rounded-s-xl border border-e-0 border-neutral-800/80 bg-[#090b0a]/90 p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-2"
      role="navigation"
      aria-label="Social media"
    >
      {SOCIAL_LINKS.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className="flex h-8 w-8 items-center justify-center text-neutral-300 transition-colors hover:text-[#8cffdb] active:scale-90 sm:h-9 sm:w-9"
        >
          <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
        </a>
      ))}
    </div>
  );
};
