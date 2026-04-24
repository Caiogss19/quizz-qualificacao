import { builderState } from './builder-main.js';

export function renderConnections() {
  const svg = document.getElementById('canvasConnections');
  if (!svg) return;
  svg.innerHTML = ''; // Clear existing lines

  builderState.connections.forEach(conn => {
    // Determine the from element
    let fromSelector = `#node-${conn.from} > .handle-out`;
    if (conn.fromOption !== null && conn.fromOption !== undefined) {
      fromSelector = `#node-${conn.from} .node-option:nth-child(${conn.fromOption + 1}) .handle-out`;
    }
    
    const toSelector = `#node-${conn.to} .handle-in`;

    const fromEl = document.querySelector(fromSelector);
    const toEl = document.querySelector(toSelector);

    if (fromEl && toEl) {
      // Get positions relative to the canvas nodes container
      const containerRect = document.getElementById('canvasNodes').getBoundingClientRect();
      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();

      // Account for scale to get local coordinates
      const scale = builderState.transform.scale;
      const x1 = (fromRect.left + fromRect.width / 2 - containerRect.left) / scale;
      const y1 = (fromRect.top + fromRect.height / 2 - containerRect.top) / scale;
      const x2 = (toRect.left + toRect.width / 2 - containerRect.left) / scale;
      const y2 = (toRect.top + toRect.height / 2 - containerRect.top) / scale;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('class', 'connection-path');
      
      // Bezier curve
      const dx = Math.abs(x2 - x1) * 0.5;
      const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
      path.setAttribute('d', d);
      
      svg.appendChild(path);
    }
  });
}
