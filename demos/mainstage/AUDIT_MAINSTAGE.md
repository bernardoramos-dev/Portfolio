# Auditoria Mainstage - primeira rodada

Status geral: a demo tem uma boa base visual e dados suficientes para parecer produto, mas ainda nao esta pronta para ser tratada como case finalizado. Nesta rodada, o hero foi reforcado para uma direcao vermelha, bold e mais propria da marca.

## Conteudo

- Ajustar a promessa entre B2B e app de fas. Hoje a landing mistura "fan intelligence para gravadoras" com chamada para cadastro de fa; funciona como ecossistema, mas precisa de uma hierarquia mais clara.
- Revisar nomes de marcas reais citadas como "Warner", "Universal" e "Sony". Para publicacao, decidir se ficam como simulacao explicita ou se viram marcas ficticias.
- Trocar textos de placeholder legal no footer: Termos, Privacidade e LGPD ainda apontam para `#`.
- Corrigir definitivamente qualquer risco de encoding em textos com acento antes de publicar.

## Layout

- Hero refinado nesta rodada: vermelho dominante, texto branco, peso alto e board escuro.
- A secao de scroll horizontal funciona em desktop, mas precisa de QA visual em notebook pequeno e tablet.
- A tabela de segmentacao fica legivel no mobile, mas merece uma versao mais "card" para leitura rapida.
- Cards de artistas dependem muito das fotos; quando houver imagem fraca ou ausente, criar fallback de marca melhor.

## Navegacao

- Links principais abrem: dashboard, app do fa, auth e pagina B2B.
- Footer tem links mortos que precisam virar paginas reais ou ser removidos.
- Admin usa varias subpaginas; a navegacao precisa de uma passada completa em mobile.
- Validar se o menu hamburger abre/fecha corretamente em todos os breakpoints.

## Dados e tecnologia

- Dados sao mockados em `scripts/data.js`, bons para demo, mas precisam ser rotulados como simulacao se forem publicados publicamente.
- Dashboard depende de Chart.js via CDN. Para publicacao robusta, baixar localmente ou substituir por visualizacao propria.
- Alguns scripts tratam ausencia de Chart.js, mas isso pode deixar telas sem grafico sem explicar ao visitante.
- Falta uma passada de console no browser para capturar erros runtime em landing, app e admin.

## Primeira rodada aplicada

- Hero da landing recebeu identidade mais vermelha, branca, bold e de palco.
- Board do hero foi levado para superficie escura para contrastar com o fundo vermelho.
- A auditoria ficou documentada para orientar o proximo comando.
