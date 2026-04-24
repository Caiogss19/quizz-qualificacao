// ===========================
// QUIZ DATA - TODOS OS CAMINHOS
// ===========================

// RESULTADOS POSSÍVEIS (5 no total, igual ao original)
const RESULTS = {
  'community_discovery': {
    id: 'community_discovery',
    title: 'Community Discovery',
    badge: '🔍 Solução recomendada',
    description: 'Você precisa de inteligência para mapear nichos, encontrar os criadores certos e entender profundamente as comunidades antes de investir. O Community Discovery é feito para isso.',
    solutions: [
      { icon: '🗺️', name: 'Mapeamento de Nichos', desc: 'Descubra comunidades e micro-influenciadores com fit cultural real para sua marca ou cliente.' },
      { icon: '🎯', name: 'Inteligência Cultural', desc: 'Entenda o que cada nicho consome, valoriza e rejeita antes de criar qualquer campanha.' },
      { icon: '🔬', name: 'Análise de Perfil', desc: 'Dados profundos sobre audiência, engajamento real e autenticidade de cada creator.' },
    ],
    cta: 'Quero conhecer o Community Discovery'
  },
  'sprout_social': {
    id: 'sprout_social',
    title: 'Sprout Social Influencer Marketing',
    badge: '📊 Solução recomendada',
    description: 'Sua operação precisa de gestão ponta a ponta: do briefing à entrega, com comprovação real de ROI. O Sprout Social Influencer Marketing une tudo em um único lugar.',
    solutions: [
      { icon: '⚙️', name: 'Gestão Ponta a Ponta', desc: 'Gerencie toda a jornada de influência: briefing, aprovação, entrega e pagamento.' },
      { icon: '📈', name: 'Comprovação de ROI', desc: 'Relatórios automáticos com CPE, CPM, alcance real e impacto de negócio.' },
      { icon: '🔄', name: 'Fluxos Automatizados', desc: 'Reduza trabalho manual e escale operações sem aumentar o tamanho do time.' },
    ],
    cta: 'Quero conhecer o Sprout Social'
  },
  'monitoring_insights': {
    id: 'monitoring_insights',
    title: 'Monitoring & Insights',
    badge: '👁️ Solução recomendada',
    description: 'Você precisa de visibilidade total: monitorar o que falam da sua marca, entender o sentimento das comunidades e proteger sua reputação em tempo real.',
    solutions: [
      { icon: '📡', name: 'Monitoramento em Tempo Real', desc: 'Acompanhe menções, sentimento e tendências sobre sua marca 24/7.' },
      { icon: '🛡️', name: 'Gestão de Reputação', desc: 'Identifique crises antes que escaloniem e reaja rapidamente com dados.' },
      { icon: '💡', name: 'Insights de Mercado', desc: 'Entenda o que o mercado fala sobre você, concorrentes e temas relevantes.' },
    ],
    cta: 'Quero conhecer o Monitoring & Insights'
  },
  'cultural_influencer': {
    id: 'cultural_influencer',
    title: 'Seu Perfil: Cultural Influencer',
    badge: '🎨 Seu resultado',
    description: 'Você é um criador de conteúdo com forte conexão cultural com seu público. Sua audiência precisa ser compreendida em profundidade para que você possa valorizar seu trabalho e atrair as marcas certas.',
    solutions: [
      { icon: '🌍', name: 'Dados de Audiência', desc: 'Relatórios demográficos e comportamentais da sua audiência para usar nas negociações.' },
      { icon: '🎯', name: 'Fit Cultural', desc: 'Descubra quais marcas têm fit real com seu nicho e comunidade.' },
      { icon: '💎', name: 'Valorização do Conteúdo', desc: 'Use dados para mostrar o valor real do seu conteúdo dentro do seu nicho.' },
    ],
    cta: 'Quero valorizar meu perfil como creator'
  },
  'professional_creator': {
    id: 'professional_creator',
    title: 'Seu Perfil: Professional Creator',
    badge: '🚀 Seu resultado',
    description: 'Você já cria, agora precisa profissionalizar. Com relatórios automáticos de performance e ferramentas de gestão, você eleva o nível das suas negociações e fecha contratos maiores.',
    solutions: [
      { icon: '📊', name: 'Relatórios de Performance', desc: 'Apresente métricas profissionais de cada campanha para justificar seu valor.' },
      { icon: '💼', name: 'Profissionalização', desc: 'Mídia kit digital, precificação estruturada e contratos em um só lugar.' },
      { icon: '🤝', name: 'Conexão com Marcas', desc: 'Apareça para as marcas certas com um perfil verificado e dados reais.' },
    ],
    cta: 'Quero me profissionalizar como creator'
  }
};

// PERGUNTAS POR PERFIL
const QUESTIONS = {
  q2: {
    'Empresa / Marca': {
      title: 'Qual é a sua maior prioridade ao trabalhar com influenciadores?',
      subtitle: 'Selecione o que mais importa para sua estratégia hoje',
      key: 'q2_resposta',
      options: [
        { icon: '🔍', text: 'Encontrar criadores com fit real para minha marca', resultado_hint: 'discovery' },
        { icon: '📊', text: 'Medir resultados e comprovar ROI das campanhas', resultado_hint: 'roi' },
        { icon: '🛡️', text: 'Monitorar reputação e sentimento sobre minha marca', resultado_hint: 'monitoring' },
        { icon: '⚙️', text: 'Automatizar e escalar minha operação de influência', resultado_hint: 'roi' },
        { icon: '🎯', text: 'Entender nichos e comunidades antes de investir', resultado_hint: 'discovery' },
      ]
    },
    'Agência de Publicidade/Marketing': {
      title: 'Qual é o maior gargalo na sua operação de influência hoje?',
      subtitle: 'Selecione o principal ponto de dor da sua agência',
      key: 'q2_resposta',
      options: [
        { icon: '🗂️', text: 'Descobrir e curar creators certos para cada cliente', resultado_hint: 'discovery' },
        { icon: '📋', text: 'Relatórios e comprovação de resultados para o cliente', resultado_hint: 'roi' },
        { icon: '👁️', text: 'Monitorar menções e sentimento das marcas dos clientes', resultado_hint: 'monitoring' },
        { icon: '🚀', text: 'Escalar operações gerenciando múltiplos clientes', resultado_hint: 'roi' },
        { icon: '🔎', text: 'Curadoria cultural e fit entre creator e marca', resultado_hint: 'discovery' },
      ]
    },
    'Creator': {
      title: 'O que você mais quer conquistar como creator agora?',
      subtitle: 'Seja honesto — isso vai nos ajudar a indicar o melhor caminho',
      key: 'q2_resposta',
      options: [
        { icon: '🎨', text: 'Entender melhor minha audiência e nicho cultural', resultado_hint: 'cultural' },
        { icon: '💰', text: 'Provar meu valor e fechar contratos maiores com marcas', resultado_hint: 'professional' },
        { icon: '📈', text: 'Crescer minha audiência de forma estratégica', resultado_hint: 'cultural' },
        { icon: '📊', text: 'Ter relatórios profissionais de performance', resultado_hint: 'professional' },
        { icon: '💼', text: 'Profissionalizar minha cobrança e negociações', resultado_hint: 'professional' },
      ]
    },
    'Agência de Casting / Agenciador': {
      title: 'Qual é o maior obstáculo na sua operação de casting hoje?',
      subtitle: 'Selecione o principal desafio do seu trabalho diário',
      key: 'q2_resposta',
      options: [
        { icon: '🗺️', text: 'Mapear e descobrir novos talentos com fit para marcas', resultado_hint: 'discovery' },
        { icon: '📲', text: 'Apresentar resultados e ROI dos talentos para marcas', resultado_hint: 'roi' },
        { icon: '👁️', text: 'Monitorar reputação e sentimento dos talentos online', resultado_hint: 'monitoring' },
        { icon: '⚙️', text: 'Gerenciar múltiplos talentos e contratos com eficiência', resultado_hint: 'roi' },
        { icon: '🎯', text: 'Identificar fit cultural entre talentos e marcas', resultado_hint: 'discovery' },
      ]
    }
  },
  q3: {
    'Empresa / Marca': {
      title: 'Como você mede o sucesso das suas ações com influenciadores?',
      subtitle: 'Selecione a métrica mais importante para o seu negócio',
      key: 'q3_resposta',
      options: [
        { icon: '🎯', text: 'Alcance de novos nichos e comunidades relevantes', resultado_hint: 'discovery' },
        { icon: '📊', text: 'ROI, conversões e impacto direto em vendas', resultado_hint: 'roi' },
        { icon: '💬', text: 'Sentimento positivo e reputação da marca', resultado_hint: 'monitoring' },
        { icon: '⚡', text: 'Eficiência operacional e redução de custo por ação', resultado_hint: 'roi' },
        { icon: '🌱', text: 'Crescimento orgânico de comunidades', resultado_hint: 'discovery' },
      ]
    },
    'Agência de Publicidade/Marketing': {
      title: 'O que seus clientes mais cobram da sua agência em campanhas de influência?',
      subtitle: 'Selecione o principal critério de sucesso para seus clientes',
      key: 'q3_resposta',
      options: [
        { icon: '🔍', text: 'Qualidade e fit cultural dos creators selecionados', resultado_hint: 'discovery' },
        { icon: '📈', text: 'Resultados mensuráveis e comprovação de ROI', resultado_hint: 'roi' },
        { icon: '🛡️', text: 'Proteção de reputação e monitoramento de marca', resultado_hint: 'monitoring' },
        { icon: '🚀', text: 'Agilidade na entrega e escala das campanhas', resultado_hint: 'roi' },
        { icon: '🎯', text: 'Precisão na segmentação por nicho e audiência', resultado_hint: 'discovery' },
      ]
    },
    'Creator': {
      title: 'Como você se apresenta para marcas hoje?',
      subtitle: 'Descreva como conquista parcerias atualmente',
      key: 'q3_resposta',
      options: [
        { icon: '🌍', text: 'Mostro minha conexão cultural com minha audiência', resultado_hint: 'cultural' },
        { icon: '📊', text: 'Apresento dados e métricas de performance', resultado_hint: 'professional' },
        { icon: '📄', text: 'Tenho mídia kit mas quero torná-lo mais profissional', resultado_hint: 'professional' },
        { icon: '💬', text: 'Ainda faço tudo informalmente por DM/WhatsApp', resultado_hint: 'professional' },
        { icon: '🎨', text: 'Pelo meu estilo de conteúdo e identidade de nicho', resultado_hint: 'cultural' },
      ]
    },
    'Agência de Casting / Agenciador': {
      title: 'O que as marcas mais valorizam quando você apresenta talentos?',
      subtitle: 'Selecione o critério mais decisivo nas negociações',
      key: 'q3_resposta',
      options: [
        { icon: '🎯', text: 'Fit cultural e autenticidade do talent com a marca', resultado_hint: 'discovery' },
        { icon: '📊', text: 'Dados de performance e ROI histórico dos talentos', resultado_hint: 'roi' },
        { icon: '🛡️', text: 'Reputação online e histórico sem crises', resultado_hint: 'monitoring' },
        { icon: '⚡', text: 'Agilidade e profissionalismo na condução do processo', resultado_hint: 'roi' },
        { icon: '🌐', text: 'Alcance em nichos específicos e comunidades', resultado_hint: 'discovery' },
      ]
    }
  }
};

// LÓGICA DE RESULTADO
// Para corporativos (Empresa, Agência, Casting): combina hints de Q2 + Q3
// Para Creator: usa hints de Q2 + Q3 (cultural vs professional)
function calcularResultado(profile, q2hint, q3hint) {
  if (profile === 'Creator') {
    const score = [q2hint, q3hint].filter(h => h === 'professional').length;
    return score >= 1 ? 'professional_creator' : 'cultural_influencer';
  }
  // Corporativos: maioria dos hints decide
  const hints = [q2hint, q3hint];
  if (hints.filter(h => h === 'monitoring').length >= 1 && q2hint === 'monitoring') return 'monitoring_insights';
  if (hints.filter(h => h === 'roi').length >= 1 && q2hint === 'roi') return 'sprout_social';
  if (hints.filter(h => h === 'discovery').length >= 1 && q2hint === 'discovery') return 'community_discovery';
  // fallback por Q3
  if (q3hint === 'monitoring') return 'monitoring_insights';
  if (q3hint === 'roi') return 'sprout_social';
  return 'community_discovery';
}

// ===========================
// STATE
// ===========================
const state = {
  currentStep: 0,
  totalSteps: 5,
  lead: {},
  answers: { perfil: null, q2_resposta: null, q2_hint: null, q3_resposta: null, q3_hint: null },
  selectedProfile: null,
  resultadoId: null,
  startTime: null,
  completedAt: null
};

// ===========================
// STORAGE
// ===========================
const DB_KEY = 'quiz_diagnostico_responses';

function saveResponse(data) {
  const existing = getAllResponses();
  const entry = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    duration_seconds: state.completedAt ? Math.round((state.completedAt - state.startTime) / 1000) : 0,
    ...data
  };
  existing.push(entry);
  try { localStorage.setItem(DB_KEY, JSON.stringify(existing)); } catch(e) { console.error(e); }
  return entry;
}

function getAllResponses() {
  try { return JSON.parse(localStorage.getItem(DB_KEY) || '[]'); } catch { return []; }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 8);
}

// ===========================
// DOM HELPERS
// ===========================
function showStep(step) {
  const current = document.querySelector('.step.active');
  if (current) {
    const currentNum = parseInt(current.dataset.step);
    if (step > currentNum) {
      current.classList.add('exit-left');
      setTimeout(() => current.classList.remove('exit-left', 'active'), 300);
    } else {
      current.classList.remove('active');
    }
  }

  setTimeout(() => {
    const el = document.getElementById(`step-${step}`);
    if (el) {
      if (document.querySelector('.step.active')) {
        document.querySelector('.step.active').classList.remove('active');
      }
      el.classList.add('active');
      if (current && step < parseInt(current.dataset.step)) {
        el.classList.add('from-back');
        setTimeout(() => el.classList.remove('from-back'), 400);
      }
    }
  }, current ? 300 : 0);

  state.currentStep = step;
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress() {
  const pct = (state.currentStep / state.totalSteps) * 100;
  document.getElementById('progressBar').style.width = pct + '%';
  
  // Update Stepper
  document.querySelectorAll('.stepper-step').forEach((el, index) => {
    if (index < state.currentStep) {
      el.classList.add('done');
      el.classList.remove('active');
    } else if (index === state.currentStep) {
      el.classList.add('active');
      el.classList.remove('done');
    } else {
      el.classList.remove('done', 'active');
    }
  });
  
  document.querySelectorAll('.stepper-line').forEach((el, index) => {
    if (index < state.currentStep) {
      el.classList.add('done');
    } else {
      el.classList.remove('done');
    }
  });
}

function showToast(msg, duration = 3000) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

function setNextEnabled(id, enabled) {
  const btn = document.getElementById(id);
  if (btn) btn.disabled = !enabled;
}

// ===========================
// STEP 0 - LEAD FORM
// ===========================
function initStep0() {
  const celularInput = document.getElementById('celular');
  celularInput.addEventListener('input', function() {
    let v = this.value.replace(/\D/g, '').substr(0, 11);
    if (v.length > 6) v = `(${v.substr(0,2)}) ${v.substr(2,5)}-${v.substr(7)}`;
    else if (v.length > 2) v = `(${v.substr(0,2)}) ${v.substr(2)}`;
    else if (v.length > 0) v = `(${v}`;
    this.value = v;
  });

  document.getElementById('leadForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validateLeadForm()) return;
    state.lead = {
      nome: document.getElementById('nome').value.trim(),
      email: document.getElementById('email').value.trim(),
      celular: document.getElementById('celular').value.trim(),
      empresa: document.getElementById('empresa').value.trim()
    };
    state.startTime = Date.now();
    showStep(1);
  });
}

function validateLeadForm() {
  let valid = true;
  [
    { id: 'nome', errorId: 'nome-error', msg: 'Por favor, informe seu nome' },
    { id: 'email', errorId: 'email-error', msg: 'Informe um e-mail válido' },
    { id: 'celular', errorId: 'celular-error', msg: 'Informe seu celular' },
    { id: 'empresa', errorId: 'empresa-error', msg: 'Informe sua empresa' }
  ].forEach(f => {
    const input = document.getElementById(f.id);
    const errEl = document.getElementById(f.errorId);
    const checkEl = document.getElementById(`check-${f.id}`);
    
    let ok = input.value.trim().length > 0;
    if (f.id === 'email' && ok) ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    
    input.classList.toggle('error', !ok);
    input.classList.toggle('valid', ok);
    
    if (checkEl) checkEl.classList.toggle('visible', ok);
    
    errEl.textContent = ok ? '' : f.msg;
    errEl.classList.toggle('visible', !ok);
    if (!ok) valid = false;
  });
  return valid;
}

// ===========================
// STEP 1 - PERFIL
// ===========================
function initStep1() {
  document.querySelectorAll('#profileOptions .option-card').forEach(opt => {
    opt.addEventListener('click', function() {
      document.querySelectorAll('#profileOptions .option-card').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      state.answers.perfil = this.dataset.value;
      state.selectedProfile = this.dataset.value;
      setNextEnabled('next-1', true);
    });
  });

  document.getElementById('next-1').addEventListener('click', () => {
    if (!state.selectedProfile) return;
    buildDynamicStep(2);
    showStep(2);
  });
  document.getElementById('back-1').addEventListener('click', () => showStep(0));
}

// ===========================
// BUILDER DINÂMICO DE STEPS 2 e 3
// ===========================
function buildDynamicStep(stepNum) {
  const profile = state.selectedProfile;
  const qBank = stepNum === 2 ? QUESTIONS.q2 : QUESTIONS.q3;
  const qData = qBank[profile];
  if (!qData) return;

  document.getElementById(`q${stepNum}-title`).textContent = qData.title;
  document.getElementById(`q${stepNum}-subtitle`).textContent = qData.subtitle;

  const container = document.getElementById(`q${stepNum}-options`);
  container.innerHTML = '';
  setNextEnabled(`next-${stepNum}`, false);

  qData.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-card';
    btn.dataset.value = opt.text;
    btn.dataset.hint = opt.resultado_hint;
    btn.id = `q${stepNum}-opt-${i}`;
    btn.innerHTML = `
      <span class="option-letter">${'ABCDE'[i]}</span>
      <span class="option-icon">${opt.icon}</span>
      <span class="option-text">${opt.text}</span>
      <span class="option-check-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </span>
    `;
    btn.addEventListener('click', function() {
      container.querySelectorAll('.option-card').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      if (stepNum === 2) {
        state.answers.q2_resposta = this.dataset.value;
        state.answers.q2_hint = this.dataset.hint;
      } else {
        state.answers.q3_resposta = this.dataset.value;
        state.answers.q3_hint = this.dataset.hint;
      }
      setNextEnabled(`next-${stepNum}`, true);
    });
    container.appendChild(btn);
  });
}

function initStep2() {
  document.getElementById('next-2').addEventListener('click', () => {
    if (!state.answers.q2_resposta) return;
    buildDynamicStep(3);
    showStep(3);
  });
  document.getElementById('back-2').addEventListener('click', () => showStep(1));
}

function initStep3() {
  document.getElementById('next-3').addEventListener('click', () => {
    if (!state.answers.q3_resposta) return;
    state.completedAt = Date.now();
    state.resultadoId = calcularResultado(state.selectedProfile, state.answers.q2_hint, state.answers.q3_hint);
    showStep(4);
    runAnalysis();
  });
  document.getElementById('back-3').addEventListener('click', () => showStep(2));
}

// ===========================
// STEP 4 - ANÁLISE
// ===========================
function runAnalysis() {
  const result = RESULTS[state.resultadoId];
  saveResponse({
    ...state.lead,
    perfil: state.selectedProfile,
    q2_resposta: state.answers.q2_resposta,
    q2_hint: state.answers.q2_hint,
    q3_resposta: state.answers.q3_resposta,
    q3_hint: state.answers.q3_hint,
    resultado_id: state.resultadoId,
    resultado_nome: result ? result.title : '',
    user_agent: navigator.userAgent,
    referrer: document.referrer || 'direto',
    url_origem: window.location.href
  });
  
  const msgs = [
    "Analisando seu perfil...",
    "Cruzando dados das respostas...",
    "Buscando a melhor solução...",
    "Preparando seu diagnóstico..."
  ];
  let msgIdx = 0;
  const titleEl = document.getElementById('analyzingTitle');
  
  const msgInterval = setInterval(() => {
    msgIdx++;
    if (msgIdx < msgs.length && titleEl) {
      titleEl.style.opacity = 0;
      setTimeout(() => {
        titleEl.textContent = msgs[msgIdx];
        titleEl.style.opacity = 1;
      }, 400);
    }
  }, 1200);

  setTimeout(() => {
    clearInterval(msgInterval);
    buildResult(); 
    showStep(5);
    showToast("✅ Diagnóstico salvo com sucesso!");
    
    // Animate match bar
    setTimeout(() => {
      const pct = Math.floor(Math.random() * (98 - 85 + 1)) + 85;
      const fill = document.getElementById('matchBarFill');
      const text = document.getElementById('matchPct');
      if (fill && text) {
        fill.style.width = pct + '%';
        
        let currentPct = 0;
        const iv = setInterval(() => {
          currentPct += 2;
          if (currentPct >= pct) {
            currentPct = pct;
            clearInterval(iv);
          }
          text.textContent = currentPct + '%';
        }, 30);
      }
    }, 800);
  }, 4800);
}

// ===========================
// STEP 5 - RESULTADO
// ===========================
function buildResult() {
  const result = RESULTS[state.resultadoId];
  if (!result) return;

  document.getElementById('resultBadge').textContent = result.badge;
  document.getElementById('resultTitle').textContent = result.title;
  document.getElementById('resultDescription').textContent = result.description;
  
  const iconMap = {
    'community_discovery': '🔍',
    'sprout_social': '📊',
    'monitoring_insights': '👁️',
    'cultural_influencer': '🎨',
    'professional_creator': '🚀'
  };
  const avatar = document.getElementById('resultAvatar');
  if (avatar) avatar.textContent = iconMap[state.resultadoId] || '✨';

  const container = document.getElementById('resultSolutions');
  container.innerHTML = result.solutions.map(s => `
    <div class="solution-card">
      <div class="solution-icon">${s.icon}</div>
      <div class="solution-info"><h3>${s.name}</h3><p>${s.desc}</p></div>
    </div>
  `).join('');

  document.getElementById('btnCTA').textContent = result.cta;
  document.getElementById('btnCTA').href = 'https://inlead.digital';
  
  const btnWpp = document.getElementById('btnWhatsApp');
  if (btnWpp) {
    const text = encodeURIComponent(`Acabei de fazer meu diagnóstico! Meu perfil é *${result.title}*.\nFaça o seu também: ${window.location.origin}`);
    btnWpp.href = `https://api.whatsapp.com/send?text=${text}`;
  }
}

function initStep5() {
  document.getElementById('btnRestart').addEventListener('click', () => {
    state.answers = { perfil: null, q2_resposta: null, q2_hint: null, q3_resposta: null, q3_hint: null };
    state.selectedProfile = null;
    state.resultadoId = null;
    state.startTime = null;
    state.completedAt = null;
    state.lead = {};
    document.getElementById('leadForm').reset();
    document.querySelectorAll('.option-card').forEach(o => o.classList.remove('selected'));
    document.querySelectorAll('.input-check').forEach(e => e.classList.remove('visible'));
    document.querySelectorAll('input').forEach(i => i.classList.remove('error', 'valid'));
    
    const fill = document.getElementById('matchBarFill');
    const text = document.getElementById('matchPct');
    if (fill) fill.style.width = '0%';
    if (text) text.textContent = '0%';
    
    setNextEnabled('next-1', false);
    setNextEnabled('next-2', false);
    setNextEnabled('next-3', false);
    showStep(0);
  });
}

// ===========================
// INIT
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  initStep0();
  initStep1();
  initStep2();
  initStep3();
  initStep5();
  updateProgress();
});
