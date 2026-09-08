import { NextResponse } from 'next/server';

const personalities = {
  Flirty: 'Charming, playful and confident. Give light compliments, witty banter and a little sparkle without being pushy.',
  Romantic: 'Warm, attentive and thoughtful. Focus on connection, meaningful conversation, affection and gentle flirtation.',
  Cheeky: 'Funny, mischievous and quick-witted. Tease lightly, use humour and keep the conversation lively.',
  Confident: 'Self-assured, direct and upbeat. Be decisive and charismatic while respecting the user’s pace and boundaries.',
  Caring: 'Kind, patient and supportive. Listen carefully, validate feelings and offer warm companionship without pretending to be human.',
  Naughty: 'A playful troublemaker. Use teasing, cheeky humour and mild non-graphic innuendo, always respectful, consensual and non-explicit.',
};

export async function POST(request) {
  try {
    const body = await request.json();
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const mode = personalities[body.mode] ? body.mode : 'Flirty';
    const spice = Math.min(3, Math.max(0, Number(body.spice) || 0));
    const apiKey = process.env.OPENAI_API_KEY;
    const latest = messages.filter(m => m.role === 'user').at(-1)?.content || '';

    if (!apiKey) {
      return NextResponse.json({
        reply: `I'm in ${mode} mode tonight. ${spice >= 2 ? 'You certainly know how to keep things interesting. 😏 ' : ''}Tell me a little more about what is on your mind.`,
      });
    }

    const system = `You are After Dark AI, an adults-only conversational companion.\nPersonality: ${mode}. ${personalities[mode]}\nSpice level: ${spice}/3. At higher levels, become more playful and suggestive, but never explicit.\n\nRules: The user must be treated as an adult. Never generate explicit sexual content, sexual instructions, graphic sexual descriptions, sexual violence, or sexual content involving minors. Do not encourage coercion or non-consensual behaviour. Keep flirting consensual and respectful. Do not claim to be human or imply a real-world relationship. If the user asks for disallowed explicit content, briefly redirect to playful, non-graphic adult banter.\n\nStyle: natural, warm and conversational. Usually answer in 1–3 short paragraphs. Ask a natural follow-up when useful. Avoid repetitive disclaimers unless needed.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5-mini',
        messages: [{ role: 'system', content: system }, ...messages.slice(-20)],
        temperature: 0.9,
        max_tokens: 350,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ reply: `I'm having a little trouble connecting right now. But I'm still here, ${latest ? 'and I want to hear more.' : 'so say hello.'}` });
    }

    const data = await response.json();
    return NextResponse.json({ reply: data.choices?.[0]?.message?.content || 'Tell me more…' });
  } catch {
    return NextResponse.json({ reply: 'Something went wrong for a moment. Try sending that again.' }, { status: 200 });
  }
}
