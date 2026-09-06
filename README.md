# After Dark AI

18+ mature, playful AI companion app for after-hours conversation.

## Current build

- 18+ age gate
- Six companion personalities: Flirty, Romantic, Cheeky, Confident, Caring and Naughty
- Playful-to-bold conversation control
- Local conversation history
- Premium/waitlist page
- Privacy and Terms pages
- Supabase account authentication wiring
- Mobile/PWA-ready interface
- Live AI API route ready for an `OPENAI_API_KEY`

## Account setup

Add these Vercel environment variables to activate Supabase sign-in/sign-up:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Use the Supabase publishable/anon key only in the browser. Never expose a Supabase service-role key in client code or commit secrets to GitHub.

## Production roadmap

1. Connect Supabase Auth and database tables with RLS.
2. Move authenticated conversation history into the user's private cloud account.
3. Add subscription checkout and webhook verification.
4. Add usage limits, premium companion experiences and account settings.
5. Add production moderation, abuse controls, monitoring and privacy tooling.

This repository is separate from CSF Journey.
