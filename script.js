
const navLinks = document.querySelectorAll('nav a');
const panels = document.querySelectorAll('.panel');

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

// Optional: Arrow key navigation
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
