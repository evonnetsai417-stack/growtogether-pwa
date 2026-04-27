// app.jsx — 主程式

const STAGE = { EGG: 0, BABY: 1, ADULT: 2 };
const MAX_STAT = 100;
const XP_TO_HATCH = 50;
const XP_TO_ADULT = 300;
const MIN_BABY_AGE = 86400;
const POKE_XP_DAILY_CAP = 5; // 每日點寵物最多貢獻 5 XP，餵食/玩耍/清潔不設上限

// ── 音效系統（Web Audio API）─────────────────────────────────
const Sound = (() => {
  let _ctx = null;
  const ctx = () => {
    if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (_ctx.state === 'suspended') _ctx.resume();
    return _ctx;
  };
  const tone = (freq, t0, dur, vol=0.22, type='sine') => {
    try {
      const c = ctx(), o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(vol, c.currentTime+t0);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime+t0+dur);
      o.connect(g); g.connect(c.destination);
      o.start(c.currentTime+t0); o.stop(c.currentTime+t0+dur+0.01);
    } catch(e) {}
  };
  return {
    feed:  ()=>{ tone(523,0,0.1); tone(659,0.11,0.12); },
    play:  ()=>{ tone(659,0,0.1); tone(784,0.12,0.15); },
    clean: ()=>{ tone(440,0,0.1); tone(523,0.13,0.12); },
    poke:  ()=>{ tone(880,0,0.07,0.15); },
    point: ()=>{ [523,659,784,1047].forEach((f,i)=>tone(f,i*0.08,0.12)); },
    hatch: ()=>{ [523,587,659,698,784,880,988,1047].forEach((f,i)=>tone(f,i*0.065,0.1)); },
    grow:  ()=>{ [659,784,880,1047,1175].forEach((f,i)=>tone(f,i*0.07,0.12)); },
    buy:   ()=>{ tone(659,0,0.1); tone(784,0.11,0.1); },
    error: ()=>{ tone(220,0,0.15,0.2,'sawtooth'); },
    poop:  ()=>{ tone(330,0,0.08,0.1,'triangle'); },
  };
})();

// 解鎖 iOS AudioContext（需用戶手勢）
document.addEventListener('touchstart', ()=>{ try{ Sound.poke(); }catch(e){} }, { once: true });

// ── 對話台詞 ─────────────────────────────────────────────────
const DIALOGS = {
  feed:  ['好好吃！謝謝你～','嗯嗯！肚子不餓了！','最喜歡吃這個了！','啊嗯！好滿足～','嗯嗯嗯！還要還要！','謝謝你幫我準備食物！','好香好香！','吃飽飽了！開心！'],
  play:  ['哇！好好玩！再來一次！','跳跳跳！好開心！','嘻嘻嘻嘻嘻！','超好玩的啦！','玩玩玩！！！','嗚哇！飛起來了！','跟你玩最開心了！','哈哈哈哈！！'],
  clean: ['乾淨又香香的！','洗澡好舒服～','擦擦乾淨囉！','嗯嗯，清潔溜溜！','謝謝你幫我洗澡！','香香的好喜歡～','乾乾淨淨！舒服！'],
  poke:  ['嗯嗯！好舒服～','嘻嘻！搔癢啦！','喜歡你！❤️','嗚嗚好癢！哈哈！','嘿嘿，再來一次！','我最喜歡你了！','呵呵～好溫暖！','嗯？有人陪我玩！','嗚嗚嗚！太喜歡了！'],
  hungry:['肚子咕嚕咕嚕叫了！','好餓好餓！','肚子餓了～','嗯……好想吃東西'],
  sick:  ['我不舒服… 嗚嗚','頭暈暈的… 要看醫生','好難受喔… 幫幫我'],
  poop:  ['啊啊！幫我清一下！','嗚嗚，有點臭臭的…','快快快！好尷尬！'],
  happy: ['今天好開心！','嘻嘻！最近很快樂！','有你陪真好！','好幸福喔～'],
  capXp: ['今天的互動 XP 用完囉！做好事才能再得 XP 喔！🌟','已經玩很多了！做件好事讓牠長大吧！😊','多做好事才能讓牠更快長大喔！⭐'],
};
const rnd = key => { const a=DIALOGS[key]; return a[Math.floor(Math.random()*a.length)]; };

// ── 每日任務工具 ─────────────────────────────────────────────
function todayStr() { return new Date().toDateString(); }
function genDailyTasks(existing) {
  const today = todayStr();
  if (existing && existing.date === today) return existing;
  const pool = [...DAILY_TASK_POOL].sort(()=>Math.random()-0.5);
  return { date: today, tasks: pool.slice(0,3), doneIds: [] };
}

// ── 新手引導 ─────────────────────────────────────────────────
function Onboarding({ onDone }) {
  const [step, setStep] = React.useState(0);
  const steps = [
    { emoji: '🥚', title: '你的寵物蛋來了！', body: '點點牠讓牠感受到你的愛，做好事可以讓牠孵化！' },
    { emoji: '⭐', title: '做好事得到星星', body: '完成每日任務或讓爸爸媽媽表揚你，就能得到 ⭐，集滿就孵化！' },
    { emoji: '☀️', title: '爸媽的秘密按鈕', body: '右上角的太陽是爸爸媽媽用的，小朋友不用管它喔 😊' },
  ];
  const s = steps[step];
  return (
    <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.55)', zIndex:800, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ background:'#FFF4DD', border:'3.5px solid #1a1a1a', borderRadius:24, padding:28, maxWidth:300, width:'100%', textAlign:'center', boxShadow:'0 8px 0 #1a1a1a', animation:'popIn 0.3s cubic-bezier(.34,1.56,.64,1)' }}>
        <div style={{ fontSize:64, marginBottom:12 }}>{s.emoji}</div>
        <div style={{ fontSize:20, fontWeight:900, marginBottom:8, color:'#1a1a1a', fontFamily:'"Noto Sans TC",system-ui' }}>{s.title}</div>
        <div style={{ fontSize:14, fontWeight:700, color:'#555', marginBottom:20, lineHeight:1.6, fontFamily:'"Noto Sans TC",system-ui' }}>{s.body}</div>
        <div style={{ display:'flex', justifyContent:'center', gap:6, marginBottom:20 }}>
          {steps.map((_,i)=><div key={i} style={{ width:10, height:10, borderRadius:'50%', background: i===step?'#F5A845':'#ddd', border:'2px solid #1a1a1a' }} />)}
        </div>
        <button onClick={()=>{ if(step<steps.length-1) setStep(s=>s+1); else onDone(); }} style={{
          background: step===steps.length-1?COLORS.secondary:COLORS.primary,
          border:'3px solid #1a1a1a', borderRadius:14,
          padding:'12px 32px', fontSize:16, fontWeight:900,
          cursor:'pointer', fontFamily:'"Noto Sans TC",system-ui',
          boxShadow:'0 4px 0 #1a1a1a',
        }}>{step<steps.length-1?'下一步 →':'開始玩！🎉'}</button>
      </div>
    </div>
  );
}

// ── 慶祝動畫 ─────────────────────────────────────────────────
function Celebration({ pts, reason }) {
  const stars = React.useMemo(()=>Array.from({length:18},(_,i)=>({
    id:i, left:Math.random()*100, delay:i*0.06,
  })),[]);
  return (
    <div style={{ position:'absolute', inset:0, zIndex:600, pointerEvents:'none', overflow:'hidden' }}>
      {stars.map(s=>(
        <div key={s.id} style={{
          position:'absolute', left:`${s.left}%`, top:'80%',
          fontSize:22, animation:`heartFloat 1.6s ease-out ${s.delay}s forwards`, opacity:0,
        }}>⭐</div>
      ))}
      <div style={{
        position:'absolute', top:'35%', left:'50%', transform:'translateX(-50%)',
        textAlign:'center', pointerEvents:'none',
        animation:'popIn 0.35s cubic-bezier(.34,1.56,.64,1)',
      }}>
        <div style={{ fontSize:38, fontWeight:900, color:'#F5C24E', WebkitTextStroke:'3px #1a1a1a', paintOrder:'stroke fill', fontFamily:'"Noto Sans TC",system-ui', marginBottom:6 }}>
          太棒了！+{pts}⭐
        </div>
        <div style={{ fontSize:16, fontWeight:800, color:'#fff', WebkitTextStroke:'2px #1a1a1a', paintOrder:'stroke fill', fontFamily:'"Noto Sans TC",system-ui' }}>
          {reason}
        </div>
      </div>
    </div>
  );
}

// ── 主遊戲 ───────────────────────────────────────────────────
function GameApp({ playerId, player, onSwitchPlayer }) {
  const rawSave = loadPlayerSave(playerId);
  const initial = rawSave ? { xp:0, ownedCostumes:[], costume:null, collection:[], interactXpToday:null, dailyTasks:null, ...rawSave } : {
    animalId: ANIMALS[Math.floor(Math.random()*ANIMALS.length)].id,
    stage: STAGE.EGG, petName:'寵物蛋', age:0, xp:0,
    hunger:80, fun:80, energy:80, clean:80, health:100, poop:0,
    coins:5, stars:0,
    inventory:{ apple:2, ball:1, soap:1 },
    deeds: DEFAULT_GOOD_DEEDS,
    sleeping:false, weather:'sunny', lastUpdate:Date.now(),
    ownedCostumes:[], costume:null, collection:[],
    interactXpToday:null, dailyTasks:null,
  };
  // 確保每日任務是最新的
  initial.dailyTasks = genDailyTasks(initial.dailyTasks);

  const [state, setState] = React.useState(initial);
  const [screen, setScreen] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const [floats, setFloats] = React.useState([]);
  const [hearts, setHearts] = React.useState(0);
  const [petBounce, setPetBounce] = React.useState(0);
  const [petAction, setPetAction] = React.useState(null);
  const [draggedItem, setDraggedItem] = React.useState(null);
  const [petPos, setPetPos] = React.useState({ x:0, target:0, dir:1 });
  const [celebration, setCelebration] = React.useState(null);
  const [showNaming, setShowNaming] = React.useState(false);
  const [nameInput, setNameInput] = React.useState('');
  const [showOnboarding, setShowOnboarding] = React.useState(
    !localStorage.getItem('gt_onboarded')
  );

  React.useEffect(()=>{ savePlayerSave(playerId, state); }, [state, playerId]);

  // 走路
  React.useEffect(()=>{
    if(state.stage===STAGE.EGG||state.sleeping||petAction) return;
    const pick=()=>{ const t=(Math.random()-0.5)*140; setPetPos(p=>({...p,target:t,dir:t>p.x?1:-1})); };
    pick();
    const id=setInterval(pick, 5000+Math.random()*3000);
    return ()=>clearInterval(id);
  },[state.stage,state.sleeping,petAction]);

  React.useEffect(()=>{
    let raf;
    const step=()=>{ setPetPos(p=>{ const dx=p.target-p.x; if(Math.abs(dx)<0.5)return p; return{...p,x:p.x+Math.sign(dx)*Math.min(0.6,Math.abs(dx))}; }); raf=requestAnimationFrame(step); };
    raf=requestAnimationFrame(step);
    return ()=>cancelAnimationFrame(raf);
  },[]);

  const isWalking = Math.abs(petPos.target-petPos.x)>1;
  const isNightTime = React.useCallback(()=>{ const h=new Date().getHours(); return h>=21||h<7; },[]);

  // ── Tick ────────────────────────────────────────────────────
  React.useEffect(()=>{
    const tick=setInterval(()=>{
      setState(s=>{
        // 每日任務刷新
        const dailyTasks = genDailyTasks(s.dailyTasks);

        if(s.stage===STAGE.EGG){
          if(s.xp>=XP_TO_HATCH){
            const speciesName=ANIMALS.find(a=>a.id===s.animalId)?.name||'寵物';
            setTimeout(()=>{ Sound.hatch(); setNameInput(speciesName); setShowNaming(true); },300);
            return{...s,stage:STAGE.BABY,age:0,petName:speciesName,dailyTasks};
          }
          return{...s,age:s.age+1,dailyTasks};
        }

        const sleeping=isNightTime();
        const ns={...s,age:s.age+1,sleeping,dailyTasks};
        if(!sleeping){
          ns.hunger=Math.max(0,s.hunger-0.003);
          ns.fun   =Math.max(0,s.fun   -0.002);
          ns.energy=Math.max(0,s.energy-0.002);
          ns.clean =Math.max(0,s.clean -0.0015);
          if(Math.random()<0.00005&&s.poop<3) ns.poop=s.poop+1;
        } else {
          ns.energy=Math.min(MAX_STAT,s.energy+0.05);
          ns.hunger=Math.max(0,s.hunger-0.001);
        }
        if(ns.hunger<10||ns.clean<10||ns.poop>=3){ ns.health=Math.max(0,s.health-0.03); }
        else if(ns.health<100){ ns.health=Math.min(100,s.health+0.05); }

        if(s.stage===STAGE.BABY&&ns.xp>=XP_TO_ADULT&&ns.age>=MIN_BABY_AGE){
          ns.stage=STAGE.ADULT;
          const coll=[...new Set([...(s.collection||[]),s.animalId])];
          ns.collection=coll;
          setTimeout(()=>{ showToast('🌟 長大了！已收錄到圖鑑！',COLORS.secondary); Sound.grow(); },100);
        }
        return ns;
      });
    },1000);
    return ()=>clearInterval(tick);
  },[isNightTime]);

  // 偶爾自動說話
  React.useEffect(()=>{
    if(state.stage===STAGE.EGG) return;
    const id=setInterval(()=>{
      if(Math.random()<0.3){
        if(state.health<50) showToast(rnd('sick'),COLORS.danger);
        else if(state.hunger<30) showToast(rnd('hungry'),COLORS.primary);
        else if(state.poop>0) showToast(rnd('poop'),COLORS.primary);
        else if(state.fun>70&&state.hunger>50) showToast(rnd('happy'),COLORS.secondary);
      }
    },60000);
    return ()=>clearInterval(id);
  },[state.stage,state.health,state.hunger,state.fun,state.poop]);

  function showToast(msg,color=COLORS.primary){ setToast({msg,color,key:Date.now()}); setTimeout(()=>setToast(null),2400); }
  function showFloat(text,color,x=155,y=210){ const id=Date.now()+Math.random(); setFloats(f=>[...f,{id,text,color,x,y}]); setTimeout(()=>setFloats(f=>f.filter(i=>i.id!==id)),1300); }

  // 點寵物 XP（每日上限 5，避免無限點按）
  function addPokeXP(){
    const today=todayStr();
    setState(s=>{
      const cap=s.interactXpToday;
      const usedToday=(cap&&cap.date===today)?cap.xp:0;
      if(usedToday>=POKE_XP_DAILY_CAP) return s; // 今天戳夠了，不再給
      return{...s,xp:s.xp+1,interactXpToday:{date:today,xp:usedToday+1}};
    });
  }

  // 照顧 XP（餵食/玩耍/清潔，不設每日上限）
  function addCareXP(amount){
    setState(s=>({...s,xp:s.xp+amount}));
  }

  function triggerCelebration(pts,reason){
    setCelebration({pts,reason});
    Sound.point();
    setTimeout(()=>setCelebration(null),2500);
  }

  // ── 互動函式 ────────────────────────────────────────────────
  function pokePet(){
    if(state.stage===STAGE.EGG){
      addPokeXP();
      setPetBounce(b=>b+1);
      Sound.poke();
      return;
    }
    setHearts(h=>h+1);
    setState(s=>({...s,fun:Math.min(MAX_STAT,s.fun+3)}));
    addPokeXP();
    setPetBounce(b=>b+1);
    showToast(rnd('poke'),COLORS.pink);
    Sound.poke();
    const acts=['wave','jump','dance','cheer'];
    setPetAction(acts[Math.floor(Math.random()*acts.length)]);
    setTimeout(()=>setPetAction(null),1400);
  }

  function feed(item){
    if((state.inventory[item.id]||0)<=0) return;
    setState(s=>({...s,hunger:Math.min(MAX_STAT,s.hunger+(item.hunger||0)),fun:Math.min(MAX_STAT,s.fun+(item.fun||0)),inventory:{...s.inventory,[item.id]:s.inventory[item.id]-1}}));
    addCareXP(3);
    showFloat(`+${item.hunger||0}`,COLORS.primary);
    showToast(rnd('feed'));
    setHearts(h=>h+1);
    Sound.feed();
    setPetAction('eat'); setTimeout(()=>setPetAction(null),1500);
  }

  function playWith(item){
    if((state.inventory[item.id]||0)<=0) return;
    setState(s=>({...s,fun:Math.min(MAX_STAT,s.fun+(item.fun||0)),energy:Math.max(0,s.energy-5),inventory:{...s.inventory,[item.id]:s.inventory[item.id]-1}}));
    addCareXP(4);
    showFloat(`+${item.fun||0}`,COLORS.blue);
    showToast(rnd('play'),COLORS.blue);
    setHearts(h=>h+2);
    Sound.play();
    setPetAction('jump'); setTimeout(()=>setPetAction(null),1500);
  }

  function clean(item){
    if((state.inventory[item.id]||0)<=0) return;
    setState(s=>({...s,clean:Math.min(MAX_STAT,s.clean+(item.clean||0)),health:Math.min(MAX_STAT,s.health+(item.health||0)),inventory:{...s.inventory,[item.id]:s.inventory[item.id]-1}}));
    addCareXP(2);
    showFloat(`+${item.clean||item.health||0}`,COLORS.secondary);
    showToast(rnd('clean'),COLORS.secondary);
    Sound.clean();
  }

  function buy(category,item){
    if(state.coins<item.price){ Sound.error(); showToast('🪙 金幣不夠！',COLORS.danger); return; }
    setState(s=>({...s,coins:s.coins-item.price,inventory:{...s.inventory,[item.id]:(s.inventory[item.id]||0)+1}}));
    Sound.buy(); showToast(`買了 ${item.name}！`,COLORS.secondary);
  }

  function buyCostume(id){
    const c=COSTUMES.find(x=>x.id===id);
    if(!c||state.coins<c.price){ Sound.error(); showToast('🪙 金幣不夠！',COLORS.danger); return; }
    if((state.ownedCostumes||[]).includes(id)) return;
    setState(s=>({...s,coins:s.coins-c.price,ownedCostumes:[...(s.ownedCostumes||[]),id]}));
    Sound.buy(); showToast(`買了${c.name}！快幫牠穿上 ✨`,COLORS.pink);
  }

  function wearCostume(id){
    setState(s=>({...s,costume:s.costume===id?null:id}));
  }

  // 家長給獎勵：只影響星星/金幣，不影響 XP（XP 只能靠照顧寵物）
  function addPoints(pts,reason){
    setState(s=>{
      let stars=s.stars+pts, coins=s.coins;
      const bonus=Math.floor(stars/10);
      if(bonus>0){ coins+=bonus; stars=stars%10; }
      return{...s,stars,coins};
    });
    triggerCelebration(pts,reason);
  }

  // 每日任務完成：給獎勵（星星），不給 XP
  function completeDailyTask(taskId){
    if(!state.dailyTasks) return;
    const task=state.dailyTasks.tasks.find(t=>t.id===taskId);
    if(!task||state.dailyTasks.doneIds.includes(taskId)) return;
    const pts=2; // 每個每日任務給 2 顆星
    setState(s=>{
      let stars=s.stars+pts, coins=s.coins;
      if(Math.floor(stars/10)>0){ coins+=Math.floor(stars/10); stars=stars%10; }
      return{...s,stars,coins,dailyTasks:{...s.dailyTasks,doneIds:[...s.dailyTasks.doneIds,taskId]}};
    });
    triggerCelebration(pts,task.text);
  }

  function clearPoop(){
    setState(s=>({...s,poop:0,clean:Math.min(MAX_STAT,s.clean+10)}));
    showToast('💩 清乾淨了！',COLORS.secondary);
    Sound.poop();
  }

  function visitDoctor(){
    if(state.coins<5){ Sound.error(); showToast('看醫生要 5 🪙',COLORS.danger); return; }
    setState(s=>({...s,coins:s.coins-5,health:Math.min(MAX_STAT,s.health+50)}));
    showToast('💊 好多了！謝謝醫生！',COLORS.secondary);
    showFloat('+50',COLORS.secondary);
  }

  // 搖晃搔癢
  React.useEffect(()=>{
    let last={x:0,y:0,z:0},cnt=0,lastT=0;
    const onMotion=e=>{ const a=e.accelerationIncludingGravity; if(!a)return; const d=Math.abs((a.x||0)-last.x)+Math.abs((a.y||0)-last.y)+Math.abs((a.z||0)-last.z); last={x:a.x||0,y:a.y||0,z:a.z||0}; if(d>25){cnt++;if(cnt>3&&Date.now()-lastT>2000){lastT=Date.now();cnt=0;if(state.stage!==STAGE.EGG){setState(s=>({...s,fun:Math.min(MAX_STAT,s.fun+8)}));addPokeXP();setHearts(h=>h+3);showToast('哈哈！好癢好癢！停下來啦！',COLORS.pink);Sound.poke();}}} };
    window.addEventListener('devicemotion',onMotion);
    return ()=>window.removeEventListener('devicemotion',onMotion);
  },[state.stage]);

  function handleDrop(){ if(!draggedItem)return; const{type,item}=draggedItem; if(type==='food')feed(item); else if(type==='toy')playWith(item); else clean(item); setDraggedItem(null); }

  const mood=React.useMemo(()=>{
    if(state.sleeping) return 'sleepy';
    if(state.health<40) return 'sick';
    if(state.weather==='storm') return 'scared';
    if(state.hunger<25) return 'sad';
    if(state.energy<25) return 'sleepy';
    if(state.clean<25) return 'sad';
    if(state.fun>70&&state.hunger>50) return 'happy';
    return 'normal';
  },[state]);

  const quickItems=React.useMemo(()=>{
    const r={food:null,toy:null,care:null};
    for(const t of['food','toy','care']){ const o=SHOP_ITEMS[t].filter(it=>(state.inventory[it.id]||0)>0); if(o.length)r[t]=o[0]; }
    return r;
  },[state.inventory]);

  // 進度文字（對小朋友友善）
  const progressText=React.useMemo(()=>{
    if(state.stage===STAGE.ADULT) return null;
    const target=state.stage===STAGE.EGG?XP_TO_HATCH:XP_TO_ADULT;
    const pct=Math.min(100,Math.round(state.xp/target*100));
    if(pct===0)   return state.stage===STAGE.EGG?'好好餵牠、陪牠玩，牠就會孵化！🥚':'餵食、玩耍、清潔都能讓牠成長！';
    if(pct<30)    return '繼續照顧牠，給牠食物和玩耍時間！';
    if(pct<60)    return '照顧得很好！繼續餵食和玩耍！✨';
    if(pct<90)    return `快${state.stage===STAGE.EGG?'孵化':'長大'}了！再多照顧幾次！🎉`;
    return `就差一點點！🌟`;
  },[state.stage,state.xp]);


  const renderPet=()=>{
    if(state.stage===STAGE.EGG) return <Egg size={220} cracked={state.xp>=XP_TO_HATCH*0.7} />;
    return <Pet animalId={state.animalId} mood={mood} sleeping={state.sleeping} dirty={state.clean<40} size={220} action={petAction} walking={isWalking&&!petAction} facing={petPos.dir} costume={state.costume} />;
  };

  const isDay=!state.sleeping;
  const today=todayStr();
  const todayInteractXp=(state.interactXpToday&&state.interactXpToday.date===today)?state.interactXpToday.xp:0;
  const xpPct=state.stage!==STAGE.ADULT?Math.min(100,Math.round(state.xp/(state.stage===STAGE.EGG?XP_TO_HATCH:XP_TO_ADULT)*100)):100;

  return (
    <div style={{
      width:'100%',height:'100%',
      background: isDay?'linear-gradient(180deg,#FFE5B4,#FFD89B 50%,#FFC988)':'linear-gradient(180deg,#2D3561,#4A5390 60%,#6B72A6)',
      position:'relative',overflow:'hidden',transition:'background 0.8s',
      fontFamily:'"Noto Sans TC",system-ui,sans-serif',
    }}>
      {/* 太陽/月亮 → 家長模式 */}
      <div onClick={()=>setScreen('parent')} style={{ position:'absolute',top:14,right:16,fontSize:30,animation:'gentleSpin 20s linear infinite',cursor:'pointer',zIndex:12 }}>
        {isDay?'☀️':'🌙'}
      </div>

      {/* 裝飾 */}
      {isDay&&(<><div style={{position:'absolute',top:44,left:20,fontSize:22,opacity:0.85}}>☁️</div><div style={{position:'absolute',top:72,right:70,fontSize:18,opacity:0.7}}>☁️</div></>)}
      {!isDay&&(<><div style={{position:'absolute',top:30,left:30,fontSize:12,color:'#fff'}}>✦</div><div style={{position:'absolute',top:58,left:80,fontSize:8,color:'#fff'}}>✦</div><div style={{position:'absolute',top:48,right:50,fontSize:10,color:'#fff'}}>✦</div></>)}

      {/* ─ 頂部一排：金幣 + 玩家徽章 + 點數 ─ */}
      <div style={{ position:'absolute',top:18,left:12,right:52,display:'flex',alignItems:'center',justifyContent:'space-between',zIndex:11 }}>
        <CoinBadge icon="🪙" value={state.coins} />
        <PlayerBadge player={player} onClick={onSwitchPlayer} />
        <CoinBadge icon="⭐" value={state.stars} color="#FFB3CC" />
      </div>

      {/* 狀態條 */}
      {state.stage!==STAGE.EGG&&(
        <div style={{ position:'absolute',top:68,left:12,right:12,display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,zIndex:10 }}>
          <StatBar icon="🍚" label="餓" value={state.hunger} color={COLORS.primary}/>
          <StatBar icon="😄" label="樂" value={state.fun}    color={COLORS.blue}/>
          <StatBar icon="💤" label="累" value={state.energy} color={COLORS.purple}/>
          <StatBar icon="🛁" label="淨" value={state.clean}  color={COLORS.secondary}/>
        </div>
      )}

      {/* 健康警示 */}
      {state.health<50&&state.stage!==STAGE.EGG&&(
        <div style={{ position:'absolute',top:162,left:12,right:12,background:'#FFE5E5',border:'2.5px solid #E85C5C',borderRadius:12,padding:'4px 10px',fontSize:12,fontWeight:800,color:'#E85C5C',textAlign:'center',zIndex:10,animation:'pulse 1s infinite' }}>
          ⚠️ {state.petName}生病了！需要看醫生
        </div>
      )}

      {/* 寵物名字（可點擊改名）*/}
      {state.stage!==STAGE.EGG&&(
        <button onClick={()=>{ setNameInput(state.petName); setShowNaming(true); }} style={{ position:'absolute',top:174,left:'50%',transform:'translateX(-50%)',background:'#fff',border:'2.5px solid #1a1a1a',borderRadius:999,padding:'3px 14px',fontSize:13,fontWeight:800,boxShadow:'0 2px 0 #1a1a1a',zIndex:10,whiteSpace:'nowrap',cursor:'pointer' }}>
          ✏️ {state.petName}
        </button>
      )}

      {/* 寵物（costume 已在 SVG 內部跟著動）*/}
      <div onClick={pokePet} onDragOver={e=>e.preventDefault()} onDrop={handleDrop}
        style={{ position:'absolute',top:200,left:'50%',transform:`translateX(calc(-50% + ${petPos.x}px))`,width:220,height:240,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',zIndex:5,animation:petBounce>0?'pokeBounce 0.4s':'none' }}
        key={petBounce}>
        <div style={{ position:'absolute',bottom:8,left:'50%',transform:'translateX(-50%)',width:130,height:14,background:'rgba(0,0,0,0.18)',borderRadius:'50%',filter:'blur(2px)' }} />
        <div>
          {renderPet()}
        </div>
        {state.poop>0&&state.stage!==STAGE.EGG&&(
          <div style={{ position:'absolute',bottom:0,left:20,display:'flex',gap:4 }}>
            {Array.from({length:state.poop}).map((_,i)=>(
              <button key={i} onClick={e=>{e.stopPropagation();clearPoop();}} style={{ background:'transparent',border:'none',fontSize:28,cursor:'pointer',animation:'wiggle 0.6s infinite' }}>💩</button>
            ))}
          </div>
        )}
      </div>

      {/* 愛心 */}
      {hearts>0&&state.stage!==STAGE.EGG&&(
        <div style={{ position:'absolute',top:'38%',left:'50%',transform:'translateX(-50%)' }}>
          {Array.from({length:Math.min(hearts,5)}).map((_,i)=>(
            <div key={`${hearts}-${i}`} style={{ position:'absolute',left:(Math.random()-0.5)*80,fontSize:22,animation:`heartFloat 1.4s ease-out ${i*0.08}s forwards` }}>❤️</div>
          ))}
        </div>
      )}

      {/* 浮動數字 */}
      {floats.map(f=>(
        <div key={f.id} style={{ position:'absolute',left:f.x,top:f.y,fontSize:22,fontWeight:900,color:f.color,WebkitTextStroke:'2px #1a1a1a',paintOrder:'stroke fill',fontFamily:'"Noto Sans TC",system-ui',animation:'floatUp 1.2s ease-out forwards',zIndex:80,pointerEvents:'none' }}>{f.text}</div>
      ))}

      {/* 蛋泡泡 */}
      {state.stage===STAGE.EGG&&(
        <div style={{ position:'absolute',top:440,left:0,right:0,display:'flex',justifyContent:'center',zIndex:10 }}>
          <Bubble>點點我讓我孵化！</Bubble>
        </div>
      )}

      {/* ─ 底部 ─ */}
      <div style={{ position:'absolute',bottom:18,left:12,right:12,zIndex:10 }}>

        {/* 升級鼓勵條 */}
        {state.stage!==STAGE.ADULT&&(
          <div style={{ background:'rgba(255,255,255,0.92)',border:'2.5px solid #1a1a1a',borderRadius:14,padding:'7px 12px',marginBottom:8,boxShadow:'0 2px 0 #1a1a1a' }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5 }}>
              <div style={{ fontSize:11,fontWeight:800,color:'#555',flex:1,fontFamily:'"Noto Sans TC",system-ui' }}>{progressText}</div>
              <button onClick={()=>setScreen('catalog')} style={{ background:'transparent',border:'none',fontSize:11,fontWeight:800,color:COLORS.blue,cursor:'pointer',padding:'0 0 0 8px',flexShrink:0 }}>📖 圖鑑</button>
            </div>
            <div style={{ height:10,borderRadius:999,background:'#F0E5D0',border:'2px solid #1a1a1a',overflow:'hidden' }}>
              <div style={{ width:`${xpPct}%`,height:'100%',background:state.stage===STAGE.EGG?'linear-gradient(90deg,#F5C24E,#F5A845)':COLORS.purple,transition:'width 0.6s' }} />
            </div>
          </div>
        )}

        {/* 6 個按鈕合一排，平均分配 */}
        <div style={{ display:'flex', alignItems:'flex-end', background:'rgba(255,255,255,0.88)', backdropFilter:'blur(8px)', border:'2.5px solid #1a1a1a', borderRadius:18, padding:'10px 4px 8px', boxShadow:'0 3px 0 #1a1a1a' }}>
          {/* 食物/玩具/清潔 */}
          {[
            {type:'food', color:COLORS.primary,   label:'食物'},
            {type:'toy',  color:COLORS.blue,       label:'玩具'},
            {type:'care', color:COLORS.secondary,  label:'清潔'},
          ].map(({type,color,label})=>{
            const it=quickItems[type];
            const disabled=state.stage===STAGE.EGG;
            return (
              <div key={type} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
                {!disabled && it ? (
                  <button draggable onDragStart={()=>setDraggedItem({type,item:it})}
                    onClick={()=>{ if(type==='food')feed(it); else if(type==='toy')playWith(it); else clean(it); }}
                    style={{ width:50,height:50,borderRadius:12,background:color,border:'2.5px solid #1a1a1a',fontSize:24,cursor:'grab',boxShadow:'0 3px 0 #1a1a1a',position:'relative',padding:0 }}>
                    {it.emoji}
                    <div style={{ position:'absolute',top:-5,right:-5,background:'#fff',color:'#1a1a1a',border:'2px solid #1a1a1a',borderRadius:'50%',width:18,height:18,fontSize:10,fontWeight:900,display:'flex',alignItems:'center',justifyContent:'center' }}>{state.inventory[it.id]}</div>
                  </button>
                ) : (
                  <button onClick={()=>!disabled&&setScreen('shop')} style={{ width:50,height:50,borderRadius:12,background:'#fff',border:'2.5px dashed #ccc',fontSize:20,cursor:disabled?'default':'pointer',color:'#ccc',opacity:disabled?0.4:1 }}>+</button>
                )}
                <div style={{ fontSize:10,fontWeight:700,color:'#666' }}>{label}</div>
              </div>
            );
          })}
          {/* 分隔線 */}
          <div style={{ width:1,height:44,background:'#ddd',alignSelf:'center',flexShrink:0,margin:'0 2px' }}/>
          {/* 商店/遊戲/醫生 — 同樣 flex:1 */}
          {[
            {icon:'🏪',label:'商店',  color:COLORS.primary,   onClick:()=>setScreen('shop'),   disabled:false},
            {icon:'🎮',label:'遊戲',  color:COLORS.pink,      onClick:()=>setScreen('gamemenu'),disabled:state.stage===STAGE.EGG||state.sleeping},
            {icon:'🏥',label:'醫生',  color:COLORS.secondary, onClick:visitDoctor,              disabled:state.stage===STAGE.EGG, badge:state.health<50?'!':null},
          ].map(btn=>(
            <div key={btn.label} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
              <IconButton icon={btn.icon} label="" color={btn.color} onClick={btn.onClick} disabled={btn.disabled} badge={btn.badge||null}/>
              <div style={{ fontSize:10,fontWeight:700,color:'#666' }}>{btn.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─ 子畫面 ─ */}
      {screen==='shop'&&(
        <ShopScreen coins={state.coins} inventory={state.inventory}
          ownedCostumes={state.ownedCostumes||[]} activeCostume={state.costume}
          onBuy={buy} onBuyCostume={buyCostume} onWearCostume={wearCostume}
          onClose={()=>setScreen(null)}/>
      )}
      {screen==='catalog'&&<CatalogScreen collection={state.collection||[]} onClose={()=>setScreen(null)}/>}
      {screen==='parent'&&(
        <ParentScreen stars={state.stars} xp={state.xp} stage={state.stage}
          deeds={state.deeds} dailyTasks={state.dailyTasks} collection={state.collection||[]}
          onClose={()=>setScreen(null)} onAddPoints={addPoints}
          onAddDeed={d=>setState(s=>({...s,deeds:[...s.deeds,d]}))}
          onRemoveDeed={id=>setState(s=>({...s,deeds:s.deeds.filter(d=>d.id!==id)}))}
          onCompleteTask={completeDailyTask}/>
      )}
      {screen==='gamemenu'&&(
        <Modal title="🎮 選擇遊戲" onClose={()=>setScreen(null)} color={COLORS.pink}>
          <div style={{ display:'grid',gap:10,fontFamily:'"Noto Sans TC",system-ui' }}>
            {[{id:'butterfly',emoji:'🦋',name:'抓蝴蝶',desc:'點蝴蝶得分',color:COLORS.pink},{id:'fruit',emoji:'🍎',name:'接水果',desc:'滑籃子接水果',color:COLORS.primary},{id:'memory',emoji:'🧠',name:'記憶翻牌',desc:'配對相同圖案',color:COLORS.purple},{id:'rhythm',emoji:'🐸',name:'青蛙跳跳',desc:'節奏點擊',color:COLORS.secondary}].map(g=>(
              <button key={g.id} onClick={()=>setScreen(g.id)} style={{ display:'flex',alignItems:'center',gap:12,background:g.color,border:'2.5px solid #1a1a1a',borderRadius:14,padding:12,cursor:'pointer',boxShadow:'0 3px 0 #1a1a1a',textAlign:'left',fontFamily:'"Noto Sans TC",system-ui' }}>
                <div style={{ fontSize:36 }}>{g.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:16,fontWeight:900 }}>{g.name}</div>
                  <div style={{ fontSize:12,fontWeight:700,color:'#444' }}>{g.desc}</div>
                </div>
                <div style={{ fontSize:18,fontWeight:900 }}>▶</div>
              </button>
            ))}
          </div>
        </Modal>
      )}
      {screen==='butterfly'&&<MiniGame onClose={()=>setScreen(null)} onWin={c=>setState(s=>({...s,coins:s.coins+c,fun:Math.min(MAX_STAT,s.fun+15)}))}/>}
      {screen==='fruit'&&typeof CatchFruitGame!=='undefined'&&<CatchFruitGame onClose={()=>setScreen(null)} onWin={c=>setState(s=>({...s,coins:s.coins+c,fun:Math.min(MAX_STAT,s.fun+15)}))}/>}
      {screen==='memory'&&typeof MemoryGame!=='undefined'&&<MemoryGame onClose={()=>setScreen(null)} onWin={c=>setState(s=>({...s,coins:s.coins+c,fun:Math.min(MAX_STAT,s.fun+15)}))}/>}
      {screen==='rhythm'&&typeof RhythmJumpGame!=='undefined'&&<RhythmJumpGame onClose={()=>setScreen(null)} onWin={c=>setState(s=>({...s,coins:s.coins+c,fun:Math.min(MAX_STAT,s.fun+15)}))}/>}

      {/* 命名 Modal */}
      {showNaming&&(
        <div style={{ position:'absolute',inset:0,background:'rgba(0,0,0,0.5)',zIndex:700,display:'flex',alignItems:'center',justifyContent:'center',padding:24 }}>
          <div style={{ background:'#FFF4DD',border:'3.5px solid #1a1a1a',borderRadius:24,padding:24,maxWidth:300,width:'100%',textAlign:'center',boxShadow:'0 8px 0 #1a1a1a',animation:'popIn 0.3s cubic-bezier(.34,1.56,.64,1)' }}>
            <div style={{ fontSize:48,marginBottom:8 }}>✏️</div>
            <div style={{ fontSize:18,fontWeight:900,marginBottom:6,fontFamily:'"Noto Sans TC",system-ui',color:'#1a1a1a' }}>幫你的寵物取個名字！</div>
            <div style={{ fontSize:12,color:'#888',fontWeight:700,marginBottom:14,fontFamily:'"Noto Sans TC",system-ui' }}>最多 8 個字</div>
            <input
              value={nameInput}
              onChange={e=>setNameInput(e.target.value.slice(0,8))}
              onKeyDown={e=>e.key==='Enter'&&nameInput.trim()&&(setState(s=>({...s,petName:nameInput.trim()})),setShowNaming(false),nameInput.trim()!==state.petName&&showToast(`🎉 ${nameInput.trim()} 好可愛的名字！`,COLORS.pink))}
              maxLength={8}
              autoFocus
              style={{ width:'100%',border:'2.5px solid #1a1a1a',borderRadius:14,padding:'12px',fontSize:22,fontWeight:800,textAlign:'center',marginBottom:16,boxSizing:'border-box',fontFamily:'"Noto Sans TC",system-ui' }}
            />
            <button onClick={()=>{
              if(!nameInput.trim()) return;
              setState(s=>({...s,petName:nameInput.trim()}));
              setShowNaming(false);
              showToast(`🎉 ${nameInput.trim()} 好可愛的名字！`,COLORS.pink);
            }} style={{ width:'100%',background:COLORS.secondary,border:'3px solid #1a1a1a',borderRadius:14,padding:'12px',fontSize:16,fontWeight:900,cursor:'pointer',fontFamily:'"Noto Sans TC",system-ui',boxShadow:'0 4px 0 #1a1a1a' }}>
              確定！
            </button>
          </div>
        </div>
      )}

      {/* 慶祝動畫 */}
      {celebration&&<Celebration pts={celebration.pts} reason={celebration.reason}/>}

      {/* Toast */}
      {toast&&<Toast key={toast.key} message={toast.msg} color={toast.color}/>}

      {/* 新手引導 */}
      {showOnboarding&&<Onboarding onDone={()=>{ localStorage.setItem('gt_onboarded','1'); setShowOnboarding(false); }}/>}
    </div>
  );
}

// ── 根元件 ───────────────────────────────────────────────────
function App() {
  const [players, setPlayers] = React.useState(()=>loadPlayers());
  const [activeId, setActiveId] = React.useState(()=>{ const id=getActivePlayerId(); const list=loadPlayers(); return id&&list.find(p=>p.id===id)?id:null; });
  const [picking, setPicking] = React.useState(false);

  React.useEffect(()=>{ savePlayers(players); },[players]);

  function handlePick(id){ setActivePlayerId(id); setActiveId(id); setPicking(false); }
  function handleCreate(p){ const next=[...players,p]; setPlayers(next); savePlayers(next); handlePick(p.id); }
  function handleDelete(id){ const next=players.filter(p=>p.id!==id); setPlayers(next); savePlayers(next); deletePlayerSave(id); if(activeId===id){ setActiveId(null); localStorage.removeItem(ACTIVE_KEY); } }

  if(!activeId||picking) return <PlayerPicker players={players} onPick={handlePick} onCreate={handleCreate} onDelete={handleDelete}/>;
  const player=players.find(p=>p.id===activeId);
  if(!player){ setActiveId(null); return null; }
  return <GameApp key={activeId} playerId={activeId} player={player} onSwitchPlayer={()=>setPicking(true)}/>;
}

Object.assign(window,{App,GameApp});
