/**
 * Deck Podcast Script — Pre-authored narration for the StoaBase pitch deck.
 *
 * Single presenter:
 *   Denny Wong — Founder
 *
 * Slide order (14 slides, Product hidden):
 *   0  Cover
 *   1  The Insight We Earned
 *   2  The Problem
 *   3  The Solution
 *   4  What Already Exists
 *   5  Why Now
 *   6  Proof of Concept (ReaLM)
 *   7  Go-To-Market
 *   8  Business Model
 *   9  Competition
 *  10  Moat
 *  11  Traction
 *  12  Team
 *  13  Closing
 *
 * Each segment has text in 3 languages:
 *   en    — English
 *   zhCN  — 简体中文 (Simplified Chinese)
 *   zhTW  — 繁體中文 (Traditional Chinese / Cantonese-style)
 */

export interface DeckPodcastSegment {
  slideIndex: number;
  speaker: "denny";
  en: { display: string; speech: string };
  zhCN: { display: string; speech: string };
  zhTW: { display: string; speech: string };
}

export const DECK_PODCAST_SCRIPT: DeckPodcastSegment[] = [
  // ── S1: Cover (slide 0) ──────────────────────────────────────────────────
  {
    slideIndex: 0,
    speaker: "denny",
    en: {
      display: "Hey — I'm Denny, founder of StoaBase. Before we start, fun fact: this entire pitch deck — the design, the animations, the narration you're hearing right now — was generated entirely by prompts on the StoaBase platform.",
      speech: "Hey — I'm Denny, founder of StoaBase. Before we start, fun fact: this entire pitch deck — the design, the animations, the narration you're hearing right now — was generated entirely by prompts on the StoaBase platform.",
    },
    zhCN: {
      display: "大家好，我是 StoaBase 的创始人 Denny。在开始之前，一个有趣的事实：这整个推介演示——设计、动画、你现在听到的旁白——全部是通过 StoaBase 平台的提示词生成的。",
      speech: "大家好，我是 StoaBase 的创始人 Denny。在开始之前，一个有趣的事实：这整个推介演示——设计、动画、你现在听到的旁白——全部是通过 StoaBase 平台的提示词生成的。",
    },
    zhTW: {
      display: "大家好，我係 StoaBase 嘅創辦人 Denny。喺開始之前，一個有趣嘅事實：呢個推介演示——設計、動畫、你而家聽到嘅旁白——全部都係透過 StoaBase 平台嘅提示詞生成嘅。",
      speech: "大家好，我係 StoaBase 嘅創辦人 Denny。喺開始之前，一個有趣嘅事實：呢個推介演示——設計、動畫、你而家聽到嘅旁白——全部都係透過 StoaBase 平台嘅提示詞生成嘅。",
    },
  },
  {
    slideIndex: 0,
    speaker: "denny",
    en: {
      display: "StoaBase is the runtime for AI-native businesses. One workspace. Many apps. Shared context and skills. Every customer gets a private AI workspace where every app shares users, permissions, knowledge, memory, and analytics.",
      speech: "StoaBase is the runtime for A.I.-native businesses. One workspace. Many apps. Shared context and skills. Every customer gets a private A.I. workspace where every app shares users, permissions, knowledge, memory, and analytics.",
    },
    zhCN: {
      display: "StoaBase 是 AI 原生企业的运行时。一个工作空间，多个应用，共享知識庫和技能。每个客户都拥有一个私有 AI 工作空间，所有应用共享用户、权限、知识、记忆和分析。",
      speech: "StoaBase 是 AI 原生企业的运行时。一个工作空间，多个应用，共享知識庫和技能。每个客户都拥有一个私有 AI 工作空间，所有应用共享用户、权限、知识、记忆和分析。",
    },
    zhTW: {
      display: "StoaBase 係 AI 原生企業嘅運行時。一個工作空間，多個 App，共享知識庫同技能。每個客戶都有一個私有 AI 工作空間，所有 App 共享用戶、權限、知識、記憶同分析。",
      speech: "StoaBase 係 AI 原生企業嘅運行時。一個工作空間，多個 App，共享知識庫同技能。每個客戶都有一個私有 AI 工作空間，所有 App 共享用戶、權限、知識、記憶同分析。",
    },
  },

  // ── S2: The Insight We Earned (slide 1) ────────────────────────────────────
  {
    slideIndex: 1,
    speaker: "denny",
    en: {
      display: "We co-built R'ODYSSEY — AI education across 10 schools and 1,000+ students — and iOMICS — AI medical workflows across 8,000+ patient records. Both are live and getting traction.",
      speech: "We co-built R'Odyssey — A.I. education across 10 schools and over 1,000 students — and iOmics — A.I. medical workflows across over 8,000 patient records. Both are live and getting traction.",
    },
    zhCN: {
      display: "我们共同构建了 R'ODYSSEY——在 10 所学校服务超过 1,000 名学生的 AI 教育平台——以及 iOMICS——处理超过 8,000 份病历的 AI 医疗平台。两者都已上线并获得牵引力。",
      speech: "我们共同构建了 R'ODYSSEY——在 10 所学校服务超过 1,000 名学生的 AI 教育平台——以及 iOMICS——处理超过 8,000 份病历的 AI 医疗平台。两者都已上线并获得牵引力。",
    },
    zhTW: {
      display: "我哋共同建立咗 R'ODYSSEY——喺 10 間學校服務超過 1,000 名學生嘅 AI 教育平台——以及 iOMICS——處理超過 8,000 份病歷嘅 AI 醫療平台。兩個都已經上線並獲得牽引力。",
      speech: "我哋共同建立咗 R'ODYSSEY——喺 10 間學校服務超過 1,000 名學生嘅 AI 教育平台——以及 iOMICS——處理超過 8,000 份病歷嘅 AI 醫療平台。兩個都已經上線並獲得牽引力。",
    },
  },
  {
    slideIndex: 1,
    speaker: "denny",
    en: {
      display: "The realization: any business launching with AI will need the same foundational requirements. Two ventures. Two industries. One repeated stack.",
      speech: "The realization: any business launching with A.I. will need the same foundational requirements. Two ventures. Two industries. One repeated stack.",
    },
    zhCN: {
      display: "我们的领悟是：任何以 AI 起步的企业都需要相同的基础需求。两个项目，两个行业，一套重复的技术栈。",
      speech: "我们的领悟是：任何以 AI 起步的企业都需要相同的基础需求。两个项目，两个行业，一套重复的技术栈。",
    },
    zhTW: {
      display: "我哋嘅領悟係：任何以 AI 起步嘅企業都需要相同嘅基礎需求。兩個項目，兩個行業，一套重複嘅技術架構。",
      speech: "我哋嘅領悟係：任何以 AI 起步嘅企業都需要相同嘅基礎需求。兩個項目，兩個行業，一套重複嘅技術架構。",
    },
  },

  // ── S3: The Problem (slide 2) ─────────────────────────────────────────────
  {
    slideIndex: 2,
    speaker: "denny",
    en: {
      display: "AI demos are easy. AI businesses are still hard. Small teams can prototype quickly now, but turning that into a real business still means stitching together auth, roles, AI workflows, knowledge, analytics, voice, and admin tools.",
      speech: "A.I. demos are easy. A.I. businesses are still hard. Small teams can prototype quickly now, but turning that into a real business still means stitching together auth, roles, A.I. workflows, knowledge, analytics, voice, and admin tools.",
    },
    zhCN: {
      display: "AI 演示很容易，但 AI 业务仍然很难。小团队现在可以快速做原型，但要把它变成真正的业务，仍然需要拼凑认证、角色、AI 工作流、知识库、分析、语音和管理工具。",
      speech: "AI 演示很容易，但 AI 业务仍然很难。小团队现在可以快速做原型，但要把它变成真正的业务，仍然需要拼凑认证、角色、AI 工作流、知识库、分析、语音和管理工具。",
    },
    zhTW: {
      display: "AI 演示好容易，但 AI 業務仲係好難。小團隊而家可以快速做原型，但要將佢變成真正嘅業務，仲係要拼湊認證、角色、AI 工作流、知識庫、分析、語音同管理工具。",
      speech: "AI 演示好容易，但 AI 業務仲係好難。小團隊而家可以快速做原型，但要將佢變成真正嘅業務，仲係要拼湊認證、角色、AI 工作流、知識庫、分析、語音同管理工具。",
    },
  },
  {
    slideIndex: 2,
    speaker: "denny",
    en: {
      display: "That works for a prototype. It breaks when they want to launch a complete, growing business.",
      speech: "That works for a prototype. It breaks when they want to launch a complete, growing business.",
    },
    zhCN: {
      display: "这对原型来说没问题。但当他们想要启动一个完整的、不断增长的业务时，就会崩溃。",
      speech: "这对原型来说没问题。但当他们想要启动一个完整的、不断增长的业务时，就会崩溃。",
    },
    zhTW: {
      display: "呢個對原型嚟講冇問題。但當佢哋想要啟動一個完整嘅、不斷增長嘅業務時，就會崩潰。",
      speech: "呢個對原型嚟講冇問題。但當佢哋想要啟動一個完整嘅、不斷增長嘅業務時，就會崩潰。",
    },
  },

  // ── S4: The Solution (slide 3) ────────────────────────────────────────────
  {
    slideIndex: 3,
    speaker: "denny",
    en: {
      display: "One workspace. Many apps. Shared company context from day one. StoaBase gives every customer one shared foundation for users, teams, roles and permissions — one AI layer for knowledge, memory, tools and workflows — and many apps that inherit company context on day one.",
      speech: "One workspace. Many apps. Shared company context from day one. StoaBase gives every customer one shared foundation for users, teams, roles and permissions — one A.I. layer for knowledge, memory, tools and workflows — and many apps that inherit company context on day one.",
    },
    zhCN: {
      display: "一个工作空间，多个应用，从第一天起就共享企业知識庫。StoaBase 为每个客户提供统一的基础层——用户、团队、角色和权限。一个 AI 层——知识、记忆、工具和工作流。多个从第一天起就继承企业知識庫的应用。",
      speech: "一个工作空间，多个应用，从第一天起就共享企业知識庫。StoaBase 为每个客户提供统一的基础层——用户、团队、角色和权限。一个 AI 层——知识、记忆、工具和工作流。多个从第一天起就继承企业知識庫的应用。",
    },
    zhTW: {
      display: "一個工作空間，多個 App，由第一日起就共享企業知識庫。StoaBase 為每個客戶提供統一嘅基礎層——用戶、團隊、角色同權限。一個 AI 層——知識、記憶、工具同工作流。多個由第一日起就繼承企業知識庫嘅 App。",
      speech: "一個工作空間，多個 App，由第一日起就共享企業知識庫。StoaBase 為每個客戶提供統一嘅基礎層——用戶、團隊、角色同權限。一個 AI 層——知識、記憶、工具同工作流。多個由第一日起就繼承企業知識庫嘅 App。",
    },
  },
  {
    slideIndex: 3,
    speaker: "denny",
    en: {
      display: "StoaBase is not just app generation. It is the operating layer for an AI-native organization.",
      speech: "StoaBase is not just app generation. It is the operating layer for an A.I.-native organization.",
    },
    zhCN: {
      display: "StoaBase 不只是应用生成，而是 AI 原生组织的操作层。",
      speech: "StoaBase 不只是应用生成，而是 AI 原生组织的操作层。",
    },
    zhTW: {
      display: "StoaBase 唔止係 App 生成，而係 AI 原生組織嘅作業層。",
      speech: "StoaBase 唔止係 App 生成，而係 AI 原生組織嘅作業層。",
    },
  },

  // ── S5: What Already Exists (slide 4) ─────────────────────────────────────
  {
    slideIndex: 4,
    speaker: "denny",
    en: {
      display: "Empowering anyone to launch a business with 10% of the effort. This is not a future roadmap. The platform already includes twelve production modules. Watch the demo: type in any business idea — an AI tutor, an onboarding system, a customer copilot — and see which modules light up, ready to power it.",
      speech: "Empowering anyone to launch a business with 10% of the effort. This is not a future roadmap. The platform already includes twelve production modules. Watch the demo: type in any business idea — an A.I. tutor, an onboarding system, a customer copilot — and see which modules light up, ready to power it.",
    },
    zhCN: {
      display: "赋能任何人以 10% 的努力启动业务。这不是未来路线图，平台已经包含十二个生产模块。看演示：输入任何商业构想——AI 辅导、入职系统、客户助手——看看哪些模块会亮起来，随时准备为其提供动力。",
      speech: "赋能任何人以 10% 的努力启动业务。这不是未来路线图，平台已经包含十二个生产模块。看演示：输入任何商业构想——AI 辅导、入职系统、客户助手——看看哪些模块会亮起来，随时准备为其提供动力。",
    },
    zhTW: {
      display: "賦能任何人以 10% 嘅努力啟動業務。呢個唔係未來路線圖，平台已經包含十二個生產模組。睇演示：輸入任何商業構想——AI 導師、入職系統、客戶助手——睇下邊啲模組會亮起嚟，隨時準備為佢提供動力。",
      speech: "賦能任何人以 10% 嘅努力啟動業務。呢個唔係未來路線圖，平台已經包含十二個生產模組。睇演示：輸入任何商業構想——AI 導師、入職系統、客戶助手——睇下邊啲模組會亮起嚟，隨時準備為佢提供動力。",
    },
  },

  // ── S6: Why Now (slide 5) ─────────────────────────────────────────────────
  {
    slideIndex: 5,
    speaker: "denny",
    en: {
      display: "The bottleneck has moved. App generation is getting cheaper — building a prototype is no longer the hard part. AI-native companies are more AI-demanding — they build, operate, and scale based on AI as their core foundation. And the missing control point is the runtime layer — the winner will help them operate AI-native businesses, not just build screens.",
      speech: "The bottleneck has moved. App generation is getting cheaper — building a prototype is no longer the hard part. A.I.-native companies are more A.I.-demanding — they build, operate, and scale based on A.I. as their core foundation. And the missing control point is the runtime layer — the winner will help them operate A.I.-native businesses, not just build screens.",
    },
    zhCN: {
      display: "瓶颈已经转移了。应用生成变得更便宜——构建原型不再是难点。AI 原生公司对 AI 的需求更高——他们以 AI 为核心基础来构建、运营和扩展。缺失的控制点是运行时层——赢家将帮助他们运营 AI 原生业务，而不只是构建界面。",
      speech: "瓶颈已经转移了。应用生成变得更便宜——构建原型不再是难点。AI 原生公司对 AI 的需求更高——他们以 AI 为核心基础来构建、运营和扩展。缺失的控制点是运行时层——赢家将帮助他们运营 AI 原生业务，而不只是构建界面。",
    },
    zhTW: {
      display: "樽頸位已經轉移咗。App 生成變得更平——起原型唔再係難關。AI 原生公司對 AI 嘅需求更高——佢哋以 AI 為核心基礎嚟構建、營運同擴展。缺失嘅控制點係運行時層——贏家會幫助佢哋營運 AI 原生業務，而唔止係起界面。",
      speech: "樽頸位已經轉移咗。App 生成變得更平——起原型唔再係難關。AI 原生公司對 AI 嘅需求更高——佢哋以 AI 為核心基礎嚟構建、營運同擴展。缺失嘅控制點係運行時層——贏家會幫助佢哋營運 AI 原生業務，而唔止係起界面。",
    },
  },

  // ── S7: Proof of Concept — ReaLM (slide 6) ──────────────────────────────
  {
    slideIndex: 6,
    speaker: "denny",
    en: {
      display: "We didn't just theorize it. We vibed it into existence. ReaLM — a NotebookLM-class product, built in weeks on the StoaBase SDK. One developer. Full AI workspace — explainer, knowledge base, rich editor, quiz, flashcards, mind maps, podcast, co-edit, social feed. All powered by the shared platform layer.",
      speech: "We didn't just theorize it. We vibed it into existence. ReaLM — a NotebookLM-class product, built in weeks on the StoaBase S.D.K. One developer. Full A.I. workspace — explainer, knowledge base, rich editor, quiz, flashcards, mind maps, podcast, co-edit, social feed. All powered by the shared platform layer.",
    },
    zhCN: {
      display: "我们不止是理论化——我们把它创造出来了。ReaLM，一个 NotebookLM 级别的产品，用几周时间在 StoaBase SDK 上构建而成。一个开发者，完整的 AI 工作空间——全部由共享平台层驱动。",
      speech: "我们不止是理论化——我们把它创造出来了。ReaLM，一个 NotebookLM 级别的产品，用几周时间在 StoaBase SDK 上构建而成。一个开发者，完整的 AI 工作空间——全部由共享平台层驱动。",
    },
    zhTW: {
      display: "我哋唔止係理論化——我哋將佢建立出嚟。ReaLM，一個 NotebookLM 級別嘅產品，用幾個禮拜喺 StoaBase SDK 上起好。一個開發者，完整嘅 AI 工作空間——全部由共享平台層驅動。",
      speech: "我哋唔止係理論化——我哋將佢建立出嚟。ReaLM，一個 NotebookLM 級別嘅產品，用幾個禮拜喺 StoaBase SDK 上起好。一個開發者，完整嘅 AI 工作空間——全部由共享平台層驅動。",
    },
  },
  {
    slideIndex: 6,
    speaker: "denny",
    en: {
      display: "Live in production. Over 10 million tokens processed. If one person can ship this in weeks, imagine what a team can build on StoaBase.",
      speech: "Live in production. Over 10 million tokens processed. If one person can ship this in weeks, imagine what a team can build on StoaBase.",
    },
    zhCN: {
      display: "已在生产环境上线，处理了超过 1,000 万个 token。如果一个人能在几周内做到这些，想象一下一个团队在 StoaBase 上能做什么。",
      speech: "已在生产环境上线，处理了超过 1,000 万个 token。如果一个人能在几周内做到这些，想象一下一个团队在 StoaBase 上能做什么。",
    },
    zhTW: {
      display: "已喺生產環境上線，處理咗超過 1,000 萬個 token。如果一個人可以喺幾個禮拜內做到呢啲，諗下一個團隊喺 StoaBase 上可以做到乜。",
      speech: "已喺生產環境上線，處理咗超過 1,000 萬個 token。如果一個人可以喺幾個禮拜內做到呢啲，諗下一個團隊喺 StoaBase 上可以做到乜。",
    },
  },

  // ── S8: Go-To-Market (slide 7) ────────────────────────────────────────────
  {
    slideIndex: 7,
    speaker: "denny",
    en: {
      display: "Land with one mission-critical app. Expand through the workspace. Four steps: Identify a painful, high-value workflow. Launch the first app fast. Connect users, permissions, knowledge, and analytics into a shared workspace. Then expand into adjacent apps across teams and stakeholders.",
      speech: "Land with one mission-critical app. Expand through the workspace. Four steps: Identify a painful, high-value workflow. Launch the first app fast. Connect users, permissions, knowledge, and analytics into a shared workspace. Then expand into adjacent apps across teams and stakeholders.",
    },
    zhCN: {
      display: "从一个关键应用着陆，通过工作空间扩展。四个步骤：识别一个痛苦的、高价值的工作流。快速启动第一个应用。将用户、权限、知识和分析连接到共享工作空间。然后扩展到跨团队和利益相关者的相邻应用。",
      speech: "从一个关键应用着陆，通过工作空间扩展。四个步骤：识别一个痛苦的、高价值的工作流。快速启动第一个应用。将用户、权限、知识和分析连接到共享工作空间。然后扩展到跨团队和利益相关者的相邻应用。",
    },
    zhTW: {
      display: "由一個關鍵 App 着陸，透過工作空間擴展。四個步驟：識別一個痛苦嘅、高價值嘅工作流。快速啟動第一個 App。將用戶、權限、知識同分析連接到共享工作空間。然後擴展到跨團隊同利益相關者嘅相鄰 App。",
      speech: "由一個關鍵 App 着陸，透過工作空間擴展。四個步驟：識別一個痛苦嘅、高價值嘅工作流。快速啟動第一個 App。將用戶、權限、知識同分析連接到共享工作空間。然後擴展到跨團隊同利益相關者嘅相鄰 App。",
    },
  },
  {
    slideIndex: 7,
    speaker: "denny",
    en: {
      display: "This is not one-and-done SaaS. It is an expansion platform inside every account.",
      speech: "This is not one-and-done SaaS. It is an expansion platform inside every account.",
    },
    zhCN: {
      display: "这不是一次性的 SaaS，而是每个账户内部的扩展平台。",
      speech: "这不是一次性的 SaaS，而是每个账户内部的扩展平台。",
    },
    zhTW: {
      display: "呢個唔係一次性嘅 SaaS，而係每個賬戶內部嘅擴展平台。",
      speech: "呢個唔係一次性嘅 SaaS，而係每個賬戶內部嘅擴展平台。",
    },
  },

  // ── S9: Business Model (slide 8) ──────────────────────────────────────────
  {
    slideIndex: 8,
    speaker: "denny",
    en: {
      display: "Revenue expands as customers standardize more workflows on StoaBase. Four streams: platform fee, implementation, usage-based AI, and expansion. As customers add more apps, teams, and modules — every layer of the stack compounds.",
      speech: "Revenue expands as customers standardize more workflows on StoaBase. Four streams: platform fee, implementation, usage-based A.I., and expansion. As customers add more apps, teams, and modules — every layer of the stack compounds.",
    },
    zhCN: {
      display: "随着客户在 StoaBase 上标准化更多工作流，收入也随之增长。四个收入来源：平台费、实施费、按使用量计的 AI 费用和扩展费。当客户增加更多应用、团队和模块时——每一层都在复合增长。",
      speech: "随着客户在 StoaBase 上标准化更多工作流，收入也随之增长。四个收入来源：平台费、实施费、按使用量计的 AI 费用和扩展费。当客户增加更多应用、团队和模块时——每一层都在复合增长。",
    },
    zhTW: {
      display: "隨住客戶喺 StoaBase 上標準化更多工作流，收入都隨之增長。四個收入來源：平台費、實施費、按用量計嘅 AI 費用同擴展費。當客戶增加更多 App、團隊同模組時——每一層都喺複合增長。",
      speech: "隨住客戶喺 StoaBase 上標準化更多工作流，收入都隨之增長。四個收入來源：平台費、實施費、按用量計嘅 AI 費用同擴展費。當客戶增加更多 App、團隊同模組時——每一層都喺複合增長。",
    },
  },

  // ── S10: Competition (slide 9) ───────────────────────────────────────────
  {
    slideIndex: 9,
    speaker: "denny",
    en: {
      display: "Others help create software. StoaBase helps you run an AI-native business. App builders offer fast app creation but no shared company runtime. Internal tool builders give you workflows but not a multi-app operating layer. Custom dev is expensive and non-compounding. Cloud vendors provide infrastructure primitives but no company-level operating context.",
      speech: "Others help create software. StoaBase helps you run an A.I.-native business. App builders offer fast app creation but no shared company runtime. Internal tool builders give you workflows but not a multi-app operating layer. Custom dev is expensive and non-compounding. Cloud vendors provide infrastructure primitives but no company-level operating context.",
    },
    zhCN: {
      display: "其他人帮助创建软件。StoaBase 帮助你运营一个 AI 原生业务。应用构建工具提供快速创建但没有共享的企业运行时。内部工具构建器提供工作流但不是多应用操作层。定制开发昂贵且不可复合。云厂商提供基础设施但没有企业级操作知識庫。",
      speech: "其他人帮助创建软件。StoaBase 帮助你运营一个 AI 原生业务。应用构建工具提供快速创建但没有共享的企业运行时。内部工具构建器提供工作流但不是多应用操作层。定制开发昂贵且不可复合。云厂商提供基础设施但没有企业级操作知識庫。",
    },
    zhTW: {
      display: "其他人幫助創建軟件。StoaBase 幫助你運營一個 AI 原生業務。App 構建工具提供快速創建但冇共享嘅企業運行時。內部工具構建器提供工作流但唔係多 App 作業層。定制開發昂貴且不可複合。雲廠商提供基礎設施但冇企業級嘅操作知識庫。",
      speech: "其他人幫助創建軟件。StoaBase 幫助你運營一個 AI 原生業務。App 構建工具提供快速創建但冇共享嘅企業運行時。內部工具構建器提供工作流但唔係多 App 作業層。定制開發昂貴且不可複合。雲廠商提供基礎設施但冇企業級嘅操作知識庫。",
    },
  },

  // ── S11: Moat (slide 10) ──────────────────────────────────────────────────
  {
    slideIndex: 10,
    speaker: "denny",
    en: {
      display: "The first app wins the project. The tenth app wins the account. Our moat is not app generation — it is the shared graph customers grow into. Compounding data: every app enriches the knowledge graph. Rising switching costs: org-wide permissions and memory become hard to replicate. Cross-app network effects: insights from app one improve app five automatically. And a vertical flywheel: templates and best practices compound with each customer.",
      speech: "The first app wins the project. The tenth app wins the account. Our moat is not app generation — it is the shared graph customers grow into. Compounding data: every app enriches the knowledge graph. Rising switching costs: org-wide permissions and memory become hard to replicate. Cross-app network effects: insights from app one improve app five automatically. And a vertical flywheel: templates and best practices compound with each customer.",
    },
    zhCN: {
      display: "第一个应用赢得项目，第十个应用赢得客户。我们的护城河不是应用生成——而是客户不断深入的共享图谱。复合数据：每个应用丰富知识图谱。上升的切换成本：全组织的权限和记忆变得难以复制。跨应用网络效应：应用一的洞察自动改进应用五。垂直飞轮：模板和最佳实践随每个客户复合增长。",
      speech: "第一个应用赢得项目，第十个应用赢得客户。我们的护城河不是应用生成——而是客户不断深入的共享图谱。复合数据：每个应用丰富知识图谱。上升的切换成本：全组织的权限和记忆变得难以复制。跨应用网络效应：应用一的洞察自动改进应用五。垂直飞轮：模板和最佳实践随每个客户复合增长。",
    },
    zhTW: {
      display: "第一個 App 贏得項目，第十個 App 贏得客戶。我哋嘅護城河唔係 App 生成——而係客戶不斷深入嘅共享圖譜。複合數據：每個 App 豐富知識圖譜。上升嘅切換成本：全組織嘅權限同記憶變得難以複製。跨 App 網絡效應：App 一嘅洞察自動改進 App 五。垂直飛輪：模板同最佳實踐隨每個客戶複合增長。",
      speech: "第一個 App 贏得項目，第十個 App 贏得客戶。我哋嘅護城河唔係 App 生成——而係客戶不斷深入嘅共享圖譜。複合數據：每個 App 豐富知識圖譜。上升嘅切換成本：全組織嘅權限同記憶變得難以複製。跨 App 網絡效應：App 一嘅洞察自動改進 App 五。垂直飛輪：模板同最佳實踐隨每個客戶複合增長。",
    },
  },

  // ── S12: Traction (slide 11) ──────────────────────────────────────────────
  {
    slideIndex: 11,
    speaker: "denny",
    en: {
      display: "Built in production, not in theory. R'ODYSSEY: 10 paid schools, 1,000+ active students, 15+ apps launched, 150 million+ tokens processed. iOMICS: 8,000+ patient records, 2 AI apps launched, 63 million+ tokens processed, 3 bio scientists onboarded.",
      speech: "Built in production, not in theory. R'Odyssey: 10 paid schools, over 1,000 active students, 15 plus apps launched, over 150 million tokens processed. iOmics: over 8,000 patient records, 2 A.I. apps launched, over 63 million tokens processed, 3 bio scientists onboarded.",
    },
    zhCN: {
      display: "在生产环境中构建，不是理论。R'ODYSSEY：10 所付费学校、超过 1,000 名活跃学生、发布超过 15 个应用、处理超过 1.5 亿个 token。iOMICS：超过 8,000 份病历、发布 2 个 AI 应用、处理超过 6,300 万个 token、3 名生物科学家入驻。",
      speech: "在生产环境中构建，不是理论。R'ODYSSEY：10 所付费学校、超过 1,000 名活跃学生、发布超过 15 个应用、处理超过 1.5 亿个 token。iOMICS：超过 8,000 份病历、发布 2 个 AI 应用、处理超过 6,300 万个 token、3 名生物科学家入驻。",
    },
    zhTW: {
      display: "喺生產環境中構建，唔係理論。R'ODYSSEY：10 間付費學校、超過 1,000 名活躍學生、發佈超過 15 個 App、處理超過 1.5 億個 token。iOMICS：超過 8,000 份病歷、發佈 2 個 AI App、處理超過 6,300 萬個 token、3 名生物科學家入駐。",
      speech: "喺生產環境中構建，唔係理論。R'ODYSSEY：10 間付費學校、超過 1,000 名活躍學生、發佈超過 15 個 App、處理超過 1.5 億個 token。iOMICS：超過 8,000 份病歷、發佈 2 個 AI App、處理超過 6,300 萬個 token、3 名生物科學家入駐。",
    },
  },
  {
    slideIndex: 11,
    speaker: "denny",
    en: {
      display: "Customers are not asking for a faster way to build one app. They are asking for a way to keep building without starting over.",
      speech: "Customers are not asking for a faster way to build one app. They are asking for a way to keep building without starting over.",
    },
    zhCN: {
      display: "客户要的不是更快地构建一个应用，而是能够持续构建而不需要从头开始。",
      speech: "客户要的不是更快地构建一个应用，而是能够持续构建而不需要从头开始。",
    },
    zhTW: {
      display: "客戶要嘅唔係更快噉起一個 App，而係能夠持續構建而唔使由頭開始。",
      speech: "客戶要嘅唔係更快噉起一個 App，而係能夠持續構建而唔使由頭開始。",
    },
  },

  // ── S13: Team (slide 12) ──────────────────────────────────────────────────
  {
    slideIndex: 12,
    speaker: "denny",
    en: {
      display: "Built by founders who shipped AI businesses themselves. Previously at hello-air.com — an 8 million dollar ARR company — where we built the AI workflow engine, then evolved it into the full runtime layer that became StoaBase. Our team spans Hong Kong, Canada, and the UK.",
      speech: "Built by founders who shipped A.I. businesses themselves. Previously at hello-air dot com — an 8 million dollar A.R.R. company — where we built the A.I. workflow engine, then evolved it into the full runtime layer that became StoaBase. Our team spans Hong Kong, Canada, and the U.K.",
    },
    zhCN: {
      display: "由亲自交付过 AI 业务的创始人打造。此前在 hello-air.com——一家年收入 800 万美元的公司——构建了 AI 工作流引擎，然后演变为成为 StoaBase 的完整运行时层。团队横跨香港、加拿大和英国。",
      speech: "由亲自交付过 AI 业务的创始人打造。此前在 hello-air.com——一家年收入 800 万美元的公司——构建了 AI 工作流引擎，然后演变为成为 StoaBase 的完整运行时层。团队横跨香港、加拿大和英国。",
    },
    zhTW: {
      display: "由親自交付過 AI 業務嘅創辦人打造。此前喺 hello-air.com——一間年收入 800 萬美元嘅公司——構建咗 AI 工作流引擎，然後演變為成為 StoaBase 嘅完整運行時層。團隊橫跨香港、加拿大同英國。",
      speech: "由親自交付過 AI 業務嘅創辦人打造。此前喺 hello-air.com——一間年收入 800 萬美元嘅公司——構建咗 AI 工作流引擎，然後演變為成為 StoaBase 嘅完整運行時層。團隊橫跨香港、加拿大同英國。",
    },
  },

  // ── S14: Closing (slide 13) ───────────────────────────────────────────────
  {
    slideIndex: 13,
    speaker: "denny",
    en: {
      display: "The next generation of companies will not just use AI. They will run on it. StoaBase is the operating layer that makes that possible.",
      speech: "The next generation of companies will not just use A.I. They will run on it. StoaBase is the operating layer that makes that possible.",
    },
    zhCN: {
      display: "下一代公司不只是使用 AI，而是基于 AI 来运营。StoaBase 就是让这一切成为可能的操作层。",
      speech: "下一代公司不只是使用 AI，而是基于 AI 来运营。StoaBase 就是让这一切成为可能的操作层。",
    },
    zhTW: {
      display: "下一代公司唔止係使用 AI，而係基於 AI 嚟運營。StoaBase 就係令呢一切成為可能嘅作業層。",
      speech: "下一代公司唔止係使用 AI，而係基於 AI 嚟運營。StoaBase 就係令呢一切成為可能嘅作業層。",
    },
  },
  {
    slideIndex: 13,
    speaker: "denny",
    en: {
      display: "We'd love to show you more. Get in touch — hello@stoabase.ai. Thanks for listening.",
      speech: "We'd love to show you more. Get in touch — hello at stoabase dot A.I. Thanks for listening.",
    },
    zhCN: {
      display: "我们很乐意为您展示更多，请联系我们——hello@stoabase.ai。感谢收听。",
      speech: "我们很乐意为您展示更多，请联系我们——hello at stoabase dot AI。感谢收听。",
    },
    zhTW: {
      display: "我哋好樂意為您展示更多，請聯絡我哋——hello@stoabase.ai。多謝收聽。",
      speech: "我哋好樂意為您展示更多，請聯絡我哋——hello at stoabase dot AI。多謝收聽。",
    },
  },
];
