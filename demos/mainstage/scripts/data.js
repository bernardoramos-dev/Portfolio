/* ============================================================
   MAINSTAGE V5 — Seed data (fictional, self-contained)
   No backend required. Powers landing, fan app & dashboards.
   ============================================================ */
window.MS_DATA = {
  gravadoras: [
    { id:'grav_001', name:'Warner Music Brasil',    short:'Warner',    plan:'enterprise', fans:24580, artists:4, color:'#1A5FD6', status:'active', health:8.9 },
    { id:'grav_002', name:'Universal Music Brasil',  short:'Universal', plan:'enterprise', fans:21240, artists:3, color:'#6B33C9', status:'active', health:8.4 },
    { id:'grav_003', name:'Sony Music Brasil',       short:'Sony',      plan:'standard',   fans:11890, artists:3, color:'#157A3C', status:'active', health:7.6 },
    { id:'grav_004', name:'Som Livre',               short:'Som Livre', plan:'standard',   fans:6420,  artists:2, color:'#9A6B00', status:'trial',  health:7.1 },
  ],

  artists: [
    { id:'a1', name:'Matuê',               slug:'matue',   genre:'Trap',           grav:'grav_002', verified:true, fans:32400, growth:24, photo:'assets/images/artists/matue.jpg',       banner:'assets/images/artists/matue-banner-v5.jpg',  superfans:5412, health:9.1, color:'#E5322B' },
    { id:'a2', name:'Harry Styles',        slug:'harry',   genre:'Pop',            grav:'grav_001', verified:true, fans:28900, growth:18, photo:'assets/images/artists/harry-styles.jpg', banner:'assets/images/artists/harry-banner-v5.jpg',  superfans:4870, health:8.8, color:'#1A5FD6' },
    { id:'a3', name:'Anitta',              slug:'anitta',  genre:'Pop Nacional',   grav:'grav_001', verified:true, fans:21500, growth:15, photo:'assets/images/artists/anitta.jpg',       banner:'assets/images/artists/anitta-banner.jpg',  superfans:3920, health:8.6, color:'#D41F26' },
    { id:'a4', name:'Ludmilla',            slug:'ludmilla',genre:'Funk',           grav:'grav_001', verified:true, fans:14300, growth:21, photo:'assets/images/artists/ludmilla.jpg',      banner:'', superfans:2610, health:8.2, color:'#6B33C9' },
    { id:'a5', name:'BTS · ARMY Brasil',   slug:'bts',     genre:'K-Pop',          grav:'grav_002', verified:true, fans:38200, growth:12, photo:'assets/images/artists/bts.jpg',           banner:'assets/images/artists/bts-banner.jpg',  superfans:9120, health:9.4, color:'#7A33C9' },
    { id:'a6', name:'Zé Neto & Cristiano', slug:'zeneto',  genre:'Sertanejo',      grav:'grav_003', verified:true, fans:16100, growth:9,  photo:'assets/images/artists/zeneto.jpg',         banner:'', superfans:2140, health:7.8, color:'#9A6B00' },
    { id:'a7', name:'Marília Mendonça',    slug:'marilia', genre:'Sertanejo',      grav:'grav_003', verified:true, fans:19800, growth:7,  photo:'assets/images/artists/marilia.jpg',        banner:'', superfans:3010, health:8.0, color:'#C2185B' },
    { id:'a8', name:'Iza',                 slug:'iza',     genre:'Pop / R&B',      grav:'grav_004', verified:true, fans:9400,  growth:28, photo:'assets/images/artists/iza.jpg',           banner:'', superfans:1280, health:7.9, color:'#157A3C' },
  ],

  posts: [
    { id:'p1', artist:'a1', author:'Matuê', title:'333 chegando', content:'Vocês da MAINSTAGE vão ser os primeiros a ouvir o snippet do novo projeto. Tô passando aqui antes de qualquer rede. Fica ligado.', type:'regular', likes:1247, comments:182, time:'2026-05-30T20:00:00' },
    { id:'p2', artist:'a5', author:'BTS · ARMY Brasil', title:'Ativação — Camiseta Tour ARMY', content:'Sorteio de brindes oficiais só para ARMYs cadastrados na MAINSTAGE. Estoque limitadíssimo. Resgata aí', type:'activation', activation:'act1', likes:2890, comments:431, time:'2026-05-29T14:00:00' },
    { id:'p3', artist:'a3', author:'Anitta', title:'Pesquisa: setlist da turnê', content:'Quero MUITO saber o que vocês querem ouvir ao vivo. Responde a pesquisa, leva 2 min e concorre a meet & greet.', type:'survey', survey:'s2', likes:934, comments:120, time:'2026-05-28T09:00:00' },
    { id:'p4', artist:'a2', author:'Harry Styles', title:'Love On Tour — São Paulo', content:'Brazil, I can feel the energy already. VIP experiences dropping for MAINSTAGE fans first.', type:'activation', activation:'act2', likes:1760, comments:298, time:'2026-05-27T18:30:00' },
    { id:'p5', artist:'a4', author:'Ludmilla', title:'Numanice ao vivo', content:'Quem tá pronto pro próximo Numanice? Comenta a música que não pode faltar!', type:'regular', likes:712, comments:208, time:'2026-05-26T12:00:00' },
    { id:'p6', artist:'a8', author:'Iza', title:'Novo single sexta', content:'Sexta tem coisa nova. E vocês ajudaram a escolher o nome. Obrigada MAINSTAGE.', type:'regular', likes:540, comments:96, time:'2026-05-25T15:00:00' },
  ],

  activations: [
    { id:'act1', artist:'a5', grav:'grav_002', title:'Camiseta Tour ARMY (Oficial)', type:'Merch', total:50, remaining:7,  rules:'Retirar na sede MAINSTAGE com voucher + documento. Apenas membros cadastrados.', expires:'2026-06-30', img:'#7A33C9' },
    { id:'act2', artist:'a2', grav:'grav_001', title:'Ingresso VIP — Harry Styles SP', type:'Ticket', total:20, remaining:3,  rules:'Válido para 1 pessoa. Não transferível. Apresentar voucher na entrada.', expires:'2026-07-15', img:'#1A5FD6' },
    { id:'act3', artist:'a1', grav:'grav_002', title:'Meet & Greet — Matuê', type:'Experience', total:10, remaining:2, rules:'Acesso backstage. Apenas para Superfãs (nível 3).', expires:'2026-08-01', img:'#E5322B' },
    { id:'act4', artist:'a4', grav:'grav_001', title:'Bracelete Exclusivo Ludmilla', type:'Merch', total:100, remaining:64, rules:'Edição limitada numerada. Envio para todo o Brasil.', expires:'2026-07-20', img:'#6B33C9' },
    { id:'act5', artist:'a3', grav:'grav_001', title:'Laminado Backstage — Anitta', type:'Experience', total:15, remaining:9, rules:'Acesso a área restrita no dia do show. Foto autorizada.', expires:'2026-09-10', img:'#D41F26' },
    { id:'act6', artist:'a8', grav:'grav_004', title:'Vinil Autografado — Iza', type:'Merch', total:40, remaining:31, rules:'Vinil físico autografado à mão. Tiragem única.', expires:'2026-08-25', img:'#157A3C' },
  ],

  surveys: [
    { id:'s1', artist:'a5', grav:'grav_002', title:'Perfil do Fã de K-Pop', desc:'Entenda os ARMYs brasileiros para criar experiências melhores.', type:'Quantitativa', status:'active', reward:'Concorra a meet & greet', sent:500, responses:447, points:25,
      questions:[
        { id:'q1', type:'single', text:'Com que frequência você ouve K-Pop por dia?', options:['Menos de 1h','1–3h','3–6h','Mais de 6h'] },
        { id:'q2', type:'single', text:'Onde você mais consome músicas?', options:['Spotify','YouTube','Apple Music','Outro'] },
        { id:'q3', type:'rating', text:'O quanto você pretende ir a um show este ano?' },
        { id:'q4', type:'text',   text:'O que te fez virar fã? Conta pra gente.' },
      ]},
    { id:'s2', artist:'a3', grav:'grav_001', title:'Setlist da Turnê 2026', desc:'Sua opinião molda o próximo show da Anitta.', type:'Quantitativa', status:'active', reward:'Meet & greet exclusivo', sent:800, responses:689, points:25,
      questions:[
        { id:'q1', type:'single', text:'Qual era você mais quer ouvir ao vivo?', options:['Funk','Pop antigo','Fase internacional','Inéditas'] },
        { id:'q2', type:'single', text:'O que mais te motivaria a ir a um show?', options:['Setlist surpresa','Experiência VIP','Preço acessível','Acompanhar amigos'] },
        { id:'q3', type:'rating', text:'Probabilidade de comprar merch oficial' },
        { id:'q4', type:'text',   text:'Que experiência VIP faria você comprar?' },
      ]},
    { id:'s3', artist:'a1', grav:'grav_002', title:'Drop de Merch — Matuê', desc:'Validação de coleção antes do lançamento.', type:'Qualitativa', status:'active', reward:'Acesso antecipado ao drop', sent:300, responses:271, points:30,
      questions:[
        { id:'q1', type:'single', text:'Qual peça você compraria primeiro?', options:['Camiseta','Moletom','Boné','Acessório'] },
        { id:'q2', type:'rating', text:'O quanto o design importa na sua decisão?' },
        { id:'q3', type:'text',   text:'Que collab você sonha em ver?' },
      ]},
  ],

  ambassadors: [
    { id:'am1', name:'Juliana Nascimento', handle:'@julia_army_br', genre:'K-Pop',     state:'SP', followers:45000, brought:342, week:12, points:8550, tier:'platinum', goal:80 },
    { id:'am2', name:'Carlos Eduardo',     handle:'@carlinhosbaile',genre:'Funk',      state:'RJ', followers:28000, brought:198, week:8,  points:4950, tier:'gold',     goal:60 },
    { id:'am3', name:'Mariana Souza',      handle:'@marianasrtnj', genre:'Sertanejo', state:'GO', followers:15000, brought:127, week:5,  points:3175, tier:'silver',   goal:50 },
    { id:'am4', name:'Pedro Henrique',     handle:'@pedrotrap',    genre:'Trap',      state:'CE', followers:33000, brought:289, week:14, points:7220, tier:'gold',     goal:70 },
    { id:'am5', name:'Beatriz Lima',       handle:'@bia.pop',      genre:'Pop',       state:'MG', followers:19500, brought:154, week:6,  points:3850, tier:'silver',   goal:55 },
  ],

  analytics: {
    kpis: { fans:64130, fansGrowth:18, responseRate:89, health:8.7, superfans:21942, activeSurveys:7 },
    growth: [
      { w:'Sem 1', v:38200 }, { w:'Sem 2', v:40100 }, { w:'Sem 3', v:41850 }, { w:'Sem 4', v:43900 },
      { w:'Sem 5', v:46200 }, { w:'Sem 6', v:48050 }, { w:'Sem 7', v:50400 }, { w:'Sem 8', v:53100 },
      { w:'Sem 9', v:55800 }, { w:'Sem 10', v:58600 }, { w:'Sem 11', v:61300 }, { w:'Sem 12', v:64130 },
    ],
    segments: [
      { label:'Core fans',        value:88, count:21940, action:'Focus group' },
      { label:'Show intenders',   value:64, count:15960, action:'Pré-sale' },
      { label:'Merch buyers',     value:46, count:11480, action:'Bundle drop' },
      { label:'Casual listeners', value:32, count:8000,  action:'Campanha local' },
      { label:'Dormant',          value:18, count:6750,  action:'Reativação' },
    ],
    geo: [ { uf:'SP', v:34 }, { uf:'RJ', v:18 }, { uf:'MG', v:11 }, { uf:'BA', v:8 }, { uf:'PR', v:7 }, { uf:'RS', v:6 }, { uf:'CE', v:5 }, { uf:'Outros', v:11 } ],
    age: [ { label:'13–17', v:14 }, { label:'18–24', v:41 }, { label:'25–34', v:28 }, { label:'35–44', v:12 }, { label:'45+', v:5 } ],
    genres: [ { label:'Trap', v:26 }, { label:'Pop', v:23 }, { label:'Funk', v:18 }, { label:'K-Pop', v:17 }, { label:'Sertanejo', v:16 } ],
    insights: [
      { type:'alert', text:'Fãs 18–24 em SP pedem pré-sale 36h antes do anúncio oficial.' },
      { type:'predict', text:'Campanha com creator local deve elevar taxa de resposta em ~21%.' },
      { type:'opportunity', text:'5.412 superfãs de Trap prontos para drop de merch premium.' },
      { type:'risk', text:'Segmento "Dormant" cresceu 4% — recomendada ação de reativação.' },
    ],
    feed: [
      { t:'agora',    txt:'447ª resposta na pesquisa "Perfil do Fã de K-Pop"', tag:'survey' },
      { t:'2 min',    txt:'Voucher resgatado — Camiseta Tour ARMY', tag:'activation' },
      { t:'8 min',    txt:'Novo superfã: nível 3 atingido em Trap', tag:'fan' },
      { t:'15 min',   txt:'Embaixadora Juliana trouxe +3 fãs hoje', tag:'ambassador' },
      { t:'32 min',   txt:'Anitta publicou pesquisa de setlist', tag:'post' },
    ],
  },

  levels: [
    { id:1, name:'Casual',   min:0,   color:'#74777F' },
    { id:2, name:'Engajado', min:25,  color:'#1A5FD6' },
    { id:3, name:'Superfã',  min:60,  color:'#E5322B' },
  ],
  pointRules: { survey:25, activation:10, like:5, comment:3 },
};
