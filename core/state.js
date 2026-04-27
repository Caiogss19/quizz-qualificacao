var state = {
  currentNodeId: 'start',
  lead: {},
  answers: {}, // stores key-value, where key is node id and value is selected text/value
  hints: [], // array of collected hints
  startTime: null,
  completedAt: null,
  resultadoId: null,
  history: [], // array of node ids visited to allow 'back'
  totalScore: 0
};

function setLeadData(data) {
  state.lead = { ...state.lead, ...data };
  if (!state.startTime) state.startTime = Date.now();
}

function saveAnswer(nodeId, value, hint, score = 0) {
  // Armazena a resposta completa para o nó
  state.answers[nodeId] = { value, hint, score: (parseInt(score) || 0) };
  
  // Recalcula o score total baseado em todas as respostas atuais
  state.totalScore = Object.values(state.answers).reduce((acc, curr) => acc + curr.score, 0);
  
  // Reconstrói a lista de hints ativa baseada nas respostas atuais
  // Isso evita duplicação de hints se o usuário voltar e mudar a resposta
  state.hints = Object.values(state.answers)
    .map(ans => ans.hint)
    .filter(h => h);
}

function getAnswers() {
  const flat = {};
  Object.keys(state.answers).forEach(key => {
    flat[key] = state.answers[key].value;
  });
  return flat;
}

function pushHistory(nodeId) {
  state.history.push(nodeId);
}

function popHistory() {
  return state.history.pop();
}

function resetState() {
  state.currentNodeId = 'start';
  state.lead = {};
  state.answers = {};
  state.hints = [];
  state.startTime = null;
  state.completedAt = null;
  state.resultadoId = null;
  state.history = [];
  state.totalScore = 0;
}
