/* ReViva — ilustração autoral do jardim ("papel recortado e aquarela")
   Cada planta é desenhada em camadas de papel com uma mancha de aquarela por trás,
   luz vinda do alto à esquerda e pequenas imperfeições de mão. Tudo em SVG, sem imagens. */
(function () {
  const P = {
    paper: '#F6EFE5', paperD: '#E8DCCB', soil: '#CDB69A', soilD: '#B59A7B', soilL: '#E3D3BE',
    stem: '#6F8A7B', stemD: '#4F6A5B', leaf: '#8AA58F', leafL: '#B5C9B6', leafD: '#5F7A68',
    gold: '#C79A4B', goldL: '#EAC57A', cream: '#FFF8EC', ink: '#2E2436',
    rose: '#C08499', roseL: '#E7BFCB', roseD: '#9E6A80',
    blue: '#8FA8C9', blueL: '#C9D8EA', blueD: '#5E7CA6',
    lav: '#9B86B8', lavL: '#CBBEDD', lavD: '#6E5B8F',
    olive: '#4E5C4A', oliveL: '#A7B3A0',
    sun: '#E7B64A', sunD: '#B9862B', sunL: '#F6D98A', seed: '#5B3F2E'
  };
  // ruído determinístico (mesmo desenho a cada abertura)
  const rnd = (seed) => { let t = seed * 9301 + 49297; return () => { t = (t * 9301 + 49297) % 233280; return t / 233280; }; };
  const r2 = (n) => Math.round(n * 100) / 100;

  // --- primitivas de papel --------------------------------------------------
  // mancha de aquarela: elipse suave atrás do desenho
  const wash = (x, y, rx, ry, c, o = .35, st = 3) => { const k = st === 1 ? .45 : st === 2 ? .75 : 1; return `<ellipse cx="${x}" cy="${r2(y * k)}" rx="${r2(rx * k)}" ry="${r2(ry * k)}" fill="${c}" opacity="${r2(o * (st === 1 ? .6 : 1))}" filter="url(#rvBlur)"/>`; };
  // folha em duas camadas (sombra de papel + folha + nervura de luz)
  const leaf = (x, y, len, wid, ang, c = P.leaf, cd = P.leafD, cl = P.leafL) => {
    const d = `M0,0 C${wid},${-len * .28} ${wid * .95},${-len * .74} 0,${-len} C${-wid * .9},${-len * .74} ${-wid * .85},${-len * .3} 0,0Z`;
    return `<g transform="translate(${x} ${y}) rotate(${ang})"><path d="${d}" fill="${cd}" transform="translate(1.4 1.2)"/><path d="${d}" fill="${c}"/><path d="M${-wid * .25},${-len * .2} C${-wid * .35},${-len * .5} ${-wid * .15},${-len * .75} 0,${-len * .9}" stroke="${cl}" stroke-width="${Math.max(1, wid * .18)}" fill="none" stroke-linecap="round" opacity=".9"/></g>`;
  };
  // pétala de papel
  const petal = (x, y, len, wid, ang, c, cd) => {
    const d = `M0,0 C${wid},${-len * .35} ${wid * .8},${-len * .85} 0,${-len} C${-wid * .8},${-len * .85} ${-wid},${-len * .35} 0,0Z`;
    return `<g transform="translate(${x} ${y}) rotate(${ang})"><path d="${d}" fill="${cd}" transform="translate(1 1)"/><path d="${d}" fill="${c}"/></g>`;
  };
  const stem = (x0, y0, x1, y1, w = 3, bend = 4, c = P.stem) =>
    `<path d="M${x0},${y0} C${x0 - bend},${y0 + (y1 - y0) * .35} ${x1 + bend},${y0 + (y1 - y0) * .7} ${x1},${y1}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;

  // canteiro: monte de terra em papel, pedrinhas e raízes (o que fica)
  const ground = (w = 34, roots = true) => `
    <ellipse cx="2" cy="6" rx="${w + 8}" ry="9" fill="${P.ink}" opacity=".06"/>
    <path d="M${-w},3 Q${-w * .5},-8 0,-6 Q${w * .55},-9 ${w},3 Q${w * .4},9 0,8 Q${-w * .5},9 ${-w},3Z" fill="${P.soilL}"/>
    <path d="M${-w + 4},3 Q${-w * .4},-4 0,-3 Q${w * .5},-5 ${w - 4},3 Q${w * .3},6 0,6 Q${-w * .4},6 ${-w + 4},3Z" fill="${P.soil}"/>
    <path d="M${-w * .6},1 q3,-2 7,0 M${w * .15},-1 q3,-2 6,0 M${w * .45},2 q2,-1.5 5,0" stroke="${P.soilD}" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".7"/>
    <ellipse cx="${-w * .7}" cy="4" rx="3" ry="2" fill="${P.paperD}"/><ellipse cx="${w * .75}" cy="3" rx="2.4" ry="1.6" fill="${P.paperD}"/>
    ${roots ? `<path d="M0,2 q-6,6 -12,9 M0,2 q5,7 11,10 M0,3 q-1,6 -3,10" stroke="${P.soilD}" stroke-width="1" fill="none" stroke-linecap="round" opacity=".55"/>` : ''}`;

  // borboleta de papel (visita o canteiro em flor)
  const butterfly = (x, y, c1, c2) => `<g transform="translate(${x} ${y})"><g class="flutter">
    <path d="M0,0 C-8,-10 -16,-6 -13,2 C-15,8 -8,10 0,3Z" fill="${c1}"/><path d="M0,0 C8,-10 16,-6 13,2 C15,8 8,10 0,3Z" fill="${c1}"/>
    <path d="M0,1 C-6,-5 -11,-3 -9,2 C-10,6 -5,7 0,3Z" fill="${c2}" opacity=".8"/><path d="M0,1 C6,-5 11,-3 9,2 C10,6 5,7 0,3Z" fill="${c2}" opacity=".8"/>
    </g><path d="M0,-2 v6" stroke="${P.ink}" stroke-width="1.4" stroke-linecap="round"/><path d="M0,-2 l-2,-3 M0,-2 l2,-3" stroke="${P.ink}" stroke-width=".8" fill="none" stroke-linecap="round"/></g>`;
  // pólen dourado (fase em flor)
  const pollen = (seed, n, cx, cy, spread) => { const r = rnd(seed); let s = ''; for (let i = 0; i < n; i++) { const a = r() * 6.283, d = spread * (0.4 + r() * .6); s += `<circle cx="${r2(cx + Math.cos(a) * d)}" cy="${r2(cy + Math.sin(a) * d * .6)}" r="${r2(.8 + r() * 1.1)}" fill="${P.goldL}" opacity="${r2(.5 + r() * .4)}"/>`; } return s; };

  // --- as seis plantas -------------------------------------------------------
  // 1 Camomila: hastes finas, margaridas pequenas com miolo dourado
  function camomila(st) {
    const r = rnd(11); let s = wash(0, -34, 30, 26, P.cream, .55, st);
    const stems = st === 1 ? [[0, 22, 0]] : st === 2 ? [[-9, 40, -8], [4, 48, 5], [13, 34, 12]] : [[-17, 42, -12], [-5, 58, -4], [7, 50, 6], [19, 38, 14]];
    stems.forEach(([x, h, a]) => { s += stem(x * .3, 0, x, -h, 1.8, 3, P.stem); s += leaf(x * .55, -h * .45, 9, 3, a - 70, P.leafL, P.leaf, P.cream) + leaf(x * .5, -h * .3, 8, 2.6, a + 75, P.leaf, P.leafD, P.leafL); });
    if (st >= 2) stems.forEach(([x, h, a], i) => {
      if (st === 2) { s += `<circle cx="${x}" cy="${-h - 2}" r="4.2" fill="${P.leafL}"/><circle cx="${x}" cy="${-h - 2}" r="2.6" fill="${P.gold}" opacity=".7"/>`; return; }
      const n = 10, R = 6.4 + (i % 2) * .8; let f = '';
      for (let k = 0; k < n; k++) { const ang = (360 / n) * k + r() * 6; f += petal(x, -h - 2, R, 1.9, ang, '#FFFCF4', '#E6D8C3'); }
      s += f + `<circle cx="${x}" cy="${-h - 2}" r="3" fill="${P.sunD}"/><circle cx="${x - .7}" cy="${-h - 2.7}" r="2.2" fill="${P.sun}"/><circle cx="${x - 1.2}" cy="${-h - 3.2}" r=".9" fill="${P.sunL}"/>`;
    });
    if (st === 3) s += pollen(3, 7, 2, -50, 26);
    return s;
  }
  // 2 Oliveira: tronco retorcido, copa prateada em três nuvens, azeitonas
  function oliveira(st) {
    let s = wash(0, -40, 30, 28, P.oliveL, .35, st);
    if (st === 1) return s + stem(0, 0, 1, -24, 2.6, 2, P.stemD) + leaf(1, -12, 10, 2.8, -55, P.oliveL, P.olive) + leaf(0, -18, 11, 3, 60, P.leaf, P.olive) + leaf(1, -24, 10, 2.6, -10, P.oliveL, P.olive);
    const H = st === 2 ? 40 : 50;
    s += `<path d="M-5,2 C-6,${-H * .35} -1,${-H * .55} -3,${-H * .78} M-5,2 C-2,${-H * .4} 4,${-H * .5} 7,${-H * .7} M-3,${-H * .5} C-8,${-H * .62} -11,${-H * .7} -14,${-H * .78}" stroke="#7A6048" stroke-width="4.2" fill="none" stroke-linecap="round"/>`;
    s += `<path d="M-5,2 C-6,${-H * .35} -1,${-H * .55} -3,${-H * .78}" stroke="#A58A6B" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".8"/>`;
    const clouds = st === 2 ? [[-11, -H * .8, 13, 8], [9, -H * .74, 12, 8], [-1, -H * .96, 12, 8]] : [[-16, -H * .82, 17, 10], [13, -H * .76, 16, 10], [-1, -H * 1.04, 16, 10], [3, -H * .62, 13, 8], [-20, -H * .62, 10, 7]];
    clouds.forEach(([x, y, rx, ry]) => { s += `<path d="M${x - rx},${y} C${x - rx},${y - ry * 1.3} ${x - rx * .3},${y - ry * 1.5} ${x + rx * .2},${y - ry * 1.1} C${x + rx * .9},${y - ry * 1.3} ${x + rx * 1.05},${y + ry * .2} ${x + rx * .5},${y + ry * .9} C${x},${y + ry * 1.2} ${x - rx * .9},${y + ry * .8} ${x - rx},${y}Z" fill="${P.olive}" opacity=".92"/>`; });
    const r = rnd(7); const nL = st === 2 ? 22 : 40;
    for (let i = 0; i < nL; i++) { const c = clouds[i % clouds.length]; const x = c[0] + (r() - .5) * c[2] * 1.7, y = c[1] + (r() - .5) * c[3] * 1.6; const light = r() > .45; s += leaf(r2(x), r2(y), 8.5, 1.9, r() * 360, light ? P.oliveL : P.leaf, light ? P.leaf : P.olive, light ? '#fff' : P.oliveL); }
    if (st === 3) { for (let i = 0; i < 7; i++) { const c = clouds[i % clouds.length]; const x = c[0] + (r() - .5) * c[2] * 1.3, y = c[1] + (r() - .3) * c[3]; s += `<ellipse cx="${r2(x)}" cy="${r2(y)}" rx="2.2" ry="2.8" fill="#3B3340"/><circle cx="${r2(x - .7)}" cy="${r2(y - .9)}" r=".7" fill="#fff" opacity=".6"/>`; } }
    return s;
  }
  // 3 Miosótis: roseta de folhas, buquê de florzinhas azuis de cinco pétalas
  function miosotis(st) {
    let s = wash(0, -26, 28, 20, P.blueL, .45, st);
    s += leaf(-6, 0, 16, 6, -40, P.leaf, P.leafD) + leaf(5, 0, 17, 6, 35, P.leafL, P.leaf) + leaf(-1, 0, 14, 5, -5, P.leaf, P.leafD);
    if (st === 1) return s;
    const heads = st === 2 ? [[-7, 26], [5, 32], [12, 22]] : [[-16, 30], [-8, 40], [2, 46], [11, 38], [18, 28], [-3, 30]];
    heads.forEach(([x, h]) => s += stem(0, -2, x, -h, 1.5, 3));
    const r = rnd(5);
    heads.forEach(([x, h], i) => {
      if (st === 2) { s += `<circle cx="${x}" cy="${-h}" r="3.2" fill="${P.blue}"/><circle cx="${x - .8}" cy="${-h - .8}" r="1.6" fill="${P.blueL}"/>`; return; }
      const pts = [[x, -h], [x - 5, -h + 4], [x + 5, -h + 3], [x - 2, -h - 5], [x + 3, -h - 6]].slice(0, 3 + (i % 3));
      pts.forEach(([px, py]) => { for (let k = 0; k < 5; k++) s += petal(px, py, 3.4, 1.8, k * 72 + r() * 10, P.blue, P.blueD); s += `<circle cx="${px}" cy="${py}" r="1.2" fill="${P.goldL}"/>`; });
    });
    if (st === 3) s += pollen(9, 6, 0, -40, 24);
    return s;
  }
  // 4 Lavanda: tufo de hastes, espigas roxas em "contas" de papel
  function lavanda(st) {
    let s = wash(0, -36, 26, 28, P.lavL, .45, st);
    const stems = st === 1 ? [[-4, 18, 0], [3, 22, 0]] : st === 2 ? [[-12, 34], [-4, 44], [5, 40], [13, 30]] : [[-18, 38], [-10, 50], [-2, 58], [6, 54], [14, 44], [21, 34]];
    stems.forEach(([x, h]) => { s += stem(x * .25, 0, x, -h, 1.6, 2, P.stem); s += leaf(x * .4, -h * .35, 9, 1.8, (x < 0 ? -1 : 1) * 70 + x, P.leafL, P.leaf, '#fff'); });
    if (st === 1) return s;
    stems.forEach(([x, h], i) => {
      const n = st === 2 ? 3 : 6, c1 = st === 2 ? P.lavL : P.lav, c2 = st === 2 ? P.lav : P.lavD;
      for (let k = 0; k < n; k++) { const y = -h + 2 - k * 3.4, w = 2.6 - k * .22; s += `<ellipse cx="${x + (k % 2 ? .9 : -.9)}" cy="${r2(y)}" rx="${r2(w)}" ry="2.1" fill="${c2}"/><ellipse cx="${x + (k % 2 ? .4 : -1.4)}" cy="${r2(y - .6)}" rx="${r2(w * .75)}" ry="1.5" fill="${c1}"/>`; }
    });
    if (st === 3) s += pollen(13, 6, 0, -48, 26);
    return s;
  }
  // 5 Ipê: tronco escuro sem folhas, cachos de trombetas rosa-lilás (floresce no seco)
  function ipe(st) {
    let s = wash(0, -42, 30, 30, P.roseL, .4, st);
    if (st === 1) return s + stem(0, 0, 0, -26, 2.8, 1, '#5E4634') + `<path d="M0,-14 l-7,-6 M0,-20 l6,-6" stroke="#5E4634" stroke-width="2" stroke-linecap="round"/>` + leaf(-7, -20, 6, 2.2, -30, P.leafL, P.leaf) + leaf(6, -26, 6, 2.2, 30, P.leaf, P.leafD);
    const H = st === 2 ? 44 : 56;
    s += `<path d="M-2,3 C-3,${-H * .35} 1,${-H * .5} 0,${-H * .6} M0,${-H * .45} C-7,${-H * .6} -12,${-H * .7} -17,${-H * .82} M0,${-H * .5} C6,${-H * .65} 12,${-H * .72} 16,${-H * .86} M0,${-H * .6} C-3,${-H * .78} -5,${-H * .9} -4,${-H} M-12,${-H * .72} C-16,${-H * .8} -20,${-H * .82} -24,${-H * .86} M10,${-H * .68} C14,${-H * .76} 20,${-H * .78} 25,${-H * .8}" stroke="#4A3528" stroke-width="3.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    s += `<path d="M-2,3 C-3,${-H * .35} 1,${-H * .5} 0,${-H * .6}" stroke="#7D6350" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".7"/>`;
    const r = rnd(21);
    const tips = [[-17, -H * .82], [16, -H * .86], [-4, -H], [-24, -H * .86], [25, -H * .8], [0, -H * .72], [8, -H * .95], [-12, -H * .95]];
    const use = st === 2 ? tips.slice(0, 4) : tips;
    use.forEach(([x, y], i) => {
      const n = st === 2 ? 3 : 7;
      for (let k = 0; k < n; k++) { const px = x + (r() - .5) * 11, py = y + (r() - .5) * 9 - 2, sc = .55 + r() * .3, rot = -30 + r() * 60; const c = k % 3 === 0 ? P.roseL : k % 3 === 1 ? P.rose : '#D29DB0'; s += `<g transform="translate(${r2(px)} ${r2(py)}) rotate(${r2(rot)}) scale(${r2(sc)})"><path d="M0,0 c-5,-7 -1,-13 3,-12 c4,-1 8,5 3,12z" fill="${c}"/><path d="M3,-12 c-1,4 -1,8 0,12" stroke="${P.roseD}" stroke-width="1.2" fill="none" opacity=".55" stroke-linecap="round"/><circle cx="3" cy="-1" r="1.6" fill="${P.goldL}" opacity=".9"/></g>`; }
    });
    if (st === 3) { for (let k = 0; k < 5; k++) { s += `<path d="M${r2(-26 + r() * 52)},${r2(-8 + r() * 10)} c-2,-3 0,-5 2,-5 c2,0 3,3 1,5z" fill="${P.roseL}" opacity=".9"/>`; } s += pollen(17, 5, 0, -50, 28); }
    return s;
  }
  // 6 Girassol: caule forte, folhas largas, miolo em espiral de sementes
  function girassol(st) {
    let s = wash(0, -40, 30, 30, P.sunL, .4, st);
    if (st === 1) return s + stem(0, 0, 0, -22, 3, 2) + leaf(0, -10, 12, 5, -50, P.leaf, P.leafD) + leaf(0, -16, 12, 5, 50, P.leafL, P.leaf) + `<ellipse cx="0" cy="-24" rx="4" ry="5" fill="${P.leafD}"/><ellipse cx="-1" cy="-25" rx="2.4" ry="3.4" fill="${P.leaf}"/>`;
    const H = st === 2 ? 46 : 58;
    s += stem(0, 2, 1, -H + 6, 4, 3, P.stemD) + stem(0, 2, 1, -H + 6, 1.6, 3, P.leafL).replace('stroke-linecap', 'opacity=".5" stroke-linecap');
    s += leaf(-1, -H * .35, 22, 9, -62, P.leaf, P.leafD) + leaf(1, -H * .55, 20, 8, 58, P.leafL, P.leaf) + leaf(-1, -H * .72, 15, 6, -48, P.leafD, P.leafD);
    if (st === 2) return s + `<g transform="translate(1 ${-H})">${[0, 60, 120, 180, 240, 300].map(a => `<ellipse rx="5" ry="9" cy="-7" fill="${P.leafD}" transform="rotate(${a})"/>`).join('')}<circle r="6" fill="${P.leaf}"/><circle r="3" fill="${P.sun}"/></g>`;
    const r = rnd(29); let f = `<g transform="translate(1 ${-H})">`;
    for (let k = 0; k < 18; k++) f += petal(0, 0, 18, 3.6, k * 20 + 10, P.sunD, P.sunD);
    for (let k = 0; k < 18; k++) f += petal(0, 0, 17, 3.9, k * 20 + r() * 4, P.sun, P.sunD);
    f += `<circle r="8.6" fill="#5B3F2E"/>`;
    for (let i = 0; i < 42; i++) { const a = i * 2.39996, d = 1.2 + Math.sqrt(i) * 1.2; f += `<circle cx="${r2(Math.cos(a) * d)}" cy="${r2(Math.sin(a) * d)}" r="${r2(.55 + i * .012)}" fill="${i % 3 ? '#7A5A3F' : P.goldL}" opacity=".9"/>`; }
    f += `<circle cx="-2.4" cy="-2.6" r="1.6" fill="#fff" opacity=".22"/></g>`;
    return s + f + pollen(31, 8, 0, -H, 26);
  }

  const FN = { acolhimento: camomila, travessia: oliveira, elo: miosotis, reancoragem: lavanda, ressignificacao: ipe, reviva: girassol };
  const BF = { acolhimento: [P.goldL, P.sun], travessia: [P.lavL, P.lav], elo: [P.goldL, P.sunD], reancoragem: [P.roseL, P.rose], ressignificacao: [P.blueL, P.blue], reviva: [P.lavL, P.lav] };

  function plantArt(id, stage) {
    const fn = FN[id] || camomila;
    if (stage === 0) return `<g opacity=".09">${fn(3)}</g>` + ground(34, false) + `<ellipse cx="0" cy="-2" rx="4.6" ry="3.4" fill="${P.seed}"/><ellipse cx="-1.2" cy="-3" rx="2" ry="1.3" fill="#8C6B52" opacity=".9"/><path d="M1,-5 q1,-4 4,-5" stroke="${P.leaf}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
    const fly = stage === 3 ? butterfly(26, -70, BF[id][0], BF[id][1]) : '';
    return ground(34, true) + `<g class="sway">${fn(stage)}</g>` + fly;
  }
  // definições compartilhadas (uma vez por SVG)
  const defs = () => `<defs><filter id="rvBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="rvGrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch" result="n"/><feColorMatrix type="saturate" values="0" in="n" result="g"/><feComponentTransfer in="g" result="a"><feFuncA type="table" tableValues="0 .06"/></feComponentTransfer><feBlend in="SourceGraphic" in2="a" mode="multiply"/></filter>
    <linearGradient id="rvSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F8F1E7"/><stop offset=".6" stop-color="#F3ECE1"/><stop offset="1" stop-color="#E6EDE3"/></linearGradient>
    <radialGradient id="rvSun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#F7DDB5"/><stop offset=".55" stop-color="#F5E3C6" stop-opacity=".9"/><stop offset="1" stop-color="#F5E3C6" stop-opacity="0"/></radialGradient></defs>`;
  // cenário: colinas de papel, caminho de pedras, sol de aquarela
  const scene = () => `
    <rect x="4" y="0" width="352" height="600" rx="26" fill="url(#rvSky)"/>
    <circle cx="314" cy="40" r="34" fill="url(#rvSun)"/><circle cx="314" cy="40" r="11" fill="#F3D7A9"/>
    <path d="M4,262 C60,238 120,276 190,256 S300,230 356,250 V290 C300,278 230,300 160,286 S60,292 4,296Z" fill="#EAEFE4" opacity=".75"/>
    <path d="M4,444 C70,420 140,452 210,436 S320,412 356,430 V470 C300,458 240,480 170,466 S60,472 4,478Z" fill="#E3EBE0" opacity=".85"/>
    <path d="M4,560 C80,520 150,575 220,548 S320,520 356,540 V574 a26,26 0 0 1 -26,26 H30 a26,26 0 0 1 -26,-26z" fill="#DCE6D8"/>
    ${[[182, 56], [166, 96], [156, 136], [166, 182], [190, 222], [206, 262], [196, 302], [172, 342], [158, 382], [170, 424], [196, 464], [208, 504], [194, 546]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y + 1.5}" rx="9" ry="4.6" fill="#D5C6B0" opacity=".7"/><ellipse cx="${x}" cy="${y}" rx="8.4" ry="4" fill="#EBE0CE"/><ellipse cx="${x - 2}" cy="${y - 1}" rx="5" ry="2.2" fill="#F4ECDF" opacity=".9"/>`).join('')}
    <rect x="4" y="0" width="352" height="600" rx="26" fill="#fff" opacity="0" filter="url(#rvGrain)"/>`;
  const tuft = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-14,2 q2,-9 6,-13 q1,9 -2,13z" fill="#C9D8C6"/><path d="M-5,2 q0,-12 4,-16 q3,10 0,16z" fill="#B6C9B4"/><path d="M4,2 q4,-9 9,-11 q-1,9 -5,11z" fill="#C9D8C6"/><ellipse cx="0" cy="3" rx="16" ry="3.5" fill="#DCE6D8"/></g>`;

  window.RV_ART = { plantArt, defs, scene, tuft, P };
})();
