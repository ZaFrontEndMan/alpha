import type { Metadata } from 'next';
import '../src/index.css';
import { getSiteData } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Dr. Ahmed Assem | Elite Fitness & Medical Coaching',
  description: 'Official online coaching platform of Dr. Ahmed Assem. Medically guided fitness, nutrition protocols, macro calculator, and IFBB Pro physique transformations.',
  openGraph: {
    title: 'Dr. Ahmed Assem | Elite Fitness & Medical Coaching',
    description: 'Official online coaching platform of Dr. Ahmed Assem. Medically guided fitness, nutrition protocols, macro calculator, and IFBB Pro physique transformations.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch theme data server-side
  const siteData = await getSiteData();
  const theme = siteData.theme;

  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Cairo:wght@400;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Inject theme CSS variables */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --primary: ${theme.primaryColor};
            --primary-hover: ${theme.primaryColorHover};
            --primary-ring: ${theme.ringColor};
            --radius: ${theme.borderRadius};
            --theme-primary: ${theme.primaryColor};
            --theme-primary-hover: ${theme.primaryColorHover};
            --theme-bg: ${theme.backgroundColor};
            --theme-surface: ${theme.surfaceColor};
            --theme-border: ${theme.borderColor};
            --theme-text-primary: ${theme.textPrimary};
            --theme-text-secondary: ${theme.textSecondary};
            --theme-ring: ${theme.ringColor};
            --theme-border-radius: ${theme.borderRadius};
          }
        `}} />
      </head>
      <body 
        className="antialiased selection:bg-[var(--primary)] selection:text-black" 
        style={{ 
          backgroundColor: theme.backgroundColor, 
          color: theme.textPrimary 
        }}
      >
        {children}
      </body>
    </html>
  );
}
