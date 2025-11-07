# Apnaaapan

A modern React + Tailwind CSS website for Apnaaapan with multiple sections/pages, animations, and a serverless contact API. Optimized for deployment on Vercel.

## Features

- Responsive, mobile-first layout
- Tailwind-powered design system and custom fonts (Dancing Script, Poppins)
- Animated sections (GSAP, Framer Motion ready)
- Client testimonials, services, process, work gallery
- Simple page routing via URL path inspection
- Contact form backend with MongoDB + email notifications
- Vercel-ready serverless function at `api/contact.js`

## Tech Stack

- React 18, react-scripts
- Tailwind CSS 3, PostCSS, Autoprefixer
- GSAP, Framer Motion
- Express (optional local server), Vercel Serverless Functions
- MongoDB (Atlas) + Nodemailer

## Project Structure

```
Apnaaapan/
├── public/
│   ├── index.html
│   └── images/               # Static assets used by pages/components
├── src/
│   ├── App.js                # Entry component with simple path-based routing
│   ├── index.js              # React DOM bootstrap
│   ├── index.css             # Tailwind and global styles
│   ├── components/           # UI sections (Header, Hero, Services, etc.)
│   └── pages/                # Page components (AboutUs, Work, Blog, Contact, ...)
├── api/
│   └── contact.js            # Serverless endpoint for contact form (Vercel)
├── server.js                 # Optional local Express server for /api when self-hosting
├── env.example               # Environment variable template
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.js         # PostCSS configuration
├── vercel.json               # Vercel build and routing config
└── package.json
```

## Scripts

```bash
# Run React dev server (http://localhost:3000)
npm start

# Build static assets to ./build
npm run build

# Optional: run local API server (Express on http://localhost:5000)
npm run server

# Optional: run client and local server together
npm run dev
```

## Getting Started (Local)

1. Install Node.js (LTS recommended).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment template and fill secrets:
   ```bash
   cp env.example .env
   ```
   Required variables (see details below): `MONGODB_URI`, `DATABASE_NAME`, `EMAIL_USER`, `EMAIL_PASS`, `RECIPIENT_EMAIL`.
4. Start the React app:
   ```bash
   npm start
   ```
   Open http://localhost:3000

Optional: If you want to test the API locally with Express, run in another terminal:
```bash
npm run server
```

## Environment Variables

See `env.example` for full list. Summary:

- `MONGODB_URI`: MongoDB Atlas connection string
- `DATABASE_NAME`: Database name (default `apnapan_contacts`)
- `EMAIL_USER`: Sender email (e.g., Gmail)
- `EMAIL_PASS`: Email password or app password (for Gmail use App Password)
- `RECIPIENT_EMAIL`: Destination address for contact form submissions

For Gmail:
- Enable 2FA
- Create an App Password and use it in `EMAIL_PASS`

## API Endpoints

- `POST /api/contact` — stores submission in MongoDB and sends an email notification when email creds are configured.
- `GET /api/health` — health check (available in local Express server).

Notes:
- When deployed to Vercel, `api/contact.js` runs as a Serverless Function. Configure environment variables in the Vercel project settings. See `vercel.json` for build and route config.
- For self-hosting, `server.js` exposes similar functionality on port `5000` by default and serves the React build.

## Deployment (Vercel)

This project is configured for Vercel:

- Static build produced by `npm run build` is served from `/build`.
- Serverless functions live under `/api` (see `api/contact.js`).
- `vercel.json` defines routes and environment variable bindings; set the actual values in Vercel project settings.

Deploy steps:
1. Push the repository to GitHub/GitLab/Bitbucket.
2. Import the repo in Vercel.
3. Add environment variables (`MONGODB_URI`, `DATABASE_NAME`, `EMAIL_USER`, `EMAIL_PASS`, `RECIPIENT_EMAIL`).
4. Deploy. Client routes are handled to `index.html` per `vercel.json`.

## Design Notes

- Base background: `#EFE7D5`
- Brand colors: orange `#F26B2A`, blue `#4A70B0`, yellow `#FFC107`, WhatsApp `#25D366`
- Fonts: Dancing Script (handwriting), Poppins/Inter (content)
- Tailwind utilities extended in `tailwind.config.js`

## Troubleshooting

- If emails are not being sent, verify `EMAIL_USER`/`EMAIL_PASS` and use an App Password for Gmail.
- Ensure your IP has access to MongoDB Atlas or use the "Allow access from anywhere" option for testing.
- For Vercel, confirm env vars are set in the project dashboard; local `.env` is not automatically uploaded.
