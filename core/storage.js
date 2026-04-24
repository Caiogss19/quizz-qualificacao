import { state } from './state.js';

const DB_KEY = 'quiz_diagnostico_responses';

export function saveResponse(data) {
  const existing = getAllResponses();
  const entry = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    duration_seconds: state.completedAt ? Math.round((state.completedAt - state.startTime) / 1000) : 0,
    ...data
  };
  existing.push(entry);
  try { 
    localStorage.setItem(DB_KEY, JSON.stringify(existing)); 
  } catch(e) { 
    console.error('Storage error:', e); 
  }
  return entry;
}

export function getAllResponses() {
  try { 
    return JSON.parse(localStorage.getItem(DB_KEY) || '[]'); 
  } catch { 
    return []; 
  }
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 8);
}
