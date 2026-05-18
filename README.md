# alpha-home

Personal website for Harrsoft Alpha. Built with [SvelteKit](https://kit.svelte.dev/) and hosted on [Vercel](https://vercel.com).

Live at: <https://alpha-home-phi.vercel.app>

## Pages

- **/** — landing / hero
- **/about** — about me, links to other profiles
- **/writing** — essay index with client-side full-text search
- **/now** — what I'm currently up to
- **/links** — curated link blog
- **/projects** — things I'm building
- **/colophon** — tech stack and design notes
- **/rss.xml** — RSS feed for writing
- **/sitemap.xml** — sitemap for SEO

## Stack

| Layer | Choice |
|-------|--------|
| Framework | SvelteKit |
| Language | TypeScript |
| Database | Railway Postgres (via Drizzle ORM) |
| Hosting | Vercel |
| Styling | CSS custom properties (light/dark theme) |

## Development

```bash
bun install
bun run dev        # dev server on :5173
bun run build      # production build
bun run preview    # preview production build
```

## Writing entries

Writing entries are stored in a Postgres database via Drizzle. The writing page fetches them at build time (SSR + client-side search).

## Theme

Light/dark mode toggle with `prefers-color-scheme` auto-detection and localStorage persistence.
