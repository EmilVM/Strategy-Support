
const navLinks = document.querySelectorAll('nav a');
const panels = document.querySelectorAll('.panel');

// Click navigation
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const panelId = link.dataset.panel;
    panels.forEach(panel => {
      if(panel.id === panelId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
  });
});

// Arrow key navigation
document.addEventListener('keydown', (e) => {
  const activePanel = document.querySelector('.panel.active');
  let idx = Array.from(panels).indexOf(activePanel);
  if(e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    idx = (idx + 1) % panels.length;
    panels.forEach(panel => panel.classList.remove('active'));
    panels[idx].classList.add('active');
  }
  if(e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    idx = (idx - 1 + panels.length) % panels.length;
    panels.forEach(panel => panel.classList.remove('active'));
    panels[idx].classList.add('active');
  }
});

// Mouse wheel scroll transitions
let lastScrollTime = 0;
document.addEventListener('wheel', (e) => {
  const now = Date.now();
  if (now - lastScrollTime < 800) return; // debounce
  lastScrollTime = now;

  const activePanel = document.querySelector('.panel.active');
  let idx = Array.from(panels).indexOf(activePanel);
  if(e.deltaY > 0) {
    idx = (idx + 1) % panels.length;
  } else if(e.deltaY < 0) {
    idx = (idx - 1 + panels.length) % panels.length;
  }
  panels.forEach(panel => panel.classList.remove('active'));
  panels[idx].classList.add('active');
});
