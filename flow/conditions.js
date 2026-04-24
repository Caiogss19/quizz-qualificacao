/**
 * Conditions module:
 * Handles the logic for conditional connections.
 * Types: "always" | "if_answer" | "if_score"
 */

const CONDITION_TYPES = {
  ALWAYS: 'always',
  IF_ANSWER: 'if_answer',
  IF_SCORE: 'if_score'
};

/**
 * Add a connection between two nodes with a condition.
 * @param {string} fromNodeId - Source node ID
 * @param {string} toNodeId - Target node ID
 * @param {number|null} fromOption - Option index (null for node-level connection)
 * @param {object} condition - { type, value } 
 */
function addConnection(fromNodeId, toNodeId, fromOption = null, condition = { type: CONDITION_TYPES.ALWAYS }) {
  // Remove existing connection from same source
  builderState.connections = builderState.connections.filter(c => {
    if (fromOption !== null) {
      return !(c.from === fromNodeId && c.fromOption === fromOption);
    }
    return !(c.from === fromNodeId && c.fromOption === null);
  });

  builderState.connections.push({
    from: fromNodeId,
    to: toNodeId,
    fromOption,
    condition
  });

  // Also update the node's data for persistence
  const node = builderState.nodes[fromNodeId];
  if (node && fromOption !== null && node.options) {
    node.options[fromOption].next = toNodeId;
  } else if (node && fromOption === null) {
    node.next = toNodeId;
  }

  renderConnections();
}

/**
 * Remove a connection.
 */
function removeConnection(fromNodeId, fromOption = null) {
  builderState.connections = builderState.connections.filter(c => {
    if (fromOption !== null) {
      return !(c.from === fromNodeId && c.fromOption === fromOption);
    }
    return !(c.from === fromNodeId && c.fromOption === null);
  });
  renderConnections();
}

/**
 * Add a new empty node to the builder canvas.
 * @param {string} type - Node type (question|lead_form|loading|result)
 */
function addNewNode(type = 'question') {
  const id = `node_${Date.now()}`;
  const newNode = {
    id,
    type,
    title: 'Novo Nó',
    subtitle: 'Clique para editar',
    tag: 'Novo',
    editor: {
      x: Math.random() * 400 + 200,
      y: Math.random() * 300 + 100
    }
  };

  if (type === 'question') {
    newNode.options = [
      { text: 'Opção A', hint: '', icon: '🌟', next: null },
      { text: 'Opção B', hint: '', icon: '🚀', next: null }
    ];
  }

  builderState.nodes[id] = newNode;
  renderAllNodes();
  renderConnections();

  // Select the new node
  builderState.selectedNodeId = id;
  return id;
}
