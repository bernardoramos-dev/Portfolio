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
      "Uma central de trade criada para transformar fluxos fragmentados em uma operação centralizada e rastreável.",
    problem:
      "Solicitações, ajustes e aprovações de uma rede comercial distribuídos entre planilhas soltas e e-mail.",
    solution:
      "Uma plataforma com busca por CNPJ, validação, solicitações de inclusão e exclusão, aprovação, auditoria, importação de base e exportação Excel.",
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
      "Conecta gravadoras e fãs por dados primários consentidos (LGPD).",
    problem:
      "Gravadoras enxergam streams, mas não conhecem os fãs por trás dos números.",
    solution:
      "Uma plataforma com feed em tempo real, perfis, pesquisas, programa de embaixadores e painel B2B para gravadoras.",
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
      "Boutique digital de objetos de design autoral, bem longe do template genérico.",
    problem:
      "Objetos de design autoral vendidos em vitrines que não comunicam o valor das peças.",
    solution:
      "Homepage cinematográfica, catálogo com filtros, página de produto, carrinho, wishlist, checkout via WhatsApp e admin com CRUD.",
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
      "Plataforma para criar e vender skills de IA, cada uma resolvendo um problema concreto.",
    problem:
      "Capacidades de IA vendidas como promessas vagas, sem produto nem entrega clara.",
    solution:
      "Um produto com galeria de skills, preços, painel do criador, chat de geração e admin.",
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
      "Brandbook completo e presença digital entregues como um sistema coeso.",
    problem:
      "Uma consultoria sem identidade consistente entre apresentação, narrativa e presença digital.",
    solution:
      "Identidade, narrativa e playbook entregues como um sistema navegável que o cliente percorre sozinho.",
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
      "Design system para carrosséis de alta conversão, demonstrado num gerador ao vivo.",
    problem:
      "Conteúdo social produzido sem sistema: cada peça reinventa cor, tipo e layout.",
    solution:
      "Cores, tipografia, layouts e regras de composição empacotados num design system interativo.",
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
      "Uma landing simples de venda direta para um amigurumi artesanal, com CTA de WhatsApp e cálculo de quantidade.",
    problem:
      "Um produto físico precisava de uma página direta, emocional e funcional para transformar interesse em conversa de compra.",
    solution:
      "Uma página one-product com foto protagonista, preço dinâmico, seletor de quantidade e checkout via WhatsApp.",
    capabilities: ["Produto fisico", "WhatsApp checkout", "Preco dinamico", "Landing simples"],
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
        shortDescription: "Sistema de identidade visual que gera conteúdo pronto com regras de cor, tipo, layout e composição.",
        problem: "Conteúdo social produzido sem consistência: cada peça reinventa cor, tipo, hierarquia e acabamento.",
        solution: "Um sistema de identidade com gerador interativo para transformar briefing em peças prontas, mantendo a mesma linguagem visual.",
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
