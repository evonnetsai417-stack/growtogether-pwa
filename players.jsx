// players.jsx — 多玩家檔案系統

const PLAYERS_KEY = 'tamago_players_v1';
const ACTIVE_KEY  = 'tamago_active_v1';
const SAVE_PREFIX = 'tamago_save_';

const AVATARS = ['🐻','🐰','🐸','🐯','🦊','🐼','🦁','🐵','🐨','🦁','🐮','🐷'];
const PLAYER_COLORS = ['#FFB3CC','#88C467','#5BA8E8','#F5C24E','#B89FE8','#F5A845'];

function loadPlayers() {
  try {
    const raw = localStorage.getItem(PLAYERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}
function savePlayers(p) {
  try { localStorage.setItem(PLAYERS_KEY, JSON.stringify(p)); } catch(e) {}
}
function getActivePlayerId() {
  return localStorage.getItem(ACTIVE_KEY);
}
function setActivePlayerId(id) {
  localStorage.setItem(ACTIVE_KEY, id);
}
function loadPlayerSave(playerId) {
  try {
    const raw = localStorage.getItem(SAVE_PREFIX + playerId);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}
function savePlayerSave(playerId, state) {
  try { localStorage.setItem(SAVE_PREFIX + playerId, JSON.stringify(state)); } catch(e) {}
}
function deletePlayerSave(playerId) {
  localStorage.removeItem(SAVE_PREFIX + playerId);
}

// 建立 / 選擇玩家畫面
function PlayerPicker({ players, onPick, onCreate, onDelete }) {
  const [showCreate, setShowCreate] = React.useState(false);
  const [name, setName] = React.useState('');
  const [avatar, setAvatar] = React.useState(AVATARS[0]);
  const [color, setColor] = React.useState(PLAYER_COLORS[0]);

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(180deg, #FFE5B4 0%, #FFD89B 100%)',
      padding: '40px 20px 20px',
      fontFamily: '"Noto Sans TC", system-ui, sans-serif',
      overflow: 'auto',
      boxSizing: 'border-box',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 38, marginBottom: 4 }}>🐣</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#1a1a1a', letterSpacing: 2 }}>一起長大</div>
        <div style={{ fontSize: 12, color: '#888', fontWeight: 800, letterSpacing: 4, marginBottom: 10 }}>GROW TOGETHER</div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#1a1a1a' }}>誰要玩呢？</div>
        <div style={{ fontSize: 13, color: '#666', fontWeight: 700, marginTop: 4 }}>
          每個小朋友都有自己的寵物
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        {players.map(p => {
          const save = loadPlayerSave(p.id);
          return (
            <div key={p.id} style={{
              background: '#fff',
              border: '3px solid #1a1a1a',
              borderRadius: 18,
              padding: 14, position: 'relative',
              boxShadow: '0 4px 0 #1a1a1a',
              cursor: 'pointer',
            }} onClick={() => onPick(p.id)}>
              <button onClick={(e) => {
                e.stopPropagation();
                if (confirm(`要刪除「${p.name}」的紀錄嗎？`)) onDelete(p.id);
              }} style={{
                position: 'absolute', top: -8, right: -8,
                width: 26, height: 26, borderRadius: '50%',
                background: '#fff', border: '2.5px solid #1a1a1a',
                fontSize: 12, fontWeight: 900, cursor: 'pointer',
                boxShadow: '0 2px 0 #1a1a1a', padding: 0,
              }}>✕</button>
              <div style={{
                width: 60, height: 60, margin: '0 auto 8px',
                background: p.color || PLAYER_COLORS[0],
                border: '3px solid #1a1a1a', borderRadius: '50%',
                fontSize: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{p.avatar || '🐻'}</div>
              <div style={{ fontSize: 16, fontWeight: 900, textAlign: 'center', marginBottom: 4 }}>{p.name}</div>
              {save ? (
                <div style={{ fontSize: 11, fontWeight: 700, color: '#666', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 8 }}>
                  <span>🪙{save.coins||0}</span>
                  <span>⭐{save.stars||0}</span>
                </div>
              ) : (
                <div style={{ fontSize: 11, fontWeight: 700, color: '#999', textAlign: 'center' }}>還沒開始</div>
              )}
            </div>
          );
        })}

        {players.length < 4 && (
          <div onClick={() => setShowCreate(true)} style={{
            background: 'rgba(255,255,255,0.4)',
            border: '3px dashed #1a1a1a',
            borderRadius: 18, padding: 14,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', minHeight: 130,
          }}>
            <div style={{ fontSize: 38, color: '#1a1a1a' }}>＋</div>
            <div style={{ fontSize: 13, fontWeight: 800, marginTop: 4 }}>新增小朋友</div>
          </div>
        )}
      </div>

      {showCreate && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.4)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }} onClick={() => setShowCreate(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#FFF4DD',
            border: '3.5px solid #1a1a1a',
            borderRadius: 22, padding: 20,
            boxShadow: '0 6px 0 #1a1a1a',
            width: '100%', maxWidth: 320,
          }}>
            <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 12, textAlign: 'center' }}>
              建立新檔案
            </div>
            <input
              value={name}
              onChange={e => setName(e.target.value.slice(0, 8))}
              placeholder="小朋友的名字"
              style={{
                width: '100%', padding: '10px 14px',
                border: '2.5px solid #1a1a1a', borderRadius: 12,
                fontSize: 16, fontWeight: 700, marginBottom: 12,
                boxSizing: 'border-box',
                fontFamily: '"Noto Sans TC", system-ui',
              }}
            />
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6 }}>選頭像</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4, marginBottom: 12 }}>
              {AVATARS.map(a => (
                <button key={a} onClick={() => setAvatar(a)} style={{
                  fontSize: 22, padding: 4,
                  background: avatar === a ? color : '#fff',
                  border: '2.5px solid #1a1a1a', borderRadius: 10,
                  cursor: 'pointer',
                }}>{a}</button>
              ))}
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6 }}>選顏色</div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {PLAYER_COLORS.map(c => (
                <button key={c} onClick={() => setColor(c)} style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: c, border: '3px solid #1a1a1a',
                  cursor: 'pointer',
                  boxShadow: color === c ? 'inset 0 0 0 3px #fff' : 'none',
                }} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowCreate(false)} style={{
                flex: 1, padding: '10px', border: '2.5px solid #1a1a1a',
                background: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 800,
                cursor: 'pointer', boxShadow: '0 3px 0 #1a1a1a',
                fontFamily: '"Noto Sans TC", system-ui',
              }}>取消</button>
              <button onClick={() => {
                if (name.trim()) {
                  onCreate({
                    id: 'p' + Date.now(),
                    name: name.trim(),
                    avatar, color,
                    createdAt: Date.now(),
                  });
                  setName(''); setShowCreate(false);
                }
              }} style={{
                flex: 1, padding: '10px', border: '2.5px solid #1a1a1a',
                background: '#88C467', borderRadius: 12, fontSize: 14, fontWeight: 800,
                cursor: 'pointer', boxShadow: '0 3px 0 #1a1a1a',
                fontFamily: '"Noto Sans TC", system-ui',
              }}>確定</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 玩家小徽章（顯示在主畫面頂部，點擊可切換）
function PlayerBadge({ player, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: '#fff',
      border: '2.5px solid #1a1a1a',
      borderRadius: 999, padding: '3px 12px 3px 3px',
      cursor: 'pointer',
      boxShadow: '0 2px 0 #1a1a1a',
      fontFamily: '"Noto Sans TC", system-ui',
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: '50%',
        background: player.color || PLAYER_COLORS[0],
        border: '2px solid #1a1a1a',
        fontSize: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{player.avatar || '🐻'}</div>
      <span style={{ fontSize: 13, fontWeight: 800 }}>{player.name}</span>
      <span style={{ fontSize: 9, color: '#666' }}>切換 ▾</span>
    </button>
  );
}

Object.assign(window, {
  PLAYERS_KEY, ACTIVE_KEY, SAVE_PREFIX, AVATARS, PLAYER_COLORS,
  loadPlayers, savePlayers, getActivePlayerId, setActivePlayerId,
  loadPlayerSave, savePlayerSave, deletePlayerSave,
  PlayerPicker, PlayerBadge,
});
