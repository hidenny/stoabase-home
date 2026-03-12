interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://stoabase.ai',
    'Content-Type': 'application/json',
  };

  try {
    const body = await request.json() as { email?: string; name?: string; lang?: string };
    const email = (body.email ?? '').trim().toLowerCase();
    const name  = (body.name  ?? '').trim().slice(0, 100);
    const lang  = (body.lang  ?? 'en').slice(0, 10);

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ ok: false, error: 'invalid_email' }, { status: 400, headers: corsHeaders });
    }

    await env.DB.prepare(
      'INSERT INTO waitlist (email, name, lang) VALUES (?, ?, ?)'
    ).bind(email, name || null, lang).run();

    return Response.json({ ok: true }, { status: 201, headers: corsHeaders });

  } catch (err: unknown) {
    const msg = (err as Error).message ?? '';
    // SQLite unique constraint = already signed up
    if (msg.includes('UNIQUE')) {
      return Response.json({ ok: false, error: 'already_joined' }, { status: 409, headers: corsHeaders });
    }
    return Response.json({ ok: false, error: 'server_error' }, { status: 500, headers: corsHeaders });
  }
};

// Handle CORS preflight
export const onRequestOptions: PagesFunction = async () =>
  new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': 'https://stoabase.ai',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
