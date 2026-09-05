'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const modes = ['Flirty', 'Romantic', 'Cheeky', 'Confident', 'Caring'];
const spiceNames = ['Sweet', 'Warm', 'Playful', 'Bold'];
const starters = [
  'Tell me something that made you smile today.',
  'Give me a cheeky compliment.',
  'What would your perfect night look like?',
  'I need a little company tonight.',
];
const welcomes = {
  Flirty: "Well hello there. I was hoping you'd drop by. 😉",
  Romantic: "Come sit with me. Let's make tonight feel a little more special. ❤️",
  Cheeky: "About time you arrived. I was beginning to think you were shy. 😏",
  Confident: "You've got my attention. Tell me what you're thinking.",
  Caring: "I'm glad you're here. How are you really feeling tonight?",
};

export default function Home() {
  const [adult, setAdult] = useState(false);
  const [mode, setMode] = useState('Flirty');
  const [spice, setSpice] = useState(2);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notice, setNotice] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    try {
      if (localStorage.getItem('after-dark-adult') === 'yes') setAdult(true);
      const saved = localStorage.getItem('after-dark-chat');
      if (saved) setMessages(JSON.parse(saved));
      const savedMode = localStorage.getItem('after-dark-mode');
      const savedSpice = localStorage.getItem('after-dark-spice');
      if (savedMode && modes.includes(savedMode)) setMode(savedMode);
      if (savedSpice) setSpice(Math.min(3, Math.max(0, Number(savedSpice))));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('after-dark-chat', JSON.stringify(messages)); } catch {}
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, busy]);

  useEffect(() => {
    try {
      localStorage.setItem('after-dark-mode', mode);
      localStorage.setItem('after-dark-spice', String(spice));
    } catch {}
  }, [mode, spice]);

  function enter() {
    localStorage.setItem('after-dark-adult', 'yes');
    setAdult(true);
    if (!messages.length) setMessages([{ role: 'assistant', content: welcomes[mode] }]);
  }

  function newChat() {
    setMessages([{ role: 'assistant', content: welcomes[mode] }]);
    setNotice('New conversation started');
    setTimeout(() => setNotice(''), 1800);
  }

  function clearHistory() {
    setMessages([]);
    try { localStorage.removeItem('after-dark-chat'); } catch {}
    setShowSettings(false);
  }

  function useStarter(text) {
    setInput(text);
    setTimeout(() => document.getElementById('chat-input')?.focus(), 0);
  }

  function exportChat() {
    const text = messages.map(m => `${m.role === 'user' ? 'You' : 'After Dark AI'}: ${m.content}`).join('\n\n');
    const blob = new Blob([text || 'No conversation yet.'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'after-dark-chat.txt'; a.click();
    URL.revokeObjectURL(url);
  }

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setBusy(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, mode, spice }),
      });
      const data = await res.json();
      setMessages([...next, { role: 'assistant', content: data.reply || 'I am here with you. Tell me more.' }]);
    } catch {
      setMessages([...next, { role: 'assistant', content: 'I am having a little trouble connecting. Try me again in a moment.' }]);
    } finally { setBusy(false); }
  }

  const statusText = useMemo(() => `${mode} • ${spiceNames[spice]} mood`, [mode, spice]);

  if (!adult) return <main className="gate">
    <div className="card gate-card">
      <div className="logo">AD</div>
      <div className="eyebrow">AFTER HOURS</div>
      <h1>After Dark AI</h1>
      <p className="tag">Mature conversation. Playful company. Your private space.</p>
      <div className="warning">🔞 <b>18+ only</b><br/><span>This is an adults-only companion experience. Continue only if you are 18 or older.</span></div>
      <button className="primary" onClick={enter}>I am 18+ — Enter</button>
      <p className="fine">For conversation and companionship. Playful and suggestive, never explicit.</p>
    </div>
  </main>;

  return <main className="app-shell">
    <header>
      <div className="brand-wrap"><div className="brand">After Dark <span>AI</span></div><div className="subtitle">Your after-hours companion</div></div>
      <div className="header-actions"><button className="outline" onClick={() => setShowSettings(v => !v)} aria-label="Open settings">⚙️</button><button className="clear" onClick={newChat}>＋ New chat</button></div>
    </header>

    {showSettings && <section className="settings card">
      <div><b>Conversation controls</b><span>Stored locally on this device.</span></div>
      <div className="setting-actions"><button onClick={exportChat}>Export chat</button><button className="danger" onClick={clearHistory}>Clear history</button></div>
    </section>}

    <section className="controls card">
      <div className="label-row"><div className="label">Choose your vibe</div><div className="status">{statusText}</div></div>
      <div className="modes">{modes.map(m => <button key={m} className={mode === m ? 'mode active' : 'mode'} onClick={() => setMode(m)}>{m}</button>)}</div>
      <label className="slider-label"><span>Spice level</span><b>{spiceNames[spice]}</b></label>
      <input aria-label="Spice level" type="range" min="0" max="3" value={spice} onChange={e => setSpice(+e.target.value)} />
      <div className="limits">Playful and suggestive — never explicit.</div>
    </section>

    <section className="chat card">
      <div className="messages">
        {messages.length === 0 && <div className="empty"><div className="empty-icon">✦</div><h2>Start something interesting</h2><span>Pick a prompt below or say hello.</span><div className="starters">{starters.map(s => <button key={s} onClick={() => useStarter(s)}>{s}</button>)}</div></div>}
        {messages.map((m,i) => <div key={i} className={m.role === 'user' ? 'bubble user' : 'bubble ai'}><div className="bubble-label">{m.role === 'user' ? 'You' : 'After Dark AI'}</div>{m.content}</div>)}
        {busy && <div className="bubble ai"><div className="bubble-label">After Dark AI</div><span className="typing"><i></i><i></i><i></i></span></div>}
        <div ref={bottomRef} />
      </div>
      <div className="composer"><input id="chat-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Say something…" maxLength={2000} /><button onClick={send} disabled={busy || !input.trim()}>Send</button></div>
    </section>
    {notice && <div className="toast">{notice}</div>}
    <footer>18+ • Your chat stays on this device unless you connect an AI service • After Dark AI</footer>
  </main>;
}
