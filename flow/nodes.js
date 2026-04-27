let draggedNode = null;
let dragStartX, dragStartY;

// Drag-to-connect state
let connectingFrom = null; // { nodeId, optionIdx }
let tempLine = null;

function renderAllNodes() {
  const container = document.getElementById('canvasNodes');
  container.innerHTML = '';

  Object.keys(builderState.nodes).forEach(nodeId => {
    const node = builderState.nodes[nodeId];
    const el = createNodeElement(node);
    container.appendChild(el);
  });
}

function createNodeElement(node) {
  const el = document.createElement('div');
  el.className = `flow-node node-type-${node.type}`;
  el.id = `node-${node.id}`;
  el.style.left = `${node.editor?.x || 0}px`;
  el.style.top = `${node.editor?.y || 0}px`;

  if (node.id === builderState.selectedNodeId) {
    el.classList.add('selected');
  }

  let html = `
    <div class="node-accent-bar"></div>
    <div class="node-header">
      <div class="node-icon">${getTypeIcon(node.type)}</div>
      <span class="node-type-badge">${getTypeLabel(node.type)}</span>
    </div>
    <div class="node-body">
      <div class="node-title" title="${node.title || node.id}">${truncate(node.title || node.id, 28)}</div>
      <div class="node-subtitle" title="${node.subtitle || ''}">${truncate(node.subtitle || 'Sem descrição', 40)}</div>
    </div>
  `;

  // Handle Entrada (exceto para o nó inicial)
  if (node.id !== 'start') {
    html += `<div class="handle handle-in" data-nodeid="${node.id}" title="Entrada"></div>`;
  }

  // Options with per-option out handles
  if (node.options && node.options.length > 0) {
    html += `<div class="node-options">`;
    node.options.forEach((opt, i) => {
      html += `
        <div class="node-option" data-optidx="${i}">
          <span class="opt-text">${truncate(opt.text, 22)}</span>
          <div class="handle handle-out" data-nodeid="${node.id}" data-optidx="${i}" title="Conectar"></div>
        </div>
      `;
    });
    html += `</div>`;
  } else if (node.type !== 'result') {
    // Node-level single out handle
    html += `<div class="handle handle-out" data-nodeid="${node.id}" data-optidx="-1" title="Conectar"></div>`;
  }

  // Delete button (somente se não for nó fixo)
  if (node.id !== 'start' && node.id !== 'result') {
    html += `<button class="node-delete" data-nodeid="${node.id}" title="Remover nó">✕</button>`;
  }

  el.innerHTML = html;

  // --- Events ---

  // Node click → select
  el.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('handle') || e.target.classList.contains('node-delete')) return;
    e.stopPropagation();

    document.querySelectorAll('.flow-node').forEach(n => n.classList.remove('selected'));
    el.classList.add('selected');
    builderState.selectedNodeId = node.id;
    updateInspector();

    // Node drag
    draggedNode = node;
    dragStartX = e.clientX / builderState.transform.scale - node.editor.x;
    dragStartY = e.clientY / builderState.transform.scale - node.editor.y;
  });

  // Out handle → start connection drag
  el.querySelectorAll('.handle-out').forEach(handle => {
    handle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const optIdx = parseInt(handle.dataset.optidx);
      connectingFrom = {
        nodeId: node.id,
        optionIdx: optIdx === -1 ? null : optIdx
      };
      createTempLine();
    });
  });

  // Delete button
  const delBtn = el.querySelector('.node-delete');
  if (delBtn) {
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const nid = delBtn.dataset.nodeid;
      delete builderState.nodes[nid];
      builderState.connections = builderState.connections.filter(c => c.from !== nid && c.to !== nid);
      if (builderState.selectedNodeId === nid) {
        builderState.selectedNodeId = null;
        updateInspector();
      }
      renderAllNodes();
      renderConnections();
    });
  }

  return el;
}

// --- Node Dragging ---
window.addEventListener('mousemove', (e) => {
  if (draggedNode) {
    draggedNode.editor.x = e.clientX / builderState.transform.scale - dragStartX;
    draggedNode.editor.y = e.clientY / builderState.transform.scale - dragStartY;

    const el = document.getElementById(`node-${draggedNode.id}`);
    if (el) {
      el.style.left = `${draggedNode.editor.x}px`;
      el.style.top = `${draggedNode.editor.y}px`;
    }
    renderConnections();
  }

  // Update temp line while connecting
  if (connectingFrom && tempLine) {
    const wrapper = document.getElementById('canvasWrapper');
    const rect = wrapper.getBoundingClientRect();
    const x2 = (e.clientX - rect.left - builderState.transform.x) / builderState.transform.scale;
    const y2 = (e.clientY - rect.top - builderState.transform.y) / builderState.transform.scale;
    updateTempLine(x2, y2);
  }
});

window.addEventListener('mouseup', (e) => {
  if (draggedNode) draggedNode = null;

  if (connectingFrom) {
    // Check if released over an in-handle
    const target = e.target.closest('.handle-in');
    if (target) {
      const toNodeId = target.dataset.nodeid;
      if (toNodeId && toNodeId !== connectingFrom.nodeId) {
        addConnection(connectingFrom.nodeId, toNodeId, connectingFrom.optionIdx);
        renderConnections();
      }
    }
    connectingFrom = null;
    removeTempLine();
  }
});

// --- Temp connection line ---
function createTempLine() {
  const svg = document.getElementById('canvasConnections');
  tempLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  tempLine.setAttribute('class', 'connection-path temp-line');
  tempLine.style.stroke = '#6366f1';
  tempLine.style.strokeDasharray = '6 3';
  svg.appendChild(tempLine);
}

function updateTempLine(x2, y2) {
  if (!tempLine || !connectingFrom) return;

  let fromSelector;
  if (connectingFrom.optionIdx !== null) {
    fromSelector = `#node-${connectingFrom.nodeId} .node-option:nth-child(${connectingFrom.optionIdx + 1}) .handle-out`;
  } else {
    fromSelector = `#node-${connectingFrom.nodeId} > .handle-out`;
  }

  const fromEl = document.querySelector(fromSelector);
  if (!fromEl) return;

  const containerRect = document.getElementById('canvasNodes').getBoundingClientRect();
  const fromRect = fromEl.getBoundingClientRect();
  const scale = builderState.transform.scale;

  const x1 = (fromRect.left + fromRect.width / 2 - containerRect.left) / scale;
  const y1 = (fromRect.top + fromRect.height / 2 - containerRect.top) / scale;

  const dx = Math.abs(x2 - x1) * 0.5;
  const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
  tempLine.setAttribute('d', d);
}

function removeTempLine() {
  if (tempLine) {
    tempLine.remove();
    tempLine = null;
  }
}

// --- Helpers ---
function truncate(str, n) {
  if (!str) return '';
  return str.length > n ? str.substring(0, n) + '…' : str;
}

function getTypeLabel(type) {
  const map = { 
    start: 'Gatilho (Start)',
    lead_form: 'Captura (Lead)', 
    question: 'Pergunta', 
    loading: 'Processamento', 
    webhook: 'Integração (Webhook)',
    result: 'Conversão (Fim)' 
  };
  return map[type] || type;
}

function getTypeIcon(type) {
  const map = { 
    start: '⚡', 
    lead_form: '👤', 
    question: '🔹', 
    loading: '⏳', 
    webhook: '🔗',
    result: '🎯' 
  };
  return map[type] || '📄';
}

function getNodeColor(type) {
  const map = { lead_form: '#22c55e', question: '#6366f1', loading: '#f59e0b', result: '#ec4899' };
  return map[type] || '#64748b';
}
