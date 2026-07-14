/* ============================================================
   MAINSTAGE V5 — Core (Store, helpers, Toast, Modal, Session)
   ============================================================ */

const Store = {
  get(k, fb=null){ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):fb; }catch{ return fb; } },
  set(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch{} },
  del(k){ try{ localStorage.removeItem(k); }catch{} },
};

const fmt = {
  num(n){ return new Intl.NumberFormat('pt-BR').format(Math.round(n||0)); },
  compact(n){ if(n>=1000) return (n/1000).toFixed(n>=10000?0:1).replace('.',',')+'k'; return String(n); },
  date(iso){ if(!iso) return ''; return new Date(iso).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}); },
  pct(n){ return Math.round(n)+'%'; },
};

const $  = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
const el = (tag,cls,html)=>{ const e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e; };

const Toast = {
  wrap:null,
  _w(){ if(!this.wrap){ this.wrap=el('div','toast-wrap'); document.body.appendChild(this.wrap); } return this.wrap; },
  show(msg,type='info',dur=3400){
    const icons={success:'✓',error:'✕',info:'i'};
    const t=el('div',`toast toast--${type}`,`<span class="toast__icon">${icons[type]||'i'}</span><span>${msg}</span>`);
    this._w().appendChild(t);
    setTimeout(()=>{ t.classList.add('out'); setTimeout(()=>t.remove(),360); },dur);
  },
  success(m){this.show(m,'success');}, error(m){this.show(m,'error');}, info(m){this.show(m,'info');},
};

const Modal = {
  overlay:null,
  open(html){
    if(!this.overlay){
      this.overlay=el('div','modal-overlay');
      this.overlay.addEventListener('click',e=>{ if(e.target===this.overlay) this.close(); });
      document.addEventListener('keydown',e=>{ if(e.key==='Escape') this.close(); });
      document.body.appendChild(this.overlay);
    }
    this.overlay.innerHTML=`<div class="modal">${html}</div>`;
    this.overlay.querySelectorAll('[data-modal-close]').forEach(b=>b.addEventListener('click',()=>this.close()));
    requestAnimationFrame(()=>this.overlay.classList.add('open'));
    return this.overlay.querySelector('.modal');
  },
  close(){ if(this.overlay){ this.overlay.classList.remove('open'); } },
};

const Session = {
  KEY:'ms_fan_v5',
  defaults(){ return { name:'Você', genre:'Trap', points:42, liked:[], answered:[], claimed:[], comments:[], joined:Date.now() }; },
  get(){ const s=Store.get(this.KEY); if(!s){ const d=this.defaults(); Store.set(this.KEY,d); return d; } return s; },
  save(s){ Store.set(this.KEY,s); },
  reset(){ Store.del(this.KEY); },
  level(points){
    const lv=window.MS_DATA.levels;
    let cur=lv[0];
    lv.forEach(l=>{ if((points??this.get().points)>=l.min) cur=l; });
    return cur;
  },
  nextLevel(points){
    const lv=window.MS_DATA.levels; const p=points??this.get().points;
    return lv.find(l=>p<l.min)||null;
  },
  addPoints(n,reason){
    const s=this.get(); const before=this.level(s.points).id;
    s.points+=n; this.save(s);
    const after=this.level(s.points).id;
    if(after>before){ const lvl=this.level(s.points); Toast.success(`Você subiu para ${lvl.name}!`); }
    if(reason) Toast.success(`+${n} pts · ${reason}`);
    document.dispatchEvent(new CustomEvent('ms:points',{detail:s}));
    return s;
  },
};

const DB = {
  artist(id){ return window.MS_DATA.artists.find(a=>a.id===id); },
  grav(id){ return window.MS_DATA.gravadoras.find(g=>g.id===id); },
  survey(id){ return window.MS_DATA.surveys.find(s=>s.id===id); },
  activation(id){ return window.MS_DATA.activations.find(a=>a.id===id); },
};

function artistAvatar(a, size){
  if(a.photo) return `<img src="${a.photo}" alt="${a.name}" loading="lazy">`;
  const initial=a.name.replace(/[^A-Za-zÀ-ÿ]/g,'').charAt(0).toUpperCase();
  return `<span class="avatar-fallback" style="--c:${a.color}">${initial}</span>`;
}

/* Export CSV helper */
function exportCSV(data, filename){
  if(!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [headers.join(';'), ...data.map(row => headers.map(h => `"${row[h]??''}"`).join(';'))].join('\n');
  const blob = new Blob(['\uFEFF'+csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download=filename; a.click();
  URL.revokeObjectURL(url);
  Toast.success('Arquivo exportado com sucesso');
}

function initLoader(){
  const loader=$('.loader'); if(!loader) return;
  const fill=$('.loader__fill'), pct=$('.loader__pct'), mask=$('.loader__mask'), mark=$('.loader__mark');
  let p=0;
  const tick=setInterval(()=>{
    p+=Math.random()*12+5;
    if(p>=100){ p=100; clearInterval(tick); setTimeout(done,400); }
    if(fill) fill.style.width=p+'%';
    if(pct) pct.textContent=Math.floor(p)+'%';
    if(mask) mask.style.transform=`scaleY(${1-p/100})`;
    if(mark && p>50) mark.classList.add('revealed');
  },120);
  function done(){
    loader.classList.add('done');
    document.body.classList.remove('no-scroll');
    document.dispatchEvent(new CustomEvent('ms:loaded'));
    setTimeout(()=>loader.style.display='none',1000);
  }
}

document.addEventListener('DOMContentLoaded',()=>{ initLoader(); });
