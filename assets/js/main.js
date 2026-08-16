(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".nav-toggle");
    var list = document.getElementById("primary-nav-list");
    if (!toggle || !list) return;

    toggle.addEventListener("click", function () {
      var isOpen = list.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    list.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        list.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  });

  /* ---------- Drag-to-draw sheet music background ----------
     Click-and-drag (or touch-drag) anywhere on the page draws a
     faint, grey staff-and-notes trail that follows the cursor and
     fades out after a couple of seconds. Purely decorative, sits
     behind all page content, and never intercepts clicks. */

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initSheetMusicBackground() {
    var canvas = document.getElementById("sheet-music-bg");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    var dpr = Math.max(1, window.devicePixelRatio || 1);

    function resize() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    if (reduceMotion) return; // no animated effect for reduced-motion users

    var dragging = false;
    var trail = []; // {x, y, t}
    var notes = []; // {x, y, t, stemUp, tilt}
    var lastPoint = null;
    var distSinceNote = 0;

    var MAX_AGE = 2200; // ms a stroke stays visible
    var STAFF_SPACING = 4; // px between the 5 staff lines
    var NOTE_EVERY = 46; // px of drag distance between notes
    var INK = "10,10,10"; // rgb components for grey ink

    function eventPoint(e) {
      if (e.touches && e.touches.length) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    }

    function addPoint(x, y) {
      var now = performance.now();
      if (lastPoint) {
        var dx = x - lastPoint.x;
        var dy = y - lastPoint.y;
        distSinceNote += Math.sqrt(dx * dx + dy * dy);
        if (distSinceNote > NOTE_EVERY) {
          notes.push({
            x: x,
            y: y,
            t: now,
            stemUp: Math.random() > 0.5,
            tilt: (Math.random() - 0.5) * 0.3,
          });
          distSinceNote = 0;
        }
      }
      trail.push({ x: x, y: y, t: now });
      lastPoint = { x: x, y: y };
    }

    function startDrag(e) {
      dragging = true;
      lastPoint = null;
      distSinceNote = 0;
      var p = eventPoint(e);
      addPoint(p.x, p.y);
    }
    function moveDrag(e) {
      if (!dragging) return;
      var p = eventPoint(e);
      addPoint(p.x, p.y);
    }
    function endDrag() {
      dragging = false;
      lastPoint = null;
    }

    window.addEventListener("pointerdown", startDrag, { passive: true });
    window.addEventListener("pointermove", moveDrag, { passive: true });
    window.addEventListener("pointerup", endDrag, { passive: true });
    window.addEventListener("pointercancel", endDrag, { passive: true });
    window.addEventListener("pointerleave", endDrag, { passive: true });

    function drawNote(n, alpha) {
      ctx.save();
      ctx.translate(n.x, n.y);
      ctx.rotate(n.tilt);
      var a = (alpha * 0.3).toFixed(3);
      ctx.fillStyle = "rgba(" + INK + "," + a + ")";
      ctx.strokeStyle = "rgba(" + INK + "," + a + ")";
      ctx.lineWidth = 1.4;

      ctx.beginPath();
      ctx.ellipse(0, 0, 4.6, 3.3, -0.35, 0, Math.PI * 2);
      ctx.fill();

      var stemLen = 18;
      ctx.beginPath();
      if (n.stemUp) {
        ctx.moveTo(4, -1);
        ctx.lineTo(4, -stemLen);
      } else {
        ctx.moveTo(-4, 1);
        ctx.lineTo(-4, stemLen);
      }
      ctx.stroke();
      ctx.restore();
    }

    function frame() {
      var now = performance.now();
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      trail = trail.filter(function (p) {
        return now - p.t < MAX_AGE;
      });
      notes = notes.filter(function (n) {
        return now - n.t < MAX_AGE;
      });

      for (var i = 1; i < trail.length; i++) {
        var p0 = trail[i - 1];
        var p1 = trail[i];
        var age = now - p1.t;
        if (age > MAX_AGE) continue;
        var alpha = Math.max(0, 1 - age / MAX_AGE);
        var dx = p1.x - p0.x;
        var dy = p1.y - p0.y;
        var len = Math.sqrt(dx * dx + dy * dy) || 1;
        var nx = -dy / len;
        var ny = dx / len;
        ctx.strokeStyle = "rgba(" + INK + "," + (alpha * 0.16).toFixed(3) + ")";
        ctx.lineWidth = 1;
        for (var line = -2; line <= 2; line++) {
          var off = line * STAFF_SPACING;
          ctx.beginPath();
          ctx.moveTo(p0.x + nx * off, p0.y + ny * off);
          ctx.lineTo(p1.x + nx * off, p1.y + ny * off);
          ctx.stroke();
        }
      }

      notes.forEach(function (n) {
        var age = now - n.t;
        var alpha = Math.max(0, 1 - age / MAX_AGE);
        if (alpha > 0) drawNote(n, alpha);
      });

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSheetMusicBackground);
  } else {
    initSheetMusicBackground();
  }
})();
