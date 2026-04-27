// animals.jsx — 原創動物 SVG，扁平卡通風格，粗黑線條
// 每隻動物都用 <Pet> 元件統一渲染，並支援表情、手腳擺動

// ─────────────────────────────────────────────────────────────
// 共用元件：眼睛、嘴巴、腮紅
// ─────────────────────────────────────────────────────────────

// 眼睛 — 支援多種表情
function Eye({ cx, cy, mood = 'normal', size = 1, flip = false }) {
  // mood: normal, happy, sleepy, sad, sick, scared, dizzy
  const r = 5 * size;
  if (mood === 'happy') {
    // 笑眼 — 弧形
    return (
      <path d={`M ${cx - r} ${cy} Q ${cx} ${cy - r * 1.2} ${cx + r} ${cy}`}
            fill="none" stroke="#1a1a1a" strokeWidth={2.5} strokeLinecap="round" />
    );
  }
  if (mood === 'sleepy') {
    return (
      <path d={`M ${cx - r} ${cy} Q ${cx} ${cy + r * 0.8} ${cx + r} ${cy}`}
            fill="none" stroke="#1a1a1a" strokeWidth={2.5} strokeLinecap="round" />
    );
  }
  if (mood === 'sad') {
    return (
      <g>
        <circle cx={cx} cy={cy + 1} r={r * 0.8} fill="#1a1a1a" />
        <circle cx={cx + r * 0.3} cy={cy - r * 0.3} r={r * 0.3} fill="#fff" />
      </g>
    );
  }
  if (mood === 'sick') {
    // X 眼
    const s = r * 0.8;
    return (
      <g stroke="#1a1a1a" strokeWidth={2.5} strokeLinecap="round">
        <line x1={cx - s} y1={cy - s} x2={cx + s} y2={cy + s} />
        <line x1={cx - s} y1={cy + s} x2={cx + s} y2={cy - s} />
      </g>
    );
  }
  if (mood === 'scared') {
    // 大眼小瞳孔
    return (
      <g>
        <circle cx={cx} cy={cy} r={r * 1.2} fill="#fff" stroke="#1a1a1a" strokeWidth={2} />
        <circle cx={cx} cy={cy} r={r * 0.4} fill="#1a1a1a" />
      </g>
    );
  }
  // normal — 黑色圓眼 + 高光
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#1a1a1a" />
      <circle cx={cx + r * 0.35} cy={cy - r * 0.35} r={r * 0.35} fill="#fff" />
    </g>
  );
}

// 嘴巴
function Mouth({ cx, cy, mood = 'normal', size = 1 }) {
  const w = 8 * size;
  if (mood === 'happy') {
    return (
      <path d={`M ${cx - w} ${cy} Q ${cx} ${cy + w * 1.2} ${cx + w} ${cy}`}
            fill="#E89B8B" stroke="#1a1a1a" strokeWidth={2.5} strokeLinejoin="round" />
    );
  }
  if (mood === 'sad') {
    return (
      <path d={`M ${cx - w} ${cy + w * 0.6} Q ${cx} ${cy - w * 0.4} ${cx + w} ${cy + w * 0.6}`}
            fill="none" stroke="#1a1a1a" strokeWidth={2.5} strokeLinecap="round" />
    );
  }
  if (mood === 'sleepy') {
    // 小 O 嘴
    return <ellipse cx={cx} cy={cy} rx={w * 0.4} ry={w * 0.5} fill="#1a1a1a" />;
  }
  if (mood === 'sick') {
    // 波浪嘴
    return (
      <path d={`M ${cx - w} ${cy} q ${w/2} -${w/3} ${w} 0 t ${w} 0`}
            fill="none" stroke="#1a1a1a" strokeWidth={2.5} strokeLinecap="round" />
    );
  }
  if (mood === 'scared') {
    return <ellipse cx={cx} cy={cy} rx={w * 0.5} ry={w * 0.7} fill="#1a1a1a" />;
  }
  // normal — 小弧
  return (
    <path d={`M ${cx - w * 0.5} ${cy} Q ${cx} ${cy + w * 0.4} ${cx + w * 0.5} ${cy}`}
          fill="none" stroke="#1a1a1a" strokeWidth={2.5} strokeLinecap="round" />
  );
}

// 腮紅
function Blush({ cx, cy, size = 1 }) {
  return (
    <ellipse cx={cx} cy={cy} rx={5 * size} ry={3 * size} fill="#FFB3B3" opacity={0.7} />
  );
}

// 動物的 hand/leg 共用 path — 簡單橢圓
function Limb({ x, y, w = 10, h = 18, color, angle = 0, ox = 0, oy = 0 }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${angle} ${ox} ${oy})`}>
      <ellipse cx={0} cy={0} rx={w} ry={h} fill={color} stroke="#1a1a1a" strokeWidth={2.5} />
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// 個別動物 — 每個 return SVG children；外層 svg 在 Pet 元件提供
// 共同 props: { mood, armSwing, legSwing }
// 視窗為 200x200，動物中心約 (100, 100)，立姿
// ─────────────────────────────────────────────────────────────

// 1. 熊
function Bear({ mood, armSwing = 0 }) {
  const c = '#8B5A3C', cDark = '#5C3A22', cLight = '#D4A678';
  return (
    <g>
      {/* 腿 */}
      <ellipse cx={80} cy={170} rx={14} ry={18} fill={cDark} stroke="#1a1a1a" strokeWidth={2.5} />
      <ellipse cx={120} cy={170} rx={14} ry={18} fill={cDark} stroke="#1a1a1a" strokeWidth={2.5} />
      {/* 身體 */}
      <ellipse cx={100} cy={130} rx={42} ry={38} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      {/* 肚子 */}
      <ellipse cx={100} cy={138} rx={26} ry={22} fill={cLight} />
      {/* 手 */}
      <g transform={`rotate(${armSwing} 65 115)`}>
        <ellipse cx={65} cy={130} rx={11} ry={16} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      <g transform={`rotate(${-armSwing} 135 115)`}>
        <ellipse cx={135} cy={130} rx={11} ry={16} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      {/* 頭 */}
      <circle cx={100} cy={75} r={42} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      {/* 耳朵 */}
      <circle cx={68} cy={42} r={13} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      <circle cx={68} cy={42} r={6} fill={cDark} />
      <circle cx={132} cy={42} r={13} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      <circle cx={132} cy={42} r={6} fill={cDark} />
      {/* 嘴部 */}
      <ellipse cx={100} cy={90} rx={20} ry={15} fill={cLight} />
      {/* 鼻 */}
      <ellipse cx={100} cy={82} rx={5} ry={4} fill="#1a1a1a" />
      {/* 五官 */}
      <Eye cx={84} cy={68} mood={mood} />
      <Eye cx={116} cy={68} mood={mood} />
      <Mouth cx={100} cy={95} mood={mood} />
      <Blush cx={75} cy={88} />
      <Blush cx={125} cy={88} />
    </g>
  );
}

// 2. 兔子
function Rabbit({ mood, armSwing = 0 }) {
  const c = '#F5E6D3', cDark = '#D4B896', cPink = '#FFC9D6';
  return (
    <g>
      {/* 腿 */}
      <ellipse cx={82} cy={172} rx={13} ry={16} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      <ellipse cx={118} cy={172} rx={13} ry={16} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      {/* 身體 */}
      <ellipse cx={100} cy={135} rx={36} ry={34} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      <ellipse cx={100} cy={142} rx={22} ry={18} fill="#fff" />
      {/* 手 */}
      <g transform={`rotate(${armSwing} 70 120)`}>
        <ellipse cx={68} cy={135} rx={9} ry={14} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      <g transform={`rotate(${-armSwing} 130 120)`}>
        <ellipse cx={132} cy={135} rx={9} ry={14} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      {/* 頭 */}
      <circle cx={100} cy={75} r={36} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      {/* 長耳朵 */}
      <ellipse cx={82} cy={28} rx={8} ry={26} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      <ellipse cx={82} cy={32} rx={4} ry={18} fill={cPink} />
      <ellipse cx={118} cy={28} rx={8} ry={26} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      <ellipse cx={118} cy={32} rx={4} ry={18} fill={cPink} />
      {/* 鼻嘴部 */}
      <ellipse cx={100} cy={88} rx={12} ry={9} fill="#fff" />
      <path d="M 100 80 L 96 86 L 104 86 Z" fill={cPink} stroke="#1a1a1a" strokeWidth={2} strokeLinejoin="round" />
      {/* 五官 */}
      <Eye cx={86} cy={70} mood={mood} />
      <Eye cx={114} cy={70} mood={mood} />
      <Mouth cx={100} cy={94} mood={mood} size={0.8} />
      <Blush cx={76} cy={88} />
      <Blush cx={124} cy={88} />
    </g>
  );
}

// 3. 青蛙
function Frog({ mood, armSwing = 0 }) {
  const c = '#88C467', cDark = '#5A9438', cLight = '#D4ECB8';
  return (
    <g>
      {/* 腿 */}
      <ellipse cx={75} cy={170} rx={16} ry={14} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      <ellipse cx={125} cy={170} rx={16} ry={14} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      {/* 身體 */}
      <ellipse cx={100} cy={130} rx={48} ry={38} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      {/* 肚 */}
      <ellipse cx={100} cy={140} rx={30} ry={22} fill={cLight} />
      {/* 手 */}
      <g transform={`rotate(${armSwing} 60 120)`}>
        <ellipse cx={58} cy={130} rx={11} ry={14} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      <g transform={`rotate(${-armSwing} 140 120)`}>
        <ellipse cx={142} cy={130} rx={11} ry={14} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      {/* 頭 — 與身體合一 */}
      {/* 大眼凸起 */}
      <circle cx={78} cy={78} r={20} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      <circle cx={122} cy={78} r={20} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      <circle cx={78} cy={78} r={13} fill="#fff" />
      <circle cx={122} cy={78} r={13} fill="#fff" />
      <Eye cx={78} cy={80} mood={mood} size={1.1} />
      <Eye cx={122} cy={80} mood={mood} size={1.1} />
      {/* 嘴 — 大寬嘴 */}
      <path d="M 65 110 Q 100 130 135 110"
            fill="none" stroke="#1a1a1a" strokeWidth={3} strokeLinecap="round" />
      <Blush cx={70} cy={115} />
      <Blush cx={130} cy={115} />
    </g>
  );
}

// 4. 大象
function Elephant({ mood, armSwing = 0 }) {
  const c = '#A8B5C2', cDark = '#7A8A99', cPink = '#FFC9D6';
  return (
    <g>
      {/* 腿 */}
      <rect x={70} y={155} width={18} height={25} rx={5} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      <rect x={112} y={155} width={18} height={25} rx={5} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      {/* 身體 */}
      <ellipse cx={100} cy={130} rx={45} ry={32} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      {/* 手 */}
      <g transform={`rotate(${armSwing} 62 120)`}>
        <ellipse cx={60} cy={130} rx={10} ry={15} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      <g transform={`rotate(${-armSwing} 138 120)`}>
        <ellipse cx={140} cy={130} rx={10} ry={15} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      {/* 頭 */}
      <ellipse cx={100} cy={80} rx={38} ry={36} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      {/* 大耳朵 */}
      <ellipse cx={62} cy={75} rx={16} ry={22} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      <ellipse cx={62} cy={78} rx={9} ry={15} fill={cPink} />
      <ellipse cx={138} cy={75} rx={16} ry={22} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      <ellipse cx={138} cy={78} rx={9} ry={15} fill={cPink} />
      {/* 鼻子（象鼻） */}
      <path d="M 90 100 Q 88 120 95 130 Q 105 138 100 145"
            fill="none" stroke="#1a1a1a" strokeWidth={3} strokeLinecap="round" />
      <path d="M 90 100 Q 88 120 95 130 Q 105 138 100 145 L 110 145 Q 115 138 105 130 Q 98 120 100 100 Z"
            fill={c} stroke="#1a1a1a" strokeWidth={3} strokeLinejoin="round" />
      {/* 五官 */}
      <Eye cx={84} cy={75} mood={mood} />
      <Eye cx={116} cy={75} mood={mood} />
      <Blush cx={76} cy={92} />
      <Blush cx={124} cy={92} />
    </g>
  );
}

// 5. 長頸鹿
function Giraffe({ mood, armSwing = 0 }) {
  const c = '#F5C97A', cDark = '#A66A2C';
  return (
    <g>
      {/* 腿 */}
      <rect x={78} y={155} width={12} height={28} rx={3} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      <rect x={110} y={155} width={12} height={28} rx={3} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      {/* 身體 */}
      <ellipse cx={100} cy={140} rx={32} ry={26} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      {/* 斑點 */}
      <circle cx={88} cy={135} r={5} fill={cDark} />
      <circle cx={108} cy={130} r={6} fill={cDark} />
      <circle cx={115} cy={148} r={4} fill={cDark} />
      <circle cx={92} cy={150} r={4} fill={cDark} />
      {/* 手 */}
      <g transform={`rotate(${armSwing} 70 130)`}>
        <ellipse cx={68} cy={140} rx={8} ry={12} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      <g transform={`rotate(${-armSwing} 130 130)`}>
        <ellipse cx={132} cy={140} rx={8} ry={12} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      {/* 長脖子 */}
      <rect x={92} y={70} width={16} height={55} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      <circle cx={97} cy={88} r={4} fill={cDark} />
      <circle cx={103} cy={108} r={4} fill={cDark} />
      {/* 頭 */}
      <ellipse cx={100} cy={55} rx={22} ry={20} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      {/* 耳朵 + 角 */}
      <ellipse cx={82} cy={42} rx={5} ry={8} fill={c} stroke="#1a1a1a" strokeWidth={2} />
      <ellipse cx={118} cy={42} rx={5} ry={8} fill={c} stroke="#1a1a1a" strokeWidth={2} />
      <line x1={92} y1={38} x2={90} y2={28} stroke="#1a1a1a" strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={89} cy={26} r={3} fill={cDark} stroke="#1a1a1a" strokeWidth={2} />
      <line x1={108} y1={38} x2={110} y2={28} stroke="#1a1a1a" strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={111} cy={26} r={3} fill={cDark} stroke="#1a1a1a" strokeWidth={2} />
      {/* 嘴 */}
      <ellipse cx={100} cy={66} rx={10} ry={6} fill="#fff" />
      {/* 五官 */}
      <Eye cx={92} cy={52} mood={mood} size={0.85} />
      <Eye cx={108} cy={52} mood={mood} size={0.85} />
      <Mouth cx={100} cy={66} mood={mood} size={0.6} />
      <Blush cx={84} cy={62} size={0.7} />
      <Blush cx={116} cy={62} size={0.7} />
    </g>
  );
}

// 6. 貓頭鷹
function Owl({ mood, armSwing = 0 }) {
  const c = '#B89878', cDark = '#7A5A3C', cLight = '#E5D2BB', cYellow = '#F5C24E';
  return (
    <g>
      {/* 腳 */}
      <path d="M 85 175 L 80 188 M 85 175 L 88 188 M 85 175 L 92 188"
            stroke={cYellow} strokeWidth={3} strokeLinecap="round" />
      <path d="M 115 175 L 108 188 M 115 175 L 112 188 M 115 175 L 120 188"
            stroke={cYellow} strokeWidth={3} strokeLinecap="round" />
      {/* 身體+頭一體 */}
      <ellipse cx={100} cy={120} rx={50} ry={58} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      {/* 肚 */}
      <ellipse cx={100} cy={135} rx={26} ry={32} fill={cLight} />
      {/* 翅膀 */}
      <g transform={`rotate(${armSwing} 60 110)`}>
        <ellipse cx={56} cy={130} rx={12} ry={26} fill={cDark} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      <g transform={`rotate(${-armSwing} 140 110)`}>
        <ellipse cx={144} cy={130} rx={12} ry={26} fill={cDark} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      {/* 耳簇 */}
      <path d="M 70 75 L 65 55 L 80 70 Z" fill={c} stroke="#1a1a1a" strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M 130 75 L 135 55 L 120 70 Z" fill={c} stroke="#1a1a1a" strokeWidth={2.5} strokeLinejoin="round" />
      {/* 眼圈 */}
      <circle cx={82} cy={92} r={18} fill="#fff" stroke="#1a1a1a" strokeWidth={2.5} />
      <circle cx={118} cy={92} r={18} fill="#fff" stroke="#1a1a1a" strokeWidth={2.5} />
      <Eye cx={82} cy={92} mood={mood} size={1.3} />
      <Eye cx={118} cy={92} mood={mood} size={1.3} />
      {/* 喙 */}
      <path d="M 100 105 L 94 116 L 106 116 Z"
            fill={cYellow} stroke="#1a1a1a" strokeWidth={2.5} strokeLinejoin="round" />
    </g>
  );
}

// 7. 穿山甲
function Pangolin({ mood, armSwing = 0 }) {
  const c = '#C89B6B', cDark = '#8A6A40';
  return (
    <g>
      {/* 腿 */}
      <ellipse cx={80} cy={172} rx={12} ry={14} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      <ellipse cx={120} cy={172} rx={12} ry={14} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      {/* 身體 — 帶鱗片 */}
      <ellipse cx={100} cy={135} rx={42} ry={36} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      {/* 鱗片 */}
      {[
        [85, 115], [105, 112], [125, 118],
        [78, 135], [100, 132], [122, 138],
        [88, 155], [110, 152],
      ].map(([x, y], i) => (
        <path key={i} d={`M ${x} ${y} q -8 -2 -10 6 q 10 4 20 0 q -2 -8 -10 -6 z`}
              fill={cDark} stroke="#1a1a1a" strokeWidth={1.5} />
      ))}
      {/* 手 */}
      <g transform={`rotate(${armSwing} 65 125)`}>
        <ellipse cx={62} cy={135} rx={9} ry={13} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      <g transform={`rotate(${-armSwing} 135 125)`}>
        <ellipse cx={138} cy={135} rx={9} ry={13} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      {/* 頭 */}
      <ellipse cx={100} cy={75} rx={32} ry={30} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      {/* 長嘴 */}
      <ellipse cx={100} cy={92} rx={16} ry={10} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      <circle cx={100} cy={92} r={3} fill="#1a1a1a" />
      {/* 五官 */}
      <Eye cx={88} cy={70} mood={mood} size={0.85} />
      <Eye cx={112} cy={70} mood={mood} size={0.85} />
      <Blush cx={78} cy={88} size={0.8} />
      <Blush cx={122} cy={88} size={0.8} />
    </g>
  );
}

// 8. 老虎
function Tiger({ mood, armSwing = 0 }) {
  const c = '#F5A845', cDark = '#1a1a1a', cLight = '#FFE2B5';
  return (
    <g>
      {/* 腿 */}
      <ellipse cx={80} cy={172} rx={13} ry={15} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      <ellipse cx={120} cy={172} rx={13} ry={15} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      {/* 身體 */}
      <ellipse cx={100} cy={135} rx={40} ry={34} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      <ellipse cx={100} cy={142} rx={22} ry={18} fill={cLight} />
      {/* 條紋 */}
      <path d="M 70 125 q 5 -8 0 -16" fill="none" stroke={cDark} strokeWidth={4} strokeLinecap="round" />
      <path d="M 130 125 q -5 -8 0 -16" fill="none" stroke={cDark} strokeWidth={4} strokeLinecap="round" />
      <path d="M 75 150 q 5 -6 0 -12" fill="none" stroke={cDark} strokeWidth={3.5} strokeLinecap="round" />
      <path d="M 125 150 q -5 -6 0 -12" fill="none" stroke={cDark} strokeWidth={3.5} strokeLinecap="round" />
      {/* 手 */}
      <g transform={`rotate(${armSwing} 65 125)`}>
        <ellipse cx={62} cy={135} rx={10} ry={14} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      <g transform={`rotate(${-armSwing} 135 125)`}>
        <ellipse cx={138} cy={135} rx={10} ry={14} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      {/* 頭 */}
      <circle cx={100} cy={75} r={38} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      {/* 耳朵 */}
      <path d="M 70 45 L 76 32 L 86 50 Z" fill={c} stroke="#1a1a1a" strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M 130 45 L 124 32 L 114 50 Z" fill={c} stroke="#1a1a1a" strokeWidth={2.5} strokeLinejoin="round" />
      {/* 條紋 */}
      <path d="M 100 38 L 96 50 M 100 38 L 104 50" stroke={cDark} strokeWidth={3} strokeLinecap="round" />
      <path d="M 75 65 L 68 60 M 125 65 L 132 60" stroke={cDark} strokeWidth={3} strokeLinecap="round" />
      {/* 嘴部 */}
      <ellipse cx={100} cy={92} rx={18} ry={13} fill={cLight} />
      <path d="M 95 84 L 100 90 L 105 84 Z" fill="#1a1a1a" />
      {/* 五官 */}
      <Eye cx={86} cy={72} mood={mood} />
      <Eye cx={114} cy={72} mood={mood} />
      <Mouth cx={100} cy={97} mood={mood} />
    </g>
  );
}

// 9. 貓
function Cat({ mood, armSwing = 0 }) {
  const c = '#E8D4A8', cDark = '#A8845E', cLight = '#F8EFD9';
  return (
    <g>
      {/* 腿 */}
      <ellipse cx={82} cy={172} rx={12} ry={14} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      <ellipse cx={118} cy={172} rx={12} ry={14} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      {/* 身體 */}
      <ellipse cx={100} cy={135} rx={36} ry={32} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      <ellipse cx={100} cy={142} rx={22} ry={18} fill={cLight} />
      {/* 條紋 */}
      <path d="M 78 130 q 4 -6 0 -12" fill="none" stroke={cDark} strokeWidth={3} strokeLinecap="round" />
      <path d="M 122 130 q -4 -6 0 -12" fill="none" stroke={cDark} strokeWidth={3} strokeLinecap="round" />
      {/* 手 */}
      <g transform={`rotate(${armSwing} 70 125)`}>
        <ellipse cx={68} cy={135} rx={9} ry={13} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      <g transform={`rotate(${-armSwing} 130 125)`}>
        <ellipse cx={132} cy={135} rx={9} ry={13} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      {/* 頭 */}
      <circle cx={100} cy={75} r={36} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      {/* 三角耳朵 */}
      <path d="M 72 42 L 78 22 L 90 42 Z" fill={c} stroke="#1a1a1a" strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M 80 38 L 82 28 L 88 40 Z" fill={cDark} />
      <path d="M 128 42 L 122 22 L 110 42 Z" fill={c} stroke="#1a1a1a" strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M 120 38 L 118 28 L 112 40 Z" fill={cDark} />
      {/* 條紋 */}
      <path d="M 100 38 L 96 50 M 100 38 L 104 50" stroke={cDark} strokeWidth={2.5} strokeLinecap="round" />
      {/* 鼻 */}
      <path d="M 96 86 L 100 92 L 104 86 Z" fill="#FFB3B3" stroke="#1a1a1a" strokeWidth={1.5} strokeLinejoin="round" />
      {/* 嘴 */}
      <path d="M 100 92 Q 95 98 90 95 M 100 92 Q 105 98 110 95"
            fill="none" stroke="#1a1a1a" strokeWidth={2.5} strokeLinecap="round" />
      {/* 鬍鬚 */}
      <path d="M 75 88 L 60 85 M 75 92 L 60 92 M 125 88 L 140 85 M 125 92 L 140 92"
            stroke="#1a1a1a" strokeWidth={1.5} strokeLinecap="round" />
      {/* 五官 */}
      <Eye cx={86} cy={75} mood={mood} />
      <Eye cx={114} cy={75} mood={mood} />
      <Blush cx={76} cy={90} />
      <Blush cx={124} cy={90} />
    </g>
  );
}

// 10. 小狗
function Dog({ mood, armSwing = 0 }) {
  const c = '#E5B888', cDark = '#9B6E40', cLight = '#F8E2C5';
  return (
    <g>
      {/* 腿 */}
      <ellipse cx={82} cy={172} rx={13} ry={15} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      <ellipse cx={118} cy={172} rx={13} ry={15} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      {/* 身體 */}
      <ellipse cx={100} cy={135} rx={38} ry={34} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      <ellipse cx={100} cy={142} rx={22} ry={18} fill={cLight} />
      {/* 手 */}
      <g transform={`rotate(${armSwing} 68 125)`}>
        <ellipse cx={66} cy={135} rx={10} ry={14} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      <g transform={`rotate(${-armSwing} 132 125)`}>
        <ellipse cx={134} cy={135} rx={10} ry={14} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      {/* 頭 */}
      <circle cx={100} cy={78} r={38} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      {/* 垂耳 */}
      <ellipse cx={66} cy={80} rx={12} ry={22} fill={cDark} stroke="#1a1a1a" strokeWidth={2.5} />
      <ellipse cx={134} cy={80} rx={12} ry={22} fill={cDark} stroke="#1a1a1a" strokeWidth={2.5} />
      {/* 嘴部 */}
      <ellipse cx={100} cy={94} rx={18} ry={12} fill={cLight} />
      <ellipse cx={100} cy={87} rx={6} ry={4.5} fill="#1a1a1a" />
      {/* 嘴 */}
      <path d="M 100 94 Q 95 102 88 100 M 100 94 Q 105 102 112 100"
            fill="none" stroke="#1a1a1a" strokeWidth={2.5} strokeLinecap="round" />
      {/* 五官 */}
      <Eye cx={86} cy={75} mood={mood} />
      <Eye cx={114} cy={75} mood={mood} />
      <Blush cx={78} cy={94} />
      <Blush cx={122} cy={94} />
    </g>
  );
}

// 11. 企鵝
function Penguin({ mood, armSwing = 0 }) {
  const c = '#1a1a1a', cWhite = '#fff', cYellow = '#F5C24E';
  return (
    <g>
      {/* 腳 */}
      <path d="M 80 178 Q 75 185 70 185 L 90 185 Z" fill={cYellow} stroke="#1a1a1a" strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M 120 178 Q 125 185 130 185 L 110 185 Z" fill={cYellow} stroke="#1a1a1a" strokeWidth={2.5} strokeLinejoin="round" />
      {/* 身體 */}
      <ellipse cx={100} cy={120} rx={42} ry={58} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      {/* 肚子 */}
      <ellipse cx={100} cy={130} rx={28} ry={42} fill={cWhite} />
      {/* 翅膀 */}
      <g transform={`rotate(${armSwing} 60 110)`}>
        <ellipse cx={58} cy={120} rx={10} ry={26} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      <g transform={`rotate(${-armSwing} 140 110)`}>
        <ellipse cx={142} cy={120} rx={10} ry={26} fill={c} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      {/* 喙 */}
      <path d="M 100 88 L 92 96 L 108 96 Z" fill={cYellow} stroke="#1a1a1a" strokeWidth={2.5} strokeLinejoin="round" />
      {/* 五官 */}
      <Eye cx={88} cy={80} mood={mood} />
      <Eye cx={112} cy={80} mood={mood} />
      <Blush cx={78} cy={92} />
      <Blush cx={122} cy={92} />
    </g>
  );
}

// 12. 浣熊
function Raccoon({ mood, armSwing = 0 }) {
  const c = '#9CA0A8', cDark = '#3a3a3a', cLight = '#D4D8DD';
  return (
    <g>
      {/* 腿 */}
      <ellipse cx={82} cy={172} rx={12} ry={15} fill={cDark} stroke="#1a1a1a" strokeWidth={2.5} />
      <ellipse cx={118} cy={172} rx={12} ry={15} fill={cDark} stroke="#1a1a1a" strokeWidth={2.5} />
      {/* 身體 */}
      <ellipse cx={100} cy={135} rx={38} ry={34} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      <ellipse cx={100} cy={142} rx={22} ry={18} fill={cLight} />
      {/* 手 */}
      <g transform={`rotate(${armSwing} 68 125)`}>
        <ellipse cx={66} cy={135} rx={10} ry={14} fill={cDark} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      <g transform={`rotate(${-armSwing} 132 125)`}>
        <ellipse cx={134} cy={135} rx={10} ry={14} fill={cDark} stroke="#1a1a1a" strokeWidth={2.5} />
      </g>
      {/* 頭 */}
      <circle cx={100} cy={75} r={36} fill={c} stroke="#1a1a1a" strokeWidth={3} />
      {/* 三角耳朵 */}
      <path d="M 72 45 L 78 28 L 88 45 Z" fill={c} stroke="#1a1a1a" strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M 128 45 L 122 28 L 112 45 Z" fill={c} stroke="#1a1a1a" strokeWidth={2.5} strokeLinejoin="round" />
      {/* 黑眼罩 */}
      <ellipse cx={86} cy={75} rx={14} ry={10} fill={cDark} />
      <ellipse cx={114} cy={75} rx={14} ry={10} fill={cDark} />
      {/* 鼻嘴 */}
      <ellipse cx={100} cy={92} rx={14} ry={9} fill={cLight} />
      <ellipse cx={100} cy={87} rx={4} ry={3} fill="#1a1a1a" />
      {/* 五官 */}
      <Eye cx={86} cy={75} mood={mood} size={0.8} />
      <Eye cx={114} cy={75} mood={mood} size={0.8} />
      <Mouth cx={100} cy={96} mood={mood} size={0.7} />
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// 動物資料庫
// ─────────────────────────────────────────────────────────────
const ANIMALS = [
  { id: 'bear',     name: '小熊',   render: Bear },
  { id: 'rabbit',   name: '兔兔',   render: Rabbit },
  { id: 'frog',     name: '青蛙',   render: Frog },
  { id: 'elephant', name: '小象',   render: Elephant },
  { id: 'giraffe',  name: '長頸鹿', render: Giraffe },
  { id: 'owl',      name: '貓頭鷹', render: Owl },
  { id: 'pangolin', name: '穿山甲', render: Pangolin },
  { id: 'tiger',    name: '小老虎', render: Tiger },
  { id: 'cat',      name: '小貓',   render: Cat },
  { id: 'dog',      name: '小狗',   render: Dog },
  { id: 'penguin',  name: '企鵝',   render: Penguin },
  { id: 'raccoon',  name: '浣熊',   render: Raccoon },
];

// ─────────────────────────────────────────────────────────────
// Pet 渲染元件 — 含完整動畫
// ─────────────────────────────────────────────────────────────
// 裝扮在 SVG 座標（200×200 viewBox）裡的位置
const COSTUME_SVG_Y = { head: 38, face: 80, neck: 110 };

function Pet({ animalId = 'bear', mood = 'normal', size = 220, dirty = false, sleeping = false, action = null, walking = false, facing = 1, costume = null }) {
  // action: null | 'wave' | 'jump' | 'dance' | 'cheer' | 'eat' | 'play'
  const animal = ANIMALS.find(a => a.id === animalId) || ANIMALS[0];
  const Render = animal.render;

  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    let raf;
    const start = performance.now();
    const loop = (now) => {
      setT((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // 行為動畫
  let bounceY = 0;
  let armSwing = 0;
  let bodyTilt = 0;
  let bodyScale = 1;

  if (sleeping || mood === 'sleepy') {
    // 緩慢呼吸
    bodyScale = 1 + Math.sin(t * 1.5) * 0.025;
  } else if (action === 'wave') {
    armSwing = 35 + Math.sin(t * 10) * 25;
    bounceY = Math.sin(t * 5) * 2;
  } else if (action === 'jump') {
    bounceY = -Math.abs(Math.sin(t * 6)) * 25;
    armSwing = Math.sin(t * 12) * 30;
  } else if (action === 'dance') {
    bounceY = Math.abs(Math.sin(t * 8)) * -10;
    armSwing = Math.sin(t * 8) * 40;
    bodyTilt = Math.sin(t * 4) * 8;
  } else if (action === 'cheer') {
    armSwing = -50 + Math.sin(t * 14) * 8;
    bounceY = Math.sin(t * 8) * 4;
  } else if (action === 'eat') {
    bounceY = Math.sin(t * 6) * 2;
    armSwing = 25 + Math.sin(t * 6) * 8;
  } else if (walking) {
    bounceY = Math.abs(Math.sin(t * 6)) * -4;
    armSwing = Math.sin(t * 6) * 22;
    bodyTilt = Math.sin(t * 6) * 2;
  } else if (mood === 'happy') {
    bounceY = Math.abs(Math.sin(t * 4)) * -8;
    armSwing = Math.sin(t * 8) * 18;
  } else if (mood === 'sad') {
    bodyTilt = Math.sin(t * 1) * 1.5;
    bounceY = 2;
  } else if (mood === 'sick') {
    bodyTilt = Math.sin(t * 2.5) * 3;
  } else if (mood === 'scared') {
    bodyTilt = Math.sin(t * 14) * 2;
  } else if (mood === 'normal') {
    bounceY = Math.sin(t * 2) * 2;
    armSwing = Math.sin(t * 2) * 4;
    bodyScale = 1 + Math.sin(t * 2) * 0.015;
  } else {
    bounceY = Math.sin(t * 2.2) * 2.5;
    armSwing = Math.sin(t * 2.2) * 5;
  }

  return (
    <svg viewBox="0 0 200 200" width={size} height={size} style={{ overflow: 'visible' }}>
      <g style={{
        transform: `translate(0px, ${bounceY}px) rotate(${bodyTilt}deg) scale(${bodyScale * facing}, ${bodyScale})`,
        transformOrigin: '100px 130px',
      }}>
        <Render mood={sleeping ? 'sleepy' : mood} armSwing={armSwing} />
        {/* 裝扮：跟動物同一個 g，一起上下動 */}
        {costume && (() => {
          const c = (window.COSTUMES || []).find(x => x.id === costume);
          if (!c) return null;
          const y = COSTUME_SVG_Y[c.pos] || 38;
          return (
            <text x={100} y={y} textAnchor="middle" fontSize={22}
              style={{ userSelect: 'none', pointerEvents: 'none' }}>
              {c.emoji}
            </text>
          );
        })()}
      </g>
      {/* 髒髒 */}
      {dirty && (
        <g>
          <circle cx={70} cy={150} r={4} fill="#7A5A3C" />
          <circle cx={135} cy={160} r={3} fill="#7A5A3C" />
          <circle cx={120} cy={148} r={3.5} fill="#7A5A3C" />
          <path d="M 60 100 q 2 -3 5 -1" stroke="#7A5A3C" strokeWidth={2} fill="none" strokeLinecap="round" />
        </g>
      )}
      {/* 睡覺 ZZZ */}
      {sleeping && (
        <g style={{ transform: `translate(${Math.sin(t) * 3}px, ${-Math.sin(t * 0.5) * 4}px)` }}>
          <text x={140} y={50} fontSize={20} fontWeight={700} fill="#1a1a1a" fontFamily="system-ui">Z</text>
          <text x={155} y={35} fontSize={14} fontWeight={700} fill="#1a1a1a" fontFamily="system-ui">z</text>
          <text x={165} y={22} fontSize={10} fontWeight={700} fill="#1a1a1a" fontFamily="system-ui">z</text>
        </g>
      )}
    </svg>
  );
}

// 蛋（成長階段第一階段）
function Egg({ size = 220, cracked = false }) {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    let raf;
    const start = performance.now();
    const loop = (now) => { setT((now - start) / 1000); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const wobble = Math.sin(t * 3) * 4;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size}>
      <g style={{ transform: `rotate(${wobble}deg)`, transformOrigin: '100px 140px' }}>
        <ellipse cx={100} cy={120} rx={50} ry={62} fill="#FFF4D4" stroke="#1a1a1a" strokeWidth={3} />
        <circle cx={82} cy={100} r={8} fill="#F5C24E" />
        <circle cx={120} cy={130} r={6} fill="#F5C24E" />
        <circle cx={92} cy={150} r={5} fill="#F5C24E" />
        {cracked && (
          <path d="M 75 95 L 85 105 L 78 115 L 90 125"
                fill="none" stroke="#1a1a1a" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        )}
      </g>
    </svg>
  );
}

Object.assign(window, { ANIMALS, Pet, Egg, Eye, Mouth, Blush });
