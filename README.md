# Sejal Praveen Pethkar — Personal Resume Website

Static site (HTML + CSS + tiny JS). No dependencies. All content lives in **`profile.json`**; `build.js` turns it into plain HTML in `dist/`, so recruiters/search engines see the full text in View Source.

## Run locally
```
npm run build        # generates dist/
npx serve dist       # preview (or just open dist/index.html)
```

## Edit content (only `profile.json`)
- CGPA / graduation: `education.items[1].meta`
- Add/remove skill: `skills.groups[].items`
- Govind Milk → confirmed: in `experience.items[0]` change `title`, `status` (e.g. "Participated"), `description`, and add verified `bullets`. Clear `learning` if not needed.
- Add internship/project/certification: copy an object in `items` and edit it. Project `link` is optional (leave `""`).
- Hide a section: set `"show": false` (certifications is hidden until verified).
- LinkedIn: `linkedin`. SEO: `site.title`, `site.description`.
- **Set `site.url`** to your real Vercel URL (canonical, sitemap, robots).
Then run `npm run build` and commit.

## Privacy
No phone, email, home address or photo is included — keep it that way. Contact is LinkedIn only.

## GitHub
```
git init && git add . && git commit -m "Resume website"
git branch -M main
git remote add origin https://github.com/<USERNAME>/<REPO>.git
git push -u origin main
```

## Vercel (free)
1. vercel.com → Add New → Project → import the GitHub repo.
2. Framework: Other. Build `npm run build`, Output `dist` (already in `vercel.json`). Deploy.
3. Copy the live URL into `site.url` in `profile.json`, commit, push.
4. Verify: open the live site → right-click → View Page Source → your text should be visible.
5. Optional indexing: add the site in Google Search Console and submit `/sitemap.xml`. Indexing is not guaranteed.
