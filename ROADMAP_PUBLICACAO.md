# Roadmap de publicacao

## Comando 1 - Estabilizacao e auditoria da vitrine

Status: primeira passada aplicada.

- Remover Socialis da vitrine publica ate estar no nivel dos outros projetos.
- Remover duplicidade do Lab.
- Tornar o loader da home mais honesto, preso ao carregamento real da pagina.
- Ajustar player de video premium e audio da campanha Claude.
- Adicionar loading com identidade do projeto ao abrir iframes.
- Corrigir admin TecksArt sem etapa de senha.
- Corrigir fotos de produto do TecksArt.
- Fazer QA inicial em mobile, tablet e notebook.

## Comando 2 - Branding proprio e refinamento dos projetos

Status: primeira rodada aplicada neste comando.

- Criar direcao visual por projeto no viewer: Mainstage vermelho/bold, Vant azul/tech, TecksArt galeria premium, Prisma sistema visual, Conutric editorial de marca, TradeFlow corporativo, Hulk produto artesanal.
- Refinar responsividade interna dos projetos abertos em iframe, incluindo tela cheia e navegador.
- Reescrever Prisma como sistema de identidade visual com gerador de conteudo pronto.
- Revisar Vant: erros de escrita, capa/vitrine mais forte e slides com assets melhores.
- Auditar Mainstage e separar problemas reais de conteudo, layout, navegacao e dados.
- Fazer a primeira rodada de ajustes de cada demo sem descaracterizar o que ja ficou bom.

Aplicado:

- Viewer agora recebe tokens de marca por projeto e muda atmosfera, tipografia, cor e composicao conforme o projeto.
- Prisma foi reescrito como sistema de identidade visual com assets reais e um gerador de conteudo pronto.
- Vant recebeu home reescrita, vitrine azul/tech, galeria sem textos quebrados e ajuste de overflow responsivo.
- Mainstage recebeu hero vermelho/bold e uma auditoria separada em `demos/mainstage/AUDIT_MAINSTAGE.md`.
- QA responsivo inicial validou Vant, Prisma, Mainstage e viewer em desktop/tablet/mobile.

## Comando 3 - QA final e publicacao

Status: pendente.

- Rodar matriz responsiva completa: mobile, tablet, notebook, desktop wide e tela cheia.
- Corrigir erros de console, links quebrados, iframes travados, imagens e videos pesados.
- Revisar SEO, metatags, favicon, canonical, robots e sitemap com dominio final.
- Revisar performance: peso de videos, lazy loading, posters, preload e fallback.
- Preparar build/pasta final de publicacao e checklist para Netlify, Vercel ou Cloudflare Pages.
