// ui.jsx — 共用 UI 元件：狀態條、按鈕、面板、金幣顯示

const COLORS = {
  bg: '#FFF4DD',
  bgAlt: '#FFE9C2',
  panel: '#FFFFFF',
  ink: '#1a1a1a',
  primary: '#F5A845',
  secondary: '#88C467',
  danger: '#E85C5C',
  blue: '#5BA8E8',
  pink: '#FFB3CC',
  purple: '#B89FE8',
  shadow: 'rgba(26,26,26,0.12)',
};

// 厚實卡通按鈕（粗線條 + 底部陰影 = 立體感）
function ChunkyButton({ children, onClick, color = COLORS.primary, size = 'md', disabled = false, fullWidth = false, style = {} }) {
  const [pressed, setPressed] = React.useState(false);
  const pad = size === 'sm' ? '8px 14px' : size === 'lg' ? '14px 22px' : '11px 18px';
  const fz = size === 'sm' ? 14 : size === 'lg' ? 18 : 16;
  return (
    <button
      onClick={disabled ? null : onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        background: disabled ? '#D5D5D5' : color,
        color: COLORS.ink,
        border: '3px solid #1a1a1a',
        borderRadius: 14,
        padding: pad,
        fontSize: fz,
        fontWeight: 800,
        fontFamily: '"Noto Sans TC", system-ui, sans-serif',
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: pressed ? '0 1px 0 #1a1a1a' : '0 4px 0 #1a1a1a',
        transform: pressed ? 'translateY(3px)' : 'translateY(0)',
        transition: 'transform 0.05s, box-shadow 0.05s',
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled ? 0.7 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// 圓形圖示按鈕
function IconButton({ icon, label, onClick, color = COLORS.primary, badge = null, disabled = false }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <button
        onClick={disabled ? null : onClick}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onTouchStart={() => setPressed(true)}
        onTouchEnd={() => setPressed(false)}
        style={{
          width: 56, height: 56, borderRadius: '50%',
          background: disabled ? '#D5D5D5' : color,
          border: '3px solid #1a1a1a',
          fontSize: 26,
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxShadow: pressed ? '0 1px 0 #1a1a1a' : '0 4px 0 #1a1a1a',
          transform: pressed ? 'translateY(3px)' : 'translateY(0)',
          transition: 'transform 0.05s, box-shadow 0.05s',
          position: 'relative',
          padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <span>{icon}</span>
        {badge !== null && (
          <div style={{
            position: 'absolute', top: -4, right: -4,
            background: COLORS.danger, color: '#fff',
            border: '2px solid #1a1a1a', borderRadius: '50%',
            minWidth: 22, height: 22, padding: '0 5px',
            fontSize: 12, fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{badge}</div>
        )}
      </button>
      <div style={{
        fontSize: 11, fontWeight: 700, color: COLORS.ink,
        fontFamily: '"Noto Sans TC", system-ui, sans-serif',
      }}>{label}</div>
    </div>
  );
}

// 狀態條（橫條）
function StatBar({ icon, value, color, label }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: '#fff',
      border: '2.5px solid #1a1a1a',
      borderRadius: 999,
      padding: '3px 8px 3px 3px',
      boxShadow: '0 2px 0 #1a1a1a',
      fontFamily: '"Noto Sans TC", system-ui, sans-serif',
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: '50%',
        background: color,
        border: '2px solid #1a1a1a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, flexShrink: 0,
      }}>{icon}</div>
      {label && (
        <div style={{ fontSize: 11, fontWeight: 900, color: COLORS.ink, flexShrink: 0, minWidth: 24 }}>{label}</div>
      )}
      <div style={{
        flex: 1, height: 10, borderRadius: 999,
        background: '#F0E5D0',
        border: '2px solid #1a1a1a',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          background: pct < 25 ? COLORS.danger : color,
          transition: 'width 0.4s, background 0.3s',
        }} />
      </div>
    </div>
  );
}

// 金幣 / 點數徽章
function CoinBadge({ icon, value, color = '#F5C24E', onClick, label, unit }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        background: '#fff',
        border: '2.5px solid #1a1a1a',
        borderRadius: 999,
        padding: '3px 10px 3px 3px',
        boxShadow: '0 2px 0 #1a1a1a',
        cursor: onClick ? 'pointer' : 'default',
        fontFamily: '"Noto Sans TC", system-ui, sans-serif',
      }}
    >
      <div style={{
        width: 22, height: 22, borderRadius: '50%',
        background: color, border: '2px solid #1a1a1a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12,
      }}>{icon}</div>
      {label && (
        <span style={{ fontWeight: 800, fontSize: 11, color: '#666' }}>{label}</span>
      )}
      <span style={{ fontWeight: 900, fontSize: 14, color: COLORS.ink }}>{value}</span>
      {unit && (
        <span style={{ fontWeight: 800, fontSize: 11, color: '#666' }}>{unit}</span>
      )}
    </button>
  );
}

// 對話泡泡
function Bubble({ children, side = 'top' }) {
  return (
    <div style={{
      position: 'relative',
      background: '#fff',
      border: '3px solid #1a1a1a',
      borderRadius: 18,
      padding: '8px 14px',
      fontSize: 14,
      fontWeight: 700,
      fontFamily: '"Noto Sans TC", system-ui, sans-serif',
      color: COLORS.ink,
      boxShadow: '0 3px 0 #1a1a1a',
      maxWidth: 200,
      textAlign: 'center',
    }}>
      {children}
      {side === 'top' && (
        <div style={{
          position: 'absolute', bottom: -10, left: '50%',
          width: 0, height: 0,
          marginLeft: -8,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: '12px solid #1a1a1a',
        }}>
          <div style={{
            position: 'absolute', top: -14, left: -6,
            width: 0, height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '9px solid #fff',
          }} />
        </div>
      )}
    </div>
  );
}

// 浮動數字（+1, +5 等動畫）
function FloatingNumber({ x, y, text, color = '#E85C5C' }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      pointerEvents: 'none',
      fontSize: 22, fontWeight: 900,
      color, WebkitTextStroke: '2px #1a1a1a',
      fontFamily: '"Noto Sans TC", system-ui, sans-serif',
      animation: 'floatUp 1.2s ease-out forwards',
      zIndex: 100,
    }}>{text}</div>
  );
}

// 心心 / 愛心粒子
function Hearts({ origin = { x: 100, y: 100 }, count = 5 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: origin.x + (Math.random() - 0.5) * 60,
          top: origin.y,
          fontSize: 24,
          pointerEvents: 'none',
          animation: `heartFloat 1.5s ease-out ${i * 0.1}s forwards`,
          opacity: 0,
          zIndex: 50,
        }}>❤️</div>
      ))}
    </>
  );
}

// Modal 容器
function Modal({ children, onClose, title, color = COLORS.primary }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
      animation: 'fadeIn 0.2s ease',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: COLORS.bg,
        border: '3.5px solid #1a1a1a',
        borderRadius: 22,
        boxShadow: '0 6px 0 #1a1a1a',
        width: '100%', maxWidth: 340,
        maxHeight: '85%',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        animation: 'popIn 0.25s cubic-bezier(.34,1.56,.64,1)',
      }}>
        {title && (
          <div style={{
            background: color, padding: '12px 16px',
            borderBottom: '3px solid #1a1a1a',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{
              fontSize: 18, fontWeight: 900, color: COLORS.ink,
              fontFamily: '"Noto Sans TC", system-ui, sans-serif',
            }}>{title}</div>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: '50%',
              background: '#fff', border: '2.5px solid #1a1a1a',
              fontSize: 16, fontWeight: 900, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 0, lineHeight: 1,
              boxShadow: '0 2px 0 #1a1a1a',
            }}>✕</button>
          </div>
        )}
        <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Toast / 通知泡泡
function Toast({ message, color = COLORS.primary }) {
  return (
    <div style={{
      position: 'absolute', top: 60, left: '50%',
      transform: 'translateX(-50%)',
      background: color,
      border: '3px solid #1a1a1a',
      borderRadius: 14,
      padding: '8px 16px',
      fontSize: 14, fontWeight: 800,
      color: COLORS.ink,
      fontFamily: '"Noto Sans TC", system-ui, sans-serif',
      boxShadow: '0 3px 0 #1a1a1a',
      animation: 'toastIn 0.4s cubic-bezier(.34,1.56,.64,1), toastOut 0.4s 1.6s forwards',
      zIndex: 150,
      whiteSpace: 'nowrap',
    }}>{message}</div>
  );
}

Object.assign(window, {
  COLORS, ChunkyButton, IconButton, StatBar, CoinBadge, Bubble,
  FloatingNumber, Hearts, Modal, Toast,
});
