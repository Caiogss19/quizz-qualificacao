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
  renderConnections(); // Optional: might not be needed if connections scale with the container, but good to ensure
}
