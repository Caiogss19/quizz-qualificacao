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
    <div style="margin-bottom:16px;font-size:13px;font-weight:600;color:var(--text-main); display:flex; justify-content:space-between; align-items:center;">
      <span>🔧 Nó: <code style="background:var(--bg-dark);padding:2px 6px;border-radius:3px;font-size:11px;">${node.id}</code></span>
    </div>
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
  
  if (node.tag !== undefined) {
    html += `
      <div class="form-group">
        <label>Tag (ex: Passo 1)</label>
        <input type="text" id="propTag" value="${escHtml(node.tag || '')}" placeholder="Tag" />
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

  if (node.type === 'result') {
    html += `
      <div class="form-group">
        <label>Texto do Botão (CTA)</label>
        <input type="text" id="propCta" value="${escHtml(node.cta || '')}" placeholder="Ex: Conhecer Solução" />
      </div>
      <div class="form-group">
        <label>URL do Botão</label>
        <input type="text" id="propUrl" value="${escHtml(node.url || '')}" placeholder="https://..." />
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
        <div style="background:var(--bg-dark);padding:10px;border-radius:6px;margin-bottom:8px;border:1px solid var(--border);position:relative;">
          <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
            <div style="font-size:11px;color:var(--text-muted);">Opção ${String.fromCharCode(65 + i)}</div>
            <button class="btn-remove-opt" data-idx="${i}" style="background:none;border:none;color:#ff4444;cursor:pointer;font-size:11px;">✕ Remover</button>
          </div>
          <div style="display:flex; gap:8px;">
            <div class="form-group" style="margin-bottom:6px; width:50px; flex-shrink:0;">
              <label>Ícone</label>
              <input type="text" id="propOptIcon_${i}" value="${escHtml(opt.icon || '')}" placeholder="Emoji" />
            </div>
            <div class="form-group" style="margin-bottom:6px; flex-grow:1;">
              <label>Texto</label>
              <input type="text" id="propOptText_${i}" value="${escHtml(opt.text || '')}" />
            </div>
          </div>
          <div style="display:flex; gap:8px;">
            <div class="form-group" style="margin-bottom:0; flex-grow:1;">
              <label>Tag / Hint</label>
              <input type="text" id="propOptHint_${i}" value="${escHtml(opt.hint || '')}" placeholder="ex: discovery, roi..." />
            </div>
            <div class="form-group" style="margin-bottom:0; width:60px; flex-shrink:0;">
              <label>Valor</label>
              <input type="number" id="propOptScore_${i}" value="${opt.score || 0}" min="0" max="100" />
            </div>
          </div>
        </div>
      `;
    });

    html += `<button id="btnAddOption" style="width:100%;padding:8px;background:transparent;border:1px dashed var(--border);color:var(--text-muted);border-radius:6px;font-size:12px;cursor:pointer;margin-top:4px;">+ Adicionar Opção</button>`;
  }

  // Solutions section for Result node
  if (node.type === 'result' && node.solutions) {
    html += `
      <hr style="border:0;border-top:1px solid var(--border);margin:16px 0;" />
      <div style="font-size:12px;color:var(--text-muted);font-weight:700;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px;">Soluções / Benefícios</div>
    `;
    node.solutions.forEach((sol, i) => {
      html += `
        <div style="background:var(--bg-dark);padding:10px;border-radius:6px;margin-bottom:8px;border:1px solid var(--border);position:relative;">
          <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
            <div style="font-size:11px;color:var(--text-muted);">Solução ${i+1}</div>
            <button class="btn-remove-sol" data-idx="${i}" style="background:none;border:none;color:#ff4444;cursor:pointer;font-size:11px;">✕ Remover</button>
          </div>
          <div style="display:flex; gap:8px;">
            <div class="form-group" style="margin-bottom:6px; width:50px; flex-shrink:0;">
              <label>Ícone</label>
              <input type="text" id="propSolIcon_${i}" value="${escHtml(sol.icon || '')}" placeholder="Emoji" />
            </div>
            <div class="form-group" style="margin-bottom:6px; flex-grow:1;">
              <label>Título</label>
              <input type="text" id="propSolName_${i}" value="${escHtml(sol.name || '')}" placeholder="Nome da solução" />
            </div>
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label>Descrição</label>
            <input type="text" id="propSolDesc_${i}" value="${escHtml(sol.desc || '')}" placeholder="Breve descrição" />
          </div>
        </div>
      `;
    });
    html += `<button id="btnAddSolution" style="width:100%;padding:8px;background:transparent;border:1px dashed var(--border);color:var(--text-muted);border-radius:6px;font-size:12px;cursor:pointer;margin-top:4px;">+ Adicionar Solução</button>`;
  }

  // Delete node button
  if (nodeId !== 'start') {
    html += `
      <hr style="border:0;border-top:1px solid var(--border);margin:24px 0 16px;" />
      <button id="btnDeleteNode" style="width:100%;padding:10px;background:rgba(255,0,0,0.1);border:1px solid rgba(255,0,0,0.2);color:#ff4444;border-radius:6px;font-size:13px;cursor:pointer;font-weight:600;">Excluir Nó</button>
    `;
  }

  container.innerHTML = html;

  // --- Listeners ---

  bindInput('propTitle', val => { node.title = val; refresh(node.id); });
  bindInput('propSubtitle', val => { node.subtitle = val; refresh(node.id); });
  bindInput('propTag', val => { node.tag = val; refresh(node.id); });
  bindInput('propBtn', val => { node.buttonText = val; refresh(node.id); });
  bindInput('propDuration', val => { node.duration = parseInt(val); refresh(node.id); });

  if (node.type === 'result') {
    bindInput('propCta', val => { node.cta = val; refresh(node.id); });
    bindInput('propUrl', val => { node.url = val; refresh(node.id); });
    
    if (node.solutions) {
      node.solutions.forEach((sol, i) => {
        bindInput(`propSolIcon_${i}`, val => { sol.icon = val; refresh(node.id); });
        bindInput(`propSolName_${i}`, val => { sol.name = val; refresh(node.id); });
        bindInput(`propSolDesc_${i}`, val => { sol.desc = val; refresh(node.id); });
      });

      const addSolBtn = document.getElementById('btnAddSolution');
      if (addSolBtn) {
        addSolBtn.addEventListener('click', () => {
          node.solutions.push({ icon: '✅', name: 'Nova Solução', desc: 'Descrição' });
          updateInspector();
          refresh(node.id);
        });
      }

      document.querySelectorAll('.btn-remove-sol').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.target.dataset.idx);
          node.solutions.splice(idx, 1);
          updateInspector();
          refresh(node.id);
        });
      });
    }
  }

  if (node.options) {
    node.options.forEach((opt, i) => {
      bindInput(`propOptIcon_${i}`, val => { opt.icon = val; refresh(node.id); });
      bindInput(`propOptText_${i}`, val => { opt.text = val; refresh(node.id); });
      bindInput(`propOptHint_${i}`, val => { opt.hint = val; refresh(node.id); });
      bindInput(`propOptScore_${i}`, val => { opt.score = parseInt(val) || 0; });
    });

    const addOptBtn = document.getElementById('btnAddOption');
    if (addOptBtn) {
      addOptBtn.addEventListener('click', () => {
        const idx = node.options.length;
        node.options.push({ text: `Nova Opção`, hint: '', score: 0, next: null, icon: '✨' });
        updateInspector();
        refresh(node.id);
      });
    }

    document.querySelectorAll('.btn-remove-opt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.idx);
        // Remove connections from this option
        builderState.connections = builderState.connections.filter(c => !(c.from === nodeId && c.fromOption === idx));
        // Shift remaining connection option indexes
        builderState.connections.forEach(c => {
          if (c.from === nodeId && c.fromOption > idx) {
            c.fromOption--;
          }
        });
        node.options.splice(idx, 1);
        updateInspector();
        refresh(node.id);
      });
    });
  }

  const btnDeleteNode = document.getElementById('btnDeleteNode');
  if (btnDeleteNode) {
    btnDeleteNode.addEventListener('click', () => {
      if(confirm('Excluir este nó?')) {
        delete builderState.nodes[nodeId];
        // Remove all connections from/to this node
        builderState.connections = builderState.connections.filter(c => c.from !== nodeId && c.to !== nodeId);
        // Also remove references in other nodes
        Object.values(builderState.nodes).forEach(n => {
          if (n.next === nodeId) n.next = null;
          if (n.options) n.options.forEach(o => { if (o.next === nodeId) o.next = null; });
        });
        builderState.selectedNodeId = null;
        updateInspector();
        renderAllNodes();
        renderConnections();
      }
    });
  }
}

function bindInput(id, onChange) {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', (e) => onChange(e.target.value));
}

function refresh(nodeId) {
  renderAllNodes();
  renderConnections();
  const el = document.getElementById(`node-${nodeId}`);
  if (el) el.classList.add('selected');
}

function escHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
