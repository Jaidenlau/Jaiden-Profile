# Jaiden Lau: personal site

A one-page site: the intro video, then every paid project as a one-line list with filters in a sidebar.

- Big projects (`page: true`) link to their own page at `/projects/<id>`.
- Smaller projects expand in place when clicked.

To share one project: big projects have their own page, e.g. `/projects/lead-pipeline` (with its own LinkedIn preview); smaller ones open in place with `/#foreclosure-crm`. Useful for sharing one project in a LinkedIn post.

## The rule for this site

Only projects someone paid for go in `projects`. Side projects and unpaid builds stay off.

## Editing

All text, projects, links and images are set in **`public/js/content.js`**. You shouldn't need to touch anything else.

- **Add a project:** copy one of the objects in `projects`, give it a new `id`, fill it in. The list follows the order in the file, so put your best work first.
- **Add a screenshot:** put it in `public/images/projects/` and set `image: '/images/projects/your-file.jpg'` on the project. It shows beside the write-up when the project is opened (16:10 landscape works best). Without one, a diagram is drawn instead (`cover`).
- **Add the intro video:** either
  - upload it to YouTube as *Unlisted* and paste the id into `introVideo.youtube`, or
  - put an `.mp4` in `public/media/` and set `introVideo.src: '/media/intro.mp4'`. Keep it under ~50 MB (export at 1080p, H.264).
  - If you film vertically on a phone, set `introVideo.aspect: '9 / 16'`.
  - The player is sized from the screen height so the top of "Selected work" is always visible under it on first load.
- **Add the music:** put two files in `public/media/`: `music-intro.mp3` plays once when a visitor clicks the record in the top right, then `music-loop.mp3` repeats with no gap for the rest of their visit. The button only appears once the loop file exists. Set the title and volume in the `music` block in `content.js`. Only use music you have the rights to: this is a public site.
- **Add your CV:** put the PDF in `public/` and set `links.resume`.

Colours and fonts are CSS variables at the top of `public/css/style.css`. The site is always light, even on phones set to dark mode. The drifting dust in the background is drawn by `setupDust()` in `public/js/app.js` (it stays still for visitors who turn on reduced motion).

Project pages open inside the same page rather than loading a new one, so music keeps playing. Their URLs (`/projects/<id>`) still work for sharing and reloading.

## Running locally

No dependencies. Needs Node 18+.

```bash
npm start          # http://localhost:3000
```

## Deploying to Railway

1. On [railway.com](https://railway.com): **New Project → Deploy from GitHub repo → Jaiden-Profile**.
2. Railway detects Node, runs `npm start` and sets `PORT`. No variables needed.
3. **Settings → Networking → Generate Domain** to get a public `*.up.railway.app` URL.
4. Every push to the deployed branch redeploys.

Optional: add a custom domain in the same Networking panel, then set the `SITE_URL` variable to it (e.g. `https://jaidenlau.com`) so link previews always use that domain.

## Putting it on LinkedIn

- **Profile → Contact info → Website**: add the URL, type "Portfolio".
- **Featured section → Add a link**: LinkedIn pulls the preview card from `public/images/og.png`.
- If LinkedIn shows an old preview after you change something, paste the URL into the [Post Inspector](https://www.linkedin.com/post-inspector/) to refresh it.
