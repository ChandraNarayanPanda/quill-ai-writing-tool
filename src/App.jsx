import { useState, useRef, useEffect } from "react";

const WRITING_MODES = [
  { id: "improve",           label: "POLISH",    icon: "◈", color: "#00ffcc", glow: "#00ffcc" },
  { id: "expand",            label: "EXPAND",    icon: "⊕", color: "#ff00ff", glow: "#ff00ff" },
  { id: "shorten",           label: "CONDENSE",  icon: "⊖", color: "#ffff00", glow: "#ffff00" },
  { id: "tone_professional", label: "FORMALIZE", icon: "▣", color: "#00aaff", glow: "#00aaff" },
  { id: "tone_casual",       label: "CASUALIZE", icon: "◇", color: "#ff6600", glow: "#ff6600" },
  { id: "creative",          label: "VIVIFY",    icon: "✶", color: "#ff3366", glow: "#ff3366" },
];

const SYSTEM_PROMPT = `You are an elite writing assistant. When the user provides text and a transformation mode, return ONLY the transformed text — no preamble, no explanation, no quotes. Just the improved writing itself.

Modes:
- improve: Fix grammar, improve word choice, enhance flow and clarity
- expand: Add meaningful depth, examples, context — typically 1.5–2x the length
- shorten: Cut ruthlessly to core meaning, preserve all key ideas
- tone_professional: Rewrite for formal, professional business contexts
- tone_casual: Make warm, conversational, and approachable
- creative: Inject vivid imagery, metaphors, and creative expression

Return ONLY the transformed text.`;

export default function App() {
  const [inputText, setInputText]   = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode]             = useState(WRITING_MODES[0]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [copied, setCopied]         = useState(false);
  const canvasRef                   = useRef(null);
  const animRef                     = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let t = 0;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "rgba(0,255,204,0.035)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 48) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += 48) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      // Scanline sweep
      const sl = (t * 1.2) % H;
      const g = ctx.createLinearGradient(0, sl-50, 0, sl+50);
      g.addColorStop(0,   "rgba(0,255,204,0)");
      g.addColorStop(0.5, "rgba(0,255,204,0.05)");
      g.addColorStop(1,   "rgba(0,255,204,0)");
      ctx.fillStyle = g; ctx.fillRect(0, sl-50, W, 100);

      // Corner glows
      const blob = (x, y, r, c) => {
        const bg = ctx.createRadialGradient(x,y,0,x,y,r);
        bg.addColorStop(0, c); bg.addColorStop(1, "transparent");
        ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
      };
      blob(0, 0, 280, "rgba(0,255,204,0.07)");
      blob(W, H, 320, "rgba(255,0,255,0.05)");
      blob(W, 0, 200, "rgba(0,170,255,0.04)");

      t++;
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, []);

  const handleTransform = async () => {
    if (!inputText.trim()) return;
    setLoading(true); setError(""); setOutputText("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: `Mode: ${mode.id}\n\nText:\n${inputText}` }],
        }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error.message); return; }
      const result = data.content?.map(b => b.text || "").join("") || "";
      let i = 0;
      const tick = setInterval(() => {
        i += 5; setOutputText(result.slice(0, i));
        if (i >= result.length) { setOutputText(result); clearInterval(tick); }
      }, 12);
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => { if (!outputText) return; setInputText(outputText); setOutputText(""); };

  return (
    <div style={s.root}>
      <canvas ref={canvasRef} style={s.canvas} />

      {/* HEADER */}
      <header style={s.header}>
        <div style={s.logoWrap}>
          <span style={{ ...s.logoStar, color: mode.color, textShadow: `0 0 24px ${mode.glow}, 0 0 48px ${mode.glow}55` }}>✦</span>
          <div>
            <div style={s.logoTitle}>QUILL</div>
            <div style={s.logoSub}>AI · WRITING · STUDIO</div>
          </div>
        </div>
        <div style={s.headerRight}>
          <span style={s.pill}>claude-sonnet-4</span>
          <span style={{ ...s.dot, background: mode.color, boxShadow: `0 0 10px ${mode.glow}` }} />
          <span style={{ ...s.online, color: mode.color }}>ONLINE</span>
        </div>
      </header>

      {/* MODES */}
      <div style={s.modeRow}>
        {WRITING_MODES.map(m => (
          <button key={m.id} onClick={() => setMode(m)} style={{
            ...s.modeBtn,
            borderColor: mode.id === m.id ? m.color : "#111",
            background:  mode.id === m.id ? `${m.color}12` : "#040404",
            boxShadow:   mode.id === m.id ? `0 0 20px ${m.color}33, inset 0 0 10px ${m.color}0a` : "none",
          }}>
            <span style={{ fontSize: 18, color: mode.id === m.id ? m.color : "#333",
              textShadow: mode.id === m.id ? `0 0 14px ${m.glow}` : "none" }}>{m.icon}</span>
            <span style={{ fontSize: 9, letterSpacing: "2px",
              color: mode.id === m.id ? m.color : "#333" }}>{m.label}</span>
          </button>
        ))}
      </div>

      {/* EDITOR */}
      <div style={s.editorGrid}>

        {/* Input */}
        <div style={{ ...s.panel, borderColor: "#111" }}>
          <div style={s.panelBar}>
            <span style={s.tag}>// INPUT</span>
            <span style={{ ...s.tag, color: "#222" }}>{inputText.length} chars</span>
          </div>
          <Corner color={mode.color} pos="tl" />
          <Corner color={mode.color} pos="br" />
          <textarea
            style={{ ...s.textarea, caretColor: mode.color }}
            placeholder="// paste your writing here..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            spellCheck={false}
          />
          <button
            onClick={handleTransform}
            disabled={loading || !inputText.trim()}
            style={{
              ...s.runBtn,
              borderColor: mode.color,
              color: mode.color,
              opacity: loading || !inputText.trim() ? 0.3 : 1,
              boxShadow: loading || !inputText.trim() ? "none"
                : `0 0 28px ${mode.glow}44, inset 0 0 14px ${mode.glow}0d`,
            }}
          >
            {loading
              ? <Bars color={mode.color} />
              : <span style={s.runInner}><span>{mode.icon}</span><span>RUN {mode.label}</span><span>→</span></span>
            }
          </button>
        </div>

        {/* Divider */}
        <div style={s.divWrap}>
          <div style={{ ...s.divLine, background: `linear-gradient(to bottom,transparent,${mode.color}88,transparent)` }} />
          <button onClick={handleSwap} disabled={!outputText} style={{
            ...s.swapBtn,
            borderColor: outputText ? mode.color : "#1a1a1a",
            color: outputText ? mode.color : "#222",
            boxShadow: outputText ? `0 0 14px ${mode.glow}44` : "none",
          }}>⇄</button>
          <div style={{ ...s.divLine, background: `linear-gradient(to bottom,transparent,${mode.color}88,transparent)` }} />
        </div>

        {/* Output */}
        <div style={{ ...s.panel, borderColor: outputText ? `${mode.color}55` : "#111",
          boxShadow: outputText ? `0 0 30px ${mode.glow}18` : "none" }}>
          <div style={s.panelBar}>
            <span style={s.tag}>// OUTPUT</span>
            <button onClick={handleCopy} disabled={!outputText} style={{
              ...s.copyBtn,
              borderColor: outputText ? mode.color : "#1a1a1a",
              color: outputText ? mode.color : "#222",
            }}>{copied ? "✓ COPIED" : "COPY"}</button>
          </div>
          {outputText && <><Corner color={mode.color} pos="tl" /><Corner color={mode.color} pos="br" /></>}
          <div style={{
            ...s.outputBox,
            color: error ? "#ff4466" : outputText ? "#ddd" : "#1e1e1e",
          }}>
            {error || outputText || (loading ? "processing..." : "// output appears here...")}
            {(loading || outputText) && <Cursor color={mode.color} />}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={s.footer}>
        <span style={{ color: "#252525" }}>[ QUILL v1.0 ]</span>
        <span style={{ color: "#1a1a1a" }}>·</span>
        <span style={{ color: "#252525" }}>ANTHROPIC CLAUDE API</span>
        <span style={{ color: "#1a1a1a" }}>·</span>
        <span style={{ color: mode.color, textShadow: `0 0 8px ${mode.glow}` }}>■ ACTIVE</span>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #000 !important; }
        textarea::placeholder { color: #1e1e1e; }
        textarea:focus { outline: none; }
        button { cursor: pointer; }
        @keyframes bar  { 0%,100%{transform:scaleY(.25);opacity:.3} 50%{transform:scaleY(1);opacity:1} }
        @keyframes blink{ 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}

function Corner({ color, pos }) {
  const isTop = pos === "tl";
  return <div style={{
    position:"absolute",
    ...(isTop ? { top:-1, left:-1, borderTop:`2px solid ${color}`, borderLeft:`2px solid ${color}` }
              : { bottom:-1, right:-1, borderBottom:`2px solid ${color}`, borderRight:`2px solid ${color}` }),
    width:16, height:16, pointerEvents:"none",
  }} />;
}

function Bars({ color }) {
  return (
    <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:4, height:20 }}>
      {[0,1,2,3].map(i => (
        <span key={i} style={{
          width:3, height:20, borderRadius:2,
          background: color, display:"block",
          animation:`bar 0.55s ease-in-out infinite`,
          animationDelay:`${i*0.11}s`, transformOrigin:"bottom",
        }} />
      ))}
    </span>
  );
}

function Cursor({ color }) {
  return <span style={{
    display:"inline-block", width:8, height:14, marginLeft:3,
    verticalAlign:"middle", background:color, borderRadius:1,
    animation:"blink 0.85s step-end infinite",
  }} />;
}

const s = {
  root:{
    minHeight:"100vh", background:"#000",
    fontFamily:"'Share Tech Mono',monospace",
    display:"flex", flexDirection:"column",
    padding:"24px", gap:"18px",
    position:"relative", overflow:"hidden",
  },
  canvas:{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 },
  header:{ display:"flex", justifyContent:"space-between", alignItems:"center", zIndex:10, position:"relative" },
  logoWrap:{ display:"flex", alignItems:"center", gap:14 },
  logoStar:{ fontSize:32, lineHeight:1, transition:"all 0.3s" },
  logoTitle:{ fontFamily:"'Bebas Neue',sans-serif", fontSize:38, color:"#fff", letterSpacing:8, lineHeight:1 },
  logoSub:{ fontSize:9, color:"#333", letterSpacing:4, marginTop:2 },
  headerRight:{ display:"flex", alignItems:"center", gap:10 },
  pill:{ fontSize:9, color:"#2a2a2a", border:"1px solid #111", padding:"3px 10px", borderRadius:2, letterSpacing:1 },
  dot:{ width:7, height:7, borderRadius:"50%", transition:"all 0.3s" },
  online:{ fontSize:9, letterSpacing:2, transition:"color 0.3s" },

  modeRow:{
    display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:8,
    position:"relative", zIndex:10,
  },
  modeBtn:{
    border:"1px solid", borderRadius:2, padding:"10px 6px",
    display:"flex", flexDirection:"column", alignItems:"center", gap:4,
    transition:"all 0.2s ease", fontFamily:"'Share Tech Mono',monospace",
  },

  editorGrid:{
    display:"grid", gridTemplateColumns:"1fr 50px 1fr",
    flex:1, position:"relative", zIndex:10, minHeight:400,
  },
  panel:{
    background:"#020202", border:"1px solid",
    padding:16, display:"flex", flexDirection:"column",
    gap:12, position:"relative", transition:"all 0.3s",
  },
  panelBar:{ display:"flex", justifyContent:"space-between", alignItems:"center" },
  tag:{ fontSize:9, color:"#2a2a2a", letterSpacing:2 },

  textarea:{
    flex:1, background:"transparent", border:"none",
    color:"#bbb", fontSize:13, lineHeight:"1.85",
    fontFamily:"'Share Tech Mono',monospace",
    resize:"none", minHeight:280,
  },
  runBtn:{
    background:"transparent", border:"1px solid",
    borderRadius:2, padding:12, fontSize:10,
    letterSpacing:2, transition:"all 0.2s",
    fontFamily:"'Share Tech Mono',monospace",
  },
  runInner:{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 },

  divWrap:{
    display:"flex", flexDirection:"column", alignItems:"center",
    justifyContent:"center", gap:12, padding:"16px 0",
    borderTop:"1px solid #080808", borderBottom:"1px solid #080808",
  },
  divLine:{ flex:1, width:1 },
  swapBtn:{
    background:"#040404", border:"1px solid", borderRadius:2,
    width:32, height:32, fontSize:14, transition:"all 0.2s",
    display:"flex", alignItems:"center", justifyContent:"center",
    fontFamily:"'Share Tech Mono',monospace",
  },

  outputBox:{
    flex:1, fontSize:13, lineHeight:"1.85",
    whiteSpace:"pre-wrap", wordBreak:"break-word",
    overflow:"auto", minHeight:280, transition:"color 0.2s",
  },
  copyBtn:{
    background:"transparent", border:"1px solid",
    borderRadius:2, padding:"2px 8px",
    fontSize:9, letterSpacing:2, transition:"all 0.2s",
    fontFamily:"'Share Tech Mono',monospace",
  },

  footer:{
    display:"flex", alignItems:"center", justifyContent:"center",
    gap:12, fontSize:9, letterSpacing:2, zIndex:10, position:"relative",
  },
};
