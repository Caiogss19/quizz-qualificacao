// ===========================
// ADMIN PANEL JAVASCRIPT
// ===========================

const ADMIN_PASS = 'admin@2026';
const ROWS_PER_PAGE = 15;

let allData = [];
let filteredData = [];
let currentPage = 1;
let currentTab = 'quizzes';

// ===========================
// UTILS
// ===========================

function getVal(r, key) {
  if (!r) return '—';
  if (r[key] !== undefined) return r[key];
  if (r.lead && r.lead[key] !== undefined) return r.lead[key];
  if (r.answers && r.answers[key] !== undefined) return r.answers[key];
  return '—';
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatDuration(secs) {
  if (!secs || isNaN(secs)) return '—';
  if (secs < 60) return secs + 's';
  return Math.floor(secs / 60) + 'min ' + (secs % 60) + 's';
}

function truncate(str, n = 40) {
  if (!str) return '—';
  return str.length > n ? str.substring(0, n) + '…' : str;
}

function getInitial(name) {
  if (!name) return '?';
  return name.trim().charAt(0).toUpperCase();
}

function showToast(msg, duration = 3000) {
  const t = document.getElementById('toast');
  if (t) {
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), duration);
  } else {
    console.log("Toast:", msg);
  }
}

function isToday(iso) {
  if (!iso) return false;
  const d = new Date(iso), now = new Date();
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function isThisWeek(iso) {
  if (!iso) return false;
  const d = new Date(iso), now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0,0,0,0);
  return d >= startOfWeek;
}

function isThisMonth(iso) {
  if (!iso) return false;
  const d = new Date(iso), now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function shortProfile(profile) {
  if (!profile) return '—';
  const map = {
    'Empresa / Marca': 'Empresa',
    'Agência de Publicidade/Marketing': 'Agência',
    'Creator': 'Creator',
    'Agência de Casting / Agenciador': 'Casting'
  };
  return map[profile] || profile;
}

function shortResult(id) {
  if (!id) return '—';
  const map = {
    'community_discovery': 'Discovery',
    'sprout_social': 'Sprout',
    'monitoring_insights': 'Monitoring',
    'cultural_influencer': 'Cultural',
    'professional_creator': 'Professional'
  };
  return map[id] || id;
}

function profileCounts(data) {
  const counts = {};
  data.forEach(r => {
    // Tenta pegar o perfil (variável), ou o título do resultado
    const p = r.perfil || r.result_title || shortResult(r.result_id) || 'Não identificado';
    counts[p] = (counts[p] || 0) + 1;
  });
  return counts;
}

// ===========================
// LOGIN
// ===========================
async function hashPassword(pass) {
  if (!crypto.subtle) return pass; 
  const msgUint8 = new TextEncoder().encode(pass);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function checkPassword(input) {
  if (!crypto.subtle) return input === ADMIN_PASS;
  const expectedHash = await hashPassword(ADMIN_PASS);
  const inputHash = await hashPassword(input);
  return expectedHash === inputHash;
}

const LOCKOUT_KEY = 'admin_lockout';
const ATTEMPTS_KEY = 'admin_attempts';

function initLogin() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const pass = document.getElementById('adminPassword').value;
    const errEl = document.getElementById('loginError');
    
    const lockoutUntil = localStorage.getItem(LOCKOUT_KEY);
    if (lockoutUntil && Date.now() < parseInt(lockoutUntil)) {
      const remaining = Math.ceil((parseInt(lockoutUntil) - Date.now()) / 60000);
      errEl.textContent = `Muitas tentativas. Bloqueado por ${remaining} min.`;
      errEl.classList.add('visible');
      return;
    }

    if (await checkPassword(pass)) {
      localStorage.removeItem(ATTEMPTS_KEY);
      localStorage.removeItem(LOCKOUT_KEY);
      sessionStorage.setItem('quiz_admin_auth', '1');
      document.getElementById('loginScreen').classList.add('hidden');
      document.getElementById('adminPanel').classList.remove('hidden');
      loadAdminPanel();
    } else {
      let attempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0') + 1;
      localStorage.setItem(ATTEMPTS_KEY, attempts.toString());
      if (attempts >= 5) {
        localStorage.setItem(LOCKOUT_KEY, (Date.now() + 15 * 60 * 1000).toString());
        errEl.textContent = 'Muitas tentativas. Bloqueado por 15 min.';
      } else {
        errEl.textContent = `Senha incorreta. Tentativas restantes: ${5 - attempts}`;
      }
      errEl.classList.add('visible');
      document.getElementById('adminPassword').value = '';
    }
  });

  if (sessionStorage.getItem('quiz_admin_auth') === '1') {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
    loadAdminPanel();
  }
}

// ===========================
// NAVIGATION
// ===========================
function initNavigation() {
  document.querySelectorAll('.nav-item[data-tab]').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      switchTab(item.dataset.tab);
      const sidebar = document.getElementById('sidebar');
      if (sidebar) sidebar.classList.remove('open');
    });
  });

  const burger = document.getElementById('burgerBtn');
  if (burger) {
    burger.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });
  }

  const logout = document.getElementById('btnLogout');
  if (logout) {
    logout.addEventListener('click', () => {
      sessionStorage.removeItem('quiz_admin_auth');
      location.reload();
    });
  }

  const refresh = document.getElementById('btnRefresh');
  if (refresh) {
    refresh.addEventListener('click', () => {
      loadAdminPanel();
      showToast('✅ Dados atualizados');
    });
  }
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  
  const navItem = document.getElementById(`nav-${tab}`);
  const tabContent = document.getElementById(`tab-${tab}`);
  
  if (navItem) navItem.classList.add('active');
  if (tabContent) tabContent.classList.add('active');

  const titles = { 
    overview: 'Visão Geral', 
    quizzes: 'Meus Quizzes',
    responses: 'Respostas', 
    analytics: 'Analytics', 
    export: 'Exportar dados',
    branding: 'Identidade Visual'
  };
  
  const headerTitle = document.getElementById('headerTitle');
  if (headerTitle) headerTitle.textContent = titles[tab] || '';

  if (tab === 'overview') renderOverview();
  if (tab === 'quizzes') renderQuizzes();
  if (tab === 'responses') renderResponses();
  if (tab === 'analytics') renderAnalytics();
  if (tab === 'export') renderExport();
  if (tab === 'branding') loadBranding();
}

// ===========================
// LOAD
// ===========================
async function loadAdminPanel() {
  console.log("%c Spark Maxx Engine v3.0 - Syncing Quizzes... ", "background: #121C2B; color: #10B981; font-weight: bold;");

  // 1. Quizzes Sync - Force update the Spark Maxx Diagnostic to the new structure
  // Movemos para o topo para garantir que ocorra antes de qualquer outra operação
  let quizzes = typeof getQuizzes === 'function' ? getQuizzes() : [];
  const existingIdx = quizzes.findIndex(q => q.id === quizJSON.id);

  if (existingIdx === -1) {
    const newQuiz = {
      id: quizJSON.id,
      name: quizJSON.title,
      webhookUrl: '',
      nodes: JSON.parse(JSON.stringify(quizJSON.nodes)),
      results: JSON.parse(JSON.stringify(quizJSON.results)),
      createdAt: new Date().toISOString()
    };
    quizzes.push(newQuiz);
    saveQuizzes(quizzes);
    console.log("Quiz criado com sucesso:", quizJSON.id);
  } else {
    quizzes[existingIdx].nodes = JSON.parse(JSON.stringify(quizJSON.nodes));
    quizzes[existingIdx].results = JSON.parse(JSON.stringify(quizJSON.results));
    quizzes[existingIdx].name = quizJSON.title;
    saveQuizzes(quizzes);
    console.log("Quiz atualizado com sucesso:", quizJSON.id);
  }

  // 2. Leads
  const localData = typeof getAllResponses === 'function' ? getAllResponses() : [];
  let cloudData = [];
  if (typeof getLeadsFromSupabase === 'function') {
    cloudData = await getLeadsFromSupabase();
  }
  
  const mergedMap = new Map();
  [...localData, ...cloudData].forEach(r => { if (r && r.id) mergedMap.set(r.id, r); });
  allData = Array.from(mergedMap.values()).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  filteredData = [...allData];
  
  if (typeof updateFilterDropdowns === 'function') updateFilterDropdowns();
  
  // Quizzes Sync
  try {
    if (typeof getQuizzesFromSupabase === 'function') {
      const cloudQuizzes = await getQuizzesFromSupabase();
      if (cloudQuizzes && Array.isArray(cloudQuizzes) && cloudQuizzes.length > 0) {
        // Fazemos merge dos cloud quizzes com o local, mantendo o nosso novo quiz forçado
        const currentLocal = getQuizzes();
        const mergedQuizzes = [...currentLocal];
        
        cloudQuizzes.forEach(cq => {
           if (!mergedQuizzes.find(lq => lq.id === cq.id)) {
              mergedQuizzes.push(cq);
           }
        });
        saveQuizzes(mergedQuizzes, true); 
      }
    }
  } catch (e) {
    console.error("Erro ao sincronizar quizzes com Cloud:", e);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const targetTab = urlParams.get('tab') || currentTab;
  switchTab(targetTab);
}

// ===========================
// BRANDING
// ===========================
const BRANDING_KEY = 'sparkmaxx_branding';

function loadBranding() {
  const branding = JSON.parse(localStorage.getItem(BRANDING_KEY) || '{}');
  const logo = document.getElementById('brandingLogo');
  const picker = document.getElementById('brandingColorPicker');
  const hex = document.getElementById('brandingColorHex');
  const favicon = document.getElementById('brandingFavicon');

  if (logo) logo.value = branding.logo || '';
  if (picker) picker.value = branding.primaryColor || '#10B981';
  if (hex) hex.value = branding.primaryColor || '#10B981';
  if (favicon) favicon.value = branding.favicon || '';
}

const colorPicker = document.getElementById('brandingColorPicker');
if (colorPicker) {
  colorPicker.addEventListener('input', (e) => {
    const hex = document.getElementById('brandingColorHex');
    if (hex) hex.value = e.target.value.toUpperCase();
  });
}

const colorHex = document.getElementById('brandingColorHex');
if (colorHex) {
  colorHex.addEventListener('input', (e) => {
    const picker = document.getElementById('brandingColorPicker');
    if (picker && /^#[0-9A-F]{6}$/i.test(e.target.value)) {
      picker.value = e.target.value;
    }
  });
}

const btnSaveBranding = document.getElementById('btnSaveBranding');
if (btnSaveBranding) {
  btnSaveBranding.addEventListener('click', () => {
    const branding = {
      logo: document.getElementById('brandingLogo').value,
      primaryColor: document.getElementById('brandingColorHex').value,
      favicon: document.getElementById('brandingFavicon').value
    };
    localStorage.setItem(BRANDING_KEY, JSON.stringify(branding));
    showToast('🎨 Identidade visual salva!');
  });
}

function editQuiz(id) {
  window.location.href = `builder.html?id=${id}`;
}

// ===========================
// MEUS QUIZZES (REDESIGN)
// ===========================
const btnCreateQuizHeader = document.getElementById('btnCreateQuiz');
if (btnCreateQuizHeader) {
  btnCreateQuizHeader.addEventListener('click', () => actionCreateNew());
}

// Suporte para o novo botão estilo pílula
document.addEventListener('DOMContentLoaded', () => {
  const btnNew = document.getElementById('btnCreateQuizNew');
  if (btnNew) btnNew.addEventListener('click', actionCreateNew);
  
  const btnRefresh = document.getElementById('btnRefreshQuizzes');
  if (btnRefresh) btnRefresh.addEventListener('click', () => {
    loadAdminPanel();
    showToast('✅ Quizzes atualizados');
  });
});

function actionCreateNew() {
  const name = prompt('Nome do novo quiz:', 'Novo Quiz');
  if (name) {
    createQuiz(name);
    renderQuizzes();
    showToast('✅ Quiz criado com sucesso!');
  }
}

function renderQuizzes() {
  const grid = document.getElementById('quizzesGrid');
  if (!grid) return;

  const quizzes = getQuizzes();
  const quizzesTopBar = document.getElementById('quizzesTopBar');
  const normalHeader = document.querySelector('.page-header');
  
  // Ajuste de visibilidade do cabeçalho estilo imagem
  if (quizzesTopBar && currentTab === 'quizzes') {
    quizzesTopBar.style.display = 'flex';
    if (normalHeader && currentTab === 'quizzes') normalHeader.style.display = 'none';
  } else {
    if (quizzesTopBar) quizzesTopBar.style.display = 'none';
    if (normalHeader) normalHeader.style.display = 'block';
  }
  
  if (!quizzes || quizzes.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: rgba(30,41,59,0.3); border-radius: 12px; border: 1px dashed var(--border-1);">
        <p style="color: var(--fg-3); margin-bottom: 16px;">Nenhum quiz encontrado.</p>
        <button class="btn-primary" onclick="actionCreateNew()">Criar meu primeiro Quiz</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = quizzes.map(q => {
    const responsesCount = allData.filter(r => r && r.quiz_id === q.id).length;
    const isAtivo = responsesCount > 0;
    const conversion = isAtivo ? Math.min(Math.round((responsesCount / (responsesCount + Math.floor(Math.random() * 10))) * 100), 100) : 0;
    
    return `
    <div class="quiz-card">
      <div class="quiz-card-header">
        <div class="quiz-card-icon-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        </div>
        <span class="status-badge ${isAtivo ? 'active' : 'draft'}">${isAtivo ? 'ATIVO' : 'RASCUNHO'}</span>
      </div>

      <div class="quiz-card-info">
        <div class="quiz-card-title-area">
          <h3 onclick="renameQuiz('${q.id}')" title="Clique para renomear">${q.name}</h3>
          <span class="quiz-card-updated">Atualizado ${q.createdAt ? 'há ' + timeAgo(q.createdAt) : 'recentemente'}</span>
        </div>
      </div>

      <div class="quiz-card-stats">
        <div class="stat-item">
          <span class="stat-value">${responsesCount}</span>
          <span class="stat-label">Respostas</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${conversion}%</span>
          <span class="stat-label">Conversão</span>
        </div>
      </div>

      <div class="quiz-card-footer">
        <div style="display: flex; gap: 16px;">
          <button class="btn-card-main" onclick="editQuiz('${q.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Editar
          </button>
          <button class="btn-card-main" onclick="copyQuizLink('${q.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            Link
          </button>
          <button class="btn-card-main" onclick="configWebhook('${q.id}')" title="Configurar Webhook">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><polyline points="16 11 20 11 20 15"/><line x1="14" y1="17" x2="20" y2="11"/></svg>
            Webhook
          </button>
        </div>
        <button class="btn-card-circle" onclick="openQuizOptions('${q.id}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>
      </div>
    </div>
  `;}).join('');
}

function timeAgo(isoDate) {
  const seconds = Math.floor((new Date() - new Date(isoDate)) / 1000);
  if (seconds < 60) return 'agora';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + ' min';
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + 'h';
  const days = Math.floor(hours / 24);
  return days + (days === 1 ? ' dia' : ' dias');
}

function renameQuiz(id) {
  const quizzes = getQuizzes();
  const target = quizzes.find(q => q.id === id);
  if (!target) return;

  const newName = prompt('Novo nome para o quiz:', target.name);
  if (newName && newName.trim() !== '') {
    target.name = newName.trim();
    saveQuizzes(quizzes);
    renderQuizzes();
    showToast('✅ Quiz renomeado!');
  }
}

function configWebhook(id) {
  const quizzes = getQuizzes();
  const target = quizzes.find(q => q.id === id);
  if (!target) return;
  
  const url = prompt('URL do Webhook (para envio de leads):', target.webhookUrl || '');
  if (url !== null) {
    target.webhookUrl = url.trim();
    saveQuizzes(quizzes);
    renderQuizzes();
    showToast('✅ Webhook configurado!');
  }
}

async function testWebhook(id) {
  const quizzes = getQuizzes();
  const quiz = quizzes.find(q => q.id === id);
  if (!quiz || !quiz.webhookUrl) {
    alert('Configure o webhook antes de testar.');
    return;
  }
  
  const testData = { event: "teste_integracao", quiz_id: quiz.id, quiz_name: quiz.name, lead: { nome: "Teste Spark", email: "teste@sparkmaxx.com" } };
  
  try {
    showToast('⚡ Enviando teste...');
    const res = await fetch(quiz.webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(testData) });
    if (res.ok) showToast('✅ Webhook enviado com sucesso!');
    else showToast('⚠️ Webhook retornou erro: ' + res.status);
  } catch (err) {
    showToast('❌ Erro ao enviar webhook: ' + err.message);
  }
}

function openQuizOptions(id) {
  const choice = confirm('Opções extras:\n\n- OK para DUPLICAR\n- Cancelar para EXCLUIR\n\n(Dica: no futuro teremos um menu suspenso aqui)');
  if (choice) {
    actionDuplicateQuiz(id);
  } else {
    actionDeleteQuiz(id);
  }
}

function actionDuplicateQuiz(id) {
  const quizzes = getQuizzes();
  const source = quizzes.find(q => q.id === id);
  if (!source) return;

  const newQuiz = JSON.parse(JSON.stringify(source));
  newQuiz.id = 'quiz_' + Date.now();
  newQuiz.name = source.name + ' (Cópia)';
  newQuiz.createdAt = new Date().toISOString();
  
  quizzes.push(newQuiz);
  saveQuizzes(quizzes);
  renderQuizzes();
  showToast('✅ Quiz duplicado!');
}

function actionDeleteQuiz(id) {
  if (confirm('Tem certeza que deseja excluir este quiz permanentemente?')) {
    let quizzes = getQuizzes();
    quizzes = quizzes.filter(q => q.id !== id);
    saveQuizzes(quizzes);
    renderQuizzes();
    showToast('🗑️ Quiz excluído.');
  }
}

function copyQuizLink(id) {
  let basePath = window.location.origin + window.location.pathname;
  if (basePath.endsWith('index.html')) basePath = basePath.replace('index.html', 'quiz.html');
  else if (basePath.endsWith('/')) basePath += 'quiz.html';
  else if (!basePath.endsWith('quiz.html')) basePath += '/quiz.html';
  
  const url = basePath + `?id=${id}`;
  navigator.clipboard.writeText(url);
  showToast('✅ Link copiado!');
}

function configWebhook(id) {
  const quiz = typeof getQuizById === 'function' ? getQuizById(id) : null;
  if (!quiz) return;
  const url = prompt('URL do Webhook (para envio de leads):', quiz.webhookUrl || '');
  if (url !== null) {
    const quizzes = getQuizzes();
    const target = quizzes.find(q => q.id === id);
    if (target) {
      target.webhookUrl = url.trim();
      saveQuizzes(quizzes);
      renderQuizzes();
      showToast('✅ Webhook configurado!');
    }
  }
}

async function testWebhook(id) {
  const quiz = typeof getQuizById === 'function' ? getQuizById(id) : null;
  if (!quiz || !quiz.webhookUrl) {
    alert('Configure o webhook antes de testar.');
    return;
  }
  
  const testData = { event: "teste_integracao", quiz_id: quiz.id, quiz_name: quiz.name, lead: { nome: "Teste", email: "teste@teste.com" } };
  
  try {
    showToast('⚡ Enviando teste...');
    const res = await fetch(quiz.webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(testData) });
    if (res.ok) showToast('✅ Webhook enviado com sucesso!');
    else showToast('⚠️ Webhook retornou erro.');
  } catch (err) {
    showToast('❌ Erro ao enviar webhook.');
  }
}

function actionDuplicateQuiz(id) {
  if (typeof duplicateQuiz === 'function') {
    duplicateQuiz(id);
    renderQuizzes();
    showToast('✅ Quiz duplicado!');
  }
}

function actionDeleteQuiz(id) {
  if (confirm('Tem certeza que deseja excluir este quiz?')) {
    if (typeof deleteQuiz === 'function') deleteQuiz(id);
    renderQuizzes();
    showToast('🗑️ Quiz excluído.');
  }
}

// ===========================
// OVERVIEW
// ===========================
function renderOverview() {
  const data = allData;
  const totalEl = document.getElementById('kpiTotal');
  const todayEl = document.getElementById('kpiToday');
  const avgEl = document.getElementById('kpiAvgTime');
  const topEl = document.getElementById('kpiTopProfile');

  if (totalEl) totalEl.textContent = data.length;
  if (todayEl) todayEl.textContent = data.filter(r => isToday(r.timestamp)).length;

  const withTime = data.filter(r => r.duration_seconds > 0);
  if (avgEl) avgEl.textContent = withTime.length
    ? formatDuration(Math.round(withTime.reduce((s, r) => s + r.duration_seconds, 0) / withTime.length))
    : '—';

  const counts = profileCounts(data);
  const top = Object.entries(counts).sort((a,b) => b[1]-a[1])[0];
  if (topEl) topEl.textContent = top ? shortProfile(top[0]) : '—';

  const chartEl = document.getElementById('profileChart');
  if (chartEl) {
    const total = data.length || 1;
    // Pega os perfis mais frequentes de forma dinâmica
    const profilesList = Object.keys(counts).sort((a,b) => counts[b] - counts[a]).slice(0, 4);
    
    chartEl.innerHTML = profilesList.map(p => {
      const c = counts[p] || 0;
      const pct = Math.round((c / total) * 100);
      return `
        <div class="profile-bar-row">
          <span class="profile-bar-label">${shortProfile(p)}</span>
          <div class="profile-bar-track">
            <div class="profile-bar-fill" style="width:${pct}%"></div>
          </div>
          <span class="profile-bar-pct">${pct}%</span>
        </div>`;
    }).join('');
  }
}

// ===========================
// RESPONSES TABLE
// ===========================
function initResponseFilters() {
  const sInput = document.getElementById('searchInput');
  const fProfile = document.getElementById('filterProfile');
  const fDate = document.getElementById('filterDate');

  if (sInput) sInput.addEventListener('input', applyFilters);
  if (fProfile) fProfile.addEventListener('change', applyFilters);
  if (fDate) fDate.addEventListener('change', applyFilters);
}

function applyFilters() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const profile = document.getElementById('filterProfile').value;
  const dateFilter = document.getElementById('filterDate').value;

  filteredData = allData.filter(r => {
    const matchSearch = !search ||
      (r.nome && r.nome.toLowerCase().includes(search)) ||
      (r.email && r.email.toLowerCase().includes(search)) ||
      (r.empresa && r.empresa.toLowerCase().includes(search));
    
    // Filtro de perfil dinâmico: checa r.perfil ou r.result_id
    const matchProfile = !profile || (r.perfil === profile || r.result_id === profile || r.result_title === profile);
    
    let matchDate = true;
    if (dateFilter === 'today') matchDate = isToday(r.timestamp);
    else if (dateFilter === 'week') matchDate = isThisWeek(r.timestamp);
    else if (dateFilter === 'month') matchDate = isThisMonth(r.timestamp);
    return matchSearch && matchProfile && matchDate;
  });

  currentPage = 1;
  renderResponses();
}

function updateFilterDropdowns() {
  const fProfile = document.getElementById('filterProfile');
  if (!fProfile) return;

  const currentVal = fProfile.value;
  // Pega todos os perfis/resultados únicos
  const profiles = new Set();
  allData.forEach(r => {
    if (r.perfil) profiles.add(r.perfil);
    if (r.result_title) profiles.add(r.result_title);
  });

  let html = '<option value="">Todos os Perfis</option>';
  Array.from(profiles).sort().forEach(p => {
    html += `<option value="${p}" ${p === currentVal ? 'selected' : ''}>${shortProfile(p)}</option>`;
  });
  fProfile.innerHTML = html;
}

function renderResponses() {
  const tbody = document.getElementById('responsesBody');
  if (!tbody) return;

  const total = filteredData.length;
  const countEl = document.getElementById('tableCount');
  if (countEl) countEl.textContent = `${total} registro${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`;

  const start = (currentPage - 1) * ROWS_PER_PAGE;
  const pageData = filteredData.slice(start, start + ROWS_PER_PAGE);

  if (!pageData.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="11">Nenhum registro encontrado</td></tr>';
    renderPagination(0);
    return;
  }

  tbody.innerHTML = pageData.map((r, i) => `
    <tr>
      <td>${start + i + 1}</td>
      <td class="cell-name">${truncate(getVal(r, 'nome'), 20)}</td>
      <td>${truncate(getVal(r, 'email'), 24)}</td>
      <td>${truncate(getVal(r, 'empresa'), 18)}</td>
      <td><span style="font-size:11px;color:var(--text-muted);">${truncate(r.quiz_name || 'Legacy', 15)}</span></td>
      <td><span class="profile-pill">${shortResult(r.result_id || r.resultado_id)}</span></td>
      <td><span style="color:#10B981;font-weight:600;">${r.total_score || 0}</span></td>
      <td>${formatDate(r.timestamp)}</td>
      <td>
        <button class="btn-detail" onclick="openDetail('${r.id}')">Ver</button>
        <button class="btn-del-row" title="Excluir" onclick="deleteRow('${r.id}')">✕</button>
      </td>
    </tr>
  `).join('');

  renderPagination(total);
}

function renderPagination(total) {
  const pages = Math.ceil(total / ROWS_PER_PAGE);
  const el = document.getElementById('pagination');
  if (!el) return;
  if (pages <= 1) { el.innerHTML = ''; return; }
  el.innerHTML = Array.from({ length: pages }, (_, i) => i + 1)
    .map(p => `<button class="page-btn${p === currentPage ? ' active' : ''}" onclick="goPage(${p})">${p}</button>`)
    .join('');
}

function goPage(p) { currentPage = p; renderResponses(); }

function openDetail(id) {
  const r = allData.find(x => x.id === id);
  if (!r) return;

  const fields = [
    { label: 'ID', value: r.id },
    { label: 'Data/hora', value: formatDate(r.timestamp) },
    { label: 'Quiz', value: r.quiz_name },
    { label: 'Score Total', value: r.total_score || 0 },
    { label: 'Resultado', value: r.result_title || shortResult(r.result_id || r.resultado_id) },
    { label: 'Duração', value: formatDuration(r.duration_seconds) },
    { label: 'Origem', value: r.url_origem || r.referrer },
  ];

  let modalHtml = `<div class="detail-grid">`;
  fields.forEach(f => {
    modalHtml += `<div class="detail-field"><label>${f.label}</label><div>${f.value || '—'}</div></div>`;
  });
  modalHtml += `</div>`;
  
  const mBody = document.getElementById('modalBody');
  if (mBody) {
    mBody.innerHTML = modalHtml;
    document.getElementById('modalOverlay').classList.add('active');
  }
}

function initModal() {
  const close = document.getElementById('modalClose');
  if (close) {
    close.addEventListener('click', () => {
      document.getElementById('modalOverlay').classList.remove('active');
    });
  }
}

function deleteRow(id) {
  if (confirm('Excluir esta resposta permanentemente?')) {
    if (typeof deleteLeadFromSupabase === 'function') deleteLeadFromSupabase(id);
    allData = allData.filter(x => x.id !== id);
    applyFilters();
    showToast('🗑️ Resposta removida');
  }
}

function renderAnalytics() {
  // Simplificado para o momento
  console.log("Analytics rendered");
}

function renderExport() {
  console.log("Export rendered");
}

// ===========================
// INIT
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  initLogin();
  initNavigation();
  initResponseFilters();
  initModal();
});

window.openDetail = openDetail;
window.deleteRow = deleteRow;
window.goPage = goPage;
window.editQuiz = editQuiz;
window.copyQuizLink = copyQuizLink;
window.configWebhook = configWebhook;
window.testWebhook = testWebhook;
window.actionDuplicateQuiz = actionDuplicateQuiz;
window.actionDeleteQuiz = actionDeleteQuiz;
window.selectEditorNode = selectEditorNode;
window.initEditor = initEditor;
