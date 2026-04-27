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
  const map = {
    'Empresa / Marca': 'Empresa',
    'Agência de Publicidade/Marketing': 'Agência',
    'Creator': 'Creator',
    'Agência de Casting / Agenciador': 'Casting'
  };
  return map[profile] || profile || '—';
}

function shortResult(id) {
  const map = {
    'community_discovery': 'Community Discovery',
    'sprout_social': 'Sprout Social',
    'monitoring_insights': 'Monitoring',
    'cultural_influencer': 'Cultural Influencer',
    'professional_creator': 'Professional Creator'
  };
  return map[id] || id || '—';
}

function profileCounts(data) {
  const counts = {};
  data.forEach(r => {
    const p = r.perfil || '?';
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
}

// ===========================
// LOAD
// ===========================
async function loadAdminPanel() {
  // Leads
  const localData = typeof getAllResponses === 'function' ? getAllResponses() : [];
  let cloudData = [];
  if (typeof getLeadsFromSupabase === 'function') {
    cloudData = await getLeadsFromSupabase();
  }
  
  const mergedMap = new Map();
  [...localData, ...cloudData].forEach(r => { if (r && r.id) mergedMap.set(r.id, r); });
  allData = Array.from(mergedMap.values()).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  filteredData = [...allData];
  
  // Quizzes Sync
  try {
    if (typeof getQuizzesFromSupabase === 'function') {
      const cloudQuizzes = await getQuizzesFromSupabase();
      if (cloudQuizzes && Array.isArray(cloudQuizzes) && cloudQuizzes.length > 0) {
        saveQuizzes(cloudQuizzes, true); 
      }
    }
  } catch (e) {
    console.error("Erro ao sincronizar quizzes com Cloud:", e);
  }

  if (typeof getQuizzes === 'function' && getQuizzes().length === 0) {
    if (typeof createQuiz === 'function') createQuiz("Diagnóstico Spark MAXX");
  }

  const urlParams = new URLSearchParams(window.location.search);
  const targetTab = urlParams.get('tab') || currentTab;
  switchTab(targetTab);
  loadBranding();
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

// ===========================
// MEUS QUIZZES
// ===========================
const btnCreateQuizHeader = document.getElementById('btnCreateQuiz');
if (btnCreateQuizHeader) {
  btnCreateQuizHeader.addEventListener('click', () => {
    const name = prompt('Nome do novo quiz:', 'Novo Quiz');
    if (name) {
      createQuiz(name);
      renderQuizzes();
      showToast('✅ Quiz criado com sucesso!');
    }
  });
}

function renderQuizzes() {
  const grid = document.getElementById('quizzesGrid');
  if (!grid) return;

  const quizzes = getQuizzes();
  
  if (!quizzes || quizzes.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: var(--bg-secondary); border-radius: 12px; border: 1px dashed var(--border-color);">
        <p style="color: var(--text-muted); margin-bottom: 16px;">Nenhum quiz encontrado.</p>
        <button class="btn-primary" onclick="document.getElementById('btnCreateQuiz').click()">Criar meu primeiro Quiz</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = quizzes.map(q => `
    <div class="card" style="display:flex;flex-direction:column;gap:12px;">
      <h3 style="font-size:16px;color:var(--text-main);margin:0;">${q.name}</h3>
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">
        <p style="margin:2px 0;">ID: <code>${q.id}</code></p>
        <p style="margin:2px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${q.webhookUrl || 'Não configurado'}">Webhook: ${q.webhookUrl || 'Não configurado'}</p>
      </div>
      
      <div style="background:var(--bg-secondary);padding:10px;border-radius:6px;font-size:11px;display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
        <div style="text-align:center;">
          <div style="color:var(--text-muted);">👀 Views</div>
          <div style="font-weight:600;font-size:14px;color:var(--primary-color);">${typeof getAnalytics === 'function' ? getAnalytics(q.id).views : 0}</div>
        </div>
        <div style="color:var(--border-color);">➔</div>
        <div style="text-align:center;">
          <div style="color:var(--text-muted);">📩 Leads</div>
          <div style="font-weight:600;font-size:14px;color:var(--secondary-color);">${typeof getAnalytics === 'function' ? getAnalytics(q.id).leads : 0}</div>
        </div>
        <div style="color:var(--border-color);">➔</div>
        <div style="text-align:center;">
          <div style="color:var(--text-muted);">🎯 Finalizados</div>
          <div style="font-weight:600;font-size:14px;color:#10B981;">${allData.filter(r => r && r.quiz_id === q.id).length}</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-top:auto;flex-wrap:wrap;">
        <button class="btn-primary" style="flex:1;padding:8px;font-size:12px;" onclick="editQuiz('${q.id}')">Editar Fluxo</button>
        <button class="btn-secondary" style="flex:1;padding:8px;font-size:12px;" onclick="copyQuizLink('${q.id}')">Copiar Link</button>
        <button class="btn-secondary" style="padding:8px;font-size:12px;" onclick="configWebhook('${q.id}')" title="Configurar Webhook">🔗</button>
        <button class="btn-secondary" style="padding:8px;font-size:12px;" onclick="testWebhook('${q.id}')" title="Testar Webhook">⚡</button>
        <button class="btn-secondary" style="padding:8px;font-size:12px;" onclick="actionDuplicateQuiz('${q.id}')" title="Duplicar">📑</button>
        <button class="btn-danger" style="padding:8px;font-size:12px;" onclick="actionDeleteQuiz('${q.id}')" title="Excluir">✕</button>
      </div>
    </div>
  `).join('');
}

function editQuiz(id) {
  window.location.href = `builder.html?id=${id}`;
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

function actionDuplicateQuiz(id) {
  if (confirm('Deseja duplicar este quiz?')) {
    if (typeof duplicateQuiz === 'function') duplicateQuiz(id);
    renderQuizzes();
    showToast('✅ Quiz duplicado!');
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
    const profilesList = ['Empresa / Marca', 'Agência de Publicidade/Marketing', 'Creator', 'Agência de Casting / Agenciador'];
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
    const matchProfile = !profile || r.perfil === profile;
    let matchDate = true;
    if (dateFilter === 'today') matchDate = isToday(r.timestamp);
    else if (dateFilter === 'week') matchDate = isThisWeek(r.timestamp);
    else if (dateFilter === 'month') matchDate = isThisMonth(r.timestamp);
    return matchSearch && matchProfile && matchDate;
  });

  currentPage = 1;
  renderResponses();
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
