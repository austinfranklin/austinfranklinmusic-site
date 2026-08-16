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

Notation trails your mouse whenever it moves anywhere on the page \u2014
no click or drag required, just hover. It scatters notes (whole down to
32nd), rests, dynamics markings (p, mf, ff, sfz...), and crescendo/
diminuendo hairpins, all in faint grey, fading out after a few seconds.

A run of 3 or more consecutive notes has a 25% chance of getting a slur
drawn across it. Individual notes each independently roll a low chance
of carrying an articulation: an accent, a marcato caret (only on eighth
notes and shorter), tremolo slashes through the stem, a trill marking,
or a hollow diamond "harmonic" notehead in place of the normal one.
There's also a small chance any note gets a rule-breaking "glitch" \u2014
an extra flag that doesn't belong to its duration, or an overlong stem.

Every glyph is drawn upright (translate + uniform scale only, `ctx`
is never rotated), so nothing tilts or reorients based on mouse
direction. It's a plain `<canvas>` behind all page content
(`assets/js/main.js`, function `initNotationBackground`), so it never
blocks clicks or text selection, and it automatically turns itself off
for visitors with "reduce motion" enabled in their OS accessibility
settings.

To tweak it, the constants near the top of that function control the
feel: `DURATION_WEIGHTS` (how often each note value appears), `MAX_AGE`
(how long a glyph lingers), `SPAWN_EVERY` (how far apart glyphs appear
along the mouse's path), and `GLYPH_SCALE` (overall size). The odds of
notes vs. rests vs. dynamics vs. hairpins are inline in `spawnSymbol`,
as are each articulation's individual probability (currently: harmonic
15%, accent 20%, marcato 22%, tremolo 15%, trill 12%, slur 25% per
qualifying run, tie 24%, glitch 9%).

## Updating content

All page content lives in Markdown/HTML in each page's `index.md`/`index.html`.
Edit directly, commit, and push \u2014 GitHub Pages rebuilds automatically.
