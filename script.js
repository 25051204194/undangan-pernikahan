//Penanda error di layar (membantu kalau ada yang salah)
window.addEventListener('error', e => {
  const d = document.createElement('div');
  d.style.cssText = 'position:fixed;left:8px;right:8px;bottom:8px;z-index:99999;background:#b00020;color:#fff;font:13px/1.4 monospace;padding:10px 12px;border-radius:8px;white-space:pre-wrap';
  d.textContent = 'ERROR: ' + e.message + '\n' + (e.filename || '').split('/').pop() + ':' + e.lineno;
  document.body.appendChild(d);
});

//KONFIGURASI — semua teks undangan diedit di sini
const CONFIG = {
  groom: { nick: 'Malio', full: 'Malioboro Hartigan, S.T.',  parents: 'Putra dari Bapak Hendra Januarta & Ibu Seline Sabrina' },
  bride: { nick: 'Sera', full: 'Serana Nigitha, S.Kom.', parents: 'Putri dari Bapak Richard & Ibu Marine Juliana' },

  monogram: 'M & S',
  dateShort: '05 · 12 · 2026',

  quote: {
    text: '“Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan untukmu agar kamu merasa tenteram kepadanya.”',
    source: 'QS. Ar-Rum : 21'
  },
  intro: 'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.',
  mempelaiIntro: 'Dengan penuh rasa syukur, kami akan melangsungkan pernikahan putra-putri kami:',

  akad: {
    start: '2026-12-05T08:00:00+07:00', end: '2026-12-05T10:00:00+07:00',
    day: 'Sabtu', num: '05', month: 'Desember 2026',
    time: '08.00 – 10.00 WIB',
    place: 'Kawasan Candi Borobudur',
    address: 'Jl. Badrawati, Borobudur, Kabupaten Magelang, Jawa Tengah',
    maps: 'https://www.google.com/maps/search/?api=1&query=Candi+Borobudur+Magelang'
  },
  resepsi: {
    start: '2026-12-05T11:00:00+07:00', end: '2026-12-05T14:00:00+07:00',
    day: 'Sabtu', num: '05', month: 'Desember 2026',
    time: '11.00 WIB – Selesai',
    place: 'Kawasan Candi Borobudur',
    address: 'Jl. Badrawati, Borobudur, Kabupaten Magelang, Jawa Tengah',
    maps: 'https://www.google.com/maps/search/?api=1&query=Candi+Borobudur+Magelang'
  },

  story: [
    { date: '2021', title: 'Awal Bertemu',  text: 'Pertemuan sederhana yang tak disangka dilingkungan kampus menjadi awal segalanya.' },
    { date: '2025', title: 'Lamaran',       text: 'Dengan restu keluarga, kami memutuskan melangkah ke jenjang berikutnya.' },
    { date: '2026', title: 'Menikah',       text: 'Hari ini kami memulai perjalanan baru, bersama selamanya.' }
  ],

  live: { time: 'Sabtu, 05 Desember 2026 · 11.00 WIB', url: 'https://youtube.com' },

  gifts: [
    { bank: 'BCA',  number: '1234567890',   name: 'a.n. Malioboro Hartigan' },
    { bank: 'DANA', number: '089681959167', name: 'a.n. Serana Nigitha' }
  ],
  giftAddress: { name: 'Penerima: Malioboro Hartigan', phone: '0896-8195-9167', address: 'Jl. Braga No. 92, Bandung' },

  whatsapp: '6289681959167', // nomor tujuan RSVP
  countdownTo: '2026-12-05T08:00:00+07:00',

  //background saat dibuka
  images: {
    laptop: 'images/latar belakang.jpeg',   
  },

  // Kamera tiap scene x, y : titik fokus di FOTO (dalam %, 0-100) s: zoom (1 = overview)
  scenes: [
    { x: 50, y: 50, s: 1,   ay: 0.5  },   // 0 pembuka
    { x: 50, y: 50, s: 1.0, ay: 0.22 },   // 1 mempelai
    { x: 80, y: 40, s: 2.0, ay: 0.22 },   // 2 akad
    { x: 50, y: 76, s: 2.1, ay: 0.22 },   // 3 resepsi
    { x: 50, y: 32, s: 1.9, ay: 0.22 },   // 4 kisah + galeri
    { x: 14, y: 70, s: 2.0, ay: 0.22 },   // 5 live + gift
    { x: 78, y: 66, s: 2.0, ay: 0.22 }    // 6 ucapan
  ],
  scenesWide: [
    { x: 50, y: 50, s: 1 },                      // 0 pembuka
    { x: 20, y: 60, s: 1.0, side: 'right' },     // 1 mempelai
    { x: 92, y: 36, s: 2.1, side: 'left'  },     // 2 akad
    { x: 50, y: 78, s: 2.2, side: 'right' },     // 3 resepsi
    { x: 62, y: 33, s: 2.0, side: 'left'  },     // 4 kisah + galeri
    { x: 8,  y: 40, s: 2.1, side: 'right' },     // 5 live + gift
    { x: 80, y: 54, s: 2.1, side: 'left'  }      // 6 ucapan
  ]
};

const $  = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const get = (o, path) => path.split('.').reduce((a, k) => (a == null ? a : a[k]), o);

const app    = $('#app');
const stage  = $('#stage');
const camera = $('#camera');
const worldEl = $('#world');
const img    = $('#sceneImg');
const panels = $$('.panel');
const bgm    = $('#bgm');
const total  = CONFIG.scenes.length;
const wideMQ = matchMedia('(min-width: 900px) and (min-aspect-ratio: 1/1)');
const isWide = () => wideMQ.matches;
const sceneList = () => (isWide() ? CONFIG.scenesWide : CONFIG.scenes);
const params = new URLSearchParams(location.search);
const EDIT   = params.has('edit');

let current = 0;
let locked  = false;
const world = { w: 900, h: 1600 };

/* ---------- Isi teks dari CONFIG ---------- */
function bind(root) {
  $$('[data-bind]', root).forEach(el => {
    const v = get(CONFIG, el.dataset.bind);
    if (v != null) el.textContent = v;
  });
  $$('[data-href]', root).forEach(el => { el.href = get(CONFIG, el.dataset.href); });
}
document.title = `The Wedding of ${CONFIG.groom.nick} & ${CONFIG.bride.nick}`;
bind(document);

/* Link "Simpan Tanggal" -> Google Calendar */
const calStamp = d => new Date(d).toISOString().replace(/[-:]|\.\d{3}/g, '');
$$('[data-cal]').forEach(a => {
  const k = a.dataset.cal, e = CONFIG[k];
  const label = k === 'akad' ? 'Akad Nikah' : 'Resepsi';
  a.href = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
    + `&text=${encodeURIComponent(`${label} ${CONFIG.groom.nick} & ${CONFIG.bride.nick}`)}`
    + `&dates=${calStamp(e.start)}/${calStamp(e.end)}`
    + `&location=${encodeURIComponent(`${e.place}, ${e.address}`)}`;
});

/* Kisah */
$('#story').innerHTML = CONFIG.story.map(s =>
  `<div class="tl-item"><small>${s.date}</small><h5>${s.title}</h5><p>${s.text}</p></div>`).join('');

/* Rekening */
$('#gifts').innerHTML = CONFIG.gifts.map(g => `
  <div class="gift-card">
    <p class="bank">${g.bank}</p>
    <p class="no mb-0">${g.number}</p>
    <p class="small mb-2">${g.name}</p>
    <button class="btn btn-line btn-sm" data-copy="${g.number}"><i class="bi bi-clipboard me-1"></i>Salin</button>
  </div>`).join('');

/* Tombol prev/next otomatis di semua kartu (kecuali pembuka) */
panels.forEach(p => {
  const i = +p.dataset.scene;
  if (i === 0) return;
  const row = document.createElement('div');
  row.className = 'nav-row';
  row.innerHTML =
    `<button class="btn btn-line btn-sm" data-prev aria-label="Sebelumnya"><i class="bi bi-arrow-left"></i></button>` +
    (i < total - 1
      ? `<button class="btn btn-wine btn-sm" data-next>Lanjut <i class="bi bi-arrow-right ms-1"></i></button>`
      : `<button class="btn btn-wine btn-sm" data-go="0"><i class="bi bi-arrow-counterclockwise me-1"></i>Ulangi</button>`);
  p.appendChild(row);
});


/* ---------- Gunungan (SVG buatan sendiri) ---------- */
function gununganSVG() {
  const outer = 'M150 6 C168 64 262 132 284 258 C296 336 272 404 218 426 L82 426 C28 404 4 336 16 258 C38 132 132 64 150 6Z';
  return `<svg viewBox="0 0 300 440" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <pattern id="kawung" width="22" height="22" patternUnits="userSpaceOnUse">
        <rect width="22" height="22" fill="#7a1f2f"/>
        <g fill="none" stroke="#e7b3b9" stroke-width="1.2" opacity=".85">
          <ellipse cx="11" cy="5.5" rx="3.6" ry="5.5"/><ellipse cx="11" cy="16.5" rx="3.6" ry="5.5"/>
          <ellipse cx="5.5" cy="11" rx="5.5" ry="3.6"/><ellipse cx="16.5" cy="11" rx="5.5" ry="3.6"/>
        </g>
        <circle cx="11" cy="11" r="1.6" fill="#c9a35b"/>
      </pattern>
    </defs>
    <path d="${outer}" fill="url(#kawung)" stroke="#c9a35b" stroke-width="2.5"/>
    <path d="${outer}" fill="none" stroke="#e7b3b9" stroke-width="1" stroke-dasharray="2 4"
          transform="translate(150 300) scale(.93) translate(-150 -300)"/>
    <g transform="translate(150 300) scale(.8) translate(-150 -300)">
      <path d="${outer}" fill="#f3e6d3" stroke="#c9a35b" stroke-width="3"/>
      <path d="${outer}" fill="none" stroke="#7a1f2f" stroke-width="1"
            transform="translate(150 300) scale(.95) translate(-150 -300)"/>
    </g>
    <circle cx="150" cy="18" r="5" fill="#c9a35b"/>
  </svg>`;
}
/* ---------- Cover: clone isi ke dua pintu ---------- */
const guest = params.get('to');
$$('.door-inner').forEach(door => {
  const frag = $('#coverTpl').content.cloneNode(true);
  bind(frag);
  $('.gun-svg', frag).innerHTML = gununganSVG();
  if (guest) $('[data-guest]', frag).textContent = guest;
  door.appendChild(frag);
});

/* ---------- Navigasi titik ---------- */
const dots = $('#dots');
for (let i = 0; i < total; i++) {
  const b = document.createElement('button');
  b.setAttribute('aria-label', 'Bagian ' + (i + 1));
  b.addEventListener('click', () => goTo(i));
  dots.appendChild(b);
}

/* ---------- Muat foto: laptop / HP, dengan cadangan ---------- */
function loadScene() {
  img.src = CONFIG.images.laptop;
}

/* sisi kartu (hanya dipakai di laptop) */
function applyLayout() {
  panels.forEach(p => {
    const side = sceneList()[+p.dataset.scene].side;
    if (side) p.dataset.side = side; else delete p.dataset.side;
  });
}

/* ---------- Kamera ---------- */
function layoutWorld() {
  const W = app.clientWidth, H = app.clientHeight;
  const iw = img.naturalWidth || 900, ih = img.naturalHeight || 1600;
  const k = Math.max(W / iw, H / ih);
  world.w = iw * k; world.h = ih * k;
  worldEl.style.width  = world.w + 'px';
  worldEl.style.height = world.h + 'px';
}

function camFor(i, mul = 1) {
  const sc = sceneList()[i];
  const W = app.clientWidth, H = app.clientHeight;
  const s = sc.s * mul;
  const px = sc.x / 100 * world.w, py = sc.y / 100 * world.h;
  // laptop: spot digeser ke sisi seberang kartu
  const ax = sc.ax ?? (sc.side === 'right' ? 0.3 : sc.side === 'left' ? 0.7 : 0.5);
  let tx = ax * W - px * s;
  let ty = (sc.ay ?? 0.5) * H - py * s;
  tx = Math.min(0, Math.max(W - world.w * s, tx));
  ty = Math.min(0, Math.max(H - world.h * s, ty));
  return `translate(${tx}px, ${ty}px) scale(${s})`;
}

function goTo(i) {
  if (i < 0 || i >= total) return;
  current = i;
  stage.dataset.scene = i;
  camera.style.transform = camFor(i);
  panels.forEach(p => p.classList.toggle('active', +p.dataset.scene === i));
  $$('#dots button').forEach((d, k) => d.classList.toggle('active', k === i));
  const p = panels.find(p => +p.dataset.scene === i);
  if (p) p.scrollTop = 0;
}
const next = () => goTo(Math.min(current + 1, total - 1));
const prev = () => goTo(Math.max(current - 1, 0));

function relayout() {
  layoutWorld();
  camera.classList.add('instant');
  camera.style.transform = camFor(current);
  camera.offsetHeight; // reflow
  camera.classList.remove('instant');
}
img.addEventListener('load', relayout);
window.addEventListener('resize', relayout);
const onWideChange = () => { applyLayout(); loadScene(); relayout(); };
if (wideMQ.addEventListener) wideMQ.addEventListener('change', onWideChange); else wideMQ.addListener(onWideChange);
applyLayout();
loadScene();
layoutWorld();

/* ---------- Kontrol ---------- */
document.addEventListener('click', e => {
  const go = e.target.closest('[data-go]');
  if (go) return goTo(+go.dataset.go);
  if (e.target.closest('[data-next]')) next();
  if (e.target.closest('[data-prev]')) prev();

  const cp = e.target.closest('[data-copy]');
  if (cp) copyText(cp.dataset.copy);
});

function throttleStep(fn) {
  if (locked) return;
  locked = true; fn();
  setTimeout(() => (locked = false), 1700);
}
const scrollable = p => p && p.scrollHeight > p.clientHeight + 2;
const atEnd = (p, dir) => !scrollable(p) || (dir > 0 ? p.scrollTop + p.clientHeight >= p.scrollHeight - 3 : p.scrollTop <= 2);

window.addEventListener('wheel', e => {
  if (!stage.classList.contains('show') || Math.abs(e.deltaY) < 20) return;
  const dir = e.deltaY > 0 ? 1 : -1;
  if (!atEnd(e.target.closest('.panel'), dir)) return;
  throttleStep(dir > 0 ? next : prev);
}, { passive: true });

let touch = null;
window.addEventListener('touchstart', e => {
  const p = e.target.closest('.panel');
  touch = { y: e.touches[0].clientY, top: atEnd(p, -1), bottom: atEnd(p, 1) };
}, { passive: true });
window.addEventListener('touchend', e => {
  if (!touch || !stage.classList.contains('show')) return;
  const diff = touch.y - e.changedTouches[0].clientY;
  if (diff > 55 && touch.bottom) throttleStep(next);
  else if (diff < -55 && touch.top) throttleStep(prev);
  touch = null;
}, { passive: true });

window.addEventListener('keydown', e => {
  if (!stage.classList.contains('show') || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
  if (['ArrowDown', 'ArrowRight', 'PageDown'].includes(e.key)) throttleStep(next);
  if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) throttleStep(prev);
});

/* ---------- Buka undangan ---------- */
const gate = $('#gate');
function openInvitation() {
  gate.classList.add('opening');
  stage.classList.add('show', 'intro');

  // kamera mulai dalam keadaan "masuk" lalu mundur pelan ke overview
  camera.classList.add('instant');
  camera.style.transform = camFor(0, 1.9);
  camera.offsetHeight;
  camera.classList.remove('instant');
  camera.classList.add('slow');

  setTimeout(() => gate.classList.add('open'), 350);
  setTimeout(() => { goTo(0); }, 500);
  setTimeout(() => { camera.classList.remove('slow'); stage.classList.remove('intro'); }, 4800);
  setTimeout(() => gate.remove(), 3000);

  playMusic();
}
$('#openBtn').addEventListener('click', openInvitation);

/* ---------- Musik ---------- */
const musicBtn = $('#musicBtn');
function playMusic() {
  bgm.volume = 0.7;
  bgm.play().then(() => musicBtn.classList.add('playing')).catch(() => {});
}
musicBtn.addEventListener('click', () => {
  if (bgm.paused) playMusic();
  else { bgm.pause(); musicBtn.classList.remove('playing'); }
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) bgm.pause();
  else if (musicBtn.classList.contains('playing')) bgm.play().catch(() => {});
});

/* ---------- Countdown ---------- */
const target = new Date(CONFIG.countdownTo).getTime();
function tick() {
  let d = Math.max(0, target - Date.now());
  const days = Math.floor(d / 864e5); d %= 864e5;
  const hrs  = Math.floor(d / 36e5);  d %= 36e5;
  const min  = Math.floor(d / 6e4);   d %= 6e4;
  const sec  = Math.floor(d / 1e3);
  $('#cdD').textContent = days;
  $('#cdH').textContent = String(hrs).padStart(2, '0');
  $('#cdM').textContent = String(min).padStart(2, '0');
  $('#cdS').textContent = String(sec).padStart(2, '0');
}
tick();
setInterval(tick, 1000);

/* ---------- RSVP via WhatsApp ---------- */
$('#rsvpForm').addEventListener('submit', e => {
  e.preventDefault();
  const text =
`Halo, saya ${$('#rsvpName').value}.
Konfirmasi: ${$('#rsvpStatus').value} (${$('#rsvpCount').value} orang)
Ucapan: ${$('#rsvpMsg').value || '-'}`;
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
});

/* ---------- Salin + toast Bootstrap ---------- */
function copyText(t) {
  const done = () => {
    $('#toastText').textContent = 'Nomor berhasil disalin';
    bootstrap.Toast.getOrCreateInstance($('#copyToast'), { delay: 1800 }).show();
  };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(t).then(done).catch(done);
  } else {
    const ta = document.createElement('textarea');
    ta.value = t; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (_) {}
    ta.remove(); done();
  }
}

/* ---------- Kupu-kupu & kelopak ---------- */
const fx = $('#fx');
const petalWrap = $('#petals');
for (let i = 0; i < 16; i++) {
  const p = document.createElement('span');
  p.className = 'petal';
  p.style.left = Math.random() * 100 + '%';
  p.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
  p.style.animationDuration = 9 + Math.random() * 9 + 's';
  p.style.animationDelay = -Math.random() * 15 + 's';
  p.style.opacity = 0.4 + Math.random() * 0.5;
  petalWrap.appendChild(p);
}
for (let i = 0; i < 4; i++) {
  const b = document.createElement('span');
  b.className = 'bf';
  b.innerHTML = '<i></i><i></i>';
  const r = (a, c) => Math.round(a + Math.random() * (c - a));
  b.style.left = r(10, 75) + '%';
  b.style.top  = r(18, 55) + '%';
  b.style.setProperty('--d', r(14, 24) + 's');
  b.style.setProperty('--dl', -r(0, 14) + 's');
  [1, 2, 3].forEach(n => {
    b.style.setProperty('--x' + n, r(-140, 140) + 'px');
    b.style.setProperty('--y' + n, r(-120, 120) + 'px');
  });
  fx.appendChild(b);
}

/* ---------- Mode edit: ?edit=1 -> klik foto untuk lihat koordinat ---------- */
if (EDIT) {
  document.body.classList.add('edit');
  stage.classList.add('show');
  const pick = document.createElement('div'); pick.id = 'pick';
  const hud  = document.createElement('div'); hud.id = 'pickHud';
  hud.textContent = 'MODE EDIT — klik/tap foto untuk melihat nilai x, y (dalam %)';
  stage.append(pick, hud);
  window.addEventListener('load', () => { layoutWorld(); camera.style.transform = camFor(0); });
  stage.addEventListener('click', e => {
    if (e.target.closest('#musicBtn')) return;
    const r = worldEl.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
    const y = ((e.clientY - r.top) / r.height * 100).toFixed(1);
    const a = app.getBoundingClientRect();
    pick.style.display = 'block';
    pick.style.left = (e.clientX - a.left) + 'px';
    pick.style.top  = (e.clientY - a.top) + 'px';
    const line = isWide() ? `{ x: ${x}, y: ${y}, s: 2.1, side: 'right' },` : `{ x: ${x}, y: ${y}, s: 2.0, ay: 0.22 },`;
    hud.textContent = line + '   (disalin)';
    navigator.clipboard?.writeText(line).catch(() => {});
  });
}