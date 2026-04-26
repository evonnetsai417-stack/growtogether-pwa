// animals2.jsx — 額外的動物（補充原 animals.jsx）
// 加入更多台灣原生動物與常見動物

// 13. 台灣獼猴
function Macaque({ mood, armSwing = 0 }) {
  const c = '#A8825A', cDark = '#6B4A2A', cLight = '#F5DCB5', cFace = '#E8B888';
  return (
    <g>
      <ellipse cx={82} cy={172} rx={12} ry={14} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      <ellipse cx={118} cy={172} rx={12} ry={14} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      <ellipse cx={100} cy={135} rx={36} ry={32} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      <ellipse cx={100} cy={142} rx={22} ry={18} fill={cLight} />
      <g transform={`rotate(${armSwing} 70 125)`}>
        <ellipse cx={68} cy={135} rx={9} ry={14} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      <g transform={`rotate(${-armSwing} 130 125)`}>
        <ellipse cx={132} cy={135} rx={9} ry={14} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      <circle cx={100} cy={75} r={36} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      <ellipse cx={100} cy={82} rx={22} ry={20} fill={cFace} />
      <circle cx={70} cy={70} r={9} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      <circle cx={130} cy={70} r={9} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      <ellipse cx={100} cy={92} rx={9} ry={5} fill={cDark} />
      <Eye cx={88} cy={78} mood={mood} />
      <Eye cx={112} cy={78} mood={mood} />
      <Mouth cx={100} cy={94} mood={mood} size={0.7} />
    </g>
  );
}

// 14. 山豬
function Boar({ mood, armSwing = 0 }) {
  const c = '#7A5A3C', cDark = '#3a2a1a', cLight = '#A88060';
  return (
    <g>
      <ellipse cx={78} cy={172} rx={11} ry={14} fill={cDark} stroke="#1a1a1a" strokeWidth={2.5} />
      <ellipse cx={122} cy={172} rx={11} ry={14} fill={cDark} stroke="#1a1a1a" strokeWidth={2.5} />
      <ellipse cx={100} cy={135} rx={42} ry={34} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      <ellipse cx={100} cy={142} rx={26} ry={20} fill={cLight} />
      {/* 鬃毛 */}
      <path d="M 70 110 L 68 95 M 80 105 L 80 90 M 90 102 L 92 86 M 100 100 L 102 84 M 110 102 L 112 86 M 120 105 L 122 90 M 130 110 L 132 95"
            stroke={cDark} strokeWidth={3} strokeLinecap="round" />
      <g transform={`rotate(${armSwing} 65 125)`}>
        <ellipse cx={62} cy={135} rx={9} ry={13} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      <g transform={`rotate(${-armSwing} 135 125)`}>
        <ellipse cx={138} cy={135} rx={9} ry={13} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      <ellipse cx={100} cy={80} rx={36} ry={32} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      {/* 三角耳 */}
      <path d="M 72 50 L 80 35 L 88 55 Z" fill={c} stroke="#1a1a1a" strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M 128 50 L 120 35 L 112 55 Z" fill={c} stroke="#1a1a1a" strokeWidth={2.5} strokeLinejoin="round" />
      {/* 鼻吻 */}
      <ellipse cx={100} cy={95} rx={18} ry={12} fill={cLight} stroke="#1a1a1a" strokeWidth={2.5} />
      <circle cx={92} cy={95} r={2.5} fill="#1a1a1a" />
      <circle cx={108} cy={95} r={2.5} fill="#1a1a1a" />
      {/* 獠牙 */}
      <path d="M 88 102 L 86 108 L 90 106 Z" fill="#fff" stroke="#1a1a1a" strokeWidth={1.5} />
      <path d="M 112 102 L 114 108 L 110 106 Z" fill="#fff" stroke="#1a1a1a" strokeWidth={1.5} />
      <Eye cx={84} cy={72} mood={mood} size={0.8} />
      <Eye cx={116} cy={72} mood={mood} size={0.8} />
    </g>
  );
}

// 15. 台灣藍鵲
function BlueMagpie({ mood, armSwing = 0 }) {
  const c = '#3A7BC8', cDark = '#1a1a1a', cRed = '#E85C5C', cYellow = '#F5C24E';
  return (
    <g>
      <path d="M 86 178 L 82 188 M 86 178 L 86 188 M 86 178 L 90 188"
            stroke={cYellow} strokeWidth={3} strokeLinecap="round" />
      <path d="M 114 178 L 110 188 M 114 178 L 114 188 M 114 178 L 118 188"
            stroke={cYellow} strokeWidth={3} strokeLinecap="round" />
      {/* 長尾 */}
      <path d="M 130 130 Q 160 140 175 175 L 168 178 Q 145 145 125 140 Z"
            fill={c} stroke="#1a1a1a" strokeWidth={2.5} strokeLinejoin="round" />
      <ellipse cx={100} cy={130} rx={38} ry={45} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      {/* 翅膀 */}
      <g transform={`rotate(${armSwing} 60 110)`}>
        <ellipse cx={60} cy={125} rx={10} ry={22} fill={cDark} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      <g transform={`rotate(${-armSwing} 140 110)`}>
        <ellipse cx={140} cy={125} rx={10} ry={22} fill={cDark} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      {/* 頭 */}
      <circle cx={100} cy={75} r={32} fill={cDark} stroke="#1a1a1a" strokeWidth={3} />
      {/* 紅喙 */}
      <path d="M 100 88 L 90 96 L 110 96 Z" fill={cRed} stroke="#1a1a1a" strokeWidth={2.5} strokeLinejoin="round" />
      {/* 黃眼 */}
      <circle cx={86} cy={72} r={6} fill={cYellow} stroke="#1a1a1a" strokeWidth={2} />
      <circle cx={114} cy={72} r={6} fill={cYellow} stroke="#1a1a1a" strokeWidth={2} />
      <circle cx={86} cy={72} r={3} fill="#1a1a1a" />
      <circle cx={114} cy={72} r={3} fill="#1a1a1a" />
    </g>
  );
}

// 16. 梅花鹿
function SikaDeer({ mood, armSwing = 0 }) {
  const c = '#C68A5A', cDark = '#6B3A1F', cLight = '#F5D2A8';
  return (
    <g>
      <rect x={78} y={155} width={11} height={28} rx={3} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      <rect x={111} y={155} width={11} height={28} rx={3} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      <ellipse cx={100} cy={135} rx={36} ry={28} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      {/* 白點 */}
      <circle cx={84} cy={130} r={3} fill="#fff" />
      <circle cx={100} cy={125} r={3} fill="#fff" />
      <circle cx={116} cy={130} r={3} fill="#fff" />
      <circle cx={92} cy={142} r={3} fill="#fff" />
      <circle cx={108} cy={142} r={3} fill="#fff" />
      <ellipse cx={100} cy={142} rx={18} ry={12} fill={cLight} />
      <g transform={`rotate(${armSwing} 70 125)`}>
        <ellipse cx={68} cy={135} rx={8} ry={13} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      <g transform={`rotate(${-armSwing} 130 125)`}>
        <ellipse cx={132} cy={135} rx={8} ry={13} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      <ellipse cx={100} cy={75} rx={28} ry={26} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      {/* 鹿角 */}
      <path d="M 82 50 L 78 35 L 72 38 M 82 50 L 80 28 M 82 50 L 88 36"
            stroke={cDark} strokeWidth={3} strokeLinecap="round" fill="none" />
      <path d="M 118 50 L 122 35 L 128 38 M 118 50 L 120 28 M 118 50 L 112 36"
            stroke={cDark} strokeWidth={3} strokeLinecap="round" fill="none" />
      {/* 耳 */}
      <ellipse cx={72} cy={62} rx={6} ry={10} fill={c} stroke="#1a1a1a" strokeWidth={2} />
      <ellipse cx={128} cy={62} rx={6} ry={10} fill={c} stroke="#1a1a1a" strokeWidth={2} />
      {/* 嘴 */}
      <ellipse cx={100} cy={88} rx={10} ry={7} fill={cLight} />
      <ellipse cx={100} cy={84} rx={4} ry={3} fill="#1a1a1a" />
      <Eye cx={88} cy={72} mood={mood} size={0.85} />
      <Eye cx={112} cy={72} mood={mood} size={0.85} />
      <Blush cx={78} cy={84} size={0.7} />
      <Blush cx={122} cy={84} size={0.7} />
    </g>
  );
}

// 17. 石虎
function Leopardcat({ mood, armSwing = 0 }) {
  const c = '#D4A878', cDark = '#3a2a1a', cLight = '#F5E2C8';
  return (
    <g>
      <ellipse cx={82} cy={172} rx={12} ry={14} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      <ellipse cx={118} cy={172} rx={12} ry={14} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      <ellipse cx={100} cy={135} rx={36} ry={32} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      <ellipse cx={100} cy={142} rx={22} ry={18} fill={cLight} />
      {/* 斑點 */}
      {[[80,128],[90,138],[105,128],[118,138],[88,150],[110,150],[100,118]].map(([x,y],i)=>(
        <ellipse key={i} cx={x} cy={y} rx={3.5} ry={2.5} fill={cDark} />
      ))}
      <g transform={`rotate(${armSwing} 70 125)`}>
        <ellipse cx={68} cy={135} rx={9} ry={13} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      <g transform={`rotate(${-armSwing} 130 125)`}>
        <ellipse cx={132} cy={135} rx={9} ry={13} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      <circle cx={100} cy={75} r={36} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      {/* 耳朵 */}
      <path d="M 72 42 L 76 22 L 88 42 Z" fill={c} stroke="#1a1a1a" strokeWidth={2.5} strokeLinejoin="round" />
      <circle cx={80} cy={32} r={3} fill="#fff" stroke="#1a1a1a" strokeWidth={1.5} />
      <path d="M 128 42 L 124 22 L 112 42 Z" fill={c} stroke="#1a1a1a" strokeWidth={2.5} strokeLinejoin="round" />
      <circle cx={120} cy={32} r={3} fill="#fff" stroke="#1a1a1a" strokeWidth={1.5} />
      {/* 眉間白 */}
      <path d="M 92 56 L 90 70 M 108 56 L 110 70" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
      {/* 鼻 */}
      <path d="M 96 86 L 100 92 L 104 86 Z" fill="#FFB3B3" stroke="#1a1a1a" strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M 100 92 Q 95 98 90 95 M 100 92 Q 105 98 110 95"
            fill="none" stroke="#1a1a1a" strokeWidth={2} strokeLinecap="round" />
      <Eye cx={86} cy={75} mood={mood} />
      <Eye cx={114} cy={75} mood={mood} />
      <Blush cx={76} cy={88} size={0.8} />
      <Blush cx={124} cy={88} size={0.8} />
    </g>
  );
}

// 18. 帝雉
function MikadoP({ mood, armSwing = 0 }) {
  const c = '#3B3F8A', cDark = '#1a1a1a', cRed = '#E85C5C', cYellow = '#F5C24E';
  return (
    <g>
      <path d="M 86 178 L 82 188 M 86 178 L 86 188 M 86 178 L 90 188"
            stroke={cYellow} strokeWidth={3} strokeLinecap="round" />
      <path d="M 114 178 L 110 188 M 114 178 L 114 188 M 114 178 L 118 188"
            stroke={cYellow} strokeWidth={3} strokeLinecap="round" />
      {/* 長尾 */}
      <path d="M 130 145 Q 165 150 170 178 L 162 180 Q 150 155 125 150 Z"
            fill={c} stroke="#1a1a1a" strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M 138 152 L 162 168 M 142 158 L 165 173" stroke="#fff" strokeWidth={1.5} />
      <ellipse cx={100} cy={125} rx={40} ry={48} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      {/* 白條紋 */}
      <line x1={78} y1={120} x2={122} y2={120} stroke="#fff" strokeWidth={2.5} />
      <line x1={78} y1={140} x2={122} y2={140} stroke="#fff" strokeWidth={2.5} />
      <g transform={`rotate(${armSwing} 60 110)`}>
        <ellipse cx={60} cy={125} rx={10} ry={22} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      <g transform={`rotate(${-armSwing} 140 110)`}>
        <ellipse cx={140} cy={125} rx={10} ry={22} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      <circle cx={100} cy={70} r={28} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      {/* 紅臉 */}
      <ellipse cx={100} cy={75} rx={20} ry={12} fill={cRed} stroke="#1a1a1a" strokeWidth={2} />
      {/* 喙 */}
      <path d="M 100 80 L 92 88 L 108 88 Z" fill={cYellow} stroke="#1a1a1a" strokeWidth={2} strokeLinejoin="round" />
      <Eye cx={88} cy={72} mood={mood} size={0.7} />
      <Eye cx={112} cy={72} mood={mood} size={0.7} />
    </g>
  );
}

// 19. 五色鳥
function MullerBarbet({ mood, armSwing = 0 }) {
  const c = '#88C467', cBlue = '#3A7BC8', cRed = '#E85C5C', cYellow = '#F5C24E';
  return (
    <g>
      <path d="M 86 178 L 82 188 M 86 178 L 90 188"
            stroke={cYellow} strokeWidth={3} strokeLinecap="round" />
      <path d="M 114 178 L 110 188 M 114 178 L 118 188"
            stroke={cYellow} strokeWidth={3} strokeLinecap="round" />
      <ellipse cx={100} cy={130} rx={42} ry={48} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      <g transform={`rotate(${armSwing} 60 110)`}>
        <ellipse cx={60} cy={125} rx={10} ry={22} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      <g transform={`rotate(${-armSwing} 140 110)`}>
        <ellipse cx={140} cy={125} rx={10} ry={22} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      <circle cx={100} cy={75} r={36} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      {/* 五色頭 */}
      <path d="M 70 60 L 130 60 L 128 70 L 72 70 Z" fill={cBlue} />
      <ellipse cx={100} cy={82} rx={20} ry={5} fill={cRed} />
      <ellipse cx={100} cy={92} rx={18} ry={5} fill={cYellow} />
      {/* 喙 */}
      <path d="M 100 95 L 88 102 L 112 102 Z" fill="#1a1a1a" />
      <Eye cx={86} cy={68} mood={mood} />
      <Eye cx={114} cy={68} mood={mood} />
    </g>
  );
}

// 20. 鯨魚
function Whale({ mood, armSwing = 0 }) {
  const c = '#5BA8E8', cDark = '#2A6BA8', cLight = '#A8D2F0';
  return (
    <g>
      {/* 身體（橫向） */}
      <ellipse cx={100} cy={130} rx={70} ry={42} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      <ellipse cx={95} cy={140} rx={48} ry={22} fill={cLight} />
      {/* 尾巴 */}
      <path d="M 162 110 L 188 90 L 180 130 L 188 170 L 162 150 Z"
            fill={c} stroke="#1a1a1a" strokeWidth={3} strokeLinejoin="round" />
      {/* 鰭（手） */}
      <g transform={`rotate(${armSwing} 70 145)`}>
        <ellipse cx={62} cy={155} rx={14} ry={10} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      {/* 噴水孔 */}
      <ellipse cx={70} cy={102} rx={4} ry={2} fill="#1a1a1a" />
      <path d="M 70 100 Q 65 85 70 75 Q 75 85 70 100" fill="#A8D2F0" stroke="#1a1a1a" strokeWidth={2} />
      <path d="M 70 88 Q 60 78 65 70" stroke="#A8D2F0" strokeWidth={3} fill="none" strokeLinecap="round" />
      {/* 嘴線 */}
      <path d="M 38 138 Q 60 148 80 142" stroke="#1a1a1a" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <Eye cx={55} cy={125} mood={mood} />
      <Blush cx={45} cy={140} size={0.8} />
    </g>
  );
}

// 21. 蝴蝶
function Butterfly({ mood, armSwing = 0 }) {
  const c = '#FFB3CC', cDark = '#B85A85', cAccent = '#F5C24E';
  return (
    <g>
      {/* 翅膀 */}
      <g transform={`rotate(${armSwing * 0.6} 100 130)`}>
        <ellipse cx={64} cy={110} rx={28} ry={24} fill={c} stroke="#1a1a1a" strokeWidth={3} />
        <circle cx={64} cy={110} r={8} fill={cAccent} stroke="#1a1a1a" strokeWidth={2} />
        <ellipse cx={70} cy={150} rx={22} ry={18} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      </g>
      <g transform={`rotate(${-armSwing * 0.6} 100 130)`}>
        <ellipse cx={136} cy={110} rx={28} ry={24} fill={c} stroke="#1a1a1a" strokeWidth={3} />
        <circle cx={136} cy={110} r={8} fill={cAccent} stroke="#1a1a1a" strokeWidth={2} />
        <ellipse cx={130} cy={150} rx={22} ry={18} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      </g>
      {/* 身體 */}
      <ellipse cx={100} cy={125} rx={6} ry={32} fill={cDark} stroke="#1a1a1a" strokeWidth={2.5} />
      {/* 觸角 */}
      <path d="M 96 95 Q 88 80 84 72" stroke="#1a1a1a" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <path d="M 104 95 Q 112 80 116 72" stroke="#1a1a1a" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <circle cx={84} cy={72} r={3} fill="#1a1a1a" />
      <circle cx={116} cy={72} r={3} fill="#1a1a1a" />
      {/* 頭 */}
      <circle cx={100} cy={98} r={11} fill={cDark} stroke="#1a1a1a" strokeWidth={2.5} />
      <Eye cx={95} cy={97} mood={mood} size={0.6} />
      <Eye cx={105} cy={97} mood={mood} size={0.6} />
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// 補充到全域 ANIMALS 陣列
// ─────────────────────────────────────────────────────────────
const EXTRA_ANIMALS = [
  { id: 'macaque',    name: '台灣獼猴', render: Macaque },
  { id: 'boar',       name: '山豬',     render: Boar },
  { id: 'bluemagpie', name: '台灣藍鵲', render: BlueMagpie },
  { id: 'sikadeer',   name: '梅花鹿',   render: SikaDeer },
  { id: 'leopardcat', name: '石虎',     render: Leopardcat },
  { id: 'mikadop',    name: '帝雉',     render: MikadoP },
  { id: 'mullerbb',   name: '五色鳥',   render: MullerBarbet },
  { id: 'whale',      name: '鯨魚',     render: Whale },
  { id: 'butterfly',  name: '蝴蝶',     render: Butterfly },
];

// 加到 ANIMALS
window.ANIMALS = [...window.ANIMALS, ...EXTRA_ANIMALS];

Object.assign(window, {
  Macaque, Boar, BlueMagpie, SikaDeer, Leopardcat, MikadoP, MullerBarbet, Whale, Butterfly,
});
