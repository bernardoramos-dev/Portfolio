# Bernardo Ramos Portfolio v3 — Deployment & Workflow

## Quick Start: Deploy Changes to Live Site

O site está publicado em **https://bernardoramos.pages.dev** via Cloudflare Pages.

### Workflow para fazer alterações:

```bash
# 1. Faça as alterações nos arquivos (HTML, CSS, JS, etc)
# Exemplo: editar styles/responsive.css, scripts/components/lab-reel.js, etc

# 2. Build localmente pra validar
npm run build

# 3. Deploy pro Cloudflare Pages (credenciais no env, já configuradas)
npx wrangler pages deploy dist --project-name=bernardoramos --branch=main --commit-dirty=true

# 4. Commit e push pro GitHub
git add [arquivos alterados]
git commit -m "descrição da mudança"
git push
```

> **Nota**: Todos os comandos rodam a partir da pasta `00_SITE_ATUAL/portfolio-v3-greenfield/`

---

## Project Setup

- **Root**: `/00_SITE_ATUAL/portfolio-v3-greenfield/`
- **Main site**: https://bernardoramos.pages.dev
- **GitHub**: https://github.com/bernardoramos-dev/Portfolio
- **Build output**: `/dist` (gerado automaticamente)

---

## Key Files & Directories

### Frontend Code
- `index.html` — página principal com todas as seções
- `demos/` — cases de projeto (Conutric, TradeFlow, Mainstage, etc)
- `scripts/` — JavaScript modular
  - `components/` — componentes reutilizáveis (cursor, navigation, lab-reel, project-shelf, etc)
  - `core/` — configurações globais (smooth-scroll, accessibility, media-controller)
  - `data/projects.js` — todos os 7 projetos + metadados
- `styles/` — CSS organizado por propósito
  - `tokens.css` — cores, fontes, espaçamento, easing
  - `responsive.css` — mobile/tablet/desktop breakpoints
  - `components.css` — estilos de UI reutilizáveis
  - `sections.css` — estilos específicos de seções

### Assets
- `assets/projects/` — covers, atmospheres, screenshots dos projetos
- `assets/video/` — vídeos da hero, Lab, footer

---

## Build & Deploy

```bash
npm run build
# Outputs 219 files, ~38.76 MB to /dist

# Deploy aos vivos (credenciais no env)
npx wrangler pages deploy dist --project-name=bernardoramos --branch=main
```

O deploy é automático — a partir do momento que rodar o comando acima, o site vai estar online em poucos segundos.

---

## Common Edits & Where to Make Them

### Mudar copy/texto de um projeto
→ `scripts/data/projects.js` — edite `shortDescription`, `problem`, `solution` do objeto do projeto

### Ajustar layout mobile
→ `styles/responsive.css` — seção `@media (max-width: 899px)`

### Adicionar/remover vídeos do Lab
→ `index.html` linhas ~276-300 — adicione `<figure class="lab-item">` com um `<video>` dentro

### Mudar cores/tokens globais
→ `styles/tokens.css` — variáveis CSS como `--accent`, `--white`, etc

### Animações e transições
→ `styles/motion.css` — keyframes e `--duration-*` / `--ease-*` tokens

---

## Important Notes

### Reduced Motion
O site **ignora deliberadamente** o flag `prefers-reduced-motion` do SO — o carrossel 3D e as animações de expansão são core visuais. Isso é uma **decisão de produto intencional**.

Se precisar testar com reduced-motion ligado, use a query string: `?motion=reduce`

### Cloudflare Credentials
Token e Account ID já estão configurados nas variáveis de ambiente — o comando `npx wrangler pages deploy` os lê automaticamente.

### iOS Safari Video Controls
Todos os vídeos do Lab têm `controlsList="nofullscreen nodownload"` para suprimir controles nativos que o iOS renderiza involuntariamente.

---

## Mobile UX Enhancements (Latest)

- ✅ Lab carousel gira em 3D real no mobile (não é carrossel flat)
- ✅ Clique abre vídeo no notebook (pointer capture defer)
- ✅ Contador de projetos sincronizado no mobile (hover-touch conflict resolvido)
- ✅ Header shrink-capsule effect em desktop + mobile
- ✅ Projects carousel com spine dimming + swipe hint
- ✅ Copy reescrita em tom humano/agência (zero AI patterns)
- ✅ Ghost cursor desaparece quando sai da janela (mouseout/blur)
- ✅ ScrollTrigger refresh ao fechar modais
- ✅ Scene label sem flicker (IntersectionObserver vs ScrollTrigger deduplicado)
- ✅ iOS Safari video controls suprimidos

---

## Git Workflow

```bash
# Sempre commitar depois do deploy
git add [files]
git commit -m "descrição"
git push
```

Commits vão pro branch `main` automaticamente — histórico completo está no GitHub.

---

## Questions?

Qualquer dúvida sobre o workflow, arquivo específico ou como mudar algo, leia este documento ou pergunte ao Claude (ele tem acesso a tudo aqui).
