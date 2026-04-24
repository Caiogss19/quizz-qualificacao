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
  state.answers[nodeId] = value;
  state.totalScore += (parseInt(score) || 0);
  if (hint) {
    state.hints.push(hint);
  }
}

function getAnswers() {
  return state.answers;
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
