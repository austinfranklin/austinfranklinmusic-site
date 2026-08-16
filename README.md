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

Click-and-drag (or touch-drag on mobile) anywhere on the page and a faint
grey staff-and-notes trail follows the cursor, fading out after about two
seconds. It's a plain `<canvas>` behind all page content
(`assets/js/main.js`, function `initSheetMusicBackground`), so it never
blocks clicks or text selection. It automatically turns itself off for
visitors with "reduce motion" enabled in their OS accessibility settings.

To tweak it, the constants at the top of that function control the feel:
`MAX_AGE` (how long a stroke lingers), `STAFF_SPACING` (gap between the 5
lines), and `NOTE_EVERY` (how often a note glyph is dropped along the drag).

## Updating content

All page content lives in Markdown/HTML in each page's `index.md`/`index.html`.
Edit directly, commit, and push \u2014 GitHub Pages rebuilds automatically.
