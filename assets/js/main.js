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

  /* ---------- Drag-to-draw generative notation background ----------
     Click-and-drag (or touch-drag) anywhere on the page scatters loose
     notation along the path: notes from whole down to 32nd, rests,
     the occasional tie, dynamics markings, and crescendo/diminuendo
     hairpins. It leans on real notation shapes but doesn't try to be
     a strict, correct score \u2014 durations, ties, and flourishes are
     randomized and sometimes break the rules on purpose.

     Every glyph is drawn upright (translate only, never rotate), so
     nothing tilts or reorients based on drag direction. Purely
     decorative, sits behind all page content, never intercepts
     clicks, and turns itself off for reduced-motion users. */

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initNotationBackground() {
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

    var DURATIONS = ["whole", "half", "quarter", "eighth", "16th", "32nd"];
    var DURATION_WEIGHTS = [0.05, 0.12, 0.28, 0.28, 0.17, 0.10];
    var DYNAMICS = ["pp", "p", "mp", "mf", "f", "ff", "sfz", "fp"];
    var MAX_AGE = 2600; // ms a glyph stays visible
    var SPAWN_EVERY = 42; // px of drag distance between glyphs
    var INK = "12,13,14";

    function ink(a) {
      return "rgba(" + INK + "," + a.toFixed(3) + ")";
    }

    function pickWeighted(items, weights) {
      var r = Math.random();
      var sum = 0;
      for (var i = 0; i < items.length; i++) {
        sum += weights[i];
        if (r <= sum) return items[i];
      }
      return items[items.length - 1];
    }

    var dragging = false;
    var lastPoint = null;
    var distSinceSpawn = 0;
    var symbols = []; // {type, x, y, t, ...}
    var lastNote = null; // most recent note-type symbol, for tying

    function eventPoint(e) {
      if (e.touches && e.touches.length) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    }

    function spawnSymbol(x, y) {
      var now = performance.now();
      var jx = x + (Math.random() - 0.5) * 8;
      var jy = y + (Math.random() - 0.5) * 14;
      var r = Math.random();

      if (r < 0.6) {
        var duration = pickWeighted(DURATIONS, DURATION_WEIGHTS);
        var stemUp = Math.random() > 0.5;
        var canTie =
          lastNote && now - lastNote.t < 1100 && Math.random() < 0.24;
        var glitch = Math.random() < 0.09;
        var sym = {
          type: "note",
          duration: duration,
          x: jx,
          y: jy,
          t: now,
          stemUp: stemUp,
          glitch: glitch,
          tieFrom: canTie ? { x: lastNote.x, y: lastNote.y } : null,
        };
        symbols.push(sym);
        lastNote = sym;
      } else if (r < 0.8) {
        var restDuration = pickWeighted(DURATIONS, DURATION_WEIGHTS);
        symbols.push({
          type: "rest",
          duration: restDuration,
          x: jx,
          y: jy,
          t: now,
        });
      } else if (r < 0.93) {
        symbols.push({
          type: "dynamic",
          text: DYNAMICS[Math.floor(Math.random() * DYNAMICS.length)],
          x: jx,
          y: jy,
          t: now,
        });
      } else {
        symbols.push({
          type: "hairpin",
          crescendo: Math.random() > 0.5,
          x: jx,
          y: jy,
          t: now,
        });
      }
    }

    function addPoint(x, y) {
      if (lastPoint) {
        var dx = x - lastPoint.x;
        var dy = y - lastPoint.y;
        distSinceSpawn += Math.sqrt(dx * dx + dy * dy);
        if (distSinceSpawn > SPAWN_EVERY) {
          spawnSymbol(x, y);
          distSinceSpawn = 0;
        }
      } else {
        spawnSymbol(x, y);
      }
      lastPoint = { x: x, y: y };
    }

    function startDrag(e) {
      dragging = true;
      lastPoint = null;
      distSinceSpawn = 0;
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

    /* ---------- Glyph drawing (all local coords, no rotation) ---------- */

    var FLAG_COUNT = { whole: 0, half: 0, quarter: 0, eighth: 1, "16th": 2, "32nd": 3 };

    function drawNote(sym, alpha) {
      var size = 4.6;
      var hollow = sym.duration === "whole" || sym.duration === "half";
      ctx.fillStyle = ink(alpha);
      ctx.strokeStyle = ink(alpha);
      ctx.lineWidth = 1.3;

      ctx.beginPath();
      ctx.ellipse(0, 0, size, size * 0.72, 0, 0, Math.PI * 2);
      if (hollow) ctx.stroke();
      else ctx.fill();

      if (sym.duration === "whole") return;

      var stemLen = 19 + (sym.glitch ? 8 : 0);
      var stemX = sym.stemUp ? size * 0.92 : -size * 0.92;
      var stemYend = sym.stemUp ? -stemLen : stemLen;
      ctx.beginPath();
      ctx.moveTo(stemX, 0);
      ctx.lineTo(stemX, stemYend);
      ctx.stroke();

      var flags = FLAG_COUNT[sym.duration] || 0;
      if (sym.glitch) flags += 1; // occasional rule-breaking extra flag
      for (var i = 0; i < flags; i++) {
        var fy = stemYend + (sym.stemUp ? i * 7 : -i * 7);
        ctx.beginPath();
        if (sym.stemUp) {
          ctx.moveTo(stemX, fy);
          ctx.bezierCurveTo(stemX + 8, fy + 4, stemX + 8, fy + 12, stemX + 1, fy + 14);
        } else {
          ctx.moveTo(stemX, fy);
          ctx.bezierCurveTo(stemX - 8, fy - 4, stemX - 8, fy - 12, stemX - 1, fy - 14);
        }
        ctx.stroke();
      }
    }

    function drawRest(sym, alpha) {
      ctx.fillStyle = ink(alpha);
      ctx.strokeStyle = ink(alpha);
      ctx.lineWidth = 1.5;

      switch (sym.duration) {
        case "whole":
          ctx.fillRect(-5, -1, 10, 4);
          break;
        case "half":
          ctx.fillRect(-5, -4, 10, 4);
          break;
        case "quarter":
          ctx.beginPath();
          ctx.moveTo(-1, -13);
          ctx.bezierCurveTo(5, -9, -5, -5, 2, -1);
          ctx.bezierCurveTo(-4, 3, 6, 7, -1, 11);
          ctx.stroke();
          break;
        default:
          var hooks = sym.duration === "eighth" ? 1 : sym.duration === "16th" ? 2 : 3;
          ctx.beginPath();
          ctx.moveTo(2, -13);
          ctx.lineTo(-3, 13);
          ctx.stroke();
          for (var i = 0; i < hooks; i++) {
            var hy = -11 + i * 7;
            ctx.beginPath();
            ctx.moveTo(2, hy);
            ctx.bezierCurveTo(9, hy + 2, 9, hy + 7, 2, hy + 9);
            ctx.stroke();
          }
          ctx.beginPath();
          ctx.ellipse(2.5, -13, 2, 2, 0, 0, Math.PI * 2);
          ctx.fill();
      }
    }

    function drawDynamic(sym, alpha) {
      ctx.fillStyle = ink(Math.min(1, alpha * 1.15));
      ctx.font = "italic 700 15px Georgia, 'Times New Roman', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(sym.text, 0, 0);
    }

    function drawHairpin(sym, alpha) {
      var w = 28;
      var h = 9;
      ctx.strokeStyle = ink(alpha);
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      if (sym.crescendo) {
        ctx.moveTo(-w / 2, 0);
        ctx.lineTo(w / 2, -h / 2);
        ctx.moveTo(-w / 2, 0);
        ctx.lineTo(w / 2, h / 2);
      } else {
        ctx.moveTo(-w / 2, -h / 2);
        ctx.lineTo(w / 2, 0);
        ctx.moveTo(-w / 2, h / 2);
        ctx.lineTo(w / 2, 0);
      }
      ctx.stroke();
    }

    function drawTie(from, to, alpha) {
      ctx.strokeStyle = ink(alpha * 0.75);
      ctx.lineWidth = 1.2;
      var midX = (from.x + to.x) / 2;
      var topY = Math.min(from.y, to.y) - 12;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y - 7);
      ctx.quadraticCurveTo(midX, topY, to.x, to.y - 7);
      ctx.stroke();
    }

    function frame() {
      var now = performance.now();
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      symbols = symbols.filter(function (s) {
        return now - s.t < MAX_AGE;
      });

      // ties first, underneath the notes they connect
      symbols.forEach(function (s) {
        if (s.type === "note" && s.tieFrom) {
          var age = now - s.t;
          var alpha = Math.max(0, 1 - age / MAX_AGE) * 0.3;
          if (alpha > 0) drawTie(s.tieFrom, s, alpha);
        }
      });

      symbols.forEach(function (s) {
        var age = now - s.t;
        var alpha = Math.max(0, 1 - age / MAX_AGE);
        if (alpha <= 0) return;
        ctx.save();
        ctx.translate(s.x, s.y);
        if (s.type === "note") drawNote(s, alpha * 0.32);
        else if (s.type === "rest") drawRest(s, alpha * 0.3);
        else if (s.type === "dynamic") drawDynamic(s, alpha * 0.3);
        else if (s.type === "hairpin") drawHairpin(s, alpha * 0.26);
        ctx.restore();
      });

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNotationBackground);
  } else {
    initNotationBackground();
  }
})();
