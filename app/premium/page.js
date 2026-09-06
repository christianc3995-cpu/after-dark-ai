'use client';

import { useState } from 'react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'A taste of the After Dark experience.',
    features: ['All six companion personalities', 'Playful conversation', 'Basic spice controls', 'Local chat history'],
    cta: 'Start for free',
  },
  {
    name: 'After Dark+',
    price: '$9.99',
    period: 'per month',
    description: 'More freedom, more personality, more after-hours fun.',
    features: ['Everything in Free', 'Longer conversations', 'Enhanced personality depth', 'Priority AI access', 'Premium companion experiences', 'Early access to new features'],
    cta: 'Join the waitlist',
    featured: true,
  },
];

export default function PremiumPage() {
  const [notice, setNotice] = useState(false);

  return (
    <main className="premium-page">
      <nav className="premium-nav">
        <a href="/" className="premium-brand"><span>AD</span> After Dark <b>AI</b></a>
        <a href="/" className="premium-back">← Back to companions</a>
      </nav>

      <section className="premium-hero">
        <div className="eyebrow">AFTER DARK • PREMIUM</div>
        <h1>More connection.<br/><em>More personality.</em></h1>
        <p>Upgrade when you want longer conversations, richer personalities and priority access to what we build next.</p>
        <div className="premium-trust"><span>🔞 18+ only</span><span>•</span><span>Cancel anytime</span><span>•</span><span>Private experience</span></div>
      </section>

      <section className="plans-grid">
        {plans.map(plan => (
          <article className={`plan-card${plan.featured ? ' featured' : ''}`} key={plan.name}>
            {plan.featured && <div className="plan-badge">MOST POPULAR</div>}
            <div className="plan-name">{plan.name}</div>
            <div className="plan-price">{plan.price}<small> / {plan.period}</small></div>
            <p className="plan-description">{plan.description}</p>
            <ul>{plan.features.map(feature => <li key={feature}>✓ <span>{feature}</span></li>)}</ul>
            <button className={plan.featured ? 'primary premium-cta' : 'secondary premium-cta'} onClick={() => plan.featured && setNotice(true)}>{plan.cta} →</button>
          </article>
        ))}
      </section>

      <section className="premium-strip">
        <div><span>😈</span><b>Six distinct vibes</b><small>Flirty, Romantic, Cheeky, Confident, Caring & Naughty</small></div>
        <div><span>🌶️</span><b>Your pace</b><small>Sweet to bold, with playful boundaries</small></div>
        <div><span>🔒</span><b>Privacy first</b><small>Your prototype chat history stays on your device</small></div>
      </section>

      <section className="premium-faq">
        <div className="eyebrow">GOOD TO KNOW</div>
        <h2>Built to grow with you.</h2>
        <div className="faq-item"><b>Is After Dark+ available yet?</b><p>The subscription checkout is being prepared. Join the waitlist to be first to know when paid plans open.</p></div>
        <div className="faq-item"><b>Will Naughty become explicit?</b><p>No. Naughty is designed for teasing, mischievous banter and non-graphic innuendo while staying respectful and non-explicit.</p></div>
        <div className="faq-item"><b>Can I use After Dark on my phone?</b><p>Yes. The experience is designed for mobile and can be used as a PWA-style web app.</p></div>
      </section>

      <footer className="premium-footer">18+ • After Dark AI • Mature, playful and suggestive conversation • Never explicit.</footer>

      {notice && <div className="premium-notice-backdrop" onClick={() => setNotice(false)}><div className="premium-notice" onClick={e => e.stopPropagation()}><div className="logo">AD</div><div className="eyebrow">COMING SOON</div><h2>You're on the early list.</h2><p>Premium checkout is the next commercial milestone. For now, your free companion experience is ready to use.</p><div className="premium-notice-actions"><a href="/" className="primary">Continue chatting →</a><button className="secondary" onClick={() => setNotice(false)}>Close</button></div></div></div>}
    </main>
  );
}
