export function validateLeadForm(fieldsConfig) {
  let valid = true;
  fieldsConfig.forEach(f => {
    const input = document.getElementById(f.id);
    const errEl = document.getElementById(`${f.id}-error`);
    if (!input || !errEl) return;
    
    let ok = input.value.trim().length > 0;
    if (f.id === 'email' && ok) {
      ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    }
    input.classList.toggle('error', !ok);
    errEl.textContent = ok ? '' : f.errorMsg;
    errEl.classList.toggle('visible', !ok);
    if (!ok) valid = false;
  });
  return valid;
}
