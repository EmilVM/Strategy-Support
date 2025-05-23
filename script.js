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

// Touch/swipe support for mobile
let touchStartY = null;
let touchEndY = null;

container.addEventListener('touchstart', function(e) {
  if (e.touches.length === 1) {
    touchStartY = e.touches[0].clientY;
  }
}, false);

container.addEventListener('touchmove', function(e) {
  if (e.touches.length === 1) {
    touchEndY = e.touches[0].clientY;
  }
}, false);

container.addEventListener('touchend', function(e) {
  if (touchStartY !== null && touchEndY !== null) {
    let diff = touchStartY - touchEndY;
    if (Math.abs(diff) > 40) { // Minimum swipe distance
      if (diff > 0 && currentIdx < panels.length - 1) {
        goToPanel(currentIdx + 1); // Swipe up
      } else if (diff < 0 && currentIdx > 0) {
        goToPanel(currentIdx - 1); // Swipe down
      }
    }
  }
  touchStartY = null;
  touchEndY = null;
}, false);
// --- Case paragraph fly-in/fly-out ---
const caseParagraphs = document.querySelectorAll('.case-paragraph');

const caseObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
}, {
  threshold: 0.3
});

caseParagraphs.forEach(paragraph => caseObserver.observe(paragraph));

