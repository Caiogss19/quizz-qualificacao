function initInspector() {
  // init placeholder
}

function updateInspector() {
  const container = document.getElementById('inspectorBody');
  const nodeId = builderState.selectedNodeId;
  const node = builderState.nodes[nodeId];

  if (!node) {
    container.innerHTML = '<p class="empty-state">Clique em um nó para editar suas propriedades</p>';
    return;
  }

  let html = `
    <div style="margin-bottom:16px;font-size:13px;font-weight:600;color:var(--text-main);">🔧 Nó: <code style="background:var(--bg-dark);padding:2px 6px;border-radius:3px;font-size:11px;">${node.id}</code></div>
    <div class="form-group">
      <label>Título</label>
      <input type="text" id="propTitle" value="${escHtml(node.title || '')}" placeholder="Título do nó" />
    </div>
  `;

  if (node.subtitle !== undefined) {
    html += `
      <div class="form-group">
        <label>Subtítulo</label>
        <input type="text" id="propSubtitle" value="${escHtml(node.subtitle || '')}" placeholder="Subtítulo" />
      </div>
    `;
  }

  if (node.type === 'lead_form' && node.buttonText !== undefined) {
    html += `
      <div class="form-group">
        <label>Texto do Botão</label>
        <input type="text" id="propBtn" value="${escHtml(node.buttonText || '')}" />
      </div>
    `;
  }

  if (node.type === 'loading' && node.duration !== undefined) {
    html += `
      <div class="form-group">
        <label>Duração (ms)</label>
        <input type="number" id="propDuration" value="${node.duration || 2400}" min="500" max="10000" />
      </div>
    `;
  }

  // Options section
  if (node.options && node.options.length > 0) {
    html += `
      <hr style="border:0;border-top:1px solid var(--border);margin:16px 0;" />
      <div style="font-size:12px;color:var(--text-muted);font-weight:700;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px;">Opções de Resposta</div>
    `;
    node.options.forEach((opt, i) => {
      html += `
        <div style="background:var(--bg-dark);padding:10px;border-radius:6px;margin-bottom:8px;border:1px solid var(--border);">
          <div style="font-size:11px;color:var(--text-muted);margin-bottom:6px;">Opção ${String.fromCharCode(65 + i)}</div>
          <div class="form-group" style="margin-bottom:6px;">
            <label>Texto</label>
            <input type="text" id="propOptText_${i}" value="${escHtml(opt.text || '')}" />
          </div>
          <div class="form-group" style="margin-bottom:6px;">
            <label>Tag / Hint</label>
            <input type="text" id="propOptHint_${i}" value="${escHtml(opt.hint || '')}" placeholder="ex: discovery, roi, monitoring..." />
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label>Pontuação (peso)</label>
            <input type="number" id="propOptScore_${i}" value="${opt.score || 0}" min="0" max="100" />
          </div>
        </div>
      `;
    });

    html += `<button id="btnAddOption" style="width:100%;padding:8px;background:transparent;border:1px dashed var(--border);color:var(--text-muted);border-radius:6px;font-size:12px;cursor:pointer;margin-top:4px;">+ Adicionar Opção</button>`;
  }

  container.innerHTML = html;

  // --- Listeners ---

  bindInput('propTitle', val => { node.title = val; refresh(node.id); });
  bindInput('propSubtitle', val => { node.subtitle = val; refresh(node.id); });
  bindInput('propBtn', val => { node.buttonText = val; });
  bindInput('propDuration', val => { node.duration = parseInt(val); });

  if (node.options) {
    node.options.forEach((opt, i) => {
      bindInput(`propOptText_${i}`, val => { opt.text = val; refresh(node.id); });
      bindInput(`propOptHint_${i}`, val => { opt.hint = val; refresh(node.id); });
      bindInput(`propOptScore_${i}`, val => { opt.score = parseInt(val) || 0; });
    });

    const addOptBtn = document.getElementById('btnAddOption');
    if (addOptBtn) {
      addOptBtn.addEventListener('click', () => {
        const idx = node.options.length;
        node.options.push({ text: `Opção ${String.fromCharCode(65 + idx)}`, hint: '', score: 0, next: null });
        updateInspector();
        renderAllNodes();
      });
    }
  }
}

function bindInput(id, onChange) {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', (e) => onChange(e.target.value));
}

function refresh(nodeId) {
  renderAllNodes();
  renderConnections();
  // Keep selection
  const el = document.getElementById(`node-${nodeId}`);
  if (el) el.classList.add('selected');
}

function escHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
