# 🚀 Quick Start Guide - Admin Panel

## Step 1: Start Development Server

```bash
npm run dev
```

## Step 2: Access Admin Panel

Open your browser and navigate to:

```
http://localhost:3000/admin
```

## Step 3: Edit Content

### Theme & Colors
1. Expand "🎨 Theme & Styling" section
2. Click any color picker to change brand colors
3. Changes will reflect instantly in CSS variables

### Hero Section
1. Expand "🚀 Hero Section"
2. Edit the headline, subheadline, and tagline
3. Upload a hero image using "Upload Image" button
4. Add/remove bullet points using the array field

### Testimonials
1. Expand "💬 Testimonials"
2. Each testimonial card has fields for:
   - Client name
   - Role
   - Quote
   - Stats badge
3. Click "+ Add Review" to add more testimonials
4. Click "Remove" to delete a testimonial

### Packages
1. Expand "💰 Packages & Pricing"
2. Edit package names, prices (in EGP), and descriptions
3. Toggle "Mark as Popular" checkbox for featured packages
4. Add/remove features using the array field
5. Click "+ Add Package" for new packages

### FAQs
1. Expand "❓ FAQs"
2. Edit questions and answers
3. Add new FAQ items with "+ Add FAQ"

## Step 4: Save Changes

Click the **"Save Changes"** button in the top-right corner.

You should see: **"✓ Changes saved successfully!"**

## Step 5: Preview Your Changes

### Option 1: Live Preview Panel
- The right side of the admin panel shows a scaled-down live preview
- Refresh this iframe after saving to see changes

### Option 2: Preview Site Button
- Click **"Preview Site →"** in the top-right
- Opens the landing page in a new tab with all your changes

## 🎯 Common Tasks

### Uploading Images

1. Click "Upload Image" button in any image field
2. Select an image from your computer
3. Image will automatically:
   - Show preview
   - Upload to server
   - Resize and compress (max 2000x2000, 85% quality)
   - Save to `/public/images/uploads/`
4. The public URL is saved in the data

### Adding Array Items (Bullets, Features, etc.)

1. Find any "Array Field" component
2. Type in the input and press "+ Add Item"
3. Edit existing items inline
4. Click "✕" to remove an item

### Changing Theme Colors

1. Use the color picker (click the colored square)
2. Or type a hex code directly (e.g., `#ff0000`)
3. Preview updates in real-time
4. Save to persist changes

### Managing Complex Lists (Testimonials, Packages, FAQs)

Each complex item has:
- Collapsible card with all fields
- "Remove" button at the top-right
- "+ Add [Item]" button at the bottom

## 📁 Where Data is Stored

All your content is saved in:

```
/data/site-data.json
```

This file is version-controlled, so you can:
- Track changes over time with Git
- Rollback to previous versions
- Backup easily

## 🔄 How Cache Works

When you save changes:
1. Data writes to `site-data.json`
2. Next.js cache is automatically revalidated
3. Landing page shows updated content immediately
4. **No server restart needed!**

## ⚠️ Important Notes

### Security
- **The admin panel has NO authentication by default**
- Do NOT deploy to production without adding authentication
- Consider using NextAuth.js, Clerk, or similar

### Image Uploads
- Recommended max size: 5MB
- Supported formats: JPG, PNG, GIF, WEBP
- Images are auto-compressed on upload
- Uploads go to: `public/images/uploads/`

### Data Backup
Before making major changes:
```bash
cp data/site-data.json data/site-data-backup-$(date +%Y%m%d).json
```

## 🐛 Troubleshooting

### Admin panel won't load
```bash
# Check if server is running
npm run dev

# Check for TypeScript errors
npm run lint
```

### Changes not showing
1. Click "Save Changes" button
2. Wait for success message
3. Refresh the preview panel or landing page
4. If still not working, restart the dev server

### Image upload fails
```bash
# Reinstall sharp
npm install sharp --force

# Check upload directory exists
mkdir -p public/images/uploads
```

### Can't see live preview
- The iframe on the right loads your landing page at `/`
- It scales to 80% to fit in the panel
- Click "Preview Site →" to open full-size

## 🎓 Next Steps

1. Read the full documentation: `ADMIN_PANEL_README.md`
2. Explore all sections in the admin panel
3. Customize content for your coaching business
4. Add authentication before deploying to production

## 💡 Pro Tips

1. **Use keyboard shortcuts**: Tab through form fields quickly
2. **Collapse unused sections**: Keep focus on what you're editing
3. **Save frequently**: Click "Save Changes" often to avoid losing work
4. **Preview on mobile**: Use browser DevTools to test responsive design
5. **Version control**: Commit `site-data.json` changes to Git regularly

---

**Need help?** Check `ADMIN_PANEL_README.md` for detailed documentation.

**Ready to go live?** Remember to add authentication and secure your admin routes!
