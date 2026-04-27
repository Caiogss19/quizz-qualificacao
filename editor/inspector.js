function initInspector() {
  // Inicialização se necessário
}

function updateInspector() {
  const container = document.getElementById('inspectorBody');
  const nodeId = builderState.selectedNodeId;
  const node = builderState.nodes[nodeId];

  if (!node) {
    container.innerHTML = `
      <div class="empty-state">
        <div style="font-size: 24px; margin-bottom: 12px; opacity: 0.5;">⚡</div>
        Selecione um nó no canvas para editar suas propriedades.
      </div>
    `;
    return;
  }

  container.innerHTML = ''; // Limpa para reconstruir

  // 1. Header do Nó no Inspector
  const header = document.createElement('div');
  header.className = 'inspector-section';
  header.innerHTML = `
    <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-size:16px;">${getTypeIcon(node.type)}</span>
        <div>
            <div style="font-size:14px; font-weight:600; color:var(--fg-1);">${getTypeLabel(node.type)}</div>
            <div style="font-family:var(--font-mono); font-size:9px; color:var(--fg-3);">${node.id}</div>
        </div>
    </div>
  `;
  container.appendChild(header);

  // 2. Seção Básica
  const basicSection = createInspectorSection('Configuração Geral');
  addInput(basicSection, 'Título', 'propTitle', node.title || '', 'Ex: Qual seu perfil?', val => { node.title = val; refresh(node.id); });
  
  if (node.subtitle !== undefined) {
    addInput(basicSection, 'Subtítulo', 'propSubtitle', node.subtitle || '', 'Descrição auxiliar...', val => { node.subtitle = val; refresh(node.id); });
  }
  
  addInput(basicSection, 'Tag do Nó (Opcional)', 'propTag', node.tag || '', 'Ex: Fluxo A', val => { node.tag = val; refresh(node.id); });
  container.appendChild(basicSection);

  // 3. Seções Específicas por Tipo
  if (node.type === 'question') {
    const logicSection = createInspectorSection('Lógica de Dados');
    addInput(logicSection, 'ID da Variável (Data Key)', 'propVarName', node.varName || '', 'ex: faturamento', val => { node.varName = val; refresh(node.id); });
    container.appendChild(logicSection);
  }

  if (node.type === 'loading') {
    const timeSection = createInspectorSection('Tempo de Espera');
    addInput(timeSection, 'Duração (ms)', 'propDuration', node.duration || 2000, '', val => { node.duration = parseInt(val); refresh(node.id); }, 'number');
    container.appendChild(timeSection);
  }

  if (node.type === 'webhook') {
    const webhookSection = createInspectorSection('Configuração n8n / Webhook');
    addInput(webhookSection, 'URL do Webhook', 'propWebhookUrl', node.webhookUrl || '', 'https://n8n.exemplo.com/...', val => { node.webhookUrl = val; refresh(node.id); });
    container.appendChild(webhookSection);
  }

  if (node.type === 'result') {
    const resultSection = createInspectorSection('Conteúdo do Resultado');
    addInput(resultSection, 'Título', 'propTitleResult', node.title || '', 'Ex: Sprout Social', val => { node.title = val; refresh(node.id); });
    addInput(resultSection, 'Badge / Selo', 'propBadge', node.badge || '', 'Ex: 📈 Alta Performance', val => { node.badge = val; refresh(node.id); });
    
    const descGroup = document.createElement('div');
    descGroup.className = 'form-group';
    descGroup.innerHTML = `
        <label>Descrição do Resultado</label>
        <textarea id="propDescription" style="height:80px;">${escHtml(node.description || '')}</textarea>
    `;
    resultSection.appendChild(descGroup);
    bindInput('propDescription', val => { node.description = val; refresh(node.id); });

    const ctaSection = createInspectorSection('Call to Action');
    addInput(ctaSection, 'Texto do Botão', 'propCta', node.cta || '', 'Ex: Falar com Especialista', val => { node.cta = val; refresh(node.id); });
    addInput(ctaSection, 'Link de Destino', 'propUrl', node.url || '', 'https://...', val => { node.url = val; refresh(node.id); });
    container.appendChild(resultSection);
    
    if (!node.solutions) node.solutions = [];
    renderIterableSection(container, 'Soluções / Diferenciais', node.solutions, (sol, i) => {
        return `
            <div class="form-group">
                <label>Nome da Solução</label>
                <input type="text" id="solName_${i}" value="${escHtml(sol.name || '')}" />
            </div>
            <div class="form-group">
                <label>Descrição curta</label>
                <input type="text" id="solDesc_${i}" value="${escHtml(sol.desc || '')}" />
            </div>
        `;
    }, (i) => {
        bindInput(`solName_${i}`, val => { node.solutions[i].name = val; refresh(node.id); });
        bindInput(`solDesc_${i}`, val => { node.solutions[i].desc = val; refresh(node.id); });
    }, () => {
        node.solutions.push({ name: 'Nova Solução', desc: 'Breve descrição...' });
        updateInspector();
        refresh(node.id);
    }, (i) => {
        node.solutions.splice(i, 1);
        updateInspector();
        refresh(node.id);
    });

    container.appendChild(ctaSection);
  }

  // 4. Seção de Opções (Iterável)
  if (node.options) {
    renderIterableSection(container, 'Opções de Resposta', node.options, (item, i) => {
        return `
            <div class="input-row">
                <div class="form-group" style="flex:0 0 50px;">
                    <label>Ícone</label>
                    <input type="text" id="optIcon_${i}" value="${escHtml(item.icon || '')}" placeholder="✨" />
                </div>
                <div class="form-group">
                    <label>Texto da Opção</label>
                    <input type="text" id="optText_${i}" value="${escHtml(item.text || '')}" />
                </div>
            </div>
            <div class="input-row">
                <div class="form-group">
                    <label>Tag (Interna)</label>
                    <input type="text" id="optHint_${i}" value="${escHtml(item.hint || '')}" placeholder="ex: pme" />
                </div>
                <div class="form-group" style="flex:0 0 70px;">
                    <label>Score</label>
                    <input type="number" id="optScore_${i}" value="${item.score || 0}" />
                </div>
            </div>
        `;
    }, (i) => {
        // Bindings
        bindInput(`optIcon_${i}`, val => { node.options[i].icon = val; refresh(node.id); });
        bindInput(`optText_${i}`, val => { node.options[i].text = val; refresh(node.id); });
        bindInput(`optHint_${i}`, val => { node.options[i].hint = val; refresh(node.id); });
        bindInput(`optScore_${i}`, val => { node.options[i].score = parseInt(val) || 0; });
    }, () => {
        node.options.push({ text: 'Nova Opção', hint: '', score: 0, next: null, icon: '🔹' });
        updateInspector();
        refresh(node.id);
    }, (i) => {
        builderState.connections = builderState.connections.filter(c => !(c.from === nodeId && c.fromOption === i));
        builderState.connections.forEach(c => { if (c.from === nodeId && c.fromOption > i) c.fromOption--; });
        node.options.splice(i, 1);
        updateInspector();
        refresh(node.id);
    });
  }

  // 5. Seção de Campos (Lead Form)
  if (node.type === 'lead_form') {
    const leadFormSection = createInspectorSection('Configuração do Formulário');
    addInput(leadFormSection, 'Texto do Botão (CTA)', 'propButtonText', node.buttonText || 'Continuar', 'Ex: Começar diagnóstico!', val => { node.buttonText = val; refresh(node.id); });
    container.appendChild(leadFormSection);
    
    if (node.fields) {
      renderIterableSection(container, 'Campos do Formulário', node.fields, (field, i) => {
        return `
            <div class="form-group">
                <label>ID da Variável</label>
                <input type="text" id="fieldId_${i}" value="${escHtml(field.id || '')}" placeholder="ex: nome_completo" />
            </div>
            <div class="input-row">
                <div class="form-group">
                    <label>Label</label>
                    <input type="text" id="fieldLabel_${i}" value="${escHtml(field.label || '')}" />
                </div>
                <div class="form-group" style="flex:0 0 90px;">
                    <label>Tipo</label>
                    <select id="fieldType_${i}">
                        <option value="text" ${field.type === 'text' ? 'selected' : ''}>Texto</option>
                        <option value="email" ${field.type === 'email' ? 'selected' : ''}>E-mail</option>
                        <option value="tel" ${field.type === 'tel' ? 'selected' : ''}>WhatsApp</option>
                    </select>
                </div>
            </div>
            <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
                <input type="checkbox" id="fieldReq_${i}" ${field.required ? 'checked' : ''} style="width:auto;" />
                <label for="fieldReq_${i}" style="font-size:11px;">Obrigatório</label>
            </div>
        `;
    }, (i) => {
        bindInput(`fieldId_${i}`, val => { node.fields[i].id = val; refresh(node.id); });
        bindInput(`fieldLabel_${i}`, val => { node.fields[i].label = val; refresh(node.id); });
        document.getElementById(`fieldType_${i}`).onchange = (e) => { node.fields[i].type = e.target.value; refresh(node.id); };
        document.getElementById(`fieldReq_${i}`).onchange = (e) => { node.fields[i].required = e.target.checked; refresh(node.id); };
    }, () => {
        node.fields.push({ id: `campo_${Date.now().toString().slice(-3)}`, label: 'Novo Campo', type: 'text', placeholder: '', required: false });
        updateInspector();
        refresh(node.id);
    }, (i) => {
        node.fields.splice(i, 1);
        updateInspector();
        refresh(node.id);
    });
  }

  // 6. Botão de Excluir Nó (Final)
  if (node.id !== 'start') {
    const footer = document.createElement('div');
    footer.style.padding = '20px 0';
    footer.innerHTML = `
        <button id="btnDeleteNode" style="width:100%; padding:12px; background:rgba(217,122,122,0.05); border:1px solid rgba(217,122,122,0.2); color:var(--sm-danger); border-radius:var(--radius-md); font-size:13px; font-weight:600; cursor:pointer;">
            Excluir Nó permanentemente
        </button>
    `;
    container.appendChild(footer);

    document.getElementById('btnDeleteNode').onclick = () => {
        if (confirm('Deseja realmente excluir este nó e todas as suas conexões?')) {
            delete builderState.nodes[nodeId];
            builderState.connections = builderState.connections.filter(c => c.from !== nodeId && c.to !== nodeId);
            builderState.selectedNodeId = null;
            updateInspector();
            renderAllNodes();
            renderConnections();
        }
    };
  }
}

// --- Helpers de UI do Inspector ---

function createInspectorSection(title) {
    const sec = document.createElement('div');
    sec.className = 'inspector-section';
    sec.innerHTML = `<div class="inspector-section-title">${title}</div>`;
    return sec;
}

function addInput(parent, label, id, value, placeholder, onChange, type = 'text') {
    const group = document.createElement('div');
    group.className = 'form-group';
    group.innerHTML = `
        <label>${label}</label>
        <input type="${type}" id="${id}" value="${escHtml(value)}" placeholder="${placeholder}" />
    `;
    parent.appendChild(group);
    bindInput(id, onChange);
}

function renderIterableSection(container, title, list, itemHtmlFn, bindFn, addFn, removeFn) {
    const sec = createInspectorSection(title);
    
    list.forEach((item, i) => {
        const card = document.createElement('div');
        card.className = 'inspector-item-card';
        card.innerHTML = `
            <div class="item-card-header">
                <span class="item-card-num">#${i + 1}</span>
                <button class="btn-icon-danger" data-idx="${i}">✕</button>
            </div>
            ${itemHtmlFn(item, i)}
        `;
        sec.appendChild(card);
        
        // Bind remove
        card.querySelector('.btn-icon-danger').onclick = () => removeFn(i);
        // Bind custom inputs
        bindFn(i);
    });

    const addBtn = document.createElement('button');
    addBtn.className = 'btn-add-item';
    addBtn.innerText = `+ Adicionar ${title.split(' ')[0]}`;
    addBtn.onclick = addFn;
    sec.appendChild(addBtn);

    container.appendChild(sec);
}

function bindInput(id, onChange) {
  const el = document.getElementById(id);
  if (el) {
    el.oninput = (e) => onChange(e.target.value);
  }
}

function refresh(nodeId) {
  renderAllNodes();
  renderConnections();
  // Mantém o nó visualmente selecionado após o refresh
  const el = document.getElementById(`node-${nodeId}`);
  if (el) el.classList.add('selected');
}

function escHtml(str) {
  if (!str && str !== 0) return '';
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
