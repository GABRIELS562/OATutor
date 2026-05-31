# Cloudflare Pages Deployment Guide

## Why Cloudflare Pages?

**FREE Forever - Perfect for South African Students:**
- Unlimited bandwidth (no mobile data cost concerns)
- Unlimited requests
- 500 builds/month
- Global CDN with **Johannesburg PoP** (low latency for SA)
- Custom domains with free SSL
- Automatic HTTPS
- HTTP/3 support for unstable networks
- Brotli compression for smaller downloads

## Quick Deploy

### Option 1: CLI Deploy (Fastest)

```bash
# Build and deploy in one command
npm run deploy:cloudflare
```

### Option 2: GitHub Integration (Recommended for Teams)

1. Push code to GitHub
2. Connect repository in Cloudflare dashboard
3. Auto-deploys on every push to `main`

---

## Detailed Setup Guide

### 1. Create Cloudflare Account

1. Go to https://dash.cloudflare.com/sign-up
2. Sign up with email (no credit card required)
3. Verify email address

### 2. Connect GitHub Repository

1. Navigate to **Workers & Pages** in the sidebar
2. Click **Create application** > **Pages** > **Connect to Git**
3. Authorize Cloudflare to access your GitHub
4. Select the `OATutor` repository
5. Configure build settings:

   | Setting | Value |
   |---------|-------|
   | Framework preset | Create React App |
   | Build command | `npm run build:cloudflare` |
   | Build output directory | `build` |
   | Root directory | `/` |

### 3. Set Environment Variables

In Cloudflare Pages > Your project > Settings > Environment variables:

**Required Variables:**
```
REACT_APP_SUPABASE_URL = https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY = your-anon-key
REACT_APP_GROQ_API_KEY = your-groq-api-key
```

**Optional Variables:**
```
REACT_APP_BUILD_TYPE = production
REACT_APP_SITE_NAME = Angelo Tutoring
REACT_APP_GEMINI_API_KEY = your-gemini-api-key
```

> **Security Note**: Never commit API keys to the repository. Always set them in the Cloudflare dashboard.

### 4. Deploy

**Automatic**: Cloudflare deploys on every push to `main`

**Manual via Dashboard**:
1. Go to Pages > Your project
2. Click **Trigger deployment**

**Manual via CLI**:
```bash
npm run deploy:cloudflare
```

---

## Custom Domain Setup

### Adding jagdevops.com

1. Go to Pages > Your project > **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `jagdevops.com`
4. Follow DNS configuration instructions

### DNS Records

If using Cloudflare DNS (recommended):
- CNAME record is auto-configured

If using external DNS:
```
Type: CNAME
Name: @
Target: angelo-tutoring.pages.dev
```

### SSL Certificate

- Automatically provisioned (free)
- Universal SSL enabled by default
- No configuration needed

---

## CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: recursive

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build:cloudflare
        env:
          REACT_APP_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          REACT_APP_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          REACT_APP_GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}
          REACT_APP_BUILD_TYPE: production

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy build --project-name=angelo-tutoring
```

### Required GitHub Secrets

| Secret | Where to get it |
|--------|-----------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare Dashboard > My Profile > API Tokens |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard > Workers & Pages > Account ID |
| `SUPABASE_URL` | Supabase Dashboard > Project Settings > API |
| `SUPABASE_ANON_KEY` | Supabase Dashboard > Project Settings > API |
| `GROQ_API_KEY` | https://console.groq.com/keys |

---

## South African Optimization

### CDN Edge Servers

Cloudflare has Points of Presence in:
- **Johannesburg** - Primary for SA users
- **Cape Town** - Secondary
- Lagos, Nairobi - West/East Africa backup

### Performance Features Enabled

1. **Auto Minify**: JS, CSS, HTML compressed
2. **Brotli Compression**: 15-20% smaller than gzip
3. **HTTP/3**: Better performance on mobile networks
4. **Early Hints**: Preload critical resources
5. **Caching**: Static assets cached for 1 year

### Mobile Data Optimization

The `_headers` file configures:
- Long cache times for static assets
- Efficient compression
- Security headers

---

## Local Testing

### Build Locally
```bash
npm run build:cloudflare
```

### Preview Build
```bash
npm run serve
# Opens at http://localhost:3000
```

### Test with Wrangler
```bash
npx wrangler pages dev build
```

---

## Monitoring & Analytics

### Built-in Cloudflare Analytics

Available in dashboard:
- Requests per day
- Bandwidth usage
- Top pages
- Geographic distribution
- Core Web Vitals

### Error Tracking

The app includes built-in error tracking:
- `GlobalErrorBoundary` catches React errors
- Errors logged to Supabase
- Stored locally for debugging

---

## Troubleshooting

### Build Fails

**"Module not found" errors:**
```bash
# Ensure submodules are cloned
git submodule update --init --recursive
npm install
```

**Memory errors:**
```bash
# Increase Node memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build:cloudflare
```

### Deployment Issues

**"Project not found":**
- Verify project name in `wrangler.toml`
- Check Cloudflare account ID

**Environment variables not working:**
- Variables must start with `REACT_APP_`
- Set in Production environment (not Preview)
- Redeploy after adding variables

### Runtime Issues

**Blank page:**
- Check browser console for errors
- Verify `PUBLIC_URL=/` is set
- Check environment variables

**API errors:**
- Verify Supabase URL is correct
- Check API key permissions
- Verify CORS settings in Supabase

---

## Cost Summary

| Users/Month | Requests | Bandwidth | Cost |
|-------------|----------|-----------|------|
| 1,000 | 100K | 10GB | R0 (FREE) |
| 10,000 | 1M | 100GB | R0 (FREE) |
| 100,000 | 10M | 1TB | R0 (FREE) |
| Unlimited | Unlimited | Unlimited | R0 (FREE) |

Cloudflare Pages is truly free with no hidden limits for static sites.

---

## Related Documentation

- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Pre/post deployment verification
- [README.md](./README.md) - Project overview and setup
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)

---

*Last Updated: February 2026*
