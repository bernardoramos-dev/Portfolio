const Vant = (() => {
  const demoUserKey = 'vant-demo-user';
  function esc(s){ const d=document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }
  function toast(msg, tipo=''){
    let box=document.querySelector('.toasts');
    if(!box){ box=document.createElement('div'); box.className='toasts'; document.body.appendChild(box); }
    const t=document.createElement('div'); t.className='toast '+tipo; t.textContent=msg; box.appendChild(t);
    setTimeout(()=>{ t.style.transition='opacity .35s, transform .35s'; t.style.opacity='0'; t.style.transform='translateY(10px)'; },2600);
    setTimeout(()=>t.remove(),3100);
  }
  async function api(){ return { status:0, ok:false, data:{} }; }
  async function me(){ try { return JSON.parse(localStorage.getItem(demoUserKey) || 'null'); } catch { return null; } }
  function saveUser(user){ localStorage.setItem(demoUserKey, JSON.stringify(user)); }
  function logo(){ return '<img class="brand-logo" src="static/img/logo.png" alt="Vant">'; }
  function montarBg(){
    if(document.querySelector('.bg-fx')) return;
    const d=document.createElement('div'); d.className='bg-fx'; d.innerHTML='<div class="grid"></div><div class="noise"></div>'; document.body.prepend(d);
  }
  function pageReady(done){
    const tasks=[]; const push=p=>tasks.push(Promise.resolve(p).catch(()=>{}));
    document.querySelectorAll('img').forEach(img=>{ if(!img.complete) push(new Promise(r=>{ img.onload=img.onerror=r; setTimeout(r,3000); })); });
    document.querySelectorAll('iframe[src]').forEach(f=>push(new Promise(r=>{ f.onload=r; setTimeout(r,4200); })));
    push(document.fonts?.ready || Promise.resolve());
    if(document.readyState !== 'complete') push(new Promise(r=>addEventListener('load',r,{once:true})));
    Promise.all(tasks).then(done); setTimeout(done,7000);
  }
  function montarPreloader(){
    if(sessionStorage.getItem('vantPreloaded')) return;
    sessionStorage.setItem('vantPreloaded','1');
    const pre=document.createElement('div'); pre.className='preloader'; pre.innerHTML='<div class="pre-center"><img class="pre-logo" src="static/img/logo.png" alt="Vant"><div class="pre-count" id="preCount">0%</div><div class="pre-bar"><i id="preBarFill"></i></div></div>'; document.body.appendChild(pre); document.body.classList.add('preloading');
    const count=pre.querySelector('#preCount'), fill=pre.querySelector('#preBarFill'); let target=0, shown=0, closed=false; const close=()=>{ if(closed)return; closed=true; target=1; count.textContent='100%'; fill.style.width='100%'; pre.classList.add('done'); setTimeout(()=>{ pre.classList.add('exit'); document.body.classList.remove('preloading'); setTimeout(()=>pre.remove(),800); },280); };
    pageReady(close); const iv=setInterval(()=>{ target=Math.min(.96,target+.08); },180);
    (function tick(){ shown += (target-shown)*.16; const v=Math.min(99,Math.round(shown*100)); count.textContent=v+'%'; fill.style.width=v+'%'; if(closed){ clearInterval(iv); return; } requestAnimationFrame(tick); })();
  }
  async function montarNav(){
    const u=await me(); if(document.querySelector('.nav')) return u;
    const links=[['index.html','Início'],['galeria.html','Galeria'],['skills.html','Skills'],['chat.html','Chat IA'],['precos.html','Preços']];
    const nav=document.createElement('header'); nav.className='nav';
    nav.innerHTML='<div class="nav-inner"><a class="brand" href="index.html">'+logo()+'</a><nav class="nav-links" id="navLinks">'+links.map(([h,t])=>'<a href="'+h+'">'+t+'</a>').join('')+'</nav><div class="nav-cta">'+(u?'<a class="points-pill" href="painel.html"><span id="navPontos">'+u.pontos+'</span> pts</a><a class="btn btn-ghost btn-sm" href="painel.html">'+esc((u.nome||'Conta').split(' ')[0])+'</a>':'<a class="btn btn-ghost btn-sm" href="entrar.html">Entrar</a><a class="btn btn-accent btn-sm" href="criar-conta.html">Criar conta</a>')+'<button class="nav-toggle" id="navToggle" aria-label="Menu"><span></span></button></div></div>';
    document.body.prepend(nav); nav.querySelector('#navToggle').onclick=()=>nav.querySelector('#navLinks').classList.toggle('open'); return u;
  }
  function montarFooter(){ if(document.querySelector('.footer')) return; const f=document.createElement('footer'); f.className='footer'; f.innerHTML='<div class="wrap"><div class="footer-grid"><div><a class="brand" href="index.html">'+logo()+'</a><p class="tagline">Gerador de apresentações com IA, identidades visuais e decks navegáveis.</p></div><div><h4>Produto</h4><a href="galeria.html">Galeria</a><a href="skills.html">Skills</a><a href="chat.html">Chat IA</a></div><div><h4>Conta</h4><a href="criar-conta.html">Criar conta</a><a href="entrar.html">Entrar</a><a href="painel.html">Painel</a></div><div><h4>Demo</h4><a href="admin.html">Admin</a><a href="precos.html">Planos</a></div></div><div class="footer-bottom"><span>Vant demo local</span><span>Sem backend obrigatório</span></div></div>'; document.body.appendChild(f); }
  function revelar(){ const els=document.querySelectorAll('.reveal-up'); if(!('IntersectionObserver' in window)){ els.forEach(e=>e.classList.add('in')); return; } const io=new IntersectionObserver(entries=>entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }}),{threshold:.12}); els.forEach(e=>io.observe(e)); }
  function contarAte(el, alvo, dur=1100, sufixo=''){ const t0=performance.now(); const step=now=>{ const p=Math.min(1,(now-t0)/dur); el.textContent=Math.round((1-Math.pow(1-p,3))*alvo).toLocaleString('pt-BR')+sufixo; if(p<1) requestAnimationFrame(step); }; requestAnimationFrame(step); }
  function initFX(){ revelar(); document.querySelectorAll('[data-count]').forEach(el=>contarAte(el,parseInt(el.dataset.count||'0',10),1200,el.dataset.suffix||'')); }
  async function initPagina(){ montarBg(); montarPreloader(); const u=await montarNav(); initFX(); return u; }
  function md(t){ return '<p>'+esc(t).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\n+/g,'</p><p>')+'</p>'; }
  return { api, me, saveUser, toast, montarNav, montarFooter, revelar, montarBg, montarPreloader, contarAte, initFX, initPagina, esc, md };
})();
