let renderRequested = false;

function renderConnections() {
  if (renderRequested) return;
  renderRequested = true;
  
  requestAnimationFrame(() => {
    const svg = document.getElementById('canvasConnections');
    if (!svg) { renderRequested = false; return; }
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
        const containerRect = document.getElementById('canvasNodes').getBoundingClientRect();
        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();

        const scale = builderState.transform.scale;
        const x1 = (fromRect.left + fromRect.width / 2 - containerRect.left) / scale;
        const y1 = (fromRect.top + fromRect.height / 2 - containerRect.top) / scale;
        const x2 = (toRect.left + toRect.width / 2 - containerRect.left) / scale;
        const y2 = (toRect.top + toRect.height / 2 - containerRect.top) / scale;

        // Draw Dot at Start
        const dotStart = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dotStart.setAttribute('cx', x1);
        dotStart.setAttribute('cy', y1);
        dotStart.setAttribute('r', 3);
        dotStart.setAttribute('class', 'connection-dot');
        svg.appendChild(dotStart);

        // Draw Dot at End
        const dotEnd = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dotEnd.setAttribute('cx', x2);
        dotEnd.setAttribute('cy', y2);
        dotEnd.setAttribute('r', 3);
        dotEnd.setAttribute('class', 'connection-dot');
        svg.appendChild(dotEnd);

        // Draw Path
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', 'connection-path');
        
        // n8n-style curvature: more horizontal stretch
        const distance = Math.abs(x2 - x1);
        const horizontalStretch = Math.max(distance * 0.4, 40);
        const d = `M ${x1} ${y1} C ${x1 + horizontalStretch} ${y1}, ${x2 - horizontalStretch} ${y2}, ${x2} ${y2}`;
        path.setAttribute('d', d);
        
        svg.appendChild(path);
      }
    });
    renderRequested = false;
  });
}
