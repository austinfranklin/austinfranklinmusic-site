---
layout: default
title: Software
permalink: /software/
---
<div class="wrap-wide">
<div class="page-title"><p class="eyebrow">Software</p><h1>Software</h1></div>

<div class="wall-grid">
{% for item in site.software %}
<a class="wall-tile" href="{{ item.url | relative_url }}">
  {% if item.image %}<img src="{{ '/assets/images/works/' | append: item.image | relative_url }}" alt="" onerror="this.style.display='none';">{% endif %}
  <span class="overlay"><span>{{ item.title }}</span></span>
</a>
{% endfor %}
</div>
</div>
