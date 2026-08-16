# Images to add

This folder is intentionally empty of real photos/artwork (per your request,
so you can re-upload your own files). Drop files in here with these exact
names and they'll automatically show up on the site:

| Filename                          | Used on          | Notes                              |
|------------------------------------|-------------------|-------------------------------------|
| `headshot.jpg`                     | About page        | Currently shows a text placeholder box \u2014 add the `<img>` tag back in `about/index.md` once uploaded |
| `unfinder.png`                     | Software page      | Falls back to filename text if missing |
| `wave-terrain-synthesis.gif`       | Software page      | \u201d |
| `freesound-player.gif`             | Software page      | \u201d |
| `old-spaces-new-rave.png`          | Software page      | \u201d |
| `auxtrument.png`                   | Software page      | \u201d |
| `pnp-maxtools.png`                 | Software page      | \u201d |
| `musical-game-of-life.gif`         | Software page      | \u201d |
| `logo.png`                         | header (black bar)  | Wired up already \u2014 drop in a logo (ideally white/transparent, square-ish) and it replaces the "AF" monogram automatically |

The Software page cards use an `onerror` fallback, so missing images show the
filename instead of a broken-image icon \u2014 nothing will look broken while
you're re-uploading.

To restore the headshot image on the About page, replace this block in
`about/index.md`:

```html
<div class="img-placeholder" aria-label="Headshot placeholder">
  Photo placeholder \u2014 add headshot.jpg to /assets/images/
  (Photo credit: Eduard Teregulov)
</div>
```

with:

```html
<img src="{{ '/assets/images/headshot.jpg' | relative_url }}" alt="Austin Franklin">
<p><em>Photo credit: Eduard Teregulov</em></p>
```
