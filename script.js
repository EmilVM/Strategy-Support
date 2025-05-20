
const panels = document.querySelectorAll('.panel');
const container = document.querySelector('.panels-container');
let currentIdx = 0;

function goToPanel(idx) {
  if (idx < 0 || idx >= panels.length) return;
  container.style.transform = `translateY(-${idx * window.innerHeight}px)`;
  currentIdx = idx;
}

function updatePanelsContainerHeight() {
  container.style.height = `${panels.length * window.innerHeight}px`;
  // Also recalc current translateY so it's correct after resize
  container.style.transform = `translateY(-${currentIdx * window.innerHeight}px)`;
}
window.addEventListener('resize', updatePanelsContainerHeight);
updatePanelsContainerHeight();

// Arrow keys
document.addEventListener('keydown', (e) => {
  if ((e.key === 'ArrowRight' || e.key === 'ArrowDown') && currentIdx < panels.length - 1) {
    goToPanel(currentIdx + 1);
  }
  if ((e.key === 'ArrowLeft' || e.key === 'ArrowUp') && currentIdx > 0) {
    goToPanel(currentIdx - 1);
  }
});

// Mouse wheel
let lastScrollTime = 0;
document.addEventListener('wheel', (e) => {
  const now = Date.now();
  if (now - lastScrollTime < 700) return;
  lastScrollTime = now;

  if(e.deltaY > 0 && currentIdx < panels.length - 1) {
    goToPanel(currentIdx + 1);
  } else if(e.deltaY < 0 && currentIdx > 0) {
    goToPanel(currentIdx - 1);
  }
});
