export function validateLeadForm(fieldsConfig) {
  let valid = true;
  fieldsConfig.forEach(f => {
    const input = document.getElementById(f.id);
    const errEl = document.getElementById(`${f.id}-error`);
    if (!input || !errEl) return;
    
    const value = input.value.trim();
    let ok = value.length > 0;
    
    if (ok) {
      if (f.id === 'email') {
        ok = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      } else if (f.id === 'celular') {
        ok = /^\(\d{2}\)\s\d{5}-\d{4}$/.test(value);
      }
    }
    
    input.classList.toggle('error', !ok);
    errEl.textContent = ok ? '' : f.errorMsg;
    errEl.classList.toggle('visible', !ok);
    if (!ok) valid = false;
  });
  return valid;
}
