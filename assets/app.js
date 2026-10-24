(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Üst menü çizgisi ---- */
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---- İletişim formu: mesaj WhatsApp'ta ya da e-posta uygulamasında hazır açılır ---- */
  var CONTACT = { whatsapp: '905530597002', email: 'yigitdellaloglu@gmail.com' };
  var form = document.getElementById('demo-form');
  var err = document.getElementById('form-err');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var via = e.submitter && e.submitter.dataset.via === 'email' ? 'email' : 'whatsapp';
    var name = document.getElementById('f-name'), company = document.getElementById('f-company');
    [name, company].forEach(function (f) { f.removeAttribute('aria-invalid'); });
    var bad = [];
    if (!name.value.trim()) bad.push([name, 'adınızı']);
    if (!company.value.trim()) bad.push([company, 'işletme adını']);
    if (bad.length) {
      bad.forEach(function (b) { b[0].setAttribute('aria-invalid', 'true'); });
      err.textContent = 'Lütfen ' + bad.map(function (b) { return b[1]; }).join(' ve ') + ' yazın.';
      bad[0][0].focus();
      return;
    }
    err.textContent = '';
    var mods = Array.prototype.map.call(form.querySelectorAll('input[name="mod"]:checked'), function (i) { return i.value; });
    var lines = ['Merhaba, YD ERP lisansı hakkında bilgi almak istiyorum.', '',
      'Ad soyad: ' + name.value.trim(), 'İşletme: ' + company.value.trim()];
    var phone = document.getElementById('f-phone').value.trim();
    var size = document.getElementById('f-size').value;
    var note = document.getElementById('f-note').value.trim();
    if (phone) lines.push('Telefon: ' + phone);
    if (size) lines.push('Kullanıcı sayısı: ' + size);
    if (mods.length) lines.push('Kullanım: ' + mods.join(', '));
    if (note) lines.push('', note);
    var text = lines.join('\n');
    var url = via === 'email'
      ? 'mailto:' + CONTACT.email + '?subject=' + encodeURIComponent('YD ERP lisans talebi · ' + company.value.trim()) + '&body=' + encodeURIComponent(text)
      : 'https://wa.me/' + CONTACT.whatsapp + '?text=' + encodeURIComponent(text);
    if (via === 'email') window.location.href = url; else window.open(url, '_blank', 'noopener');
    err.textContent = via === 'email'
      ? 'E-posta uygulamanızda mesaj hazırlandı; göndermeyi unutmayın.'
      : 'WhatsApp yeni sekmede açıldı; mesajı göndermeyi unutmayın.';
  });

  /* ---- Ekranlar: gerçek ekran görüntüleri ---- */
  var shotImg = document.getElementById('shot-img'), shotCap = document.getElementById('shot-cap');
  var shotTabs = Array.prototype.slice.call(document.querySelectorAll('.shots__tabs [role="tab"]'));
  function pickShot(tab) {
    shotTabs.forEach(function (t) { t.setAttribute('aria-selected', String(t === tab)); t.tabIndex = t === tab ? 0 : -1; });
    shotImg.src = 'assets/img/app/' + tab.dataset.shot + '.jpg';
    shotImg.alt = 'YD ERP ' + tab.textContent.trim() + ' ekranı';
    shotCap.textContent = tab.dataset.cap;
  }
  shotTabs.forEach(function (tab, i) {
    tab.tabIndex = i === 0 ? 0 : -1;
    tab.addEventListener('click', function () { pickShot(tab); });
    tab.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var next = shotTabs[(i + d + shotTabs.length) % shotTabs.length];
      next.focus(); pickShot(next);
    });
    // Sonraki görüntüler önceden yüklenir; sekme değişince bekleme olmaz.
    if (i > 0) { var pre = new Image(); pre.src = 'assets/img/app/' + tab.dataset.shot + '.jpg'; }
  });

  /* ---- Sosyal medya: bağlantısı olanlar görünür ---- */
  var SOCIAL = {
    instagram: 'https://www.instagram.com/yigitdellaloglu/',
    whatsapp: 'https://wa.me/905530597002',
    linkedin: '',
    github: 'https://github.com/yigitdellaloglu'
  };
  document.querySelectorAll('.social').forEach(function (a) {
    var url = SOCIAL[a.dataset.social];
    if (url) { a.href = url; a.hidden = false; }
  });

  /* ---- Yasal metinler ---- */
  var legal = document.getElementById('legal');
  var legalTitle = document.getElementById('legal-title');
  function openLegal(id) {
    var found = false;
    legal.querySelectorAll('article').forEach(function (art) {
      var on = art.dataset.doc === id; art.hidden = !on;
      if (on) { legalTitle.textContent = art.dataset.title; found = true; }
    });
    if (!found) return;
    legal.querySelector('.legal__body').scrollTop = 0;
    if (typeof legal.showModal === 'function') { if (!legal.open) legal.showModal(); }
    else legal.setAttribute('open', '');
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-legal]');
    if (t) { e.preventDefault(); openLegal(t.dataset.legal); }
  });
  document.getElementById('legal-close').addEventListener('click', function () { legal.close ? legal.close() : legal.removeAttribute('open'); });
  legal.addEventListener('click', function (e) { if (e.target === legal && legal.close) legal.close(); });
  var hashDoc = { '#gizlilik': 'gizlilik', '#kvkk': 'kvkk', '#cerez': 'cerez', '#sartlar': 'sartlar' }[location.hash];
  if (hashDoc) openLegal(hashDoc);

  /* ---- Çerez bildirimi ---- */
  var cookie = document.getElementById('cookie');
  var seen = false;
  try { seen = localStorage.getItem('yderp-cookie') === '1'; } catch (e) {}
  function setCookieH() {
    var h = cookie.hidden ? 0 : cookie.getBoundingClientRect().height + 16;
    document.documentElement.style.setProperty('--cookie-h', h + 'px');
  }
  if (!seen) { cookie.hidden = false; }
  setCookieH();
  window.addEventListener('resize', setCookieH);
  document.getElementById('cookie-ok').addEventListener('click', function () {
    cookie.hidden = true; setCookieH();
    try { localStorage.setItem('yderp-cookie', '1'); } catch (e) {}
  });

  /* ---- Yukarı çık ---- */
  var totop = document.getElementById('totop');
  function onTop() { totop.classList.toggle('is-on', window.scrollY > window.innerHeight * .8); }
  window.addEventListener('scroll', onTop, { passive: true }); onTop();
  totop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* ---- İndirme: GitHub'daki en son sürüm ----
     Lisans Yöneticisi her sürümü YD-ERP-Lisans deposunda "vX.Y.Z" olarak yayınlar. Sayfa en son
     yayını sorar ve indirme düğmelerini doğrudan kurulum dosyasına bağlar; olmazsa yayın sayfasına
     giden bağlantı kalır. */
  var RELEASES = 'https://api.github.com/repos/yigitdellaloglu/YD-ERP-Lisans/releases/latest';
  if (window.fetch) {
    fetch(RELEASES, { headers: { accept: 'application/vnd.github+json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (rel) {
        if (!rel || !rel.assets) return;
        var asset = rel.assets.filter(function (a) { return /^YD-ERP-Kurulum-.+\.exe$/.test(a.name); })[0];
        if (!asset) return;
        var version = String(rel.tag_name || '').replace(/^v/, '');
        var size = asset.size ? ' · ' + Math.round(asset.size / 1048576) + ' MB' : '';
        document.querySelectorAll('.dl-link').forEach(function (a) { a.href = asset.browser_download_url; });
        var hint = document.getElementById('dl-hint');
        if (hint) hint.textContent = 'Sürüm ' + version + size + ' · Windows 10 ve 11 (64 bit)';
        document.querySelectorAll('.js-version-full').forEach(function (n) {
          var when = rel.published_at ? new Date(rel.published_at).toLocaleDateString('tr-TR') : '';
          n.textContent = 'YD ERP ' + version + (when ? ' · ' + when : '');
        });
      })
      .catch(function () {});
  }

  /* ---- Modül listesi: aktif madde ---- */
  var mods = Array.prototype.slice.call(document.querySelectorAll('.mod'));
  var cap = document.getElementById('mods-cap');
  var activeMod = 0, modsScene = null;
  function pickMod() {
    var mid = window.innerHeight * (window.innerWidth <= 860 ? .62 : .5), best = 0, bestD = Infinity;
    mods.forEach(function (m, i) {
      var r = m.getBoundingClientRect(), c = r.top + r.height / 2, d = Math.abs(c - mid);
      if (d < bestD) { bestD = d; best = i; }
    });
    if (best !== activeMod || !mods[best].classList.contains('is-active')) {
      activeMod = best;
      mods.forEach(function (m, i) { m.classList.toggle('is-active', i === best); });
      cap.textContent = mods[best].querySelector('h3').textContent;
      if (modsScene) modsScene.setActive(best);
    }
  }
  window.addEventListener('scroll', pickMod, { passive: true }); pickMod();

  /* ---- Belge izi adımları ---- */
  var steps = Array.prototype.slice.call(document.querySelectorAll('#trace .step'));
  function setTrace(i) {
    steps.forEach(function (s, k) {
      s.classList.toggle('is-done', k < i);
      s.classList.toggle('is-now', k === i);
    });
  }
  setTrace(reduce || !window.THREE ? 5 : 0);

  function no3d() { document.querySelectorAll('.hero__stage, .mods__stage').forEach(function (n) { n.classList.add('no3d'); }); setTrace(5); }
  if (!window.THREE) { no3d(); return; }

  /* ================= 3D modül yığını ================= */
  var MODS = [
    { n: 'Teklif & Sipariş', c: 'STK', w: 'teklif · sipariş · fiyat' },
    { n: 'Stok & Depo', c: 'DEPO', w: 'stok · sayım · transfer' },
    { n: 'Sevk İrsaliyesi', c: 'SIR', w: 'irsaliye · sevk' },
    { n: 'Satış & Alış', c: 'SAT', w: 'satış · iade · KDV' },
    { n: 'Cari & Veresiye', c: 'CARİ', w: 'borç · alacak · vade' },
    { n: 'Kasa, Banka & Çek', c: 'KASA', w: 'tahsilat · çek · senet' }
  ];
  var W = 5, H = .22, D = 3.2, GAP = 1.12;
  var WHITE = new THREE.Color(0xf2f2ee);

  function labelTex(m) {
    var cv = document.createElement('canvas'); cv.width = 1024; cv.height = 655;
    var x = cv.getContext('2d');
    function draw() {
      x.clearRect(0, 0, cv.width, cv.height);
      x.strokeStyle = 'rgba(255,255,255,.22)'; x.lineWidth = 2;
      x.strokeRect(36, 36, cv.width - 72, cv.height - 72);
      x.fillStyle = '#ffffff';
      if ('fontStretch' in x) x.fontStretch = 'expanded';
      x.font = '700 76px Archivo, Arial, sans-serif';
      x.textBaseline = 'alphabetic';
      x.fillText(m.n, 80, cv.height - 86);
      x.font = '500 50px "JetBrains Mono", monospace';
      x.fillStyle = 'rgba(255,255,255,.8)';
      x.fillText(m.w, 82, cv.height - 178);
      x.textAlign = 'right';
      x.fillStyle = '#ffffff';
      x.fillText(m.c, cv.width - 80, 104);
      x.textAlign = 'left';
    }
    draw();
    var t = new THREE.CanvasTexture(cv);
    t.anisotropy = 8;
    t.redraw = function () { draw(); t.needsUpdate = true; };
    return t;
  }

  var DOCS = [
    ['TEKLİF', 'STK-2026-000014', '30 koli'],
    ['STOK', 'Ana Depo', '−30 koli'],
    ['İRSALİYE', 'SIR-2026-000006', '30 koli'],
    ['SATIŞ', 'SAT-2026-000231', '12.350,00 TL'],
    ['CARİ', 'Vade 30.10.2026', '12.350,00 TL'],
    ['ÇEK', 'CEK-2026-000004', '12.350,00 TL']
  ];
  function docTex() {
    var cv = document.createElement('canvas'); cv.width = 480; cv.height = 640;
    var x = cv.getContext('2d'), stage = 0;
    function draw() {
      var d = DOCS[stage];
      x.fillStyle = '#fff'; x.fillRect(0, 0, 480, 640);
      x.strokeStyle = '#0f0f0f'; x.lineWidth = 8; x.strokeRect(4, 4, 472, 632);
      x.fillStyle = '#0f0f0f';
      if ('fontStretch' in x) x.fontStretch = 'expanded';
      x.font = '800 52px Archivo, Arial, sans-serif'; x.fillText(d[0], 36, 92);
      x.font = '500 22px "JetBrains Mono", monospace'; x.fillStyle = '#555';
      x.fillText(d[1], 36, 134);
      x.fillText('15.10.2026', 36, 166);
      x.fillStyle = '#d6d6d1';
      for (var i = 0; i < 6; i++) x.fillRect(36, 220 + i * 44, i % 2 ? 300 : 408, 12);
      x.fillStyle = '#0f0f0f'; x.fillRect(36, 500, 408, 3);
      x.font = '600 30px "JetBrains Mono", monospace'; x.textAlign = 'right';
      x.fillText(d[2], 444, 556); x.textAlign = 'left';
    }
    draw();
    var t = new THREE.CanvasTexture(cv); t.anisotropy = 8;
    t.redraw = function () { draw(); t.needsUpdate = true; };
    t.setStage = function (i) { i = Math.max(0, Math.min(DOCS.length - 1, i)); if (i !== stage) { stage = i; t.redraw(); } };
    return t;
  }

  function Stack(canvas, opt) {
    var self = this;
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    var scene = new THREE.Scene();
    var cam = new THREE.PerspectiveCamera(26, 1, .1, 100);
    scene.add(new THREE.AmbientLight(0xffffff, .5));
    var dl = new THREE.DirectionalLight(0xffffff, .85); dl.position.set(5, 12, 7); scene.add(dl);
    var group = new THREE.Group(); scene.add(group);
    var top = (MODS.length - 1) * GAP / 2;
    var texes = [];
    var slabs = MODS.map(function (m, i) {
      var g = new THREE.Group();
      var mat = new THREE.MeshStandardMaterial({ color: 0x0b0b0c, roughness: .5, metalness: .2, emissive: 0x000000 });
      var box = new THREE.Mesh(new THREE.BoxGeometry(W, H, D), mat);
      var em = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .4 });
      var edges = new THREE.LineSegments(new THREE.EdgesGeometry(box.geometry), em);
      var tex = labelTex(m); texes.push(tex);
      var lm = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: .55, depthWrite: false });
      var label = new THREE.Mesh(new THREE.PlaneGeometry(W, D), lm);
      label.rotation.x = -Math.PI / 2; label.position.y = H / 2 + .003;
      g.add(box); g.add(edges); g.add(label);
      g.position.y = top - i * GAP;
      group.add(g);
      return { g: g, mat: mat, em: em, lm: lm, on: 0, out: 0 };
    });

    var doc = null, docMat = null;
    if (opt.doc) {
      var dt = docTex(); texes.push(dt); self.docTex = dt;
      docMat = new THREE.MeshBasicMaterial({ map: dt, transparent: true, side: THREE.DoubleSide });
      doc = new THREE.Mesh(new THREE.PlaneGeometry(1.35, 1.8), docMat);
      doc.rotation.x = -Math.PI / 2;
      doc.position.set(.9, opt.rest ? top + H / 2 + .03 : top + 1.4, .55);
      group.add(doc);
      if (!opt.rest) {
      var rail = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(.9, top + 1.4, .55), new THREE.Vector3(.9, -top - .6, .55)]),
        new THREE.LineDashedMaterial({ color: 0xffffff, transparent: true, opacity: .25, dashSize: .08, gapSize: .08 })
      );
      rail.computeLineDistances(); group.add(rail);
      }
    }

    if (document.fonts && document.fonts.load) {
      Promise.all([
        document.fonts.load('700 76px Archivo'), document.fonts.load('500 50px "JetBrains Mono"')
      ]).then(function () { texes.forEach(function (t) { t.redraw(); }); self.dirty = true; }).catch(function () {});
    }

    cam.position.copy(opt.cam);
    cam.lookAt(opt.look);
    group.rotation.y = opt.rotY || 0;

    var w = 0, h = 0;
    function size() {
      var r = canvas.parentNode.getBoundingClientRect();
      if (r.width === w && r.height === h) return;
      w = r.width; h = r.height;
      renderer.setSize(w, h, false);
      cam.aspect = w / Math.max(h, 1);
      var fit = opt.fit || 1;
      cam.zoom = Math.min(1, cam.aspect / fit);
      cam.updateProjectionMatrix();
    }

    var active = opt.doc && !opt.rest ? -1 : 0;
    this.setActive = function (i) { active = i; };
    this.dirty = true;

    var mx = 0, my = 0, tmx = 0, tmy = 0;
    if (!reduce) window.addEventListener('pointermove', function (e) {
      tmx = e.clientX / window.innerWidth - .5; tmy = e.clientY / window.innerHeight - .5;
    }, { passive: true });

    var visible = false, t0 = performance.now();
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) loop(); }, { rootMargin: '80px' }).observe(canvas);

    var CYCLE = 11000, STOP = MODS.length;
    function docState(ms) {
      // belge her katmanın üstünde durur, sonra bir alttakine iner
      var t = (ms % CYCLE) / CYCLE * (STOP + 1.2), i = Math.floor(t), f = t - i;
      var restY = function (k) { return top - k * GAP + H / 2 + .02; };
      if (i >= STOP) return { y: restY(STOP - 1), at: STOP - 1, fade: Math.max(0, 1 - (t - STOP) / 1.2) };
      var y0 = i === 0 ? top + 1.4 : restY(i - 1), y1 = restY(i);
      var e = f < .55 ? 1 - Math.pow(1 - f / .55, 3) : 1;
      return { y: y0 + (y1 - y0) * e, at: f >= .55 ? i : i - 1, fade: i === 0 ? Math.min(1, f / .3) : 1 };
    }

    var lastAt = -2;
    function frame(now) {
      size();
      mx += (tmx - mx) * .05; my += (tmy - my) * .05;
      var ms = now - t0;
      group.rotation.y = (opt.rotY || 0) + (reduce ? 0 : Math.sin(ms / 6000) * .06) + mx * .18;
      group.rotation.x = my * .06;

      var cur = active;
      if (doc && opt.rest) {
        self.docTex.setStage(cur);
        var ty = top - cur * GAP + H / 2 + .03 + .2 * slabs[Math.max(0, cur)].out;
        doc.position.y += (ty - doc.position.y) * (reduce ? 1 : .08);
        var sl = slabs[Math.max(0, cur)];
        doc.position.x = 1.35 + sl.out * (opt.slide || 0) * .55;
        doc.position.z = .2 + sl.out * (opt.slide || 0) * .8;
      } else if (doc) {
        if (reduce) { doc.position.y = top - (STOP - 1) * GAP + H / 2 + .02; cur = STOP - 1; docMat.opacity = 1; self.docTex.setStage(STOP - 1); }
        else {
          var s = docState(ms);
          doc.position.y = s.y; docMat.opacity = s.fade; cur = s.at;
          if (s.at !== lastAt) { lastAt = s.at; if (opt.onStep) opt.onStep(Math.max(0, s.at)); self.docTex.setStage(s.at); }
        }
      }
      slabs.forEach(function (s, i) {
        var on = i === cur ? 1 : 0;
        var k = reduce ? 1 : .08;
        s.on += (on - s.on) * k;
        s.out += ((opt.slide && on ? 1 : 0) - s.out) * k;
        s.g.position.x = s.out * (opt.slide || 0) * .55;
        s.g.position.z = s.out * (opt.slide || 0) * .8;
        s.g.position.y = top - i * GAP + (opt.slide ? .2 * s.out : 0);
        var base = opt.doc ? .45 : .22;
        s.em.opacity = base + (1 - base) * s.on;
        s.lm.opacity = (opt.doc ? .5 : .28) + .5 * s.on;
        if (opt.slide) {
          s.mat.color.setHex(0x0b0b0c).lerp(WHITE, s.on);
          s.mat.emissive.setScalar(.62 * s.on);
          s.lm.color.setScalar(1 - .94 * s.on);
        } else s.mat.emissive.setScalar(.06 * s.on);
      });
      renderer.render(scene, cam);
    }
    var raf = 0;
    function loop() {
      if (raf) return;
      var tick = function (now) {
        raf = 0;
        if (!visible) return;
        frame(now);
        if (!reduce || self.dirty) { self.dirty = false; raf = requestAnimationFrame(tick); }
      };
      raf = requestAnimationFrame(tick);
    }
    this.kick = function () { self.dirty = true; loop(); };
    frame(performance.now());
  }

  try {
    var narrow = window.innerWidth <= 860;
    new Stack(document.getElementById('hero3d'), {
      doc: true,
      cam: new THREE.Vector3(10.5, 8.2, 12.5),
      look: new THREE.Vector3(.2, -.4, 0),
      rotY: -.12,
      fit: narrow ? .9 : 1.05,
      onStep: setTrace
    });
    modsScene = new Stack(document.getElementById('mods3d'), {
      doc: true, rest: true, slide: 1.9,
      cam: new THREE.Vector3(9.5, 9, 12.5),
      look: new THREE.Vector3(.5, -.2, 0),
      rotY: -.18,
      fit: .95
    });
    modsScene.setActive(activeMod);
    window.addEventListener('scroll', function () { if (modsScene) modsScene.kick(); }, { passive: true });
  } catch (e) {
    no3d();
  }
})();
