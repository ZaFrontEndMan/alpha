# Admin Panel & Landing Data Management System

## Overview

This is a **production-ready Admin Panel** built for managing all landing page content for the Alpha Coaching website. It features a robust architecture with centralized data management, API routes, reusable Formik forms, and live preview capabilities.

## 🎯 Features

### ✅ Complete Coverage
- **ALL Landing Page Sections**: Theme, Branding, Hero, Stats, Transformations, Testimonials, Why Choose, Features, Comparison, Packages, How It Works, Inspiration Banner, FAQs, Footer
- **Dynamic Theme Management**: Live CSS variable injection for instant theme updates
- **Image Upload System**: Integrated image upload with Sharp compression and optimization

### ✅ Technical Architecture

#### 1. **Central Data Layer** (`lib/data.ts`)
- Single source of truth: `data/site-data.json`
- Next.js `unstable_cache` with cache tags
- TypeScript interfaces for complete type safety
- `getSiteData()`: Fetches cached data
- `updateSiteData()`: Writes and revalidates cache

#### 2. **API Routes**
- **GET `/api/landing-data`**: Returns full site data
- **POST `/api/landing-data`**: Updates data and triggers revalidation
- **POST `/api/upload`**: Handles multipart image uploads with Sharp processing

#### 3. **Reusable Formik Components** (`components/form/`)
- `<FormInput />`: Text, number, email inputs with validation
- `<FormTextarea />`: Multi-line text areas
- `<FormColorPicker />`: Color picker with hex input
- `<FormImageUpload />`: Image upload with preview and compression
- `<FormArrayField />`: Dynamic array management (bullets, features, etc.)

#### 4. **Admin Panel** (`app/admin/page.tsx`)
- **Split-Screen Layout**: Form editor on left, live preview iframe on right
- **Accordion Sections**: Collapsible sections for better organization
- **Real-time Updates**: Changes persist instantly on save
- **Type-Safe**: Full TypeScript support

#### 5. **Dynamic Theme System** (`app/globals.css`)
- CSS custom properties (CSS variables)
- Dynamically injected from admin form values
- Instant visual updates across the site

---

## 🚀 Getting Started

### Prerequisites
```bash
npm install
```

Ensure these dependencies are installed:
- `formik` - Form state management
- `yup` - Schema validation (optional)
- `sharp` - Image processing
- `next@14+` - Next.js framework

### Running the Admin Panel

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Access the Admin Panel**:
   ```
   http://localhost:3000/admin
   ```

3. **Edit Content**:
   - Expand any section using the accordion headers
   - Edit fields directly
   - Upload images using the image upload components
   - Click "Save Changes" to persist updates

4. **Preview Changes**:
   - The right panel shows a live iframe preview
   - After saving, refresh the preview or click "Preview Site" to open in a new tab

---

## 📂 File Structure

```
/alpha
├── data/
│   └── site-data.json              # Central data file
├── lib/
│   └── data.ts                     # Data layer with caching
├── app/
│   ├── admin/
│   │   └── page.tsx                # Main admin panel
│   ├── api/
│   │   ├── landing-data/
│   │   │   └── route.ts            # Data GET/POST endpoints
│   │   └── upload/
│   │       └── route.ts            # Image upload endpoint
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles & CSS variables
├── components/
│   ├── form/
│   │   ├── FormInput.tsx           # Text input component
│   │   ├── FormTextarea.tsx        # Textarea component
│   │   ├── FormColorPicker.tsx     # Color picker component
│   │   ├── FormImageUpload.tsx     # Image upload component
│   │   └── FormArrayField.tsx      # Array field component
│   └── [other landing components...]
└── public/
    └── images/
        └── uploads/                # Uploaded images directory
```

---

## 🎨 Theme Configuration

The theme system uses CSS variables that can be edited in the **Theme & Styling** section:

| Variable | Default | Description |
|----------|---------|-------------|
| `primaryColor` | `#ccff00` | Main accent color (neon lime) |
| `primaryColorHover` | `#b5e600` | Hover state for primary elements |
| `backgroundColor` | `#090b0a` | Main page background |
| `surfaceColor` | `#0c0f0d` | Cards and sections background |
| `borderColor` | `#262a28` | Borders and dividers |
| `borderRadius` | `0px` | Global border radius |

These variables are automatically injected into the page via inline `<style>` tags in the admin panel.

---

## 📦 Data Structure

The `site-data.json` follows this structure:

```typescript
interface SiteData {
  theme: { ... }
  branding: { ... }
  hero: { ... }
  stats: { ... }
  transformations: { ... }
  testimonials: { reviews: Array<...> }
  whyChoose: { pillars: Array<...> }
  features: { items: Array<...> }
  comparison: { table: Array<...> }
  packages: { items: Array<...> }
  howItWorks: { steps: Array<...> }
  inspirationBanner: { ... }
  faqs: { items: Array<...> }
  footer: { ... }
}
```

Full TypeScript interfaces are defined in `lib/data.ts`.

---

## 🖼️ Image Upload Workflow

1. User clicks "Upload Image" in any `<FormImageUpload />` component
2. File is selected from device
3. Image preview displays immediately (client-side)
4. File uploads to `/api/upload`
5. Server processes with Sharp:
   - Resizes to max 2000x2000
   - Compresses to 85% JPEG quality
   - Saves to `public/images/uploads/`
6. Returns public URL: `/images/uploads/{timestamp}_{filename}`
7. Formik field updates with the public URL

---

## 🔄 Cache Revalidation

When data is saved via `/api/landing-data` POST:

1. Data writes to `data/site-data.json`
2. `revalidateTag('site-data')` is called
3. Next.js invalidates the cached `getSiteData()` result
4. Next page request fetches fresh data

This ensures **instant updates** across all pages without restarting the server.

---

## ⚙️ Form Components API

### `<FormInput />`
```tsx
<FormInput
  name="hero.headline"
  label="Main Headline"
  type="text"
  placeholder="Enter headline..."
  helpText="Displayed at the top of the hero section"
/>
```

### `<FormTextarea />`
```tsx
<FormTextarea
  name="hero.subheadline"
  label="Subheadline"
  rows={3}
  placeholder="Enter subheadline..."
/>
```

### `<FormColorPicker />`
```tsx
<FormColorPicker
  name="theme.primaryColor"
  label="Primary Color"
  helpText="Main brand accent color"
/>
```

### `<FormImageUpload />`
```tsx
<FormImageUpload
  name="hero.heroImage"
  label="Hero Background Image"
  helpText="Recommended: 1920x1080 or larger"
/>
```

### `<FormArrayField />`
```tsx
<FormArrayField
  name="hero.bullets"
  label="Hero Bullet Points"
  placeholder="Enter a benefit..."
/>
```

---

## 🧪 Testing

1. **Test Image Upload**:
   - Navigate to any section with an image field
   - Upload a large image (> 2MB)
   - Verify compression and preview

2. **Test Data Persistence**:
   - Edit multiple fields
   - Click "Save Changes"
   - Refresh the page
   - Verify all changes persisted

3. **Test Cache Revalidation**:
   - Edit a field in admin
   - Save changes
   - Open landing page in new tab
   - Verify changes appear without server restart

4. **Test Live Preview**:
   - Save changes in admin
   - Check the right-panel iframe updates

---

## 🛠️ Customization

### Adding a New Section

1. **Update Data Schema** (`lib/data.ts`):
   ```typescript
   export interface SiteData {
     // ... existing sections
     myNewSection: {
       title: string;
       items: Array<{ id: string; text: string }>;
     };
   }
   ```

2. **Update JSON** (`data/site-data.json`):
   ```json
   {
     "myNewSection": {
       "title": "My New Section",
       "items": []
     }
   }
   ```

3. **Add Form Section** (`app/admin/page.tsx`):
   ```tsx
   <Section
     title="🆕 My New Section"
     isExpanded={expandedSections.myNewSection}
     onToggle={() => toggleSection('myNewSection')}
   >
     <FormInput name="myNewSection.title" label="Title" />
     {/* Add more fields */}
   </Section>
   ```

### Adding Custom Validation

Use Formik's `validate` or integrate Yup:

```tsx
<Formik
  initialValues={siteData}
  validationSchema={siteDataSchema}
  onSubmit={handleSubmit}
>
```

---

## 🔐 Security Considerations

⚠️ **The admin panel has NO authentication by default.**

### Recommended Security Measures:

1. **Add Authentication**:
   - Use NextAuth.js or Clerk
   - Wrap `/admin` route in auth middleware
   - Example:
     ```typescript
     // middleware.ts
     export { default } from "next-auth/middleware"
     export const config = { matcher: ["/admin/:path*"] }
     ```

2. **Environment-Based Access**:
   - Only enable admin in development
   - Disable in production or require admin token

3. **API Route Protection**:
   - Add authentication checks to `/api/landing-data` POST
   - Validate admin JWT tokens

4. **Rate Limiting**:
   - Add rate limiting to upload endpoint
   - Prevent abuse of image uploads

---

## 📝 Best Practices

1. **Always backup `data/site-data.json`** before major edits
2. **Use semantic IDs** for array items (e.g., `testimonial-1`, not random UUIDs)
3. **Compress images** before uploading (even though Sharp does it, start with optimized images)
4. **Test on mobile** - the admin is desktop-first but should work on tablets
5. **Version control** your data file to track content changes over time

---

## 🐛 Troubleshooting

### Issue: "Failed to load site data"
- **Cause**: `data/site-data.json` doesn't exist or is malformed
- **Fix**: Check file exists and is valid JSON

### Issue: Image upload fails
- **Cause**: Directory permissions or Sharp installation issue
- **Fix**: 
  ```bash
  npm install sharp --force
  chmod -R 755 public/images/uploads
  ```

### Issue: Changes don't reflect on landing page
- **Cause**: Cache not revalidating
- **Fix**: Manually restart dev server or check `revalidateTag()` implementation

### Issue: TypeScript errors in admin panel
- **Cause**: Data structure mismatch
- **Fix**: Ensure `site-data.json` matches `SiteData` interface in `lib/data.ts`

---

## 🎓 Learning Resources

- [Next.js App Router](https://nextjs.org/docs/app)
- [Formik Documentation](https://formik.org/docs/overview)
- [Next.js Data Fetching & Caching](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)
- [Sharp Image Processing](https://sharp.pixelplumbing.com/)

---

## 📄 License

This admin panel is part of the Alpha Coaching project. All rights reserved.

---

## 🤝 Support

For questions or issues:
- Check the troubleshooting section above
- Review the code comments in each file
- Contact the development team

---

**Built with ❤️ for Alpha Coaching - Dr. Ahmed Assem**
