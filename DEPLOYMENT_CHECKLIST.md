# Angelo Tutoring - Production Deployment Checklist

A comprehensive checklist for deploying Angelo Tutoring to production on Cloudflare Pages.

---

## Pre-Deployment Checks

### 1. Environment Configuration

- [ ] **Supabase Setup Complete**
  - [ ] Supabase project created at https://supabase.com
  - [ ] Database tables created (users, progress, sessions)
  - [ ] Row Level Security (RLS) policies configured
  - [ ] `REACT_APP_SUPABASE_URL` ready
  - [ ] `REACT_APP_SUPABASE_ANON_KEY` ready

- [ ] **AI Service Keys Ready**
  - [ ] Groq API key obtained from https://console.groq.com
  - [ ] `REACT_APP_GROQ_API_KEY` ready
  - [ ] (Optional) Gemini API key as backup from https://makersuite.google.com

- [ ] **Environment Files Verified**
  - [ ] `.env.production` contains correct values
  - [ ] No hardcoded secrets in source code
  - [ ] API keys not committed to git

### 2. Code Quality

- [ ] **Build Passes Without Errors**
  ```bash
  npm run build:cloudflare
  ```
  - [ ] Build completes successfully
  - [ ] Only warnings (no errors)
  - [ ] Bundle size acceptable (< 2MB gzipped recommended)

- [ ] **Linting Passes**
  ```bash
  npm run lint
  ```

- [ ] **No Debug Code in Production**
  - [ ] Review console.log statements (acceptable in service worker and development paths)
  - [ ] Debug mode disabled in config (`debug: false`)
  - [ ] No test data in production content

### 3. Content Verification

- [ ] **SA CAPS Content Ready**
  - [ ] Grade 10 Maths content verified
  - [ ] Grade 11 Maths content verified
  - [ ] Grade 12 Maths content verified
  - [ ] All problems have hints/scaffolds
  - [ ] Skill model tags are accurate

- [ ] **Course Plans Configured**
  - [ ] `coursePlans.json` has all lessons
  - [ ] Learning objectives set correctly
  - [ ] BKT parameters configured

---

## Build Verification Steps

### 1. Local Build Test

```bash
# Clean previous build
rm -rf build

# Run production build
npm run build:cloudflare

# Verify build output
ls -la build/
du -sh build/
```

**Expected Output:**
- Build folder created (~90MB total, ~1.4MB gzipped JS)
- `index.html` present
- `static/js/main.*.js` present
- `static/css/main.*.css` present
- `_headers` and `_redirects` for Cloudflare
- `service-worker.js` for PWA

### 2. Local Preview Test

```bash
# Install serve if needed
npm install -g serve

# Serve the build locally
serve -s build -l 3000
```

**Test Checklist:**
- [ ] Homepage loads at http://localhost:3000
- [ ] Grade selection works
- [ ] Lesson selection works
- [ ] Problems display correctly
- [ ] Math rendering (KaTeX) works
- [ ] Hints expand and display
- [ ] Answer submission works
- [ ] Progress saves to localStorage
- [ ] PWA installs correctly
- [ ] Offline mode works (disconnect network)

### 3. Bundle Analysis

```bash
# Check JS bundle size
ls -lh build/static/js/*.js

# Check CSS bundle size
ls -lh build/static/css/*.css
```

**Size Targets:**
| Asset | Target | Maximum |
|-------|--------|---------|
| Main JS (gzipped) | < 1MB | 2MB |
| Main CSS (gzipped) | < 50KB | 100KB |
| Total build | < 100MB | 150MB |

---

## Cloudflare Pages Deployment

### 1. Initial Setup (First Time Only)

1. **Create Cloudflare Account**
   - Sign up at https://dash.cloudflare.com
   - No credit card required

2. **Connect Repository**
   - Navigate to Workers & Pages
   - Click "Create application" > "Pages"
   - Connect to GitHub
   - Select `OATutor` repository

3. **Configure Build Settings**
   ```
   Framework preset: Create React App
   Build command: npm run build:cloudflare
   Build output directory: build
   Root directory: /
   ```

4. **Set Environment Variables**
   In Cloudflare Pages > Settings > Environment variables:
   ```
   REACT_APP_SUPABASE_URL = https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY = your-anon-key
   REACT_APP_GROQ_API_KEY = your-groq-key
   REACT_APP_BUILD_TYPE = production
   REACT_APP_SITE_NAME = Angelo Tutoring
   ```

### 2. Deploy

**Option A: Automatic (Recommended)**
- Push to `main` branch
- Cloudflare auto-deploys

**Option B: Manual CLI**
```bash
npm run deploy:cloudflare
```

**Option C: Manual Upload**
1. Run `npm run build:cloudflare`
2. Go to Cloudflare Pages dashboard
3. Upload `build` folder

### 3. Custom Domain Setup

1. Go to Cloudflare Pages > Custom domains
2. Add domain: `jagdevops.com`
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

---

## Post-Deployment Verification

### 1. Smoke Tests

- [ ] **Homepage Loads**
  - Visit https://jagdevops.com
  - Page loads within 3 seconds
  - No JavaScript errors in console

- [ ] **Core Features Work**
  - [ ] Grade selection (10, 11, 12)
  - [ ] Subject selection (Maths)
  - [ ] Lesson selection
  - [ ] Problem display
  - [ ] Answer submission
  - [ ] Hint system
  - [ ] Progress tracking

- [ ] **PWA Features**
  - [ ] App installable on mobile
  - [ ] Works offline after first load
  - [ ] Service worker registered

### 2. Performance Checks

```bash
# Run Lighthouse audit
# In Chrome DevTools > Lighthouse > Run audit
```

**Targets:**
| Metric | Target | Minimum |
|--------|--------|---------|
| Performance | > 80 | 60 |
| Accessibility | > 90 | 85 |
| Best Practices | > 90 | 80 |
| SEO | > 90 | 85 |
| PWA | > 80 | 70 |

### 3. Cross-Browser Testing

- [ ] Chrome (Desktop & Mobile)
- [ ] Firefox (Desktop)
- [ ] Safari (Desktop & iOS)
- [ ] Edge (Desktop)

### 4. Mobile Testing

- [ ] Responsive design on phone
- [ ] Touch interactions work
- [ ] Virtual keyboard doesn't break layout
- [ ] Math input works on mobile

---

## Monitoring Setup

### 1. Cloudflare Analytics

- Automatically enabled with Pages
- View in: Pages > Your project > Analytics

### 2. Error Tracking

The app includes built-in error tracking via:
- `GlobalErrorBoundary` component
- Firebase/Supabase error logging
- Service worker error handling

### 3. Recommended Additional Tools

- **Uptime Monitoring**: UptimeRobot (free)
  - Monitor: https://jagdevops.com
  - Alert interval: 5 minutes

- **Real User Monitoring**: Cloudflare Web Analytics
  - Already included with Cloudflare

---

## Rollback Procedure

If issues are found after deployment:

### Option 1: Redeploy Previous Version
1. Go to Cloudflare Pages > Deployments
2. Find the previous working deployment
3. Click "..." > "Rollback to this deployment"

### Option 2: Revert Code
```bash
# Find last working commit
git log --oneline -10

# Revert to that commit
git revert HEAD~1

# Push to trigger redeploy
git push origin main
```

---

## Troubleshooting Guide

### Build Fails

**Issue: Memory error during build**
```
FATAL ERROR: Reached heap limit
```
**Solution:**
```bash
# Increase Node memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build:cloudflare
```

**Issue: Module not found**
```
Module not found: Can't resolve '@components/...'
```
**Solution:**
```bash
# Check config-overrides.js alias configuration
# Ensure path exists in src/components/
```

### Runtime Errors

**Issue: Blank page after deploy**
- Check browser console for errors
- Verify environment variables are set in Cloudflare
- Check that `PUBLIC_URL=/` is set

**Issue: API calls failing**
- Verify Supabase URL is correct
- Check CORS settings in Supabase
- Verify API key has correct permissions

**Issue: Math not rendering**
- KaTeX CSS should load from CDN
- Check network tab for blocked resources
- Verify CSP headers allow CDN

### Performance Issues

**Issue: Slow initial load**
- Enable Cloudflare caching
- Check bundle size
- Consider code splitting

**Issue: High memory usage**
- Clear old service worker caches
- Check for memory leaks in React components

---

## Security Checklist

- [ ] No secrets in frontend code
- [ ] Supabase RLS policies enabled
- [ ] HTTPS enforced (Cloudflare automatic)
- [ ] CSP headers configured (in `_headers`)
- [ ] API keys have minimal permissions
- [ ] No sensitive data in localStorage

---

## Contact Information

**Technical Issues:**
- GitHub Issues: [Repository URL]
- Email: [Support Email]

**Cloudflare Support:**
- Dashboard: https://dash.cloudflare.com
- Status: https://www.cloudflarestatus.com

---

*Last Updated: February 2026*
*Version: 1.0.0*
