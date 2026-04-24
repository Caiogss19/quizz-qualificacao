// Global builder state - accessible by all modules
var builderState = {
  nodes: {},
  connections: [],
  selectedNodeId: null,
  transform: { x: 60, y: 60, scale: 0.85 },
  pendingConnectionFrom: null // { nodeId, optionIdx } - for drag-to-connect
};

function initBuilder() {
  // Deep clone to avoid mutating the original config
  builderState.nodes = JSON.parse(JSON.stringify(quizJSON.nodes));

  // Assign default positions if missing (auto-layout)
  const layout = autoLayout(builderState.nodes);
  Object.keys(builderState.nodes).forEach(key => {
    if (!builderState.nodes[key].editor) {
      builderState.nodes[key].editor = layout[key] || { x: 100, y: 100 };
    }
  });

  // Extract connections from node data
  extractConnections();

  initCanvas();
  initInspector();
  renderAllNodes();
  renderConnections();

  // Toolbar buttons
  document.getElementById('btnAddNode').addEventListener('click', () => {
    const id = addNewNode('question');
    renderAllNodes();
    renderConnections();
    // Scroll/highlight the new node
    const el = document.getElementById(`node-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  document.getElementById('btnSaveFlow').addEventListener('click', saveFlow);
}

function extractConnections() {
  builderState.connections = [];
  Object.keys(builderState.nodes).forEach(key => {
    const node = builderState.nodes[key];
    if (node.next && builderState.nodes[node.next]) {
      builderState.connections.push({ from: key, to: node.next, fromOption: null });
    }
    if (node.options) {
      node.options.forEach((opt, idx) => {
        if (opt.next && builderState.nodes[opt.next]) {
          builderState.connections.push({ from: key, to: opt.next, fromOption: idx });
        }
      });
    }
  });
}

/**
 * Auto-layout: arrange nodes in a tree-like structure from 'start'.
 */
function autoLayout(nodes) {
  const positions = {};
  const visited = new Set();
  const levelMap = {}; // nodeId -> level (column)
  const rowCountPerLevel = {}; // level -> how many nodes already placed

  function traverse(nodeId, level) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    if (!levelMap[nodeId]) levelMap[nodeId] = level;
    rowCountPerLevel[level] = (rowCountPerLevel[level] || 0) + 1;
    const row = rowCountPerLevel[level] - 1;

    positions[nodeId] = {
      x: level * 340 + 60,
      y: row * 260 + 60
    };

    const node = nodes[nodeId];
    if (!node) return;

    if (node.next) traverse(node.next, level + 1);
    if (node.options) {
      node.options.forEach(opt => {
        if (opt.next) traverse(opt.next, level + 1);
      });
    }
  }

  traverse('start', 0);

  // Position any unvisited nodes at the end
  let fallbackY = 60;
  Object.keys(nodes).forEach(key => {
    if (!positions[key]) {
      positions[key] = { x: 2200, y: fallbackY };
      fallbackY += 240;
    }
  });

  return positions;
}

function saveFlow() {
  // Update the quiz config with builder state (in production, this would persist to backend)
  const exportData = JSON.stringify(builderState.nodes, null, 2);
  
  // Save to localStorage for now
  try {
    localStorage.setItem('sparkmaxx_flow_draft', exportData);
    showToast('✅ Fluxo salvo com sucesso!');
  } catch(e) {
    showToast('❌ Erro ao salvar fluxo.');
  }
}

function showToast(msg) {
  let toast = document.getElementById('builderToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'builderToast';
    toast.style.cssText = `
      position:fixed; bottom:24px; right:24px; background:var(--bg-card);
      border:1px solid var(--border); padding:12px 20px; border-radius:8px;
      font-size:14px; z-index:9999; transition:opacity 0.3s; box-shadow:0 4px 12px rgba(0,0,0,0.4);
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

document.addEventListener('DOMContentLoaded', initBuilder);
