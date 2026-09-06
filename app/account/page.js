'use client';

import { useEffect, useState } from 'react';
import { supabase, supabaseConfigured } from '../../lib/supabase';

export default function AccountPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [session, setSession] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => listener.subscription.unsubscribe();
  }, []);

  const submit = async (signUp) => {
    setError('');
    setMessage('');
    if (!supabase) return;
    if (!email.trim() || password.length < 6) {
      setError('Enter a valid email and a password of at least 6 characters.');
      return;
    }
    if (signUp && !ageConfirmed) {
      setError('Please confirm that you are 18 or older.');
      return;
    }
    setBusy(true);
    try {
      if (signUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { age_confirmed: true } },
        });
        if (signUpError) throw signUpError;
        setMessage(data.session ? 'Account created. Welcome to After Dark.' : 'Account created. Check your email to confirm your address.');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (signInError) throw signInError;
        setMessage('Welcome back.');
      }
    } catch (e) {
      setError(e.message || 'Unable to complete that request.');
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setMessage('You have been signed out.');
  };

  if (!supabaseConfigured) {
    return (
      <main className="account-page">
        <nav className="account-nav"><a href="/" className="premium-brand"><span>AD</span> After Dark <b>AI</b></a><a href="/" className="premium-back">← Back</a></nav>
        <section className="account-card">
          <div className="logo">AD</div>
          <div className="eyebrow">ACCOUNT SETUP</div>
          <h1>Connect your private account.</h1>
          <p>Supabase authentication is wired into the app. Add the two public Supabase environment variables in Vercel to activate sign in and sign up.</p>
          <div className="setup-list"><div><b>NEXT_PUBLIC_SUPABASE_URL</b><small>Your Supabase project URL</small></div><div><b>NEXT_PUBLIC_SUPABASE_ANON_KEY</b><small>Your Supabase publishable/anon key</small></div></div>
          <a href="/" className="primary account-button">Continue to After Dark →</a>
        </section>
      </main>
    );
  }

  if (session) {
    return (
      <main className="account-page">
        <nav className="account-nav"><a href="/" className="premium-brand"><span>AD</span> After Dark <b>AI</b></a><a href="/" className="premium-back">← Back to chat</a></nav>
        <section className="account-card">
          <div className="account-avatar">✓</div>
          <div className="eyebrow">YOUR ACCOUNT</div>
          <h1>You're signed in.</h1>
          <p className="account-email">{session.user.email}</p>
          <div className="account-status"><span>🔒</span><div><b>Private account</b><small>Your account is ready for the secure cloud-history features being added next.</small></div></div>
          <div className="account-actions"><a href="/" className="primary account-button">Start chatting →</a><button className="secondary account-button" onClick={signOut}>Sign out</button></div>
          {message && <div className="account-message">{message}</div>}
        </section>
      </main>
    );
  }

  return (
    <main className="account-page">
      <nav className="account-nav"><a href="/" className="premium-brand"><span>AD</span> After Dark <b>AI</b></a><a href="/" className="premium-back">← Back</a></nav>
      <section className="account-card">
        <div className="logo">AD</div>
        <div className="eyebrow">AFTER DARK • ACCOUNT</div>
        <h1>Keep your After Dark space yours.</h1>
        <p>Sign in to prepare for cross-device conversation history and future premium features.</p>
        <label className="account-label">Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" /></label>
        <label className="account-label">Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" placeholder="At least 6 characters" /></label>
        <label className="age-check"><input type="checkbox" checked={ageConfirmed} onChange={e => setAgeConfirmed(e.target.checked)} /> <span>I confirm I am 18 or older.</span></label>
        <div className="account-actions"><button className="primary account-button" disabled={busy} onClick={() => submit(false)}>Sign in</button><button className="secondary account-button" disabled={busy} onClick={() => submit(true)}>Create account</button></div>
        {error && <div className="account-error">{error}</div>}
        {message && <div className="account-message">{message}</div>}
        <p className="account-fine">18+ only. Your password is handled by Supabase Authentication and is not stored by After Dark AI.</p>
      </section>
    </main>
  );
}
