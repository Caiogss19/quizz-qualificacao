// Dependencies loaded globally via quiz.html scripts

const DOM = {
  quizCard:    document.getElementById('quizCard'),
  progressBar: document.getElementById('progressBar'),
  stepCount:   document.getElementById('stepCount'),
};

// ── HINT ORDER (cd=0, ss=1, cp=2) ─────────────────────────────────
// Garante que combos sempre gerem a chave correta do markdown:
// cd+ss → cd_ss | cd+cp → cd_cp | ss+cp → ss_cp
const HINT_ORDER = { cd: 0, ss: 1, cp: 2 };

// ── RESULT METRICS ─────────────────────────────────────────────────
// Dados exibidos no card de métrica do resultado
const RESULT_METRICS = {
  ss:    { metric: '+1200', metricLabel: 'campanhas geridas',    tag: 'Operação',     short: 'Gestão centralizada de campanhas' },
  cd:    { metric: '+100',  metricLabel: 'comunidades mapeadas', tag: 'Inteligência', short: 'Mapeamento de comunidades digitais' },
  cp:    { metric: '+35%',  metricLabel: 'em brand safety',      tag: 'Reputação',    short: 'Monitoramento e insights de marca' },
  cd_ss: { metric: 'Max',   metricLabel: 'eficiência cultural',  tag: 'Combo',        short: 'Inteligência e Performance' },
  cd_cp: { metric: 'Full',  metricLabel: 'segurança de nicho',   tag: 'Combo',        short: 'Estratégia Cultural Segura' },
  ss_cp: { metric: 'Safe',  metricLabel: 'performance auditada', tag: 'Combo',        short: 'Performance com Segurança' },
};

// ── DEFAULT QUIZ CONFIG ────────────────────────────────────────────
// Estrutura completa do quiz baseada no markdown.
// Usada como fallback quando quizJSON (config.js) não estiver disponível.
const DEFAULT_QUIZ_CONFIG = {
  id: 'sparkmaxx_v1',
  name: 'Quiz Spark Maxx',
  nodes: {

    // ── 1. FORMULÁRIO DE CAPTURA ──────────────────────────────────
    start: {
      type: 'lead_form',
      tag: 'Captura',
      next: 'perfil',
      buttonText: 'Começar diagnóstico',
      fields: [
        { id: 'nome',    label: 'Nome',     type: 'text',  placeholder: 'Seu nome completo', required: true },
        { id: 'email',   label: 'E-mail',   type: 'email', placeholder: 'seu@email.com',     required: true },
        { id: 'celular', label: 'WhatsApp', type: 'tel',   placeholder: '(11) 99999-9999',   required: true },
        { id: 'empresa', label: 'Empresa',  type: 'text',  placeholder: 'Nome da empresa',   required: false },
      ],
    },

    // ── 2. BIFURCAÇÃO PRINCIPAL ───────────────────────────────────
    perfil: {
      type: 'question',
      tag: 'Perfil',
      title: 'Antes de começar — quem é você?',
      subtitle: 'Escolha o perfil que melhor representa sua atuação.',
      varName: 'perfil',
      options: [
        { text: 'Marca — gestão de embaixadores e campanhas',       value: 'marca',   hint: null, next: 'q2_empresa' },
        { text: 'Agência — atendimento e entrega de resultados',    value: 'agencia', hint: null, next: 'q2_agencia' },
        { text: 'Creator — profissionalização e parcerias',         value: 'creator', hint: null, next: 'q2_creator' },
        { text: 'Casting / Agenciador — curadoria de talentos',     value: 'casting', hint: null, next: 'q2_casting' },
      ],
    },

    // ── 3A. FLUXO MARCA ───────────────────────────────────────────

    q2_empresa: {
      type: 'question',
      tag: 'Diagnóstico',
      title: 'Qual é a sua prioridade estratégica com influencer marketing?',
      subtitle: 'Escolha a opção que melhor descreve o seu foco atual.',
      varName: 'q2',
      options: [
        { text: 'Identificar novos nichos e criadores alinhados',    hint: 'cd', next: 'q3_empresa' },
        { text: 'Gerir campanhas e medir ROI de forma centralizada', hint: 'ss', next: 'q3_empresa' },
        { text: 'Proteger e monitorar a reputação de influenciadores',         hint: 'cp', next: 'q3_empresa' },
      ],
    },

    q3_empresa: {
      type: 'question',
      tag: 'Diagnóstico',
      title: 'Qual é sua maior dor no dia-a-dia?',
      subtitle: 'Escolha a opção mais próxima da sua realidade.',
      varName: 'q3',
      options: [
        { text: 'Nichos saturados e creators sem fit com a marca',        hint: 'cd', next: 'analyzing' },
        { text: 'Falta de dados e gestão de multiplas campanhas',         hint: 'ss', next: 'analyzing' },
        { text: 'Monitorar a reputação dos creators/embaixadores',       hint: 'cp', next: 'analyzing' },
      ],
    },

    // ── 3B. FLUXO AGÊNCIA ─────────────────────────────────────────

    q2_agencia: {
      type: 'question',
      tag: 'Diagnóstico',
      title: 'Qual é o principal foco de entrega aos seus clientes?',
      subtitle: 'Escolha a opção que melhor representa seu trabalho.',
      varName: 'q2',
      options: [
        { text: 'Campanhas com ROI e resultados comprovados',              hint: 'ss', next: 'q3_agencia' },
        { text: 'Análise de público-alvo e mapeamento de nichos',          hint: 'cd', next: 'q3_agencia' },
        { text: 'Auditoria, compliance e segurança dos influencers',       hint: 'cp', next: 'q3_agencia' },
      ],
    },

    q3_agencia: {
      type: 'question',
      tag: 'Diagnóstico',
      title: 'Qual é o principal gargalo para escalar a agência?',
      subtitle: 'Escolha o que mais trava o seu crescimento hoje.',
      varName: 'q3',
      options: [
        { text: 'Contratação e gestão eficiente de influencers',           hint: 'ss', next: 'analyzing' },
        { text: 'Monitoramento de crescimento orgãnico no mercado',        hint: 'cd', next: 'analyzing' },
        { text: 'Monitoramento contínuo de perfis de creators',            hint: 'cp', next: 'analyzing' },
      ],
    },

    // ── 3C. FLUXO CREATOR ─────────────────────────────────────────

    q2_creator: {
      type: 'question',
      tag: 'Diagnóstico',
      title: 'Qual é o seu principal objetivo de carreira agora?',
      subtitle: 'Escolha a opção que mais define sua meta atual.',
      varName: 'q2',
      options: [
        { text: 'Crescer meu alcance e métricas de engajamento',           hint: 'cp', next: 'q3_creator' },
        { text: 'Dominar meu nicho e fortalecer posicionamento',           hint: 'cp', next: 'q3_creator' },
        { text: 'Proteger minha imagem e reputação digital',               hint: 'cp', next: 'q3_creator' },
      ],
    },

    q3_creator: {
      type: 'question',
      tag: 'Diagnóstico',
      title: 'Como você usa dados ao apresentar propostas para marcas?',
      subtitle: 'Seja honesto — isso define sua solução ideal.',
      varName: 'q3',
      options: [
        { text: 'Ainda não incluo dados nas minhas propostas',             hint: 'cp', next: 'analyzing' },
        { text: 'Uso métricas básicas de alcance e visualizações',         hint: 'cp', next: 'analyzing' },
        { text: 'Uso análises avançadas de audiência e nicho',             hint: 'cp', next: 'analyzing' },
      ],
    },

    // ── 3D. FLUXO CASTING ─────────────────────────────────────────

    q2_casting: {
      type: 'question',
      tag: 'Diagnóstico',
      title: 'Qual é a maior prioridade no seu trabalho de casting?',
      subtitle: 'Escolha o que mais define sua atuação diária.',
      varName: 'q2',
      options: [
        { text: 'Descobrir e mapear novos talentos e criadores',           hint: 'ss', next: 'q3_casting' },
        { text: 'Proteger a reputação e imagem dos agenciados',            hint: 'cp', next: 'q3_casting' },
        { text: 'Conquistar novas parcerias/publis',                       hint: 'cp', next: 'q3_casting' },
      ],
    },

    q3_casting: {
      type: 'question',
      tag: 'Diagnóstico',
      title: 'O que seus clientes mais demandam nas contratações?',
      subtitle: 'Escolha o que aparece com mais frequência nas negociações.',
      varName: 'q3',
      options: [
        { text: 'Fit cultural e alinhamento de valores com a marca',       hint: 'cp', next: 'analyzing' },
        { text: 'Gestão de riscos e histórico de imagem limpo',            hint: 'cp', next: 'analyzing' },
        { text: 'Relatórios de desempenho e resultados anteriores',        hint: 'ss', next: 'analyzing' },
      ],
    },

    // ── 4. FUNIL DE CONVERGÊNCIA ──────────────────────────────────

    analyzing: {
      type: 'loading',
      title: 'Analisando suas respostas',
      subtitle: 'Cruzando seu perfil com nossa base de soluções martech curadas.',
      duration: 3000,
      next: 'result',
    },

    // ── 5. RESULTADO (conteúdo calculado em computeResultData) ────
    result: {
      type: 'result',
    },
  },

  // ── RESULTADOS POSSÍVEIS ──────────────────────────────────────────
  // 3 puros (2-0) + 3 mistos (1-1) conforme lógica do markdown
  results: {

    // ── PUROS ────────────────────────────────────────────────────

    ss: {
      badge: 'Resultado puro (2–0)',
      title: 'Sprout Social',
      subtitle: 'Operação e Performance',
      description: 'Você precisa de uma plataforma centralizada para gerir campanhas, contratos e medir ROI de influencer marketing. A ferramenta indicada é o Sprout Social — solução completa para operação, pagamentos e performance.',
      solutions: [
        { name: 'Gestão centralizada de campanhas' },
        { name: 'Controle de contratos e pagamentos' },
        { name: 'Métricas e ROI em tempo real' },
        { name: 'Dashboard de performance' },
        { name: 'Encontrar influenciadores por IA' },
      ],
      cta: 'Agendar conversa com especialista',
      url: '#',
    },

    cd: {
      badge: 'Resultado puro (2–0)',
      title: 'Community Discovery',
      subtitle: 'Inteligência de Comunidades',
      description: 'Você precisa de inteligência para mapear nichos, territórios e microcomunidades e encontrar os criadores certos por afinidade real. A ferramenta indicada é o Community Discovery — motor de descoberta e mapeamento de audiências.',
      solutions: [
        { name: 'Mapeamento de nichos e novos territórios' },
        { name: 'Descoberta de criadores por afinidade' },
        { name: 'Análise do público-alvo' },
        { name: 'Monitoramento de crescimento orgãnico nos nichos' },
      ],
      cta: 'Agendar conversa com especialista',
      url: '#',
    },

    cp: {
      badge: 'Resultado puro (2–0)',
      title: 'Creator Pulse',
      subtitle: 'Segurança e Reputação',
      description: 'Você precisa de uma camada de segurança, auditoria de imagem e gestão de riscos sobre os criadores com quem trabalha. A ferramenta indicada é o Creator Pulse — monitoramento de reputação, histórico e compliance.',
      solutions: [
        { name: 'Auditoria de imagem e histórico' },
        { name: 'Monitoramento de riscos em tempo real' },
        { name: 'Identificação de atributos e temas associados ao creator' },
        { name: 'Relatórios que agregam valor para novos contratos' },
      ],
      cta: 'Agendar conversa com especialista',
      url: '#',
    },

    // ── MISTOS ───────────────────────────────────────────────────
    // Chaves sempre ordenadas por HINT_ORDER: cd < ss < cp

    cd_ss: {
      badge: 'Resultado misto (1–1)',
      title: 'Combo Inovação',
      subtitle: 'Inteligência e Performance',
      description: 'Você tem necessidades em dois eixos: inteligência de nichos e gestão de campanhas com ROI. As ferramentas indicadas são o Community Discovery (para descoberta e mapeamento) + Sprout Social (para operação e performance).',
      solutions: [
        { name: 'Descoberta de nichos + gestão de campanhas' },
        { name: 'ROI com inteligência de audiência' },
        { name: 'Planejamento estratégico e performance' },
        { name: 'Operação escalável com influenciadores com match real' },
      ],
      cta: 'Agendar conversa com especialista',
      url: '#',
    },

    cd_cp: {
      badge: 'Resultado misto (1–1)',
      title: 'Combo Estratégia Segura',
      subtitle: 'Estratégia Cultural Segura',
      description: 'Você tem necessidades em dois eixos: inteligência de nichos e segurança e auditoria de imagem. As ferramentas indicadas são o Community Discovery (para descoberta e mapeamento) + Creator Pulse (para reputação e compliance).',
      solutions: [
        { name: 'Cultura e segurança simultaneamente' },
        { name: 'Curadoria de criadores alinhados com o seu público' },
        { name: 'Branding com compliance' },
        { name: 'Monitoramento dos nichos e creators' },
      ],
      cta: 'Agendar conversa com especialista',
      url: '#',
    },

    ss_cp: {
      badge: 'Resultado misto (1–1)',
      title: 'Combo Performance Auditada',
      subtitle: 'Performance com Segurança',
      description: 'Você tem necessidades em dois eixos: gestão de campanhas com ROI e segurança e auditoria de imagem. As ferramentas indicadas são o Sprout Social (para operação e performance) + Creator Pulse (para reputação e compliance).',
      solutions: [
        { name: 'ROI + compliance em uma estratégia' },
        { name: 'Gestão de campanhas e reputação' },
        { name: 'Performance auditada em tempo real' },
        { name: 'Monitoramento de campanhas e creators' },
      ],
      cta: 'Agendar conversa com especialista',
      url: '#',
    },
  },
};

// ── STEP MAP ───────────────────────────────────────────────────────
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

  const quizzes = typeof getQuizzes === 'function' ? getQuizzes() : [];

  // PRIORIDADE: Se houver ID na URL, tenta carregar do DB. Caso contrário, usa o quizJSON (config.js) oficial.
  if (quizId) {
    activeQuiz = quizzes.find(q => q.id === quizId);
  }

  if (!activeQuiz) {
    // Fallback: Usa quizJSON (config.js) se disponível, senão usa DEFAULT_QUIZ_CONFIG
    if (typeof quizJSON !== 'undefined') {
      activeQuiz = { 
        id: quizJSON.id, 
        name: quizJSON.title, 
        nodes: quizJSON.nodes, 
        results: quizJSON.results 
      };
    } else {
      activeQuiz = DEFAULT_QUIZ_CONFIG;
    }
  }

  document.title = activeQuiz.name;
  resetState();
  state.startTime = Date.now(); // Inicia o contador de tempo

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
    alert(`Erro: nó não encontrado (ID: ${nodeId}). Verifique as conexões do quiz.`);
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
      state.resultadoId = computeResultId();

      const responseData = {
        event:        'quiz_completed',
        quiz_id:      activeQuiz.id,
        quiz_name:    activeQuiz.name,
        completed_at: new Date().toISOString(),
        duration_seconds: state.startTime ? Math.round((Date.now() - state.startTime) / 1000) : 0,
        lead:         state.lead,
        answers:      getAnswers(),
        hints:        state.hints,
        result_id:    state.resultadoId,
        utms:         state.utms,
        user_agent:   navigator.userAgent,
        url_origem:   window.location.href,
      };

      saveResponse(responseData);
      sendWebhook(responseData);
      if (typeof incrementAnalytics === 'function') {
        incrementAnalytics(activeQuiz.id, 'completions');
      }
    }
    stepEl.appendChild(renderResult(node));
  }

  DOM.quizCard.appendChild(stepEl);
}

function updateProgress(nodeId) {
  const stepData = STEP_MAP[nodeId] || { pct: 50, num: 3 };
  const totalSteps = 4;

  if (nodeId === 'analyzing') {
    if (DOM.progressBar) DOM.progressBar.style.width = '95%';
    if (DOM.stepCount) DOM.stepCount.textContent = `4 / 4 · Processando...`;
    return;
  }

  if (nodeId === 'result') {
    if (DOM.progressBar) DOM.progressBar.style.width = '100%';
    if (DOM.stepCount) DOM.stepCount.textContent = `Concluído · Diagnóstico`;
    return;
  }

  if (DOM.progressBar) DOM.progressBar.style.width = stepData.pct + '%';
  if (DOM.stepCount) {
    const node = activeQuiz.nodes[nodeId];
    const tag = node?.tag || 'Diagnóstico';
    const num = Math.min(stepData.num, totalSteps);
    DOM.stepCount.textContent = `${num} / ${totalSteps} · ${tag}`;
  }
}

function goToNode(nodeId) {
  if (!nodeId) {
    alert('Erro: este botão não está conectado a nenhuma próxima etapa.');
    return;
  }
  pushHistory(state.currentNodeId);
  renderNode(nodeId);
}

function goBack() {
  const prevId = popHistory();
  if (prevId) renderNode(prevId);
}

// ── SCORING ────────────────────────────────────────────────────────

// Calcula o resultId correto usando HINT_ORDER (cd=0, ss=1, cp=2)
// Garante chaves corretas: cd_ss | cd_cp | ss_cp (nunca cp_ss, ss_cd, etc.)
function computeResultId() {
  const hints = (state.hints || []).filter(Boolean);
  if (hints.length === 0) return null;

  const uniqueHints = [...new Set(hints)].sort((a, b) => HINT_ORDER[a] - HINT_ORDER[b]);

  if (uniqueHints.length === 1) {
    // Predominância 2-0: resultado puro
    return uniqueHints[0];
  }

  // Empate 1-1: resultado misto
  return uniqueHints.join('_');
}

function computeResultData() {
  const resultId = state.resultadoId || computeResultId();
  const resultsSource = activeQuiz.results || DEFAULT_QUIZ_CONFIG.results;

  if (resultId && resultsSource[resultId]) {
    return { ...resultsSource[resultId], _metricId: resultId };
  }

  // Fallback: hint mais frequente
  const hintCount = {};
  (state.hints || []).filter(Boolean).forEach(h => { hintCount[h] = (hintCount[h] || 0) + 1; });
  const topHint = Object.entries(hintCount).sort((a, b) => b[1] - a[1])[0]?.[0];

  if (topHint && resultsSource[topHint]) {
    return { ...resultsSource[topHint], _metricId: topHint };
  }

  return { title: 'Diagnóstico concluído', description: '', _metricId: null };
}

// ── RENDERERS ──────────────────────────────────────────────────────

function renderLeadForm(node) {
  const container = document.createElement('div');

  let fieldsHtml = '';
  if (node.fields.length === 4) {
    const [f0, f1, f2, f3] = node.fields;
    fieldsHtml = `${fieldHtml(f0)}${fieldHtml(f1)}<div class="field-grid-2">${fieldHtml(f2)}${fieldHtml(f3)}</div>`;
  } else {
    fieldsHtml = node.fields.map(fieldHtml).join('');
  }

  container.innerHTML = `
    <div class="lead-hero"><img src="assets/cube-hero.webp" alt="" /></div>
    <div class="step-header">
      <div class="sm-tag">Diagnóstico · 2 min</div>
      <h1 class="quiz-title">Descubra a solução <em>ideal</em><br/>para a sua operação.</h1>
      <p class="quiz-subtitle">Um diagnóstico técnico da sua estratégia de influência — baseado em <em>dados reais</em>, não em achismo.</p>
    </div>
    <form class="lead-form" id="leadForm" novalidate>
      ${fieldsHtml}
      <button type="submit" class="btn-primary" id="btnStart" style="margin-top:8px;">
        ${node.buttonText || 'Começar diagnóstico'}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </button>
      <p style="text-align:center;font-family:var(--font-mono);font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--fg-3);margin:8px 0 0;">Leva menos de 2 minutos · sem spam</p>
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
        const found = responses.find(r => r.lead?.email === val);
        if (found) {
          let btn = document.getElementById('btnPreviousResult');
          if (!btn) {
            btn = document.createElement('button');
            btn.id = 'btnPreviousResult';
            btn.className = 'btn-secondary';
            btn.style.cssText = 'margin-top:10px;width:100%;border:1px solid var(--border-2);border-radius:var(--radius-pill);padding:12px;';
            btn.textContent = 'E-mail já cadastrado — ver resultado anterior';
            btn.type = 'button';
            btn.onclick = () => {
              state.resultadoId = found.result_id;
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
        if (typeof incrementAnalytics === 'function') incrementAnalytics(activeQuiz.id, 'leads');
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
    let selectedOpt = null;

    options.forEach((opt, idx) => {
      opt.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selectedOpt = node.options[idx];
        nextBtn.disabled = false;
      });
    });

    nextBtn.addEventListener('click', () => {
      if (!selectedOpt) return;
      saveAnswer(node.varName || node.id, selectedOpt.value || selectedOpt.text, selectedOpt.hint, selectedOpt.score || 0);
      goToNode(selectedOpt.next);
    });

    backBtn.addEventListener('click', () => goBack());
  }, 0);

  return container;
}

function renderLoading(node) {
  const container = document.createElement('div');
  container.className = 'loading-screen';
  container.innerHTML = `
    <div class="spinner-circle"></div>
    <h1 class="loading-title">${node.title || 'Analisando suas respostas'}</h1>
    <p class="loading-sub">${node.subtitle || 'Cruzando seu perfil com nossa base de soluções martech curadas.'}</p>
    <div class="loading-steps">
      <div class="loading-step active" id="lStep1">Perfil identificado</div>
      <div class="loading-step" id="lStep2">Prioridades mapeadas</div>
      <div class="loading-step" id="lStep3">Calculando recomendação</div>
    </div>
  `;

  const duration = node.duration || 3000;
  const phase = duration / 3;
  setTimeout(() => { const s = container.querySelector('#lStep2'); if (s) s.classList.add('active'); }, phase);
  setTimeout(() => { const s = container.querySelector('#lStep3'); if (s) s.classList.add('active'); }, phase * 2);

  return container;
}

function renderResult(node) {
  const container = document.createElement('div');
  const resultData = computeResultData();
  const metricData = RESULT_METRICS[resultData._metricId] || null;

  const solutionsHtml = (resultData.solutions || []).map(s => `
    <div class="solution-card">
      <span class="solution-check">
        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      </span>
      <span class="solution-name">${s.name || ''}</span>
    </div>
  `).join('');

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

  const firstName = (state.lead?.nome) ? state.lead.nome.split(' ')[0] : 'você';

  container.innerHTML = `
    <div class="result-container">
      <div class="result-hero"><img src="assets/sphere-orb.png" alt="" /></div>
      <div class="result-badge">${resultData.badge || 'Seu diagnóstico'} · ${firstName}</div>
      <div class="result-head">
        <div class="result-label">Solução recomendada</div>
        <h2 class="result-title">${resultData.title || 'Resultado'}</h2>
        <p class="result-subtitle">${resultData.subtitle || ''}</p>
        <p class="result-description">${resultData.description || ''}</p>
      </div>
      ${metricHtml}
      ${solutionsHtml ? `<div class="result-solutions">${solutionsHtml}</div>` : ''}
      <div class="result-cta">
        <a href="${resultData.url || '#'}" class="btn-cta" target="_blank" rel="noopener">
          ${resultData.cta || 'Agendar conversa com especialista'}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
        </a>
        <a href="https://api.whatsapp.com/send?text=${encodeURIComponent('Olá! Fiz o diagnóstico Spark Maxx. Resultado: ' + (resultData.title || ''))}"
           class="btn-secondary-cta" target="_blank" rel="noopener">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Receber resumo no WhatsApp
        </a>
        <button class="btn-restart" id="btnRestart" type="button" style="margin-top:8px;">Refazer diagnóstico</button>
      </div>
    </div>
  `;

  setTimeout(() => {
    const btn = document.getElementById('btnRestart');
    if (btn) btn.addEventListener('click', () => initQuiz());
  }, 0);

  return container;
}

// ── START ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (DOM.quizCard) initQuiz();
});
