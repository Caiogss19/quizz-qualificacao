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
