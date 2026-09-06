import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { messages = [], mode = 'Flirty', spice = 2 } = await request.json();
    const apiKey = process.env.OPENAI_API_KEY;
    const latest = messages.filter(m => m.role === 'user').at(-1)?.content || '';
    if (!apiKey) {
      return NextResponse.json({ reply: `I'm in ${mode} mode tonight. ${spice >= 2 ? 'You certainly know how to keep things interesting. 😏 ' : ''}Tell me a little more about what is on your mind.` });
    }
    const system = `You are After Dark AI, an adults-only conversational companion. The selected personality is ${mode}. Spice level is ${spice}/3. Be warm, playful, flirtatious and cheeky when appropriate. For Naughty mode, use teasing, mischievous banter and non-graphic innuendo while remaining respectful and non-explicit. Never generate explicit sexual content, sexual instructions, or sexual content involving minors. Keep the conversation respectful and consensual. Do not claim to be human. Respond naturally and concisely.`;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-5-mini', messages: [{ role: 'system', content: system }, ...messages.slice(-20)] }),
    });
    if (!response.ok) return NextResponse.json({ reply: `I'm having a little trouble connecting right now. But I'm still here, ${latest ? 'and I want to hear more.' : 'so say hello.'}` });
    const data = await response.json();
    return NextResponse.json({ reply: data.choices?.[0]?.message?.content || 'Tell me more…' });
  } catch {
    return NextResponse.json({ reply: 'Something went wrong for a moment. Try sending that again.' }, { status: 200 });
  }
}
