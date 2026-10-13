import type { Metadata } from 'next';
import '../src/index.css';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      </head>
      <body className="bg-[#090b0a] text-neutral-100 antialiased selection:bg-[#ccff00] selection:text-black">
        {children}
      </body>
    </html>
  );
}
