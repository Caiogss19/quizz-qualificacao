// Removed import state

const DB_KEY = 'quiz_diagnostico_responses';

function checkStorageQuota() {
  try {
    let total = 0;
    for (let x in localStorage) {
      if (localStorage.hasOwnProperty(x)) {
        total += ((localStorage[x].length + x.length) * 2);
      }
    }
    const limit = 4 * 1024 * 1024; // 4MB
    if (total > limit) {
      console.warn(`⚠️ Aviso de Quota do Storage: já foram usados ${(total / 1024 / 1024).toFixed(2)} MB. Próximo do limite de 5MB.`);
    }
  } catch(e) {}
}

function saveResponse(data) {
  const existing = getAllResponses();
  const entry = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    duration_seconds: state.completedAt ? Math.round((state.completedAt - state.startTime) / 1000) : 0,
    ...data
  };
  existing.push(entry);
  try { 
    checkStorageQuota();
    localStorage.setItem(DB_KEY, JSON.stringify(existing)); 
  } catch(e) { 
    console.error('Storage error:', e); 
    if (e.name === 'QuotaExceededError') {
      alert("O limite de armazenamento do seu navegador foi atingido.");
    }
  }
  return entry;
}

function getAllResponses() {
  try { 
    return JSON.parse(localStorage.getItem(DB_KEY) || '[]'); 
  } catch { 
    return []; 
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 8);
}

// --- Multi-Quiz Management ---
const QUIZ_DB_KEY = 'sparkmaxx_quizzes';

function getQuizzes() {
  try { return JSON.parse(localStorage.getItem(QUIZ_DB_KEY) || '[]'); } 
  catch { return []; }
}

function saveQuizzes(quizzes) {
  localStorage.setItem(QUIZ_DB_KEY, JSON.stringify(quizzes));
}

function getQuizById(id) {
  return getQuizzes().find(q => q.id === id);
}

function createQuiz(name = 'Novo Quiz') {
  const quizzes = getQuizzes();
  // Usa o quizJSON default como template base
  const newQuiz = {
    id: generateId(),
    name: name,
    webhookUrl: '',
    nodes: JSON.parse(JSON.stringify(quizJSON.nodes)),
    results: JSON.parse(JSON.stringify(quizJSON.results)),
    createdAt: new Date().toISOString()
  };
  quizzes.push(newQuiz);
  saveQuizzes(quizzes);
  return newQuiz;
}

function deleteQuiz(id) {
  let quizzes = getQuizzes();
  quizzes = quizzes.filter(q => q.id !== id);
  saveQuizzes(quizzes);
}

function duplicateQuiz(id) {
  const quizzes = getQuizzes();
  const source = quizzes.find(q => q.id === id);
  if (!source) return null;
  const newQuiz = JSON.parse(JSON.stringify(source));
  newQuiz.id = generateId();
  newQuiz.name = newQuiz.name + ' (Cópia)';
  newQuiz.createdAt = new Date().toISOString();
  quizzes.push(newQuiz);
  saveQuizzes(quizzes);
  return newQuiz;
}
