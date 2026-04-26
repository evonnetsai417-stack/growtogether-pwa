// app.jsx — 主程式：寵物狀態管理 + 主畫面 + 互動邏輯

const STAGE = { EGG: 0, BABY: 1, ADULT: 2 };
const MAX_STAT = 100;

// 隨機抽動物
function randomAnimal() {
  return ANIMALS[Math.floor(Math.random() * ANIMALS.length)].id;
}

function GameApp({ playerId, player, onSwitchPlayer }) {
  const initial = loadPlayerSave(playerId) || {
    animalId: randomAnimal(),
    stage: STAGE.EGG,
    petName: '寵物蛋',
    age: 0, // 秒
    hunger: 80,
    fun: 80,
    energy: 80,
    clean: 80,
    health: 100,
    poop: 0,
    coins: 5,
    stars: 0,
    inventory: { apple: 2, ball: 1, soap: 1 },
    deeds: DEFAULT_GOOD_DEEDS,
    sleeping: false,
    weather: 'sunny',
  };

  const [state, setState] = React.useState(initial);
  const [screen, setScreen] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const [floats, setFloats] = React.useState([]);
  const [hearts, setHearts] = React.useState(0);
  const [petBounce, setPetBounce] = React.useState(0);
  const [draggedItem, setDraggedItem] = React.useState(null);
  const [shaking, setShaking] = React.useState(false);
  const [petAction, setPetAction] = React.useState(null);
  const [petPos, setPetPos] = React.useState({ x: 0, target: 0, dir: 1 });
  const petRef = React.useRef(null);

  // 自動存檔
  React.useEffect(() => { savePlayerSave(playerId, state); }, [state, playerId]);

  // 寵物走路 — 隨機改變目標位置
  React.useEffect(() => {
    if (state.stage === STAGE.EGG || state.sleeping || petAction) return;
    const pickTarget = () => {
      const range = 70;
      const target = (Math.random() - 0.5) * range * 2;
      setPetPos(p => ({ ...p, target, dir: target > p.x ? 1 : -1 }));
    };
    pickTarget();
    const id = setInterval(pickTarget, 4000 + Math.random() * 2000);
    return () => clearInterval(id);
  }, [state.stage, state.sleeping, petAction]);

  // 移動到目標
  React.useEffect(() => {
    let raf;
    const step = () => {
      setPetPos(p => {
        const dx = p.target - p.x;
        if (Math.abs(dx) < 0.5) return p;
        return { ...p, x: p.x + Math.sign(dx) * Math.min(0.8, Math.abs(dx)) };
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const isWalking = Math.abs(petPos.target - petPos.x) > 1;

  // 真實時間 → 是否該睡覺（21:00 ~ 07:00）
  const isNightTime = React.useCallback(() => {
    const h = new Date().getHours();
    return h >= 21 || h < 7;
  }, []);

  // 狀態自然衰減 + 成長（用真實時間決定睡眠）
  React.useEffect(() => {
    const tick = setInterval(() => {
      setState(s => {
        if (s.stage === STAGE.EGG) {
          // 蛋在 12 秒後孵化
          if (s.age >= 12) {
            return { ...s, stage: STAGE.BABY, age: 0, petName: ANIMALS.find(a => a.id === s.animalId)?.name || '寵物' };
          }
          return { ...s, age: s.age + 1 };
        }
        // 真實時間決定是否睡眠
        const sleeping = isNightTime();
        const newS = { ...s, age: s.age + 1, sleeping };
        if (!sleeping) {
          // 衰減速度大幅放慢（白天慢慢變化）
          newS.hunger = Math.max(0, s.hunger - 0.08);
          newS.fun = Math.max(0, s.fun - 0.06);
          newS.energy = Math.max(0, s.energy - 0.05);
          newS.clean = Math.max(0, s.clean - 0.04);
          // 便便機率降低
          if (Math.random() < 0.008 && s.poop < 3) newS.poop = s.poop + 1;
        } else {
          // 睡覺時補精力
          newS.energy = Math.min(MAX_STAT, s.energy + 0.8);
          // 睡覺時也會慢慢餓（更慢）
          newS.hunger = Math.max(0, s.hunger - 0.03);
        }
        // 健康判定（門檻降低，恢復速度提高）
        if (newS.hunger < 10 || newS.clean < 10 || newS.poop >= 3) {
          newS.health = Math.max(0, s.health - 0.15);
        } else if (newS.health < 100) {
          newS.health = Math.min(100, s.health + 0.3);
        }
        // 成長
        if (s.stage === STAGE.BABY && newS.age > 60) {
          newS.stage = STAGE.ADULT;
          showToast('🎉 長大了！');
        }
        return newS;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [isNightTime]);

  // 寵物心情
  const mood = React.useMemo(() => {
    if (state.sleeping) return 'sleepy';
    if (state.health < 40) return 'sick';
    if (state.weather === 'storm') return 'scared';
    if (state.hunger < 25) return 'sad';
    if (state.energy < 25) return 'sleepy';
    if (state.clean < 25) return 'sad';
    if (state.fun > 70 && state.hunger > 50) return 'happy';
    return 'normal';
  }, [state]);

  function showToast(msg, color = COLORS.primary) {
    setToast({ msg, color, key: Date.now() });
    setTimeout(() => setToast(null), 2200);
  }
  function showFloat(text, color, x = 160, y = 220) {
    const id = Date.now() + Math.random();
    setFloats(f => [...f, { id, text, color, x, y }]);
    setTimeout(() => setFloats(f => f.filter(x => x.id !== id)), 1300);
  }

  // 點寵物 — 開心反應
  function pokePet() {
    if (state.stage === STAGE.EGG) {
      showFloat('+1', '#F5C24E', 160, 200);
      setPetBounce(b => b + 1);
      return;
    }
    setHearts(h => h + 1);
    setState(s => ({ ...s, fun: Math.min(MAX_STAT, s.fun + 2) }));
    setPetBounce(b => b + 1);
    // 隨機觸發動作
    const acts = ['wave', 'jump', 'dance', 'cheer'];
    const act = acts[Math.floor(Math.random() * acts.length)];
    setPetAction(act);
    setTimeout(() => setPetAction(null), 1400);
  }

  // 餵食
  function feed(item) {
    if ((state.inventory[item.id] || 0) <= 0) return;
    setState(s => ({
      ...s,
      hunger: Math.min(MAX_STAT, s.hunger + (item.hunger || 0)),
      fun: Math.min(MAX_STAT, s.fun + (item.fun || 0)),
      inventory: { ...s.inventory, [item.id]: s.inventory[item.id] - 1 },
    }));
    showFloat(`+${item.hunger || 0}`, '#F5A845');
    showToast(`吃了${item.name}！好好吃～`);
    setHearts(h => h + 1);
    setPetAction('eat');
    setTimeout(() => setPetAction(null), 1500);
  }
  function playWith(item) {
    if ((state.inventory[item.id] || 0) <= 0) return;
    setState(s => ({
      ...s,
      fun: Math.min(MAX_STAT, s.fun + (item.fun || 0)),
      energy: Math.max(0, s.energy - 5),
      inventory: { ...s.inventory, [item.id]: s.inventory[item.id] - 1 },
    }));
    showFloat(`+${item.fun || 0}`, '#5BA8E8');
    showToast(`玩${item.name}超開心！`);
    setHearts(h => h + 2);
    setPetAction('jump');
    setTimeout(() => setPetAction(null), 1500);
  }
  function clean(item) {
    if ((state.inventory[item.id] || 0) <= 0) return;
    setState(s => ({
      ...s,
      clean: Math.min(MAX_STAT, s.clean + (item.clean || 0)),
      health: Math.min(MAX_STAT, s.health + (item.health || 0)),
      inventory: { ...s.inventory, [item.id]: s.inventory[item.id] - 1 },
    }));
    showFloat(`+${item.clean || item.health || 0}`, '#88C467');
    showToast(`乾乾淨淨！`);
  }

  // 商店購買
  function buy(category, item) {
    if (state.coins < item.price) {
      showToast('🪙 金幣不夠！', COLORS.danger);
      return;
    }
    setState(s => ({
      ...s,
      coins: s.coins - item.price,
      inventory: { ...s.inventory, [item.id]: (s.inventory[item.id] || 0) + 1 },
    }));
    showToast(`買了 ${item.name}！`, COLORS.secondary);
  }

  // 家長加點數
  function addPoints(pts, reason) {
    setState(s => {
      let stars = s.stars + pts;
      let coins = s.coins;
      const newCoins = Math.floor(stars / 10);
      if (newCoins > 0) {
        coins += newCoins;
        stars = stars % 10;
      }
      return { ...s, stars, coins };
    });
    showToast(`👍 ${reason} +${pts}⭐`, COLORS.purple);
  }

  // 切換睡眠
  function toggleSleep() {
    setState(s => ({ ...s, sleeping: !s.sleeping }));
    showToast(state.sleeping ? '☀️ 醒囉！' : '🌙 晚安～', COLORS.blue);
  }

  // 清便便
  function clearPoop() {
    setState(s => ({ ...s, poop: 0, clean: Math.min(MAX_STAT, s.clean + 10) }));
    showToast('💩 清乾淨！', COLORS.secondary);
  }

  // 看醫生
  function visitDoctor() {
    if (state.coins < 5) {
      showToast('看醫生要 5 🪙', COLORS.danger);
      return;
    }
    setState(s => ({
      ...s,
      coins: s.coins - 5,
      health: Math.min(MAX_STAT, s.health + 50),
    }));
    showToast('💊 健康恢復！', COLORS.secondary);
    showFloat('+50', '#88C467');
  }

  // 搖晃裝置 — 搔癢
  React.useEffect(() => {
    let last = { x: 0, y: 0, z: 0 };
    let shakeCount = 0;
    let lastShake = 0;
    function onMotion(e) {
      const a = e.accelerationIncludingGravity;
      if (!a) return;
      const dx = Math.abs((a.x || 0) - last.x);
      const dy = Math.abs((a.y || 0) - last.y);
      const dz = Math.abs((a.z || 0) - last.z);
      last = { x: a.x || 0, y: a.y || 0, z: a.z || 0 };
      if (dx + dy + dz > 25) {
        shakeCount++;
        if (shakeCount > 3 && Date.now() - lastShake > 2000) {
          lastShake = Date.now();
          shakeCount = 0;
          tickle();
        }
      }
    }
    window.addEventListener('devicemotion', onMotion);
    return () => window.removeEventListener('devicemotion', onMotion);
  }, [state.stage]);

  function tickle() {
    if (state.stage === STAGE.EGG) return;
    setShaking(true);
    setTimeout(() => setShaking(false), 800);
    setState(s => ({ ...s, fun: Math.min(MAX_STAT, s.fun + 8) }));
    setHearts(h => h + 3);
    showToast('哈哈～好癢！', COLORS.pink);
  }

  // 拖放
  function handleDragStart(type, item) {
    setDraggedItem({ type, item });
  }
  function handleDrop() {
    if (!draggedItem) return;
    const { type, item } = draggedItem;
    if (type === 'food') feed(item);
    else if (type === 'toy') playWith(item);
    else if (type === 'care') clean(item);
    setDraggedItem(null);
  }

  // 渲染寵物
  const renderPet = () => {
    if (state.stage === STAGE.EGG) {
      return <Egg size={220} cracked={state.age > 8} />;
    }
    return <Pet
      animalId={state.animalId}
      mood={mood}
      sleeping={state.sleeping}
      dirty={state.clean < 40}
      size={220}
      action={petAction}
      walking={isWalking && !petAction}
      facing={petPos.dir}
    />;
  };

  // 取得快捷物品（每類取背包中最多的）
  const quickItems = React.useMemo(() => {
    const result = { food: null, toy: null, care: null };
    for (const t of ['food', 'toy', 'care']) {
      const owned = SHOP_ITEMS[t].filter(it => (state.inventory[it.id] || 0) > 0);
      if (owned.length) result[t] = owned[0];
    }
    return result;
  }, [state.inventory]);

  return (
    <div style={{
      width: '100%', height: '100%',
      background: state.sleeping
        ? 'linear-gradient(180deg, #2D3561 0%, #4A5390 60%, #6B72A6 100%)'
        : 'linear-gradient(180deg, #FFE5B4 0%, #FFD89B 50%, #FFC988 100%)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.6s',
      fontFamily: '"Noto Sans TC", system-ui, sans-serif',
    }}>
      {/* 太陽/月亮 */}
      <div style={{
        position: 'absolute', top: 12, right: 16, fontSize: 32,
        animation: 'gentleSpin 20s linear infinite',
      }}>{state.sleeping ? '🌙' : '☀️'}</div>

      {/* 即時時鐘（左上角，避免和右上角徽章重疊）*/}
      <div style={{
        position: 'absolute', top: 50, left: 16,
        background: 'rgba(255,255,255,0.7)',
        border: '2px solid #1a1a1a',
        borderRadius: 999, padding: '2px 8px',
        fontSize: 11, fontWeight: 800,
        fontFamily: '"Noto Sans TC", system-ui',
        color: '#1a1a1a',
        zIndex: 5,
      }}>🕐 {new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>

      {/* 雲朵裝飾 */}
      {!state.sleeping && (
        <>
          <div style={{ position: 'absolute', top: 40, left: 20, fontSize: 22, opacity: 0.85 }}>☁️</div>
          <div style={{ position: 'absolute', top: 70, right: 70, fontSize: 18, opacity: 0.7 }}>☁️</div>
        </>
      )}
      {state.sleeping && (
        <>
          <div style={{ position: 'absolute', top: 30, left: 30, fontSize: 12, color: '#fff' }}>✦</div>
          <div style={{ position: 'absolute', top: 60, left: 80, fontSize: 8, color: '#fff' }}>✦</div>
          <div style={{ position: 'absolute', top: 50, right: 50, fontSize: 10, color: '#fff' }}>✦</div>
          <div style={{ position: 'absolute', top: 100, right: 100, fontSize: 8, color: '#fff' }}>✦</div>
        </>
      )}

      {/* 玩家徽章 */}
      <div style={{
        position: 'absolute', top: 50, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        zIndex: 11,
      }}>
        <PlayerBadge player={player} onClick={onSwitchPlayer} />
      </div>

      {/* 頂部資訊列 */}
      <div style={{
        position: 'absolute', top: 90, left: 12, right: 12,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <CoinBadge icon="🪙" label="金幣" value={state.coins} />
          <CoinBadge icon="⭐" label="點數" value={state.stars} color="#FFB3CC" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
          <button onClick={() => setScreen('parent')} style={{
            background: COLORS.purple, color: '#1a1a1a',
            border: '2.5px solid #1a1a1a', borderRadius: 999,
            padding: '5px 12px', fontWeight: 800, fontSize: 12,
            cursor: 'pointer', boxShadow: '0 2px 0 #1a1a1a',
            fontFamily: '"Noto Sans TC", system-ui',
            display: 'flex', alignItems: 'center', gap: 4,
          }}><span style={{ fontSize: 14 }}>👨‍👩‍👧</span><span>家長模式</span></button>
          <CoinBadge
            icon={state.stage === STAGE.EGG ? '🥚' : state.stage === STAGE.BABY ? '🐣' : '🌟'}
            label="階段"
            value={state.stage === STAGE.EGG ? '蛋' : state.stage === STAGE.BABY ? '幼年' : '成年'}
            color="#88C467"
          />
        </div>
      </div>

      {/* 狀態條 */}
      <div style={{
        position: 'absolute', top: 162, left: 12, right: 12,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6,
        zIndex: 10,
      }}>
        <StatBar icon="🍚" label="餓" value={state.hunger} color="#F5A845" />
        <StatBar icon="😄" label="樂" value={state.fun} color="#5BA8E8" />
        <StatBar icon="💤" label="累" value={state.energy} color="#B89FE8" />
        <StatBar icon="🛁" label="淨" value={state.clean} color="#88C467" />
      </div>

      {/* 健康警示 */}
      {state.health < 50 && (
        <div style={{
          position: 'absolute', top: 230, left: 12, right: 12,
          background: '#FFE5E5',
          border: '2.5px solid #E85C5C',
          borderRadius: 12,
          padding: '4px 10px',
          fontSize: 12, fontWeight: 800,
          color: '#E85C5C',
          textAlign: 'center',
          zIndex: 10,
          animation: 'pulse 1s infinite',
        }}>⚠️ {state.petName}生病了！需要看醫生</div>
      )}

      {/* 寵物名字 */}
      {state.stage !== STAGE.EGG && (
        <div style={{
          position: 'absolute', top: 270, left: '50%',
          transform: 'translateX(-50%)',
          background: '#fff',
          border: '2.5px solid #1a1a1a',
          borderRadius: 999,
          padding: '3px 14px',
          fontSize: 13, fontWeight: 800,
          boxShadow: '0 2px 0 #1a1a1a',
          zIndex: 10,
          color: state.sleeping ? '#1a1a1a' : '#1a1a1a',
        }}>{state.petName}</div>
      )}

      {/* 寵物 */}
      <div
        ref={petRef}
        onClick={pokePet}
        onDragOver={e => { e.preventDefault(); }}
        onDrop={handleDrop}
        style={{
          position: 'absolute', top: 304, left: '50%',
          transform: `translateX(calc(-50% + ${petPos.x}px)) ${shaking ? 'rotate(' + (Math.sin(Date.now() / 30) * 5) + 'deg)' : ''}`,
          width: 220, height: 240,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 5,
          animation: petBounce > 0 ? 'pokeBounce 0.4s' : 'none',
          transition: 'transform 0.05s linear',
        }}
        key={petBounce}
      >
        {/* 地面陰影 */}
        <div style={{
          position: 'absolute', bottom: 8, left: '50%',
          transform: 'translateX(-50%)',
          width: 130, height: 14,
          background: 'rgba(0,0,0,0.18)',
          borderRadius: '50%',
          filter: 'blur(2px)',
        }} />
        {renderPet()}

        {/* 便便 */}
        {state.poop > 0 && state.stage !== STAGE.EGG && (
          <div style={{
            position: 'absolute', bottom: 0, left: 30,
            display: 'flex', gap: 4,
          }}>
            {Array.from({ length: state.poop }).map((_, i) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); clearPoop(); }} style={{
                background: 'transparent', border: 'none',
                fontSize: 30, cursor: 'pointer',
                animation: 'wiggle 0.6s infinite',
              }}>💩</button>
            ))}
          </div>
        )}
      </div>

      {/* 心心動畫 */}
      {hearts > 0 && state.stage !== STAGE.EGG && (
        <div style={{ position: 'absolute', top: 220, left: '50%', transform: 'translateX(-50%)' }}>
          {Array.from({ length: Math.min(hearts, 5) }).map((_, i) => (
            <div key={`${hearts}-${i}`} style={{
              position: 'absolute',
              left: (Math.random() - 0.5) * 80,
              fontSize: 22,
              animation: `heartFloat 1.4s ease-out ${i * 0.08}s forwards`,
            }}>❤️</div>
          ))}
        </div>
      )}

      {/* 浮動數字 */}
      {floats.map(f => (
        <div key={f.id} style={{
          position: 'absolute', left: f.x, top: f.y,
          fontSize: 24, fontWeight: 900,
          color: f.color,
          WebkitTextStroke: '2.5px #1a1a1a',
          paintOrder: 'stroke fill',
          fontFamily: '"Noto Sans TC", system-ui',
          animation: 'floatUp 1.2s ease-out forwards',
          zIndex: 80, pointerEvents: 'none',
        }}>{f.text}</div>
      ))}

      {/* 提示氣泡 — 蛋階段 */}
      {state.stage === STAGE.EGG && (
        <div style={{
          position: 'absolute', top: 460, left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
        }}>
          <Bubble>點蛋蛋幫他孵化！<br/>還剩 {Math.max(0, 12 - state.age)} 秒</Bubble>
        </div>
      )}

      {/* 底部動作列 */}
      <div style={{
        position: 'absolute', bottom: 18, left: 12, right: 12,
        zIndex: 10,
      }}>
        {/* 快捷拖曳列 */}
        {state.stage !== STAGE.EGG && (
          <div style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(8px)',
            border: '2.5px solid #1a1a1a',
            borderRadius: 18,
            padding: 10,
            marginBottom: 10,
            boxShadow: '0 3px 0 #1a1a1a',
          }}>
            <div style={{
              fontSize: 11, fontWeight: 800, marginBottom: 6,
              color: '#666', textAlign: 'center',
            }}>👆 拖到寵物身上使用</div>
            <div style={{ display: 'flex', justifyContent: 'space-around', gap: 8 }}>
              {[
                { type: 'food', items: SHOP_ITEMS.food, color: COLORS.primary, label: '食物' },
                { type: 'toy',  items: SHOP_ITEMS.toy,  color: COLORS.blue,    label: '玩具' },
                { type: 'care', items: SHOP_ITEMS.care, color: COLORS.secondary, label: '清潔' },
              ].map(({ type, items, color, label }) => {
                const owned = items.filter(it => (state.inventory[it.id] || 0) > 0);
                const it = owned[0];
                return (
                  <div key={type} style={{ flex: 1, textAlign: 'center' }}>
                    {it ? (
                      <button
                        draggable
                        onDragStart={() => handleDragStart(type, it)}
                        onClick={() => {
                          if (type === 'food') feed(it);
                          else if (type === 'toy') playWith(it);
                          else clean(it);
                        }}
                        style={{
                          width: 56, height: 56, borderRadius: 14,
                          background: color,
                          border: '2.5px solid #1a1a1a',
                          fontSize: 28, cursor: 'grab',
                          boxShadow: '0 3px 0 #1a1a1a',
                          position: 'relative', padding: 0,
                        }}>
                        {it.emoji}
                        <div style={{
                          position: 'absolute', top: -5, right: -5,
                          background: '#fff', color: '#1a1a1a',
                          border: '2px solid #1a1a1a', borderRadius: '50%',
                          width: 20, height: 20, fontSize: 11, fontWeight: 900,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>{state.inventory[it.id]}</div>
                      </button>
                    ) : (
                      <button onClick={() => setScreen('shop')} style={{
                        width: 56, height: 56, borderRadius: 14,
                        background: '#fff',
                        border: '2.5px dashed #999',
                        fontSize: 22, cursor: 'pointer',
                        color: '#999',
                      }}>+</button>
                    )}
                    <div style={{ fontSize: 11, fontWeight: 700, marginTop: 2 }}>{label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 主功能按鈕 */}
        <div style={{
          display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        }}>
          <IconButton icon="🏪" label="商店" color={COLORS.primary} onClick={() => setScreen('shop')} />
          <IconButton icon="🎮" label="遊戲" color={COLORS.pink} onClick={() => setScreen('gamemenu')} disabled={state.stage === STAGE.EGG || state.sleeping} />
          <IconButton
            icon={state.sleeping ? '🌙' : '☀️'}
            label={state.sleeping ? '睡覺中' : '白天'}
            color={COLORS.blue}
            onClick={() => showToast(state.sleeping ? '🌙 寵物在睡覺，早上 7 點才會醒哦～' : '☀️ 寵物在玩耍～晚上 9 點會自己睡覺', COLORS.blue)}
            disabled={state.stage === STAGE.EGG}
          />
          <IconButton icon="🏥" label="醫生" color={COLORS.secondary} onClick={visitDoctor} disabled={state.stage === STAGE.EGG} badge={state.health < 50 ? '!' : null} />
        </div>
      </div>

      {/* 子畫面 */}
      {screen === 'shop' && (
        <ShopScreen coins={state.coins} onBuy={buy} onClose={() => setScreen(null)} />
      )}
      {screen === 'parent' && (
        <ParentScreen
          stars={state.stars}
          deeds={state.deeds}
          onClose={() => setScreen(null)}
          onAddPoints={addPoints}
          onAddDeed={(d) => setState(s => ({ ...s, deeds: [...s.deeds, d] }))}
          onRemoveDeed={(id) => setState(s => ({ ...s, deeds: s.deeds.filter(d => d.id !== id) }))}
        />
      )}
      {screen === 'gamemenu' && (
        <Modal title="🎮 選擇遊戲" onClose={() => setScreen(null)} color={COLORS.pink}>
          <div style={{ display: 'grid', gap: 10, fontFamily: '"Noto Sans TC", system-ui' }}>
            {[
              { id: 'butterfly', emoji: '🦋', name: '抓蝴蝶', desc: '點蝴蝶得分', color: COLORS.pink },
              { id: 'fruit', emoji: '🍎', name: '接水果', desc: '滑籃子接水果', color: COLORS.primary },
              { id: 'memory', emoji: '🧠', name: '記憶翻牌', desc: '配對相同圖案', color: COLORS.purple },
              { id: 'rhythm', emoji: '🐸', name: '青蛙跳跳', desc: '節奏點擊', color: COLORS.secondary },
            ].map(g => (
              <button key={g.id} onClick={() => setScreen(g.id)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: g.color, border: '2.5px solid #1a1a1a',
                borderRadius: 14, padding: 12, cursor: 'pointer',
                boxShadow: '0 3px 0 #1a1a1a', textAlign: 'left',
                fontFamily: '"Noto Sans TC", system-ui',
              }}>
                <div style={{ fontSize: 36 }}>{g.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 900 }}>{g.name}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#444' }}>{g.desc}</div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 900 }}>▶</div>
              </button>
            ))}
          </div>
        </Modal>
      )}
      {screen === 'butterfly' && (
        <MiniGame onClose={() => setScreen(null)} onWin={(c) => setState(s => ({ ...s, coins: s.coins + c, fun: Math.min(MAX_STAT, s.fun + 15) }))} />
      )}
      {screen === 'fruit' && (
        <CatchFruitGame onClose={() => setScreen(null)} onWin={(c) => setState(s => ({ ...s, coins: s.coins + c, fun: Math.min(MAX_STAT, s.fun + 15) }))} />
      )}
      {screen === 'memory' && (
        <MemoryGame onClose={() => setScreen(null)} onWin={(c) => setState(s => ({ ...s, coins: s.coins + c, fun: Math.min(MAX_STAT, s.fun + 15) }))} />
      )}
      {screen === 'rhythm' && (
        <RhythmJumpGame onClose={() => setScreen(null)} onWin={(c) => setState(s => ({ ...s, coins: s.coins + c, fun: Math.min(MAX_STAT, s.fun + 15) }))} />
      )}

      {/* Toast */}
      {toast && <Toast key={toast.key} message={toast.msg} color={toast.color} />}
    </div>
  );
}

// 主 App：負責玩家選擇
function App() {
  const [players, setPlayers] = React.useState(() => loadPlayers());
  const [activeId, setActiveId] = React.useState(() => {
    const id = getActivePlayerId();
    const list = loadPlayers();
    return id && list.find(p => p.id === id) ? id : null;
  });
  const [picking, setPicking] = React.useState(false);

  React.useEffect(() => { savePlayers(players); }, [players]);

  function handlePick(id) {
    setActivePlayerId(id);
    setActiveId(id);
    setPicking(false);
  }
  function handleCreate(p) {
    const next = [...players, p];
    setPlayers(next);
    savePlayers(next);
    handlePick(p.id);
  }
  function handleDelete(id) {
    const next = players.filter(p => p.id !== id);
    setPlayers(next);
    savePlayers(next);
    deletePlayerSave(id);
    if (activeId === id) {
      setActiveId(null);
      localStorage.removeItem(ACTIVE_KEY);
    }
  }

  if (!activeId || picking) {
    return (
      <PlayerPicker
        players={players}
        onPick={handlePick}
        onCreate={handleCreate}
        onDelete={handleDelete}
      />
    );
  }

  const player = players.find(p => p.id === activeId);
  if (!player) {
    setActiveId(null);
    return null;
  }

  return (
    <GameApp
      key={activeId}
      playerId={activeId}
      player={player}
      onSwitchPlayer={() => setPicking(true)}
    />
  );
}

Object.assign(window, { App, GameApp });
