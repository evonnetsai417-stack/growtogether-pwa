// minigames.jsx — 三個迷你遊戲：接水果、記憶翻牌、節奏跳跳

// ─────────────────────────────────────────────────────────────
// 1. 接水果遊戲
// ─────────────────────────────────────────────────────────────
function CatchFruitGame({ onClose, onWin }) {
  const FRUITS = ['🍎','🍊','🍌','🍓','🍇','🍑','🥝','🍉'];
  const BAD = ['💣','🌶️'];
  const W = 300, H = 360;
  const [score, setScore] = React.useState(0);
  const [time, setTime] = React.useState(25);
  const [items, setItems] = React.useState([]);
  const [basketX, setBasketX] = React.useState(W / 2);
  const [running, setRunning] = React.useState(true);
  const [done, setDone] = React.useState(false);
  const [hit, setHit] = React.useState(null);

  React.useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setTime(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  React.useEffect(() => {
    if (time <= 0 && running) {
      setRunning(false); setDone(true);
      const r = Math.max(0, Math.floor(score / 3));
      if (r > 0) onWin(r);
    }
  }, [time, running, score, onWin]);

  React.useEffect(() => {
    if (!running) return;
    const sp = setInterval(() => {
      const isBad = Math.random() < 0.18;
      setItems(it => [...it, {
        id: Date.now() + Math.random(),
        x: 30 + Math.random() * (W - 60),
        y: -30,
        emoji: isBad ? BAD[Math.floor(Math.random()*BAD.length)] : FRUITS[Math.floor(Math.random()*FRUITS.length)],
        bad: isBad,
        speed: 2 + Math.random() * 1.5,
      }]);
    }, 600);
    return () => clearInterval(sp);
  }, [running]);

  React.useEffect(() => {
    if (!running) return;
    const tk = setInterval(() => {
      setItems(it => {
        const next = [];
        for (const x of it) {
          const ny = x.y + x.speed;
          if (ny > H - 30 && Math.abs(x.x - basketX) < 40) {
            // caught
            if (x.bad) {
              setScore(s => Math.max(0, s - 2));
              setHit('bad');
            } else {
              setScore(s => s + 1);
              setHit('good');
            }
            setTimeout(() => setHit(null), 200);
            continue;
          }
          if (ny > H) continue;
          next.push({ ...x, y: ny });
        }
        return next;
      });
    }, 30);
    return () => clearInterval(tk);
  }, [running, basketX]);

  function move(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.touches ? e.touches[0].clientX : e.clientX) - rect.left);
    setBasketX(Math.max(30, Math.min(W - 30, x)));
  }

  return (
    <Modal title="🍎 接水果" onClose={onClose} color={COLORS.primary}>
      <div style={{ fontFamily: '"Noto Sans TC", system-ui' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 800 }}>分數：<span style={{ color: COLORS.danger }}>{score}</span></div>
          <div style={{ fontSize: 14, fontWeight: 800 }}>時間：<span style={{ color: COLORS.blue }}>{Math.max(0,time)} 秒</span></div>
        </div>
        <div
          onMouseMove={move} onTouchMove={move}
          style={{
            position: 'relative', width: '100%', height: H,
            background: 'linear-gradient(180deg, #C8E8F5 0%, #FFE5B4 100%)',
            border: '3px solid #1a1a1a', borderRadius: 14,
            overflow: 'hidden', cursor: 'pointer',
            boxShadow: '0 3px 0 #1a1a1a',
            touchAction: 'none',
          }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, background: '#88C467', borderTop: '3px solid #1a1a1a' }} />
          {items.map(it => (
            <div key={it.id} style={{
              position: 'absolute', left: it.x - 16, top: it.y,
              fontSize: 28, transition: 'transform 0.05s linear',
              transform: `rotate(${(it.y * 2) % 360}deg)`,
            }}>{it.emoji}</div>
          ))}
          {/* basket */}
          <div style={{
            position: 'absolute', bottom: 30, left: basketX - 32,
            width: 64, height: 40,
            transition: hit ? 'transform 0.15s' : 'none',
            transform: hit ? `scale(1.15) translateY(${hit === 'bad' ? '4px' : '-4px'})` : 'scale(1)',
          }}>
            <div style={{ fontSize: 44, lineHeight: '40px', textAlign: 'center' }}>🧺</div>
          </div>
          {done && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.92)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <div style={{ fontSize: 44 }}>🎉</div>
              <div style={{ fontSize: 22, fontWeight: 900 }}>遊戲結束！</div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>接到 {score} 個</div>
              <div style={{ background: COLORS.primary, padding: '8px 16px', border: '3px solid #1a1a1a',
                borderRadius: 999, fontSize: 16, fontWeight: 900, boxShadow: '0 3px 0 #1a1a1a' }}>
                +{Math.max(0,Math.floor(score/3))} 🪙</div>
              <ChunkyButton color={COLORS.primary} onClick={onClose}>回家</ChunkyButton>
            </div>
          )}
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: '#666', textAlign: 'center', fontWeight: 700 }}>
          👆 滑動籃子接水果 · 小心炸彈！每 3 分換 1 金幣
        </div>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. 記憶翻牌
// ─────────────────────────────────────────────────────────────
function MemoryGame({ onClose, onWin }) {
  const EMOJIS = ['🐻','🐰','🐸','🐯','🦊','🐼','🦁','🐵'];
  const [cards, setCards] = React.useState(() => {
    const pairs = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((e, i) => ({ id: i, emoji: e, flipped: false, matched: false }));
    return pairs;
  });
  const [picked, setPicked] = React.useState([]);
  const [moves, setMoves] = React.useState(0);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (cards.every(c => c.matched) && !done) {
      setDone(true);
      const reward = Math.max(2, 12 - Math.floor(moves / 2));
      onWin(reward);
    }
  }, [cards, done, moves, onWin]);

  function pick(i) {
    if (cards[i].flipped || cards[i].matched || picked.length >= 2) return;
    const newCards = [...cards];
    newCards[i] = { ...newCards[i], flipped: true };
    setCards(newCards);
    const nextPicked = [...picked, i];
    setPicked(nextPicked);
    if (nextPicked.length === 2) {
      setMoves(m => m + 1);
      setTimeout(() => {
        setCards(c => {
          const [a, b] = nextPicked;
          if (c[a].emoji === c[b].emoji) {
            return c.map((card, idx) => idx === a || idx === b ? { ...card, matched: true } : card);
          }
          return c.map((card, idx) => idx === a || idx === b ? { ...card, flipped: false } : card);
        });
        setPicked([]);
      }, 700);
    }
  }

  const reward = Math.max(2, 12 - Math.floor(moves / 2));
  const matched = cards.filter(c => c.matched).length / 2;

  return (
    <Modal title="🧠 記憶翻牌" onClose={onClose} color={COLORS.purple}>
      <div style={{ fontFamily: '"Noto Sans TC", system-ui' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 800 }}>配對：{matched}/8</div>
          <div style={{ fontSize: 13, fontWeight: 800 }}>步數：{moves}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {cards.map((c, i) => (
            <button key={c.id} onClick={() => pick(i)} disabled={c.matched} style={{
              aspectRatio: '1', fontSize: 32,
              background: c.flipped || c.matched ? '#fff' : COLORS.purple,
              border: '2.5px solid #1a1a1a', borderRadius: 12,
              cursor: c.matched ? 'default' : 'pointer',
              boxShadow: c.flipped ? '0 1px 0 #1a1a1a' : '0 3px 0 #1a1a1a',
              transform: c.flipped ? 'translateY(2px)' : 'none',
              opacity: c.matched ? 0.5 : 1,
              padding: 0,
            }}>{c.flipped || c.matched ? c.emoji : '?'}</button>
          ))}
        </div>
        {done && (
          <div style={{ marginTop: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 6 }}>🎉</div>
            <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>全部配對成功！</div>
            <div style={{ display: 'inline-block', background: COLORS.primary, padding: '8px 16px',
              border: '3px solid #1a1a1a', borderRadius: 999, fontSize: 16, fontWeight: 900,
              boxShadow: '0 3px 0 #1a1a1a', marginBottom: 10 }}>+{reward} 🪙</div>
            <div><ChunkyButton color={COLORS.primary} onClick={onClose}>回家</ChunkyButton></div>
          </div>
        )}
        <div style={{ marginTop: 10, fontSize: 12, color: '#666', textAlign: 'center', fontWeight: 700 }}>
          越少步數，獎勵越多金幣
        </div>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. 節奏跳跳（青蛙跳荷葉）
// ─────────────────────────────────────────────────────────────
function RhythmJumpGame({ onClose, onWin }) {
  const COLS = 4;
  const W = 300, H = 360;
  const [score, setScore] = React.useState(0);
  const [time, setTime] = React.useState(20);
  const [pads, setPads] = React.useState([]); // {id, col, y, hit}
  const [running, setRunning] = React.useState(true);
  const [done, setDone] = React.useState(false);
  const [combo, setCombo] = React.useState(0);
  const [feedback, setFeedback] = React.useState(null);

  React.useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setTime(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [running]);
  React.useEffect(() => {
    if (time <= 0 && running) {
      setRunning(false); setDone(true);
      onWin(Math.max(0, Math.floor(score / 5)));
    }
  }, [time, running, score, onWin]);

  React.useEffect(() => {
    if (!running) return;
    const sp = setInterval(() => {
      setPads(p => [...p, {
        id: Date.now() + Math.random(),
        col: Math.floor(Math.random() * COLS),
        y: -50, hit: false,
      }]);
    }, 750);
    return () => clearInterval(sp);
  }, [running]);

  React.useEffect(() => {
    if (!running) return;
    const tk = setInterval(() => {
      setPads(p => p.map(x => ({ ...x, y: x.y + 4 })).filter(x => x.y < H + 20 && !x.hit));
    }, 30);
    return () => clearInterval(tk);
  }, [running]);

  function tap(col) {
    // 找最靠近底部 hit zone 的 pad
    const hitY = H - 80;
    let best = null, bestDist = 60;
    for (const p of pads) {
      if (p.col === col && !p.hit) {
        const d = Math.abs(p.y - hitY);
        if (d < bestDist) { best = p; bestDist = d; }
      }
    }
    if (best) {
      setPads(p => p.map(x => x.id === best.id ? { ...x, hit: true } : x));
      const points = bestDist < 20 ? 3 : bestDist < 40 ? 2 : 1;
      setScore(s => s + points + Math.floor(combo / 3));
      setCombo(c => c + 1);
      setFeedback(points === 3 ? 'PERFECT!' : points === 2 ? 'GOOD!' : 'OK');
      setTimeout(() => setFeedback(null), 400);
      setTimeout(() => setPads(p => p.filter(x => x.id !== best.id)), 200);
    } else {
      setCombo(0);
    }
  }

  return (
    <Modal title="🐸 青蛙跳跳" onClose={onClose} color={COLORS.secondary}>
      <div style={{ fontFamily: '"Noto Sans TC", system-ui' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 800 }}>分數：<span style={{ color: COLORS.danger }}>{score}</span></div>
          <div style={{ fontSize: 14, fontWeight: 800 }}>連擊：<span style={{ color: '#F5A845' }}>{combo}x</span></div>
          <div style={{ fontSize: 14, fontWeight: 800 }}>{Math.max(0,time)}秒</div>
        </div>
        <div style={{
          position: 'relative', width: '100%', height: H,
          background: 'linear-gradient(180deg, #88C8E8 0%, #5BA8E8 100%)',
          border: '3px solid #1a1a1a', borderRadius: 14, overflow: 'hidden',
          boxShadow: '0 3px 0 #1a1a1a',
        }}>
          {/* 直線軌道 */}
          {Array.from({ length: COLS - 1 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute', top: 0, bottom: 0,
              left: `${((i + 1) / COLS) * 100}%`,
              width: 2, background: 'rgba(255,255,255,0.4)',
            }} />
          ))}
          {/* 命中線 */}
          <div style={{
            position: 'absolute', left: 0, right: 0, top: H - 80,
            height: 50, background: 'rgba(255,255,255,0.25)',
            borderTop: '2px dashed #fff', borderBottom: '2px dashed #fff',
          }} />
          {/* 荷葉 */}
          {pads.map(p => (
            <div key={p.id} style={{
              position: 'absolute',
              left: `${(p.col + 0.5) / COLS * 100}%`,
              top: p.y, transform: 'translateX(-50%)',
              fontSize: 40, transition: p.hit ? 'transform 0.2s, opacity 0.2s' : 'none',
              opacity: p.hit ? 0 : 1,
              filter: p.hit ? 'brightness(2)' : 'none',
            }}>🪷</div>
          ))}
          {feedback && (
            <div style={{
              position: 'absolute', top: '40%', left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 24, fontWeight: 900,
              color: feedback === 'PERFECT!' ? '#F5C24E' : '#fff',
              WebkitTextStroke: '2.5px #1a1a1a',
              animation: 'floatUp 0.6s ease-out forwards',
            }}>{feedback}</div>
          )}
          {done && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.92)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <div style={{ fontSize: 44 }}>🎉</div>
              <div style={{ fontSize: 22, fontWeight: 900 }}>遊戲結束！</div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{score} 分</div>
              <div style={{ background: COLORS.secondary, padding: '8px 16px', border: '3px solid #1a1a1a',
                borderRadius: 999, fontSize: 16, fontWeight: 900, boxShadow: '0 3px 0 #1a1a1a' }}>
                +{Math.max(0,Math.floor(score/5))} 🪙</div>
              <ChunkyButton color={COLORS.primary} onClick={onClose}>回家</ChunkyButton>
            </div>
          )}
        </div>
        {/* tap 按鈕 */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 6, marginTop: 8 }}>
          {Array.from({ length: COLS }).map((_, i) => (
            <button key={i} onClick={() => tap(i)} style={{
              aspectRatio: '2',
              background: COLORS.secondary,
              border: '2.5px solid #1a1a1a', borderRadius: 12,
              fontSize: 22, cursor: 'pointer',
              boxShadow: '0 3px 0 #1a1a1a',
              fontFamily: '"Noto Sans TC", system-ui', fontWeight: 800,
            }}>🐸</button>
          ))}
        </div>
        <div style={{ marginTop: 6, fontSize: 11, color: '#666', textAlign: 'center', fontWeight: 700 }}>
          荷葉到底時點對應青蛙 · 越準越多分 · 連擊加分
        </div>
      </div>
    </Modal>
  );
}

Object.assign(window, { CatchFruitGame, MemoryGame, RhythmJumpGame });
