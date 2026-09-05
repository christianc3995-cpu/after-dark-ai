'use client';

import { useEffect, useState } from 'react';

const modes = ['Flirty', 'Romantic', 'Cheeky', 'Confident', 'Caring'];

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

  useEffect(() => {
    if (localStorage.getItem('after-dark-adult') === 'yes') setAdult(true);
    const saved = localStorage.getItem('after-dark-chat');
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('after-dark-chat', JSON.stringify(messages));
  }, [messages]);

  function enter() {
    localStorage.setItem('after-dark-adult', 'yes');
    setAdult(true);
    if (!messages.length) setMessages([{ role: 'assistant', content: welcomes[mode] }]);
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

  if (!adult) return <main className="gate"><div className="card gate-card"><div className="logo">AD</div><h1>After Dark AI</h1><p className="tag">Mature conversation. Playful company. Your private space.</p><div className="warning">🔞 <b>18+ only</b><br/><span>This is an adults-only companion experience. Please continue only if you are 18 or older.</span></div><button className="primary" onClick={enter}>I am 18+ — Enter</button><p className="fine">After Dark AI is for conversation and companionship. Keep it respectful.</p></div></main>;

  return <main className="app-shell">
    <header><div><div className="brand">After Dark <span>AI</span></div><div className="subtitle">Your after-hours companion</div></div><button className="clear" onClick={() => setMessages([])}>New chat</button></header>
    <section className="controls card">
      <div className="label">Choose your vibe</div>
      <div className="modes">{modes.map(m => <button key={m} className={mode === m ? 'mode active' : 'mode'} onClick={() => setMode(m)}>{m}</button>)}</div>
      <label className="slider-label">Spice level <b>{['Sweet','Warm','Playful','Bold'][spice]}</b></label>
      <input type="range" min="0" max="3" value={spice} onChange={e => setSpice(+e.target.value)} />
      <div className="limits">Playful and suggestive — never explicit.</div>
    </section>
    <section className="chat card">
      <div className="messages">{messages.length === 0 && <div className="empty">Start the conversation…<br/><span>Say hello, tell me about your day, or ask me something cheeky.</span></div>}{messages.map((m,i) => <div key={i} className={m.role === 'user' ? 'bubble user' : 'bubble ai'}>{m.content}</div>)}{busy && <div className="bubble ai">Thinking…</div>}</div>
      <div className="composer"><input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Say something…" /><button onClick={send} disabled={busy}>Send</button></div>
    </section>
    <footer>18+ • Private on this device • After Dark AI</footer>
  </main>;
}
