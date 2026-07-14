# Bernardo Ramos — Portfólio V3 (greenfield)

Shell completamente novo, construído do zero. Os projetos reais vivem em `demos/`
(cópia binária fiel dos originais — nunca editar pelo shell).

## Rodar localmente

```powershell
cd 00_SITE_ATUAL\portfolio-v3-greenfield
python servidor.py 8078
```

Abra: `http://localhost:8078`

> O `servidor.py` também simula a API do projeto Vant (rotas `/api/*` e
> páginas `/galeria`, `/chat` etc.), então rode sempre por ele em vez de
> `python -m http.server`.

## Publicar

A pasta inteira é estática e autossuficiente — suba `portfolio-v3-greenfield/`
em qualquer host estático (Netlify / Vercel / GitHub Pages / Cloudflare Pages).

Antes de publicar:
1. Troque `https://bernardoramos.example/` pelo domínio final em
   `index.html` (canonical), `robots.txt` e `sitemap.xml`.
2. O projeto Vant usa uma API simulada pelo `servidor.py` local. Em host
   estático puro, as páginas do Vant abrem mas as chamadas `/api/*` retornam
   404 — o restante dos projetos é 100% estático. Se quiser o Vant completo
   em produção, replique as rotas do `servidor.py` como serverless functions.

## Estrutura

```
index.html            shell (uma página)
styles/               tokens → reset → typography → layout → components → sections → motion → responsive
scripts/
  data/projects.js    fonte única de dados dos 7 projetos
  core/               smooth-scroll (Lenis+GSAP), media-controller, text-split, accessibility
  components/         navigation, cursor, magnetic, loader, project-shelf (render),
                      project-chapters (pin/filters/process), project-viewer, lab-reel, footer
  scenes/             hero-background
assets/
  brand/              monograma BR (svg) + logos reais dos projetos
  hero/               poster do vídeo abstrato
  projects/<id>/      covers e telas REAIS capturadas dos projetos (webp)
  video/              vídeos reais (hero, footer, lab)
  vendor/             gsap, ScrollTrigger, lenis (locais)
demos/                OS PROJETOS REAIS — não alterar
```

## Regras herdadas

- Nunca copiar esta pasta com ferramenta que reencode texto (corrompe binários).
- Nenhum texto voltado ao usuário pode chamar os projetos de "demo".
- TradeFlow abre sem senha no portfólio; dados e marcas reais devem permanecer anonimizados.
