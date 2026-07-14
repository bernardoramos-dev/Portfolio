/* ============================================================
   MAINSTAGE V5 — Motion (Lenis + GSAP + cursor + interactions)
   Premium scroll, reveals, magnetic UI, horizontal pin.
   ============================================================ */
(function(){
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches || window.innerWidth < 900;
  let lenis = null;

  /* ── Smooth scroll (Lenis) ── */
  function initLenis(){
    if(reduced || typeof Lenis==='undefined') return;
    lenis = new Lenis({
      duration: 1.4,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });
    function raf(t){ lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    window.MS_LENIS = lenis;
    if(typeof ScrollTrigger!=='undefined'){
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
    // anchor links
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click',e=>{
        const id=a.getAttribute('href');
        if(id.length>1){ const t=document.querySelector(id); if(t){ e.preventDefault(); lenis.scrollTo(t,{offset:-80}); closeMobileNav(); } }
      });
    });
  }

  /* ── Header scroll state ── */
  function initHeader(){
    const header=document.querySelector('.header'); if(!header) return;
    const onScroll=()=>header.classList.toggle('scrolled', window.scrollY>30);
    onScroll(); window.addEventListener('scroll',onScroll,{passive:true});
  }

  /* ── Mobile nav ── */
  let mobileOpen=false;
  function closeMobileNav(){
    mobileOpen=false;
    document.querySelector('.hamburger')?.classList.remove('open');
    document.querySelector('.mobile-nav')?.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }
  function initMobileNav(){
    const burger=document.querySelector('.hamburger'); const nav=document.querySelector('.mobile-nav');
    if(!burger||!nav) return;
    burger.addEventListener('click',()=>{
      mobileOpen=!mobileOpen;
      burger.classList.toggle('open',mobileOpen);
      nav.classList.toggle('open',mobileOpen);
      document.body.classList.toggle('no-scroll',mobileOpen);
    });
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMobileNav));
  }

  /* ── Custom cursor + magnetic ── */
  function initCursor(){
    if(isTouch) return;
    const dot=document.querySelector('.cursor-dot'), ring=document.querySelector('.cursor-ring');
    if(!dot||!ring) return;
    document.body.classList.add('cursor-hidden');
    let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
    document.addEventListener('mousemove',e=>{ mx=e.clientX; my=e.clientY; dot.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`; });
    document.addEventListener('mouseleave',()=>{ dot.style.opacity='0'; ring.style.opacity='0'; });
    document.addEventListener('mouseenter',()=>{ dot.style.opacity='1'; ring.style.opacity='1'; });
    document.addEventListener('mousedown',()=>{ dot.classList.add('is-clicking'); ring.classList.add('is-clicking'); });
    document.addEventListener('mouseup',()=>{ dot.classList.remove('is-clicking'); ring.classList.remove('is-clicking'); });
    (function loop(){ rx+=(mx-rx)*0.10; ry+=(my-ry)*0.10; ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
    const hov='a, button, [data-hover], .card--hover, input, .faq__q, .acard, .mod, .step, .vprop';
    document.addEventListener('mouseover',e=>{ if(e.target.closest(hov)) ring.classList.add('is-hover'); });
    document.addEventListener('mouseout', e=>{ if(e.target.closest(hov)) ring.classList.remove('is-hover'); });

    // magnetic
    document.querySelectorAll('.btn--magnetic, [data-magnetic]').forEach(m=>{
      const s=parseFloat(m.dataset.magnetic||'0.4');
      m.addEventListener('mousemove',e=>{ const r=m.getBoundingClientRect(); const x=e.clientX-r.left-r.width/2; const y=e.clientY-r.top-r.height/2; m.style.transform=`translate(${x*s}px,${y*s}px)`; });
      m.addEventListener('mouseleave',()=>{ m.style.transform=''; });
    });
  }

  /* ── Hero entrance animation (GSAP) ── */
  function initHeroEntrance(){
    if(typeof gsap==='undefined') return;
    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo('.hero__pill',
      { opacity:0, y:14 },
      { opacity:1, y:0, duration:0.8, ease:'power3.out' }
    )
    .fromTo('.hero__headline .line > span',
      { y:'110%' },
      { y:0, duration:1.2, ease:'power3.out', stagger:0.1 },
      '-=0.3'
    )
    .fromTo('.hero__sub',
      { opacity:0, y:20 },
      { opacity:1, y:0, duration:0.9, ease:'power3.out' },
      '-=0.6'
    )
    .fromTo('.hero__cta',
      { opacity:0, y:20 },
      { opacity:1, y:0, duration:0.8, ease:'power3.out' },
      '-=0.5'
    )
    .fromTo('.hero__trust',
      { opacity:0 },
      { opacity:1, duration:0.7 },
      '-=0.3'
    )
    .fromTo('#hero-board',
      { opacity:0, scale:0.94, y:30 },
      { opacity:1, scale:1, y:0, duration:1, ease:'power3.out' },
      '-=0.5'
    );
  }

  /* ── Reveal on scroll (GSAP ScrollTrigger) ── */
  function initReveals(){
    if(typeof gsap==='undefined' || typeof ScrollTrigger==='undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // data-reveal elements
    document.querySelectorAll('[data-reveal]').forEach(el => {
      gsap.fromTo(el,
        { opacity:0, y: el.dataset.reveal==='left'?-40 : el.dataset.reveal==='right'?40 : el.dataset.reveal==='scale'?0.94 : 34 },
        { opacity:1, y:0, scale:1, duration:0.9, ease:'power3.out',
          scrollTrigger:{ trigger:el, start:'top 88%', once:true }
        }
      );
    });

    // data-stagger groups
    document.querySelectorAll('[data-stagger]').forEach(group => {
      const kids = Array.from(group.children);
      gsap.fromTo(kids,
        { opacity:0, y:30 },
        { opacity:1, y:0, duration:0.8, ease:'power3.out', stagger:0.08,
          scrollTrigger:{ trigger:group, start:'top 85%', once:true }
        }
      );
    });

    // reveal-lines
    document.querySelectorAll('.reveal-lines').forEach(el => {
      gsap.fromTo(el.querySelectorAll('.line > span'),
        { y:'110%' },
        { y:0, duration:1, ease:'power3.out', stagger:0.08,
          scrollTrigger:{ trigger:el, start:'top 88%', once:true }
        }
      );
    });
  }

  /* ── Counters (GSAP) ── */
  function initCounters(){
    if(typeof gsap==='undefined') return;
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dec = parseInt(el.dataset.dec || '0');
      const obj = { v:0 };
      gsap.to(obj, {
        v: target,
        duration: 2, ease: 'power2.out',
        onUpdate(){
          const val = dec ? obj.v.toFixed(dec).replace('.',',') : new Intl.NumberFormat('pt-BR').format(Math.floor(obj.v));
          el.textContent = val + suffix;
        },
        scrollTrigger:{ trigger:el, start:'top 85%', once:true }
      });
    });
  }

  /* ── Hero parallax ── */
  function initParallax(){
    if(reduced||isTouch||typeof gsap==='undefined') return;
    const layers=document.querySelectorAll('[data-parallax]');
    if(!layers.length) return;
    layers.forEach(l => {
      const speed = parseFloat(l.dataset.parallax) || 0.25;
      gsap.to(l, {
        yPercent: speed * 100,
        ease:'none',
        scrollTrigger:{ trigger:l.parentElement, start:'top bottom', end:'bottom top', scrub:true }
      });
    });
  }

  /* ── Floating hero particles ── */
  function initParticles(){
    const container = document.getElementById('hero-particles');
    if(!container || isTouch) return;
    for(let i=0; i<12; i++){
      const p = document.createElement('div');
      p.className = 'hero-particle';
      const size = Math.random()*3 + 1.5;
      p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;top:${Math.random()*100}%;animation:floatParticle ${8+Math.random()*12}s ease-in-out ${Math.random()*5}s infinite alternate;`;
      container.appendChild(p);
    }
    // Add keyframes
    const style = document.createElement('style');
    style.textContent = `@keyframes floatParticle{0%{opacity:0;transform:translateY(0) translateX(0)}50%{opacity:.6}100%{opacity:0;transform:translateY(-40px) translateX(${Math.random()>0.5?'':'-'}20px)}}`;
    document.head.appendChild(style);
  }

  /* ── Horizontal pinned scroll (GSAP) ── */
  function initHorizontal(){
    const touchNow = window.matchMedia('(hover: none)').matches || window.innerWidth < 900;
    if(touchNow || typeof gsap==='undefined' || typeof ScrollTrigger==='undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('[data-horizontal]').forEach(section=>{
      if(section.dataset.hInit) return;
      const track=section.querySelector('[data-horizontal-track]');
      if(!track) return;
      section.dataset.hInit='1';
      const getScroll=()=> Math.max(0, track.scrollWidth - window.innerWidth + (window.innerWidth*0.06));
      const bar=section.querySelector('[data-h-progress]');
      gsap.to(track,{
        x:()=>-getScroll(),
        ease:'none',
        scrollTrigger:{
          trigger:section, start:'top top', end:()=>'+='+getScroll(),
          scrub:1.2, pin:true, anticipatePin:1, invalidateOnRefresh:true,
          onUpdate:s=>{ if(bar) bar.style.transform=`scaleX(${s.progress})`; },
        }
      });
    });
    ScrollTrigger.refresh();
  }

  /* ── FAQ accordion ── */
  function initFAQ(){
    document.querySelectorAll('.faq__item').forEach(item=>{
      const q=item.querySelector('.faq__q');
      q?.addEventListener('click',()=>{
        const open=item.classList.contains('open');
        item.parentElement.querySelectorAll('.faq__item.open').forEach(o=>{ o.classList.remove('open'); o.querySelector('.faq__a').style.maxHeight=null; });
        if(!open){ item.classList.add('open'); const a=item.querySelector('.faq__a'); a.style.maxHeight=a.scrollHeight+'px'; }
      });
    });
  }

  /* ── Tilt ── */
  function initTilt(){
    if(isTouch||reduced) return;
    document.querySelectorAll('[data-tilt]').forEach(c=>{
      c.addEventListener('mousemove',e=>{ const r=c.getBoundingClientRect(); const px=(e.clientX-r.left)/r.width-0.5; const py=(e.clientY-r.top)/r.height-0.5; c.style.transform=`perspective(800px) rotateY(${px*6}deg) rotateX(${-py*6}deg) translateY(-4px)`; });
      c.addEventListener('mouseleave',()=>c.style.transform='');
    });
  }

  function refresh(){ if(typeof ScrollTrigger!=='undefined') setTimeout(()=>ScrollTrigger.refresh(),300); }

  function boot(){
    initLenis(); initHeader(); initMobileNav(); initCursor();
    initHeroEntrance(); initReveals(); initCounters(); initParallax();
    initParticles(); initHorizontal(); initFAQ(); initTilt(); refresh();
  }
  window.MS_MOTION = { boot, refresh, closeMobileNav, initHorizontal };

  if(document.readyState!=='loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);
  window.addEventListener('load', ()=>{ initHorizontal(); refresh(); });
})();
