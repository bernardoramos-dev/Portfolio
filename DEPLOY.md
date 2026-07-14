# Deploy — guia definitivo

Tudo que dava para preparar sem precisar da sua conta pessoal já está pronto:
git iniciado, commit feito, build testado, proteções de segurança e de
conteúdo aplicadas. Só faltam os passos que exigem você logado em algo seu
(criar conta, autorizar acesso, publicar) — são ~10 minutos, uma vez só.
Depois disso, **todo update futuro é `git push` e pronto**, o site se
atualiza sozinho em ~1 minuto.

## Por que Cloudflare Pages

Comparado com Netlify/Vercel/GitHub Pages, para o seu caso (site estático,
sem backend, MUITO vídeo):

- **Banda ilimitada de graça** — Netlify/Vercel limitam ~100GB/mês grátis;
  com vídeo isso estoura fácil. Cloudflare Pages não limita.
- **CDN mais rápido** — rede global da Cloudflare, o site carrega rápido
  em qualquer lugar do mundo.
- **Deploy automático a cada `git push`** — conecta uma vez no GitHub,
  nunca mais precisa fazer upload manual.
- **Histórico de versões com rollback de 1 clique** — se um deploy quebrar
  algo, você volta pro anterior na hora, sem precisar mexer em código.
- **Subdomínio grátis fácil de compartilhar** — `algo-que-voce-escolher.pages.dev`
  (dá pra colocar um domínio próprio depois, se quiser, sem migrar nada).
- **Proteção contra hotlinking de graça** — outros sites não conseguem
  "roubar" suas imagens/vídeos direto pela URL (isso eu já configurei no
  código: `_headers`).

## O que já está pronto (feito por mim)

- ✅ Repositório git criado (branch `main`), primeiro commit feito, limpo
  de qualquer dado sensível.
- ✅ `npm run build` testado — gera a pasta `dist/` (219 arquivos, ~39MB)
  pronta para publicar.
- ✅ `npm run smoke` — 69/69 rotas e assets validados sem erro.
- ✅ `_headers` e `vercel.json` com headers de segurança + proteção contra
  hotlink (outros sites não conseguem embutir suas imagens/vídeos) +
  cache otimizado para os vídeos.
- ✅ `robots.txt` bloqueando os paineis administrativos de indexação.
- ✅ Bloqueio de clique-direito/arrastar nas imagens de capa do catálogo
  (não afeta o resto do site nem a acessibilidade — só as imagens).

## Passo 1 — Conta no GitHub (se você não tiver)

1. Acesse **github.com** → "Sign up" → crie a conta (grátis).
2. Confirme o e-mail.

## Passo 2 — Criar o repositório

1. Logado no GitHub, clique em **"New repository"** (botão verde, ou
   `github.com/new`).
2. Nome sugerido: `bernardo-ramos-portfolio` (o nome não aparece pro
   visitante do site, é só interno).
3. Marque **Private** — o código-fonte fica só seu; o site publicado
   continua público normalmente, só o repositório em si fica fechado.
   (Dá pra tornar público depois se você quiser mostrar como código também.)
4. **Não** marque "Add a README" nem `.gitignore` — já temos os nossos.
5. Clique em **"Create repository"**.

Depois de criado, o GitHub mostra uma URL parecida com:
`https://github.com/SEU-USUARIO/bernardo-ramos-portfolio.git`

## Passo 3 — Enviar o código (rodar no terminal, dentro desta pasta)

Substitua `SEU-USUARIO` e o nome do repo pela URL real que o GitHub te deu:

```powershell
cd "00_SITE_ATUAL\portfolio-v3-greenfield"
git remote add origin https://github.com/SEU-USUARIO/bernardo-ramos-portfolio.git
git push -u origin main
```

Na primeira vez, o Windows vai abrir uma janela de login do GitHub no
navegador — só entrar com sua conta e autorizar. Depois disso nunca mais
pede.

*(Se preferir, me diga quando tiver criado o repositório e me dê a URL —
eu rodo esse `git push` pra você a partir daqui.)*

## Passo 4 — Conta no Cloudflare (se você não tiver)

1. Acesse **dash.cloudflare.com/sign-up** → crie a conta (grátis, só
   e-mail e senha).

## Passo 5 — Conectar e publicar

1. No painel da Cloudflare, vá em **"Workers & Pages"** no menu lateral.
2. Clique **"Create"** → aba **"Pages"** → **"Connect to Git"**.
3. Autorize a Cloudflare a acessar seu GitHub (só marque o repositório
   `bernardo-ramos-portfolio`, não precisa dar acesso a tudo).
4. Selecione o repositório e clique **"Begin setup"**.
5. Configuração do build — preencha exatamente assim:
   - **Project name**: escolha algo curto, vira a URL —
     ex. `bernardoramos` → o site fica em `bernardoramos.pages.dev`
   - **Production branch**: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Clique **"Save and Deploy"**.

Em ~1–2 minutos o site está no ar em `https://SEU-PROJETO.pages.dev` —
fácil de compartilhar, HTTPS automático, rápido no mundo inteiro.

## Como fazer updates depois disso

Qualquer alteração futura (peça um ajuste pra mim, ou edite você mesmo):

```powershell
git add -A
git commit -m "descrição da mudança"
git push
```

A Cloudflare detecta o push sozinha e publica a nova versão em menos de
2 minutos — sem você tocar em mais nada. Se algo quebrar, no painel da
Cloudflare (aba "Deployments") dá pra voltar pra qualquer versão anterior
com 1 clique.

## Domínio próprio (opcional, mais pra frente)

Quando quiser um domínio de verdade (ex. `bernardoramos.com`), é só
comprar num registrador (Registro.br, Namecheap etc.) e apontar pra
Cloudflare Pages nas configurações do projeto — nenhuma mudança de código
necessária. Nesse momento a Cloudflare também libera o **Scrape
Shield / Hotlink Protection** no nível de domínio, uma camada extra além
da que já deixei configurada no código.

## Resumo do que só você pode fazer

Por segurança, essas etapas exigem sua conta/confirmação e eu não posso
fazer por você:
1. Criar a conta no GitHub (Passo 1)
2. Criar a conta no Cloudflare (Passo 4)
3. Autorizar a Cloudflare a acessar seu GitHub (Passo 5.3)
4. Clicar em "Save and Deploy" — o clique que efetivamente publica o site

Tudo o resto (repositório, build, proteções, configuração) já está pronto
nesta pasta esperando o `git push`.
