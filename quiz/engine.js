// Dependencies loaded globally via index.html scripts

const DOM = {
  quizCard: document.getElementById('quizCard'),
  progressBar: document.getElementById('progressBar')
};

// Escape HTML para prevenir XSS em conteúdo dinâmico (quizzes editáveis e branding)
function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function applyBranding() {
  const branding = JSON.parse(localStorage.getItem('sparkmaxx_branding') || '{}');

  if (branding.primaryColor) {
    document.documentElement.style.setProperty('--primary-color', branding.primaryColor);
  }

  const headerLogo = document.querySelector('.quiz-header .logo');
  if (headerLogo && branding.logo) {
    headerLogo.innerHTML = '';
    const img = document.createElement('img');
    img.src = branding.logo;
    img.alt = 'Logo';
    img.style.maxHeight = '40px';
    img.style.width = 'auto';
    headerLogo.appendChild(img);
  }

  if (branding.favicon) {
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'shortcut icon';
      document.head.appendChild(link);
    }
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
  
  // Coletar UTMs e referências
  state.utms = {
    source: urlParams.get('utm_source') || '',
    medium: urlParams.get('utm_medium') || '',
    campaign: urlParams.get('utm_campaign') || '',
    content: urlParams.get('utm_content') || '',
    term: urlParams.get('utm_term') || ''
  };

  if (typeof incrementAnalytics === 'function' && activeQuiz) {
    incrementAnalytics(activeQuiz.id, 'views');
  }

  renderNode(state.currentNodeId);
}

function renderNode(nodeId) {
  const stepEl = document.createElement('div');
  stepEl.className = 'step active';
  
  const node = activeQuiz.nodes[nodeId];
  if (!node) {
    alert(`Erro: O fluxo tentou ir para um nó que foi deletado (ID: ${nodeId}). Por favor, edite o quiz e arrume as conexões.`);
    return;
  }

  state.currentNodeId = nodeId;
  updateProgress(nodeId);

  DOM.quizCard.innerHTML = '';
  
  stepEl.id = `node-${nodeId}`;

  if (node.type === 'lead_form') {
    stepEl.appendChild(renderLeadForm(node));
  } else if (node.type === 'question') {
    stepEl.appendChild(renderQuestion(node));
  } else if (node.type === 'loading') {
    stepEl.appendChild(renderLoading(node));
    setTimeout(() => {
      goToNode(node.next);
    }, node.duration || 2400);
  } else if (node.type === 'result') {
    if (!state.resultadoId) {
      state.completedAt = Date.now();
      state.resultadoId = node.id;
      
      const responseData = {
        // Metadados
        event: "quiz_completed",
        quiz_id: activeQuiz.id,
        quiz_name: activeQuiz.name,
        completed_at: new Date().toISOString(),
        
        // Dados do Lead
        lead: state.lead,
        
        // Respostas (Mapeadas)
        answers: getAnswers(),
        total_score: state.totalScore,
        
        // Resultado Final
        result_id: state.resultadoId,
        result_title: node.title,
        
        // Rastreadores (Analytics)
        utms: state.utms,
        user_agent: navigator.userAgent,
        url_origem: window.location.href
      };

      // Auto-save the response
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
  // Cálculo dinâmico baseado no tipo do nó atual e profundidade do histórico.
  // Funciona para qualquer fluxo customizado, não só o quiz default.
  const node = activeQuiz && activeQuiz.nodes ? activeQuiz.nodes[nodeId] : null;
  let pct = 0;

  if (node) {
    if (node.type === 'lead_form') {
      pct = 5;
    } else if (node.type === 'result') {
      pct = 100;
    } else if (node.type === 'loading') {
      pct = 95;
    } else {
      // Para questions, estima posição com base no histórico vs total de nós.
      const totalNodes = Object.keys(activeQuiz.nodes).length || 1;
      const stepsTaken = (state.history ? state.history.length : 0) + 1;
      pct = Math.min(90, Math.round((stepsTaken / totalNodes) * 100));
    }
  }

  if (DOM.progressBar) DOM.progressBar.style.width = pct + '%';
}

function goToNode(nodeId) {
  if (!nodeId) {
    alert("Erro: O fluxo parou aqui porque este botão não está conectado a nenhuma próxima etapa no Builder. Por favor, edite o quiz e crie uma conexão.");
    return;
  }
  pushHistory(state.currentNodeId);
  renderNode(nodeId);
}

function goBack() {
  const prevId = popHistory();
  if (prevId) {
    // Need to reset some state if needed, or simply render
    renderNode(prevId);
  }
}

// =======================
// RENDERERS
// =======================

function renderLeadForm(node) {
  const container = document.createElement('div');
  const fields = Array.isArray(node.fields) ? node.fields : [];
  container.innerHTML = `
    <div class="step-tag">Identificação</div>
    <h1 class="step-title">${escapeHtml(node.title)}</h1>
    <p class="step-subtitle">${escapeHtml(node.subtitle)}</p>
    <form class="lead-form" id="leadForm" novalidate>
      ${fields.map(f => `
        <div class="form-group">
          <label for="${escapeHtml(f.id)}">${escapeHtml(f.label)}</label>
          <input type="${escapeHtml(f.type || 'text')}" id="${escapeHtml(f.id)}" name="${escapeHtml(f.id)}" placeholder="${escapeHtml(f.placeholder || '')}" ${f.required ? 'required' : ''} />
          <span class="field-error" id="${escapeHtml(f.id)}-error"></span>
        </div>
      `).join('')}
      <button type="submit" class="btn-primary" id="btnStart">
        ${escapeHtml(node.buttonText || 'Continuar')}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </button>
    </form>
  `;

  // Attach events after rendering
  setTimeout(() => {
    const form = document.getElementById('leadForm');
    const celularInput = document.getElementById('celular');
    
    if (celularInput) {
      celularInput.addEventListener('input', function() {
        let v = this.value.replace(/\D/g, '').substring(0, 11);
        if (v.length > 10) v = `(${v.substring(0,2)}) ${v.substring(2,7)}-${v.substring(7)}`;
        else if (v.length > 6) v = `(${v.substring(0,2)}) ${v.substring(2,6)}-${v.substring(6)}`;
        else if (v.length > 2) v = `(${v.substring(0,2)}) ${v.substring(2)}`;
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
            btn.style.marginTop = '10px';
            btn.style.width = '100%';
            btn.textContent = 'E-mail já cadastrado. Ver resultado anterior';
            btn.type = 'button';
            btn.onclick = () => {
              state.resultadoId = found.result_id || found.resultado_id;
              goToNode(state.resultadoId || 'result');
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
        node.fields.forEach(f => {
          data[f.id] = document.getElementById(f.id).value.trim();
        });
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

function renderQuestion(node) {
  const container = document.createElement('div');
  const options = Array.isArray(node.options) ? node.options : [];
  let selectedValue = null;
  let selectedNext = null;
  let selectedHint = null;
  let selectedScore = 0;

  container.innerHTML = `
    <div class="step-tag">${escapeHtml(node.tag || 'Pergunta')}</div>
    <h2 class="step-title">${escapeHtml(node.title)}</h2>
    <p class="step-subtitle">${escapeHtml(node.subtitle)}</p>
    <div class="options-grid" id="options-${escapeHtml(node.id)}">
      ${options.map((opt, i) => `
        <button class="option-card" data-idx="${i}">
          ${opt.icon ? `<span class="option-letter">${'ABCDE'[i] || ''}</span><span class="option-icon">${escapeHtml(opt.icon)}</span>` : ''}
          <span class="option-text">${escapeHtml(opt.text)}</span>
        </button>
      `).join('')}
    </div>
    <div class="step-nav">
      <button class="btn-secondary" id="back-${escapeHtml(node.id)}">← Voltar</button>
      <button class="btn-primary" id="next-${escapeHtml(node.id)}" disabled>Continuar →</button>
    </div>
  `;

  setTimeout(() => {
    const optionEls = container.querySelectorAll('.option-card');
    const nextBtn = document.getElementById(`next-${node.id}`);
    const backBtn = document.getElementById(`back-${node.id}`);

    optionEls.forEach((opt, idx) => {
      opt.addEventListener('click', () => {
        optionEls.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        const dataOpt = options[idx];
        if (!dataOpt) return;
        selectedValue = dataOpt.value || dataOpt.text;
        selectedNext = dataOpt.next;
        selectedHint = dataOpt.hint;
        selectedScore = parseInt(dataOpt.score) || 0;
        if (nextBtn) nextBtn.disabled = false;
      });
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (!selectedValue) return;
        saveAnswer(node.varName || node.id, selectedValue, selectedHint, selectedScore);
        goToNode(selectedNext);
      });
    }

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        goBack();
      });
    }
  }, 0);

  return container;
}

function renderLoading(node) {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="analyzing-container">
      <div class="analyzing-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <h2 class="analyzing-title">${escapeHtml(node.title)}</h2>
      <p class="analyzing-text">${escapeHtml(node.subtitle)}</p>
      <div class="analyzing-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;
  return container;
}

function renderResult(node) {
  const container = document.createElement('div');
  const resultData = node;

  if (!resultData) return container;

  // Sanitiza URL do CTA: aceita apenas http(s) ou anchors para evitar javascript:
  let ctaUrl = resultData.url || '#';
  if (ctaUrl !== '#' && !/^https?:\/\//i.test(ctaUrl) && !ctaUrl.startsWith('/')) {
    ctaUrl = '#';
  }

  const solutions = Array.isArray(resultData.solutions) ? resultData.solutions : [];

  container.innerHTML = `
    <div class="result-container">
      <div class="result-badge">${escapeHtml(resultData.badge || '🎉 Seu resultado')}</div>
      <h2 class="result-title">${escapeHtml(resultData.title || 'Resultado')}</h2>
      <p class="result-description">${escapeHtml(resultData.description || 'Baseado nas suas respostas, este é o seu perfil.')}</p>
      <div class="result-solutions">
        ${solutions.map(s => `
          <div class="solution-card">
            <div class="solution-icon">${escapeHtml(s.icon || '✅')}</div>
            <div class="solution-info"><h3>${escapeHtml(s.name || '')}</h3><p>${escapeHtml(s.desc || '')}</p></div>
          </div>
        `).join('')}
      </div>
      <div class="result-cta">
        <a href="${escapeHtml(ctaUrl)}" class="btn-cta" target="_blank" rel="noopener noreferrer">
          ${escapeHtml(resultData.cta || 'Conhecer Solução')}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
        <button class="btn-restart" id="btnRestart">Refazer diagnóstico</button>
      </div>
    </div>
  `;

  setTimeout(() => {
    document.getElementById('btnRestart').addEventListener('click', () => {
      initQuiz();
    });
  }, 0);

  return container;
}

// Start the quiz automatically
document.addEventListener('DOMContentLoaded', () => {
  if (DOM.quizCard) {
    initQuiz();
  }
});
