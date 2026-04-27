let isDragging = false;
let startX, startY;

function initCanvas() {
  const wrapper = document.getElementById('canvasWrapper');
  const panZoom = document.getElementById('canvasPanZoom');

  // Pan
  wrapper.addEventListener('mousedown', (e) => {
    if (e.target.closest('.flow-node') || e.target.closest('.handle')) return;
    isDragging = true;
    startX = e.clientX - builderState.transform.x;
    startY = e.clientY - builderState.transform.y;
    wrapper.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    builderState.transform.x = e.clientX - startX;
    builderState.transform.y = e.clientY - startY;
    updateTransform();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    wrapper.style.cursor = 'grab';
  });

  // Zoom
  wrapper.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomSensitivity = 0.001;
    const delta = -e.deltaY * zoomSensitivity;
    
    let newScale = builderState.transform.scale * Math.exp(delta);
    newScale = Math.min(Math.max(0.2, newScale), 2); // Clamp between 0.2 and 2

    // To zoom towards mouse pointer:
    const rect = wrapper.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    builderState.transform.x = mouseX - (mouseX - builderState.transform.x) * (newScale / builderState.transform.scale);
    builderState.transform.y = mouseY - (mouseY - builderState.transform.y) * (newScale / builderState.transform.scale);
    builderState.transform.scale = newScale;

    updateTransform();
  }, { passive: false });

  updateTransform();
}

function updateTransform() {
  const panZoom = document.getElementById('canvasPanZoom');
  panZoom.style.transform = `translate(${builderState.transform.x}px, ${builderState.transform.y}px) scale(${builderState.transform.scale})`;
  
  // Update zoom label
  const zoomLabel = document.querySelector('.canvas-zoom');
  if (zoomLabel) {
    zoomLabel.textContent = `${Math.round(builderState.transform.scale * 100)}%`;
  }

  renderConnections();
}

// Toolbar functionality
function initToolbar() {
  const wrapper = document.getElementById('canvasWrapper');
  const toolbar = document.querySelector('.canvas-toolbar');
  if (!toolbar) return;

  const btnZoomOut = toolbar.querySelector('button[title="Zoom out"]');
  const btnZoomIn = toolbar.querySelector('button[title="Zoom in"]');
  const btnCenter = toolbar.querySelector('button[title="Centralizar"]');

  btnZoomOut?.addEventListener('click', () => {
    builderState.transform.scale = Math.max(0.2, builderState.transform.scale - 0.1);
    updateTransform();
  });

  btnZoomIn?.addEventListener('click', () => {
    builderState.transform.scale = Math.min(2, builderState.transform.scale + 0.1);
    updateTransform();
  });

  btnCenter?.addEventListener('click', () => {
    builderState.transform.x = 60;
    builderState.transform.y = 60;
    builderState.transform.scale = 0.85;
    updateTransform();
  });
}

// Chamar initToolbar no final do initCanvas
function initCanvasWithToolbar() {
  initCanvas();
  initToolbar();
}
