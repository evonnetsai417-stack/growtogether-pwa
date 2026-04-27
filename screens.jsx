// screens.jsx — 各種子畫面（家長模式、商店、迷你遊戲、餵食、刷牙、醫生）

// ─────────────────────────────────────────────────────────────
// 預設好行為清單（可自訂）
// ─────────────────────────────────────────────────────────────
const DEFAULT_GOOD_DEEDS = [
  { id: 'd1', emoji: '🍽️', text: '幫忙收碗盤',         points: 1 },
  { id: 'd2', emoji: '🧹', text: '掃地或拖地',         points: 2 },
  { id: 'd3', emoji: '🧦', text: '自己摺衣服',         points: 1 },
  { id: 'd4', emoji: '📚', text: '主動完成功課',       points: 2 },
  { id: 'd5', emoji: '🦷', text: '自己刷牙洗臉',       points: 1 },
  { id: 'd8', emoji: '🤝', text: '對人有禮貌',         points: 1 },
  { id: 'd9', emoji: '😊', text: '幫助弟弟妹妹',       points: 2 },
  { id: 'd10', emoji: '🌱', text: '幫忙澆花/做家事',   points: 1 },
  { id: 'd11', emoji: '🧠', text: '看書 30 分鐘',      points: 2 },
  { id: 'd12', emoji: '💪', text: '運動 30 分鐘',      points: 2 },
];

// ─────────────────────────────────────────────────────────────
// 商店物品
// ─────────────────────────────────────────────────────────────
const SHOP_ITEMS = {
  food: [
    { id: 'apple',   emoji: '🍎', name: '蘋果',     price: 2, hunger: 20 },
    { id: 'carrot',  emoji: '🥕', name: '紅蘿蔔',   price: 2, hunger: 20 },
    { id: 'rice',    emoji: '🍚', name: '飯糰',     price: 3, hunger: 35 },
    { id: 'fish',    emoji: '🐟', name: '魚',       price: 4, hunger: 40 },
    { id: 'cake',    emoji: '🍰', name: '蛋糕',     price: 5, hunger: 25, fun: 15 },
    { id: 'milk',    emoji: '🥛', name: '牛奶',     price: 2, hunger: 15 },
  ],
  toy: [
    { id: 'ball',   emoji: '⚽', name: '球',         price: 3, fun: 25 },
    { id: 'block',  emoji: '🧩', name: '積木',       price: 4, fun: 30 },
    { id: 'kite',   emoji: '🪁', name: '風箏',       price: 5, fun: 35 },
    { id: 'drum',   emoji: '🥁', name: '小鼓',       price: 4, fun: 30 },
  ],
  care: [
    { id: 'soap',     emoji: '🧼', name: '肥皂',     price: 2, clean: 50 },
    { id: 'brush',    emoji: '🪥', name: '牙刷',     price: 2, clean: 30 },
    { id: 'shampoo',  emoji: '🛁', name: '沐浴乳',   price: 3, clean: 60 },
    { id: 'medicine', emoji: '💊', name: '藥',       price: 5, health: 60 },
    { id: 'bandage',  emoji: '🩹', name: 'OK繃',    price: 3, health: 30 },
  ],
};

// ─────────────────────────────────────────────────────────────
// 商店畫面
// ─────────────────────────────────────────────────────────────
function ShopScreen({ coins, onBuy, onClose }) {
  const [tab, setTab] = React.useState('food');
  const items = SHOP_ITEMS[tab];
  const tabs = [
    { id: 'food', label: '食物', icon: '🍎', color: COLORS.primary },
    { id: 'toy',  label: '玩具', icon: '🎾', color: COLORS.blue },
    { id: 'care', label: '清潔', icon: '🧼', color: COLORS.secondary },
  ];

  return (
    <Modal title="🏪 小商店" onClose={onClose} color={COLORS.primary}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, fontFamily: '"Noto Sans TC", system-ui' }}>
          用金幣買東西照顧寵物～
        </div>
        <CoinBadge icon="🪙" value={coins} />
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: '8px 4px',
            background: tab === t.id ? t.color : '#fff',
            border: '2.5px solid #1a1a1a',
            borderRadius: 12,
            fontWeight: 800, fontSize: 13,
            fontFamily: '"Noto Sans TC", system-ui',
            cursor: 'pointer',
            boxShadow: tab === t.id ? '0 2px 0 #1a1a1a' : '0 3px 0 #1a1a1a',
            transform: tab === t.id ? 'translateY(1px)' : 'none',
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {items.map(item => {
          const canBuy = coins >= item.price;
          return (
            <div key={item.id} style={{
              background: '#fff',
              border: '2.5px solid #1a1a1a',
              borderRadius: 14,
              padding: '10px 8px 8px',
              textAlign: 'center',
              boxShadow: '0 3px 0 #1a1a1a',
            }}>
              <div style={{ fontSize: 36, lineHeight: 1, marginBottom: 4 }}>{item.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6, fontFamily: '"Noto Sans TC", system-ui' }}>{item.name}</div>
              <button onClick={() => canBuy && onBuy(tab, item)} disabled={!canBuy} style={{
                width: '100%',
                background: canBuy ? '#F5C24E' : '#D5D5D5',
                border: '2px solid #1a1a1a', borderRadius: 999,
                padding: '4px 0', fontWeight: 800, fontSize: 13,
                cursor: canBuy ? 'pointer' : 'not-allowed',
                fontFamily: '"Noto Sans TC", system-ui',
                opacity: canBuy ? 1 : 0.7,
              }}>🪙 {item.price}</button>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// 背包畫面（有的物品）
// ─────────────────────────────────────────────────────────────
function InventoryScreen({ inventory, onUse, onClose, type, title }) {
  // type: food / toy / care
  const items = SHOP_ITEMS[type];
  const owned = items.filter(it => (inventory[it.id] || 0) > 0);

  return (
    <Modal title={title} onClose={onClose} color={type === 'food' ? COLORS.primary : type === 'toy' ? COLORS.blue : COLORS.secondary}>
      {owned.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 24, fontFamily: '"Noto Sans TC", system-ui' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📦</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#666' }}>
            背包是空的<br/>去商店買些東西吧！
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {owned.map(item => (
            <div key={item.id} style={{
              background: '#fff',
              border: '2.5px solid #1a1a1a',
              borderRadius: 14,
              padding: '10px 8px',
              textAlign: 'center',
              boxShadow: '0 3px 0 #1a1a1a',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: -6, right: -6,
                background: COLORS.danger, color: '#fff',
                border: '2px solid #1a1a1a', borderRadius: '50%',
                minWidth: 24, height: 24,
                fontSize: 12, fontWeight: 900,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{inventory[item.id]}</div>
              <div style={{ fontSize: 36, lineHeight: 1, marginBottom: 4 }}>{item.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 6, fontFamily: '"Noto Sans TC", system-ui' }}>{item.name}</div>
              <button onClick={() => onUse(type, item)} style={{
                width: '100%',
                background: COLORS.secondary,
                border: '2px solid #1a1a1a', borderRadius: 999,
                padding: '4px 0', fontWeight: 800, fontSize: 12,
                cursor: 'pointer',
                fontFamily: '"Noto Sans TC", system-ui',
              }}>使用</button>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// 家長模式 — 獎勵點數
// ─────────────────────────────────────────────────────────────
function ParentScreen({ stars, xp = 0, stage = 0, deeds, onClose, onAddPoints, onAddDeed, onRemoveDeed }) {
  const [showAdd, setShowAdd] = React.useState(false);
  const [newText, setNewText] = React.useState('');
  const [newPoints, setNewPoints] = React.useState(1);
  const [unlocked, setUnlocked] = React.useState(false);
  const [pin, setPin] = React.useState('');
  const [pinError, setPinError] = React.useState(false);

  function tryUnlock() {
    if (pin === '1234') {
      setUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPin('');
    }
  }

  if (!unlocked) {
    return (
      <Modal title="👨‍👩‍👧 家長模式" onClose={onClose} color={COLORS.purple}>
        <div style={{ textAlign: 'center', padding: 12, fontFamily: '"Noto Sans TC", system-ui' }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🔒</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#666', marginBottom: 14 }}>
            請輸入家長密碼
          </div>
          <input
            type="password"
            value={pin}
            onChange={e => { setPin(e.target.value); setPinError(false); }}
            onKeyDown={e => e.key === 'Enter' && tryUnlock()}
            placeholder="••••"
            maxLength={8}
            style={{
              width: '100%', padding: '10px 14px',
              border: `2.5px solid ${pinError ? '#E85C5C' : '#1a1a1a'}`,
              borderRadius: 12,
              fontSize: 22, fontWeight: 800, textAlign: 'center',
              boxSizing: 'border-box', marginBottom: 6,
              fontFamily: 'system-ui',
              background: pinError ? '#FFF0F0' : '#fff',
            }}
          />
          {pinError && (
            <div style={{ fontSize: 12, color: '#E85C5C', fontWeight: 700, marginBottom: 10 }}>
              密碼錯誤，請再試一次
            </div>
          )}
          {!pinError && <div style={{ marginBottom: 14 }} />}
          <ChunkyButton fullWidth color={COLORS.purple} onClick={tryUnlock}>
            進入家長模式
          </ChunkyButton>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="👨‍👩‍👧 家長模式" onClose={onClose} color={COLORS.purple}>
      <div style={{ fontFamily: '"Noto Sans TC", system-ui' }}>
        {/* 點數摘要 */}
        <div style={{
          background: '#fff', border: '2.5px solid #1a1a1a',
          borderRadius: 16, padding: 12, marginBottom: 14,
          boxShadow: '0 3px 0 #1a1a1a',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, color: '#666', fontWeight: 700 }}>目前累積</div>
              <div style={{ fontSize: 28, fontWeight: 900 }}>⭐ {stars}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: '#666', fontWeight: 700 }}>距離下個金幣</div>
              <div style={{ fontSize: 14, fontWeight: 800 }}>還差 {10 - (stars % 10)} ⭐</div>
            </div>
          </div>

          {/* XP 成長進度 */}
          {stage < 2 && (
            <div style={{ marginTop: 10, padding: '8px 10px', background: '#F9F4FF', borderRadius: 10, border: '2px solid #B89FE8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#7A5ABF' }}>
                  {stage === 0 ? '🥚 孵化進度' : '🌱 成長進度'}
                </span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#7A5ABF' }}>
                  {xp} / {stage === 0 ? 50 : 300} XP
                </span>
              </div>
              <div style={{ height: 10, borderRadius: 999, background: '#E8D5FF', border: '1.5px solid #B89FE8', overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.min(100, Math.round(xp / (stage === 0 ? 50 : 300) * 100))}%`,
                  height: '100%', background: '#B89FE8', transition: 'width 0.5s',
                }} />
              </div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 4, fontWeight: 600 }}>
                每給 1 ⭐ 獎勵 → +5 XP　餵食 +2　玩耍 +3　清潔 +1
              </div>
            </div>
          )}

          <div style={{
            marginTop: 10, height: 14, borderRadius: 999,
            background: '#F0E5D0', border: '2px solid #1a1a1a',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${(stars % 10) * 10}%`, height: '100%',
              background: COLORS.purple,
              transition: 'width 0.4s',
            }} />
          </div>
          <div style={{ fontSize: 11, color: '#666', marginTop: 6, textAlign: 'center', fontWeight: 600 }}>
            每 10 ⭐ 自動換成 1 🪙 金幣
          </div>
        </div>

        {/* 行為清單 */}
        <div style={{
          fontSize: 14, fontWeight: 800, marginBottom: 8,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>👍 好行為清單</span>
          <button onClick={() => setShowAdd(true)} style={{
            background: COLORS.secondary, border: '2px solid #1a1a1a',
            borderRadius: 999, padding: '3px 10px',
            fontSize: 12, fontWeight: 800, cursor: 'pointer',
            fontFamily: '"Noto Sans TC", system-ui',
          }}>+ 新增</button>
        </div>

        {showAdd && (
          <div style={{
            background: '#fff', border: '2.5px dashed #1a1a1a',
            borderRadius: 12, padding: 10, marginBottom: 10,
          }}>
            <input
              value={newText}
              onChange={e => setNewText(e.target.value)}
              placeholder="例：自己刷牙"
              style={{
                width: '100%', padding: '6px 10px',
                border: '2px solid #1a1a1a', borderRadius: 8,
                fontSize: 13, marginBottom: 6, boxSizing: 'border-box',
                fontFamily: '"Noto Sans TC", system-ui',
              }}
            />
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>點數：</span>
              {[1, 2, 3, 5].map(p => (
                <button key={p} onClick={() => setNewPoints(p)} style={{
                  background: newPoints === p ? COLORS.purple : '#fff',
                  border: '2px solid #1a1a1a', borderRadius: 8,
                  padding: '3px 8px', fontWeight: 800, fontSize: 12,
                  cursor: 'pointer', fontFamily: '"Noto Sans TC", system-ui',
                }}>{p}⭐</button>
              ))}
              <button onClick={() => {
                if (newText.trim()) {
                  onAddDeed({ id: 'd' + Date.now(), emoji: '✨', text: newText.trim(), points: newPoints });
                  setNewText(''); setNewPoints(1); setShowAdd(false);
                }
              }} style={{
                marginLeft: 'auto',
                background: COLORS.secondary,
                border: '2px solid #1a1a1a', borderRadius: 8,
                padding: '4px 10px', fontWeight: 800, fontSize: 12,
                cursor: 'pointer', fontFamily: '"Noto Sans TC", system-ui',
              }}>確定</button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {deeds.map(d => (
            <div key={d.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#fff', border: '2.5px solid #1a1a1a',
              borderRadius: 12, padding: '8px 10px',
              boxShadow: '0 2px 0 #1a1a1a',
            }}>
              <div style={{ fontSize: 22 }}>{d.emoji}</div>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 700 }}>{d.text}</div>
              <button onClick={() => onAddPoints(d.points, d.text)} style={{
                background: COLORS.purple, color: '#fff',
                border: '2px solid #1a1a1a', borderRadius: 999,
                padding: '5px 12px', fontWeight: 800, fontSize: 13,
                cursor: 'pointer',
                fontFamily: '"Noto Sans TC", system-ui',
                boxShadow: '0 2px 0 #1a1a1a',
              }}>+{d.points}⭐</button>
              {d.id.startsWith('d1') === false && d.id.length > 4 && (
                <button onClick={() => onRemoveDeed(d.id)} style={{
                  background: 'transparent', border: 'none',
                  fontSize: 14, cursor: 'pointer',
                  color: '#999',
                }}>✕</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// 迷你遊戲：點點抓蝴蝶
// ─────────────────────────────────────────────────────────────
function MiniGame({ onClose, onWin }) {
  const [score, setScore] = React.useState(0);
  const [time, setTime] = React.useState(20);
  const [butterflies, setButterflies] = React.useState([]);
  const [running, setRunning] = React.useState(true);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setTime(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  React.useEffect(() => {
    if (time <= 0 && running) {
      setRunning(false);
      setDone(true);
      const reward = Math.floor(score / 3);
      if (reward > 0) onWin(reward);
    }
  }, [time, running, score, onWin]);

  React.useEffect(() => {
    if (!running) return;
    const spawner = setInterval(() => {
      setButterflies(b => {
        if (b.length > 5) return b;
        return [...b, {
          id: Date.now() + Math.random(),
          x: 20 + Math.random() * 240,
          y: 50 + Math.random() * 280,
          color: ['#FFB3CC', '#88C467', '#5BA8E8', '#F5C24E', '#B89FE8'][Math.floor(Math.random() * 5)],
          life: 0,
        }];
      });
    }, 700);
    return () => clearInterval(spawner);
  }, [running]);

  React.useEffect(() => {
    if (!running) return;
    const tick = setInterval(() => {
      setButterflies(b => b.map(bf => ({ ...bf, life: bf.life + 1 })).filter(bf => bf.life < 4));
    }, 800);
    return () => clearInterval(tick);
  }, [running]);

  return (
    <Modal title="🦋 抓蝴蝶遊戲" onClose={onClose} color={COLORS.pink}>
      <div style={{ fontFamily: '"Noto Sans TC", system-ui' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 800 }}>分數：<span style={{ color: COLORS.danger }}>{score}</span></div>
          <div style={{ fontSize: 14, fontWeight: 800 }}>時間：<span style={{ color: COLORS.blue }}>{Math.max(0, time)} 秒</span></div>
        </div>
        <div style={{
          position: 'relative',
          width: '100%', height: 360,
          background: 'linear-gradient(180deg, #C8E8F5 0%, #E8F8D5 100%)',
          border: '3px solid #1a1a1a',
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: '0 3px 0 #1a1a1a',
        }}>
          {/* 草地 */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: 60, background: '#88C467',
            borderTop: '3px solid #1a1a1a',
          }} />
          {/* 雲朵 */}
          <div style={{ position: 'absolute', top: 20, left: 30, fontSize: 28 }}>☁️</div>
          <div style={{ position: 'absolute', top: 40, right: 30, fontSize: 24 }}>☁️</div>
          <div style={{ position: 'absolute', bottom: 50, left: 40, fontSize: 22 }}>🌸</div>
          <div style={{ position: 'absolute', bottom: 50, right: 50, fontSize: 22 }}>🌼</div>

          {butterflies.map(bf => (
            <button key={bf.id} onClick={() => {
              setScore(s => s + 1);
              setButterflies(b => b.filter(x => x.id !== bf.id));
            }} style={{
              position: 'absolute',
              left: bf.x, top: bf.y,
              width: 44, height: 44,
              border: 'none', background: 'transparent',
              cursor: 'pointer', padding: 0,
              animation: 'butterfly 0.5s infinite alternate',
            }}>
              <svg viewBox="0 0 50 50" width="44" height="44">
                <ellipse cx="15" cy="20" rx="12" ry="10" fill={bf.color} stroke="#1a1a1a" strokeWidth="2.5" />
                <ellipse cx="35" cy="20" rx="12" ry="10" fill={bf.color} stroke="#1a1a1a" strokeWidth="2.5" />
                <ellipse cx="15" cy="32" rx="9" ry="7" fill={bf.color} stroke="#1a1a1a" strokeWidth="2.5" />
                <ellipse cx="35" cy="32" rx="9" ry="7" fill={bf.color} stroke="#1a1a1a" strokeWidth="2.5" />
                <ellipse cx="25" cy="25" rx="2.5" ry="14" fill="#1a1a1a" />
              </svg>
            </button>
          ))}

          {done && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(255,255,255,0.92)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 12,
            }}>
              <div style={{ fontSize: 44 }}>🎉</div>
              <div style={{ fontSize: 22, fontWeight: 900 }}>遊戲結束！</div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>抓到 {score} 隻蝴蝶</div>
              <div style={{
                background: COLORS.primary, padding: '8px 16px',
                border: '3px solid #1a1a1a', borderRadius: 999,
                fontSize: 16, fontWeight: 900,
                boxShadow: '0 3px 0 #1a1a1a',
              }}>+{Math.floor(score / 3)} 🪙 獎勵</div>
              <ChunkyButton color={COLORS.primary} onClick={onClose}>回家</ChunkyButton>
            </div>
          )}
        </div>
        <div style={{
          marginTop: 8, fontSize: 12, color: '#666',
          textAlign: 'center', fontWeight: 700,
        }}>
          點擊蝴蝶得 1 分 · 每 3 分換 1 金幣
        </div>
      </div>
    </Modal>
  );
}

Object.assign(window, {
  DEFAULT_GOOD_DEEDS, SHOP_ITEMS,
  ShopScreen, InventoryScreen, ParentScreen, MiniGame,
});
