import './style.css';
import './studio-shop.css';
import { registerSW } from 'virtual:pwa-register';
import { initializeStudioShop } from './studio-shop.js';

registerSW({ immediate: true });

(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var KEY = 'viseu-quest-v1';
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var INK = '#1d2a4a';
  var $ = function (s) { return document.querySelector(s); };
  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  /* ---------- Content ---------- */
  var SPOTS = [
    { id: 'se', name: 'Sé Catedral', x: 500, y: 300, color: '#7a5cff', type: 'cathedral',
      fact: 'Viseu’s cathedral crowns a hilltop square. Look up inside for stone ribs carved like twisted rope.',
      q: 'What style is the famous rope-like vaulted ceiling?', o: ['Manueline', 'Art Deco', 'Brutalist'], a: 0 },
    { id: 'gv', name: 'Museu Grão Vasco', x: 440, y: 335, color: '#ff5d73', type: 'museum',
      fact: 'The national museum honours Vasco Fernandes, known as Grão Vasco, a star of 16th-century Portuguese painting.',
      q: 'Grão Vasco was best known as a…', o: ['Navigator', 'Painter', 'Architect'], a: 1 },
    { id: 'mis', name: 'Igreja da Misericórdia', x: 548, y: 338, color: '#3cc3f3', type: 'church',
      fact: 'A white baroque church from the 1700s, standing across the square from the cathedral.',
      q: 'Which landmark does it face?', o: ['The Fontelo palace', 'The cathedral', 'The Cava'], a: 1 },
    { id: 'soar', name: 'Porta do Soar', x: 400, y: 408, color: '#ff9f1c', type: 'gate',
      fact: 'A medieval gateway that reminds you Viseu once sat behind walls.',
      q: 'The Porta do Soar was part of the town’s old…', o: ['Railway', 'Aqueduct', 'City walls'], a: 2 },
    { id: 'rossio', name: 'Praça da República', x: 320, y: 440, color: '#1fbfae', type: 'square',
      fact: 'The lively heart of town, where streets meet and people gather under the trees.',
      q: 'Locals nickname this square…', o: ['Rossio', 'Terreiro', 'Largo da Sé'], a: 0 },
    { id: 'aq', name: 'Parque Aquilino Ribeiro', x: 150, y: 485, color: '#4cb963', type: 'park',
      fact: 'Lawns, shady paths and benches in a park named for the Portuguese writer Aquilino Ribeiro.',
      q: 'Aquilino Ribeiro was a famous…', o: ['Football coach', 'Writer', 'Chef'], a: 1 },
    { id: 'fon', name: 'Parque do Fontelo', x: 790, y: 300, color: '#ee6c4d', type: 'palace',
      fact: 'A big green park beside the Paço dos Três Escalões, a former bishops’ palace.',
      q: 'What does “Três Escalões” mean?', o: ['Three steps', 'Three towers', 'Three gardens'], a: 0 },
    { id: 'cava', name: 'Cava de Viriato', x: 560, y: 112, color: '#8d6e63', type: 'earth',
      fact: 'An eight-sided earthwork at the edge of town, linked by tradition to the Lusitanian leader Viriato.',
      q: 'What shape is the Cava de Viriato?', o: ['Octagon', 'Circle', 'Triangle'], a: 0 }
  ];
  var ROADS = [
    [[320, 440], [400, 408], [440, 335], [500, 300], [548, 338]],
    [[500, 300], [520, 205], [560, 112]],
    [[548, 338], [650, 312], [790, 300]],
    [[320, 440], [230, 472], [150, 485]],
    [[790, 300], [850, 380], [880, 440]],
    [[400, 408], [470, 470], [560, 500], [700, 440], [850, 380]]
  ];
  var ITEMS = [
    [360, 424], [420, 372], [470, 312], [524, 318], [512, 250], [540, 158], [598, 322], [724, 306],
    [824, 340], [276, 456], [190, 476], [866, 408], [470, 470], [620, 490]
  ].map(function (p, i) { return { id: 'c' + i, x: p[0], y: p[1], v: 1, t: 'coin' }; })
   .concat([[700, 430], [330, 255], [120, 300]].map(function (p, i) { return { id: 'g' + i, x: p[0], y: p[1], v: 5, t: 'grape' }; }))
   .concat([
     ['shield', 610, 172, 8], ['chestnut', 360, 300, 3], ['chestnut', 255, 520, 3], ['chestnut', 740, 380, 3],
     ['tile', 455, 262, 6], ['tile', 690, 350, 6], ['tile', 232, 410, 6],
     ['dice', 338, 420, 0], ['dice', 300, 478, 0], ['compass', 480, 384, 15],
     ['token', 270, 445, 3], ['token', 345, 458, 3],
     ['flower', 760, 330, 2], ['flower', 830, 270, 2], ['flower', 170, 450, 2], ['flower', 105, 525, 2]
   ].map(function (p, i) { return { id: 'k' + i, x: p[1], y: p[2], v: p[3], t: p[0] }; }));
  var TYPES = { coin: 'Viseu coin', grape: 'Dão grapes', chestnut: 'Castanhas', tile: 'Azulejo tile', flower: 'Garden flower', shield: 'Viriato’s shield', dice: 'Mystery dice', compass: 'Golden compass', token: 'Game token' };
  var PRIZE = { se: 'compass', gv: 'tile', mis: 'tile', soar: 'shield', rossio: 'token', aq: 'flower', fon: 'chestnut', cava: 'shield' };
  function itemIcon(t) {
    var d = INK;
    switch (t) {
      case 'coin': return '<circle r="10" fill="#ffc93c" stroke="#e59a00" stroke-width="3"/><rect x="-1.8" y="-5" width="3.6" height="10" rx="1.5" fill="#e59a00"/>';
      case 'grape': return [[-5, -6], [5, -6], [0, -1], [-5, 4], [5, 4], [0, 9]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="5" fill="#7a5cff" stroke="#5a3fd6" stroke-width="1.5"/>'; }).join('') + '<path d="M0 -10 Q7 -20 12 -13 Q6 -9 0 -10Z" fill="#4cb963"/>';
      case 'shield': return '<path d="M0 -12 L11 -8 V2 Q11 10 0 14 Q-11 10 -11 2 V-8Z" fill="#e2703a" stroke="' + d + '" stroke-width="2" stroke-linejoin="round"/><path d="M0 -12 V14" stroke="#ffc93c" stroke-width="3"/><circle cy="-1" r="3.5" fill="#ffc93c"/>';
      case 'chestnut': return '<path d="M-9 2 Q-9 -10 0 -10 Q9 -10 9 2 Q9 10 0 10 Q-9 10 -9 2Z" fill="#8d5a3b" stroke="' + d + '" stroke-width="2"/><path d="M-3 -10 Q0 -14 3 -10Z" fill="#5a3a24"/><ellipse cx="-3" cy="-2" rx="2.5" ry="4" fill="#b98255"/>';
      case 'tile': return '<rect x="-11" y="-11" width="22" height="22" rx="3" fill="#fff" stroke="#1f5fbf" stroke-width="2.5"/><path d="M0 -8 L8 0 L0 8 L-8 0Z" fill="#1f5fbf"/><circle r="3" fill="#fff"/>';
      case 'flower': return [0, 72, 144, 216, 288].map(function (a) { var r = a * Math.PI / 180; return '<circle cx="' + (Math.cos(r) * 6.5).toFixed(1) + '" cy="' + (Math.sin(r) * 6.5).toFixed(1) + '" r="5" fill="#ff5d73" stroke="' + d + '" stroke-width="1.5"/>'; }).join('') + '<circle r="3.5" fill="#ffc93c" stroke="' + d + '" stroke-width="1.5"/>';
      case 'dice': return '<rect x="-10" y="-10" width="20" height="20" rx="5" fill="#fff" stroke="' + d + '" stroke-width="2.5"/>' + [[-4, -4], [4, 4], [0, 0], [4, -4], [-4, 4]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2" fill="#ff5d73"/>'; }).join('');
      case 'compass': return '<rect x="-2" y="-15" width="4" height="4" rx="1" fill="' + d + '"/><circle r="11" fill="#ffc93c" stroke="' + d + '" stroke-width="2.5"/><circle r="7.5" fill="#fff"/><path d="M0 -6 L2.5 0 L0 6 L-2.5 0Z" fill="#e2703a"/><circle r="1.5" fill="' + d + '"/>';
      case 'token': return '<circle cy="-6" r="5" fill="#7a5cff" stroke="' + d + '" stroke-width="2"/><path d="M-4 -2 L-8 10 H8 L4 -2Z" fill="#7a5cff" stroke="' + d + '" stroke-width="2" stroke-linejoin="round"/>';
    }
    return '';
  }
  var TITLES = ['Curious Visitor', 'Street Wanderer', 'Local Guide', 'Hilltop Hero', 'Viseu Legend'];

  /* ---------- State ---------- */
  function fresh() { return { xp: 0, coins: 0, stamps: {}, got: {}, quiz: {}, chests: {}, mute: false, items: {}, skins: { cap: 1 }, skin: 'cap' }; }
  function load() {
    try {
      var j = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (j && typeof j === 'object') { var s = fresh(); for (var k in s) if (j[k] !== undefined) s[k] = j[k]; return s; }
    } catch (e) {}
    return fresh();
  }
  var S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function level() { return Math.floor(S.xp / 100) + 1; }
  function stampCount() { return SPOTS.filter(function (s) { return S.stamps[s.id]; }).length; }

  /* ---------- Sound ---------- */
  var AC = null;
  function blip(freqs, dur) {
    if (S.mute) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      var t = AC.currentTime;
      freqs.forEach(function (f, i) {
        var o = AC.createOscillator(), g = AC.createGain();
        o.type = 'triangle'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t + i * dur);
        g.gain.exponentialRampToValueAtTime(0.18, t + i * dur + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + i * dur + dur);
        o.connect(g); g.connect(AC.destination);
        o.start(t + i * dur); o.stop(t + i * dur + dur + 0.02);
      });
    } catch (e) {}
  }

  /* ---------- Icons ---------- */
  function icon(type, c) {
    var d = INK, sw = 'stroke="' + d + '" stroke-width="2.5" stroke-linejoin="round"';
    switch (type) {
      case 'cathedral':
        return '<rect x="-22" y="-6" width="44" height="26" rx="3" fill="#fff" ' + sw + '/>' +
          '<rect x="-27" y="-22" width="15" height="42" rx="3" fill="' + c + '" ' + sw + '/><rect x="12" y="-22" width="15" height="42" rx="3" fill="' + c + '" ' + sw + '/>' +
          '<path d="M-28 -22 L-19.5 -40 L-11 -22Z M11 -22 L19.5 -40 L28 -22Z" fill="' + d + '"/><path d="M-6 20 V7 a6 6 0 0 1 12 0 V20Z" fill="' + d + '"/>' +
          '<circle cx="0" cy="-10" r="4" fill="' + c + '" ' + sw + '/>';
      case 'museum':
        return '<path d="M-30 -6 L0 -28 L30 -6Z" fill="' + c + '" ' + sw + '/><rect x="-28" y="-6" width="56" height="6" fill="#fff" ' + sw + '/>' +
          [-20, -7, 6, 19].map(function (x) { return '<rect x="' + x + '" y="0" width="8" height="18" fill="#fff" ' + sw + '/>'; }).join('') +
          '<rect x="-32" y="18" width="64" height="7" rx="2" fill="' + d + '"/><circle cy="-13" r="3.5" fill="#fff"/>';
      case 'church':
        return '<rect x="-24" y="-4" width="48" height="24" rx="3" fill="#fff" ' + sw + '/><path d="M-27 -4 L0 -24 L27 -4Z" fill="' + c + '" ' + sw + '/>' +
          '<rect x="-6" y="-38" width="12" height="16" fill="#fff" ' + sw + '/><path d="M0 -50 V-40 M-4 -46 H4" stroke="' + d + '" stroke-width="3" stroke-linecap="round"/>' +
          '<path d="M-6 20 V8 a6 6 0 0 1 12 0 V20Z" fill="' + d + '"/>';
      case 'gate':
        return '<rect x="-28" y="-18" width="56" height="40" rx="3" fill="' + c + '" ' + sw + '/>' +
          [-28, -12, 4, 20].map(function (x) { return '<rect x="' + x + '" y="-27" width="8" height="10" fill="' + c + '" ' + sw + '/>'; }).join('') +
          '<path d="M-11 22 V0 a11 11 0 0 1 22 0 V22Z" fill="' + d + '"/>';
      case 'square':
        return '<ellipse cy="10" rx="30" ry="14" fill="#bfeefb" ' + sw + '/><ellipse cy="8" rx="19" ry="8" fill="#fff" ' + sw + '/>' +
          '<rect x="-4" y="-14" width="8" height="22" fill="' + c + '" ' + sw + '/><path d="M0 -14 Q-16 -22 -20 -6 M0 -14 Q16 -22 20 -6" fill="none" stroke="' + c + '" stroke-width="4" stroke-linecap="round"/>' +
          '<circle cx="-20" cy="-4" r="3" fill="#3cc3f3"/><circle cx="20" cy="-4" r="3" fill="#3cc3f3"/><circle cy="-20" r="4" fill="#3cc3f3"/>';
      case 'park':
        return [[-16, 6, 15], [14, 8, 13], [0, -10, 17]].map(function (t, i) {
          return '<rect x="' + (t[0] - 3) + '" y="' + t[1] + '" width="6" height="16" fill="#8d5a3b"/><circle cx="' + t[0] + '" cy="' + t[1] + '" r="' + t[2] + '" fill="' + (i === 2 ? '#79d38a' : c) + '" ' + sw + '/>';
        }).join('');
      case 'palace':
        return '<rect x="-30" y="16" width="60" height="8" rx="2" fill="#fff" ' + sw + '/><rect x="-23" y="8" width="46" height="8" rx="2" fill="#fff" ' + sw + '/><rect x="-16" y="0" width="32" height="8" rx="2" fill="#fff" ' + sw + '/>' +
          '<rect x="-20" y="-22" width="40" height="22" fill="' + c + '" ' + sw + '/><path d="M-24 -22 L0 -38 L24 -22Z" fill="' + d + '"/><rect x="-5" y="-14" width="10" height="14" rx="5" fill="#fff"/>';
      case 'earth':
        var o = '-12,-30 12,-30 30,-12 30,12 12,30 -12,30 -30,12 -30,-12', n = '-8,-20 8,-20 20,-8 20,8 8,20 -8,20 -20,8 -20,-8';
        return '<polygon points="' + o + '" fill="' + c + '" ' + sw + '/><polygon points="' + n + '" fill="#9ed98a" ' + sw + '/><circle r="6" fill="#fff" ' + sw + '/>';
    }
    return '';
  }
  function stampSVG(s, locked, big) {
    var col = locked ? '#b6bdd6' : s.color;
    return '<svg class="' + (big ? 'stampbig' : 'st' + (locked ? ' locked' : '')) + '" viewBox="-44 -44 88 88" aria-hidden="true">' +
      '<circle r="41" fill="#fff" stroke="' + col + '" stroke-width="4" stroke-dasharray="6 4"/><circle r="34" fill="' + (locked ? '#eef0f8' : '#fff7de') + '"/>' +
      '<g transform="scale(.7)">' + icon(s.type, col) + '</g></svg>';
  }

  /* ---------- Map ---------- */
  var map = $('#map');
  var seed = 11;
  function rnd() { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
  function segDist(px, py, a, b) {
    var dx = b[0] - a[0], dy = b[1] - a[1], l = dx * dx + dy * dy, t = l ? Math.max(0, Math.min(1, ((px - a[0]) * dx + (py - a[1]) * dy) / l)) : 0;
    return Math.hypot(px - (a[0] + t * dx), py - (a[1] + t * dy));
  }
  function nearRoad(x, y) {
    for (var r = 0; r < ROADS.length; r++) for (var i = 0; i < ROADS[r].length - 1; i++) if (segDist(x, y, ROADS[r][i], ROADS[r][i + 1]) < 30) return true;
    return false;
  }
  function nearSpot(x, y, r) { return SPOTS.some(function (s) { return Math.hypot(s.x - x, s.y - y) < r; }); }
  function inEll(x, y, cx, cy, rx, ry) { return Math.pow((x - cx) / rx, 2) + Math.pow((y - cy) / ry, 2) < 1; }

  var defs = el('defs', {}, map);
  var grad = el('linearGradient', { id: 'gg', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
  el('stop', { offset: 0, 'stop-color': '#e9fadb' }, grad); el('stop', { offset: 1, 'stop-color': '#d6f2c6' }, grad);
  el('rect', { width: 1000, height: 680, fill: 'url(#gg)' }, map);

  // fields
  [[130, 110, 150, 70, '#f6efc4'], [760, 560, 170, 70, '#f6efc4'], [300, 600, 130, 50, '#cdeec0'], [940, 120, 90, 60, '#cdeec0']].forEach(function (f) {
    el('ellipse', { cx: f[0], cy: f[1], rx: f[2], ry: f[3], fill: f[4] }, map);
  });
  // parks
  el('ellipse', { cx: 790, cy: 300, rx: 150, ry: 105, fill: '#b9ecA7'.replace('A', 'a') }, map);
  el('ellipse', { cx: 150, cy: 490, rx: 125, ry: 92, fill: '#b9eca7' }, map);
  var pond = el('ellipse', { cx: 850, cy: 255, rx: 36, ry: 20, fill: '#8fdcf7', class: 'shimmer' }, map);
  el('ellipse', { cx: 842, cy: 252, rx: 14, ry: 5, fill: '#fff', opacity: .6 }, map);
  // Cava octagon
  el('polygon', { points: '545,50 575,50 612,87 612,137 575,174 545,174 508,137 508,87', fill: '#cfe9b4', stroke: '#b58f6a', 'stroke-width': 5, 'stroke-dasharray': '10 7' }, map);
  // old town wall
  el('ellipse', { cx: 480, cy: 340, rx: 122, ry: 92, fill: '#fff5df', stroke: '#d6b08a', 'stroke-width': 7, 'stroke-dasharray': '14 8', opacity: .9 }, map);

  // roads
  var roadG = el('g', { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, map);
  ROADS.forEach(function (r) { el('path', { d: 'M' + r.map(function (p) { return p.join(' '); }).join(' L'), stroke: '#f5e5bd', 'stroke-width': 30 }, roadG); });
  ROADS.forEach(function (r) { el('path', { d: 'M' + r.map(function (p) { return p.join(' '); }).join(' L'), stroke: '#ffffff', 'stroke-width': 22 }, roadG); });
  ROADS.forEach(function (r) { el('path', { d: 'M' + r.map(function (p) { return p.join(' '); }).join(' L'), stroke: '#ffd9a8', 'stroke-width': 3, 'stroke-dasharray': '2 14' }, roadG); });

  var rdl = el('text', { x: 350, y: 410, class: 'street', 'text-anchor': 'middle', transform: 'rotate(-22 350 410)' }, map); rdl.textContent = 'Rua Direita';

  // houses
  var roofs = ['#ff5d73', '#ffc93c', '#7a5cff', '#1fbfae', '#ff9f1c', '#3cc3f3'];
  var houseG = el('g', {}, map);
  for (var h = 0, placed = 0; h < 900 && placed < 150; h++) {
    var hx = 30 + rnd() * 940, hy = 40 + rnd() * 600;
    var dTown = Math.hypot((hx - 470) / 1.25, hy - 360);
    if (dTown > 300 || rnd() > 1.15 - dTown / 300) continue;
    if (inEll(hx, hy, 790, 300, 160, 115) || inEll(hx, hy, 150, 490, 135, 102) || inEll(hx, hy, 560, 112, 80, 80) || inEll(hx, hy, 880, 440, 70, 70)) continue;
    if (nearRoad(hx, hy) || nearSpot(hx, hy, 62)) continue;
    var w = 18 + rnd() * 14, ht = 16 + rnd() * 12, rc = roofs[Math.floor(rnd() * roofs.length)];
    el('rect', { x: hx - w / 2, y: hy - ht / 2 + 3, width: w, height: ht, rx: 4, fill: '#fff', stroke: '#e6dcc4', 'stroke-width': 2 }, houseG);
    el('rect', { x: hx - w / 2, y: hy - ht / 2 - 2, width: w, height: ht * .62, rx: 4, fill: rc }, houseG);
    placed++;
  }
  // trees
  var treeG = el('g', {}, map);
  function tree(x, y, sc) {
    var g = el('g', { transform: 'translate(' + x + ' ' + y + ') scale(' + sc + ')' }, treeG);
    var tt = el('g', { class: 'tree', style: 'animation-delay:' + (-rnd() * 4).toFixed(2) + 's' }, g);
    el('rect', { x: -2.5, y: 2, width: 5, height: 10, fill: '#8d5a3b' }, tt);
    el('circle', { cy: -4, r: 12, fill: rnd() > .5 ? '#4cb963' : '#38a853' }, tt);
    el('circle', { cx: -4, cy: -8, r: 4, fill: '#8ee29c', opacity: .8 }, tt);
  }
  for (var t = 0, tp = 0; t < 700 && tp < 70; t++) {
    var tx = 20 + rnd() * 960, ty = 30 + rnd() * 620, inPark = inEll(tx, ty, 790, 300, 140, 95) || inEll(tx, ty, 150, 490, 115, 82);
    if (!inPark && rnd() > .22) continue;
    if (inEll(tx, ty, 850, 255, 44, 28) || nearRoad(tx, ty) || nearSpot(tx, ty, 58) || inEll(tx, ty, 480, 340, 120, 90) || inEll(tx, ty, 880, 440, 62, 62)) continue;
    tree(tx, ty, .8 + rnd() * .5); tp++;
  }
  // flowers in parks
  for (var f = 0; f < 40; f++) {
    var fx = 20 + rnd() * 960, fy = 30 + rnd() * 620;
    if (!(inEll(fx, fy, 790, 300, 140, 95) || inEll(fx, fy, 150, 490, 115, 82)) || nearRoad(fx, fy) || nearSpot(fx, fy, 50) || inEll(fx, fy, 850, 255, 44, 28)) continue;
    el('circle', { cx: fx, cy: fy, r: 3.2, fill: roofs[f % roofs.length] }, map);
  }

  // fair (decorative ferris wheel)
  var fair = el('g', { class: 'fair', transform: 'translate(888 450)' }, map);
  el('path', { d: 'M-26 52 L0 4 L26 52', fill: 'none', stroke: INK, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, fair);
  var wheel = el('g', { class: 'wheel' }, fair);
  el('circle', { r: 46, fill: 'rgba(255,255,255,.5)', stroke: INK, 'stroke-width': 4 }, wheel);
  for (var sp = 0; sp < 8; sp++) {
    var an = sp * Math.PI / 4, cxp = Math.cos(an) * 46, cyp = Math.sin(an) * 46;
    el('line', { x1: 0, y1: 0, x2: cxp, y2: cyp, stroke: INK, 'stroke-width': 2.5 }, wheel);
    el('circle', { cx: cxp, cy: cyp, r: 8, fill: roofs[sp % 6], stroke: INK, 'stroke-width': 2.5 }, wheel);
  }
  el('circle', { r: 6, fill: INK }, fair);
  var fl = el('text', { y: 82, 'text-anchor': 'middle', 'font-size': 14 }, fair); fl.textContent = 'São Mateus fair';

  // collectibles
  var itemG = el('g', {}, map), itemEls = {};
  ITEMS.forEach(function (it) {
    var g = el('g', { transform: 'translate(' + it.x + ' ' + it.y + ')' }, itemG);
    if (it.t === 'coin') {
      var c = el('g', { class: 'coin', style: 'animation-delay:' + (-rnd() * 1.8).toFixed(2) + 's' }, g);
      el('circle', { r: 10, fill: '#ffc93c', stroke: '#e59a00', 'stroke-width': 3 }, c);
      el('rect', { x: -1.8, y: -5, width: 3.6, height: 10, rx: 1.5, fill: '#e59a00' }, c);
    } else {
      g.insertAdjacentHTML('beforeend', '<g class="ibob" style="animation-delay:' + (-rnd() * 2.6).toFixed(2) + 's">' + itemIcon(it.t) + '</g>');
    }
    if (S.got[it.id]) g.setAttribute('display', 'none');
    itemEls[it.id] = g;
  });

  // landmarks
  var spotG = el('g', {}, map), spotEls = {};
  SPOTS.forEach(function (s) {
    var g = el('g', { class: 'spot' + (S.stamps[s.id] ? ' done' : ''), transform: 'translate(' + s.x + ' ' + s.y + ')', 'data-id': s.id }, spotG);
    el('circle', { class: 'halo', r: 50 }, g);
    var b = el('g', { class: 'bob' }, g);
    el('ellipse', { cy: 28, rx: 30, ry: 7, fill: 'rgba(29,42,74,.15)' }, g);
    b.insertAdjacentHTML('beforeend', icon(s.type, s.color));
    var tk = el('g', { class: 'tick', transform: 'translate(30 -30)' }, g);
    el('circle', { r: 13, fill: '#1fbfae', stroke: '#fff', 'stroke-width': 3 }, tk);
    el('path', { d: 'M-6 0 L-2 5 L7 -5', fill: 'none', stroke: '#fff', 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, tk);
    var lb = el('text', { y: 52, 'text-anchor': 'middle' }, g); lb.textContent = s.name;
    spotEls[s.id] = g;
  });

  // clouds and birds
  var skyG = el('g', { 'pointer-events': 'none' }, map);
  [[70, 60, 38], [160, 250, 52], [60, 590, 30]].forEach(function (c, i) {
    var cg = el('g', { class: 'cloud', style: 'animation-duration:' + (60 + i * 25) + 's;animation-delay:' + (-i * 22) + 's' }, skyG);
    var tr = el('g', { transform: 'translate(0 ' + c[1] + ') scale(' + (c[2] / 40) + ')' }, cg);
    [[0, 0, 26], [26, -8, 22], [52, 0, 24], [26, 8, 28]].forEach(function (e) { el('ellipse', { cx: e[0], cy: e[1], rx: e[2], ry: e[2] * .62, fill: '#fff', opacity: .85 }, tr); });
  });
  [[0, 90], [-120, 150]].forEach(function (b, i) {
    var bg = el('g', { class: 'bird', style: 'animation-delay:' + (i * -6) + 's;animation-duration:' + (14 + i * 4) + 's' }, skyG);
    var pos = el('g', { transform: 'translate(' + b[0] + ' ' + b[1] + ')' }, bg);
    var fp = el('g', { class: 'flap' }, pos);
    el('path', { d: 'M-12 0 Q-6 -9 0 0 Q6 -9 12 0', fill: 'none', stroke: INK, 'stroke-width': 3, 'stroke-linecap': 'round' }, fp);
  });

  // effects layer, target ping, player
  var fx = el('g', { 'pointer-events': 'none' }, map);
  var ping = el('circle', { r: 14, fill: 'none', stroke: '#ff5d73', 'stroke-width': 4, class: 'ping', display: 'none' }, map);
  var meG = el('g', { 'pointer-events': 'none' }, map);
  el('circle', { class: 'sonar', r: 26, cy: 6, fill: 'none', stroke: '#1f5fbf', 'stroke-width': 3 }, meG);
  el('ellipse', { cy: 20, rx: 18, ry: 6, fill: 'rgba(29,42,74,.25)' }, meG);
  var hop = el('g', { class: 'idle' }, meG);
  var face = el('g', {}, hop);
  el('rect', { x: -13, y: -2, width: 26, height: 22, rx: 11, fill: '#ff5d73', stroke: INK, 'stroke-width': 3 }, face);
  el('circle', { cy: -12, r: 15, fill: '#ffd9b0', stroke: INK, 'stroke-width': 3 }, face);
  var hatA = el('path', { d: 'M-17 -15 Q0 -38 17 -15 Z', fill: '#ffc93c', stroke: INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, face);
  var hatB = el('rect', { x: -21, y: -16, width: 42, height: 6, rx: 3, fill: '#ffc93c', stroke: INK, 'stroke-width': 3 }, face);
  el('circle', { cx: 5, cy: -9, r: 2.4, fill: INK }, face); el('circle', { cx: 12, cy: -9, r: 2.4, fill: INK }, face);
  el('path', { d: 'M5 -3 Q8.5 0 12 -3', fill: 'none', stroke: INK, 'stroke-width': 2, 'stroke-linecap': 'round' }, face);
  el('rect', { x: -17, y: 2, width: 9, height: 14, rx: 4, fill: '#7a5cff', stroke: INK, 'stroke-width': 2.5 }, face);

  /* ---------- Player and loop ---------- */
  var me = { x: 285, y: 480 }, target = null, heading = 1, nearId = null, modalOpen = false, keys = {};
  var SPEED = 230;
  var VB = { x: 0, y: 0, w: 1000, h: 680 }, vbAnim = 0;
  function setVB() { map.setAttribute('viewBox', VB.x.toFixed(1) + ' ' + VB.y.toFixed(1) + ' ' + VB.w.toFixed(1) + ' ' + VB.h.toFixed(1)); }
  function zoomPulse(s) {
    if (RM || !s) return;
    cancelAnimationFrame(vbAnim);
    var t0 = performance.now(), dur = 1800;
    function step(now) {
      var p = Math.min(1, (now - t0) / dur), k = Math.sin(Math.PI * p), z = 1 - 0.2 * k;
      VB.w = 1000 * z; VB.h = 680 * z;
      VB.x = Math.max(0, Math.min(1000 - VB.w, 500 + (s.x - 500) * k * 0.7 - VB.w / 2));
      VB.y = Math.max(0, Math.min(680 - VB.h, 340 + (s.y - 340) * k * 0.7 - VB.h / 2));
      setVB();
      if (p < 1) vbAnim = requestAnimationFrame(step); else { VB = { x: 0, y: 0, w: 1000, h: 680 }; setVB(); }
    }
    vbAnim = requestAnimationFrame(step);
  }
  var lastComp = '';
  function updateCompass() {
    var n = nextStop(), txt = 'All found', ang = 0;
    if (n) { ang = Math.atan2(n.s.y - me.y, n.s.x - me.x) * 180 / Math.PI + 90; txt = n.d < 78 ? 'Here!' : Math.round(n.d / 9) + ' steps'; }
    var key = txt + '|' + Math.round(ang / 4);
    if (key === lastComp) return; lastComp = key;
    $('#needle').style.transform = 'rotate(' + ang.toFixed(0) + 'deg)'; $('#compTxt').textContent = txt;
  }
  function place() { meG.setAttribute('transform', 'translate(' + me.x.toFixed(1) + ' ' + me.y.toFixed(1) + ')'); face.setAttribute('transform', 'scale(' + heading + ' 1)'); }
  place();

  function svgPoint(ev) {
    var pt = map.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
    var m = map.getScreenCTM(); return m ? pt.matrixTransform(m.inverse()) : { x: me.x, y: me.y };
  }
  function walkTo(x, y) {
    target = { x: Math.max(24, Math.min(976, x)), y: Math.max(40, Math.min(650, y)) };
    ping.setAttribute('cx', target.x); ping.setAttribute('cy', target.y); ping.setAttribute('display', 'inline');
    blip([420], .06);
  }
  map.addEventListener('pointerdown', function (ev) {
    if (modalOpen) return;
    var p = svgPoint(ev), best = null, bd = 48;
    SPOTS.forEach(function (s) { var d = Math.hypot(s.x - p.x, s.y - p.y); if (d < bd) { bd = d; best = s; } });
    if (best) walkTo(best.x, best.y + 44); else walkTo(p.x, p.y);
  });
  var KEYMAP = { ArrowLeft: 'l', a: 'l', A: 'l', ArrowRight: 'r', d: 'r', D: 'r', ArrowUp: 'u', w: 'u', W: 'u', ArrowDown: 'd', s: 'd', S: 'd' };
  window.addEventListener('keydown', function (e) {
    if (modalOpen) { if (e.key === 'Escape') closeModal(); return; }
    var k = KEYMAP[e.key]; if (!k) return;
    if (document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
    keys[k] = true; e.preventDefault();
  });
  window.addEventListener('keyup', function (e) { var k = KEYMAP[e.key]; if (k) keys[k] = false; });
  window.addEventListener('blur', function () { keys = {}; });

  var last = 0;
  function frame(t) {
    requestAnimationFrame(frame);
    var dt = Math.min(.05, (t - last) / 1000 || 0); last = t;
    if (modalOpen || document.hidden) return;
    var vx = (keys.r ? 1 : 0) - (keys.l ? 1 : 0), vy = (keys.d ? 1 : 0) - (keys.u ? 1 : 0), moving = false;
    if (vx || vy) {
      var l = Math.hypot(vx, vy); target = null; ping.setAttribute('display', 'none');
      me.x += vx / l * SPEED * dt; me.y += vy / l * SPEED * dt; if (vx) heading = vx > 0 ? 1 : -1; moving = true;
    } else if (target) {
      var dx = target.x - me.x, dy = target.y - me.y, d = Math.hypot(dx, dy);
      if (d < 3) { target = null; ping.setAttribute('display', 'none'); }
      else { var st = Math.min(d, SPEED * dt); me.x += dx / d * st; me.y += dy / d * st; if (Math.abs(dx) > 2) heading = dx > 0 ? 1 : -1; moving = true; }
    }
    me.x = Math.max(20, Math.min(980, me.x)); me.y = Math.max(40, Math.min(650, me.y));
    hop.setAttribute('class', moving ? 'walk' : 'idle');
    place();
    updateCompass();
    // landmark proximity
    var nid = null, nd = 78;
    SPOTS.forEach(function (s) { var d = Math.hypot(s.x - me.x, s.y - me.y); if (d < nd) { nd = d; nid = s.id; } });
    if (nid !== nearId) {
      if (nearId) spotEls[nearId].classList.remove('near');
      nearId = nid; if (nid) { spotEls[nid].classList.add('near'); blip([660, 880], .08); zoomPulse(SPOTS.filter(function (q) { return q.id === nid; })[0]); }
      renderDock();
    }
    // collectibles
    ITEMS.forEach(function (it) {
      if (S.got[it.id]) return;
      if (Math.hypot(it.x - me.x, it.y - me.y) < 26) collect(it);
    });
  }
  requestAnimationFrame(frame);

  function collect(it) {
    var v = it.t === 'dice' ? 2 + Math.floor(Math.random() * 11) : it.v;
    S.got[it.id] = 1; S.coins += v; S.items[it.t] = (S.items[it.t] || 0) + 1; save();
    itemEls[it.id].setAttribute('display', 'none');
    popText(it.x, it.y, '+' + v, it.t === 'coin' ? '#e59a00' : '#7a5cff');
    burst(it.x, it.y, it.t === 'coin' ? '#ffc93c' : '#7a5cff');
    blip(it.t === 'coin' ? [880, 1320] : [660, 880, 1100], .07);
    $('#live').textContent = 'Found ' + TYPES[it.t] + ', plus ' + v + ' coins';
    renderHud(); renderItems();
  }
  function popText(x, y, txt, col) {
    var t = el('text', { x: x, y: y - 10, 'text-anchor': 'middle', class: 'float', fill: col, 'font-size': 26, 'font-weight': 700, style: 'font-family:var(--font-display);paint-order:stroke;stroke:#fff;stroke-width:5px' }, fx);
    t.textContent = txt; setTimeout(function () { t.remove(); }, 1000);
  }
  function burst(x, y, col) {
    var c = el('circle', { cx: x, cy: y, r: 14, fill: 'none', stroke: col, 'stroke-width': 4, class: 'burst' }, fx);
    setTimeout(function () { c.remove(); }, 650);
  }

  /* ---------- HUD, dock, passport ---------- */
  function renderHud() {
    var lv = level();
    $('#lvlName').textContent = 'Lv ' + lv + ' ' + TITLES[Math.min(lv - 1, TITLES.length - 1)];
    $('#xpFill').style.width = (S.xp % 100) + '%';
    $('#coinN').textContent = S.coins;
    $('#stampN').textContent = stampCount() + '/8';
    $('#ppCount').textContent = stampCount() + ' of 8 stamps';
    var sb = $('#snd'); sb.setAttribute('aria-pressed', S.mute ? 'false' : 'true'); sb.setAttribute('aria-label', S.mute ? 'Sound off' : 'Sound on');
    $('#sndWave').style.display = S.mute ? 'none' : '';
  }
  function nextStop() {
    var best = null, bd = 1e9;
    SPOTS.forEach(function (s) { if (S.stamps[s.id]) return; var d = Math.hypot(s.x - me.x, s.y - me.y); if (d < bd) { bd = d; best = s; } });
    return best ? { s: best, d: bd } : null;
  }
  function renderDock() {
    var d = $('#dock'), s = nearId && SPOTS.filter(function (x) { return x.id === nearId; })[0], h;
    if (s) {
      var got = S.stamps[s.id];
      h = '<svg class="ico" viewBox="-44 -44 88 88" aria-hidden="true"><g transform="scale(1.2)">' + icon(s.type, s.color) + '</g></svg>' +
        '<div class="txt"><h2>' + (got ? 'Welcome back to ' : 'You’re at ') + s.name + '</h2><p>' + (got ? (S.quiz[s.id] ? 'Stamp collected and quiz done.' : 'Stamp collected. Quiz still open for bonus coins.') : 'Check in to earn a stamp, XP and coins.') + '</p></div>' +
        '<button class="btn' + (got ? ' alt' : ' pulse') + '" type="button" data-act="open" data-id="' + s.id + '">' + (got ? 'Open' : 'Check in') + '</button>';
    } else if (stampCount() === 8) {
      h = '<svg class="ico" viewBox="-12 -12 24 24" aria-hidden="true"><path d="M0 -10 L3 -3.2 10 -2.6 4.8 2 6.2 9 0 5.5 -6.2 9 -4.8 2 -10 -2.6 -3 -3.2Z" fill="#ffc93c" stroke="#1d2a4a" stroke-width="1.2" stroke-linejoin="round"/></svg>' +
        '<div class="txt"><h2>Viseu Legend!</h2><p>All 8 stamps collected. Keep wandering for leftover coins and grapes.</p></div>';
    } else {
      var n = nextStop();
      h = '<svg class="ico" viewBox="-44 -44 88 88" aria-hidden="true"><g transform="scale(1.2)">' + icon(n.s.type, n.s.color) + '</g></svg>' +
        '<div class="txt"><h2>Next stop: ' + n.s.name + '</h2><p>About ' + Math.max(1, Math.round(n.d / 9)) + ' steps away. Pick up coins on the way.</p></div>' +
        '<button class="btn go" type="button" data-act="go" data-id="' + n.s.id + '">Walk there</button>';
    }
    d.innerHTML = h;
  }
  function renderGrid() {
    $('#grid').innerHTML = SPOTS.map(function (s) {
      var got = S.stamps[s.id];
      return '<div class="card' + (got ? ' got' : '') + '">' + stampSVG(s, !got, false) + '<div><h3>' + s.name + '</h3><p>' + (got ? (S.quiz[s.id] ? 'Stamped, quiz done' : 'Stamped') : 'Not visited yet') + '</p>' +
        (got ? '' : '<button class="btn go" type="button" data-act="go" data-id="' + s.id + '">Walk there</button>') + '</div></div>';
    }).join('');
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-act]'); if (!b) return;
    var act = b.getAttribute('data-act');
    if (act === 'buy' || act === 'equip') { skinAct(act, b.getAttribute('data-id')); return; }
    var s = SPOTS.filter(function (x) { return x.id === b.getAttribute('data-id'); })[0]; if (!s) return;
    if (b.getAttribute('data-act') === 'go') { walkTo(s.x, s.y + 44); window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }); }
    else if (b.getAttribute('data-act') === 'open') openSpot(s);
  });

  /* ---------- Modal ---------- */
  var modal = $('#modal'), mBody = $('#mBody'), pendingCelebrate = [];
  function openModal() { modalOpen = true; modal.hidden = false; keys = {}; setTimeout(function () { var f = modal.querySelector('.btn, .opt'); if (f) f.focus(); }, 30); }
  function closeModal() {
    modal.hidden = true; modalOpen = false; renderDock(); renderGrid(); renderHud(); renderItems();
    while (pendingCelebrate.length) celebrate(pendingCelebrate.shift());
    map.focus({ preventScroll: true });
  }
  $('#mClose').addEventListener('click', closeModal);
  modal.addEventListener('pointerdown', function (e) { if (e.target === modal) closeModal(); });

  function addXp(n) {
    var before = level(); S.xp += n;
    if (level() > before) pendingCelebrate.push('Level ' + level() + ': ' + TITLES[Math.min(level() - 1, TITLES.length - 1)]);
  }
  function openSpot(s) {
    var first = !S.stamps[s.id];
    if (first) {
      S.stamps[s.id] = 1; S.coins += 10; addXp(40);
      S.items[PRIZE[s.id]] = (S.items[PRIZE[s.id]] || 0) + 1;
      spotEls[s.id].classList.add('done');
      var n = stampCount();
      [4, 8].forEach(function (k) { if (n >= k && !S.chests[k]) { S.chests[k] = 1; S.coins += 100; pendingCelebrate.push(k === 8 ? 'All stamps! Viseu Legend +100 coins' : 'Treasure chest! +100 coins'); } });
      save();
    }
    if (first) stage0(s); else stage1(s, false);
    openModal();
  }
  function stage1(s, first) {
    var qd = S.quiz[s.id];
    mBody.innerHTML = '<div class="' + (first ? 'flipin' : '') + '">' + stampSVG(s, false, true) + '<h2 id="mTitle">' + s.name + '</h2><p class="fact">' + s.fact + '</p>' +
      (first ? '<div class="rewards"><span class="rw">+40 XP</span><span class="rw">+10 coins</span><span class="rw b">Stamp collected</span>' + prizeChip(s) + '</div>' : '') +
      '<div class="actions">' + (qd ? '' : '<button class="btn" type="button" id="goQuiz">Quick quiz: +20 coins</button>') + '<button class="btn ghost" type="button" id="mDone">' + (qd ? 'Close' : 'Later') + '</button></div></div>';
    var gq = $('#goQuiz'); if (gq) gq.onclick = function () { stage2(s); };
    $('#mDone').onclick = closeModal; var f = mBody.querySelector('.btn'); if (f) f.focus();
  }
  function prizeChip(s) {
    var t = PRIZE[s.id];
    return '<span class="rw c"><svg width="20" height="20" viewBox="-16 -16 32 32" style="vertical-align:-5px" aria-hidden="true">' + itemIcon(t) + '</svg> ' + TYPES[t] + '</span>';
  }
  function crateSVG() {
    return '<svg viewBox="-60 -60 120 120" width="150" height="150" aria-hidden="true"><rect x="-46" y="-46" width="92" height="92" rx="14" fill="#fff" stroke="#1f5fbf" stroke-width="5"/>' +
      [[-23, -23], [23, -23], [-23, 23], [23, 23]].map(function (p) { return '<g transform="translate(' + p[0] + ' ' + p[1] + ')"><path d="M0 -17 L17 0 L0 17 L-17 0Z" fill="#1f5fbf"/><path d="M0 -8 L8 0 L0 8 L-8 0Z" fill="#fff"/><circle r="2.5" fill="#e2703a"/></g>'; }).join('') +
      '<path d="M-46 0 H46 M0 -46 V46" stroke="#e2703a" stroke-width="6"/><circle r="10" fill="#ffc93c" stroke="#1d2a4a" stroke-width="3"/></svg>';
  }
  function stage0(s) {
    mBody.innerHTML = '<h2 id="mTitle">A tile crate!</h2><p class="fact">You reached ' + s.name + '. Open the crate to reveal your stamp.</p><div class="cratewrap"><button class="crate" type="button" id="crate" aria-label="Open the crate">' + crateSVG() + '</button></div>';
    var c = $('#crate'); c.focus();
    c.onclick = function () {
      c.disabled = true; c.classList.add('opening'); blip([523, 659, 784, 1046], .1);
      if (!RM) mBody.insertAdjacentHTML('beforeend', '<div class="raywrap" aria-hidden="true"><div class="rays"></div></div>');
      setTimeout(function () { if (!c.isConnected) return; stage1(s, true); confetti(60); }, RM ? 0 : 800);
    };
  }
  function stage2(s) {
    mBody.innerHTML = '<h2 id="mTitle">Quick quiz</h2><p class="fact" style="color:var(--ink);font-size:18px">' + s.q + '</p><div class="opts">' +
      s.o.map(function (o, i) { return '<button class="opt" type="button" data-i="' + i + '">' + o + '</button>'; }).join('') + '</div><div class="fb" id="fb" aria-live="polite"></div><div class="actions" id="qa"></div>';
    var done = false;
    mBody.querySelectorAll('.opt').forEach(function (b) {
      b.onclick = function () {
        if (done) return; done = true;
        var i = +b.getAttribute('data-i'), ok = i === s.a;
        mBody.querySelectorAll('.opt').forEach(function (x, j) { x.disabled = true; if (j === s.a) x.classList.add('right'); });
        if (ok) { b.classList.add('right'); S.coins += 20; addXp(20); S.quiz[s.id] = 1; $('#fb').textContent = 'Correct! +20 coins and +20 XP'; blip([784, 988, 1318], .09); confetti(50); }
        else { b.classList.add('wrong'); S.quiz[s.id] = 1; $('#fb').textContent = 'Not quite. The answer glows green.'; blip([300, 220], .12); }
        save(); renderHud();
        $('#qa').innerHTML = '<button class="btn" type="button" id="qDone">Keep exploring</button>'; $('#qDone').onclick = closeModal; $('#qDone').focus();
      };
    });
    var f = mBody.querySelector('.opt'); if (f) f.focus();
  }

  /* ---------- Banner and confetti ---------- */
  var bn = $('#banner'), bt = 0;
  function celebrate(msg) {
    bn.textContent = msg; bn.classList.add('show'); $('#live').textContent = msg;
    clearTimeout(bt); bt = setTimeout(function () { bn.classList.remove('show'); }, 3200);
    confetti(150); blip([523, 659, 784, 1046, 1318], .11);
  }
  var cv = $('#confetti'), cx = cv.getContext('2d'), parts = [], running = false, COLS = ['#ff5d73', '#ffc93c', '#1fbfae', '#7a5cff', '#3cc3f3', '#ff9f1c'];
  function sizeCv() { var r = window.devicePixelRatio || 1; cv.width = innerWidth * r; cv.height = innerHeight * r; cx.setTransform(r, 0, 0, r, 0, 0); }
  function confetti(n) {
    if (RM) return; sizeCv();
    for (var i = 0; i < n; i++) parts.push({ x: innerWidth / 2 + (Math.random() - .5) * 120, y: innerHeight * .4, vx: (Math.random() - .5) * 15, vy: -Math.random() * 13 - 4, r: 4 + Math.random() * 6, c: COLS[i % COLS.length], a: Math.random() * 6, va: (Math.random() - .5) * .4, life: 0 });
    if (!running) { running = true; requestAnimationFrame(cf); }
  }
  function cf() {
    cx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(function (p) { return p.y < innerHeight + 20 && p.life < 200; });
    parts.forEach(function (p) {
      p.vy += .4; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va; p.life++;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.a); cx.fillStyle = p.c; cx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); cx.restore();
    });
    if (parts.length) requestAnimationFrame(cf); else { running = false; cx.clearRect(0, 0, innerWidth, innerHeight); }
  }

  /* ---------- Controls ---------- */
  $('#snd').addEventListener('click', function () { S.mute = !S.mute; save(); renderHud(); if (!S.mute) blip([660, 880], .08); });
  var rs = $('#reset'), rt = 0;
  rs.addEventListener('click', function () {
    if (rs.getAttribute('data-arm')) {
      S = fresh(); save(); location.reload(); return;
    }
    rs.setAttribute('data-arm', '1'); rs.textContent = 'Tap again to erase all progress';
    clearTimeout(rt); rt = setTimeout(function () { rs.removeAttribute('data-arm'); rs.textContent = 'Start over'; }, 4000);
  });

  var SKINS = [
    { id: 'cap', name: 'Sunny cap', price: 0, hat: '#ffc93c' },
    { id: 'viriato', name: 'Viriato helm', price: 60, hat: '#cd7f32' },
    { id: 'dao', name: 'Dão wine', price: 90, hat: '#8e2a5c' },
    { id: 'azulejo', name: 'Azulejo blue', price: 120, hat: '#1f5fbf' }
  ];
  function skinById(id) { return SKINS.filter(function (k) { return k.id === id; })[0] || SKINS[0]; }
  function applySkin() { var k = skinById(S.skin); hatA.setAttribute('fill', k.hat); hatB.setAttribute('fill', k.hat); }
  function renderItems() {
    var order = ['coin', 'grape', 'chestnut', 'tile', 'flower', 'shield', 'dice', 'compass', 'token'];
    $('#colCount').textContent = Object.keys(S.got).length + ' of ' + ITEMS.length + ' picked up on the map';
    $('#items').innerHTML = order.map(function (t) {
      var n = S.items[t] || 0;
      return '<div class="card' + (n ? ' got' : '') + '"><svg class="st' + (n ? '' : ' locked') + '" viewBox="-16 -16 32 32" aria-hidden="true">' + itemIcon(t) + '</svg><div><h3>' + TYPES[t] + '</h3><p>' + (n ? '× ' + n : 'Not found yet') + '</p></div></div>';
    }).join('');
  }
  function renderShop() {
    $('#shop').innerHTML = SKINS.map(function (k) {
      var own = S.skins[k.id], on = S.skin === k.id;
      return '<div class="card' + (on ? ' got' : '') + '"><svg class="st" viewBox="-20 -24 40 40" aria-hidden="true"><circle cy="-2" r="13" fill="#ffd9b0" stroke="#1d2a4a" stroke-width="2.5"/><path d="M-15 -4 Q0 -30 15 -4Z" fill="' + k.hat + '" stroke="#1d2a4a" stroke-width="2.5" stroke-linejoin="round"/><rect x="-18" y="-5" width="36" height="5" rx="2.5" fill="' + k.hat + '" stroke="#1d2a4a" stroke-width="2.5"/></svg><div><h3>' + k.name + '</h3><p>' + (on ? 'Wearing' : own ? 'Owned' : k.price + ' coins') + '</p>' + (on ? '' : '<button class="btn go" type="button" data-act="' + (own ? 'equip' : 'buy') + '" data-id="' + k.id + '">' + (own ? 'Wear' : 'Buy') + '</button>') + '</div></div>';
    }).join('');
  }
  function skinAct(act, id) {
    var k = skinById(id), msg = $('#shopMsg');
    if (act === 'buy' && !S.skins[id]) {
      if (S.coins < k.price) { msg.textContent = 'Need ' + (k.price - S.coins) + ' more coins for ' + k.name; blip([300, 220], .1); return; }
      S.coins -= k.price; S.skins[id] = 1;
    }
    if (!S.skins[id]) return;
    S.skin = id; save(); applySkin(); renderHud(); renderShop();
    $('#shopMsg').textContent = 'Now wearing ' + k.name; blip([660, 880, 1100], .08); confetti(40);
  }
  renderHud(); renderDock(); renderGrid(); renderItems(); renderShop(); applySkin(); updateCompass();
  initializeStudioShop().catch(function (error) {
    console.error('Studio Shop initialization failed.', error);
    var status = document.querySelector('#studioShopStatus');
    status.textContent = 'Studio Shop could not initialize. Reload and try again.';
    status.classList.add('is-error');
  });
})();
