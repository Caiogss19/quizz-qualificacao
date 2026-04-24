import { state, setLeadData, saveAnswer, getAnswers, pushHistory, popHistory, resetState } from '../core/state.js';
import { saveResponse, getAllResponses } from '../core/storage.js';
import { validateLeadForm } from './validation.js';
import { calculateResult, getResultData } from './results.js';
import { quizJSON } from './config.js';
import { sendWebhook } from '../admin/webhook.js';

const DOM = {
  quizCard: document.getElementById('quizCard'),
  progressBar: document.getElementById('progressBar')
};

export function initQuiz() {
  resetState();
  renderNode(state.currentNodeId);
}

function renderNode(nodeId) {
  const node = quizJSON.nodes[nodeId];
  if (!node) return console.error('Node not found:', nodeId);
  
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
    setTimeout(() => {
      goToNode(node.next);
    }, node.duration || 2400);
  } else if (node.type === 'result') {
    if (!state.resultadoId) {
      state.completedAt = Date.now();
      state.resultadoId = calculateResult();
      
      const responseData = {
        ...state.lead,
        ...getAnswers(),
        resultado_id: state.resultadoId,
        user_agent: navigator.userAgent,
        url_origem: window.location.href
      };

      // Auto-save the response
      saveResponse(responseData);
      sendWebhook(responseData);
    }

    stepEl.appendChild(renderResult(node));
  }

  DOM.quizCard.appendChild(stepEl);
}

function updateProgress(nodeId) {
  // Simple heuristic: lead_form=0%, result=100%, question=~based on position
  // But a dynamic flow makes it hard. Let's just step it up roughly.
  let pct = 0;
  if (state.currentNodeId === 'start') pct = 0;
  else if (state.currentNodeId === 'perfil') pct = 20;
  else if (state.currentNodeId.startsWith('q2')) pct = 50;
  else if (state.currentNodeId.startsWith('q3')) pct = 80;
  else if (state.currentNodeId === 'analyzing') pct = 95;
  else if (state.currentNodeId === 'result') pct = 100;
  
  if (DOM.progressBar) DOM.progressBar.style.width = pct + '%';
}

function goToNode(nodeId) {
  if (!nodeId) return;
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
  container.innerHTML = `
    <div class="step-tag">Identificação</div>
    <h1 class="step-title">${node.title}</h1>
    <p class="step-subtitle">${node.subtitle}</p>
    <form class="lead-form" id="leadForm" novalidate>
      ${node.fields.map(f => `
        <div class="form-group">
          <label for="${f.id}">${f.label}</label>
          <input type="${f.type}" id="${f.id}" name="${f.id}" placeholder="${f.placeholder}" ${f.required ? 'required' : ''} />
          <span class="field-error" id="${f.id}-error"></span>
        </div>
      `).join('')}
      <button type="submit" class="btn-primary" id="btnStart">
        ${node.buttonText}
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
            btn.style.marginTop = '10px';
            btn.style.width = '100%';
            btn.textContent = 'E-mail já cadastrado. Ver resultado anterior';
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
        node.fields.forEach(f => {
          data[f.id] = document.getElementById(f.id).value.trim();
        });
        setLeadData(data);
        goToNode(node.next);
      });
    }
  }, 0);

  return container;
}

function renderQuestion(node) {
  const container = document.createElement('div');
  let selectedValue = null;
  let selectedNext = null;
  let selectedHint = null;
  
  container.innerHTML = `
    <div class="step-tag">${node.tag || 'Pergunta'}</div>
    <h2 class="step-title">${node.title}</h2>
    <p class="step-subtitle">${node.subtitle}</p>
    <div class="options-grid" id="options-${node.id}">
      ${node.options.map((opt, i) => `
        <button class="option-card" data-idx="${i}">
          ${opt.icon ? `<span class="option-letter">${'ABCDE'[i] || ''}</span><span class="option-icon">${opt.icon}</span>` : ''}
          <span class="option-text">${opt.text}</span>
        </button>
      `).join('')}
    </div>
    <div class="step-nav">
      <button class="btn-secondary" id="back-${node.id}">← Voltar</button>
      <button class="btn-primary" id="next-${node.id}" disabled>Continuar →</button>
    </div>
  `;

  setTimeout(() => {
    const options = container.querySelectorAll('.option-card');
    const nextBtn = document.getElementById(`next-${node.id}`);
    const backBtn = document.getElementById(`back-${node.id}`);

    options.forEach((opt, idx) => {
      opt.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        const dataOpt = node.options[idx];
        selectedValue = dataOpt.value || dataOpt.text;
        selectedNext = dataOpt.next;
        selectedHint = dataOpt.hint;
        nextBtn.disabled = false;
      });
    });

    nextBtn.addEventListener('click', () => {
      if (!selectedValue) return;
      saveAnswer(node.id, selectedValue, selectedHint);
      goToNode(selectedNext);
    });

    backBtn.addEventListener('click', () => {
      goBack();
    });
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
      <h2 class="analyzing-title">${node.title}</h2>
      <p class="analyzing-text">${node.subtitle}</p>
      <div class="analyzing-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;
  return container;
}

function renderResult(node) {
  const container = document.createElement('div');
  const resultData = getResultData(state.resultadoId);
  
  if (!resultData) return container;

  container.innerHTML = `
    <div class="result-container">
      <div class="result-badge">${resultData.badge}</div>
      <h2 class="result-title">${resultData.title}</h2>
      <p class="result-description">${resultData.description}</p>
      <div class="result-solutions">
        ${resultData.solutions.map(s => `
          <div class="solution-card">
            <div class="solution-icon">${s.icon}</div>
            <div class="solution-info"><h3>${s.name}</h3><p>${s.desc}</p></div>
          </div>
        `).join('')}
      </div>
      <div class="result-cta">
        <a href="${resultData.url}" class="btn-cta" target="_blank" rel="noopener">
          ${resultData.cta}
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
