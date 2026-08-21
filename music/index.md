---
layout: default
title: Music
permalink: /music/
---
<div class="wrap">
<div class="page-title"><p class="eyebrow">Music</p><h1>Music</h1></div>

<p class="eyebrow" style="margin-top:2rem;">Ported pages</p>
<div class="wall-grid">
{% for piece in site.music %}
<a class="wall-tile" href="{{ piece.url | relative_url }}">
  {% if piece.image %}<img src="{{ '/assets/images/works/' | append: piece.image | relative_url }}" alt="" onerror="this.style.display='none';">{% endif %}
  <span class="overlay"><span>{{ piece.title }}</span></span>
</a>
{% endfor %}
</div>

<hr class="rule">

<div class="work-group">
<h3>Large Ensemble and Percussion Ensemble</h3>
<ul>
  <li><a href="https://austinfranklinmusic.com/murk/">Murk</a><span class="instrumentation">for orchestra</span></li>
  <li><a href="{{ '/music/theory-of-motion/' | relative_url }}">The Theory of Motion</a><span class="instrumentation">for percussion quartet</span></li>
  <li><a href="{{ '/music/the-clock-and-the-train/' | relative_url }}">The Clock and the Train</a><span class="instrumentation">for wind ensemble</span></li>
  <li><a href="{{ '/music/rhythmic-mosaics/' | relative_url }}">Rhythmic Mosaics</a><span class="instrumentation">for marimba, vibraphone, and live electronics</span></li>
  <li><a href="https://austinfranklinmusic.com/impulse/">ImPULSE</a><span class="instrumentation">for percussion quartet</span></li>
</ul>
</div>

<div class="work-group">
<h3>Chamber Ensemble</h3>
<ul>
  <li><a href="https://austinfranklinmusic.com/fire-on-the-mountain/">Fire on the Mountain</a><span class="instrumentation">for violin and cello</span></li>
  <li><a href="https://austinfranklinmusic.com/in-the-space-between/">In the Space Between</a><span class="instrumentation">for mixed chamber ensemble</span></li>
  <li><a href="{{ '/music/concentric-circles/' | relative_url }}">Concentric Circles</a><span class="instrumentation">for cello, piano, percussion, and live electronics</span></li>
  <li><a href="{{ '/music/small-worlds/' | relative_url }}">Small Worlds</a><span class="instrumentation">for alto saxophone, electric guitar, piano, and percussion</span></li>
  <li><a href="https://austinfranklinmusic.com/cloudburst/">Cloudburst</a><span class="instrumentation">for clarinet, violin, cello, and piano</span></li>
  <li><a href="{{ '/music/lanterns/' | relative_url }}">String Quartet No. 1 &ldquo;Lanterns&rdquo;</a><span class="instrumentation">for string quartet</span></li>
  <li><a href="{{ '/music/flower-of-the-sun/' | relative_url }}">Flower of the Sun</a><span class="instrumentation">for saxophone quartet</span></li>
  <li><a href="https://austinfranklinmusic.com/the-seventh-wave/">The Seventh Wave</a><span class="instrumentation">for woodwind quintet, string orchestra</span></li>
  <li><a href="https://austinfranklinmusic.com/a-thousand-trees/">A Thousand Trees</a><span class="instrumentation">for mixed chamber ensemble</span></li>
</ul>
</div>

<div class="work-group">
<h3>Solo</h3>
<ul>
  <li><a href="{{ '/music/i-o/' | relative_url }}">I/O</a><span class="instrumentation">for snare drum, live electronics, and video</span></li>
  <li><a href="https://austinfranklinmusic.com/sing/">Sing!</a><span class="instrumentation">for singing bowl and live electronics</span></li>
  <li><a href="{{ '/music/bloom/' | relative_url }}">Bloom</a><span class="instrumentation">for violoncello and live electronics</span></li>
</ul>
</div>

<div class="work-group">
<h3>Fixed Media</h3>
<ul>
  <li><a href="https://austinfranklinmusic.com/life-like/">Life Like</a><span class="instrumentation">for 2-channel fixed media and video</span></li>
  <li><a href="https://austinfranklinmusic.com/snafu/">SNAFU</a><span class="instrumentation">for 2-channel fixed media</span></li>
  <li><a href="https://austinfranklinmusic.com/drip/">Drip</a><span class="instrumentation">for 2-channel fixed media</span></li>
  <li><a href="https://austinfranklinmusic.com/sunbeam/">Sunbeam</a><span class="instrumentation">for 2-channel fixed media</span></li>
  <li><a href="https://austinfranklinmusic.com/mirage-and-programma/">Mirage and Programma</a><span class="instrumentation">for 2-channel fixed media</span></li>
</ul>
</div>

<div class="work-group">
<h3>Multimedia and Interactive Art</h3>
<ul>
  <li><a href="https://austinfranklinmusic.com/aerial-glass-web/">Aerial Glass</a><span class="instrumentation">for aerial silks and web browser</span></li>
  <li><a href="{{ '/music/witch-hunt/' | relative_url }}">The Witch Hunt</a><span class="instrumentation">for disklavier</span></li>
  <li><a href="https://austinfranklinmusic.com/daily-meditations/">Daily Meditations</a><span class="instrumentation">for typewriter and web browser</span></li>
  <li><a href="https://austinfranklinmusic.com/collabscape/">Collabscape</a><span class="instrumentation">for web browser and worldwide audience</span></li>
  <li><a href="https://austinfranklinhomes.home.blog/the-player-record/">The Player Record</a><span class="instrumentation">digital instrument using vinyl record player</span></li>
  <li><a href="https://austinfranklinhomes.home.blog/randrum/">Randrum</a><span class="instrumentation">random generative drum machine installation</span></li>
</ul>
</div>

<hr class="rule compact">
<p class="eyebrow">Discography</p>
<p><a href="https://open.spotify.com/album/1ILzwXIXZc0diAv529SjC5">Listen on Spotify</a></p>

</div>
