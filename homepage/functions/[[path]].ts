interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
}

const LANG_META: Record<string, { title: string; description: string; ogLocale: string; htmlLang: string }> = {
  'zh-HK': {
    title: 'StoaBase — 一句 Prompt，壯大你的生意。',
    description: '一句 Prompt，建立整個 AI 原生企業——毋需基建，毋需開發團隊。教育、醫療、初創均已實戰驗證。',
    ogLocale: 'zh_HK',
    htmlLang: 'zh-HK',
  },
  'zh-TW': {
    title: 'StoaBase — 一個提示，搞定你的生意。',
    description: '一個提示，建立整個 AI 原生企業——無需基礎架構，無需開發團隊。教育、醫療、新創均已實戰驗證。',
    ogLocale: 'zh_TW',
    htmlLang: 'zh-TW',
  },
  'zh-CN': {
    title: 'StoaBase — 一个提示，搞定你的业务。',
    description: '一个提示，建立整个 AI 原生企业——无需基础架构，无需开发团队。教育、医疗、初创均已实战验证。',
    ogLocale: 'zh_CN',
    htmlLang: 'zh-CN',
  },
  ja: {
    title: 'StoaBase — プロンプトひとつで、ビジネスを実現。',
    description: 'プロンプトひとつで、AIネイティブ会社まるごと構築。インフラ不要、開発チーム不要。教育・医療・スタートアップで実績あり。',
    ogLocale: 'ja_JP',
    htmlLang: 'ja',
  },
  ko: {
    title: 'StoaBase — 프롬프트 하나로. 비즈니스 완성.',
    description: '프롬프트 하나로 AI 네이티브 비즈니스 전체를 구축하세요. 인프라 불필요, 개발팀 불필요. 교육, 의료, 스타트업에서 검증된 성능.',
    ogLocale: 'ko_KR',
    htmlLang: 'ko',
  },
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// ── Worker entry point (used when deployed via wrangler.jsonc) ──
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // ── Waitlist API ─────────────────────────────────────────────
    if (pathname === '/api/waitlist') {
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
      }
      if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
      }
      try {
        const body = await request.json() as { email?: string; name?: string; lang?: string };
        const email = (body.email ?? '').trim().toLowerCase();
        const name  = (body.name  ?? '').trim().slice(0, 100);
        const lang  = (body.lang  ?? 'en').slice(0, 10);

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return Response.json({ ok: false, error: 'invalid_email' }, { status: 400, headers: CORS_HEADERS });
        }

        await env.DB.prepare(
          'INSERT INTO waitlist (email, name, lang) VALUES (?, ?, ?)'
        ).bind(email, name || null, lang).run();

        return Response.json({ ok: true }, { status: 201, headers: CORS_HEADERS });
      } catch (err: unknown) {
        const msg = (err as Error).message ?? '';
        if (msg.includes('UNIQUE')) {
          return Response.json({ ok: false, error: 'already_joined' }, { status: 409, headers: CORS_HEADERS });
        }
        console.error('Waitlist error:', err);
        return Response.json({ ok: false, error: 'server_error' }, { status: 500, headers: CORS_HEADERS });
      }
    }

    // ── Static assets ─────────────────────────────────────────────
    const firstSegment = pathname.split('/').filter(Boolean)[0] ?? '';
    if (firstSegment.includes('.') || pathname.includes('/assets/')) {
      return env.ASSETS.fetch(request);
    }

    // ── Language paths — patch meta via HTMLRewriter ──────────────
    const meta = LANG_META[firstSegment];
    if (!meta) {
      // Not a language path — serve index.html for SPA routing
      return env.ASSETS.fetch(
        new Request(`${url.origin}/index.html`, { headers: request.headers })
      );
    }

    const baseResponse = await env.ASSETS.fetch(
      new Request(`${url.origin}/index.html`, { headers: request.headers })
    );
    if (!baseResponse.ok) return env.ASSETS.fetch(request);

    const langUrl = `${url.origin}/${firstSegment}/`;
    let titleWritten = false;

    const rewriter = new HTMLRewriter()
      .on('html', { element(el: Element) { el.setAttribute('lang', meta.htmlLang); } })
      .on('title', {
        text(text: Text) {
          if (!titleWritten) { text.replace(meta.title); titleWritten = true; }
          else { text.remove(); }
        },
      })
      .on('meta[name="description"]',         { element(el: Element) { el.setAttribute('content', meta.description); } })
      .on('meta[property="og:title"]',        { element(el: Element) { el.setAttribute('content', meta.title); } })
      .on('meta[property="og:description"]',  { element(el: Element) { el.setAttribute('content', meta.description); } })
      .on('meta[property="og:locale"]',       { element(el: Element) { el.setAttribute('content', meta.ogLocale); } })
      .on('meta[property="og:url"]',          { element(el: Element) { el.setAttribute('content', langUrl); } })
      .on('meta[name="twitter:title"]',       { element(el: Element) { el.setAttribute('content', meta.title); } })
      .on('meta[name="twitter:description"]', { element(el: Element) { el.setAttribute('content', meta.description); } })
      .on('meta[name="twitter:url"]',         { element(el: Element) { el.setAttribute('content', langUrl); } });

    return new Response(rewriter.transform(baseResponse).body, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=UTF-8',
        'cache-control': 'public, max-age=300',
        'x-lang': firstSegment,
      },
    });
  },
};
