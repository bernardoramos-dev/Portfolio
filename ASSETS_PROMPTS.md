# Prompts — assets de fundo (abstratos, em movimento)

Biblioteca de prompts para gerar **backgrounds cinematográficos em loop** no padrão do site
(ex.: o vídeo do CTA feito no Runway Gen-4 Turbo). Todos monocromáticos/dessaturados para
respeitar o shell SIGNAL/MATTER — a cor vem dos projetos, não do fundo.

---

## DNA visual (cole isto em TODO prompt)

> Dark editorial abstraction. Near-black base (#050505), graphite greys and warm off-white
> (#f3f3ef) only — desaturated, almost monochrome. Soft volumetric light, one directional key
> light, fine 35mm film grain, high dynamic range, cinematic shallow depth of field. Very slow,
> hypnotic, weightless motion. No text, no logos, no people, no UI. Generous negative space and
> low contrast in the lower-center so overlaid white typography stays legible. Seamless loop —
> the last frame matches the first for a perfect cycle. 1920×1080, 60fps, ~12s, H.264.

**Regras que fazem funcionar como fundo**
- **Movimento lento** (drift, não ação) — não pode competir com o conteúdo.
- **Loop perfeito**: sempre peça "seamless loop, last frame matches first".
- **Escuro onde entra texto**: peça área central/inferior escura e limpa.
- **Sem saturação** (menos o Prisma) — combina com o preto do site.
- Fluxo Gen-4: gere a **imagem base** com o "Prompt de imagem", depois use o
  "Prompt de animação" no modo *image-to-video* ("Animate this image into a seamless loop…").

---

## 1 · HERO — tom de entrada  → `assets/hero/hero-loop.mp4`
**Imagem:** Black liquid metal / ink slowly folding over itself in a void, a single cool rim light
grazing the crests, deep blacks, subtle metallic sheen, macro, shallow focus, negative space top-right.
**Animação:** Animate into a seamless 12s loop: the liquid surface undulates very slowly like
breathing, light sweeps gently left-to-right and returns; no camera cuts, no acceleration; last
frame matches first.

## 2 · CTA / RODAPÉ — variante do atual  → `assets/video/cta-loop.mp4`
**Imagem:** Vast dark atmosphere with slow-drifting volumetric fog and faint god-rays, a soft
off-white glow low on the horizon, fine grain, cinematic, lower third kept dark for text.
**Animação:** Animate into a seamless 12s loop: fog drifts diagonally and settles, the low glow
pulses almost imperceptibly, dust particles float upward; perfectly loopable, no hard motion.

## 3 · AMBIENTE (divisor sutil entre seções) — opcional
**Imagem:** Fine luminous dust particles suspended in a black void, faint diagonal light beams,
extreme negative space, near-abstract, barely-there.
**Animação:** Animate into a seamless loop: particles float and shimmer slowly, beams breathe;
minimal motion, meditative, loops invisibly.

---

## Fundos por projeto (para os 4 sem vídeo) — abstratos, aludindo ao tema

> Ao gerar, mantêm-se monocromáticos; a exceção é o Prisma, onde a cor é o próprio conceito.
> Depois é só salvar como `assets/projects/<id>/preview.mp4` que eu ligo no site.

### 4 · SOCIALIS (impacto / pessoas conectadas) → `assets/projects/socialis/preview.mp4`
**Imagem:** Abstract constellation of soft white light points connected by thin luminous threads,
gently woven network on deep black, warm-neutral, bokeh depth.
**Animação:** Seamless loop: nodes pulse softly and threads sway as if breathing, new links fade
in and out; slow, organic, loopable.

### 5 · CONUTRIC (marca / consultoria / estrutura) → `assets/projects/conutric/preview.mp4`
**Imagem:** Monolithic matte-graphite geometric slabs floating in a dark void, architectural,
one grazing key light defining sharp edges, editorial, minimal.
**Animação:** Seamless loop: slabs parallax past each other extremely slowly, light rakes across
the edges and returns; monumental, calm, perfect loop.

### 6 · PRISMA VIRAL (design system / cor / luz) → `assets/projects/prisma/preview.mp4`
**Imagem:** A single glass prism in darkness splitting a thin light beam into a soft, controlled
spectrum spreading across black; the ONE place color is allowed; elegant, restrained.
**Animação:** Seamless loop: the prism rotates a few degrees and back, the spectrum shifts and
breathes across the frame; slow, refined, loopable.

### 7 · HULKINHO (artesanal / amigurumi / feito à mão) → `assets/projects/hulk/preview.mp4`
**Imagem:** Macro of soft woven fibers and yarn threads, tactile texture, warm side light, very
shallow focus, cozy, handmade feel on a dark backdrop.
**Animação:** Seamless loop: fibers sway gently as if in a soft breeze, light shifts warmly;
intimate, tactile, seamless.

---

## Como plugar depois
- **Hero:** substitui `assets/hero/hero-loop.mp4`.
- **CTA:** substitui `assets/video/cta-loop.mp4`.
- **Projetos:** salva em `assets/projects/<id>/preview.mp4` — os painéis já usam `previewVideo`
  quando existe; para Socialis/Conutric/Prisma/Hulk eu adiciono o campo em `scripts/data/projects.js`.
- **Compressão** (se ficar pesado): `ffmpeg -i entrada.mp4 -c:v libx264 -crf 24 -preset slow -an -movflags +faststart saida.mp4`
  (alvo: 4–9 MB por loop; sem áudio, `-an`).
