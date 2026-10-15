# 🚀 Admin Panel - Deployment & Production Checklist

## Pre-Deployment Checklist

### ✅ Security (CRITICAL)

- [ ] **Add Authentication System**
  - Install NextAuth.js, Clerk, or Auth0
  - Create admin user accounts
  - Protect `/admin` route with middleware
  - Add session management

- [ ] **Protect API Routes**
  - Add authentication to `/api/landing-data` POST
  - Add authentication to `/api/upload`
  - Implement JWT token validation
  - Add CSRF protection

- [ ] **Rate Limiting**
  - Add rate limiting to upload endpoint
  - Limit API requests per IP/user
  - Consider using `express-rate-limit` or similar

- [ ] **Environment Variables**
  - Create `.env.local` for local development
  - Create `.env.production` for production
  - Add `ADMIN_SECRET` or similar auth keys
  - Never commit `.env` files to Git

### ✅ Data & Storage

- [ ] **Backup System**
  ```bash
  # Create initial backup
  npm run backup
  ```
  - [ ] Set up automated daily backups
  - [ ] Store backups in cloud storage (S3, etc.)
  - [ ] Test restore procedure

- [ ] **Data Validation**
  - [ ] Test all form fields with invalid data
  - [ ] Verify required fields are enforced
  - [ ] Check data types match schema

- [ ] **Image Storage**
  - [ ] Verify upload directory permissions (755)
  - [ ] Consider CDN for image delivery
  - [ ] Set up image optimization pipeline
  - [ ] Test large file uploads (5MB+)

### ✅ Testing

- [ ] **Functional Testing**
  - [ ] All 14 sections load correctly
  - [ ] All form fields update Formik state
  - [ ] Save button triggers API call
  - [ ] Data persists to JSON file
  - [ ] Cache revalidates after save
  - [ ] Preview iframe loads correctly

- [ ] **Image Upload Testing**
  - [ ] Upload JPG, PNG, GIF, WEBP
  - [ ] Verify compression (check file sizes)
  - [ ] Test preview display
  - [ ] Test remove functionality
  - [ ] Upload multiple images consecutively

- [ ] **Array Management Testing**
  - [ ] Add items to arrays
  - [ ] Remove items from arrays
  - [ ] Edit existing array items
  - [ ] Save and verify persistence

- [ ] **Cross-Browser Testing**
  - [ ] Chrome/Edge (Chromium)
  - [ ] Firefox
  - [ ] Safari (if on Mac)

- [ ] **Responsive Testing**
  - [ ] Desktop (1920×1080)
  - [ ] Laptop (1366×768)
  - [ ] Tablet (768×1024)
  - [ ] Mobile (375×667) - limited support expected

### ✅ Performance

- [ ] **Optimize Build**
  ```bash
  npm run build
  ```
  - [ ] Check for build errors
  - [ ] Verify bundle size
  - [ ] Test production build locally

- [ ] **Cache Configuration**
  - [ ] Verify `unstable_cache` works in production
  - [ ] Test revalidation timing (3600s = 1hr)
  - [ ] Monitor cache hit rates

- [ ] **Image Optimization**
  - [ ] Verify Sharp is installed correctly
  - [ ] Test image compression ratios
  - [ ] Check generated image quality

### ✅ Documentation

- [ ] **Team Training**
  - [ ] Share `QUICK_START_ADMIN.md` with content team
  - [ ] Conduct training session on admin panel
  - [ ] Create video walkthrough (optional)

- [ ] **Developer Handoff**
  - [ ] Share `ADMIN_PANEL_README.md`
  - [ ] Document custom sections (if added)
  - [ ] Note any deviations from standard setup

### ✅ Monitoring

- [ ] **Error Tracking**
  - [ ] Set up Sentry or similar
  - [ ] Monitor API route errors
  - [ ] Track upload failures

- [ ] **Analytics**
  - [ ] Track admin panel usage
  - [ ] Monitor API request volume
  - [ ] Track upload success/failure rates

---

## Production Deployment Steps

### 1. Environment Setup

```bash
# Production environment variables
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-here
ADMIN_API_KEY=your-api-key-here
```

### 2. Build & Test

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Build for production
npm run build

# Test production build locally
npm start
```

### 3. Deploy

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Custom Server
```bash
# Upload files via FTP/SSH
# Install dependencies
npm ci --production

# Build
npm run build

# Start with PM2
pm2 start npm --name "alpha-admin" -- start
```

### 4. Post-Deployment

- [ ] Verify admin panel loads at `https://yourdomain.com/admin`
- [ ] Test authentication flow
- [ ] Make a test edit and save
- [ ] Verify changes appear on landing page
- [ ] Test image upload in production
- [ ] Check error tracking dashboard
- [ ] Monitor server logs

---

## Security Best Practices

### Authentication Example (NextAuth.js)

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Verify credentials against database
        if (credentials?.username === "admin" && 
            credentials?.password === process.env.ADMIN_PASSWORD) {
          return { id: "1", name: "Admin", email: "admin@example.com" }
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = "admin"
      return token
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

### Middleware Protection

```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token }) => token?.role === "admin"
  },
})

export const config = { 
  matcher: [
    "/admin/:path*",
    "/api/landing-data",
    "/api/upload"
  ] 
}
```

---

## Backup & Recovery

### Manual Backup

```bash
# Create backup
npm run backup

# Output: data/backups/site-data-YYYYMMDD_HHMMSS.json
```

### Automated Backup (Cron)

```bash
# Add to crontab (daily at 2 AM)
0 2 * * * cd /path/to/alpha && npm run backup
```

### Restore from Backup

```bash
# List backups
ls -lh data/backups/

# Restore specific backup
cp data/backups/site-data-20260101_020000.json data/site-data.json

# Restart server to clear cache
pm2 restart alpha-admin
```

---

## Monitoring & Maintenance

### Weekly Checklist

- [ ] Review error logs
- [ ] Check disk space for uploads
- [ ] Review backup storage
- [ ] Test admin login
- [ ] Verify landing page loads

### Monthly Checklist

- [ ] Update dependencies
  ```bash
  npm outdated
  npm update
  ```
- [ ] Review and delete old backups
- [ ] Audit admin user access
- [ ] Performance check (Core Web Vitals)

### Quarterly Checklist

- [ ] Security audit
- [ ] Review and optimize images
- [ ] Check for Next.js updates
- [ ] Backup entire project

---

## Troubleshooting in Production

### Issue: 500 Error on Save

**Check**:
- File system permissions on `data/site-data.json`
- Server has write access to data directory
- JSON file is not corrupted

**Fix**:
```bash
chmod 644 data/site-data.json
chmod 755 data/
```

### Issue: Images Not Uploading

**Check**:
- Sharp is installed (`npm ls sharp`)
- Upload directory exists and is writable
- File size limits in Next.js config

**Fix**:
```bash
npm install sharp --force
mkdir -p public/images/uploads
chmod 755 public/images/uploads
```

### Issue: Cache Not Revalidating

**Check**:
- `revalidateTag` is called after save
- Cache is enabled in production
- Next.js caching is configured

**Fix**:
- Restart server
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`

---

## Rollback Plan

If something goes wrong:

1. **Restore Data**:
   ```bash
   cp data/backups/[latest-backup].json data/site-data.json
   ```

2. **Revert Code** (if needed):
   ```bash
   git revert HEAD
   git push
   ```

3. **Redeploy**:
   ```bash
   vercel --prod
   # or
   pm2 restart alpha-admin
   ```

---

## Contact & Support

- **Technical Issues**: Check `ADMIN_PANEL_README.md`
- **User Guide**: See `QUICK_START_ADMIN.md`
- **Architecture**: Review system diagram in README

---

## Sign-Off

- [ ] All checklist items completed
- [ ] Authentication implemented and tested
- [ ] Backups configured
- [ ] Team trained on admin panel
- [ ] Production deployment successful
- [ ] Monitoring active
- [ ] Documentation complete

**Deployed By**: _________________  
**Date**: _________________  
**Environment**: _________________  
**Admin URL**: _________________  

---

**🎉 Admin Panel Ready for Production!**
