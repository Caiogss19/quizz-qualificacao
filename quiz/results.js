import { state } from '../core/state.js';
import { quizJSON } from './config.js';

export function calculateResult() {
  const hints = state.hints;
  const profileAnswer = state.answers['perfil'];

  if (profileAnswer === 'Creator') {
    const professionalHints = hints.filter(h => h === 'professional').length;
    return professionalHints >= 1 ? 'professional_creator' : 'cultural_influencer';
  }

  // Corporativos: maioria dos hints decide
  const monitoringHints = hints.filter(h => h === 'monitoring').length;
  const roiHints = hints.filter(h => h === 'roi').length;
  const discoveryHints = hints.filter(h => h === 'discovery').length;

  if (monitoringHints >= 1 && hints[0] === 'monitoring') return 'monitoring_insights';
  if (roiHints >= 1 && hints[0] === 'roi') return 'sprout_social';
  if (discoveryHints >= 1 && hints[0] === 'discovery') return 'community_discovery';
  
  // fallback por último hint
  const lastHint = hints[hints.length - 1];
  if (lastHint === 'monitoring') return 'monitoring_insights';
  if (lastHint === 'roi') return 'sprout_social';
  
  return 'community_discovery';
}

export function getResultData(resultId) {
  return quizJSON.results[resultId] || quizJSON.results['community_discovery'];
}
