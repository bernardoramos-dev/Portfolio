/* ============================================================
   MAINSTAGE V5 — Auth Page Controller
   Demo mode: any email/password works.
   Saves to localStorage and redirects to app.html.
   ============================================================ */

const AuthPage = {
  selectedGenres: [],

  init() {
    this.initTabs();
    this.initGenreChips();
    this.initSwitchLinks();
    this.initForms();
  },

  /* ── Tabs ── */
  initTabs() {
    $$('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.switchTab(tab.dataset.tab);
      });
    });
  },

  switchTab(target) {
    $$('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === target));
    $$('.auth-panel').forEach(p => p.classList.toggle('active', p.id === `panel-${target}`));
  },

  /* ── Switch links in footers ── */
  initSwitchLinks() {
    $$('[data-switch]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchTab(link.dataset.switch);
      });
    });
  },

  /* ── Genre Chips ── */
  initGenreChips() {
    $$('.genre-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const genre = chip.dataset.genre;
        if (chip.classList.contains('selected')) {
          chip.classList.remove('selected');
          this.selectedGenres = this.selectedGenres.filter(g => g !== genre);
        } else {
          chip.classList.add('selected');
          this.selectedGenres.push(genre);
        }
      });
    });
  },

  /* ── Forms ── */
  initForms() {
    // Login form — demo: any email/password works
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email');
        if (!email || !email.value.trim()) {
          Toast.error('Insira seu e-mail');
          return;
        }
        // Demo: create session from email
        const name = email.value.split('@')[0] || 'Fã';
        const fan = Session.defaults();
        fan.name = name.charAt(0).toUpperCase() + name.slice(1);
        Session.save(fan);
        Toast.success('Login realizado com sucesso!');
        setTimeout(() => {
          window.location.href = 'app.html';
        }, 800);
      });
    }

    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name');
        const lastname = document.getElementById('reg-lastname');
        const email = document.getElementById('reg-email');
        const password = document.getElementById('reg-password');
        const consent = document.getElementById('reg-consent');

        if (!name || !name.value.trim()) {
          Toast.error('Insira seu nome');
          return;
        }
        if (!email || !email.value.trim()) {
          Toast.error('Insira seu e-mail');
          return;
        }
        if (!password || password.value.length < 6) {
          Toast.error('Senha deve ter pelo menos 6 caracteres');
          return;
        }
        if (!consent || !consent.checked) {
          Toast.error('Você precisa aceitar os termos');
          return;
        }

        // Save session
        const fullName = `${name.value} ${lastname ? lastname.value : ''}`.trim();
        const genre = this.selectedGenres.length > 0 ? this.selectedGenres[0] : 'Pop';
        const fan = Session.defaults();
        fan.name = fullName;
        fan.genre = genre;
        Session.save(fan);

        Toast.success('Conta criada com sucesso!');
        setTimeout(() => {
          window.location.href = 'app.html';
        }, 800);
      });
    }
  },
};

document.addEventListener('DOMContentLoaded', () => AuthPage.init());
