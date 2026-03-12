interface Env {
  ASSETS: Fetcher;
}

const LANG_META: Record<string, { title: string; description: string; ogLocale: string }> = {
  'zh-HK': {
    title: 'StoaBase — 一句 Prompt，壯大你的生意。',
    description: '一句 Prompt，建立整個 AI 原生企業——毋需基建，毋需開發團隊。教育、醫療、初創均已實戰驗證。',
    ogLocale: 'zh_HK',
  },
  'zh-TW': {
    title: 'StoaBase — 一個提示，搞定你的生意。',
    description: '一個提示，建立整個 AI 原生企業——無需基礎架構，無需開發團隊。教育、醫療、新創均已實戰驗證。',
    ogLocale: 'zh_TW',
  },
  'zh-CN': {
    title: 'StoaBase — 一个提示，搞定你的业务。',
    description: '一个提示，建立整个 AI 原生企业——无需基础架构，无需开发团队。教育、医疗、初创均已实战验证。',
    ogLocale: 'zh_CN',
  },
  ja: {
    title: 'StoaBase — プロンプトひとつで、ビジネスを実現。',
    description: 'プロンプトひとつで、AIネイティブ会社まるごと構築。インフラ不要、開発チーム不要。教育・医療・スタートアップで実績あり。',
    ogLocale: 'ja_JP',
  },
  ko: {
    title: 'StoaBase — 프롬프트 하나로. 비즈니스 완성.',
    description: '프롬프트 하나로 AI 네이티브 비즈니스 전체를 구축하세요. 인프라 불필요, 개발팀 불필요. 교육, 의료, 스타트업에서 검증된 성능.',
    ogLocale: 'ko_KR',
  },
};

/** Escape special HTML characters for safe attribute injection */
function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const segments = url.pathname.split('/').filter(Boolean);
  const lang = segments[0];
  const meta = LANG_META[lang];

  // No language match or it's a static asset — pass through to assets
  if (!meta || url.pathname.includes('.')) {
    return env.ASSETS.fetch(request);
  }

  // Fetch the root index.html (always English base)
  const indexReq = new Request(new URL('/', url).toString(), {
    headers: request.headers,
  });
  const response = await env.ASSETS.fetch(indexReq);
  let html = await response.text();

  const t = escapeHtml(meta.title);
  const d = escapeHtml(meta.description);
  const l = meta.ogLocale;

  // Replace <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`);

  // Replace og:title (may have content on same or next line)
  html = html.replace(
    /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
    `$1${t}$2`
  );

  // Replace og:description (multi-line safe: strip then replace)
  html = html.replace(
    /<meta\s+property="og:description"[\s\S]*?\/>/,
    `<meta property="og:description" content="${d}" />`
  );

  // Replace og:locale
  html = html.replace(
    /(<meta\s+property="og:locale"\s+content=")[^"]*(")/,
    `$1${l}$2`
  );

  // Replace twitter:title
  html = html.replace(
    /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,
    `$1${t}$2`
  );

  // Replace twitter:description (multi-line safe)
  html = html.replace(
    /<meta\s+name="twitter:description"[\s\S]*?\/>/,
    `<meta name="twitter:description" content="${d}" />`
  );

  // Update <html lang="...">
  html = html.replace(/(<html\s+lang=")[^"]*(")/,`$1${lang}$2`);

  return new Response(html, {
    status: response.status,
    headers: {
      'content-type': 'text/html;charset=UTF-8',
      'cache-control': 'public, max-age=3600',
    },
  });
};
