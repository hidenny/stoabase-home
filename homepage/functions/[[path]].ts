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

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const firstSegment = url.pathname.split('/').filter(Boolean)[0] ?? '';

  // Pass through static assets
  if (firstSegment.includes('.') || url.pathname.includes('/assets/')) {
    return env.ASSETS.fetch(request);
  }

  // Pass through /api/ routes to their specific function handlers
  // (functions/api/waitlist.ts handles /api/waitlist)
  if (firstSegment === 'api') {
    return env.ASSETS.fetch(request);
  }

  // Not a language path — serve index.html as-is
  const meta = LANG_META[firstSegment];
  if (!meta) {
    return env.ASSETS.fetch(
      new Request(`${url.origin}/index.html`, { headers: request.headers })
    );
  }

  // Fetch base index.html
  const baseResponse = await env.ASSETS.fetch(
    new Request(`${url.origin}/index.html`, { headers: request.headers })
  );

  if (!baseResponse.ok) {
    return env.ASSETS.fetch(request);
  }

  const langUrl = `${url.origin}/${firstSegment}/`;
  let titleWritten = false;

  // Use HTMLRewriter — Cloudflare's streaming HTML transformer
  const rewriter = new HTMLRewriter()
    .on('html', {
      element(el) {
        el.setAttribute('lang', meta.htmlLang);
      },
    })
    .on('title', {
      text(text) {
        if (!titleWritten) {
          text.replace(meta.title);
          titleWritten = true;
        } else {
          text.remove();
        }
      },
    })
    .on('meta[name="description"]', {
      element(el) { el.setAttribute('content', meta.description); },
    })
    .on('meta[property="og:title"]', {
      element(el) { el.setAttribute('content', meta.title); },
    })
    .on('meta[property="og:description"]', {
      element(el) { el.setAttribute('content', meta.description); },
    })
    .on('meta[property="og:locale"]', {
      element(el) { el.setAttribute('content', meta.ogLocale); },
    })
    .on('meta[property="og:url"]', {
      element(el) { el.setAttribute('content', langUrl); },
    })
    .on('meta[name="twitter:title"]', {
      element(el) { el.setAttribute('content', meta.title); },
    })
    .on('meta[name="twitter:description"]', {
      element(el) { el.setAttribute('content', meta.description); },
    })
    .on('meta[name="twitter:url"]', {
      element(el) { el.setAttribute('content', langUrl); },
    });

  const transformed = rewriter.transform(baseResponse);

  return new Response(transformed.body, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=UTF-8',
      'cache-control': 'public, max-age=300, s-maxage=3600',
      'x-lang': firstSegment,
    },
  });
};
