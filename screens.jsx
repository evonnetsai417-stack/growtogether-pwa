// screens.jsx — 子畫面、商店、家長模式、迷你遊戲

// ── 預設好行為清單 ────────────────────────────────────────────
const DEFAULT_GOOD_DEEDS = [
  { id: 'd1',  emoji: '🍽️', text: '幫忙收碗盤',         points: 1 },
  { id: 'd2',  emoji: '🧹', text: '掃地或拖地',         points: 2 },
  { id: 'd3',  emoji: '🧦', text: '自己摺衣服',         points: 1 },
  { id: 'd4',  emoji: '📚', text: '主動完成功課',       points: 3 },
  { id: 'd5',  emoji: '🦷', text: '自己刷牙洗臉',       points: 1 },
  { id: 'd8',  emoji: '🤝', text: '對人有禮貌',         points: 1 },
  { id: 'd9',  emoji: '😊', text: '幫助弟弟妹妹',       points: 2 },
  { id: 'd10', emoji: '🌱', text: '幫忙澆花/做家事',   points: 2 },
  { id: 'd11', emoji: '🧠', text: '看書 30 分鐘',       points: 3 },
  { id: 'd12', emoji: '💪', text: '運動 30 分鐘',       points: 3 },
  { id: 'd13', emoji: '🌟', text: '今天特別乖',         points: 5 },
  { id: 'd14', emoji: '🏆', text: '完成一件困難的事',   points: 8 },
  { id: 'd15', emoji: '🎉', text: '超棒的特別表現',     points: 10 },
];

// ── 每日任務題庫 ──────────────────────────────────────────────
const DAILY_TASK_POOL = [
  { id: 'dt1',  emoji: '🍽️', text: '幫忙收碗盤',          xp: 10 },
  { id: 'dt2',  emoji: '🦷', text: '自己刷牙洗臉',        xp: 8  },
  { id: 'dt3',  emoji: '📚', text: '看書 15 分鐘',        xp: 10 },
  { id: 'dt4',  emoji: '🛏️', text: '自己整理床鋪',       xp: 8  },
  { id: 'dt5',  emoji: '🧹', text: '整理自己的東西',      xp: 8  },
  { id: 'dt6',  emoji: '🚿', text: '自己洗澡',            xp: 10 },
  { id: 'dt7',  emoji: '👟', text: '自己把鞋子放好',      xp: 5  },
  { id: 'dt8',  emoji: '🍱', text: '把飯吃完不挑食',      xp: 8  },
  { id: 'dt9',  emoji: '🤝', text: '對人說謝謝或對不起', xp: 5  },
  { id: 'dt10', emoji: '😊', text: '幫家人做一件事',      xp: 10 },
  { id: 'dt11', emoji: '💤', text: '準時上床睡覺',        xp: 8  },
  { id: 'dt12', emoji: '🎒', text: '自己準備書包',        xp: 8  },
];

// ── 商店物品 ──────────────────────────────────────────────────
const SHOP_ITEMS = {
  food: [
    { id: 'apple',   emoji: '🍎', name: '蘋果',   price: 2, hunger: 20 },
    { id: 'carrot',  emoji: '🥕', name: '紅蘿蔔', price: 2, hunger: 20 },
    { id: 'rice',    emoji: '🍚', name: '飯糰',   price: 3, hunger: 35 },
    { id: 'fish',    emoji: '🐟', name: '魚',     price: 4, hunger: 40 },
    { id: 'cake',    emoji: '🍰', name: '蛋糕',   price: 5, hunger: 25, fun: 15 },
    { id: 'milk',    emoji: '🥛', name: '牛奶',   price: 2, hunger: 15 },
  ],
  toy: [
    { id: 'ball',  emoji: '⚽', name: '球',   price: 3, fun: 25 },
    { id: 'block', emoji: '🧩', name: '積木', price: 4, fun: 30 },
    { id: 'kite',  emoji: '🪁', name: '風箏', price: 5, fun: 35 },
    { id: 'drum',  emoji: '🥁', name: '小鼓', price: 4, fun: 30 },
  ],
  care: [
    { id: 'soap',     emoji: '🧼', name: '肥皂',   price: 2, clean: 50 },
    { id: 'brush',    emoji: '🪥', name: '牙刷',   price: 2, clean: 30 },
    { id: 'shampoo',  emoji: '🛁', name: '沐浴乳', price: 3, clean: 60 },
    { id: 'medicine', emoji: '💊', name: '藥',     price: 5, health: 60 },
    { id: 'bandage',  emoji: '🩹', name: 'OK繃',  price: 3, health: 30 },
  ],
};

// ── 寵物裝扮 ──────────────────────────────────────────────────
const COSTUMES = [
  { id: 'hat',     emoji: '🎩', name: '魔術帽', price: 5, pos: 'head' },
  { id: 'crown',   emoji: '👑', name: '皇冠',   price: 8, pos: 'head' },
  { id: 'flower',  emoji: '🌸', name: '頭花',   price: 3, pos: 'head' },
  { id: 'ribbon',  emoji: '🎀', name: '蝴蝶結', price: 3, pos: 'head' },
  { id: 'glasses', emoji: '🕶️', name: '墨鏡',  price: 4, pos: 'face' },
  { id: 'scarf',   emoji: '🧣', name: '圍巾',   price: 4, pos: 'neck' },
  { id: 'bowtie',  emoji: '🎗️', name: '領結',  price: 3, pos: 'neck' },
  { id: 'party',   emoji: '🥳', name: '派對帽', price: 6, pos: 'head' },
];

// ── 商店畫面（含裝扮分頁）────────────────────────────────────
function ShopScreen({ coins, inventory, ownedCostumes, activeCostume, onBuy, onBuyCostume, onWearCostume, onClose }) {
  const [tab, setTab] = React.useState('food');
  const tabs = [
    { id: 'food',    label: '食物', icon: '🍎', color: COLORS.primary },
    { id: 'toy',     label: '玩具', icon: '🎾', color: COLORS.blue },
    { id: 'care',    label: '清潔', icon: '🧼', color: COLORS.secondary },
    { id: 'costume', label: '扮裝', icon: '🎩', color: COLORS.pink },
  ];

  return (
    <Modal title="🏪 小商店" onClose={onClose} color={COLORS.primary}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
        <div style={{ fontSize:13, fontWeight:700, fontFamily:'"Noto Sans TC",system-ui' }}>用金幣買東西照顧寵物～</div>
        <CoinBadge icon="🪙" value={coins} />
      </div>

      <div style={{ display:'flex', gap:5, marginBottom:12 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            flex:1, padding:'7px 2px',
            background: tab===t.id ? t.color : '#fff',
            border:'2.5px solid #1a1a1a', borderRadius:10,
            fontWeight:800, fontSize:12,
            fontFamily:'"Noto Sans TC",system-ui',
            cursor:'pointer',
            boxShadow: tab===t.id ? '0 2px 0 #1a1a1a' : '0 3px 0 #1a1a1a',
            transform: tab===t.id ? 'translateY(1px)' : 'none',
          }}>{t.icon}<br/>{t.label}</button>
        ))}
      </div>

      {tab !== 'costume' ? (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {SHOP_ITEMS[tab].map(item => {
            const canBuy = coins >= item.price;
            return (
              <div key={item.id} style={{
                background:'#fff', border:'2.5px solid #1a1a1a',
                borderRadius:14, padding:'10px 8px 8px', textAlign:'center',
                boxShadow:'0 3px 0 #1a1a1a',
              }}>
                <div style={{ fontSize:34, lineHeight:1, marginBottom:4 }}>{item.emoji}</div>
                <div style={{ fontSize:12, fontWeight:800, marginBottom:2, fontFamily:'"Noto Sans TC",system-ui' }}>{item.name}</div>
                {item.hunger && <div style={{ fontSize:10, color:'#888', marginBottom:4 }}>+{item.hunger} 餓</div>}
                {item.fun    && !item.hunger && <div style={{ fontSize:10, color:'#888', marginBottom:4 }}>+{item.fun} 樂</div>}
                {item.fun    && item.hunger  && <div style={{ fontSize:10, color:'#888', marginBottom:4 }}>+{item.hunger} 餓 +{item.fun} 樂</div>}
                {item.clean  && <div style={{ fontSize:10, color:'#888', marginBottom:4 }}>+{item.clean} 淨</div>}
                {item.health && <div style={{ fontSize:10, color:'#888', marginBottom:4 }}>+{item.health} 健康</div>}
                <button onClick={()=>canBuy && onBuy(tab, item)} disabled={!canBuy} style={{
                  width:'100%', background: canBuy?'#F5C24E':'#D5D5D5',
                  border:'2px solid #1a1a1a', borderRadius:999,
                  padding:'4px 0', fontWeight:800, fontSize:13,
                  cursor: canBuy?'pointer':'not-allowed',
                  fontFamily:'"Noto Sans TC",system-ui', opacity: canBuy?1:0.7,
                }}>🪙 {item.price}</button>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <div style={{ fontSize:12, color:'#666', fontWeight:700, marginBottom:10, textAlign:'center', fontFamily:'"Noto Sans TC",system-ui' }}>
            幫你的寵物打扮吧！穿戴後在主畫面就能看到 ✨
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {COSTUMES.map(c => {
              const owned = (ownedCostumes||[]).includes(c.id);
              const active = activeCostume === c.id;
              const canBuy = coins >= c.price;
              return (
                <div key={c.id} style={{
                  background: active ? '#FFF4E8' : '#fff',
                  border: `2.5px solid ${active?COLORS.primary:'#1a1a1a'}`,
                  borderRadius:14, padding:'10px 8px 8px', textAlign:'center',
                  boxShadow: active ? `0 3px 0 ${COLORS.primary}` : '0 3px 0 #1a1a1a',
                }}>
                  <div style={{ fontSize:34, lineHeight:1, marginBottom:4 }}>{c.emoji}</div>
                  <div style={{ fontSize:12, fontWeight:800, marginBottom:6, fontFamily:'"Noto Sans TC",system-ui' }}>{c.name}</div>
                  {owned ? (
                    <button onClick={()=>onWearCostume(c.id)} style={{
                      width:'100%', background: active?COLORS.primary:COLORS.secondary,
                      border:'2px solid #1a1a1a', borderRadius:999,
                      padding:'4px 0', fontWeight:800, fontSize:12,
                      cursor:'pointer', fontFamily:'"Noto Sans TC",system-ui',
                    }}>{active ? '✓ 穿著中' : '穿上'}</button>
                  ) : (
                    <button onClick={()=>canBuy && onBuyCostume(c.id)} disabled={!canBuy} style={{
                      width:'100%', background: canBuy?'#F5C24E':'#D5D5D5',
                      border:'2px solid #1a1a1a', borderRadius:999,
                      padding:'4px 0', fontWeight:800, fontSize:12,
                      cursor: canBuy?'pointer':'not-allowed',
                      fontFamily:'"Noto Sans TC",system-ui', opacity: canBuy?1:0.7,
                    }}>🪙 {c.price}</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Modal>
  );
}

// ── 收藏圖鑑 ──────────────────────────────────────────────────
function CatalogScreen({ collection, onClose }) {
  const allAnimals = window.ANIMALS || [];
  return (
    <Modal title="📖 寵物圖鑑" onClose={onClose} color={COLORS.blue}>
      <div style={{ fontFamily:'"Noto Sans TC",system-ui' }}>
        <div style={{ fontSize:13, fontWeight:700, color:'#666', marginBottom:12, textAlign:'center' }}>
          養大的寵物會記錄在這裡！共 {collection.length}/{allAnimals.length} 種
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8 }}>
          {allAnimals.map(a => {
            const collected = collection.includes(a.id);
            return (
              <div key={a.id} style={{
                background: collected ? '#fff' : '#F5F5F5',
                border:'2.5px solid #1a1a1a', borderRadius:12,
                padding:'10px 4px', textAlign:'center',
                boxShadow:'0 2px 0 #1a1a1a',
                opacity: collected ? 1 : 0.45,
              }}>
                <div style={{ fontSize:28, filter: collected ? 'none' : 'grayscale(1)', marginBottom:4 }}>
                  {collected ? '🌟' : '❓'}
                </div>
                <div style={{ fontSize:11, fontWeight:800, color: collected?COLORS.ink:'#999' }}>
                  {collected ? a.name : '???'}
                </div>
              </div>
            );
          })}
        </div>
        {collection.length === 0 && (
          <div style={{ textAlign:'center', marginTop:16, fontSize:13, color:'#999', fontWeight:700 }}>
            養大你的寵物，牠就會被收錄到圖鑑！🐾
          </div>
        )}
      </div>
    </Modal>
  );
}

// ── 家長模式 ──────────────────────────────────────────────────
function ParentScreen({ stars, xp=0, stage=0, deeds, dailyTasks, collection, onClose, onAddPoints, onAddDeed, onRemoveDeed, onCompleteTask }) {
  const [unlocked, setUnlocked] = React.useState(false);
  const [pin, setPin] = React.useState('');
  const [pinError, setPinError] = React.useState(false);
  const [showAdd, setShowAdd] = React.useState(false);
  const [showChangePin, setShowChangePin] = React.useState(false);
  const [newText, setNewText] = React.useState('');
  const [newPoints, setNewPoints] = React.useState(1);
  const [newPin1, setNewPin1] = React.useState('');
  const [newPin2, setNewPin2] = React.useState('');
  const [pinChangeMsg, setPinChangeMsg] = React.useState('');

  const correctPin = localStorage.getItem('gt_parent_pin') || '1234';

  function tryUnlock() {
    if (pin === correctPin) { setUnlocked(true); setPinError(false); }
    else { setPinError(true); setPin(''); }
  }

  function saveNewPin() {
    if (newPin1.length < 4) { setPinChangeMsg('密碼至少 4 位數'); return; }
    if (newPin1 !== newPin2) { setPinChangeMsg('兩次輸入不一樣，請再試'); return; }
    localStorage.setItem('gt_parent_pin', newPin1);
    setNewPin1(''); setNewPin2('');
    setPinChangeMsg('✓ 密碼已更新！');
    setTimeout(() => { setPinChangeMsg(''); setShowChangePin(false); }, 1500);
  }

  if (!unlocked) {
    return (
      <Modal title="👨‍👩‍👧 家長模式" onClose={onClose} color={COLORS.purple}>
        <div style={{ textAlign:'center', padding:12, fontFamily:'"Noto Sans TC",system-ui' }}>
          <div style={{ fontSize:48, marginBottom:8 }}>🔒</div>
          <div style={{ fontSize:14, fontWeight:700, color:'#666', marginBottom:14 }}>請輸入家長密碼</div>
          <input type="password" value={pin}
            onChange={e=>{ setPin(e.target.value); setPinError(false); }}
            onKeyDown={e=>e.key==='Enter'&&tryUnlock()}
            placeholder="••••" maxLength={8}
            style={{
              width:'100%', padding:'10px 14px',
              border:`2.5px solid ${pinError?'#E85C5C':'#1a1a1a'}`,
              borderRadius:12, fontSize:22, fontWeight:800, textAlign:'center',
              boxSizing:'border-box', marginBottom:6, fontFamily:'system-ui',
              background: pinError?'#FFF0F0':'#fff',
            }}
          />
          {pinError && <div style={{ fontSize:12, color:'#E85C5C', fontWeight:700, marginBottom:10 }}>密碼錯誤，請再試一次</div>}
          {!pinError && <div style={{ marginBottom:14 }}/>}
          <ChunkyButton fullWidth color={COLORS.purple} onClick={tryUnlock}>進入家長模式</ChunkyButton>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="👨‍👩‍👧 家長模式" onClose={onClose} color={COLORS.purple}>
      <div style={{ fontFamily:'"Noto Sans TC",system-ui' }}>

        {/* 點數 + XP 摘要 */}
        <div style={{ background:'#fff', border:'2.5px solid #1a1a1a', borderRadius:16, padding:12, marginBottom:12, boxShadow:'0 3px 0 #1a1a1a' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <div>
              <div style={{ fontSize:11, color:'#666', fontWeight:700 }}>目前累積</div>
              <div style={{ fontSize:26, fontWeight:900 }}>⭐ {stars}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:11, color:'#666', fontWeight:700 }}>距離下個金幣</div>
              <div style={{ fontSize:14, fontWeight:800 }}>還差 {10-(stars%10)} ⭐</div>
            </div>
          </div>
          <div style={{ height:10, borderRadius:999, background:'#F0E5D0', border:'2px solid #1a1a1a', overflow:'hidden', marginBottom:6 }}>
            <div style={{ width:`${(stars%10)*10}%`, height:'100%', background:COLORS.purple, transition:'width 0.4s' }} />
          </div>
          <div style={{ fontSize:11, color:'#666', textAlign:'center', fontWeight:600 }}>每 10 ⭐ 自動換成 1 🪙 金幣</div>

          {stage < 2 && (
            <div style={{ marginTop:10, padding:'8px 10px', background:'#F9F4FF', borderRadius:10, border:'2px solid #B89FE8' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <span style={{ fontSize:12, fontWeight:800, color:'#7A5ABF' }}>{stage===0?'🥚 孵化進度':'🌱 成長進度'}</span>
                <span style={{ fontSize:12, fontWeight:800, color:'#7A5ABF' }}>{xp} / {stage===0?50:300} XP</span>
              </div>
              <div style={{ height:10, borderRadius:999, background:'#E8D5FF', border:'1.5px solid #B89FE8', overflow:'hidden' }}>
                <div style={{ width:`${Math.min(100,Math.round(xp/(stage===0?50:300)*100))}%`, height:'100%', background:'#B89FE8', transition:'width 0.5s' }} />
              </div>
              <div style={{ fontSize:11, color:'#888', marginTop:4, fontWeight:600 }}>
                XP 只能靠餵食、玩耍、清潔累積，⭐ 是購物用的獎勵
              </div>
            </div>
          )}
        </div>

        {/* 每日任務 */}
        {dailyTasks && (
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:14, fontWeight:800, marginBottom:8 }}>📋 今日任務</div>
            {dailyTasks.tasks.map(t => {
              const done = dailyTasks.doneIds.includes(t.id);
              return (
                <div key={t.id} style={{
                  display:'flex', alignItems:'center', gap:10,
                  background: done?'#F0FFF4':'#fff',
                  border:`2.5px solid ${done?COLORS.secondary:'#1a1a1a'}`,
                  borderRadius:12, padding:'8px 10px', marginBottom:6,
                  boxShadow:'0 2px 0 #1a1a1a',
                }}>
                  <div style={{ fontSize:22 }}>{t.emoji}</div>
                  <div style={{ flex:1, fontSize:13, fontWeight:700 }}>{t.text}</div>
                  <div style={{ fontSize:11, color:'#888', fontWeight:700, flexShrink:0 }}>+{t.xp} XP</div>
                  {done ? (
                    <div style={{ fontSize:18 }}>✅</div>
                  ) : (
                    <button onClick={()=>onCompleteTask(t.id)} style={{
                      background:COLORS.secondary, border:'2px solid #1a1a1a',
                      borderRadius:999, padding:'4px 10px',
                      fontWeight:800, fontSize:12, cursor:'pointer',
                      fontFamily:'"Noto Sans TC",system-ui',
                      boxShadow:'0 2px 0 #1a1a1a',
                    }}>完成！</button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 好行為清單 */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <span style={{ fontSize:14, fontWeight:800 }}>👍 好行為清單</span>
          <button onClick={()=>setShowAdd(s=>!s)} style={{
            background:COLORS.secondary, border:'2px solid #1a1a1a',
            borderRadius:999, padding:'3px 10px',
            fontSize:12, fontWeight:800, cursor:'pointer',
            fontFamily:'"Noto Sans TC",system-ui',
          }}>+ 新增</button>
        </div>

        {showAdd && (
          <div style={{ background:'#fff', border:'2.5px dashed #1a1a1a', borderRadius:12, padding:10, marginBottom:10 }}>
            <input value={newText} onChange={e=>setNewText(e.target.value)} placeholder="例：自己刷牙"
              style={{ width:'100%', padding:'6px 10px', border:'2px solid #1a1a1a', borderRadius:8, fontSize:13, marginBottom:6, boxSizing:'border-box', fontFamily:'"Noto Sans TC",system-ui' }}
            />
            <div style={{ display:'flex', gap:6, alignItems:'center', flexWrap:'wrap' }}>
              <span style={{ fontSize:12, fontWeight:700 }}>點數：</span>
              {[1,2,3,5,8,10].map(p=>(
                <button key={p} onClick={()=>setNewPoints(p)} style={{
                  background: newPoints===p?COLORS.purple:'#fff',
                  border:'2px solid #1a1a1a', borderRadius:8,
                  padding:'3px 8px', fontWeight:800, fontSize:12,
                  cursor:'pointer', fontFamily:'"Noto Sans TC",system-ui',
                }}>{p}⭐</button>
              ))}
              <button onClick={()=>{ if(newText.trim()){ onAddDeed({id:'d'+Date.now(),emoji:'✨',text:newText.trim(),points:newPoints}); setNewText('');setNewPoints(1);setShowAdd(false); } }} style={{
                marginLeft:'auto', background:COLORS.secondary,
                border:'2px solid #1a1a1a', borderRadius:8,
                padding:'4px 10px', fontWeight:800, fontSize:12,
                cursor:'pointer', fontFamily:'"Noto Sans TC",system-ui',
              }}>確定</button>
            </div>
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:14 }}>
          {deeds.map(d=>(
            <div key={d.id} style={{
              display:'flex', alignItems:'center', gap:10,
              background:'#fff', border:'2.5px solid #1a1a1a',
              borderRadius:12, padding:'8px 10px', boxShadow:'0 2px 0 #1a1a1a',
            }}>
              <div style={{ fontSize:22 }}>{d.emoji}</div>
              <div style={{ flex:1, fontSize:14, fontWeight:700 }}>{d.text}</div>
              <button onClick={()=>onAddPoints(d.points,d.text)} style={{
                background:COLORS.purple, color:'#fff',
                border:'2px solid #1a1a1a', borderRadius:999,
                padding:'5px 12px', fontWeight:800, fontSize:13,
                cursor:'pointer', fontFamily:'"Noto Sans TC",system-ui',
                boxShadow:'0 2px 0 #1a1a1a',
              }}>+{d.points}⭐</button>
              {d.id.length > 4 && !['d1','d2','d3','d4','d5','d8','d9','d10','d11','d12'].includes(d.id) && (
                <button onClick={()=>onRemoveDeed(d.id)} style={{ background:'transparent', border:'none', fontSize:14, cursor:'pointer', color:'#999' }}>✕</button>
              )}
            </div>
          ))}
        </div>

        {/* 更改密碼 */}
        <div style={{ borderTop:'2px solid #eee', paddingTop:12 }}>
          <button onClick={()=>setShowChangePin(s=>!s)} style={{
            background:'#fff', border:'2px solid #1a1a1a', borderRadius:999,
            padding:'5px 14px', fontSize:12, fontWeight:800, cursor:'pointer',
            fontFamily:'"Noto Sans TC",system-ui', boxShadow:'0 2px 0 #1a1a1a',
          }}>🔑 更改家長密碼</button>

          {showChangePin && (
            <div style={{ marginTop:10, background:'#fff', border:'2.5px solid #1a1a1a', borderRadius:12, padding:12 }}>
              <div style={{ fontSize:12, fontWeight:700, marginBottom:6, color:'#666' }}>新密碼（4 位數以上）</div>
              <input type="password" value={newPin1} onChange={e=>setNewPin1(e.target.value)} placeholder="新密碼"
                style={{ width:'100%', border:'2px solid #1a1a1a', borderRadius:8, padding:'8px', fontSize:16, textAlign:'center', marginBottom:6, boxSizing:'border-box' }}
              />
              <input type="password" value={newPin2} onChange={e=>setNewPin2(e.target.value)} placeholder="再輸入一次"
                style={{ width:'100%', border:'2px solid #1a1a1a', borderRadius:8, padding:'8px', fontSize:16, textAlign:'center', marginBottom:8, boxSizing:'border-box' }}
              />
              {pinChangeMsg && <div style={{ fontSize:12, fontWeight:700, color: pinChangeMsg.startsWith('✓')?COLORS.secondary:'#E85C5C', marginBottom:6, textAlign:'center' }}>{pinChangeMsg}</div>}
              <button onClick={saveNewPin} style={{
                width:'100%', background:COLORS.purple, border:'2px solid #1a1a1a',
                borderRadius:999, padding:'6px', fontWeight:800, fontSize:13,
                cursor:'pointer', fontFamily:'"Noto Sans TC",system-ui',
              }}>儲存</button>
            </div>
          )}
        </div>

      </div>
    </Modal>
  );
}

// ── 迷你遊戲：抓蝴蝶 ────────────────────────────────────────
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
      setRunning(false); setDone(true);
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
          y: 50 + Math.random() * 260,
          color: ['#FFB3CC','#88C467','#5BA8E8','#F5C24E','#B89FE8'][Math.floor(Math.random()*5)],
        }];
      });
    }, 700);
    return () => clearInterval(spawner);
  }, [running]);

  React.useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setButterflies(b => b.slice(-5)), 1200);
    return () => clearInterval(t);
  }, [running]);

  return (
    <Modal title="🦋 抓蝴蝶遊戲" onClose={onClose} color={COLORS.pink}>
      <div style={{ fontFamily:'"Noto Sans TC",system-ui' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          <div style={{ fontSize:14, fontWeight:800 }}>分數：<span style={{ color:COLORS.danger }}>{score}</span></div>
          <div style={{ fontSize:14, fontWeight:800 }}>時間：<span style={{ color:COLORS.blue }}>{Math.max(0,time)} 秒</span></div>
        </div>
        <div style={{
          position:'relative', width:'100%', height:340,
          background:'linear-gradient(180deg,#C8E8F5,#E8F8D5)',
          border:'3px solid #1a1a1a', borderRadius:14, overflow:'hidden', boxShadow:'0 3px 0 #1a1a1a',
        }}>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:60, background:'#88C467', borderTop:'3px solid #1a1a1a' }} />
          <div style={{ position:'absolute', top:20, left:30, fontSize:26 }}>☁️</div>
          <div style={{ position:'absolute', top:40, right:30, fontSize:22 }}>☁️</div>
          <div style={{ position:'absolute', bottom:50, left:40, fontSize:22 }}>🌸</div>
          <div style={{ position:'absolute', bottom:50, right:50, fontSize:22 }}>🌼</div>
          {butterflies.map(bf=>(
            <button key={bf.id} onClick={()=>{ setScore(s=>s+1); setButterflies(b=>b.filter(x=>x.id!==bf.id)); }}
              style={{ position:'absolute', left:bf.x, top:bf.y, width:44, height:44, border:'none', background:'transparent', cursor:'pointer', padding:0, animation:'butterfly 0.5s infinite alternate' }}>
              <svg viewBox="0 0 50 50" width="44" height="44">
                <ellipse cx="15" cy="20" rx="12" ry="10" fill={bf.color} stroke="#1a1a1a" strokeWidth="2.5"/>
                <ellipse cx="35" cy="20" rx="12" ry="10" fill={bf.color} stroke="#1a1a1a" strokeWidth="2.5"/>
                <ellipse cx="15" cy="32" rx="9" ry="7" fill={bf.color} stroke="#1a1a1a" strokeWidth="2.5"/>
                <ellipse cx="35" cy="32" rx="9" ry="7" fill={bf.color} stroke="#1a1a1a" strokeWidth="2.5"/>
                <ellipse cx="25" cy="25" rx="2.5" ry="14" fill="#1a1a1a"/>
              </svg>
            </button>
          ))}
          {done && (
            <div style={{ position:'absolute', inset:0, background:'rgba(255,255,255,0.92)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12 }}>
              <div style={{ fontSize:44 }}>🎉</div>
              <div style={{ fontSize:22, fontWeight:900 }}>遊戲結束！</div>
              <div style={{ fontSize:16, fontWeight:800 }}>抓到 {score} 隻蝴蝶</div>
              <div style={{ background:COLORS.primary, padding:'8px 16px', border:'3px solid #1a1a1a', borderRadius:999, fontSize:16, fontWeight:900, boxShadow:'0 3px 0 #1a1a1a' }}>+{Math.floor(score/3)} 🪙 獎勵</div>
              <ChunkyButton color={COLORS.primary} onClick={onClose}>回家</ChunkyButton>
            </div>
          )}
        </div>
        <div style={{ marginTop:8, fontSize:12, color:'#666', textAlign:'center', fontWeight:700 }}>
          點擊蝴蝶得 1 分 · 每 3 分換 1 金幣
        </div>
      </div>
    </Modal>
  );
}

Object.assign(window, {
  DEFAULT_GOOD_DEEDS, SHOP_ITEMS, COSTUMES, DAILY_TASK_POOL,
  ShopScreen, CatalogScreen, ParentScreen, MiniGame,
});
