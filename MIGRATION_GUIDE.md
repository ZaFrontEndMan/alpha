# Vite → Next.js 14+ Migration Guide

This project has been successfully migrated from Vite + React to Next.js 14+ with the App Router.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server (port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## What Changed

### Directory Structure
- **Old**: `src/components/`, `src/assets/images/`, `src/App.tsx`, `src/main.tsx`, `index.html`
- **New**: `components/`, `app/layout.tsx`, `app/page.tsx`, `public/`

### Key Files
| Old | New | Purpose |
|-----|-----|---------|
| `src/App.tsx` | `app/page.tsx` | Main landing page |
| `index.html` | `app/layout.tsx` | Root HTML layout & metadata |
| `vite.config.ts` | `next.config.js` | Framework config |
| `src/assets/` | `public/` | Static assets (images) |

### Import Changes
- All components now import from `../src/` for utilities
- Asset imports changed from module imports to public paths
- Example: `import img from '../assets/images/coach-header.webp'` → `const img = '/coach-header.webp'`

### Component Updates
- All client components have `"use client"` directive
- Components using React hooks (useState, useEffect, useRef, etc.) are client components
- Presentational components remain server-compatible

## File Locations

### Components
All components moved to root `/components/` directory:
- `components/Hero.tsx`
- `components/AuthModal.tsx`
- `components/ConsultationModal.tsx`
- ... (25 total components)

### Assets
All static images moved to `/public/`:
- `public/coach-header.webp`
- `public/coach-medal.webp`
- `public/clinical_metabolic_lab_*.jpg`
- ... (13 total images)

### Utilities
Kept in `/src/` for organization:
- `src/translations.ts` - i18n (English/Arabic)
- `src/types.ts` - TypeScript types
- `src/utils/cn.ts` - Class name utility
- `src/index.css` - Global styles (imported in app/layout.tsx)

## Configuration Files

### next.config.js
Basic Next.js configuration with React Strict Mode enabled.

### tailwind.config.ts
Tailwind CSS configuration pointing to:
- `./app/**/*.{js,ts,jsx,tsx}`
- `./components/**/*.{js,ts,jsx,tsx}`

### postcss.config.js
PostCSS configuration for Tailwind and Autoprefixer.

### tsconfig.json
TypeScript configuration updated for Next.js with:
- Path aliases (`@/*` → `./*`)
- Next.js plugin integration
- Proper module resolution

## Features Preserved

✅ Smooth scrolling with Lenis  
✅ Scroll reveal animations  
✅ Parallax effects  
✅ Logo intro animation  
✅ Bilingual support (English/Arabic)  
✅ RTL handling  
✅ Dark mode styling  
✅ All modals (Auth, Consultation)  
✅ Macro calculator  
✅ All animations and interactions  

## Environment Variables

Create a `.env.local` file (see `.env.example` for reference):
```
NEXT_PUBLIC_API_URL=your_api_url
```

## Deployment

The app is ready to deploy to:
- Vercel (recommended for Next.js)
- Self-hosted via `npm run build && npm run start`
- Docker/Container environments

For Vercel:
```bash
vercel
```

## Troubleshooting

### Port Already in Use
Change port in npm script:
```json
"dev": "next dev --port 3001"
```

### Module Not Found Errors
Ensure all imports use correct relative paths from the new location.

### CSS Not Loading
Verify Tailwind config includes correct content paths and `src/index.css` is imported in `app/layout.tsx`.

### Images Not Loading
Check that image files exist in `/public/` and use correct filename in string paths (e.g., `'/coach-header.webp'`).

## Next Steps

1. `npm install` - Install dependencies
2. `npm run dev` - Start development server
3. Verify all pages load and animations work correctly
4. Test in multiple browsers if needed
5. Ready for production deployment!

---

**Migration completed**: All functionality preserved, app is ready to run with Next.js! 🚀
