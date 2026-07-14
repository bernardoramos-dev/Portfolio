/* ============================================================
   MAINSTAGE V5 — Fan App Controller
   Hash routing: #feed | #surveys | #brindes | #wallet | #perfil
   Uses: MS_DATA, Session, Modal, Toast, DB, fmt, artistAvatar
   ============================================================ */

const App = {
  views: ['feed','surveys','brindes','wallet','perfil'],
  current: 'feed',

  init() {
    const root = document.getElementById('app-root');
    if (!root) return;
    this.root = root;
    this.renderShell();
    this.bindNav();
    this.bindHash();
    this.route();
    document.addEventListener('ms:points', () => this.refreshSidebar());
  },

  /* ─────────── Shell ─────────── */
  renderShell() {
    const fan = Session.get();
    const lvl = Session.level(fan.points);
    const nxt = Session.nextLevel(fan.points);

    this.root.innerHTML = `
      <div class="app-shell">
        <!-- Sidebar Rail (desktop) -->
        <aside class="app-rail">
          <div class="app-rail__logo">
            <img src="../assets/images/brand/logo.png" alt="MAINSTAGE">
          </div>

          <nav class="app-rail__nav">
            <button class="app-rail__item" data-view="feed" title="Feed">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span>Feed</span>
            </button>
            <button class="app-rail__item" data-view="surveys" title="Pesquisas">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              <span>Pesquisas</span>
            </button>
            <button class="app-rail__item" data-view="brindes" title="Brindes">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
              <span>Brindes</span>
            </button>
            <button class="app-rail__item" data-view="wallet" title="Carteira">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              <span>Carteira</span>
            </button>
            <button class="app-rail__item" data-view="perfil" title="Perfil">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>Perfil</span>
            </button>
          </nav>

          <!-- Level Card in Sidebar -->
          <div class="app-rail__level" id="rail-level">
            ${this._levelCardHTML(fan, lvl, nxt)}
          </div>

          <button class="app-rail__logout" id="btn-logout" title="Sair">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </aside>

        <!-- Main Content -->
        <main class="app-main" id="app-main"></main>

        <!-- Mobile Tabbar -->
        <nav class="app-tabbar">
          <button class="app-tabbar__item" data-view="feed">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span>Feed</span>
          </button>
          <button class="app-tabbar__item" data-view="surveys">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            <span>Pesquisas</span>
          </button>
          <button class="app-tabbar__item" data-view="brindes">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
            <span>Brindes</span>
          </button>
          <button class="app-tabbar__item" data-view="wallet">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            <span>Carteira</span>
          </button>
          <button class="app-tabbar__item" data-view="perfil">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>Perfil</span>
          </button>
        </nav>
      </div>
    `;

    // Logout
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        Session.reset();
        window.location.href = 'auth.html';
      });
    }
  },

  _levelCardHTML(fan, lvl, nxt) {
    const progress = nxt ? Math.round(((fan.points - lvl.min) / (nxt.min - lvl.min)) * 100) : 100;
    return `
      <div class="rail-level">
        <div class="rail-level__name" style="color:${lvl.color}">${lvl.name}</div>
        <div class="rail-level__pts u-mono u-tnum">${fan.points} pts</div>
        <div class="rail-level__bar">
          <div class="rail-level__fill" style="width:${progress}%;background:${lvl.color}"></div>
        </div>
        ${nxt ? `<div class="rail-level__next">Próximo: ${nxt.name} (${nxt.min} pts)</div>` : `<div class="rail-level__next">Nível máximo!</div>`}
      </div>
    `;
  },

  refreshSidebar() {
    const fan = Session.get();
    const lvl = Session.level(fan.points);
    const nxt = Session.nextLevel(fan.points);
    const el = document.getElementById('rail-level');
    if (el) el.innerHTML = this._levelCardHTML(fan, lvl, nxt);
  },

  /* ─────────── Navigation ─────────── */
  bindNav() {
    // Rail nav
    $$('.app-rail__item').forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.hash = btn.dataset.view;
      });
    });
    // Tabbar nav
    $$('.app-tabbar__item').forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.hash = btn.dataset.view;
      });
    });
  },

  bindHash() {
    window.addEventListener('hashchange', () => this.route());
  },

  route() {
    let hash = window.location.hash.replace('#','');
    if (!this.views.includes(hash)) hash = 'feed';
    this.current = hash;
    this.setActiveNav();
    this.renderView();
  },

  setActiveNav() {
    $$('.app-rail__item').forEach(b => b.classList.toggle('active', b.dataset.view === this.current));
    $$('.app-tabbar__item').forEach(b => b.classList.toggle('active', b.dataset.view === this.current));
  },

  renderView() {
    const main = document.getElementById('app-main');
    if (!main) return;
    switch (this.current) {
      case 'feed':     main.innerHTML = this.viewFeed(); break;
      case 'surveys':  main.innerHTML = this.viewSurveys(); break;
      case 'brindes':  main.innerHTML = this.viewBrindes(); break;
      case 'wallet':   main.innerHTML = this.viewWallet(); break;
      case 'perfil':   main.innerHTML = this.viewPerfil(); break;
      default:         main.innerHTML = this.viewFeed(); break;
    }
    this.afterRender();
  },

  afterRender() {
    const main = document.getElementById('app-main');
    // Bind like buttons
    main.querySelectorAll('[data-like]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.like;
        const fan = Session.get();
        if (fan.liked.includes(id)) {
          fan.liked = fan.liked.filter(x => x !== id);
          Session.save(fan);
          Toast.info('Curtida removida');
        } else {
          fan.liked.push(id);
          Session.save(fan);
          Session.addPoints(MS_DATA.pointRules.like, 'Curtiu');
        }
        this.renderView();
      });
    });
    // Bind comment buttons
    main.querySelectorAll('[data-comment]').forEach(btn => {
      btn.addEventListener('click', () => {
        Modal.open(`
          <div class="modal__head">
            <h3>Comentar</h3>
            <button class="modal__close" data-modal-close>✕</button>
          </div>
          <div class="modal__body">
            <textarea class="textarea" id="comment-text" placeholder="Escreva seu comentário..." rows="3"></textarea>
            <button class="btn btn--red btn--block" style="margin-top:1rem" id="btn-submit-comment">Enviar</button>
          </div>
        `);
        const submitBtn = document.getElementById('btn-submit-comment');
        if (submitBtn) {
          submitBtn.addEventListener('click', () => {
            const text = document.getElementById('comment-text');
            if (text && text.value.trim()) {
              const fan = Session.get();
              fan.comments.push({ post: btn.dataset.comment, text: text.value.trim(), time: new Date().toISOString() });
              Session.save(fan);
              Session.addPoints(MS_DATA.pointRules.comment, 'Comentou');
              Modal.close();
              this.renderView();
            }
          });
        }
      });
    });
    // Bind claim activation
    main.querySelectorAll('[data-claim]').forEach(btn => {
      btn.addEventListener('click', () => {
        const actId = btn.dataset.claim;
        const fan = Session.get();
        if (fan.claimed.includes(actId)) {
          Toast.info('Você já resgatou este brinde');
          return;
        }
        const act = DB.activation(actId);
        if (!act) return;
        Modal.open(`
          <div class="modal__head">
            <h3>Confirmar resgate</h3>
            <button class="modal__close" data-modal-close>✕</button>
          </div>
          <div class="modal__body">
            <p style="margin-bottom:1rem">${act.title}</p>
            <p style="font-size:var(--fs-sm);color:var(--ink-3);margin-bottom:1.5rem">${act.rules}</p>
            <button class="btn btn--red btn--block" id="btn-confirm-claim">Confirmar Resgate</button>
          </div>
        `);
        const confirmBtn = document.getElementById('btn-confirm-claim');
        if (confirmBtn) {
          confirmBtn.addEventListener('click', () => {
            fan.claimed.push(actId);
            Session.save(fan);
            Session.addPoints(MS_DATA.pointRules.activation, 'Resgatou brinde');
            Modal.close();
            this.renderView();
          });
        }
      });
    });
    // Bind take survey
    main.querySelectorAll('[data-take-survey]').forEach(btn => {
      btn.addEventListener('click', () => {
        const surveyId = btn.dataset.takeSurvey;
        const survey = DB.survey(surveyId);
        if (!survey) return;
        const fan = Session.get();
        if (fan.answered.includes(surveyId)) {
          Toast.info('Você já respondeu esta pesquisa');
          return;
        }
        this.openSurveyModal(survey);
      });
    });
    // Bind share
    main.querySelectorAll('[data-share]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (navigator.share) {
          navigator.share({ title: 'MAINSTAGE', text: 'Confira no MAINSTAGE!', url: window.location.href });
        } else {
          navigator.clipboard.writeText(window.location.href);
          Toast.success('Link copiado!');
        }
      });
    });
    // Bind voucher copy
    main.querySelectorAll('[data-copy-code]').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(btn.dataset.copyCode);
        Toast.success('Código copiado!');
      });
    });
  },

  /* ─────────── FEED VIEW ─────────── */
  viewFeed() {
    const fan = Session.get();
    const posts = MS_DATA.posts;
    let html = `<div class="app-view"><h2 class="app-view__title">Feed</h2>`;

    posts.forEach(p => {
      const artist = DB.artist(p.artist);
      const liked = fan.liked.includes(p.id);
      const timeStr = this._timeAgo(p.time);
      const typeLabel = p.type === 'activation' ? '🎁 Ativação' : p.type === 'survey' ? '📋 Pesquisa' : '';

      html += `
        <div class="post-card">
          <div class="post-card__head">
            <div class="post-card__avatar">${artist ? artistAvatar(artist, 40) : '<span class="avatar-fallback" style="--c:var(--ink-4)">?</span>'}</div>
            <div class="post-card__meta">
              <div class="post-card__author">${p.author} ${artist && artist.verified ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="var(--red)" style="vertical-align:middle"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' : ''}</div>
              <div class="post-card__time">${timeStr}</div>
            </div>
            ${typeLabel ? `<span class="badge badge--red">${typeLabel}</span>` : ''}
          </div>
          <div class="post-card__body">
            <h3 class="post-card__title">${p.title}</h3>
            <p class="post-card__text">${p.content}</p>
          </div>
          <div class="post-card__actions">
            <button class="post-card__action ${liked ? 'post-card__action--liked' : ''}" data-like="${p.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${liked ? 'var(--red)' : 'none'}" stroke="${liked ? 'var(--red)' : 'currentColor'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              ${p.likes + (liked ? 1 : 0)}
            </button>
            <button class="post-card__action" data-comment="${p.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              ${p.comments}
            </button>
            <button class="post-card__action" data-share="${p.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              Compartilhar
            </button>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    return html;
  },

  /* ─────────── SURVEYS VIEW ─────────── */
  viewSurveys() {
    const fan = Session.get();
    const surveys = MS_DATA.surveys;
    let html = `<div class="app-view"><h2 class="app-view__title">Pesquisas</h2>`;

    surveys.forEach(s => {
      const artist = DB.artist(s.artist);
      const answered = fan.answered.includes(s.id);
      const pct = s.sent > 0 ? Math.round((s.responses / s.sent) * 100) : 0;

      html += `
        <div class="survey-card ${answered ? 'survey-card--done' : ''}">
          <div class="survey-card__head">
            <div class="survey-card__avatar">${artist ? artistAvatar(artist, 36) : ''}</div>
            <div class="survey-card__info">
              <div class="survey-card__artist">${artist ? artist.name : ''}</div>
              <div class="survey-card__type">${s.type} · ${s.questions.length} perguntas</div>
            </div>
            <span class="badge ${answered ? 'badge--green' : 'badge--red'}">${answered ? 'Respondida' : 'Aberta'}</span>
          </div>
          <h3 class="survey-card__title">${s.title}</h3>
          <p class="survey-card__desc">${s.desc}</p>
          <div class="survey-card__runner">
            <div class="survey-card__runner-label">
              <span>${s.responses} respostas</span>
              <span>${pct}%</span>
            </div>
            <div class="survey-card__runner-bar">
              <div class="survey-card__runner-fill" style="width:${pct}%"></div>
            </div>
          </div>
          <div class="survey-card__footer">
            <div class="survey-card__reward">🎁 ${s.reward}</div>
            <div class="survey-card__points u-mono">+${s.points} pts</div>
          </div>
          ${!answered ? `<button class="btn btn--red btn--block survey-card__btn" data-take-survey="${s.id}">Responder Pesquisa</button>` : `<button class="btn btn--ghost btn--block" disabled style="opacity:0.6">Respondida ✓</button>`}
        </div>
      `;
    });

    html += `</div>`;
    return html;
  },

  openSurveyModal(survey) {
    let questionsHTML = '';
    survey.questions.forEach((q, i) => {
      if (q.type === 'single') {
        questionsHTML += `
          <div class="survey-q">
            <p class="survey-q__text">${i+1}. ${q.text}</p>
            <div class="survey-q__options">
              ${q.options.map((o, oi) => `
                <label class="survey-q__option">
                  <input type="radio" name="sq_${survey.id}_${q.id}" value="${oi}">
                  <span>${o}</span>
                </label>
              `).join('')}
            </div>
          </div>
        `;
      } else if (q.type === 'rating') {
        questionsHTML += `
          <div class="survey-q">
            <p class="survey-q__text">${i+1}. ${q.text}</p>
            <div class="survey-q__rating">
              ${[1,2,3,4,5].map(n => `<label class="survey-q__star"><input type="radio" name="sq_${survey.id}_${q.id}" value="${n}"><span>★</span></label>`).join('')}
            </div>
          </div>
        `;
      } else if (q.type === 'text') {
        questionsHTML += `
          <div class="survey-q">
            <p class="survey-q__text">${i+1}. ${q.text}</p>
            <textarea class="textarea" name="sq_${survey.id}_${q.id}" rows="2" placeholder="Sua resposta..."></textarea>
          </div>
        `;
      }
    });

    Modal.open(`
      <div class="modal__head">
        <h3>${survey.title}</h3>
        <button class="modal__close" data-modal-close>✕</button>
      </div>
      <div class="modal__body">
        <p style="color:var(--ink-3);font-size:var(--fs-sm);margin-bottom:1.5rem">${survey.desc}</p>
        ${questionsHTML}
        <button class="btn btn--red btn--block" style="margin-top:1.5rem" id="btn-submit-survey">Enviar Respostas (+${survey.points} pts)</button>
      </div>
    `);

    const submitBtn = document.getElementById('btn-submit-survey');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const fan = Session.get();
        fan.answered.push(survey.id);
        Session.save(fan);
        Session.addPoints(survey.points, 'Pesquisa respondida');
        Modal.close();
        this.renderView();
      });
    }
  },

  /* ─────────── BRINDES (ACTIVATIONS) VIEW ─────────── */
  viewBrindes() {
    const fan = Session.get();
    const activations = MS_DATA.activations;
    let html = `<div class="app-view"><h2 class="app-view__title">Ativações & Brindes</h2>`;

    activations.forEach(a => {
      const artist = DB.artist(a.artist);
      const claimed = fan.claimed.includes(a.id);
      const pctLeft = a.total > 0 ? Math.round((a.remaining / a.total) * 100) : 0;
      const almostGone = a.remaining <= 5;

      html += `
        <div class="act-card ${claimed ? 'act-card--claimed' : ''}">
          <div class="act-card__photo">
            ${artist && artist.photo ? `<img src="${artist.photo}" alt="${artist.name}">` : `<div class="avatar-fallback" style="--c:${a.img};font-size:2rem">${artist ? artist.name.charAt(0) : '?'}</div>`}
          </div>
          <div class="act-card__content">
            <div class="act-card__top">
              <span class="badge badge--red">${a.type}</span>
              ${almostGone ? '<span class="badge badge--yellow"><span class="bdot"></span> Quase esgotado</span>' : ''}
            </div>
            <h3 class="act-card__title">${a.title}</h3>
            <div class="act-card__artist">${artist ? artist.name : ''}</div>
            <div class="act-card__stock">
              <div class="act-card__stock-label">
                <span>${a.remaining} de ${a.total} restantes</span>
                <span>${pctLeft}%</span>
              </div>
              <div class="act-card__stock-bar">
                <div class="act-card__stock-fill" style="width:${pctLeft}%;background:${almostGone ? 'var(--red)' : '#157A3C'}"></div>
              </div>
            </div>
            <p class="act-card__rules">${a.rules}</p>
            <div class="act-card__footer">
              <div class="act-card__expires">Válido até ${fmt.date(a.expires)}</div>
              ${claimed
                ? `<button class="btn btn--ghost btn--sm" disabled style="opacity:0.6">Resgatado ✓</button>`
                : `<button class="btn btn--red btn--sm" data-claim="${a.id}">Resgatar (+${MS_DATA.pointRules.activation} pts)</button>`
              }
            </div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    return html;
  },

  /* ─────────── WALLET VIEW ─────────── */
  viewWallet() {
    const fan = Session.get();
    const lvl = Session.level(fan.points);

    // Generate vouchers from claimed activations
    const vouchers = fan.claimed.map(actId => {
      const a = DB.activation(actId);
      if (!a) return null;
      const artist = DB.artist(a.artist);
      return {
        title: a.title,
        artist: artist ? artist.name : '',
        code: `MS-${a.id.toUpperCase()}-${Math.random().toString(36).substring(2,6).toUpperCase()}`,
        type: a.type,
      };
    }).filter(Boolean);

    let html = `<div class="app-view">
      <h2 class="app-view__title">Carteira</h2>

      <!-- Points Balance -->
      <div class="wallet-balance">
        <div class="wallet-balance__pts u-mono u-tnum">${fan.points}</div>
        <div class="wallet-balance__label">pontos disponíveis</div>
        <div class="wallet-balance__level">
          <span class="badge badge--red">${lvl.name}</span>
        </div>
      </div>

      <!-- Point Rules -->
      <div class="wallet-rules">
        <div class="wallet-rule">
          <span class="wallet-rule__icon">📋</span>
          <span class="wallet-rule__label">Pesquisa</span>
          <span class="wallet-rule__pts u-mono">+${MS_DATA.pointRules.survey} pts</span>
        </div>
        <div class="wallet-rule">
          <span class="wallet-rule__icon">🎁</span>
          <span class="wallet-rule__label">Ativação</span>
          <span class="wallet-rule__pts u-mono">+${MS_DATA.pointRules.activation} pts</span>
        </div>
        <div class="wallet-rule">
          <span class="wallet-rule__icon">❤️</span>
          <span class="wallet-rule__label">Curtir</span>
          <span class="wallet-rule__pts u-mono">+${MS_DATA.pointRules.like} pts</span>
        </div>
        <div class="wallet-rule">
          <span class="wallet-rule__icon">💬</span>
          <span class="wallet-rule__label">Comentar</span>
          <span class="wallet-rule__pts u-mono">+${MS_DATA.pointRules.comment} pts</span>
        </div>
      </div>

      <!-- Vouchers -->
      <h3 class="app-view__subtitle">Seus Vouchers</h3>
      ${vouchers.length === 0
        ? `<div class="wallet-empty">
            <p>Você ainda não resgatou nenhum brinde.</p>
            <button class="btn btn--red btn--sm" onclick="window.location.hash='brindes'">Ver Brindes</button>
          </div>`
        : vouchers.map(v => `
          <div class="voucher-card">
            <div class="voucher-card__punch voucher-card__punch--left"></div>
            <div class="voucher-card__punch voucher-card__punch--right"></div>
            <div class="voucher-card__inner">
              <span class="badge badge--red" style="margin-bottom:.5rem">${v.type}</span>
              <div class="voucher-card__title">${v.title}</div>
              <div class="voucher-card__artist">${v.artist}</div>
              <div class="voucher-card__code" data-copy-code="${v.code}">
                <span>${v.code}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </div>
            </div>
          </div>
        `).join('')
      }
    </div>`;
    return html;
  },

  /* ─────────── PERFIL VIEW ─────────── */
  viewPerfil() {
    const fan = Session.get();
    const lvl = Session.level(fan.points);
    const nxt = Session.nextLevel(fan.points);
    const progress = nxt ? Math.round(((fan.points - lvl.min) / (nxt.min - lvl.min)) * 100) : 100;

    // Stats
    const surveysAnswered = fan.answered.length;
    const activationsClaimed = fan.claimed.length;
    const likesGiven = fan.liked.length;
    const commentsMade = fan.comments.length;

    // Followed artists (default: first 4)
    const followedArtists = MS_DATA.artists.slice(0, 5);

    let html = `<div class="app-view">
      <!-- Profile Card -->
      <div class="profile-card">
        <div class="profile-card__avatar">${fan.name.split(' ').map(n => n[0]).join('').substring(0,2)}</div>
        <h2 class="profile-card__name">${fan.name}</h2>
        <div class="profile-card__genre">${fan.genre}</div>
        <span class="badge badge--red" style="margin-top:.5rem">${lvl.name}</span>
      </div>

      <!-- Level Progress -->
      <div class="profile-level">
        <div class="profile-level__header">
          <span class="profile-level__current" style="color:${lvl.color}">${lvl.name}</span>
          <span class="profile-level__next">${nxt ? nxt.name : 'Nível máximo'}</span>
        </div>
        <div class="profile-level__bar">
          <div class="profile-level__fill" style="width:${progress}%;background:${lvl.color}"></div>
        </div>
        <div class="profile-level__pts u-mono u-tnum">${fan.points} / ${nxt ? nxt.min : fan.points} pts</div>
      </div>

      <!-- Stat Grid -->
      <div class="profile-stats">
        <div class="profile-stat">
          <div class="profile-stat__value u-mono u-tnum">${surveysAnswered}</div>
          <div class="profile-stat__label">Pesquisas</div>
        </div>
        <div class="profile-stat">
          <div class="profile-stat__value u-mono u-tnum">${activationsClaimed}</div>
          <div class="profile-stat__label">Brindes</div>
        </div>
        <div class="profile-stat">
          <div class="profile-stat__value u-mono u-tnum">${likesGiven}</div>
          <div class="profile-stat__label">Curtidas</div>
        </div>
        <div class="profile-stat">
          <div class="profile-stat__value u-mono u-tnum">${commentsMade}</div>
          <div class="profile-stat__label">Comentários</div>
        </div>
      </div>

      <!-- Followed Artists -->
      <h3 class="app-view__subtitle">Artistas Seguidos</h3>
      <div class="profile-artists">
        ${followedArtists.map(a => `
          <div class="profile-artist">
            <div class="profile-artist__avatar">${artistAvatar(a, 48)}</div>
            <div class="profile-artist__info">
              <div class="profile-artist__name">${a.name}</div>
              <div class="profile-artist__genre">${a.genre}</div>
            </div>
            <button class="btn btn--ghost btn--sm">Seguindo</button>
          </div>
        `).join('')}
      </div>

      <!-- Actions -->
      <div class="profile-actions">
        <button class="btn btn--ghost btn--block" onclick="window.location.href='auth.html'">Sair da conta</button>
      </div>
    </div>`;
    return html;
  },

  /* ─────────── Helpers ─────────── */
  _timeAgo(iso) {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}min atrás`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h atrás`;
    const days = Math.floor(hrs / 24);
    return `${days}d atrás`;
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
