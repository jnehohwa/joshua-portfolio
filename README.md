# Joshua Nehohwa Portfolio

Personal portfolio website for Joshua Nehohwa, a Software Engineering student and junior software developer based in Cape Town, South Africa.

The site highlights selected software projects, technical skills, education, DevClub leadership, AI data annotation experience, and a downloadable CV.

## Tech Stack

- React
- TypeScript
- Vite
- Framer Motion
- Lucide React
- CSS

## Local Development

```bash
npm install
npm run dev
```

The local development server usually runs at:

```text
http://127.0.0.1:5177/
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Project Structure

```text
src/data/portfolio.ts   Portfolio content, links, projects, skills, timeline
src/App.tsx             Page sections and React components
src/App.css             Main visual system and responsive layout
src/index.css           Global theme and base styles
public/                 Public assets, including downloadable CV
scripts/build_cv.py     CV generation script
```

## Deployment

This is a static Vite app. Production builds output to `dist`, which can be deployed on Vercel, Netlify, GitHub Pages, or any static hosting provider.
