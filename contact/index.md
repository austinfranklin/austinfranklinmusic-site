---
layout: default
title: Contact
permalink: /contact/
---
<div class="wrap">

<div class="page-title">
<p class="eyebrow">Contact</p>
<h1>Contact</h1>
</div>

<div class="contact-block">
<p class="eyebrow">Contact information</p>
<p><a class="email" href="mailto:austinalexanderfranklin12@gmail.com">austinalexanderfranklin12@gmail.com</a></p>
<p>Contact me regarding commission inquiries, purchase orders, software deliverables, research opportunities, or private lesson scheduling.</p>
</div>

<hr class="rule">

<p class="eyebrow">Send Me a Message</p>

<!--
  GitHub Pages is static and can't process form submissions on its own.
  This form posts to Formspree's free tier (https://formspree.io) \u2014
  create a free account, get your own form endpoint, and replace
  YOUR_FORM_ID below. Until then this form won't actually send anything.
-->
<form class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  <label for="name">Name (required)</label>
  <input type="text" id="name" name="name" required>

  <label for="email">Email (required)</label>
  <input type="email" id="email" name="email" required>

  <label for="message">Message (required)</label>
  <textarea id="message" name="message" rows="6" required></textarea>

  <button type="submit">Send message</button>
</form>

</div>
