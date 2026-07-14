/* ============================================================
   data/projects.js — single source of truth for every project.
   Everything here was verified against the real project files;
   no invented dates, clients, metrics or results.
   ============================================================ */
const allProjects = [
  {
    id: "tradeflow",
    index: "01",
    name: "TradeFlow",
    category: "sistemas",
    type: "Plataforma B2B · Sistema corporativo",
    featured: true,
    shortDescription:
      "O painel que tira a operação comercial da bagunça de planilha e e-mail e coloca tudo num fluxo só, rastreável do início ao fim.",
    problem:
      "Cada solicitação, ajuste e aprovação da rede comercial vivia espalhada entre planilhas soltas e e-mails perdidos, sem um histórico confiável de quem aprovou o quê.",
    solution:
      "Uma plataforma única: busca por CNPJ, validação automática, fluxo de inclusão e exclusão, aprovação com auditoria completa, importação de base e exportação em Excel.",
    capabilities: ["Busca por CNPJ", "Fluxos de aprovação", "Auditoria", "Upload de base", "Exportação Excel"],
    brand: {
      mood: "operacao",
      bg: "#1a0a13",
      ink: "#ffe8f1",
      accent: "#ff3d84",
      accent2: "#ff9dc4",
      surface: "#2b0f1d",
      type: "IBM Plex Mono, monospace",
      signature: "grade de auditoria"
    },
    story: {
      layout: "console",
      codename: "TF-CORE",
      status: "AUDITORIA · ONLINE",
      previewLabel: "Console ao vivo",
      action: "Entrar no sistema",
      log: [
        ["09:24:02", "CNPJ 12.345.678/0001-90 validado", "OK"],
        ["09:24:11", "Solicitação de inclusão aprovada", "APROV"],
        ["09:25:40", "Base importada · 1.204 linhas", "SYNC"],
        ["09:26:03", "Exportação Excel gerada", "EXPORT"]
      ],
      metrics: [["Fluxo", "4 etapas"], ["Rastreio", "100% auditável"], ["Base", "CSV / Excel"]]
    },
    cover: "assets/projects/tradeflow/cover.webp",
    atmosphere: "assets/projects/tradeflow/atmosphere.webp",
    previewVideo: "assets/projects/tradeflow/preview.mp4",
    screens: ["assets/projects/tradeflow/screen-admin.webp"],
    experienceUrl: "demos/tradeflow/index.html#preview",
    secondaryExperiences: [
      { label: "Painel admin", url: "demos/tradeflow/admin.html#preview" }
    ]
  },
  {
    id: "mainstage",
    index: "02",
    name: "Mainstage",
    category: "plataformas",
    type: "Plataforma de dados · Música",
    featured: true,
    shortDescription:
      "A ponte entre gravadoras e fãs, construída sobre dados que o próprio fã decide compartilhar, dentro das regras da LGPD.",
    problem:
      "Gravadoras sabem quantos streams um artista tem, mas não sabem quem são as pessoas por trás desse número.",
    solution:
      "Um app de fã com feed em tempo real, perfis e pesquisas, um programa de embaixadores pra premiar quem mais engaja, e um painel B2B pra gravadora acompanhar tudo isso em números.",
    capabilities: ["Feed em tempo real", "Perfis de fã", "Pesquisas", "Programa de embaixadores", "Painel B2B"],
    brand: {
      mood: "palco",
      bg: "#d40000",
      ink: "#ffffff",
      accent: "#ff2a2a",
      accent2: "#111111",
      surface: "#7c0000",
      type: "Impact, Instrument Sans, sans-serif",
      signature: "cartaz de show"
    },
    story: {
      layout: "poster",
      headliner: "MAINSTAGE",
      presenter: "GRAVADORAS × FÃS",
      venue: "AO VIVO",
      date: "DADOS PRIMÁRIOS · LGPD",
      previewLabel: "App do fã + painel B2B",
      action: "Subir ao palco",
      lineup: ["FEED EM TEMPO REAL", "PERFIS DE FÃ", "PESQUISAS", "EMBAIXADORES", "PAINEL B2B"]
    },
    cover: "assets/projects/mainstage/cover.webp",
    atmosphere: "assets/projects/mainstage/atmosphere.webp",
    previewVideo: "assets/projects/mainstage/preview.mp4",
    screens: ["assets/projects/mainstage/screen-app.webp", "assets/projects/mainstage/screen-admin.webp"],
    experienceUrl: "demos/mainstage/index.html",
    previewUrl: "demos/mainstage/pages/b2b.html",
    secondaryExperiences: [
      { label: "Painel admin", url: "demos/mainstage/admin/index.html" }
    ]
  },
  {
    id: "tecksart",
    index: "03",
    name: "TecksArt",
    category: "produtos",
    type: "E-commerce premium",
    featured: true,
    shortDescription:
      "Uma boutique digital pra objetos de design autoral, sem cara de loja pronta: a peça é única, a vitrine também tinha que ser.",
    problem:
      "Peças de design autoral vendidas numa vitrine genérica, que não dava ao objeto o destaque que ele merecia.",
    solution:
      "Homepage cinematográfica, catálogo com filtros, página de produto dedicada, carrinho, lista de desejos, checkout direto pelo WhatsApp e um admin completo por trás de tudo.",
    capabilities: ["Catálogo com filtros", "Carrinho e wishlist", "Checkout WhatsApp", "Admin CRUD"],
    brand: {
      mood: "galeria",
      bg: "#f2efe8",
      ink: "#15120d",
      accent: "#c9913f",
      accent2: "#4b4134",
      surface: "#fffaf0",
      type: "Space Grotesk, Instrument Sans, sans-serif",
      signature: "vitrine de objeto"
    },
    story: {
      layout: "gallery",
      piece: "Objetos de design autoral",
      plaque: "Boutique digital · edição autoral, longe do template genérico.",
      previewLabel: "Vitrine",
      action: "Entrar na galeria",
      meta: [["Formato", "E-commerce premium"], ["Acervo", "Catálogo com filtros"], ["Aquisição", "Checkout WhatsApp"], ["Curadoria", "Admin CRUD"]]
    },
    cover: "assets/projects/tecksart/cover.webp",
    atmosphere: "assets/projects/tecksart/atmosphere.webp",
    previewVideo: "demos/tecksart/assets/videos/hero-abstract.mp4",
    screens: ["assets/projects/tecksart/screen-catalog.webp"],
    experienceUrl: "demos/tecksart/index.html",
    secondaryExperiences: [
      { label: "Admin", url: "demos/tecksart/admin/index.html" }
    ]
  },
  {
    id: "vant",
    index: "04",
    name: "Vant",
    category: "produtos",
    type: "SaaS · Skills de IA",
    featured: true,
    shortDescription:
      "Um SaaS pra criar e vender skills de IA, cada uma resolvendo um problema específico, não uma promessa vaga de \"inteligência artificial\".",
    problem:
      "IA vendida como conceito abstrato, sem um lugar onde cada capacidade vire produto de verdade, com entrega clara.",
    solution:
      "Uma galeria de skills com preço definido, painel pro criador publicar e acompanhar as suas, chat de geração pra testar na hora, e um admin completo por trás de tudo.",
    capabilities: ["Galeria de skills", "Chat de geração", "Painel do criador", "Preços", "Admin"],
    brand: {
      mood: "blueprint",
      bg: "#031c4d",
      ink: "#eef6ff",
      accent: "#2f7cff",
      accent2: "#a8b0bd",
      surface: "#082a66",
      type: "Inter, Instrument Sans, sans-serif",
      signature: "interface tecnica"
    },
    story: {
      layout: "blueprint",
      version: "v · SKILLS DE IA",
      note: "SAAS · MÓDULOS DE IA COMPONÍVEIS",
      previewLabel: "Render ao vivo",
      action: "Compilar demo",
      specs: [
        ["MÓDULO", "Galeria de skills"],
        ["ENGINE", "Chat de geração"],
        ["PAINEL", "Criador + preços"],
        ["ADMIN", "Gestão completa"]
      ]
    },
    cover: "assets/projects/vant/cover.webp",
    atmosphere: "assets/projects/vant/atmosphere.webp",
    previewVideo: "assets/projects/vant/preview.mp4",
    screens: ["assets/projects/vant/screen-galeria.webp", "assets/projects/vant/screen-chat.webp"],
    experienceUrl: "demos/vant/index.html",
    secondaryExperiences: [
      { label: "Galeria", url: "demos/vant/galeria.html" }
    ]
  },
  {
    id: "conutric",
    index: "06",
    name: "Conutric",
    category: "marcas",
    type: "Identidade de marca",
    shortDescription:
      "Identidade de marca e presença digital entregues como um sistema só, não um PDF de 40 páginas que ninguém abre depois.",
    problem:
      "A consultoria tinha identidade visual, discurso e presença digital que não conversavam entre si: cada material parecia de uma marca diferente.",
    solution:
      "Um brandbook navegável que junta identidade, narrativa e regras de uso num só lugar, pra o cliente consultar sozinho sempre que precisar.",
    capabilities: ["Identidade visual", "Brandbook", "Narrativa", "Presença digital"],
    brand: {
      mood: "editorial",
      bg: "#0e2019",
      ink: "#f3efe4",
      accent: "#f0a500",
      accent2: "#a8d5ba",
      surface: "#16302a",
      type: "Instrument Sans, Inter, sans-serif",
      signature: "caderno de marca"
    },
    story: {
      layout: "editorial",
      masthead: "CONUTRIC",
      issue: "BRAND SYSTEM · Nº 01",
      headline: "Identidade, narrativa e presença digital como um sistema só.",
      caption: "Caderno de marca navegável",
      action: "Abrir o caderno",
      index: ["Identidade visual", "Brandbook", "Narrativa", "Presença digital"]
    },
    cover: "assets/projects/conutric/cover.webp",
    atmosphere: "assets/projects/conutric/atmosphere.webp",
    screens: [],
    experienceUrl: "demos/conutric.html",
    secondaryExperiences: []
  },
  {
    id: "prisma",
    index: "07",
    name: "Prisma Viral",
    category: "marcas",
    type: "Design system · Social",
    shortDescription:
      "Um sistema de identidade que vira gerador de carrossel: entra o briefing, sai a peça pronta, sempre na mesma linguagem visual.",
    problem:
      "Cada post social era feito do zero, cor, tipografia e layout reinventados a cada peça, sem nenhuma consistência de marca.",
    solution:
      "Cores, tipografia, layouts e regras de composição empacotados num design system interativo, que transforma briefing em peça pronta pra publicar.",
    capabilities: ["Design system", "Brandbook", "Gerador interativo"],
    brand: {
      mood: "sistema",
      bg: "#160a3a",
      ink: "#fbf7ff",
      accent: "#a870ff",
      accent2: "#2df2d0",
      surface: "#220d56",
      type: "IBM Plex Mono, Inter, monospace",
      signature: "matriz visual"
    },
    story: {
      layout: "system",
      subtitle: "SISTEMA DE IDENTIDADE · GERADOR",
      note: "Briefing entra · peça pronta sai.",
      previewLabel: "Gerador ao vivo",
      action: "Gerar peça",
      swatches: ["#a870ff", "#2df2d0", "#ffcf4a", "#fbf7ff", "#160a3a"],
      tokens: [["COR", "5 famílias"], ["TIPO", "Escala modular"], ["LAYOUT", "Grid 12 col"], ["REGRAS", "Composição"]]
    },
    cover: "assets/projects/prisma/cover.webp",
    atmosphere: "assets/projects/prisma/atmosphere.webp",
    screens: [],
    experienceUrl: "demos/prisma/index.html",
    secondaryExperiences: []
  },
  {
    id: "hulk",
    index: "08",
    name: "Hulkinho",
    category: "produtos",
    type: "Landing de produto artesanal",
    shortDescription:
      "Uma landing enxuta pra vender um amigurumi artesanal direto pelo WhatsApp, com a peça em destaque e o preço calculado na hora.",
    problem:
      "Um produto feito à mão precisava de uma página que vendesse pelo afeto da peça e puxasse rápido pra conversa de compra, sem parecer um catálogo genérico.",
    solution:
      "Uma página de produto único, com a foto em destaque, preço que se ajusta pela quantidade escolhida, e botão direto pro WhatsApp pra fechar o pedido.",
    capabilities: ["Produto físico", "Checkout via WhatsApp", "Preço dinâmico", "Landing simples"],
    brand: {
      mood: "artesanal",
      bg: "#f5f1e8",
      ink: "#172512",
      accent: "#41ab52",
      accent2: "#d08c45",
      surface: "#fff7e8",
      type: "Instrument Sans, Inter, sans-serif",
      signature: "produto feito a mao"
    },
    story: {
      layout: "craft",
      stamp: "SOB ENCOMENDA",
      tagline: "Feito à mão · Amigurumi",
      previewLabel: "Feito à mão",
      action: "Ver a peça",
      details: [["Produto", "Peça artesanal"], ["Preço", "Dinâmico"], ["Pedido", "WhatsApp"]]
    },
    cover: "assets/projects/hulk/cover-site.png",
    atmosphere: "assets/projects/hulk/atmosphere.webp",
    screens: ["assets/projects/hulk/cover.png"],
    experienceUrl: "demos/hulk/index.html",
    secondaryExperiences: []
  }
];

export const projects = allProjects
  .map((p, i) => {
    const normalized = { ...p, index: String(i + 1).padStart(2, "0") };
    if (normalized.id === "prisma") {
      Object.assign(normalized, {
        type: "Sistema de identidade visual / Conteúdo",
        shortDescription: "Um sistema de identidade visual que vira gerador: entra o briefing, sai a peça pronta, sempre na mesma linguagem visual.",
        problem: "Cada post social nascia do zero, cor, tipografia, hierarquia e acabamento reinventados a cada peça.",
        solution: "Um sistema de identidade com gerador interativo, que transforma briefing em peça pronta sem perder a consistência visual.",
        capabilities: ["Identidade visual", "Sistema de templates", "Gerador de conteúdo", "Regras de composição"]
      });
    }
    return normalized;
  });

/* per-project accent — used to give each project's viewer its own world */
export const accents = {
  tradeflow: "#ff3d84",
  mainstage: "#ff2a2a",
  tecksart:  "#c9913f",
  vant:      "#2f7cff",
  conutric:  "#f0a500",
  prisma:    "#a870ff",
  hulk:      "#41ab52"
};
projects.forEach((p) => { p.accent = accents[p.id] || "#f3f3ef"; });

export const featured = projects.filter((p) => p.featured);
export const byId = Object.fromEntries(projects.map((p) => [p.id, p]));

export const filters = [
  { key: "todos", label: "Todos" },
  { key: "produtos", label: "Produtos" },
  { key: "plataformas", label: "Plataformas" },
  { key: "sistemas", label: "Sistemas" },
  { key: "marcas", label: "Marcas" }
];
