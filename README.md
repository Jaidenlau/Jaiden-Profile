# Jaiden Lau: personal site

Two pages:

| Route | Tab | What's on it |
| --- | --- | --- |
| `/` | Work | Intro, video, selected work, every other project with filters. Clicking a project opens its details. |
| `/about` | About | Bio, experience, activities, education, tools. |

Each project has its own link, e.g. `/#plan-b`, which opens that project directly. Useful for sharing one project in a LinkedIn post.

## Editing

All text, projects, links and images are set in **`public/js/content.js`**. You shouldn't need to touch anything else.

- **Add a project:** copy one of the objects in `projects`, give it a new `id`, fill it in. Set `featured: true` to put it in "Selected work" at the top.
- **Add a screenshot:** put it in `public/images/projects/` and set `image: '/images/projects/your-file.jpg'` on the project. 16:10 landscape works best. Without an image, the card draws a diagram (`cover`).
- **Add your photo:** put it in `public/images/` and set `about.photo`. Portrait, roughly 4:5.
- **Add the intro video:** either
  - upload it to YouTube as *Unlisted* and paste the id into `introVideo.youtube`, or
  - put an `.mp4` in `public/media/` and set `introVideo.src: '/media/intro.mp4'`. Keep it under ~50 MB (export at 1080p, H.264).
  - If you film vertically on a phone, set `introVideo.aspect: '9 / 16'`.
- **Add your CV:** put the PDF in `public/` and set `links.resume`.

Colours and fonts are CSS variables at the top of `public/css/style.css`. Dark mode follows the visitor's system setting.

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
