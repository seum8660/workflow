/* 학교시설 업무 워크플로우 보드 — 카드뉴스 6장 모션 (1080×1080)
   사이트(seum8660.github.io/workflow)의 디자인 토큰을 그대로 사용 */
const { useComposition, CompositionStage, animate, Easing, clamp } = window;

const BG = '#ffffff';
const TXT = '#000000';
const DIV = 'rgba(0,0,0,.52)';
const MUT = 'rgba(0,0,0,.92)';
const FNT = 'rgba(0,0,0,.80)';
const A300 = '#3f7db8';
const A500 = '#164a75';
const A700 = '#0d3350';
const A900 = '#000c14';
const KEYBG = '#d3e7fa';
const BOTBG = '#aacff2';
const HEAD = '"Barlow Condensed","Pretendard",system-ui,sans-serif';
const KO = '"Pretendard","Malgun Gothic",system-ui,sans-serif';

const MOTION = {
  enter: (start, dy) => (T) => ({
    opacity: animate({ from: 0, to: 1, start: start, end: start + 0.42, ease: Easing.easeOutQuad })(T),
    transform: 'translateY(' + animate({ from: dy === undefined ? 16 : dy, to: 0, start: start, end: start + 0.62, ease: Easing.easeOutQuart })(T).toFixed(2) + 'px)'
  }),
  draw: (start, end) => (T) => animate({ from: 0, to: 1, start: start, end: end, ease: Easing.easeOutQuart })(T),
  pop: (start) => (T) => ({
    opacity: animate({ from: 0, to: 1, start: start, end: start + 0.2, ease: Easing.easeOutQuad })(T),
    transform: 'scale(' + animate({ from: 0.72, to: 1, start: start, end: start + 0.4, ease: Easing.easeOutBack })(T).toFixed(3) + ')'
  })
};

function win(T, inA, inB, outA, outB) {
  const up = animate({ from: 0, to: 1, start: inA, end: inB, ease: Easing.easeOutQuad })(T);
  const dn = outA === undefined ? 1 : 1 - animate({ from: 0, to: 1, start: outA, end: outB, ease: Easing.easeInQuad })(T);
  return Math.min(up, dn);
}

/* 사이트의 KIND 정의 */
const KIND = {
  lead: { mark: A300, bd: DIV, idc: A700, fill: A300, fbd: A700, dash: false },
  key: { mark: A500, bd: DIV, idc: A700, fill: A500, fbd: A900, dash: false },
  bot: { mark: A900, bd: A900, idc: A900, fill: A900, fbd: A900, dash: false },
  post: { mark: 'rgba(0,0,0,.35)', bd: DIV, idc: MUT, fill: BG, fbd: FNT, dash: true }
};

const LANES = ['발주청 담당팀', '설계사', '건설사업관리(감리)자', '시공사', '심의 · 검토 · 외부기관'];
const STAGES = [
  { k: 'S0', n: '기획 · 사전심의' }, { k: 'S1', n: '사전절차 · 계획수립' }, { k: 'S2', n: '설계' },
  { k: 'S3', n: '발주' }, { k: 'S4', n: '착공 · 시공' }, { k: 'S5', n: '준공 · 사용승인' }
];
const NODES = [
  [0, 0, 'lead', 'N01'], [0, 0, 'key', 'N03'], [0, 4, 'bot', 'N02'],
  [1, 0, 'key', 'N05'], [1, 4, 'bot', 'N04'],
  [2, 1, 'key', 'N06'], [2, 4, 'key', 'N07'], [2, 4, 'key', 'N17'],
  [3, 0, 'key', 'N08'], [3, 0, 'bot', 'N09'], [3, 4, 'post', 'N10'],
  [4, 0, 'key', 'N13'], [4, 0, 'post', 'N18'], [4, 0, 'post', 'N19'], [4, 2, 'bot', 'N12'], [4, 3, 'key', 'N11'],
  [5, 0, 'key', 'N14'], [5, 0, 'key', 'N16'], [5, 4, 'post', 'N15']
];

/* 연결선 — 전주기 보드의 실제 EDGES. [from, to, 회귀?, 경로override] */
const EDGES = [
  ['N01', 'N02'], ['N02', 'N03'], ['N03', 'N04'], ['N04', 'N05'], ['N05', 'N06'],
  ['N06', 'N07'], ['N07', 'N06', 1, 'below'], ['N07', 'N08'], ['N08', 'N09'], ['N09', 'N10'],
  ['N10', 'N11'], ['N11', 'N12'], ['N12', 'N11', 1, 'below'], ['N12', 'N13'], ['N13', 'N18'],
  ['N18', 'N13', 1, 'left'], ['N13', 'N19', 0, 'right'], ['N13', 'N14', 0, 'right'],
  ['N14', 'N16'], ['N14', 'N15']
];

/* 직각 폴리라인 경로 */
function route(s, t, mode) {
  const scx = s.x + s.w / 2, scy = s.y + s.h / 2, sb = s.y + s.h, sr = s.x + s.w;
  const tcx = t.x + t.w / 2, tcy = t.y + t.h / 2, tb = t.y + t.h, tr = t.x + t.w;
  if (mode === 'below') {
    const y = Math.max(sb, tb) + 13;
    return [[scx, sb], [scx, y], [tcx, y], [tcx, tb]];
  }
  if (mode === 'left') {
    const x = Math.min(s.x, t.x) - 13;
    return [[s.x, scy], [x, scy], [x, tcy], [t.x, tcy]];
  }
  if (mode === 'right') {
    const x = Math.max(sr, tr) + 8;
    return [[sr, scy], [x, scy], [x, tcy], [tr, tcy]];
  }
  if (Math.abs(scy - tcy) < 9) {
    return t.x > s.x ? [[sr, scy], [t.x, tcy]] : [[s.x, scy], [tr, tcy]];
  }
  if (tcy > scy) {
    const y = (sb + t.y) / 2;
    return [[scx, sb], [scx, y], [tcx, y], [tcx, t.y]];
  }
  return [[sr, scy], [tcx, scy], [tcx, tb]];
}

function partial(pts, p) {
  if (p >= 1) return pts;
  let total = 0;
  const seg = [];
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    seg.push(d); total += d;
  }
  let want = total * p, out = [pts[0]];
  for (let i = 0; i < seg.length; i++) {
    if (want >= seg[i]) { out.push(pts[i + 1]); want -= seg[i]; continue; }
    const r = seg[i] ? want / seg[i] : 0;
    out.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * r, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * r]);
    break;
  }
  return out;
}

function dstr(pts) {
  return pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
}

const TYPES = [
  ['선행', 'lead', '절차를 여는 사유가 발생하는 지점. 여기서 판단이 늦으면 뒤 일정이 통째로 밀립니다.'],
  ['핵심', 'key', '반드시 거쳐야 하는 산출물과 계약행위. 빠뜨리면 다음 단계로 넘어갈 수 없습니다.'],
  ['병목', 'bot', '검토 · 승인이 지연되고 재작업이 잦은 구간. 이 상자를 누르면 막히는 이유가 함께 나옵니다.'],
  ['후속', 'post', '앞 단계의 결과를 이행하고 관리하는 업무. 대개 기한 관리가 관건입니다.']
];

const BOARDS = [
  '기획부터 준공까지', '사전기획 적정성 검토', '공공건축심의', '학교시설 인허가', '설계용역 발주',
  '설계 입찰공고', '건축 설계공모 운영', '설계자문위원회', '설계의 경제성 검토 (VE)', '설계의 안전성 검토 (DfS)',
  '예비인증 신청', '설계용역 평가', '감리 · 건설사업관리 방식 결정', '일상감사', '건설공사 하도급 심사',
  '건축물 해체계획서', '공사 중 안전사고 대응', '실정보고', '설계변경 · 계약금액 조정', '공기연장 · 간접비 정산',
  '공기연장 간접공사비', '예비준공검사', '준공검사', '건설엔지니어링 및 시공 평가', '교육시설 안전인증',
  '시설물 안전 및 유지관리'
];
const SHADE = [
  { tab: A700, body: A700, line: A900, ink: '#fff', sub: 'rgba(255,255,255,.72)' },
  { tab: A500, body: A500, line: A900, ink: '#fff', sub: 'rgba(255,255,255,.72)' },
  { tab: A300, body: A300, line: A700, ink: '#fff', sub: 'rgba(255,255,255,.78)' },
  { tab: BOTBG, body: KEYBG, line: A500, ink: A700, sub: 'rgba(13,51,80,.7)' }
];
const TABW = ['58%', '46%', '52%', '42%'];

const ASKS = ['이 일은 누가 하는지', '언제까지 해야 하는지', '근거 조문은 무엇인지', '어디서 자주 막히는지'];

const STATS = [['26', '업무 보드'], ['6', '단계 게이트'], ['5', '행위 레인'], ['47', '세부 절차 시트']];


/* 흐름도 카드 — [번호, 절차, 주체 · 내용] */
const FLOW_CHG = [
  ['설계변경 사유 발생', '현장여건 상이 · 설계 누락 · 관계기관 협의 결과'],
  ['실정보고', '시공사 → 건설사업관리자 · 사유와 근거, 수량 산출 첨부'],
  ['검토 의견 첨부 · 발주청 제출', '건설사업관리자'],
  ['설계변경 방침 결정', '발주청 · 필요하면 설계자 협의와 자문을 거칩니다'],
  ['설계도서 변경 · 금액 산출', '설계자 · 시공사'],
  ['변경계약 체결', '발주청 · 시공사 · 계약금액과 공사기간을 함께 반영']
];
const FLOW_EXT = [
  ['공기연장 사유 발생', '천재지변 · 인허가 지연 · 발주기관 책임 사유'],
  ['계약기간 연장 신청', '시공사 → 발주청 · 사유가 끝나기 전에 신청'],
  ['검토 의견 제출', '건설사업관리자'],
  ['연장 승인 · 준공기한 확정', '발주청'],
  ['변경계약 체결', '연장된 준공기한을 계약에 반영'],
  ['간접비 정산 청구', '준공대가 수령 전까지 조정을 신청해야 합니다']
];

const CAPTIONS = [
  { c: '표지', o: 0, text: '기획부터 준공·사용승인까지, 담당자가 실제로 밟는 절차를 정리했습니다' },
  { c: '두 축', o: 0, text: '가로축은 누가 하는가, 세로축은 언제 하는가' },
  { c: '두 축', o: 3, text: '실선은 업무 순서 · 점선은 보완이나 반려로 되돌아가는 회귀' },
  { c: '상자 종류', o: 0, text: '상자의 테두리와 점 색이 그 절차의 성격을 말합니다' },
  { c: '설계변경', o: 0, text: '설계변경은 실정보고에서 시작해 변경계약으로 끝납니다' },
  { c: '공기연장', o: 0, text: '공기연장은 사유가 끝나기 전에 신청해야 합니다' },
  { c: '보드', o: 0, text: '폴더 하나가 업무 보드 하나입니다' },
  { c: '마무리', o: 0, text: '담당자가 바뀌어도 같은 문법으로 읽습니다' }
];

function NodeBox(p) {
  const k = KIND[p.kind];
  return React.createElement('div', {
    ref: p.innerRef,
    style: {
      display: 'flex', alignItems: 'center', gap: 8, boxSizing: 'border-box', padding: '7px 10px',
      border: '1px solid ' + k.bd, background: BG, position: 'relative', zIndex: 2,
      opacity: p.st.opacity, transform: p.st.transform
    }
  },
    React.createElement('i', { style: { display: 'block', flex: '0 0 auto', width: 8, height: 8, background: k.mark } }),
    React.createElement('span', { style: { fontFamily: HEAD, fontSize: 16, fontWeight: 600, letterSpacing: '.04em', color: k.idc } }, p.id)
  );
}

function Piece() {
  const c = useComposition();
  const T = c.T;
  const CU = c.CUES;
  const total = c.authoredTotal || 34.5;
  const axis = CU['두 축'], type = CU['상자 종류'], grid = CU['보드'], close = CU['마무리'];
  const chg = CU['설계변경'], ext = CU['공기연장'];

  const idx = T >= close ? 7 : T >= grid ? 6 : T >= ext ? 5 : T >= chg ? 4 : T >= type ? 3 : T >= axis ? 2 : 1;
  const drift = 1 + 0.01 * Math.sin((T / total) * Math.PI * 2);

  const rootRef = React.useRef(null);
  const wrapRef = React.useRef(null);
  const nodeRefs = React.useRef({});
  const [geo, setGeo] = React.useState(null);
  React.useEffect(() => {
    const measure = () => {
      const w = wrapRef.current;
      if (!w) return;
      const wb = w.getBoundingClientRect();
      if (!wb.width) return;
      const k = 936 / wb.width;
      const rb = rootRef.current ? rootRef.current.getBoundingClientRect() : { left: wb.left, top: wb.top };
      const out = {};
      Object.keys(nodeRefs.current).forEach((id) => {
        const el = nodeRefs.current[id];
        if (!el) return;
        const r = el.getBoundingClientRect();
        out[id] = { x: (r.left - wb.left) * k, y: (r.top - wb.top) * k, w: r.width * k, h: r.height * k };
      });
      setGeo({ H: wb.height * k, cx0: (wb.left - rb.left) * k, cy0: (wb.top - rb.top) * k, n: out });
    };
    measure();
    const raf = requestAnimationFrame(measure);
    const t1 = setTimeout(measure, 300);
    const t2 = setTimeout(measure, 1200);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    window.addEventListener('resize', measure);
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); window.removeEventListener('resize', measure); };
  }, []);

  const capAt = (x) => (CU[x.c] || 0) + x.o;
  let capI = 0;
  for (let i = 0; i < CAPTIONS.length; i++) if (T >= capAt(CAPTIONS[i])) capI = i;
  const capIn = capI === 0 && T < 0.5 ? 1 : clamp((T - capAt(CAPTIONS[capI])) / 0.35, 0, 1);

  /* ── 01 표지 / 06 마무리 ── */
  const coverOp = T <= 0 ? 1 : win(T, 0, 0.001, axis - 0.5, axis + 0.1);
  const coverEl = React.createElement('div', {
    style: {
      position: 'absolute', left: 72, right: 72, top: 202,
      opacity: coverOp, transform: 'scale(' + drift.toFixed(4) + ')', transformOrigin: '50% 45%'
    }
  },
    React.createElement('div', { style: { fontFamily: HEAD, fontSize: 21, fontWeight: 500, letterSpacing: '.18em', textTransform: 'uppercase', color: FNT } }, 'Process Board / 학교시설 사업 프로세스'),
    React.createElement('h1', { style: { fontFamily: HEAD, fontSize: 82, fontWeight: 600, letterSpacing: '-.015em', lineHeight: 1.06, color: TXT, margin: '20px 0 0' } },
      '학교시설 업무', React.createElement('br', null), '워크플로우 보드'),
    React.createElement('div', { style: { fontFamily: KO, fontSize: 26, lineHeight: 1.62, color: MUT, marginTop: 26, maxWidth: 800, textWrap: 'pretty' } },
      '기획부터 준공·사용승인까지, 담당자가 실제로 밟는 절차를 단계와 담당 주체로 갈라 놓은 보드입니다. 설계변경·공기연장·인허가·안전사고 등 26개 업무를 같은 문법으로 읽습니다.'),
    React.createElement('div', { style: { display: 'flex', marginTop: 44, border: '1px solid ' + DIV } },
      STATS.map((s, i) => React.createElement('div', {
        key: s[1], style: { flex: '1 1 0', padding: '20px 24px', borderLeft: i ? '1px solid ' + DIV : 'none' }
      },
        React.createElement('b', { style: { display: 'block', fontFamily: HEAD, fontSize: 48, fontWeight: 600, lineHeight: 1, color: A700 } }, s[0]),
        React.createElement('span', { style: { display: 'block', fontFamily: KO, fontSize: 17, color: FNT, marginTop: 8 } }, s[1])
      ))
    ),
    React.createElement('div', {
      style: {
        display: 'inline-flex', alignItems: 'center', gap: 14, marginTop: 40, padding: '16px 28px',
        background: A900, border: '2px solid ' + A900, color: '#fff', fontFamily: KO, fontWeight: 700, fontSize: 21
      }
    }, 'seum8660.github.io/workflow', React.createElement('span', { style: { fontFamily: HEAD, letterSpacing: '.1em' } }, '→'))
  );

  /* ── 02 두 축 ── */
  const mOp = win(T, axis - 0.4, axis + 0.25, type - 0.55, type - 0.05);
  const E0 = axis + 2.4, ESTEP = 0.135, EDUR = 0.42;
  const edgeSvg = !geo ? null : React.createElement('svg', {
    width: '100%', height: geo.H, viewBox: '0 0 936 ' + Math.round(geo.H),
    style: { position: 'absolute', left: 0, top: 0, width: '100%', height: geo.H, overflow: 'visible', pointerEvents: 'none', zIndex: 0 }
  },
    EDGES.map((e, i) => {
      const a = geo.n[e[0]], b = geo.n[e[1]];
      if (!a || !b) return null;
      const st = E0 + i * ESTEP;
      const p = MOTION.draw(st, st + EDUR)(T);
      if (p <= 0.001) return null;
      const reg = !!e[2];
      return React.createElement('path', {
        key: e[0] + '>' + e[1] + i,
        d: dstr(partial(route(a, b, e[3]), p)),
        fill: 'none',
        stroke: reg ? 'rgba(0,0,0,.55)' : A500,
        strokeWidth: 2,
        strokeDasharray: reg ? '7 5' : 'none'
      });
    })
  );

  const matrixEl = React.createElement('div', {
    style: {
      position: 'absolute', left: 72, top: 196, width: 936, opacity: mOp,
      transform: 'scale(' + animate({ from: 1, to: 0.97, start: type - 0.55, end: type - 0.05, ease: Easing.easeInQuad })(T).toFixed(3) + ')',
      transformOrigin: '50% 30%'
    }
  },
    React.createElement('div', { style: Object.assign({ display: 'flex', gap: 40, marginBottom: 18 }, MOTION.enter(axis + 0.05, 10)(T)) },
      React.createElement('span', { style: { fontFamily: HEAD, fontSize: 20, letterSpacing: '.16em', textTransform: 'uppercase', color: FNT } }, 'Lane → 누가 하는가'),
      React.createElement('span', { style: { fontFamily: HEAD, fontSize: 20, letterSpacing: '.16em', textTransform: 'uppercase', color: FNT } }, 'Stage ↓ 언제 하는가')
    ),
    React.createElement('div', { ref: wrapRef, style: { position: 'relative', border: '1px solid ' + DIV, boxSizing: 'border-box' } },
      edgeSvg,
      React.createElement('div', { style: { display: 'flex', background: A900, color: '#fff', position: 'relative', zIndex: 2 } },
        React.createElement('div', { style: { flex: '0 0 152px', padding: '13px 14px', fontFamily: HEAD, fontSize: 18, letterSpacing: '.08em', borderRight: '1px solid rgba(255,255,255,.3)' } }, '단계 / 담당'),
        LANES.map((l, i) => React.createElement('div', {
          key: l,
          style: {
            flex: '1 1 0', minWidth: 0, padding: '13px 12px', fontFamily: KO, fontWeight: 600, fontSize: 15.5,
            lineHeight: 1.28, borderRight: i === 4 ? 'none' : '1px solid rgba(255,255,255,.3)',
            opacity: MOTION.enter(axis + 0.3 + i * 0.07, 0)(T).opacity
          }
        }, l))
      ),
      STAGES.map((s, si) => React.createElement('div', { key: s.k, style: { display: 'flex', alignItems: 'stretch', position: 'relative', zIndex: 1, borderBottom: si === 5 ? 'none' : '1px dashed ' + DIV } },
        React.createElement('div', {
          style: Object.assign({ flex: '0 0 152px', padding: '13px 14px', background: KEYBG, borderRight: '1px solid ' + DIV, boxSizing: 'border-box', minHeight: 96 }, MOTION.enter(axis + 0.7 + si * 0.16, 8)(T))
        },
          React.createElement('b', { style: { display: 'block', fontFamily: HEAD, fontSize: 27, fontWeight: 600, lineHeight: 1, color: A700 } }, s.k),
          React.createElement('span', { style: { display: 'block', fontFamily: KO, fontSize: 14.5, lineHeight: 1.35, color: MUT, marginTop: 5 } }, s.n)
        ),
        LANES.map((l, li) => React.createElement('div', {
          key: l,
          style: {
            flex: '1 1 0', minWidth: 0, padding: '11px 10px', display: 'flex', flexDirection: 'column', gap: 7,
            borderRight: li === 4 ? 'none' : '1px solid ' + DIV, boxSizing: 'border-box', minHeight: 96
          }
        },
          NODES.filter((n) => n[0] === si && n[1] === li).map((n) => React.createElement(NodeBox, {
            key: n[3], id: n[3], kind: n[2], st: MOTION.pop(axis + 1.05 + si * 0.16 + li * 0.05)(T),
            innerRef: (el) => { nodeRefs.current[n[3]] = el; }
          }))
        ))
      ))
    )
  );

  /* ── 03 상자 네 종류 ── */
  const tOp = win(T, type - 0.35, type + 0.25, chg - 0.75, chg - 0.3);
  const typeEl = React.createElement('div', {
    style: {
      position: 'absolute', left: 72, right: 72, top: 190, opacity: tOp,
      transform: 'translateY(' + animate({ from: 24, to: 0, start: type - 0.35, end: type + 0.55, ease: Easing.easeOutQuart })(T).toFixed(1) + 'px)'
    }
  },
    React.createElement('div', { style: Object.assign({ fontFamily: HEAD, fontSize: 20, letterSpacing: '.18em', textTransform: 'uppercase', color: FNT }, MOTION.enter(type + 0.05, 10)(T)) }, 'Node types / 상자의 성격'),
    React.createElement('h2', { style: Object.assign({ fontFamily: HEAD, fontSize: 52, fontWeight: 600, lineHeight: 1.1, color: TXT, margin: '12px 0 0' }, MOTION.enter(type + 0.15, 10)(T)) }, '상자 네 종류'),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', borderLeft: '1px solid ' + DIV, borderTop: '1px solid ' + DIV, marginTop: 32 } },
      TYPES.map((t, i) => React.createElement('div', {
        key: t[0],
        style: Object.assign({
          padding: '26px 28px', minHeight: 206, boxSizing: 'border-box',
          borderRight: '1px solid ' + DIV, borderBottom: '1px solid ' + DIV
        }, MOTION.enter(type + 0.5 + i * 0.26, 12)(T))
      },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
          React.createElement('i', {
            style: {
              display: 'block', width: 44, height: 30, background: KIND[t[1]].fill,
              border: (KIND[t[1]].dash ? '1px dashed ' : '1px solid ') + KIND[t[1]].fbd
            }
          }),
          React.createElement('b', { style: { fontFamily: KO, fontWeight: 700, fontSize: 27, color: TXT } }, t[0])
        ),
        React.createElement('div', { style: { fontFamily: KO, fontSize: 20, lineHeight: 1.62, color: MUT, marginTop: 16, textWrap: 'pretty' } }, t[2])
      ))
    ),
    React.createElement('div', { style: Object.assign({ display: 'flex', flexDirection: 'column', gap: 15, marginTop: 30 }, MOTION.enter(type + 1.9, 10)(T)) },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 16, fontFamily: KO, fontSize: 20, color: MUT } },
        React.createElement('i', { style: { display: 'block', width: 62, height: 0, borderTop: '3px solid ' + A500 } }), '실선은 업무 순서'),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 16, fontFamily: KO, fontSize: 20, color: MUT } },
        React.createElement('i', { style: { display: 'block', width: 62, height: 0, borderTop: '3px dashed rgba(0,0,0,.55)' } }), '점선은 회귀 — 보완 요구나 반려로 앞 절차를 다시 밟는 경로')
    )
  );

  /* ── 05·06 절차 흐름도 ── */
  const flowEl = (cue, endCue, kicker, title, lead, rows) => React.createElement('div', {
    style: {
      position: 'absolute', left: 72, right: 72, top: 176,
      opacity: win(T, cue - 0.3, cue + 0.2, endCue - 0.45, endCue - 0.05)
    }
  },
    React.createElement('div', { style: Object.assign({ fontFamily: HEAD, fontSize: 20, letterSpacing: '.18em', textTransform: 'uppercase', color: FNT }, MOTION.enter(cue + 0.05, 10)(T)) }, kicker),
    React.createElement('h2', { style: Object.assign({ fontFamily: HEAD, fontSize: 48, fontWeight: 600, lineHeight: 1.08, letterSpacing: '-.015em', color: TXT, margin: '10px 0 0' }, MOTION.enter(cue + 0.12, 12)(T)) }, title),
    React.createElement('div', { style: Object.assign({ fontFamily: KO, fontSize: 19, lineHeight: 1.5, color: MUT, marginTop: 10, maxWidth: 760, textWrap: 'pretty' }, MOTION.enter(cue + 0.2, 10)(T)) }, lead),
    React.createElement('div', { style: { marginTop: 20 } },
      rows.map((r, i) => {
        const at = cue + 0.45 + i * 0.26;
        const last = i === rows.length - 1;
        return React.createElement('div', { key: r[0] },
          i ? React.createElement('div', { style: { height: 15, display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: 30 } },
            React.createElement('i', { style: { display: 'block', width: 0, borderLeft: '1px solid ' + A500, height: (MOTION.draw(at - 0.2, at + 0.05)(T) * 9).toFixed(1) + 'px' } }),
            React.createElement('i', {
              style: {
                display: 'block', width: 0, height: 0, borderLeft: '4.5px solid transparent', borderRight: '4.5px solid transparent',
                borderTop: '6px solid ' + A500, opacity: MOTION.draw(at - 0.05, at + 0.05)(T)
              }
            })
          ) : null,
          React.createElement('div', {
            style: Object.assign({
              display: 'flex', alignItems: 'center', gap: 18, boxSizing: 'border-box', padding: '10px 20px',
              border: '1px solid ' + (last ? A900 : DIV), borderLeft: '5px solid ' + (last ? A900 : i === 0 ? A300 : A500),
              background: last ? KEYBG : BG
            }, MOTION.enter(at, 10)(T))
          },
            React.createElement('b', { style: { fontFamily: HEAD, fontSize: 25, fontWeight: 600, lineHeight: 1, letterSpacing: '.06em', color: last ? A900 : A700, flex: '0 0 40px' } }, '0' + (i + 1)),
            React.createElement('div', { style: { minWidth: 0 } },
              React.createElement('div', { style: { fontFamily: KO, fontWeight: 700, fontSize: 23, lineHeight: 1.24, color: TXT, letterSpacing: '-.015em', textWrap: 'pretty' } }, r[0]),
              React.createElement('div', { style: { fontFamily: KO, fontSize: 16, lineHeight: 1.4, color: MUT, marginTop: 4, textWrap: 'pretty' } }, r[1])
            )
          )
        );
      })
    )
  );
  const chgEl = flowEl(chg, ext, 'Flow 01 / 설계변경 · 계약금액 조정', '설계변경 절차', '현장에서 사유가 생기면 실정보고로 올리고, 발주청 방침이 정해진 뒤 도서와 계약을 함께 고칩니다.', FLOW_CHG);
  const extEl = flowEl(ext, grid, 'Flow 02 / 공기연장 · 간접비 정산', '공기연장 절차', '연장은 사유가 끝나기 전에 신청해야 하고, 간접비는 준공대가를 받기 전에 청구해야 합니다.', FLOW_EXT);

  /* ── 07 26개 보드 (폴더 탭) ── */
  const gOp = win(T, grid - 0.35, grid + 0.25, close - 0.5, close - 0.05);
  const gridEl = React.createElement('div', { style: { position: 'absolute', left: 72, right: 72, top: 186, opacity: gOp } },
    React.createElement('div', { style: Object.assign({ display: 'flex', alignItems: 'baseline', gap: 12, paddingBottom: 13, borderBottom: '1px solid ' + DIV }, MOTION.enter(grid + 0.05, 10)(T)) },
      React.createElement('span', { style: { fontFamily: HEAD, fontSize: 20, letterSpacing: '.16em', textTransform: 'uppercase', color: FNT } }, '업무 보드 / Boards'),
      React.createElement('span', { style: { marginLeft: 'auto', fontFamily: HEAD, fontSize: 19, letterSpacing: '.1em', color: FNT } }, '26 BOARDS · 47 SHEETS')
    ),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px 12px', marginTop: 22 } },
      BOARDS.map((b, i) => {
        const sh = SHADE[i % 4];
        const st = MOTION.enter(grid + 0.45 + i * 0.068, 10)(T);
        return React.createElement('div', { key: b, style: Object.assign({}, st) },
          React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', height: 11 } },
            React.createElement('div', {
              style: {
                width: TABW[i % 4], height: 11, background: sh.tab, border: '1px solid ' + sh.line, borderBottom: 0,
                clipPath: 'polygon(0 0, calc(100% - 9px) 0, 100% 100%, 0 100%)'
              }
            })),
          React.createElement('div', {
            style: {
              border: '1px solid ' + sh.line, background: sh.body, padding: '9px 10px 10px',
              minHeight: 74, display: 'flex', flexDirection: 'column', boxSizing: 'border-box'
            }
          },
            React.createElement('div', { style: { fontFamily: KO, fontSize: 14.5, fontWeight: 700, lineHeight: 1.28, color: sh.ink, textWrap: 'pretty' } }, b),
            React.createElement('b', { style: { marginTop: 'auto', paddingTop: 6, fontFamily: HEAD, fontSize: 15, fontWeight: 600, lineHeight: 1, color: sh.sub, letterSpacing: '.06em' } }, 'B' + String(i + 1).padStart(2, '0'))
          )
        );
      })
    ),
    React.createElement('div', { style: Object.assign({ marginTop: 20, fontFamily: KO, fontSize: 18, lineHeight: 1.7, color: FNT }, MOTION.enter(grid + 2.5, 10)(T)) },
      '폴더 하나가 업무 보드 하나입니다. 열면 담당 주체(레인)와 단계 게이트로 갈라 놓은 절차 도식이 나옵니다.')
  );

  /* ── 06 마무리 ── */
  const cOp = win(T, close - 0.35, close + 0.3);
  const closeEl = React.createElement('div', { style: { position: 'absolute', left: 72, right: 72, top: 178, opacity: cOp } },
    React.createElement('div', { style: Object.assign({ fontFamily: HEAD, fontSize: 20, letterSpacing: '.18em', textTransform: 'uppercase', color: FNT }, MOTION.enter(close + 0.05, 10)(T)) }, 'Why this board'),
    React.createElement('h2', { style: Object.assign({ fontFamily: HEAD, fontSize: 60, fontWeight: 600, lineHeight: 1.12, letterSpacing: '-.015em', color: TXT, margin: '14px 0 0' }, MOTION.enter(close + 0.15, 12)(T)) },
      '담당자가 바뀔 때마다', React.createElement('br', null), '같은 질문이 반복됩니다'),
    React.createElement('div', { style: { marginTop: 40, borderTop: '1px solid ' + DIV } },
      ASKS.map((a, i) => React.createElement('div', {
        key: a,
        style: Object.assign({ display: 'flex', alignItems: 'center', gap: 26, padding: '22px 4px', borderBottom: '1px solid ' + DIV }, MOTION.enter(close + 0.5 + i * 0.22, 12)(T))
      },
        React.createElement('b', { style: { fontFamily: HEAD, fontSize: 26, fontWeight: 600, color: A300, letterSpacing: '.08em', flex: '0 0 46px' } }, '0' + (i + 1)),
        React.createElement('span', { style: { fontFamily: KO, fontWeight: 700, fontSize: 30, color: TXT, letterSpacing: '-.015em' } }, a)
      ))
    ),
    React.createElement('div', { style: Object.assign({ fontFamily: KO, fontSize: 22, lineHeight: 1.6, color: MUT, marginTop: 28, textWrap: 'pretty' }, MOTION.enter(close + 1.45, 10)(T)) },
      '그 답을 업무별로 한 장씩 정리해 26개 폴더에 넣었습니다.'),
    React.createElement('div', {
      style: Object.assign({
        display: 'inline-flex', alignItems: 'center', gap: 14, marginTop: 26, padding: '16px 28px',
        background: A900, border: '2px solid ' + A900, color: '#fff', fontFamily: KO, fontWeight: 700, fontSize: 21
      }, MOTION.enter(close + 1.7, 10)(T))
    }, 'seum8660.github.io/workflow', React.createElement('span', { style: { fontFamily: HEAD, letterSpacing: '.1em' } }, '→'))
  );

  /* ── 고정 프레임 (사이트 헤더 · 푸터 규칙) ── */
  return React.createElement('div', { ref: rootRef, style: { position: 'absolute', inset: 0, background: BG, overflow: 'hidden' } },
    React.createElement('div', { style: { position: 'absolute', left: 0, right: 0, top: 0, height: 108, display: 'flex', alignItems: 'center', gap: 16, padding: '0 72px', boxSizing: 'border-box', background: BG, zIndex: 5, borderBottom: '1px solid ' + DIV } },
      React.createElement('span', { style: { fontFamily: HEAD, fontSize: 20, letterSpacing: '.14em', textTransform: 'uppercase', color: FNT } }, 'School Bible / Workflow Board'),
      React.createElement('span', { style: { marginLeft: 'auto', fontFamily: HEAD, fontSize: 22, letterSpacing: '.1em', color: A700 } },
        String(idx).padStart(2, '0'), React.createElement('span', { style: { color: FNT } }, ' / 07'))
    ),
    React.createElement('div', { style: { position: 'absolute', inset: 0 } },
      coverEl,
      React.createElement('div', {
        style: {
          position: 'absolute', inset: 0
        }
      }, matrixEl),
      typeEl, chgEl, extEl, gridEl, closeEl),
    React.createElement('div', {
      style: {
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 104, display: 'flex', alignItems: 'center',
        padding: '0 72px', boxSizing: 'border-box', borderTop: '1px solid ' + DIV, background: BG, zIndex: 5
      }
    }, React.createElement('span', {
      style: {
        fontFamily: KO, fontWeight: 600, fontSize: 24, color: TXT, letterSpacing: '-.012em', textWrap: 'pretty',
        opacity: capIn, transform: 'translateY(' + ((1 - capIn) * 8).toFixed(1) + 'px)'
      }
    }, CAPTIONS[capI].text))
  );
}

window.CardNewsMotion = function CardNewsMotion() {
  return React.createElement(CompositionStage, {
    width: 1080, height: 1080, scenes: window.OM_SCENES, playback: window.OM_PLAYBACK, bg: '#ffffff'
  }, React.createElement(Piece, null));
};
