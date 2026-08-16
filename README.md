# austinfranklinmusic.com \u2014 static Jekyll site

A free, self-hosted rebuild of the main pages of austinfranklinmusic.com,
built with [Jekyll](https://jekyllrb.com/) so it runs natively on
[GitHub Pages](https://pages.github.com/) at no cost.

## What's included

- `index.html` \u2014 home page
- `about/`, `research/`, `software/`, `music/`, `scores/`, `contact/` \u2014
  the site's six main pages, carried over from the current WordPress site
- `assets/css/style.css` \u2014 a from-scratch manuscript/engraved-plate
  design (staff-line dividers, serif display type, brass accent)
- `assets/images/` \u2014 currently empty; see `assets/images/README.md`
  for exactly which files to add back

**Not included (out of scope for this pass):** the blog/news archive, and
individual piece pages for each composition (Murk, Bloom, etc.) \u2014 the
Music, Software, and Research pages currently link out to those pages on
the original WordPress site where relevant. Ask if you'd like any of those
ported over too.

## Preview it locally

You'll need [Ruby](https://www.ruby-lang.org/) installed, then:

```bash
gem install bundler
bundle install
bundle exec jekyll serve
```

Open `http://localhost:4000` in your browser.

## Deploy to GitHub Pages (free)

1. Create a new GitHub repository (e.g. `austinfranklinmusic`).
2. Push this folder's contents to the repository's `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. In the repo, go to **Settings \u2192 Pages**, and under "Build and
   deployment" set **Source** to "Deploy from a branch," branch `main`,
   folder `/ (root)`. Save.
4. GitHub will build and publish the site at
   `https://YOUR_USERNAME.github.io/YOUR_REPO/` within a minute or two.

### Using your existing domain (austinfranklinmusic.com)

1. In the same repo, add a file named `CNAME` (no extension) containing
   just:
   ```
   austinfranklinmusic.com
   ```
2. At your domain registrar, point the domain at GitHub Pages:
   - Add an `A` record for the root domain to GitHub's IPs:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
     `185.199.111.153`
   - Or add a `CNAME` record for `www` pointing to
     `YOUR_USERNAME.github.io`
3. Back in **Settings \u2192 Pages**, enter `austinfranklinmusic.com` as the
   custom domain and enable "Enforce HTTPS" once it's available.

Full details: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

## Re-adding your images

See `assets/images/README.md` \u2014 drop files in with the listed names and
they'll appear automatically; nothing is broken in the meantime.

## Contact form

GitHub Pages can't process form submissions on its own since there's no
server. The Contact page's form is wired to post to
[Formspree](https://formspree.io) (free tier: 50 submissions/month) \u2014
sign up, grab your form endpoint, and drop it into
`contact/index.md` in place of `YOUR_FORM_ID`. Alternatives: Netlify Forms
(if you ever move hosting to Netlify) or a simple `mailto:` link, which is
already shown above the form.

## The background effect

Click-and-drag (or touch-drag on mobile) anywhere on the page and it
scatters loose notation along the path \u2014 notes from whole down to 32nd,
rests, occasional ties, dynamics markings (p, mf, ff, sfz...), and
crescendo/diminuendo hairpins \u2014 all in faint grey, fading out after a
couple of seconds. Every glyph is drawn upright (never rotated to match
drag direction). It leans on real notation shapes but isn't trying to be
strictly correct: ties connect notes regardless of duration, and there's
a small chance any given note gets an extra "glitch" flag or a slightly
overlong stem. It's a plain `<canvas>` behind all page content
(`assets/js/main.js`, function `initNotationBackground`), so it never
blocks clicks or text selection, and it automatically turns itself off
for visitors with "reduce motion" enabled in their OS accessibility
settings.

To tweak it, the constants near the top of that function control the
feel: `DURATION_WEIGHTS` (how often each note value appears), `MAX_AGE`
(how long a glyph lingers), and `SPAWN_EVERY` (how densely glyphs appear
along a drag). The odds of notes vs. rests vs. dynamics vs. hairpins, and
the tie/glitch probabilities, are inline in the `spawnSymbol` function.

## Updating content

All page content lives in Markdown/HTML in each page's `index.md`/`index.html`.
Edit directly, commit, and push \u2014 GitHub Pages rebuilds automatically.
