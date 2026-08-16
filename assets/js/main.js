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

  /* ---------- Generative notation background ----------
     Notation trails the mouse whenever it moves \u2014 no click or drag
     required, just hover. It's a loose scatter of notes (whole down to
     32nd), rests, dynamics, and crescendo/diminuendo hairpins, all
     faint grey and fading out after a few seconds.

     Runs of 3+ consecutive notes have a 25% chance of getting a slur
     drawn across them. Individual notes have an independent, low
     chance of carrying an articulation: accent, marcato (the caret
     mark, reserved for shorter note values), tremolo slashes, a trill,
     or a hollow diamond "harmonic" notehead.

     Every glyph is drawn upright (translate + uniform scale only,
     never rotate), so nothing tilts or reorients with mouse direction.
     Purely decorative, sits behind all page content, never intercepts
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
    var SHORT_DURATIONS = { eighth: true, "16th": true, "32nd": true };
    var FLAG_COUNT = { whole: 0, half: 0, quarter: 0, eighth: 1, "16th": 2, "32nd": 3 };

    var MAX_AGE = 5000; // ms a glyph stays visible
    var SPAWN_EVERY = 200; // px of pointer travel between glyphs (spaced out)
    var GLYPH_SCALE = 1.75; // overall glyph size multiplier (larger)
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

    var lastPoint = null;
    var distSinceSpawn = 0;
    var symbols = []; // {type, x, y, t, ...}
    var lastNote = null; // most recent note-type symbol, for tying
    var noteRun = []; // consecutive note symbols, for slurring
    var slurEvaluatedForRun = false;

    function eventPoint(e) {
      if (e.touches && e.touches.length) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    }

    function resetRun() {
      noteRun = [];
      slurEvaluatedForRun = false;
    }

    function spawnSymbol(x, y) {
      var now = performance.now();
      var jx = x + (Math.random() - 0.5) * 14;
      var jy = y + (Math.random() - 0.5) * 22;
      var r = Math.random();

      if (r < 0.58) {
        var duration = pickWeighted(DURATIONS, DURATION_WEIGHTS);
        var stemUp = Math.random() > 0.5;
        var canTie =
          lastNote && now - lastNote.t < 1200 && Math.random() < 0.24;
        var glitch = Math.random() < 0.09;
        var tremolo = duration !== "whole" && Math.random() < 0.15;

        var sym = {
          type: "note",
          duration: duration,
          x: jx,
          y: jy,
          t: now,
          stemUp: stemUp,
          glitch: glitch,
          tieFrom: canTie ? { x: lastNote.x, y: lastNote.y } : null,
          harmonic: Math.random() < 0.15,
          accent: Math.random() < 0.2,
          marcato: !!SHORT_DURATIONS[duration] && Math.random() < 0.22,
          tremolo: tremolo,
          tremoloCount: tremolo ? 1 + Math.floor(Math.random() * 3) : 0,
          trill: Math.random() < 0.12,
        };
        symbols.push(sym);
        lastNote = sym;

        noteRun.push(sym);
        if (noteRun.length === 3 && !slurEvaluatedForRun) {
          slurEvaluatedForRun = true;
          if (Math.random() < 0.25) {
            symbols.push({
              type: "slur",
              points: noteRun.map(function (n) {
                return { x: n.x, y: n.y };
              }),
              t: now,
            });
          }
        }
      } else if (r < 0.78) {
        resetRun();
        var restDuration = pickWeighted(DURATIONS, DURATION_WEIGHTS);
        symbols.push({
          type: "rest",
          duration: restDuration,
          x: jx,
          y: jy,
          t: now,
        });
      } else if (r < 0.92) {
        resetRun();
        symbols.push({
          type: "dynamic",
          text: DYNAMICS[Math.floor(Math.random() * DYNAMICS.length)],
          x: jx,
          y: jy,
          t: now,
        });
      } else {
        resetRun();
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

    function handleMove(e) {
      var p = eventPoint(e);
      addPoint(p.x, p.y);
    }
    function handleLeave() {
      lastPoint = null;
      distSinceSpawn = 0;
      resetRun();
    }

    // Plain hover triggers this \u2014 no click/drag required.
    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerleave", handleLeave, { passive: true });

    /* ---------- Glyph drawing (local coords: translate + scale only, never rotate) ---------- */

    function drawNote(sym, alpha) {
      var size = 4.6;
      ctx.fillStyle = ink(alpha);
      ctx.strokeStyle = ink(alpha);
      ctx.lineWidth = 1.3;

      if (sym.harmonic) {
        // clear / hollow diamond notehead
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.95);
        ctx.lineTo(size * 0.85, 0);
        ctx.lineTo(0, size * 0.95);
        ctx.lineTo(-size * 0.85, 0);
        ctx.closePath();
        ctx.stroke();
      } else {
        var hollow = sym.duration === "whole" || sym.duration === "half";
        ctx.beginPath();
        ctx.ellipse(0, 0, size, size * 0.72, 0, 0, Math.PI * 2);
        if (hollow) ctx.stroke();
        else ctx.fill();
      }

      var hasStem = sym.duration !== "whole";
      var stemX = 0;
      var stemYend = 0;

      if (hasStem) {
        var stemLen = 19 + (sym.glitch ? 7 : 0);
        stemX = sym.stemUp ? size * 0.92 : -size * 0.92;
        stemYend = sym.stemUp ? -stemLen : stemLen;
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

      /* ---- Articulations ---- */

      if (sym.accent) {
        var ax = -size - 9;
        ctx.beginPath();
        ctx.moveTo(ax, -4);
        ctx.lineTo(ax + 7, 0);
        ctx.lineTo(ax, 4);
        ctx.stroke();
      }

      if (sym.marcato) {
        ctx.beginPath();
        ctx.moveTo(-4, -size - 6);
        ctx.lineTo(0, -size - 13);
        ctx.lineTo(4, -size - 6);
        ctx.stroke();
      }

      if (sym.tremolo && hasStem) {
        var midY = stemYend * 0.5;
        for (var k = 0; k < sym.tremoloCount; k++) {
          var yy = midY + (k - (sym.tremoloCount - 1) / 2) * 6;
          ctx.beginPath();
          ctx.moveTo(stemX - 4, yy + 2.5);
          ctx.lineTo(stemX + 4, yy - 2.5);
          ctx.stroke();
        }
      }

      if (sym.trill) {
        ctx.font = "italic 700 12px Georgia, 'Times New Roman', serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillText("tr", -5, -size - 15);
        ctx.beginPath();
        ctx.moveTo(9, -size - 18);
        ctx.bezierCurveTo(13, -size - 23, 17, -size - 13, 21, -size - 18);
        ctx.bezierCurveTo(25, -size - 23, 29, -size - 13, 33, -size - 18);
        ctx.lineWidth = 1;
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

    function drawSlur(points, alpha) {
      if (points.length < 2) return;
      ctx.strokeStyle = ink(alpha * 0.7);
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y - 9);
      for (var i = 1; i < points.length; i++) {
        var midX = (points[i - 1].x + points[i].x) / 2;
        var midY = (points[i - 1].y + points[i].y) / 2 - 17;
        ctx.quadraticCurveTo(midX, midY, points[i].x, points[i].y - 9);
      }
      ctx.stroke();
    }

    function frame() {
      var now = performance.now();
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      symbols = symbols.filter(function (s) {
        return now - s.t < MAX_AGE;
      });

      // ties and slurs first, underneath the notes they connect
      symbols.forEach(function (s) {
        var age = now - s.t;
        var alpha = Math.max(0, 1 - age / MAX_AGE);
        if (alpha <= 0) return;
        if (s.type === "note" && s.tieFrom) drawTie(s.tieFrom, s, alpha * 0.3);
        else if (s.type === "slur") drawSlur(s.points, alpha * 0.28);
      });

      symbols.forEach(function (s) {
        if (s.type === "slur") return;
        var age = now - s.t;
        var alpha = Math.max(0, 1 - age / MAX_AGE);
        if (alpha <= 0) return;
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.scale(GLYPH_SCALE, GLYPH_SCALE);
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
