// app.jsx — 主程式：寵物狀態管理 + 主畫面 + 互動邏輯

const STAGE = { EGG: 0, BABY: 1, ADULT: 2 };
const MAX_STAT = 100;

// XP 門檻：來自好行為獎勵
const XP_TO_HATCH = 50;     // 蛋 → 幼年（需累積 50 XP）
const XP_TO_ADULT = 300;    // 幼年 → 成年（需累積 300 XP + 至少 1 天）
const MIN_BABY_AGE = 86400; // 幼年至少要 1 天（秒）才能長大

// ── 對話台詞資料庫 ──────────────────────────────────────
const DIALOGS = {
  feed: [
    '好好吃！謝謝你～',
    '嗯嗯！肚子不餓了！',
    '最喜歡吃這個了！',
    '啊嗯！好滿足～',
    '嗯嗯嗯！還要還要！',
    '謝謝你幫我準備食物！',
    '好香好香！',
    '吃飽飽了！開心！',
  ],
  play: [
    '哇！好好玩！再來一次！',
    '跳跳跳！好開心！',
    '嘻嘻嘻嘻嘻！',
    '超好玩的啦！謝謝你！',
    '玩玩玩！！！',
    '嗚哇！飛起來了！',
    '跟你玩最開心了！',
    '哈哈哈哈！！',
  ],
  clean: [
    '乾淨又香香的！',
    '洗澡好舒服～',
    '擦擦乾淨囉！',
    '嗯嗯，清潔溜溜！',
    '謝謝你幫我洗澡！',
    '香香的好喜歡～',
    '乾乾淨淨！舒服！',
  ],
  poke: [
    '嗯嗯！好舒服～',
    '嘻嘻！搔癢啦！',
    '喜歡你！❤️',
    '嗚嗚好癢！哈哈！',
    '嘿嘿，再來一次！',
    '我最喜歡你了！',
    '呵呵～好溫暖！',
    '嗯？有人陪我玩！',
    '嗚嗚嗚！太喜歡了！',
    '哈哈哈哈！停下來啦！',
  ],
  poop: [
    '啊啊啊！幫我清一下！',
    '嗚嗚，有點臭臭的…',
    '快快快！好尷尬！',
    '不好意思啦！',
  ],
  sick: [
    '我不舒服… 嗚嗚',
    '頭暈暈的… 需要看醫生',
    '好難受喔… 幫幫我',
    '嗚嗚… 感覺怪怪的',
  ],
  hungry: [
    '肚子咕嚕咕嚕叫了！',
    '好餓好餓！',
    '肚子餓了～ 可以吃東西嗎？',
    '嗯…… 好想吃東西',
  ],
  happy: [
    '今天好開心！',
    '嘻嘻！最近很快樂！',
    '有你陪真好！',
    '今天天氣好好喔！',
    '好幸福喔～',
  ],
};

function randomMsg(key) {
  const arr = DIALOGS[key];
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomAnimal() {
  return ANIMALS[Math.floor(Math.random() * ANIMALS.length)].id;
}

function GameApp({ playerId, player, onSwitchPlayer }) {
  const rawSave = loadPlayerSave(playerId);
  const initial = rawSave ? { xp: 0, ...rawSave } : {
    animalId: randomAnimal(),
    stage: STAGE.EGG,
    petName: '寵物蛋',
    age: 0,
    xp: 0,
    hunger: 80, fun: 80, energy: 80, clean: 80, health: 100,
    poop: 0, coins: 5, stars: 0,
    inventory: { apple: 2, ball: 1, soap: 1 },
    deeds: DEFAULT_GOOD_DEEDS,
    sleeping: false, weather: 'sunny',
    lastUpdate: Date.now(),
  };

  const [state, setState] = React.useState(initial);
  const [screen, setScreen] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const [floats, setFloats] = React.useState([]);
  const [hearts, setHearts] = React.useState(0);
  const [petBounce, setPetBounce] = React.useState(0);
  const [petAction, setPetAction] = React.useState(null);
  const [draggedItem, setDraggedItem] = React.useState(null);
  const [petPos, setPetPos] = React.useState({ x: 0, target: 0, dir: 1 });

  React.useEffect(() => { savePlayerSave(playerId, state); }, [state, playerId]);

  // 寵物走路
  React.useEffect(() => {
    if (state.stage === STAGE.EGG || state.sleeping || petAction) return;
    const pickTarget = () => {
      const target = (Math.random() - 0.5) * 140;
      setPetPos(p => ({ ...p, target, dir: target > p.x ? 1 : -1 }));
    };
    pickTarget();
    const id = setInterval(pickTarget, 5000 + Math.random() * 3000);
    return () => clearInterval(id);
  }, [state.stage, state.sleeping, petAction]);

  React.useEffect(() => {
    let raf;
    const step = () => {
      setPetPos(p => {
        const dx = p.target - p.x;
        if (Math.abs(dx) < 0.5) return p;
        return { ...p, x: p.x + Math.sign(dx) * Math.min(0.6, Math.abs(dx)) };
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const isWalking = Math.abs(petPos.target - petPos.x) > 1;
  const isNightTime = React.useCallback(() => {
    const h = new Date().getHours();
    return h >= 21 || h < 7;
  }, []);

  // ── 每秒 tick（衰減極慢：1 小時約 10-15 點）──────────
  React.useEffect(() => {
    const tick = setInterval(() => {
      setState(s => {
        // 蛋：等 XP 累積到門檻才孵化
        if (s.stage === STAGE.EGG) {
          if (s.xp >= XP_TO_HATCH) {
            const name = ANIMALS.find(a => a.id === s.animalId)?.name || '寵物';
            setTimeout(() => showToast(`🐣 孵化了！是${name}！`, COLORS.secondary), 100);
            return { ...s, stage: STAGE.BABY, age: 0, petName: name };
          }
          return { ...s, age: s.age + 1 };
        }

        const sleeping = isNightTime();
        const newS = { ...s, age: s.age + 1, sleeping };

        if (!sleeping) {
          // 衰減慢：每秒約 0.003，1 小時約 10.8 點
          newS.hunger = Math.max(0, s.hunger - 0.003);
          newS.fun    = Math.max(0, s.fun    - 0.002);
          newS.energy = Math.max(0, s.energy - 0.002);
          newS.clean  = Math.max(0, s.clean  - 0.0015);
          // 大便：平均每 4-6 小時一次（機率極低）
          if (Math.random() < 0.00005 && s.poop < 3) newS.poop = s.poop + 1;
        } else {
          newS.energy = Math.min(MAX_STAT, s.energy + 0.05);
          newS.hunger = Math.max(0, s.hunger - 0.001);
        }

        if (newS.hunger < 10 || newS.clean < 10 || newS.poop >= 3) {
          newS.health = Math.max(0, s.health - 0.03);
        } else if (newS.health < 100) {
          newS.health = Math.min(100, s.health + 0.05);
        }

        // 幼年 → 成年：XP >= 300 且 age >= 1天
        if (s.stage === STAGE.BABY && newS.xp >= XP_TO_ADULT && newS.age >= MIN_BABY_AGE) {
          newS.stage = STAGE.ADULT;
          setTimeout(() => showToast('🌟 長大了！恭喜成為成年寵物！', COLORS.secondary), 100);
        }

        return newS;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [isNightTime]);

  // 偶爾自動說話（每分鐘 30% 機率）
  React.useEffect(() => {
    if (state.stage === STAGE.EGG) return;
    const id = setInterval(() => {
      if (Math.random() < 0.3) {
        if      (state.health < 50)  showToast(randomMsg('sick'),    COLORS.danger);
        else if (state.hunger < 30)  showToast(randomMsg('hungry'),  COLORS.primary);
        else if (state.poop > 0)     showToast(randomMsg('poop'),    COLORS.primary);
        else if (state.fun > 70 && state.hunger > 50) showToast(randomMsg('happy'), COLORS.secondary);
      }
    }, 60000);
    return () => clearInterval(id);
  }, [state.stage, state.health, state.hunger, state.fun, state.poop]);

  function showToast(msg, color = COLORS.primary) {
    setToast({ msg, color, key: Date.now() });
    setTimeout(() => setToast(null), 2400);
  }
  function showFloat(text, color, x = 160, y = 220) {
    const id = Date.now() + Math.random();
    setFloats(f => [...f, { id, text, color, x, y }]);
    setTimeout(() => setFloats(f => f.filter(x => x.id !== id)), 1300);
  }

  // ── 互動 ────────────────────────────────────────────
  function pokePet() {
    if (state.stage === STAGE.EGG) {
      showFloat('+1 XP', COLORS.purple, 155, 200);
      setState(s => ({ ...s, xp: s.xp + 1 }));
      setPetBounce(b => b + 1);
      return;
    }
    setHearts(h => h + 1);
    setState(s => ({ ...s, fun: Math.min(MAX_STAT, s.fun + 3), xp: s.xp + 1 }));
    setPetBounce(b => b + 1);
    showToast(randomMsg('poke'), COLORS.pink);
    const acts = ['wave', 'jump', 'dance', 'cheer'];
    setPetAction(acts[Math.floor(Math.random() * acts.length)]);
    setTimeout(() => setPetAction(null), 1400);
  }

  function feed(item) {
    if ((state.inventory[item.id] || 0) <= 0) return;
    setState(s => ({
      ...s,
      hunger: Math.min(MAX_STAT, s.hunger + (item.hunger || 0)),
      fun:    Math.min(MAX_STAT, s.fun    + (item.fun    || 0)),
      xp: s.xp + 2,
      inventory: { ...s.inventory, [item.id]: s.inventory[item.id] - 1 },
    }));
    showFloat(`+${item.hunger || 0}`, COLORS.primary);
    showToast(randomMsg('feed'));
    setHearts(h => h + 1);
    setPetAction('eat');
    setTimeout(() => setPetAction(null), 1500);
  }

  function playWith(item) {
    if ((state.inventory[item.id] || 0) <= 0) return;
    setState(s => ({
      ...s,
      fun:    Math.min(MAX_STAT, s.fun    + (item.fun || 0)),
      energy: Math.max(0, s.energy - 5),
      xp: s.xp + 3,
      inventory: { ...s.inventory, [item.id]: s.inventory[item.id] - 1 },
    }));
    showFloat(`+${item.fun || 0}`, COLORS.blue);
    showToast(randomMsg('play'), COLORS.blue);
    setHearts(h => h + 2);
    setPetAction('jump');
    setTimeout(() => setPetAction(null), 1500);
  }

  function clean(item) {
    if ((state.inventory[item.id] || 0) <= 0) return;
    setState(s => ({
      ...s,
      clean:  Math.min(MAX_STAT, s.clean  + (item.clean  || 0)),
      health: Math.min(MAX_STAT, s.health + (item.health || 0)),
      xp: s.xp + 1,
      inventory: { ...s.inventory, [item.id]: s.inventory[item.id] - 1 },
    }));
    showFloat(`+${item.clean || item.health || 0}`, COLORS.secondary);
    showToast(randomMsg('clean'), COLORS.secondary);
  }

  function buy(category, item) {
    if (state.coins < item.price) { showToast('🪙 金幣不夠！', COLORS.danger); return; }
    setState(s => ({
      ...s, coins: s.coins - item.price,
      inventory: { ...s.inventory, [item.id]: (s.inventory[item.id] || 0) + 1 },
    }));
    showToast(`買了 ${item.name}！`, COLORS.secondary);
  }

  // 家長給點數（每顆星 = 5 XP）
  function addPoints(pts, reason) {
    setState(s => {
      let stars = s.stars + pts;
      let coins = s.coins;
      const newCoins = Math.floor(stars / 10);
      if (newCoins > 0) { coins += newCoins; stars = stars % 10; }
      return { ...s, stars, coins, xp: s.xp + pts * 5 };
    });
    showToast(`👍 ${reason} +${pts}⭐（+${pts * 5} XP）`, COLORS.purple);
  }

  function clearPoop() {
    setState(s => ({ ...s, poop: 0, clean: Math.min(MAX_STAT, s.clean + 10) }));
    showToast('💩 清乾淨了！', COLORS.secondary);
  }

  function visitDoctor() {
    if (state.coins < 5) { showToast('看醫生要 5 🪙', COLORS.danger); return; }
    setState(s => ({ ...s, coins: s.coins - 5, health: Math.min(MAX_STAT, s.health + 50) }));
    showToast('💊 好多了！謝謝醫生！', COLORS.secondary);
    showFloat('+50', COLORS.secondary);
  }

  // 搖晃搔癢
  React.useEffect(() => {
    let last = { x: 0, y: 0, z: 0 }, shakeCount = 0, lastShake = 0;
    function onMotion(e) {
      const a = e.accelerationIncludingGravity;
      if (!a) return;
      const d = Math.abs((a.x||0)-last.x) + Math.abs((a.y||0)-last.y) + Math.abs((a.z||0)-last.z);
      last = { x: a.x||0, y: a.y||0, z: a.z||0 };
      if (d > 25) {
        shakeCount++;
        if (shakeCount > 3 && Date.now() - lastShake > 2000) {
          lastShake = Date.now(); shakeCount = 0;
          if (state.stage !== STAGE.EGG) {
            setState(s => ({ ...s, fun: Math.min(MAX_STAT, s.fun + 8), xp: s.xp + 1 }));
            setHearts(h => h + 3);
            showToast('哈哈！好癢好癢！停下來啦！', COLORS.pink);
          }
        }
      }
    }
    window.addEventListener('devicemotion', onMotion);
    return () => window.removeEventListener('devicemotion', onMotion);
  }, [state.stage]);

  function handleDrop() {
    if (!draggedItem) return;
    const { type, item } = draggedItem;
    if (type === 'food') feed(item);
    else if (type === 'toy') playWith(item);
    else if (type === 'care') clean(item);
    setDraggedItem(null);
  }

  const renderPet = () => {
    if (state.stage === STAGE.EGG) return <Egg size={220} cracked={state.xp >= XP_TO_HATCH * 0.7} />;
    return <Pet animalId={state.animalId} mood={mood} sleeping={state.sleeping}
      dirty={state.clean < 40} size={220} action={petAction}
      walking={isWalking && !petAction} facing={petPos.dir} />;
  };

  const mood = React.useMemo(() => {
    if (state.sleeping)            return 'sleepy';
    if (state.health < 40)        return 'sick';
    if (state.weather === 'storm') return 'scared';
    if (state.hunger < 25)        return 'sad';
    if (state.energy < 25)        return 'sleepy';
    if (state.clean < 25)         return 'sad';
    if (state.fun > 70 && state.hunger > 50) return 'happy';
    return 'normal';
  }, [state]);

  const quickItems = React.useMemo(() => {
    const r = { food: null, toy: null, care: null };
    for (const t of ['food','toy','care']) {
      const owned = SHOP_ITEMS[t].filter(it => (state.inventory[it.id]||0) > 0);
      if (owned.length) r[t] = owned[0];
    }
    return r;
  }, [state.inventory]);

  const eggXpPct  = Math.min(100, Math.round((state.xp / XP_TO_HATCH) * 100));
  const babyXpPct = state.stage === STAGE.BABY
    ? Math.min(100, Math.round((state.xp / XP_TO_ADULT) * 100)) : 0;

  return (
    <div style={{
      width: '100%', height: '100%',
      background: state.sleeping
        ? 'linear-gradient(180deg,#2D3561,#4A5390 60%,#6B72A6)'
        : 'linear-gradient(180deg,#FFE5B4,#FFD89B 50%,#FFC988)',
      position: 'relative', overflow: 'hidden', transition: 'background 0.8s',
      fontFamily: '"Noto Sans TC", system-ui, sans-serif',
    }}>
      {/* 太陽/月亮 */}
      <div style={{ position:'absolute', top:12, right:16, fontSize:30, animation:'gentleSpin 20s linear infinite' }}>
        {state.sleeping ? '🌙' : '☀️'}
      </div>
      {!state.sleeping && (<>
        <div style={{ position:'absolute', top:40, left:20, fontSize:22, opacity:0.85 }}>☁️</div>
        <div style={{ position:'absolute', top:72, right:70, fontSize:18, opacity:0.7 }}>☁️</div>
      </>)}
      {state.sleeping && (<>
        <div style={{ position:'absolute', top:30, left:30, fontSize:12, color:'#fff' }}>✦</div>
        <div style={{ position:'absolute', top:60, left:80, fontSize:8,  color:'#fff' }}>✦</div>
        <div style={{ position:'absolute', top:50, right:50, fontSize:10, color:'#fff' }}>✦</div>
      </>)}

      {/* 玩家徽章 */}
      <div style={{ position:'absolute', top:50, left:0, right:0, display:'flex', justifyContent:'center', zIndex:11 }}>
        <PlayerBadge player={player} onClick={onSwitchPlayer} />
      </div>

      {/* 頂部資訊 */}
      <div style={{ position:'absolute', top:90, left:12, right:12, display:'flex', justifyContent:'space-between', alignItems:'flex-start', zIndex:10 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
          <CoinBadge icon="🪙" label="金幣" value={state.coins} />
          <CoinBadge icon="⭐" label="點數" value={state.stars} color="#FFB3CC" />
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:4, alignItems:'flex-end' }}>
          <button onClick={() => setScreen('parent')} style={{
            background: COLORS.purple, color:'#1a1a1a',
            border:'2.5px solid #1a1a1a', borderRadius:999,
            padding:'5px 12px', fontWeight:800, fontSize:12, cursor:'pointer',
            boxShadow:'0 2px 0 #1a1a1a', fontFamily:'"Noto Sans TC",system-ui',
            display:'flex', alignItems:'center', gap:4,
          }}><span style={{ fontSize:14 }}>👨‍👩‍👧</span><span>家長模式</span></button>
          <CoinBadge
            icon={state.stage===STAGE.EGG?'🥚':state.stage===STAGE.BABY?'🐣':'🌟'}
            label="階段"
            value={state.stage===STAGE.EGG?'蛋':state.stage===STAGE.BABY?'幼年':'成年'}
            color={COLORS.secondary}
          />
        </div>
      </div>

      {/* 狀態條 */}
      {state.stage !== STAGE.EGG && (
        <div style={{ position:'absolute', top:162, left:12, right:12, display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, zIndex:10 }}>
          <StatBar icon="🍚" label="餓" value={state.hunger} color={COLORS.primary} />
          <StatBar icon="😄" label="樂" value={state.fun}    color={COLORS.blue} />
          <StatBar icon="💤" label="累" value={state.energy} color={COLORS.purple} />
          <StatBar icon="🛁" label="淨" value={state.clean}  color={COLORS.secondary} />
        </div>
      )}

      {/* 幼年成長 XP 條 */}
      {state.stage === STAGE.BABY && (
        <div style={{
          position:'absolute', top:244, left:12, right:12, zIndex:10,
          background:'rgba(255,255,255,0.85)', border:'2px solid #1a1a1a',
          borderRadius:999, padding:'4px 10px 4px 6px',
          display:'flex', alignItems:'center', gap:6, boxShadow:'0 2px 0 #1a1a1a',
        }}>
          <span style={{ fontSize:13 }}>✨</span>
          <span style={{ fontSize:11, fontWeight:800, flexShrink:0 }}>成長</span>
          <div style={{ flex:1, height:10, borderRadius:999, background:'#F0E5D0', border:'2px solid #1a1a1a', overflow:'hidden' }}>
            <div style={{ width:`${babyXpPct}%`, height:'100%', background:COLORS.purple, transition:'width 0.5s' }} />
          </div>
          <span style={{ fontSize:11, fontWeight:800, color:'#666', flexShrink:0 }}>{babyXpPct}%</span>
        </div>
      )}

      {/* 健康警示 */}
      {state.health < 50 && state.stage !== STAGE.EGG && (
        <div style={{
          position:'absolute', top:state.stage===STAGE.BABY?272:234, left:12, right:12,
          background:'#FFE5E5', border:'2.5px solid #E85C5C', borderRadius:12,
          padding:'4px 10px', fontSize:12, fontWeight:800, color:'#E85C5C',
          textAlign:'center', zIndex:10, animation:'pulse 1s infinite',
        }}>⚠️ {state.petName}生病了！需要看醫生</div>
      )}

      {/* 寵物名字 */}
      {state.stage !== STAGE.EGG && (
        <div style={{
          position:'absolute', top:278, left:'50%', transform:'translateX(-50%)',
          background:'#fff', border:'2.5px solid #1a1a1a', borderRadius:999,
          padding:'3px 14px', fontSize:13, fontWeight:800,
          boxShadow:'0 2px 0 #1a1a1a', zIndex:10,
        }}>{state.petName}</div>
      )}

      {/* 寵物互動區 */}
      <div onClick={pokePet} onDragOver={e=>e.preventDefault()} onDrop={handleDrop}
        style={{
          position:'absolute', top:304, left:'50%',
          transform:`translateX(calc(-50% + ${petPos.x}px))`,
          width:220, height:240,
          display:'flex', alignItems:'center', justifyContent:'center',
          cursor:'pointer', zIndex:5,
          animation: petBounce>0 ? 'pokeBounce 0.4s' : 'none',
        }} key={petBounce}>
        <div style={{
          position:'absolute', bottom:8, left:'50%', transform:'translateX(-50%)',
          width:130, height:14, background:'rgba(0,0,0,0.18)', borderRadius:'50%', filter:'blur(2px)',
        }} />
        {renderPet()}
        {state.poop > 0 && state.stage !== STAGE.EGG && (
          <div style={{ position:'absolute', bottom:0, left:20, display:'flex', gap:4 }}>
            {Array.from({ length: state.poop }).map((_,i) => (
              <button key={i} onClick={e=>{e.stopPropagation();clearPoop();}} style={{
                background:'transparent', border:'none', fontSize:28, cursor:'pointer', animation:'wiggle 0.6s infinite',
              }}>💩</button>
            ))}
          </div>
        )}
      </div>

      {/* 愛心 */}
      {hearts > 0 && state.stage !== STAGE.EGG && (
        <div style={{ position:'absolute', top:220, left:'50%', transform:'translateX(-50%)' }}>
          {Array.from({ length: Math.min(hearts,5) }).map((_,i) => (
            <div key={`${hearts}-${i}`} style={{
              position:'absolute', left:(Math.random()-0.5)*80, fontSize:22,
              animation:`heartFloat 1.4s ease-out ${i*0.08}s forwards`,
            }}>❤️</div>
          ))}
        </div>
      )}

      {/* 浮動數字 */}
      {floats.map(f => (
        <div key={f.id} style={{
          position:'absolute', left:f.x, top:f.y,
          fontSize:24, fontWeight:900, color:f.color,
          WebkitTextStroke:'2.5px #1a1a1a', paintOrder:'stroke fill',
          fontFamily:'"Noto Sans TC",system-ui',
          animation:'floatUp 1.2s ease-out forwards', zIndex:80, pointerEvents:'none',
        }}>{f.text}</div>
      ))}

      {/* 蛋：XP 進度泡泡 */}
      {state.stage === STAGE.EGG && (
        <div style={{ position:'absolute', top:470, left:20, right:20, zIndex:10 }}>
          <Bubble>點蛋蛋或完成好行為讓牠孵化！</Bubble>
          <div style={{
            marginTop:8, background:'rgba(255,255,255,0.88)',
            border:'2.5px solid #1a1a1a', borderRadius:999,
            padding:'4px 10px 4px 6px',
            display:'flex', alignItems:'center', gap:6, boxShadow:'0 2px 0 #1a1a1a',
          }}>
            <span style={{ fontSize:14 }}>🥚</span>
            <div style={{ flex:1, height:12, borderRadius:999, background:'#F0E5D0', border:'2px solid #1a1a1a', overflow:'hidden' }}>
              <div style={{ width:`${eggXpPct}%`, height:'100%', background:'linear-gradient(90deg,#F5C24E,#F5A845)', transition:'width 0.5s' }} />
            </div>
            <span style={{ fontSize:12, fontWeight:900, flexShrink:0 }}>{state.xp}/{XP_TO_HATCH} XP</span>
          </div>
        </div>
      )}

      {/* 底部 */}
      <div style={{ position:'absolute', bottom:18, left:12, right:12, zIndex:10 }}>
        {state.stage !== STAGE.EGG && (
          <div style={{
            background:'rgba(255,255,255,0.88)', backdropFilter:'blur(8px)',
            border:'2.5px solid #1a1a1a', borderRadius:18,
            padding:10, marginBottom:10, boxShadow:'0 3px 0 #1a1a1a',
          }}>
            <div style={{ fontSize:11, fontWeight:800, marginBottom:6, color:'#666', textAlign:'center' }}>
              👆 點擊或拖到寵物身上使用
            </div>
            <div style={{ display:'flex', justifyContent:'space-around', gap:8 }}>
              {[
                { type:'food', color:COLORS.primary,   label:'食物' },
                { type:'toy',  color:COLORS.blue,       label:'玩具' },
                { type:'care', color:COLORS.secondary,  label:'清潔' },
              ].map(({ type, color, label }) => {
                const it = quickItems[type];
                return (
                  <div key={type} style={{ flex:1, textAlign:'center' }}>
                    {it ? (
                      <button
                        draggable onDragStart={()=>setDraggedItem({type,item:it})}
                        onClick={()=>{ if(type==='food')feed(it); else if(type==='toy')playWith(it); else clean(it); }}
                        style={{
                          width:56, height:56, borderRadius:14,
                          background:color, border:'2.5px solid #1a1a1a',
                          fontSize:28, cursor:'grab', boxShadow:'0 3px 0 #1a1a1a',
                          position:'relative', padding:0,
                        }}>
                        {it.emoji}
                        <div style={{
                          position:'absolute', top:-5, right:-5,
                          background:'#fff', color:'#1a1a1a',
                          border:'2px solid #1a1a1a', borderRadius:'50%',
                          width:20, height:20, fontSize:11, fontWeight:900,
                          display:'flex', alignItems:'center', justifyContent:'center',
                        }}>{state.inventory[it.id]}</div>
                      </button>
                    ) : (
                      <button onClick={()=>setScreen('shop')} style={{
                        width:56, height:56, borderRadius:14,
                        background:'#fff', border:'2.5px dashed #999',
                        fontSize:22, cursor:'pointer', color:'#999',
                      }}>+</button>
                    )}
                    <div style={{ fontSize:11, fontWeight:700, marginTop:2 }}>{label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 主功能按鈕（3 個，無白天 tab）*/}
        <div style={{ display:'flex', justifyContent:'space-around', alignItems:'center' }}>
          <IconButton icon="🏪" label="商店"  color={COLORS.primary}   onClick={()=>setScreen('shop')} />
          <IconButton icon="🎮" label="遊戲"  color={COLORS.pink}      onClick={()=>setScreen('gamemenu')} disabled={state.stage===STAGE.EGG||state.sleeping} />
          <IconButton icon="🏥" label="醫生"  color={COLORS.secondary} onClick={visitDoctor} disabled={state.stage===STAGE.EGG} badge={state.health<50?'!':null} />
        </div>
      </div>

      {/* 子畫面 */}
      {screen==='shop' && <ShopScreen coins={state.coins} onBuy={buy} onClose={()=>setScreen(null)} />}
      {screen==='parent' && (
        <ParentScreen
          stars={state.stars} xp={state.xp} stage={state.stage}
          deeds={state.deeds} onClose={()=>setScreen(null)}
          onAddPoints={addPoints}
          onAddDeed={d=>setState(s=>({...s,deeds:[...s.deeds,d]}))}
          onRemoveDeed={id=>setState(s=>({...s,deeds:s.deeds.filter(d=>d.id!==id)}))}
        />
      )}
      {screen==='gamemenu' && (
        <Modal title="🎮 選擇遊戲" onClose={()=>setScreen(null)} color={COLORS.pink}>
          <div style={{ display:'grid', gap:10, fontFamily:'"Noto Sans TC",system-ui' }}>
            {[
              {id:'butterfly',emoji:'🦋',name:'抓蝴蝶',  desc:'點蝴蝶得分',  color:COLORS.pink},
              {id:'fruit',    emoji:'🍎',name:'接水果',  desc:'滑籃子接水果',color:COLORS.primary},
              {id:'memory',   emoji:'🧠',name:'記憶翻牌',desc:'配對相同圖案',color:COLORS.purple},
              {id:'rhythm',   emoji:'🐸',name:'青蛙跳跳',desc:'節奏點擊',   color:COLORS.secondary},
            ].map(g=>(
              <button key={g.id} onClick={()=>setScreen(g.id)} style={{
                display:'flex', alignItems:'center', gap:12,
                background:g.color, border:'2.5px solid #1a1a1a',
                borderRadius:14, padding:12, cursor:'pointer',
                boxShadow:'0 3px 0 #1a1a1a', textAlign:'left',
                fontFamily:'"Noto Sans TC",system-ui',
              }}>
                <div style={{ fontSize:36 }}>{g.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:16, fontWeight:900 }}>{g.name}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:'#444' }}>{g.desc}</div>
                </div>
                <div style={{ fontSize:18, fontWeight:900 }}>▶</div>
              </button>
            ))}
          </div>
        </Modal>
      )}
      {screen==='butterfly' && <MiniGame onClose={()=>setScreen(null)} onWin={c=>setState(s=>({...s,coins:s.coins+c,fun:Math.min(MAX_STAT,s.fun+15)}))} />}
      {screen==='fruit'     && <CatchFruitGame  onClose={()=>setScreen(null)} onWin={c=>setState(s=>({...s,coins:s.coins+c,fun:Math.min(MAX_STAT,s.fun+15)}))} />}
      {screen==='memory'    && <MemoryGame      onClose={()=>setScreen(null)} onWin={c=>setState(s=>({...s,coins:s.coins+c,fun:Math.min(MAX_STAT,s.fun+15)}))} />}
      {screen==='rhythm'    && <RhythmJumpGame  onClose={()=>setScreen(null)} onWin={c=>setState(s=>({...s,coins:s.coins+c,fun:Math.min(MAX_STAT,s.fun+15)}))} />}

      {toast && <Toast key={toast.key} message={toast.msg} color={toast.color} />}
    </div>
  );
}

function App() {
  const [players, setPlayers] = React.useState(()=>loadPlayers());
  const [activeId, setActiveId] = React.useState(()=>{
    const id = getActivePlayerId();
    const list = loadPlayers();
    return id && list.find(p=>p.id===id) ? id : null;
  });
  const [picking, setPicking] = React.useState(false);

  React.useEffect(()=>{ savePlayers(players); },[players]);

  function handlePick(id)  { setActivePlayerId(id); setActiveId(id); setPicking(false); }
  function handleCreate(p) {
    const next=[...players,p]; setPlayers(next); savePlayers(next); handlePick(p.id);
  }
  function handleDelete(id) {
    const next=players.filter(p=>p.id!==id);
    setPlayers(next); savePlayers(next); deletePlayerSave(id);
    if(activeId===id){ setActiveId(null); localStorage.removeItem(ACTIVE_KEY); }
  }

  if(!activeId||picking)
    return <PlayerPicker players={players} onPick={handlePick} onCreate={handleCreate} onDelete={handleDelete} />;

  const player=players.find(p=>p.id===activeId);
  if(!player){ setActiveId(null); return null; }
  return <GameApp key={activeId} playerId={activeId} player={player} onSwitchPlayer={()=>setPicking(true)} />;
}

Object.assign(window, { App, GameApp });
