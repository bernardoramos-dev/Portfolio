/* ============================================================
   MAINSTAGE V5 — Landing dynamic content
   ============================================================ */
(function(){
  const D = window.MS_DATA;

  // Artists
  const grid = document.getElementById('artists-grid');
  if(grid){
    grid.innerHTML = D.artists.slice(0,8).map(a=>`
      <a class="acard" href="pages/app.html" data-hover>
        <div class="acard__media">${a.photo?`<img src="${a.photo}" alt="${a.name}" loading="lazy">`:`<span class="avatar-fallback" style="--c:${a.color}">${a.name.replace(/[^A-Za-zÀ-ÿ]/g,'').charAt(0)}</span>`}</div>
        <div class="acard__overlay"></div>
        <span class="acard__growth">↑ ${a.growth}%</span>
        <div class="acard__info">
          <div class="acard__genre">${a.genre}</div>
          <div class="acard__name">${a.name} ${a.verified?'<span class="acard__verified">✓</span>':''}</div>
          <div class="acard__fans">${fmt.compact(a.fans)} fãs</div>
        </div>
      </a>`).join('');
  }

  // Ambassadors
  const amb = document.getElementById('amb-grid');
  if(amb){
    amb.innerHTML = D.ambassadors.slice(0,3).map(a=>{
      const pct = Math.min(100, Math.round(a.week/a.goal*100));
      return `<div class="amb">
        <div class="amb__top">
          <div><div class="amb__name">${a.name}</div><div class="amb__meta">${a.genre} · ${a.state} · ${a.handle}</div></div>
          <span class="tier tier--${a.tier}">✦ ${a.tier}</span>
        </div>
        <div class="amb__num">${fmt.num(a.brought)}</div>
        <div class="amb__num-label">fãs trazidos para a plataforma</div>
        <div class="amb__bar"><i style="width:${pct}%"></i></div>
        <div class="amb__goal">${a.week}/${a.goal} esta semana · ${pct}% da meta</div>
      </div>`;
    }).join('');
  }
})();
