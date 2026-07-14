/* ============================================
   MAINSTAGE v5 — Admin Dashboard Controller
   Dynamically renders into #admin-root
   ============================================ */

const Admin = {
  page: '',
  searchQuery: '',
  activeFilter: 'Todos',
  charts: [],

  /* ─── Boot ─── */
  init() {
    this.page = document.body.dataset.page;
    if (!this.page) return;
    this.render();
  },

  /* ─── Master Render ─── */
  render() {
    const root = document.getElementById('admin-root');
    if (!root) return;
    root.innerHTML = `
      <div class="admin-layout">
        ${this.sidebarOverlayHTML()}
        ${this.sidebarHTML()}
        <main class="admin-main">
          ${this.headerHTML()}
          <div class="admin-content">
            ${this.pageContent()}
          </div>
        </main>
      </div>
    `;
    this.bind();
    this.initPage();
  },

  /* ═══════════════════════════════════════
     LAYOUT — Sidebar
     ═══════════════════════════════════════ */
  sidebarOverlayHTML() {
    return `<div class="admin-sidebar-overlay" id="sidebar-overlay"></div>`;
  },

  sidebarHTML() {
    const links = [
      { section: 'Principal', items: [
        { href: 'index.html', icon: '📊', label: 'Dashboard', id: 'index' },
        { href: 'analytics.html', icon: '📈', label: 'Analytics', id: 'analytics' },
      ]},
      { section: 'Gestão', items: [
        { href: 'artists.html', icon: '🎤', label: 'Artistas', id: 'artists' },
        { href: 'fans.html', icon: '👥', label: 'Fãs', id: 'fans' },
        { href: 'ambassadors.html', icon: '🏆', label: 'Embaixadores', id: 'ambassadors' },
        { href: 'gravadoras.html', icon: '🏢', label: 'Gravadoras', id: 'gravadoras' },
      ]},
      { section: 'Engajamento', items: [
        { href: 'surveys.html', icon: '📋', label: 'Pesquisas', id: 'surveys' },
        { href: 'activations.html', icon: '⚡', label: 'Ativações', id: 'activations' },
        { href: 'reports.html', icon: '📄', label: 'Relatórios', id: 'reports' },
      ]},
    ];

    const navHTML = links.map(s => `
      <div class="admin-sidebar__section">
        <div class="admin-sidebar__section-title">${s.section}</div>
        ${s.items.map(i => `
          <a href="${i.href}" class="admin-sidebar__link${i.id === this.page ? ' active' : ''}">
            <span class="admin-sidebar__link-icon">${i.icon}</span> ${i.label}
          </a>
        `).join('')}
      </div>
    `).join('');

    return `
      <aside class="admin-sidebar" id="admin-sidebar">
        <div class="admin-sidebar__header">
          <img class="admin-sidebar__logo" src="../assets/images/brand/logo.png" alt="MAINSTAGE">
          <span class="admin-sidebar__brand">MAINSTAGE</span>
          <span class="admin-sidebar__tag">v5</span>
        </div>
        <nav class="admin-sidebar__nav">${navHTML}</nav>
        <div class="admin-sidebar__footer">
          <div class="admin-sidebar__user">
            <div class="admin-sidebar__user-avatar">RM</div>
            <div class="admin-sidebar__user-info">
              <div class="admin-sidebar__user-name">Ricardo Monteiro</div>
              <div class="admin-sidebar__user-role">Admin</div>
            </div>
          </div>
        </div>
      </aside>
    `;
  },

  /* ═══════════════════════════════════════
     LAYOUT — Header
     ═══════════════════════════════════════ */
  headerHTML() {
    const titleMap = {
      index: 'Dashboard', analytics: 'Analytics', artists: 'Artistas',
      fans: 'Fãs', ambassadors: 'Embaixadores', surveys: 'Pesquisas',
      activations: 'Ativações', reports: 'Relatórios', gravadoras: 'Gravadoras',
    };
    const searchPlaceholder = {
      index: 'Buscar...', analytics: 'Buscar...', artists: 'Buscar artistas...',
      fans: 'Buscar fãs...', ambassadors: 'Buscar embaixadores...', surveys: 'Buscar pesquisas...',
      activations: 'Buscar ativações...', reports: 'Buscar...', gravadoras: 'Buscar gravadoras...',
    };
    return `
      <header class="admin-header">
        <div class="admin-header__left">
          <button class="admin-header__mobile-toggle" id="sidebar-toggle" type="button" aria-label="Abrir menu lateral">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <h1 class="admin-header__title">${titleMap[this.page] || ''}</h1>
        </div>
        <div class="admin-header__right">
          <div class="admin-header__search">
            <svg class="admin-header__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="admin-search" placeholder="${searchPlaceholder[this.page] || 'Buscar...'}">
          </div>
          <div class="admin-header__notif" id="notif-btn">
            <button class="admin-header__notif-btn" type="button" aria-label="Ver notificações">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </button>
            <span class="admin-header__notif-dot"></span>
            <div class="dropdown notif-dropdown" id="notif-dropdown">
              <div class="dropdown-header">Notificações</div>
              <div class="dropdown-body"></div>
            </div>
          </div>
          <div class="admin-header__avatar">RM</div>
        </div>
      </header>
    `;
  },

  /* ═══════════════════════════════════════
     PAGE CONTENT — Router
     ═══════════════════════════════════════ */
  pageContent() {
    switch (this.page) {
      case 'index':       return this.dashboardContent();
      case 'analytics':   return this.analyticsContent();
      case 'artists':     return this.artistsContent();
      case 'fans':        return this.fansContent();
      case 'ambassadors': return this.ambassadorsContent();
      case 'surveys':     return this.surveysContent();
      case 'activations': return this.activationsContent();
      case 'reports':     return this.reportsContent();
      case 'gravadoras':  return this.gravadorasContent();
      default: return '';
    }
  },

  /* ═══════════════════════════════════════
     PAGE — Dashboard
     ═══════════════════════════════════════ */
  dashboardContent() {
    return `
      <div class="admin-page-header">
        <div class="admin-page-header__info">
          <h2 class="admin-page-header__title">Visão Geral</h2>
          <p class="admin-page-header__desc">Bem-vindo de volta, Ricardo. Aqui está o resumo da plataforma.</p>
        </div>
        <div class="admin-page-header__actions">
          <button class="btn btn--ghost btn--sm" onclick="Admin.exportReport('artists')">📄 Exportar Relatório</button>
        </div>
      </div>
      <div class="kpi-grid" id="kpi-grid"></div>
      <div class="grid-2">
        <div class="chart-card">
          <div class="chart-card__header"><h3 class="chart-card__title">Tendência de Engajamento</h3></div>
          <div style="height:280px;"><canvas id="chart-engagement"></canvas></div>
        </div>
        <div class="chart-card">
          <div class="chart-card__header"><h3 class="chart-card__title">Fãs por Gênero Musical</h3></div>
          <div style="height:280px;"><canvas id="chart-genre"></canvas></div>
        </div>
      </div>
      <div style="margin-top:var(--sp-4);">
        <div class="activity-feed">
          <div class="activity-feed__header">Atividade Recente</div>
          <div class="activity-feed__list" id="activity-feed"></div>
        </div>
      </div>
    `;
  },

  /* ═══════════════════════════════════════
     PAGE — Analytics
     ═══════════════════════════════════════ */
  analyticsContent() {
    return `
      <div class="admin-page-header">
        <div class="admin-page-header__info">
          <h2 class="admin-page-header__title">Analytics</h2>
          <p class="admin-page-header__desc">Métricas detalhadas e insights da plataforma.</p>
        </div>
        <div class="admin-page-header__actions">
          <button class="btn btn--ghost btn--sm" onclick="Admin.exportReport('analytics')">📄 Exportar</button>
        </div>
      </div>
      <div class="kpi-grid" id="analytics-kpi-grid"></div>
      <div class="grid-2">
        <div class="chart-card">
          <div class="chart-card__header"><h3 class="chart-card__title">Tendência de Engajamento</h3></div>
          <div style="height:300px;"><canvas id="analytics-chart-engagement"></canvas></div>
        </div>
        <div class="chart-card">
          <div class="chart-card__header"><h3 class="chart-card__title">Pesquisas por Mês</h3></div>
          <div style="height:300px;"><canvas id="analytics-chart-surveys"></canvas></div>
        </div>
      </div>
      <div class="grid-2-equal">
        <div class="chart-card">
          <div class="chart-card__header"><h3 class="chart-card__title">Fãs por Região</h3></div>
          <div style="height:300px;"><canvas id="analytics-chart-region"></canvas></div>
        </div>
        <div class="chart-card">
          <div class="chart-card__header"><h3 class="chart-card__title">Fãs por Gênero Musical</h3></div>
          <div style="height:300px;"><canvas id="analytics-chart-genre"></canvas></div>
        </div>
      </div>
    `;
  },

  /* ═══════════════════════════════════════
     PAGE — Artists
     ═══════════════════════════════════════ */
  artistsContent() {
    return `
      <div class="admin-page-header">
        <div class="admin-page-header__info">
          <h2 class="admin-page-header__title">Artistas</h2>
          <p class="admin-page-header__desc">Gerencie os artistas da plataforma.</p>
        </div>
        <div class="admin-page-header__actions">
          <button class="btn btn--ghost btn--sm" onclick="Admin.exportCSV(MS_DATA.artists,'artistas')">📥 CSV</button>
          <button class="btn btn--ghost btn--sm" onclick="Admin.exportReport('artists')">📄 PDF</button>
        </div>
      </div>
      <div class="data-card">
        <div class="data-card__header">
          <h3 class="data-card__title">Todos os Artistas</h3>
          <div class="chips">
            <button class="chip active" data-filter="Todos">Todos</button>
            <button class="chip" data-filter="Ativos">Ativos</button>
            <button class="chip" data-filter="Legacy">Legacy</button>
          </div>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr>
              <th>Artista</th><th>Gênero</th><th>Fãs</th><th>Superfãs</th><th>Cresc.</th><th>Gravadora</th><th>Saúde</th>
            </tr></thead>
            <tbody id="artists-tbody"></tbody>
          </table>
        </div>
      </div>
    `;
  },

  /* ═══════════════════════════════════════
     PAGE — Fans (Analytics-driven)
     ═══════════════════════════════════════ */
  fansContent() {
    return `
      <div class="admin-page-header">
        <div class="admin-page-header__info">
          <h2 class="admin-page-header__title">Fãs</h2>
          <p class="admin-page-header__desc">Segmentação e insights da base de fãs.</p>
        </div>
        <div class="admin-page-header__actions">
          <button class="btn btn--ghost btn--sm" onclick="Admin.exportCSV(MS_DATA.analytics.segments,'segmentos')">📥 CSV</button>
          <button class="btn btn--ghost btn--sm" onclick="Admin.exportReport('fans')">📄 PDF</button>
        </div>
      </div>
      <div class="kpi-grid" id="fans-kpi-grid"></div>
      <div class="grid-2-equal">
        <div class="chart-card">
          <div class="chart-card__header"><h3 class="chart-card__title">Segmentos de Fãs</h3></div>
          <div style="height:300px;"><canvas id="fans-chart-segments"></canvas></div>
        </div>
        <div class="chart-card">
          <div class="chart-card__header"><h3 class="chart-card__title">Faixa Etária</h3></div>
          <div style="height:300px;"><canvas id="fans-chart-age"></canvas></div>
        </div>
      </div>
      <div class="data-card" style="margin-top:var(--sp-4);">
        <div class="data-card__header"><h3 class="data-card__title">Segmentos</h3></div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Segmento</th><th>%</th><th>Qtd</th><th>Ação Recomendada</th></tr></thead>
            <tbody id="fans-segments-tbody"></tbody>
          </table>
        </div>
      </div>
    `;
  },

  /* ═══════════════════════════════════════
     PAGE — Ambassadors
     ═══════════════════════════════════════ */
  ambassadorsContent() {
    return `
      <div class="admin-page-header">
        <div class="admin-page-header__info">
          <h2 class="admin-page-header__title">Embaixadores</h2>
          <p class="admin-page-header__desc">Programa de embaixadores e fãs multiplicadores.</p>
        </div>
        <div class="admin-page-header__actions">
          <button class="btn btn--ghost btn--sm" onclick="Admin.exportCSV(MS_DATA.ambassadors,'embaixadores')">📥 CSV</button>
          <button class="btn btn--ghost btn--sm" onclick="Admin.exportReport('ambassadors')">📄 PDF</button>
        </div>
      </div>
      <div class="data-card">
        <div class="data-card__header">
          <h3 class="data-card__title">Embaixadores</h3>
          <div class="chips">
            <button class="chip active" data-filter="Todos">Todos</button>
            <button class="chip" data-filter="platinum">Platinum</button>
            <button class="chip" data-filter="gold">Gold</button>
            <button class="chip" data-filter="silver">Silver</button>
          </div>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Nome</th><th>Gênero</th><th>UF</th><th>Trazeram</th><th>Esta Semana</th><th>Pontos</th><th>Nível</th><th>Meta</th></tr></thead>
            <tbody id="ambassadors-tbody"></tbody>
          </table>
        </div>
      </div>
    `;
  },

  /* ═══════════════════════════════════════
     PAGE — Surveys (Research Center)
     ═══════════════════════════════════════ */
  surveysContent() {
    return `
      <div class="admin-page-header">
        <div class="admin-page-header__info">
          <h2 class="admin-page-header__title">Research Center</h2>
          <p class="admin-page-header__desc">Crie e gerencie pesquisas para entender seu público.</p>
        </div>
        <div class="admin-page-header__actions">
          <button class="btn btn--ghost btn--sm" onclick="Admin.exportCSV(MS_DATA.surveys,'pesquisas')">📥 CSV</button>
          <button class="btn btn--ghost btn--sm" onclick="Admin.exportReport('surveys')">📄 PDF</button>
        </div>
      </div>
      <div class="data-card">
        <div class="data-card__header">
          <h3 class="data-card__title">Todas as Pesquisas</h3>
          <div class="chips">
            <button class="chip active" data-filter="Todos">Todos</button>
            <button class="chip" data-filter="Ativas">Ativas</button>
            <button class="chip" data-filter="Concluídas">Concluídas</button>
          </div>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Pesquisa</th><th>Artista</th><th>Tipo</th><th>Progresso</th><th>Pontos</th><th>Status</th></tr></thead>
            <tbody id="surveys-tbody"></tbody>
          </table>
        </div>
      </div>
    `;
  },

  /* ═══════════════════════════════════════
     PAGE — Activations
     ═══════════════════════════════════════ */
  activationsContent() {
    return `
      <div class="admin-page-header">
        <div class="admin-page-header__info">
          <h2 class="admin-page-header__title">Ativações</h2>
          <p class="admin-page-header__desc">Campanhas de engajamento e experiências exclusivas.</p>
        </div>
        <div class="admin-page-header__actions">
          <button class="btn btn--ghost btn--sm" onclick="Admin.exportCSV(MS_DATA.activations,'ativacoes')">📥 CSV</button>
          <button class="btn btn--ghost btn--sm" onclick="Admin.exportReport('activations')">📄 PDF</button>
        </div>
      </div>
      <div class="data-card">
        <div class="data-card__header">
          <h3 class="data-card__title">Todas as Ativações</h3>
          <div class="chips">
            <button class="chip active" data-filter="Todos">Todos</button>
            <button class="chip" data-filter="Disponível">Disponível</button>
            <button class="chip" data-filter="Esgotado">Esgotado</button>
          </div>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Título</th><th>Artista</th><th>Tipo</th><th>Total</th><th>Restante</th><th>Expira</th></tr></thead>
            <tbody id="activations-tbody"></tbody>
          </table>
        </div>
      </div>
    `;
  },

  /* ═══════════════════════════════════════
     PAGE — Reports
     ═══════════════════════════════════════ */
  reportsContent() {
    const cards = [
      { icon: '🎤', title: 'Relatório de Artistas', desc: 'Dados completos dos artistas ativos na plataforma.', type: 'artists' },
      { icon: '👥', title: 'Relatório de Fãs', desc: 'Segmentação e insights da base de fãs.', type: 'fans' },
      { icon: '📊', title: 'Relatório de Pesquisas', desc: 'Todas as pesquisas com progresso e status.', type: 'surveys' },
      { icon: '⚡', title: 'Relatório de Ativações', desc: 'Campanhas realizadas com métricas de resultado.', type: 'activations' },
      { icon: '🏆', title: 'Relatório de Embaixadores', desc: 'Programa de embaixadores com rankings.', type: 'ambassadors' },
      { icon: '🏢', title: 'Relatório de Gravadoras', desc: 'Parceiros e contratos ativos.', type: 'gravadoras' },
    ];
    return `
      <div class="admin-page-header">
        <div class="admin-page-header__info">
          <h2 class="admin-page-header__title">Relatórios</h2>
          <p class="admin-page-header__desc">Exporte relatórios detalhados da plataforma.</p>
        </div>
      </div>
      <div class="reports-grid">
        ${cards.map(c => `
          <div class="card card--pad">
            <div style="font-size:24px;margin-bottom:var(--sp-3);">${c.icon}</div>
            <h3 style="font-family:var(--font-display);font-size:var(--fs-md);font-weight:var(--fw-semibold);color:var(--ink);margin-bottom:var(--sp-2);">${c.title}</h3>
            <p style="font-size:var(--fs-sm);color:var(--ink-4);margin-bottom:var(--sp-4);">${c.desc}</p>
            <div style="display:flex;gap:var(--sp-2);">
              <button class="btn btn--ghost btn--sm" onclick="Admin.exportCSV(MS_DATA.${c.type},'${c.type}')">📥 CSV</button>
              <button class="btn btn--ghost btn--sm" onclick="Admin.exportReport('${c.type}')">📄 PDF</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  /* ═══════════════════════════════════════
     PAGE — Gravadoras (NO monthly_fee)
     ═══════════════════════════════════════ */
  gravadorasContent() {
    return `
      <div class="admin-page-header">
        <div class="admin-page-header__info">
          <h2 class="admin-page-header__title">Gravadoras</h2>
          <p class="admin-page-header__desc">Parceiros e gravadoras da plataforma.</p>
        </div>
        <div class="admin-page-header__actions">
          <button class="btn btn--ghost btn--sm" onclick="Admin.exportCSV(MS_DATA.gravadoras,'gravadoras')">📥 CSV</button>
          <button class="btn btn--ghost btn--sm" onclick="Admin.exportReport('gravadoras')">📄 PDF</button>
        </div>
      </div>
      <div class="data-card">
        <div class="data-card__header">
          <h3 class="data-card__title">Todas as Gravadoras</h3>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Gravadora</th><th>Artistas</th><th>Total de Fãs</th><th>Status</th><th>Saúde</th></tr></thead>
            <tbody id="gravadoras-tbody"></tbody>
          </table>
        </div>
      </div>
    `;
  },

  /* ═══════════════════════════════════════
     BIND — Events
     ═══════════════════════════════════════ */
  bind() {
    // Sidebar toggle
    const toggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('admin-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (toggle && sidebar) {
      toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('open');
      });
    }
    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
      });
    }

    // Search
    const searchInput = document.getElementById('admin-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        this.searchQuery = searchInput.value;
        this.applyFilters();
      });
    }

    // Notifications
    const notifBtn = document.getElementById('notif-btn');
    const notifDropdown = document.getElementById('notif-dropdown');
    if (notifBtn && notifDropdown) {
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle('open');
      });
      document.addEventListener('click', (e) => {
        if (!notifBtn.contains(e.target)) notifDropdown.classList.remove('open');
      });
      const body = notifDropdown.querySelector('.dropdown-body');
      if (body && window.MS_DATA) {
        body.innerHTML = (window.MS_DATA.analytics.feed || []).map(n => `
          <div class="notif-dropdown__item">
            <div class="notif-dropdown__item-title">${n.tag}</div>
            <div class="notif-dropdown__item-msg">${n.txt}</div>
            <div class="notif-dropdown__item-time">${n.t} atrás</div>
          </div>
        `).join('');
      }
    }

    // Filter chips
    document.querySelectorAll('.chip[data-filter]').forEach(chip => {
      chip.addEventListener('click', () => {
        this.activeFilter = chip.dataset.filter;
        document.querySelectorAll('.chip[data-filter]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.applyFilters();
      });
    });
  },

  /* ═══════════════════════════════════════
     INIT PAGE — Router
     ═══════════════════════════════════════ */
  initPage() {
    this.charts = [];
    switch (this.page) {
      case 'index':       this.initDashboard(); break;
      case 'analytics':   this.initAnalytics(); break;
      case 'artists':     this.initArtists(); break;
      case 'fans':        this.initFans(); break;
      case 'ambassadors': this.initAmbassadors(); break;
      case 'surveys':     this.initSurveys(); break;
      case 'activations': this.initActivations(); break;
      case 'gravadoras':  this.initGravadoras(); break;
      // reports needs no dynamic init
    }
  },

  /* ═══════════════════════════════════════
     DASHBOARD — Init
     ═══════════════════════════════════════ */
  initDashboard() {
    this.renderDashboardKPIs();
    this.renderActivityFeed();
    this.renderDashboardCharts();
  },

  renderDashboardKPIs() {
    const grid = document.getElementById('kpi-grid');
    if (!grid || !window.MS_DATA) return;
    const a = window.MS_DATA.analytics;
    const kpis = [
      { label: 'Total de Fãs', value: fmt.compact(a.kpis.fans), change: `+${a.kpis.fansGrowth}%`, icon: '👥', up: true },
      { label: 'Artistas Ativos', value: window.MS_DATA.artists.length, change: '+2', icon: '🎤', up: true },
      { label: 'Taxa de Resposta', value: a.kpis.responseRate + '%', change: '+4%', icon: '📊', up: true },
      { label: 'Ativações', value: window.MS_DATA.activations.length, change: '+3', icon: '⚡', up: true },
    ];
    grid.innerHTML = kpis.map(k => `
      <div class="kpi-card">
        <div class="kpi-card__header">
          <span class="kpi-card__label">${k.label}</span>
          <span class="kpi-card__icon">${k.icon}</span>
        </div>
        <div class="kpi-card__value">${k.value}</div>
        <div class="kpi-card__footer">
          <span class="kpi-card__change ${k.up ? 'kpi-card__change--up' : 'kpi-card__change--down'}">${k.up ? '↑' : '↓'} ${k.change}</span>
        </div>
      </div>
    `).join('');
  },

  renderActivityFeed() {
    const feed = document.getElementById('activity-feed');
    if (!feed || !window.MS_DATA) return;
    const iconMap = { survey: '📋', activation: '⚡', fan: '👤', ambassador: '🏆', post: '🎤' };
    feed.innerHTML = window.MS_DATA.analytics.feed.map(item => `
      <div class="activity-feed__item">
        <div class="activity-feed__icon activity-feed__icon--${item.tag === 'survey' ? 'survey' : item.tag === 'activation' ? 'activation' : 'fan'}">${iconMap[item.tag] || '●'}</div>
        <div style="flex:1;min-width:0;">
          <div class="activity-feed__text">${item.txt}</div>
          <div class="activity-feed__time">${item.t} atrás</div>
        </div>
      </div>
    `).join('');
  },

  renderDashboardCharts() {
    if (!window.MS_DATA || typeof Chart === 'undefined') return;
    const a = window.MS_DATA.analytics;

    // Engagement Trend
    const engCtx = document.getElementById('chart-engagement');
    if (engCtx) {
      this.charts.push(new Chart(engCtx, {
        type: 'line',
        data: {
          labels: a.growth.map(g => g.w),
          datasets: [{
            label: 'Fãs', data: a.growth.map(g => g.v),
            borderColor: '#E5322B', backgroundColor: 'rgba(229,50,43,0.08)',
            fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#E5322B',
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: false, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 } } },
            x: { grid: { display: false }, ticks: { font: { size: 11 } } }
          }
        }
      }));
    }

    // Genre Doughnut
    const genreCtx = document.getElementById('chart-genre');
    if (genreCtx) {
      this.charts.push(new Chart(genreCtx, {
        type: 'doughnut',
        data: {
          labels: a.genres.map(g => g.label),
          datasets: [{
            data: a.genres.map(g => g.v),
            backgroundColor: ['#E5322B', '#1A5FD6', '#6B33C9', '#9A6B00', '#157A3C'],
            borderWidth: 0,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 12 } } }
        }
      }));
    }
  },

  /* ═══════════════════════════════════════
     ANALYTICS — Init
     ═══════════════════════════════════════ */
  initAnalytics() {
    this.renderAnalyticsKPIs();
    this.renderAnalyticsCharts();
  },

  renderAnalyticsKPIs() {
    const grid = document.getElementById('analytics-kpi-grid');
    if (!grid || !window.MS_DATA) return;
    const k = window.MS_DATA.analytics.kpis;
    const kpis = [
      { label: 'Total de Fãs', value: fmt.compact(k.fans), change: `+${k.fansGrowth}%`, icon: '👥', up: true },
      { label: 'Superfãs', value: fmt.compact(k.superfans), change: '+12%', icon: '🔥', up: true },
      { label: 'Taxa de Resposta', value: k.responseRate + '%', change: '+4%', icon: '📊', up: true },
      { label: 'Pesquisas Ativas', value: k.activeSurveys, change: '+2', icon: '📋', up: true },
    ];
    grid.innerHTML = kpis.map(k => `
      <div class="kpi-card">
        <div class="kpi-card__header">
          <span class="kpi-card__label">${k.label}</span>
          <span class="kpi-card__icon">${k.icon}</span>
        </div>
        <div class="kpi-card__value">${k.value}</div>
        <div class="kpi-card__footer">
          <span class="kpi-card__change ${k.up ? 'kpi-card__change--up' : 'kpi-card__change--down'}">${k.up ? '↑' : '↓'} ${k.change}</span>
        </div>
      </div>
    `).join('');
  },

  renderAnalyticsCharts() {
    if (!window.MS_DATA || typeof Chart === 'undefined') return;
    const a = window.MS_DATA.analytics;

    // Engagement
    const engCtx = document.getElementById('analytics-chart-engagement');
    if (engCtx) {
      this.charts.push(new Chart(engCtx, {
        type: 'line',
        data: {
          labels: a.growth.map(g => g.w),
          datasets: [{
            label: 'Fãs', data: a.growth.map(g => g.v),
            borderColor: '#E5322B', backgroundColor: 'rgba(229,50,43,0.08)',
            fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#E5322B',
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: false, grid: { color: 'rgba(0,0,0,0.04)' } }, x: { grid: { display: false } } }
        }
      }));
    }

    // Surveys bar (mock monthly)
    const surveysCtx = document.getElementById('analytics-chart-surveys');
    if (surveysCtx) {
      this.charts.push(new Chart(surveysCtx, {
        type: 'bar',
        data: {
          labels: ['Jan','Fev','Mar','Abr','Mai','Jun'],
          datasets: [{ label: 'Pesquisas', data: [3,5,4,7,6,9], backgroundColor: '#E5322B', borderRadius: 6 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' } }, x: { grid: { display: false } } }
        }
      }));
    }

    // Region doughnut
    const regionCtx = document.getElementById('analytics-chart-region');
    if (regionCtx) {
      this.charts.push(new Chart(regionCtx, {
        type: 'doughnut',
        data: {
          labels: a.geo.map(g => g.uf),
          datasets: [{ data: a.geo.map(g => g.v), backgroundColor: ['#E5322B','#1A5FD6','#6B33C9','#9A6B00','#157A3C','#FF6B6B','#FF8A80','#FFB3B3'], borderWidth: 0 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 12 } } }
        }
      }));
    }

    // Genre horizontal bar
    const genreCtx = document.getElementById('analytics-chart-genre');
    if (genreCtx) {
      this.charts.push(new Chart(genreCtx, {
        type: 'bar',
        data: {
          labels: a.genres.map(g => g.label),
          datasets: [{ label: 'Fãs', data: a.genres.map(g => g.v), backgroundColor: '#E5322B', borderRadius: 6 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false, indexAxis: 'y',
          plugins: { legend: { display: false } },
          scales: { x: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' } }, y: { grid: { display: false } } }
        }
      }));
    }
  },

  /* ═══════════════════════════════════════
     ARTISTS — Init & Render
     ═══════════════════════════════════════ */
  initArtists() {
    this.renderArtistsTable();
  },

  renderArtistsTable() {
    const tbody = document.getElementById('artists-tbody');
    if (!tbody || !window.MS_DATA) return;
    let artists = window.MS_DATA.artists;

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      artists = artists.filter(a => a.name.toLowerCase().includes(q) || a.genre.toLowerCase().includes(q));
    }
    if (this.activeFilter === 'Ativos') artists = artists.filter(a => a.health >= 8);
    if (this.activeFilter === 'Legacy') artists = artists.filter(a => a.health < 8);

    tbody.innerHTML = artists.map(a => {
      const grav = window.MS_DATA.gravadoras.find(g => g.id === a.grav);
      const healthBadge = a.health >= 9 ? 'badge--green' : a.health >= 8 ? 'badge--blue' : 'badge--yellow';
      return `
        <tr style="cursor:pointer" onclick="Admin.showArtistDetail('${a.id}')">
          <td>
            <div style="display:flex;align-items:center;gap:12px;">
              <div class="avatar">${artistAvatar(a)}</div>
              <div>
                <div style="font-weight:600;color:var(--ink);">${a.name}</div>
              </div>
            </div>
          </td>
          <td><span class="badge badge--red">${a.genre}</span></td>
          <td>${fmt.compact(a.fans)}</td>
          <td>${fmt.compact(a.superfans)}</td>
          <td><span style="color:var(--red-600);font-weight:600;">+${a.growth}%</span></td>
          <td>${grav ? grav.short : '—'}</td>
          <td><span class="badge ${healthBadge}">${a.health}</span></td>
        </tr>
      `;
    }).join('');
  },

  showArtistDetail(artistId) {
    const artist = window.MS_DATA.artists.find(a => a.id === artistId);
    if (!artist) return;
    const grav = window.MS_DATA.gravadoras.find(g => g.id === artist.grav);
    Modal.open(`
      <div class="modal__head">
        <h3 style="font-family:var(--font-display);font-size:var(--fs-lg);font-weight:var(--fw-bold);color:var(--ink);">${artist.name}</h3>
        <button class="modal__close" data-modal-close>✕</button>
      </div>
      <div class="modal__body">
        <div style="display:flex;gap:20px;margin-bottom:24px;">
          <div style="width:80px;height:80px;border-radius:var(--r-lg);overflow:hidden;flex-shrink:0;">
            ${artist.photo ? `<img src="${artist.photo}" alt="${artist.name}" style="width:100%;height:100%;object-fit:cover;">` : `<div style="width:100%;height:100%;background:${artist.color};display:flex;align-items:center;justify-content:center;color:#fff;font-size:28px;font-weight:700;">${artist.name[0]}</div>`}
          </div>
          <div>
            <div style="font-size:18px;font-weight:700;font-family:var(--font-display);color:var(--ink);">${artist.name}</div>
            <div style="color:var(--ink-4);font-size:14px;">${artist.genre} • ${grav ? grav.name : '—'}</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div style="padding:12px;background:var(--surface-2);border-radius:var(--r-md);">
            <div style="font-size:11px;color:var(--ink-4);text-transform:uppercase;letter-spacing:0.05em;">Fãs</div>
            <div style="font-size:20px;font-weight:700;font-family:var(--font-display);">${fmt.compact(artist.fans)}</div>
          </div>
          <div style="padding:12px;background:var(--surface-2);border-radius:var(--r-md);">
            <div style="font-size:11px;color:var(--ink-4);text-transform:uppercase;letter-spacing:0.05em;">Superfãs</div>
            <div style="font-size:20px;font-weight:700;font-family:var(--font-display);">${fmt.compact(artist.superfans)}</div>
          </div>
          <div style="padding:12px;background:var(--surface-2);border-radius:var(--r-md);">
            <div style="font-size:11px;color:var(--ink-4);text-transform:uppercase;letter-spacing:0.05em;">Crescimento</div>
            <div style="font-size:20px;font-weight:700;font-family:var(--font-display);color:var(--red-600);">+${artist.growth}%</div>
          </div>
          <div style="padding:12px;background:var(--surface-2);border-radius:var(--r-md);">
            <div style="font-size:11px;color:var(--ink-4);text-transform:uppercase;letter-spacing:0.05em;">Saúde</div>
            <div style="font-size:20px;font-weight:700;font-family:var(--font-display);">${artist.health}/10</div>
          </div>
        </div>
      </div>
    `);
  },

  /* ═══════════════════════════════════════
     FANS — Init & Render
     ═══════════════════════════════════════ */
  initFans() {
    if (!window.MS_DATA) return;
    const a = window.MS_DATA.analytics;

    // KPIs
    const grid = document.getElementById('fans-kpi-grid');
    if (grid) {
      const kpis = [
        { label: 'Total de Fãs', value: fmt.compact(a.kpis.fans), change: `+${a.kpis.fansGrowth}%`, icon: '👥', up: true },
        { label: 'Superfãs', value: fmt.compact(a.kpis.superfans), change: '+12%', icon: '🔥', up: true },
        { label: 'Taxa de Resposta', value: a.kpis.responseRate + '%', change: '+4%', icon: '📊', up: true },
        { label: 'Índice de Saúde', value: a.kpis.health + '/10', change: '+0.3', icon: '💚', up: true },
      ];
      grid.innerHTML = kpis.map(k => `
        <div class="kpi-card">
          <div class="kpi-card__header">
            <span class="kpi-card__label">${k.label}</span>
            <span class="kpi-card__icon">${k.icon}</span>
          </div>
          <div class="kpi-card__value">${k.value}</div>
          <div class="kpi-card__footer">
            <span class="kpi-card__change ${k.up ? 'kpi-card__change--up' : 'kpi-card__change--down'}">${k.up ? '↑' : '↓'} ${k.change}</span>
          </div>
        </div>
      `).join('');
    }

    // Segments chart
    if (typeof Chart !== 'undefined') {
      const segCtx = document.getElementById('fans-chart-segments');
      if (segCtx) {
        this.charts.push(new Chart(segCtx, {
          type: 'doughnut',
          data: {
            labels: a.segments.map(s => s.label),
            datasets: [{ data: a.segments.map(s => s.value), backgroundColor: ['#E5322B','#1A5FD6','#6B33C9','#9A6B00','#157A3C'], borderWidth: 0 }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 12 } } }
          }
        }));
      }

      const ageCtx = document.getElementById('fans-chart-age');
      if (ageCtx) {
        this.charts.push(new Chart(ageCtx, {
          type: 'bar',
          data: {
            labels: a.age.map(s => s.label),
            datasets: [{ label: '%', data: a.age.map(s => s.v), backgroundColor: '#E5322B', borderRadius: 6 }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' } }, x: { grid: { display: false } } }
          }
        }));
      }
    }

    // Segments table
    const tbody = document.getElementById('fans-segments-tbody');
    if (tbody) {
      tbody.innerHTML = a.segments.map(s => `
        <tr>
          <td style="font-weight:600;color:var(--ink);">${s.label}</td>
          <td>${s.value}%</td>
          <td>${fmt.num(s.count)}</td>
          <td><span class="badge badge--blue">${s.action}</span></td>
        </tr>
      `).join('');
    }
  },

  /* ═══════════════════════════════════════
     AMBASSADORS — Init & Render
     ═══════════════════════════════════════ */
  initAmbassadors() {
    this.renderAmbassadorsTable();
  },

  renderAmbassadorsTable() {
    const tbody = document.getElementById('ambassadors-tbody');
    if (!tbody || !window.MS_DATA) return;
    let ambs = window.MS_DATA.ambassadors;

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      ambs = ambs.filter(a => a.name.toLowerCase().includes(q) || a.handle.toLowerCase().includes(q) || a.genre.toLowerCase().includes(q));
    }
    if (this.activeFilter !== 'Todos') {
      ambs = ambs.filter(a => a.tier === this.activeFilter);
    }

    tbody.innerHTML = ambs.map(a => {
      const tierMap = { platinum: 'tier--platinum', gold: 'tier--gold', silver: 'tier--silver' };
      const goalPct = Math.min(100, Math.round((a.brought / (a.goal * 5)) * 100));
      return `
        <tr>
          <td>
            <div style="font-weight:600;color:var(--ink);">${a.name}</div>
            <div style="font-size:12px;color:var(--ink-4);">${a.handle}</div>
          </td>
          <td>${a.genre}</td>
          <td>${a.state}</td>
          <td style="font-weight:600;">${a.brought}</td>
          <td style="font-weight:600;color:var(--red-600);">+${a.week}</td>
          <td>${fmt.compact(a.points)}</td>
          <td><span class="tier ${tierMap[a.tier] || ''}">${a.tier}</span></td>
          <td>
            <div style="display:flex;align-items:center;gap:8px;">
              <div class="progress"><div class="progress-bar" style="width:${goalPct}%"></div></div>
              <span style="font-size:12px;color:var(--ink-4);">${goalPct}%</span>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  /* ═══════════════════════════════════════
     SURVEYS — Init & Render
     ═══════════════════════════════════════ */
  initSurveys() {
    this.renderSurveysTable();
  },

  renderSurveysTable() {
    const tbody = document.getElementById('surveys-tbody');
    if (!tbody || !window.MS_DATA) return;
    let surveys = window.MS_DATA.surveys;

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      surveys = surveys.filter(s => s.title.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q));
    }
    if (this.activeFilter === 'Ativas') surveys = surveys.filter(s => s.status === 'active');
    if (this.activeFilter === 'Concluídas') surveys = surveys.filter(s => s.status === 'completed');

    tbody.innerHTML = surveys.map(s => {
      const artist = window.MS_DATA.artists.find(a => a.id === s.artist);
      const pct = Math.min(100, Math.round((s.responses / s.sent) * 100));
      const statusBadge = s.status === 'active' ? 'badge--green' : s.status === 'completed' ? 'badge--blue' : 'badge--gray';
      const statusLabel = s.status === 'active' ? 'Ativa' : s.status === 'completed' ? 'Concluída' : 'Rascunho';
      return `
        <tr>
          <td>
            <div style="font-weight:600;color:var(--ink);">${s.title}</div>
            <div style="font-size:12px;color:var(--ink-4);">${s.desc}</div>
          </td>
          <td>${artist ? artist.name : '—'}</td>
          <td><span class="badge badge--purple">${s.type}</span></td>
          <td>
            <div style="display:flex;align-items:center;gap:8px;">
              <div class="progress" style="flex:1;max-width:100px;">
                <div class="progress-bar" style="width:${pct}%"></div>
              </div>
              <span style="font-size:12px;color:var(--ink-4);">${fmt.num(s.responses)}/${fmt.num(s.sent)}</span>
            </div>
          </td>
          <td>${s.points} pts</td>
          <td><span class="badge ${statusBadge}">${statusLabel}</span></td>
        </tr>
      `;
    }).join('');
  },

  /* ═══════════════════════════════════════
     ACTIVATIONS — Init & Render
     ═══════════════════════════════════════ */
  initActivations() {
    this.renderActivationsTable();
  },

  renderActivationsTable() {
    const tbody = document.getElementById('activations-tbody');
    if (!tbody || !window.MS_DATA) return;
    let acts = window.MS_DATA.activations;

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      acts = acts.filter(a => a.title.toLowerCase().includes(q) || a.type.toLowerCase().includes(q));
    }
    if (this.activeFilter === 'Disponível') acts = acts.filter(a => a.remaining > 0);
    if (this.activeFilter === 'Esgotado') acts = acts.filter(a => a.remaining === 0);

    tbody.innerHTML = acts.map(a => {
      const artist = window.MS_DATA.artists.find(ar => ar.id === a.artist);
      const isLow = a.remaining > 0 && a.remaining <= 5;
      const isGone = a.remaining === 0;
      return `
        <tr>
          <td style="font-weight:600;color:var(--ink);">${a.title}</td>
          <td>${artist ? artist.name : '—'}</td>
          <td><span class="badge badge--red">${a.type}</span></td>
          <td>${a.total}</td>
          <td>
            <span style="font-weight:600;${isGone ? 'color:var(--ink-4);' : isLow ? 'color:var(--red-600);' : 'color:var(--ink);'}">${a.remaining}</span>
          </td>
          <td>${fmt.date(a.expires)}</td>
        </tr>
      `;
    }).join('');
  },

  /* ═══════════════════════════════════════
     GRAVADORAS — Init & Render (NO monthly_fee)
     ═══════════════════════════════════════ */
  initGravadoras() {
    this.renderGravadorasTable();
  },

  renderGravadorasTable() {
    const tbody = document.getElementById('gravadoras-tbody');
    if (!tbody || !window.MS_DATA) return;
    let gravs = window.MS_DATA.gravadoras;

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      gravs = gravs.filter(g => g.name.toLowerCase().includes(q) || g.short.toLowerCase().includes(q));
    }

    tbody.innerHTML = gravs.map(g => {
      const statusBadge = g.status === 'active' ? 'badge--green' : g.status === 'trial' ? 'badge--yellow' : 'badge--gray';
      const statusLabel = g.status === 'active' ? 'Ativa' : g.status === 'trial' ? 'Trial' : '—';
      return `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="width:32px;height:32px;border-radius:var(--r-md);background:${g.color};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:13px;">${g.short[0]}</div>
              <div>
                <div style="font-weight:600;color:var(--ink);">${g.name}</div>
                <div style="font-size:12px;color:var(--ink-4);">${g.plan}</div>
              </div>
            </div>
          </td>
          <td>${g.artists}</td>
          <td>${fmt.compact(g.fans)}</td>
          <td><span class="badge ${statusBadge}">${statusLabel}</span></td>
          <td><span style="font-weight:600;">${g.health}/10</span></td>
        </tr>
      `;
    }).join('');
  },

  /* ═══════════════════════════════════════
     APPLY FILTERS — Dispatch
     ═══════════════════════════════════════ */
  applyFilters() {
    switch (this.page) {
      case 'artists':     this.renderArtistsTable(); break;
      case 'ambassadors': this.renderAmbassadorsTable(); break;
      case 'surveys':     this.renderSurveysTable(); break;
      case 'activations': this.renderActivationsTable(); break;
      case 'gravadoras':  this.renderGravadorasTable(); break;
    }
  },

  /* ═══════════════════════════════════════
     EXPORT — CSV
     ═══════════════════════════════════════ */
  exportCSV(data, filename) {
    if (!data || !data.length) { Toast.error('Nenhum dado para exportar'); return; }
    exportCSV(data, `mainstage-${filename}`);
  },

  /* ═══════════════════════════════════════
     EXPORT — PDF (simple HTML-to-print)
     ═══════════════════════════════════════ */
  exportReport(type) {
    const titleMap = {
      artists: 'Relatório de Artistas', fans: 'Relatório de Fãs',
      surveys: 'Relatório de Pesquisas', activations: 'Relatório de Ativações',
      ambassadors: 'Relatório de Embaixadores', gravadoras: 'Relatório de Gravadoras',
      analytics: 'Relatório de Analytics',
    };
    const title = titleMap[type] || 'Relatório';
    const printWin = window.open('', '_blank');
    if (!printWin) { Toast.error('Pop-up bloqueado'); return; }
    printWin.document.write(`
      <!DOCTYPE html><html><head><title>${title}</title>
      <style>body{font-family:Inter,sans-serif;padding:40px;color:#0B0B0D;}
      h1{font-family:'Space Grotesk',sans-serif;font-size:28px;margin-bottom:8px;}
      p{color:#74777F;font-size:14px;margin-bottom:32px;}
      table{width:100%;border-collapse:collapse;font-size:13px;}
      th{text-align:left;padding:10px 12px;border-bottom:2px solid #E8E8E4;font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#74777F;}
      td{padding:10px 12px;border-bottom:1px solid #F0F0EE;}</style></head>
      <body><h1>${title}</h1><p>MAINSTAGE v5 — Gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
      <div id="content"></div></body></html>
    `);
    const content = printWin.document.getElementById('content');
    const dataMap = {
      artists: window.MS_DATA?.artists, fans: window.MS_DATA?.analytics?.segments,
      surveys: window.MS_DATA?.surveys, activations: window.MS_DATA?.activations,
      ambassadors: window.MS_DATA?.ambassadors, gravadoras: window.MS_DATA?.gravadoras,
    };
    const data = dataMap[type];
    if (data && data.length) {
      const headers = Object.keys(data[0]);
      content.innerHTML = `<table><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${data.map(row => `<tr>${headers.map(h => `<td>${row[h] ?? ''}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    }
    printWin.document.close();
    printWin.print();
  },
};

window.Admin = Admin;
document.addEventListener('DOMContentLoaded', () => Admin.init());
