# Angelo Tutoring

**South Africa's Premier Online Tutoring Platform for Grade 10-12 Students**

Angelo Tutoring is an adaptive tutoring system built on the open-source OATutor platform. It provides CAPS-aligned mathematics content with intelligent tutoring features including Bayesian Knowledge Tracing for personalized learning paths.

> **Live Site**: [jagdevops.com](https://jagdevops.com)

---

## Features

### For Students
- **CAPS-Aligned Content**: Grade 10-12 Mathematics following the South African curriculum
- **Adaptive Learning**: Intelligent problem selection based on skill mastery
- **Scaffolded Hints**: Step-by-step guidance when stuck
- **AI-Powered Help**: Dynamic hints using Groq AI (free tier)
- **Progress Tracking**: Gamification with XP, levels, and badges
- **Offline Mode**: PWA support for studying without internet
- **Mobile-Friendly**: Optimized for mobile data and devices

### For Educators
- **Open Source**: Fully customizable and extendable
- **Content Authoring**: JSON-based problem creation
- **Analytics Ready**: Firebase/Supabase logging for research
- **A/B Testing**: Built-in experiment support

---

## Quick Start

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+
- Git

### Installation

```bash
# Clone the repository
git clone --recurse-submodules https://github.com/CAHLR/OATutor.git
cd OATutor

# Install dependencies
npm install

# Start development server
npm run start
```

The app will be available at http://localhost:3001

### Environment Setup

Copy the example environment file:
```bash
cp .env.example .env
```

Configure the following (all services have free tiers):

```env
# Supabase (Free tier - 500MB database)
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key

# Groq AI (Free tier - 500K tokens/day)
REACT_APP_GROQ_API_KEY=your-groq-key

# Optional: Gemini backup (Free tier - 1000 req/day)
REACT_APP_GEMINI_API_KEY=your-gemini-key
```

---

## Deployment

### Cloudflare Pages (Recommended - Free)

Cloudflare Pages offers unlimited bandwidth with a Johannesburg edge server, perfect for South African students.

**Quick Deploy:**
```bash
npm run build:cloudflare
npx wrangler pages deploy build --project-name=angelo-tutoring
```

**Auto-Deploy from GitHub:**
1. Go to [Cloudflare Pages](https://pages.cloudflare.com)
2. Connect your GitHub repository
3. Configure build settings:
   - Build command: `npm run build:cloudflare`
   - Output directory: `build`
4. Set environment variables in dashboard

See [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md) for detailed instructions.

### Other Platforms

**Vercel:**
```bash
npm run build
vercel deploy build
```

**Netlify:**
```bash
npm run build
netlify deploy --prod --dir=build
```

**GitHub Pages:**
```bash
npm run deploy
```

---

## Project Structure

```
OATutor/
├── src/
│   ├── components/          # React components
│   │   ├── problem-layout/  # Problem display components
│   │   ├── gamification/    # XP, badges, levels
│   │   └── ErrorBoundary.js # Error handling
│   ├── config/              # Configuration files
│   ├── content-sources/     # Course content
│   │   └── sa-caps-maths/   # SA CAPS Mathematics
│   │       ├── content-pool/    # Problems and hints
│   │       ├── bkt-params/      # Learning parameters
│   │       ├── coursePlans.json # Lesson structure
│   │       └── skillModel.json  # Skill mappings
│   ├── models/              # BKT algorithm
│   ├── pages/               # Page components
│   ├── platform-logic/      # Core tutoring logic
│   ├── services/            # API services
│   ├── theme/               # SA-branded theme
│   └── util/                # Utilities
├── public/                  # Static assets
├── build/                   # Production build output
├── DEPLOYMENT_CHECKLIST.md  # Deployment guide
└── wrangler.toml            # Cloudflare config
```

---

## Content Structure

### Adding Problems

Problems are organized in the `content-sources/sa-caps-maths/content-pool/` directory:

```
content-pool/
└── algebra-basics/
    ├── algebra-basics.json       # Problem metadata
    └── steps/
        └── algebra-basics-a/
            ├── algebra-basics-a.json           # Step content
            └── tutoring/
                └── algebra-basics-aDefaultPathway.json  # Hints
```

### Problem JSON Format

```json
{
    "id": "algebra-basics",
    "title": "Solving Linear Equations",
    "body": "Solve for $x$: $2x + 5 = 11$",
    "lesson": "Grade 10 - Algebra",
    "courseName": "CAPS Mathematics"
}
```

### Step JSON Format

```json
{
    "id": "algebra-basics-a",
    "stepAnswer": ["3"],
    "problemType": "TextBox",
    "answerType": "numeric",
    "stepTitle": "Find the value of x",
    "stepBody": "What is the value of $x$?"
}
```

---

## Configuration

### config.js Options

| Option | Description | Default |
|--------|-------------|---------|
| `ENABLE_SUPABASE` | Use Supabase for logging | `true` |
| `DO_FOCUS_TRACKING` | Track tab focus events | `true` |
| `AB_TEST_MODE` | Enable A/B testing | `false` |

### Theme Customization

The SA-branded theme is in `src/theme/saTheme.js`:

```javascript
const saTheme = createTheme({
    palette: {
        primary: { main: '#1a1a2e' },    // Deep navy
        secondary: { main: '#e94560' },   // Vibrant coral
        success: { main: '#00b894' },     // Fresh green
    }
});
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server on port 3001 |
| `npm run build` | Build for production |
| `npm run build:cloudflare` | Build for Cloudflare Pages |
| `npm run build:prod` | Build without sourcemaps |
| `npm run deploy:cloudflare` | Build and deploy to Cloudflare |
| `npm test` | Run tests |

---

## API Services

### Supabase (Recommended)

Free tier includes:
- 500MB database
- 2GB file storage
- 50MB bandwidth/day
- Unlimited API requests

Setup:
1. Create project at https://supabase.com
2. Copy URL and anon key to `.env`

### Groq AI

Free tier for AI hints:
- 500K tokens/day
- Fast inference
- No credit card required

Setup:
1. Get API key at https://console.groq.com
2. Add to `.env`

---

## Offline Support

Angelo Tutoring works offline via Service Worker:

1. **First Visit**: App downloads and caches core files
2. **Subsequent Visits**: Loads instantly from cache
3. **Offline**: All cached content available
4. **Background Sync**: Answers sync when back online

Students can study on the bus or in areas with poor connectivity.

---

## Monitoring

### Built-in Features
- Error boundaries catch and log React errors
- Service worker logs caching events
- Supabase stores learning analytics

### Recommended Tools
- **Cloudflare Analytics**: Free with Pages deployment
- **UptimeRobot**: Free uptime monitoring
- **Sentry**: Error tracking (optional)

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Research & Citations

This project is based on OATutor. To credit this system, please cite:

```bibtex
@inproceedings{pardos2023oat,
  title={OATutor: An Open-source Adaptive Tutoring System and Curated Content Library for Learning Sciences Research},
  author={Pardos, Z.A., Tang, M., Anastasopoulos, I., Sheel, S.K., Zhang, E},
  booktitle={Proceedings of the 2023 CHI Conference on Human Factors in Computing Systems},
  pages={1--17},
  organization={Association for Computing Machinery},
  doi={https://doi.org/10.1145/3544548.3581574},
  year={2023}
}
```

---

## License

- **Code**: MIT License (see LICENSE file)
- **Content**: CC BY 4.0 (Creative Commons Attribution)

---

## Support

- **Issues**: GitHub Issues
- **Documentation**: This README and `/docs` folder
- **Community**: [OATutor Discord](https://discord.gg/oatutor)

---

*Built with love for South African students*

*Last Updated: February 2026*
