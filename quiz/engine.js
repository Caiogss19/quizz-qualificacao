// Dependencies loaded globally via quiz.html scripts

const DOM = {
  quizCard:    document.getElementById('quizCard'),
  progressBar: document.getElementById('progressBar'),
  stepCount:   document.getElementById('stepCount'),
};

// Metric data per result (shown in result chrome card)
const RESULT_METRICS = {
  community_discovery: { metric: '+100',   metricLabel: 'comunidades mapeadas', tag: 'Dados',        short: 'Mapeamento de comunidades digitais' },
  sprout_social:       { metric: '+1200',  metricLabel: 'campanhas geridas',    tag: 'Operação',     short: 'End-to-end de campanhas de influência' },
  monitoring_insights: { metric: '+35%',   metricLabel: 'em publis fechadas',   tag: 'Reputação',    short: 'Monitoramento e insights de marca' },
  cultural_influencer: { metric: '+3x',    metricLabel: 'em contratos',         tag: 'Creator',      short: 'Fit cultural e posicionamento' },
  professional_creator:{ metric: '+2x',    metricLabel: 'em negociações',       tag: 'Profissional', short: 'Performance e profissionalização' },
};

// Step counter config
const STEP_MAP = {
  start:      { pct: 5,   num: 1 },
  perfil:     { pct: 25,  num: 2 },
  q2_empresa: { pct: 42,  num: 3 },
  q2_agencia: { pct: 42,  num: 3 },
  q2_creator: { pct: 42,  num: 3 },
  q2_casting: { pct: 42,  num: 3 },
  q3_empresa: { pct: 62,  num: 4 },
  q3_agencia: { pct: 62,  num: 4 },
  q3_creator: { pct: 62,  num: 4 },
  q3_casting: { pct: 62,  num: 4 },
  analyzing:  { pct: 85,  num: 5 },
  result:     { pct: 100, num: 6 },
};

function applyBranding() {
  const branding = JSON.parse(localStorage.getItem('sparkmaxx_branding') || '{}');
  if (branding.primaryColor) {
    document.documentElement.style.setProperty('--primary-color', branding.primaryColor);
  }
  if (branding.favicon) {
    let link = document.querySelector("link[rel*='icon']");
    if (!link) { link = document.createElement('link'); link.rel = 'shortcut icon'; document.head.appendChild(link); }
    link.href = branding.favicon;
  }
}

let activeQuiz = null;

function initQuiz() {
  applyBranding();
  const urlParams = new URLSearchParams(window.location.search);
  const quizId = urlParams.get('id');

  let quizzes = [];
  try { quizzes = JSON.parse(localStorage.getItem('sparkmaxx_quizzes') || '[]'); } catch(e) {}

  activeQuiz = quizzes.find(q => q.id === quizId);
  if (!activeQuiz) {
    if (quizzes.length > 0) activeQuiz = quizzes[0];
    else activeQuiz = { id: quizJSON.id, name: quizJSON.title, webhookUrl: '', nodes: quizJSON.nodes, results: quizJSON.results };
  }

  document.title = activeQuiz.name;
  resetState();

  state.utms = {
    source:   urlParams.get('utm_source') || '',
    medium:   urlParams.get('utm_medium') || '',
    campaign: urlParams.get('utm_campaign') || '',
    content:  urlParams.get('utm_content') || '',
    term:     urlParams.get('utm_term') || '',
  };

  if (typeof incrementAnalytics === 'function' && activeQuiz) {
    incrementAnalytics(activeQuiz.id, 'views');
  }

  renderNode(state.currentNodeId);
}

function renderNode(nodeId) {
  const node = activeQuiz.nodes[nodeId];
  if (!node) {
    alert(`Erro: O fluxo tentou ir para um nó que foi deletado (ID: ${nodeId}). Por favor, edite o quiz e arrume as conexões.`);
    return;
  }

  state.currentNodeId = nodeId;
  updateProgress(nodeId);

  DOM.quizCard.innerHTML = '';

  const stepEl = document.createElement('div');
  stepEl.className = 'step active';
  stepEl.id = `node-${nodeId}`;

  if (node.type === 'lead_form') {
    stepEl.appendChild(renderLeadForm(node));
  } else if (node.type === 'question') {
    stepEl.appendChild(renderQuestion(node));
  } else if (node.type === 'loading') {
    stepEl.appendChild(renderLoading(node));
    setTimeout(() => goToNode(node.next), node.duration || 2400);
  } else if (node.type === 'result') {
    if (!state.resultadoId) {
      state.completedAt = Date.now();
      state.resultadoId = node.id;

      const responseData = {
        event:        'quiz_completed',
        quiz_id:      activeQuiz.id,
        quiz_name:    activeQuiz.name,
        completed_at: new Date().toISOString(),
        lead:         state.lead,
        answers:      getAnswers(),
        total_score:  state.totalScore,
        result_id:    state.resultadoId,
        result_title: node.title,
        utms:         state.utms,
        user_agent:   navigator.userAgent,
        url_origem:   window.location.href,
      };

      saveResponse(responseData);
      sendWebhook(responseData);
      if (typeof incrementAnalytics === 'function' && activeQuiz) {
        incrementAnalytics(activeQuiz.id, 'completions');
      }
    }
    stepEl.appendChild(renderResult(node));
  }

  DOM.quizCard.appendChild(stepEl);
}

function updateProgress(nodeId) {
  const s = STEP_MAP[nodeId] || { pct: 0, num: 1 };
  if (DOM.progressBar) DOM.progressBar.style.width = s.pct + '%';
  if (DOM.stepCount)   DOM.stepCount.textContent = s.num + ' / 6 · Diagnóstico';
}

function goToNode(nodeId) {
  if (!nodeId) {
    alert('Erro: O fluxo parou aqui porque este botão não está conectado a nenhuma próxima etapa no Builder. Por favor, edite o quiz e crie uma conexão.');
    return;
  }
  pushHistory(state.currentNodeId);
  renderNode(nodeId);
}

function goBack() {
  const prevId = popHistory();
  if (prevId) renderNode(prevId);
}

// ── RENDERERS ─────────────────────────────────────────────────────

function renderLeadForm(node) {
  const container = document.createElement('div');

  // Build form fields — group celular + empresa side-by-side if 4 fields
  let fieldsHtml = '';
  if (node.fields.length === 4) {
    const [f0, f1, f2, f3] = node.fields;
    fieldsHtml = `
      ${fieldHtml(f0)}
      ${fieldHtml(f1)}
      <div class="field-grid-2">
        ${fieldHtml(f2)}
        ${fieldHtml(f3)}
      </div>
    `;
  } else {
    fieldsHtml = node.fields.map(fieldHtml).join('');
  }

  container.innerHTML = `
    <div class="lead-hero">
      <img src="assets/cube-hero.webp" alt="" />
    </div>
    <div class="step-header">
      <div class="sm-tag">Diagnóstico · 2 min</div>
      <h1 class="quiz-title">
        Descubra a solução <em>ideal</em><br/>para a sua operação.
      </h1>
      <p class="quiz-subtitle">
        Um diagnóstico técnico da sua estratégia de influência — baseado em <em>dados reais</em>, não em achismo.
      </p>
    </div>
    <form class="lead-form" id="leadForm" novalidate>
      ${fieldsHtml}
      <button type="submit" class="btn-primary" id="btnStart" style="margin-top:8px;">
        ${node.buttonText || 'Começar diagnóstico'}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </button>
      <p style="text-align:center; font-family:var(--font-mono); font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:var(--fg-3); margin:8px 0 0;">
        Leva menos de 2 minutos · sem spam
      </p>
    </form>
  `;

  setTimeout(() => {
    const form = document.getElementById('leadForm');
    const celularInput = document.getElementById('celular');

    if (celularInput) {
      celularInput.addEventListener('input', function() {
        let v = this.value.replace(/\D/g, '').substr(0, 11);
        if (v.length > 6) v = `(${v.substr(0,2)}) ${v.substr(2,5)}-${v.substr(7)}`;
        else if (v.length > 2) v = `(${v.substr(0,2)}) ${v.substr(2)}`;
        else if (v.length > 0) v = `(${v}`;
        this.value = v;
      });
    }

    const emailInput = document.getElementById('email');
    if (emailInput) {
      emailInput.addEventListener('blur', () => {
        const val = emailInput.value.trim();
        if (!val) return;
        const responses = getAllResponses();
        const found = responses.find(r => r.email === val);
        if (found) {
          let btn = document.getElementById('btnPreviousResult');
          if (!btn) {
            btn = document.createElement('button');
            btn.id = 'btnPreviousResult';
            btn.className = 'btn-secondary';
            btn.style.cssText = 'margin-top:10px; width:100%; border:1px solid var(--border-2); border-radius:var(--radius-pill); padding:12px;';
            btn.textContent = 'E-mail já cadastrado — ver resultado anterior';
            btn.type = 'button';
            btn.onclick = () => {
              state.resultadoId = found.resultado_id;
              goToNode('result');
            };
            form.appendChild(btn);
          }
        }
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateLeadForm(node.fields)) return;
        const data = {};
        node.fields.forEach(f => { data[f.id] = document.getElementById(f.id).value.trim(); });
        setLeadData(data);
        if (typeof incrementAnalytics === 'function' && activeQuiz) {
          incrementAnalytics(activeQuiz.id, 'leads');
        }
        goToNode(node.next);
      });
    }
  }, 0);

  return container;
}

function fieldHtml(f) {
  return `
    <div class="form-group">
      <label for="${f.id}">${f.label}</label>
      <input type="${f.type}" id="${f.id}" name="${f.id}" placeholder="${f.placeholder}" ${f.required ? 'required' : ''} autocomplete="${f.type === 'email' ? 'email' : 'off'}" />
      <span class="field-error" id="${f.id}-error"></span>
    </div>
  `;
}

function renderQuestion(node) {
  const container = document.createElement('div');

  container.innerHTML = `
    <div class="step-tag">${node.tag || 'Pergunta'}</div>
    <h2 class="step-title">${node.title}</h2>
    <p class="step-subtitle">${node.subtitle}</p>
    <div class="options-grid" id="options-${node.id}">
      ${node.options.map((opt, i) => `
        <button class="option-card" data-idx="${i}" type="button">
          <span class="option-letter">${'ABCDE'[i] || String(i+1)}</span>
          <span class="option-text">${opt.text}</span>
        </button>
      `).join('')}
    </div>
    <div class="step-nav">
      <button class="btn-secondary" id="back-${node.id}" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Voltar
      </button>
      <button class="btn-primary" id="next-${node.id}" disabled type="button">
        Continuar
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </button>
    </div>
  `;

  setTimeout(() => {
    const options = container.querySelectorAll('.option-card');
    const nextBtn = document.getElementById(`next-${node.id}`);
    const backBtn = document.getElementById(`back-${node.id}`);
    let selectedValue = null, selectedNext = null, selectedHint = null;

    options.forEach((opt, idx) => {
      opt.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        const dataOpt = node.options[idx];
        selectedValue = dataOpt.value || dataOpt.text;
        selectedNext  = dataOpt.next;
        selectedHint  = dataOpt.hint;
        nextBtn.disabled = false;
      });
    });

    nextBtn.addEventListener('click', () => {
      if (!selectedValue) return;
      const dataOpt = node.options.find(o => (o.value || o.text) === selectedValue);
      saveAnswer(node.varName || node.id, selectedValue, selectedHint, dataOpt ? dataOpt.score : 0);
      goToNode(selectedNext);
    });

    backBtn.addEventListener('click', () => goBack());
  }, 0);

  return container;
}

function renderLoading(node) {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="analyzing-container">
      <div class="sm-tag" style="margin-bottom:16px;">Processando</div>
      <div class="analyzing-image">
        <img src="assets/cubes-multi.webp" alt="" />
      </div>
      <h2 class="analyzing-title">${node.title || 'Analisando seu perfil…'}</h2>
      <p class="analyzing-text" id="analyzingPhase">Lendo seu perfil</p>
      <div class="analyzing-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;

  // Cycle through phases
  const phases = ['Lendo seu perfil', 'Cruzando com dados de mercado', 'Selecionando sua solução'];
  let phaseIdx = 0;
  const phaseEl = container.querySelector('#analyzingPhase');
  const phaseTimer = setInterval(() => {
    phaseIdx = Math.min(phaseIdx + 1, phases.length - 1);
    if (phaseEl) phaseEl.textContent = phases[phaseIdx];
  }, 700);

  setTimeout(() => clearInterval(phaseTimer), node.duration || 2400);

  return container;
}

function computeResultData(node) {
  // Tally hints to determine which result profile to show
  const hintCount = {};
  (state.hints || []).forEach(h => {
    if (h) hintCount[h] = (hintCount[h] || 0) + 1;
  });

  const hintToResultId = {
    discovery:    'community_discovery',
    roi:          'sprout_social',
    monitoring:   'monitoring_insights',
    cultural:     'cultural_influencer',
    professional: 'professional_creator',
  };

  const topHint = Object.entries(hintCount).sort((a, b) => b[1] - a[1])[0]?.[0];
  const resultId = hintToResultId[topHint];

  const resultsSource = (activeQuiz.results) || (quizJSON && quizJSON.results) || {};
  if (resultId && resultsSource[resultId]) {
    return { ...resultsSource[resultId], _metricId: resultId };
  }

  return { ...node, _metricId: null };
}

function renderResult(node) {
  const container = document.createElement('div');
  const resultData = computeResultData(node);
  const metricData = RESULT_METRICS[resultData._metricId] || null;

  // Build solutions list
  const solutionsHtml = (resultData.solutions || []).map(s => `
    <div class="solution-card">
      <span class="solution-check">
        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      </span>
      <span class="solution-name">${s.name || s.desc || ''}</span>
    </div>
  `).join('');

  // Metric card (shown if we have metric data)
  const metricHtml = metricData ? `
    <div class="result-metric">
      <div class="result-metric-value">${metricData.metric}</div>
      <div class="result-metric-info">
        <div class="result-metric-tag">${metricData.tag}</div>
        <div class="result-metric-label">${metricData.metricLabel}</div>
        <div class="result-metric-sub">${metricData.short}</div>
      </div>
    </div>
  ` : '';

  const firstName = (state.lead && state.lead.nome) ? state.lead.nome.split(' ')[0] : 'você';

  container.innerHTML = `
    <div class="result-container">
      <div class="result-hero">
        <img src="assets/sphere-orb.png" alt="" />
      </div>

      <div class="result-badge">Seu diagnóstico · ${firstName}</div>

      <div class="result-head">
        <div class="result-label">Solução recomendada</div>
        <h2 class="result-title">${resultData.title || 'Resultado'}</h2>
        <p class="result-description">${resultData.description || ''}</p>
      </div>

      ${metricHtml}

      ${solutionsHtml ? `<div class="result-solutions">${solutionsHtml}</div>` : ''}

      <div class="result-cta">
        <a href="${resultData.url || '#'}" class="btn-cta" target="_blank" rel="noopener">
          ${resultData.cta || 'Agendar reunião com o time Spark Maxx'}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
        </a>
        <button class="btn-restart" id="btnRestart" type="button">Refazer diagnóstico</button>
      </div>
    </div>
  `;

  setTimeout(() => {
    const btn = document.getElementById('btnRestart');
    if (btn) btn.addEventListener('click', () => initQuiz());
  }, 0);

  return container;
}

// Start
document.addEventListener('DOMContentLoaded', () => {
  if (DOM.quizCard) initQuiz();
});
