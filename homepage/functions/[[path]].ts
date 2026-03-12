interface Env {
  ASSETS: Fetcher;
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

const SUPPORTED_LANG_KEYS = Object.keys(LANG_META);

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const firstSegment = url.pathname.split('/').filter(Boolean)[0] ?? '';

  // Pass through static assets (anything with a file extension)
  if (firstSegment.includes('.') || url.pathname.includes('/assets/')) {
    return env.ASSETS.fetch(request);
  }

  // If not a known language segment, serve index.html as-is
  const meta = LANG_META[firstSegment];
  if (!meta) {
    return env.ASSETS.fetch(new Request(`${url.origin}/index.html`, { headers: request.headers }));
  }

  // Fetch the English base index.html explicitly
  let html: string;
  try {
    const baseRes = await env.ASSETS.fetch(
      new Request(`${url.origin}/index.html`, { headers: request.headers })
    );
    if (!baseRes.ok) {
      return env.ASSETS.fetch(request);
    }
    html = await baseRes.text();
  } catch {
    return env.ASSETS.fetch(request);
  }

  const t = escapeAttr(meta.title);
  const d = escapeAttr(meta.description);

  // Patch <html lang>
  html = html.replace(/(<html[^>]*\slang=")[^"]*(")/i, `$1${meta.htmlLang}$2`);

  // Patch <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`);

  // Patch og:title
  html = html.replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/i, `$1${t}$2`);

  // Patch og:description (handles multi-line attribute)
  html = html.replace(
    /<meta\s+property="og:description"[^>]*>/i,
    `<meta property="og:description" content="${d}" />`
  );

  // Patch og:locale
  html = html.replace(/(<meta\s+property="og:locale"\s+content=")[^"]*(")/i, `$1${meta.ogLocale}$2`);

  // Patch twitter:title
  html = html.replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/i, `$1${t}$2`);

  // Patch twitter:description (handles multi-line attribute)
  html = html.replace(
    /<meta\s+name="twitter:description"[^>]*>/i,
    `<meta name="twitter:description" content="${d}" />`
  );

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=UTF-8',
      'cache-control': 'public, max-age=300, s-maxage=3600',
      'x-lang': firstSegment,
    },
  });
};
