
const navLinks = document.querySelectorAll('nav a');
const panels = document.querySelectorAll('.panel');

// Helper: show a panel with direction (for slide/fade)
function showPanel(newIdx, direction) {
  panels.forEach(panel => {
    panel.classList.remove('active', 'above', 'below');
  });

  // Animate out the current panel
  const oldIdx = Array.from(panels).findIndex(p => p.classList.contains('active'));
  if (oldIdx !== -1 && oldIdx !== newIdx) {
    panels[oldIdx].classList.add(direction === "down" ? 'below' : 'above');
  }

  // Animate in the new panel
  panels[newIdx].classList.add('active');
}

// Nav link clicks
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const panelId = link.dataset.panel;
    const newIdx = Array.from(panels).findIndex(panel => panel.id === panelId);
    const currentIdx = Array.from(panels).findIndex(panel => panel.classList.contains('active'));
    if (newIdx === currentIdx) return;
    const direction = newIdx > currentIdx ? "down" : "up";
    showPanel(newIdx, direction);
  });
});

// Arrow key navigation (no infinite loop)
document.addEventListener('keydown', (e) => {
  const activePanel = document.querySelector('.panel.active');
  let idx = Array.from(panels).indexOf(activePanel);
  if ((e.key === 'ArrowRight' || e.key === 'ArrowDown') && idx < panels.length - 1) {
    showPanel(idx + 1, "down");
  }
  if ((e.key === 'ArrowLeft' || e.key === 'ArrowUp') && idx > 0) {
    showPanel(idx - 1, "up");
  }
});

// Mouse wheel scroll transitions (no infinite loop)
let lastScrollTime = 0;
document.addEventListener('wheel', (e) => {
  const now = Date.now();
  if (now - lastScrollTime < 800) return; // debounce
  lastScrollTime = now;

  const activePanel = document.querySelector('.panel.active');
  let idx = Array.from(panels).indexOf(activePanel);
  if(e.deltaY > 0 && idx < panels.length - 1) {
    showPanel(idx + 1, "down");
  } else if(e.deltaY < 0 && idx > 0) {
    showPanel(idx - 1, "up");
  }
});
