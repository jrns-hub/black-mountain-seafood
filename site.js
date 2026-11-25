/* Black Mountain Seafood shared script. Edit HOURS / CLOSED here and every page updates. */
(function (root) {
  // Minutes after midnight, Eastern time. 0=Sun ... 5=Fri, 6=Sat
  var HOURS = { 5: [600, 1080], 6: [600, 780] };
  // Add a date here whenever the shop takes a weekend off.
  var CLOSED = {
    "2026-11-27": "Closed for Thanksgiving weekend",
    "2026-11-28": "Closed for Thanksgiving weekend"
  };
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  function t(m) { var h = Math.floor(m / 60), mm = m % 60, ap = h >= 12 ? "pm" : "am"; h = h % 12 || 12; return h + (mm ? ":" + String(mm).padStart(2, "0") : "") + ap; }
  function ymd(y, m, d) { var x = new Date(Date.UTC(y, m - 1, d)); return x.toISOString().slice(0, 10); }

  function nyParts(date) {
    var p = {};
    new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", hour12: false })
      .formatToParts(date).forEach(function (x) { if (x.type !== "literal") p[x.type] = +x.value; });
    var wd = new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay();
    return { y: p.year, m: p.month, d: p.day, wd: wd, mins: (p.hour % 24) * 60 + p.minute };
  }

  // Pure: returns {state:'open'|'soon'|'closed', label, sub, minsToOpen, note}
  function statusAt(date) {
    var n = nyParts(date), today = ymd(n.y, n.m, n.d), h = HOURS[n.wd];
    if (h && !CLOSED[today] && n.mins >= h[0] && n.mins < h[1]) {
      var left = h[1] - n.mins;
      return { state: left <= 60 ? "soon" : "open", label: left <= 60 ? "Open, closing soon" : "Open now", sub: "until " + t(h[1]) + " today", minsToOpen: 0 };
    }
    var note = CLOSED[today] || "";
    for (var i = 0; i < 21; i++) {
      var wd = (n.wd + i) % 7, hh = HOURS[wd];
      var dt = new Date(Date.UTC(n.y, n.m - 1, n.d + i)), key = dt.toISOString().slice(0, 10);
      if (!hh || (i === 0 && n.mins >= hh[0])) continue;
      if (CLOSED[key]) { note = note || CLOSED[key]; continue; }
      var when = i === 0 ? "today at " + t(hh[0]) : i === 1 ? "tomorrow at " + t(hh[0]) : DAYS[wd] + " at " + t(hh[0]);
      if (i > 6) when = DAYS[wd] + ", " + dt.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }) + " at " + t(hh[0]);
      return { state: "closed", label: note ? note : "Closed right now", sub: "Opens " + when, minsToOpen: i * 1440 + hh[0] - n.mins, note: note };
    }
    return { state: "closed", label: "Closed right now", sub: "Check our socials for hours", minsToOpen: -1 };
  }

  function countdown(m) { if (m <= 0) return ""; var d = Math.floor(m / 1440), h = Math.floor(m % 1440 / 60), mm = m % 60; return ((d ? d + "d " : "") + (d || h ? h + "h " : "") + (d ? "" : mm + "m")).trim(); }

  root.BMS = { HOURS: HOURS, CLOSED: CLOSED, statusAt: statusAt, countdown: countdown, t: t, DAYS: DAYS, nyParts: nyParts };
})(typeof window !== "undefined" ? window : globalThis);


/* ---------- depth model: the page is a 2,000 ft water column ---------- */
(function (root) {
  var MAX = 2000;
  // [position down the page 0..1, water color]; also painted onto <body>
  var STOPS = [[0, "#d6f8f2"], [.03, "#9fe6e3"], [.09, "#5cc6d8"], [.18, "#2e9ccb"], [.30, "#1b78b0"], [.43, "#11508a"], [.56, "#0b3264"], [.69, "#061b3a"], [.82, "#030b19"], [.93, "#010307"], [1, "#000000"]];
  function depthAt(p) { p = Math.min(1, Math.max(0, p)); return MAX * p * p; }
  function posOf(ft) { return Math.sqrt(Math.min(MAX, Math.max(0, ft)) / MAX); }
  function hex(h) { return [1, 3, 5].map(function (i) { return parseInt(h.substr(i, 2), 16); }); }
  function colorAt(p) {
    for (var i = 1; i < STOPS.length; i++) if (p <= STOPS[i][0]) {
      var a = STOPS[i - 1], b = STOPS[i], k = (p - a[0]) / (b[0] - a[0]), A = hex(a[1]), B = hex(b[1]);
      return A.map(function (v, j) { return Math.round(v + (B[j] - v) * k); });
    }
    return [0, 0, 0];
  }
  function lum(c) { return c.map(function (v) { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }).reduce(function (s, v, i) { return s + v * [.2126, .7152, .0722][i]; }, 0); }
  function isDark(p) { return lum(colorAt(p)) < .18; }
  function zone(ft) { return ft < 15 ? "Surface" : ft < 656 ? "Sunlit zone" : ft < 1990 ? "Twilight zone" : "Seafloor"; }
  root.WATER = { MAX: MAX, STOPS: STOPS, depthAt: depthAt, posOf: posOf, colorAt: colorAt, isDark: isDark, zone: zone };
})(typeof window !== "undefined" ? window : globalThis);

if (typeof document !== "undefined") (function () {
  var doc = document.documentElement, reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  doc.classList.remove("no-js"); if (reduced) doc.classList.add("reduced");
  var W = window.WATER;
  document.body.style.backgroundImage = "linear-gradient(180deg," + W.STOPS.map(function (s) { return s[1] + " " + s[0] * 100 + "%"; }).join(",") + ")";

  /* ---- live status everywhere ---- */
  function paint() {
    var s = BMS.statusAt(new Date());
    document.querySelectorAll("[data-status]").forEach(function (el) {
      el.className = "status " + s.state;
      el.innerHTML = "<i></i><span>" + s.label + ". <small>" + s.sub + "</small></span>";
    });
    document.querySelectorAll("[data-status-big]").forEach(function (el) {
      el.dataset.state = s.state;
      el.querySelector(".sb-label").textContent = s.label;
      el.querySelector(".sb-sub").textContent = s.sub;
      var c = el.querySelector(".sb-count"); if (c) c.textContent = s.state === "closed" && s.minsToOpen > 0 ? "Doors open in " + BMS.countdown(s.minsToOpen) : "Come on by, the case is full";
    });
    var wd = BMS.nyParts(new Date()).wd;
    document.querySelectorAll("[data-day]").forEach(function (el) { el.classList.toggle("today", +el.dataset.day === wd); });
  }
  paint(); setInterval(paint, 30000);
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---- header + menu ---- */
  var hdr = document.querySelector(".hdr"), lastY = 0;
  var burger = document.querySelector(".burger");
  if (burger) burger.addEventListener("click", function () { var o = doc.classList.toggle("menu-open"); burger.setAttribute("aria-expanded", o); });
  document.querySelectorAll(".nav a").forEach(function (a) { a.addEventListener("click", function () { doc.classList.remove("menu-open"); }); });

  /* ---- zones: light or dark text for each block, from the water at its depth ---- */
  var docH = 1;
  function zones() {
    docH = Math.max(1, document.body.scrollHeight);
    document.querySelectorAll("main > section, main > div, footer").forEach(function (el) {
      var r = el.getBoundingClientRect(), mid = (r.top + scrollY + Math.min(r.height, innerHeight) / 2) / docH;
      var dark = W.isDark(mid); el.classList.toggle("z-dark", dark); el.classList.toggle("z-light", !dark);
    });
  }

  /* ---- depth gauge ---- */
  var gauge = document.createElement("div"); gauge.className = "depth"; gauge.setAttribute("aria-hidden", "true");
  gauge.innerHTML = "<div class='ft'>0<small>ft</small></div><div class='zone'>Surface</div><div class='ruler'><i></i></div>";
  document.body.appendChild(gauge);
  var gft = gauge.querySelector(".ft"), gzone = gauge.querySelector(".zone"), gdot = gauge.querySelector(".ruler i");
  var depthNow = 0, pNow = 0;
  function onScroll(y) {
    var span = Math.max(1, docH - innerHeight); pNow = Math.min(1, Math.max(0, y / span)); depthNow = W.depthAt(pNow);
    var ft = Math.round(depthNow);
    gft.innerHTML = ft.toLocaleString("en-US") + "<small>ft</small>"; gzone.textContent = W.zone(ft); gdot.style.top = pNow * 100 + "%";
    var viewP = (y + innerHeight / 2) / docH;
    gauge.classList.toggle("dark", W.isDark(viewP));
    if (hdr) {
      hdr.classList.toggle("scrolled", y > 30); hdr.classList.toggle("deep", W.isDark((y + 40) / docH));
      hdr.classList.toggle("hide", y > 500 && y > lastY && !doc.classList.contains("menu-open"));
    }
    lastY = y; light();
  }

  /* ---- sunlight: live caustics (WebGL) + rays, fading out as you descend ---- */
  var rays = document.createElement("div"); rays.className = "rays"; document.body.prepend(rays);
  var cv = document.createElement("canvas"); cv.id = "caustics"; document.body.prepend(cv);
  var gl = cv.getContext("webgl", { premultipliedAlpha: false, alpha: true }), glProg, uT, uR, sunOn = true;
  if (gl) {
    var vs = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
    var fs = "precision mediump float;uniform float t;uniform vec2 r;" +
      "void main(){vec2 uv=gl_FragCoord.xy/r.y;vec2 p=mod(uv*6.2831*1.15,6.2831)-250.;vec2 i=p;float c=1.;float k=.005;" +
      "for(int n=0;n<5;n++){float s=t*(1.-(3.5/float(n+1)));i=p+vec2(cos(s-i.x)+sin(s+i.y),sin(s-i.y)+cos(s+i.x));c+=1./length(vec2(p.x/(sin(i.x+s)/k),p.y/(cos(i.y+s)/k)));}" +
      "c/=5.;c=1.17-pow(c,1.4);float v=pow(abs(c),8.);float fade=smoothstep(0.,.9,gl_FragCoord.y/r.y);gl_FragColor=vec4(vec3(1.),clamp(v,0.,1.)*(.35+.65*fade));}";
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
    glProg = gl.createProgram(); gl.attachShader(glProg, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(glProg, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(glProg);
    if (!gl.getProgramParameter(glProg, gl.LINK_STATUS)) gl = null;
    else {
      gl.useProgram(glProg); var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(glProg, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      uT = gl.getUniformLocation(glProg, "t"); uR = gl.getUniformLocation(glProg, "r"); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }
  }
  function sizeSun() { var s = .5; cv.width = Math.round(innerWidth * s); cv.height = Math.round(innerHeight * s); if (gl) gl.viewport(0, 0, cv.width, cv.height); }
  sizeSun();
  function light() {
    var o = Math.max(0, 1 - depthNow / 140); sunOn = o > 0.01;
    cv.style.opacity = o; rays.style.opacity = Math.max(0, 1 - depthNow / 260);
  }
  function drawSun(t) { if (!gl) return; gl.uniform1f(uT, t * .00035 + 23.); gl.uniform2f(uR, cv.width, cv.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); }

  /* ---- marine snow + bioluminescence in the deep ---- */
  var sn = document.createElement("canvas"); sn.id = "snow"; document.body.prepend(sn);
  var sx = sn.getContext("2d"), flakes = [], dpr = Math.min(devicePixelRatio || 1, 2);
  function sizeSnow() { sn.width = innerWidth * dpr; sn.height = innerHeight * dpr; sx.setTransform(dpr, 0, 0, dpr, 0, 0);
    flakes = []; var n = Math.round(innerWidth * innerHeight / 9000);
    for (var i = 0; i < n; i++) flakes.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: .4 + Math.random() * 1.6, v: .08 + Math.random() * .3, w: Math.random() * 6.28, glow: Math.random() < .09, ph: Math.random() * 6.28 }); }
  sizeSnow();
  function drawSnow(t, dy) {
    var o = Math.min(1, Math.max(0, (depthNow - 120) / 500)), bio = Math.min(1, Math.max(0, (depthNow - 700) / 600));
    sx.clearRect(0, 0, innerWidth, innerHeight); if (o <= 0) return;
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i]; f.y += f.v - dy * .15; f.w += .01; if (f.y > innerHeight + 5) f.y = -5; if (f.y < -5) f.y = innerHeight + 5;
      var x = f.x + Math.sin(f.w) * 4;
      if (f.glow && bio > 0) {
        var a = bio * (.35 + .65 * Math.max(0, Math.sin(t * .0012 + f.ph))), g = sx.createRadialGradient(x, f.y, 0, x, f.y, 10);
        g.addColorStop(0, "rgba(143,243,255," + a + ")"); g.addColorStop(1, "rgba(143,243,255,0)"); sx.fillStyle = g; sx.beginPath(); sx.arc(x, f.y, 10, 0, 6.283); sx.fill();
      } else { sx.fillStyle = "rgba(220,240,245," + (o * .5) + ")"; sx.beginPath(); sx.arc(x, f.y, f.r, 0, 6.283); sx.fill(); }
    }
  }

  /* ---- the school: every species at its real depth ---- */
  var school = document.querySelector("[data-school]"), fish = [], mx = -9999, my = -9999;
  var SP = window.SPECIES || [];
  function fmtRange(d) { return d[0].toLocaleString("en-US") + " to " + d[1].toLocaleString("en-US") + " ft"; }
  var card;
  function openCard(s, opener) {
    if (!card) {
      card = document.createElement("dialog"); card.className = "fieldcard"; card.setAttribute("data-lenis-prevent", ""); card.setAttribute("aria-labelledby", "fc-name");
      card.innerHTML = "<div class='fc-art'><img alt=''><button class='fc-close' aria-label='Close'>&times;</button></div><div class='fc-body'><h3 id='fc-name'></h3><p class='fc-sci'></p>" +
        "<div class='fc-depth'><div class='fc-bar'><i></i></div><small><span>Surface</span><span class='fc-range'></span><span>2,000 ft</span></small></div><p class='fc-note'></p>" +
        "<p class='fc-often'>Often in our case. The Wednesday email lists exactly what came in this week.</p><p><a class='btn btn-buoy' href='index.html#weekly'>Get the weekly catch list</a></p><p class='fc-credit'></p></div>";
      document.body.appendChild(card);
      card.querySelector(".fc-close").onclick = function () { card.close(); };
      card.addEventListener("click", function (e) { if (e.target === card) card.close(); });
      card.addEventListener("close", function () { if (card._opener) card._opener.focus(); });
      card.querySelector(".btn").addEventListener("click", function () { card.close(); });
    }
    card._opener = opener;
    var im = card.querySelector(".fc-art img"); im.src = "img/species/" + s.img + ".png"; im.alt = s.name + " illustration";
    card.querySelector("#fc-name").textContent = s.name; card.querySelector(".fc-sci").textContent = s.sci;
    card.querySelector(".fc-note").textContent = s.note;
    card.querySelector(".fc-range").textContent = (s.fresh ? "Fresh water, " : "Typically ") + fmtRange(s.d);
    var a = W.posOf(s.d[0]), b = W.posOf(s.d[1]); var bar = card.querySelector(".fc-bar i"); bar.style.left = a * 100 + "%"; bar.style.width = Math.max(3, (b - a) * 100) + "%";
    card.querySelector(".fc-credit").textContent = s.credit || "Illustration: NOAA Fisheries / U.S. Fish & Wildlife Service, public domain";
    card.showModal();
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-species]"); if (!b) return;
    var s = SP.filter(function (x) { return x.id === b.dataset.species; })[0]; if (s) openCard(s, b);
  });
  var LEFTY = { catfish: 1, sheepshead: 1, char: 1 }, STILL = { oyster: 1, scallop: 1, "blue-crab": 1, lobster: 1, flounder: 1, halibut: 1 };
  if (school) {
    SP.filter(function (s) { return !s.fresh; }).forEach(function (s, i) {
      var b = document.createElement("button"); b.className = "fish"; b.dataset.species = s.id;
      b.setAttribute("aria-label", s.name + ", " + s.sci + ", typically " + fmtRange(s.d));
      b.innerHTML = "<img src='img/species/" + s.img + ".png' alt='' loading='lazy'><span class='tag'>" + s.name + ", " + Math.round(s.at) + " ft</span>";
      b.style.top = (W.posOf(s.at) * 100) + "%";
      school.appendChild(b);
      var still = !!STILL[s.id];
      fish.push({ el: b, s: s, w: s.w, x: still ? (i % 2 ? .72 : .08) : Math.random(), dir: LEFTY[s.id] ? 1 : -1, v: still ? 0 : 10 + Math.random() * 16, ph: Math.random() * 6.28,
        base: Math.max(.22, 1 - .78 * Math.min(1, Math.max(0, (s.at - 150) / 1100))) });
    });
  }
  function sizeFish() { var k = innerWidth < 700 ? .6 : innerWidth < 1100 ? .8 : 1; fish.forEach(function (f) { f.el.style.width = Math.round(f.w * k) + "px"; f.px = f.w * k; }); }
  sizeFish();
  addEventListener("pointermove", function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
  var lastT = 0;
  function swim(t) {
    var dt = Math.min(64, t - lastT) / 1000; lastT = t; var W0 = innerWidth;
    for (var i = 0; i < fish.length; i++) {
      var f = fish[i]; f.ph += dt;
      if (f.v) { f.x += f.dir * f.v * dt / W0; var m = (f.px + 40) / W0; if (f.x < -m) f.x = 1 + m * .2; if (f.x > 1 + m) f.x = -m; }
      var X = f.x * W0, Y = Math.sin(f.ph * .9) * (f.v ? 8 : 3);
      f.el.style.transform = "translate3d(" + X.toFixed(1) + "px," + Y.toFixed(1) + "px,0)" + (f.dir > 0 && !LEFTY[f.s.id] ? " scaleX(-1)" : "");
      var br = f.base;
      if (br < .9 && mx > -999) { var r = f.el.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) { var dx = r.left + r.width / 2 - mx, dy2 = r.top + r.height / 2 - my, d = Math.sqrt(dx * dx + dy2 * dy2); br = Math.max(br, 1.05 - d / 380); } }
      f.el.style.setProperty("--f", "brightness(" + br.toFixed(2) + ") saturate(" + (.5 + br * .5).toFixed(2) + ")");
    }
  }
  /* freshwater inlet + field guide list */
  var inlet = document.querySelector("[data-fresh]");
  if (inlet) SP.filter(function (s) { return s.fresh; }).forEach(function (s) {
    var b = document.createElement("button"); b.className = "fresh-fish"; b.dataset.species = s.id;
    b.innerHTML = "<img src='img/species/" + s.img + ".png' alt=''><span><b>" + s.name + "</b><i>" + s.sci + "</i></span>"; inlet.appendChild(b);
  });
  var guide = document.querySelector("[data-guide]");
  if (guide) SP.slice().sort(function (a, b) { return (a.fresh ? -1 : a.at) - (b.fresh ? -1 : b.at); }).forEach(function (s) {
    var li = document.createElement("li"); li.innerHTML = "<button data-species='" + s.id + "'><img src='img/species/" + s.img + ".png' alt='' loading='lazy'><span class='g-name'>" + s.name + "</span><i class='g-sci'>" + s.sci + "</i><span class='g-depth'>" + (s.fresh ? "Fresh water" : fmtRange(s.d)) + "</span></button>"; guide.appendChild(li);
  });

  /* ---- lightbox ---- */
  var shots = Array.prototype.slice.call(document.querySelectorAll("[data-lb]"));
  if (shots.length) {
    var lb = document.createElement("div"); lb.className = "lb"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", "Photo viewer");
    lb.innerHTML = "<img alt=''><button class='lb-x' aria-label='Close'>&times;</button><button class='lb-prev' aria-label='Previous photo'>&lsaquo;</button><button class='lb-next' aria-label='Next photo'>&rsaquo;</button>";
    document.body.appendChild(lb);
    var li = lb.querySelector("img"), cur = 0, opener;
    function show(i) { cur = (i + shots.length) % shots.length; var s = shots[cur].querySelector("img") || shots[cur]; li.src = s.currentSrc || s.src; li.alt = s.alt; }
    function close() { lb.classList.remove("on"); if (opener) opener.focus(); }
    shots.forEach(function (s, i) {
      s.setAttribute("tabindex", "0"); s.setAttribute("role", "button"); s.style.cursor = "zoom-in";
      function open() { opener = s; show(i); lb.classList.add("on"); lb.querySelector(".lb-x").focus(); }
      s.addEventListener("click", open); s.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });
    lb.querySelector(".lb-x").onclick = close;
    lb.querySelector(".lb-prev").onclick = function () { show(cur - 1); };
    lb.querySelector(".lb-next").onclick = function () { show(cur + 1); };
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    addEventListener("keydown", function (e) { if (!lb.classList.contains("on")) return; if (e.key === "Escape") close(); if (e.key === "ArrowLeft") show(cur - 1); if (e.key === "ArrowRight") show(cur + 1); });
  }

  /* ---- one loop drives the water ---- */
  var prevY = scrollY;
  function frame(t) {
    var y = scrollY, dy = y - prevY; prevY = y;
    if (sunOn) drawSun(t); drawSnow(t, dy); swim(t);
    if (!reduced) requestAnimationFrame(frame);
  }
  function refresh() { zones(); sizeFish(); onScroll(scrollY); }
  addEventListener("resize", function () { sizeSun(); sizeSnow(); refresh(); });
  addEventListener("load", function () { refresh(); if (window.ScrollTrigger) ScrollTrigger.refresh(); });
  refresh();
  if (reduced) { drawSun(0); drawSnow(0, 0); swim(16); } else requestAnimationFrame(frame);

  /* ---- smooth scroll + the few scroll-linked moves ---- */
  if (reduced || !window.gsap) { addEventListener("scroll", function () { onScroll(scrollY); if (reduced) { drawSnow(0, 0); } }, { passive: true }); return; }
  gsap.registerPlugin(ScrollTrigger);
  if (window.Lenis) {
    var lenis = new Lenis({ lerp: .09 });
    lenis.on("scroll", function (e) { ScrollTrigger.update(); onScroll(e.scroll); });
    gsap.ticker.add(function (tm) { lenis.raf(tm * 1000); }); gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach(function (a) { a.addEventListener("click", function (e) { var t = document.querySelector(a.getAttribute("href")); if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -80 }); } }); });
  } else addEventListener("scroll", function () { onScroll(scrollY); }, { passive: true });

  gsap.utils.toArray("[data-speed]").forEach(function (el) {
    gsap.to(el, { yPercent: +el.dataset.speed * -20, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
  });
  gsap.utils.toArray(".split").forEach(function (el) {
    el.innerHTML = el.textContent.split(" ").map(function (w) { return "<span style='display:inline-block;overflow:hidden;vertical-align:bottom;padding-bottom:.08em'><span class='w' style='display:inline-block'>" + w + "</span></span>"; }).join(" ");
    gsap.from(el.querySelectorAll(".w"), { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: .07, delay: .1 });
  });
  var mm = gsap.matchMedia();
  mm.add("(min-width: 761px)", function () {
    document.querySelectorAll(".reel").forEach(function (sec) {
      var tr = sec.querySelector(".reel-track"); if (!tr) return;
      gsap.to(tr, { x: function () { return -(tr.scrollWidth - innerWidth + 32); }, ease: "none",
        scrollTrigger: { trigger: sec, start: "top top", end: function () { return "+=" + (tr.scrollWidth - innerWidth); }, pin: true, scrub: 1, invalidateOnRefresh: true, onRefresh: zones } });
    });
  });
})();
