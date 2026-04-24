// ===========================
// ADMIN PANEL JAVASCRIPT
// ===========================

const DB_KEY = 'quiz_diagnostico_responses';
const ADMIN_PASS = 'admin@2026';
const ROWS_PER_PAGE = 15;

let allData = [];
let filteredData = [];
let currentPage = 1;
let currentTab = 'overview';

// ===========================
// UTILS
// ===========================
function getAllResponses() {
  try { return JSON.parse(localStorage.getItem(DB_KEY) || '[]'); } catch { return []; }
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
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
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
  const msgUint8 = new TextEncoder().encode(pass);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function checkPassword(input) {
  const expectedHash = await hashPassword(ADMIN_PASS);
  const inputHash = await hashPassword(input);
  return expectedHash === inputHash;
}

const LOCKOUT_KEY = 'admin_lockout';
const ATTEMPTS_KEY = 'admin_attempts';

function initLogin() {
  document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const pass = document.getElementById('adminPassword').value;
    const errEl = document.getElementById('loginError');
    
    // Check lockout
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
      document.getElementById('sidebar').classList.remove('open');
    });
  });

  document.getElementById('burgerBtn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  document.getElementById('btnLogout').addEventListener('click', () => {
    sessionStorage.removeItem('quiz_admin_auth');
    location.reload();
  });

  document.getElementById('btnRefresh').addEventListener('click', () => {
    loadAdminPanel();
    showToast('✅ Dados atualizados');
  });
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.getElementById(`nav-${tab}`).classList.add('active');
  document.getElementById(`tab-${tab}`).classList.add('active');
  const titles = { overview: 'Visão Geral', responses: 'Respostas', analytics: 'Analytics', export: 'Exportar dados' };
  document.getElementById('headerTitle').textContent = titles[tab] || '';
  if (tab === 'overview') renderOverview();
  if (tab === 'quizzes') renderQuizzes();
  if (tab === 'responses') renderResponses();
  if (tab === 'analytics') renderAnalytics();
  if (tab === 'export') renderExport();
}

// ===========================
// LOAD
// ===========================
function loadAdminPanel() {
  allData = getAllResponses().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  filteredData = [...allData];
  
  // Guarantee there is at least one default quiz if empty
  if (getQuizzes().length === 0) {
    createQuiz("Diagnóstico Spark MAXX");
  }

  switchTab(currentTab);
}

// ===========================
// MEUS QUIZZES (NOVO)
// ===========================
document.getElementById('btnCreateQuiz').addEventListener('click', () => {
  const name = prompt('Nome do novo quiz:', 'Novo Quiz');
  if (name) {
    createQuiz(name);
    renderQuizzes();
    showToast('✅ Quiz criado com sucesso!');
  }
});

function renderQuizzes() {
  const grid = document.getElementById('quizzesGrid');
  const quizzes = getQuizzes();
  
  if (quizzes.length === 0) {
    grid.innerHTML = '<p class="empty-state">Nenhum quiz encontrado.</p>';
    return;
  }

  grid.innerHTML = quizzes.map(q => `
    <div class="card" style="display:flex;flex-direction:column;gap:12px;">
      <h3 style="font-size:16px;color:var(--text-main);margin:0;">${q.name}</h3>
      <div style="font-size:12px;color:var(--text-muted);">
        <p style="margin:2px 0;">ID: <code>${q.id}</code></p>
        <p style="margin:2px 0;">Respostas: ${allData.filter(r => r.quiz_id === q.id).length}</p>
        <p style="margin:2px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${q.webhookUrl || 'Não configurado'}">Webhook: ${q.webhookUrl || 'Não configurado'}</p>
      </div>
      <div style="display:flex;gap:8px;margin-top:auto;flex-wrap:wrap;">
        <button class="btn-primary" style="flex:1;padding:8px;font-size:12px;" onclick="editQuiz('${q.id}')">Editar Fluxo</button>
        <button class="btn-secondary" style="flex:1;padding:8px;font-size:12px;" onclick="copyQuizLink('${q.id}')">Copiar Link</button>
        <button class="btn-secondary" style="padding:8px;font-size:12px;" onclick="configWebhook('${q.id}')" title="Configurar Webhook">🔗</button>
        <button class="btn-secondary" style="padding:8px;font-size:12px;" onclick="actionDuplicateQuiz('${q.id}')" title="Duplicar">📑</button>
        <button class="btn-danger" style="padding:8px;font-size:12px;" onclick="actionDeleteQuiz('${q.id}')" title="Excluir">✕</button>
      </div>
    </div>
  `).join('');
}

function editQuiz(id) {
  window.open(`builder.html?id=${id}`, '_blank');
}

function copyQuizLink(id) {
  const url = window.location.href.replace('admin.html', `index.html?id=${id}`);
  navigator.clipboard.writeText(url);
  showToast('✅ Link copiado!');
}

function configWebhook(id) {
  const quiz = getQuizById(id);
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
    duplicateQuiz(id);
    renderQuizzes();
    showToast('✅ Quiz duplicado!');
  }
}

function actionDeleteQuiz(id) {
  if (confirm('Tem certeza que deseja excluir este quiz? Isso não apaga as respostas já coletadas.')) {
    deleteQuiz(id);
    renderQuizzes();
    showToast('🗑️ Quiz excluído.');
  }
}

// ===========================
// OVERVIEW
// ===========================
function renderOverview() {
  const data = allData;
  document.getElementById('kpiTotal').textContent = data.length;
  document.getElementById('kpiToday').textContent = data.filter(r => isToday(r.timestamp)).length;

  const withTime = data.filter(r => r.duration_seconds > 0);
  document.getElementById('kpiAvgTime').textContent = withTime.length
    ? formatDuration(Math.round(withTime.reduce((s, r) => s + r.duration_seconds, 0) / withTime.length))
    : '—';

  const counts = profileCounts(data);
  const top = Object.entries(counts).sort((a,b) => b[1]-a[1])[0];
  document.getElementById('kpiTopProfile').textContent = top ? shortProfile(top[0]) : '—';

  // Profile distribution chart
  const chartEl = document.getElementById('profileChart');
  const total = data.length || 1;
  const profiles = ['Empresa / Marca', 'Agência de Publicidade/Marketing', 'Creator', 'Agência de Casting / Agenciador'];
  chartEl.innerHTML = profiles.map(p => {
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

  // Recent
  const recentEl = document.getElementById('recentList');
  const recent = data.slice(0, 5);
  recentEl.innerHTML = recent.length ? recent.map(r => `
    <div class="recent-item">
      <div class="recent-avatar">${getInitial(r.nome)}</div>
      <div class="recent-info">
        <div class="recent-name">${r.nome || '—'}</div>
        <div class="recent-meta">${r.empresa || ''} · ${formatDate(r.timestamp)}</div>
      </div>
      <span class="recent-badge">${shortResult(r.resultado_id) || shortProfile(r.perfil)}</span>
    </div>`).join('')
  : '<p style="color:var(--text-muted);font-size:13px;">Nenhuma resposta ainda.</p>';
}

// ===========================
// RESPONSES TABLE
// ===========================
function initResponseFilters() {
  document.getElementById('searchInput').addEventListener('input', applyFilters);
  document.getElementById('filterProfile').addEventListener('change', applyFilters);
  document.getElementById('filterDate').addEventListener('change', applyFilters);
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
  const total = filteredData.length;
  document.getElementById('tableCount').textContent = `${total} registro${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`;

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
      <td class="cell-name">${truncate(r.nome, 20)}</td>
      <td>${truncate(r.email, 24)}</td>
      <td>${r.celular || '—'}</td>
      <td>${truncate(r.empresa, 18)}</td>
      <td><span class="profile-pill">${shortProfile(r.perfil)}</span></td>
      <td title="${r.q2_resposta || ''}">${truncate(r.q2_resposta, 28)}</td>
      <td title="${r.q3_resposta || ''}">${truncate(r.q3_resposta, 28)}</td>
      <td><span class="profile-pill">${shortResult(r.resultado_id)}</span></td>
      <td>${formatDuration(r.duration_seconds)}</td>
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
  if (pages <= 1) { el.innerHTML = ''; return; }
  el.innerHTML = Array.from({ length: pages }, (_, i) => i + 1)
    .map(p => `<button class="page-btn${p === currentPage ? ' active' : ''}" onclick="goPage(${p})">${p}</button>`)
    .join('');
}

function goPage(p) { currentPage = p; renderResponses(); }

// ===========================
// DETAIL MODAL
// ===========================
function openDetail(id) {
  const r = allData.find(x => x.id === id);
  if (!r) return;

  const fields = [
    { label: 'ID', value: r.id },
    { label: 'Data/hora', value: formatDate(r.timestamp) },
    { label: 'Nome', value: r.nome },
    { label: 'E-mail', value: r.email },
    { label: 'Celular', value: r.celular },
    { label: 'Empresa', value: r.empresa },
    { label: 'Perfil', value: r.perfil },
    { label: 'Resposta Q2', value: r.q2_resposta },
    { label: 'Foco Q2', value: r.q2_hint },
    { label: 'Resposta Q3', value: r.q3_resposta },
    { label: 'Foco Q3', value: r.q3_hint },
    { label: 'Resultado', value: r.resultado_nome || shortResult(r.resultado_id) },
    { label: 'Duração', value: formatDuration(r.duration_seconds) },
    { label: 'Origem', value: r.referrer },
  ];

  document.getElementById('modalBody').innerHTML = fields
    .filter(f => f.value && f.value !== '—')
    .map(f => `
      <div class="modal-row">
        <span class="modal-row-label">${f.label}</span>
        <span class="modal-row-value">${f.value}</span>
      </div>`).join('');

  document.getElementById('modalOverlay').classList.add('open');
}

function initModal() {
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); }

function deleteRow(id) {
  if (!confirm('Excluir esta resposta? Esta ação não pode ser desfeita.')) return;
  localStorage.setItem(DB_KEY, JSON.stringify(getAllResponses().filter(r => r.id !== id)));
  loadAdminPanel();
  showToast('🗑️ Resposta excluída');
}

// ===========================
// ANALYTICS
// ===========================
function renderAnalytics() {
  const RESULT_IDS = ['community_discovery', 'sprout_social', 'monitoring_insights', 'cultural_influencer', 'professional_creator'];
  const HINT_LABELS = { discovery: '🔍 Descoberta', roi: '📊 ROI/Gestão', monitoring: '👁️ Monitoramento', cultural: '🎨 Cultural', professional: '💼 Profissional' };

  // 1. Distribuição dos 5 resultados
  const resultCounts = Object.fromEntries(RESULT_IDS.map(id => [id, 0]));
  allData.forEach(r => { if (r.resultado_id) resultCounts[r.resultado_id] = (resultCounts[r.resultado_id] || 0) + 1; });
  const maxR = Math.max(...Object.values(resultCounts), 1);
  const chartR = document.getElementById('chart-resultados');
  if (chartR) {
    chartR.innerHTML = RESULT_IDS.map(id => `
      <div class="bar-item">
        <span class="bar-label">${shortResult(id)}</span>
        <div class="bar-row">
          <div class="bar-track"><div class="bar-fill" style="width:${Math.round((resultCounts[id]/maxR)*100)}%"></div></div>
          <span class="bar-count">${resultCounts[id]}</span>
        </div>
      </div>`).join('');
  }

  // 2. Distribuição dos focos (hints) Q2 e Q3
  const q2c = {}, q3c = {};
  allData.forEach(r => {
    if (r.q2_hint) q2c[r.q2_hint] = (q2c[r.q2_hint] || 0) + 1;
    if (r.q3_hint) q3c[r.q3_hint] = (q3c[r.q3_hint] || 0) + 1;
  });

  const renderHintChart = (elId, counts) => {
    const el = document.getElementById(elId);
    if (!el) return;
    const sorted = Object.entries(counts).sort((a,b) => b[1]-a[1]);
    const max = sorted[0]?.[1] || 1;
    el.innerHTML = sorted.length ? sorted.map(([hint, count]) => `
      <div class="bar-item">
        <span class="bar-label">${HINT_LABELS[hint] || hint}</span>
        <div class="bar-row">
          <div class="bar-track"><div class="bar-fill" style="width:${Math.round((count/max)*100)}%"></div></div>
          <span class="bar-count">${count}</span>
        </div>
      </div>`).join('')
    : '<p style="color:var(--text-muted);font-size:13px;">Sem dados ainda</p>';
  };

  renderHintChart('chart-q2', q2c);
  renderHintChart('chart-q3', q3c);

  // 3. Distribuição por perfil
  const profileC = profileCounts(allData);
  const el4 = document.getElementById('chart-perfis');
  if (el4) {
    const allP = ['Empresa / Marca', 'Agência de Publicidade/Marketing', 'Creator', 'Agência de Casting / Agenciador'];
    const maxP = Math.max(...allP.map(p => profileC[p] || 0), 1);
    el4.innerHTML = allP.map(p => `
      <div class="bar-item">
        <span class="bar-label">${shortProfile(p)}</span>
        <div class="bar-row">
          <div class="bar-track"><div class="bar-fill" style="width:${Math.round(((profileC[p]||0)/maxP)*100)}%"></div></div>
          <span class="bar-count">${profileC[p] || 0}</span>
        </div>
      </div>`).join('');
  }

  renderTimeline();
}

function renderTimeline() {
  const days = 14;
  const buckets = {};
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    buckets[d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })] = 0;
  }
  allData.forEach(r => {
    if (!r.timestamp) return;
    const key = new Date(r.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    if (key in buckets) buckets[key]++;
  });
  const entries = Object.entries(buckets);
  const max = Math.max(...entries.map(([,v]) => v), 1);
  document.getElementById('timelineChart').innerHTML = entries.map(([label, count]) => `
    <div class="timeline-col">
      <div class="timeline-bar" style="height:${Math.max(Math.round((count/max)*100), 4)}px;" title="${count}"></div>
      <span class="timeline-label">${label}</span>
    </div>`).join('');
}

// ===========================
// EXPORT
// ===========================
function renderExport() {
  const data = allData.slice(0, 10);
  const cols = ['#', 'Nome', 'Email', 'Celular', 'Empresa', 'Perfil', 'Q2 Resposta', 'Q3 Resposta', 'Resultado', 'Duração', 'Data'];
  document.getElementById('previewHead').innerHTML = `<tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr>`;
  document.getElementById('previewBody').innerHTML = !data.length
    ? '<tr><td colspan="11" style="text-align:center;color:var(--text-muted);padding:32px;">Sem dados</td></tr>'
    : data.map((r, i) => `<tr>
        <td>${i+1}</td><td>${r.nome||''}</td><td>${r.email||''}</td><td>${r.celular||''}</td>
        <td>${r.empresa||''}</td><td>${shortProfile(r.perfil)}</td>
        <td>${truncate(r.q2_resposta||'', 30)}</td><td>${truncate(r.q3_resposta||'', 30)}</td>
        <td>${shortResult(r.resultado_id)}</td><td>${formatDuration(r.duration_seconds)}</td><td>${formatDate(r.timestamp)}</td>
      </tr>`).join('');
}

function getCSV(data) {
  const headers = ['ID','Nome','Email','Celular','Empresa','Perfil','Q2_Resposta','Q2_Foco','Q3_Resposta','Q3_Foco','Resultado_ID','Resultado_Nome','Duracao_s','Data_hora','Referrer'];
  const rows = data.map(r => [
    r.id, r.nome, r.email, r.celular, r.empresa, r.perfil,
    r.q2_resposta, r.q2_hint, r.q3_resposta, r.q3_hint,
    r.resultado_id, r.resultado_nome, r.duration_seconds, r.timestamp, r.referrer
  ].map(v => `"${String(v||'').replace(/"/g,'""')}"`).join(','));
  return [headers.join(','), ...rows].join('\r\n');
}

function downloadFile(content, filename, mime) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type: mime }));
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function initExport() {
  document.getElementById('btnExportCSV').addEventListener('click', () => {
    downloadFile('\uFEFF' + getCSV(allData), `quiz-${new Date().toISOString().slice(0,10)}.csv`, 'text/csv;charset=utf-8;');
    showToast('✅ CSV baixado!');
  });
  document.getElementById('btnExportJSON').addEventListener('click', () => {
    downloadFile(JSON.stringify(allData, null, 2), `quiz-${new Date().toISOString().slice(0,10)}.json`, 'application/json');
    showToast('✅ JSON baixado!');
  });
  document.getElementById('btnCopyClipboard').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(getCSV(allData)); showToast('📋 CSV copiado!'); }
    catch { showToast('❌ Erro ao copiar'); }
  });
  document.getElementById('btnClearAll').addEventListener('click', () => {
    if (!confirm('⚠️ Apagar TODOS os dados permanentemente?')) return;
    if (!confirm('Última confirmação — isso é irreversível.')) return;
    localStorage.removeItem(DB_KEY);
    loadAdminPanel();
    showToast('🗑️ Dados apagados');
  });
}

// ===========================
// SEED DEMO DATA (5 results)
// ===========================
function seedDemoData() {
  if (getAllResponses().length > 0) return;

  const profiles = ['Empresa / Marca', 'Agência de Publicidade/Marketing', 'Creator', 'Agência de Casting / Agenciador'];
  const resultMatrix = [
    { resultado_id: 'community_discovery', resultado_nome: 'Community Discovery', q2_hint: 'discovery', q3_hint: 'discovery' },
    { resultado_id: 'sprout_social', resultado_nome: 'Sprout Social', q2_hint: 'roi', q3_hint: 'roi' },
    { resultado_id: 'monitoring_insights', resultado_nome: 'Monitoring & Insights', q2_hint: 'monitoring', q3_hint: 'monitoring' },
    { resultado_id: 'cultural_influencer', resultado_nome: 'Cultural Influencer', q2_hint: 'cultural', q3_hint: 'cultural' },
    { resultado_id: 'professional_creator', resultado_nome: 'Professional Creator', q2_hint: 'professional', q3_hint: 'professional' },
  ];
  const nomes = ['Ana Souza','Carlos Lima','Beatriz Costa','Fernando Alves','Juliana Mendes','Rafael Torres','Mariana Oliveira','Lucas Nunes','Patricia Ramos','Diego Ferreira','Camila Santos','André Pereira'];
  const empresas = ['Natura','Vivo','Magazine Luiza','iFood','Boticário','Ambev','Itaú','Stone','Nubank','Renner','Casas Bahia','PicPay'];

  const demo = nomes.map((nome, i) => {
    const profile = profiles[i % 4];
    const res = resultMatrix[i % 5];
    const d = new Date();
    d.setDate(d.getDate() - Math.floor(Math.random() * 14));
    return {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2,6) + i,
      timestamp: d.toISOString(),
      duration_seconds: Math.floor(Math.random() * 180) + 45,
      nome, email: `${nome.split(' ')[0].toLowerCase()}@email.com`,
      celular: `(11) 9${Math.floor(Math.random()*9000+1000)}-${Math.floor(Math.random()*9000+1000)}`,
      empresa: empresas[i], perfil: profile,
      q2_resposta: `Prioridade relacionada a ${res.q2_hint}`,
      q2_hint: res.q2_hint,
      q3_resposta: `Métrica relacionada a ${res.q3_hint}`,
      q3_hint: res.q3_hint,
      resultado_id: res.resultado_id,
      resultado_nome: res.resultado_nome,
      referrer: 'direto'
    };
  });
  localStorage.setItem(DB_KEY, JSON.stringify(demo));
}

// ===========================
// INIT
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  seedDemoData();
  initLogin();
  initNavigation();
  initResponseFilters();
  initModal();
  initExport();
});

window.openDetail = openDetail;
window.deleteRow = deleteRow;
window.goPage = goPage;
