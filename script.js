const panels = document.querySelectorAll('.panel');
const container = document.querySelector('.panels-container');
const caseParagraphs = document.querySelectorAll('.case-paragraph');
let currentIdx = 0;
let scrollProgress = 0; // Track how many case paragraphs are visible (0-4)
let isInCasesPanel = false;

function goToPanel(idx) {
  if (idx < 0 || idx >= panels.length) return;
  container.style.transform = `translateY(-${idx * window.innerHeight}px)`;
  currentIdx = idx;

  if (idx !== 3) {
    isInCasesPanel = false;
    scrollProgress = 0;
    updateCasesAnimations();
  } else {
    isInCasesPanel = true;
  }
}

function updateCasesAnimations() {
  caseParagraphs.forEach((paragraph, index) => {
    if (scrollProgress > index) {
      paragraph.classList.add('visible');
    } else {
      paragraph.classList.remove('visible');
    }
  });
}

function updatePanelsContainerHeight() {
  container.style.height = `${panels.length * window.innerHeight}px`;
  container.style.transform = `translateY(-${currentIdx * window.innerHeight}px)`;
}
window.addEventListener('resize', updatePanelsContainerHeight);
updatePanelsContainerHeight();

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (isInCasesPanel) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      if (scrollProgress < caseParagraphs.length) {
        scrollProgress += 1;
        updateCasesAnimations();
      } else if (currentIdx < panels.length - 1) {
        goToPanel(currentIdx + 1);
      }
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      if (scrollProgress > 0) {
        scrollProgress -= 1;
        updateCasesAnimations();
      } else if (currentIdx > 0) {
        goToPanel(currentIdx - 1);
        // On returning to cases from contact, hide all
        if (currentIdx === 4) {
          scrollProgress = 0;
          updateCasesAnimations();
        }
      }
    }
  } else {
    if ((e.key === 'ArrowRight' || e.key === 'ArrowDown') && currentIdx < panels.length - 1) {
      if (currentIdx === 2) {
        scrollProgress = 1;
        updateCasesAnimations();
      }
      goToPanel(currentIdx + 1);
    }
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowUp') && currentIdx > 0) {
      if (currentIdx === 4) {
        scrollProgress = 0;
        updateCasesAnimations();
      }
      goToPanel(currentIdx - 1);
    }
  }
});

// Mouse wheel
let lastScrollTime = 0;
let scrollAccumulator = 0;
const scrollThreshold = 120; // Lower for snappier feel
let normalPanelScrollAccumulator = 0;
const normalPanelScrollThreshold = 120;

document.addEventListener('wheel', (e) => {
  const now = Date.now();
  if (now - lastScrollTime < 40) return;
  lastScrollTime = now;

  if (isInCasesPanel) {
    scrollAccumulator += Math.abs(e.deltaY);
    if (scrollAccumulator >= scrollThreshold) {
      if (e.deltaY > 0) { // Down
        if (scrollProgress < caseParagraphs.length) {
          scrollProgress += 1;
          updateCasesAnimations();
        } else if (currentIdx < panels.length - 1) {
          goToPanel(currentIdx + 1);
        }
      } else { // Up
        if (scrollProgress > 0) {
          scrollProgress -= 1;
          updateCasesAnimations();
        } else if (currentIdx > 0) {
          goToPanel(currentIdx - 1);
          // On returning to cases from contact, hide all
          if (currentIdx === 4) {
            scrollProgress = 0;
            updateCasesAnimations();
          }
        }
      }
      scrollAccumulator = 0;
    }
  } else {
    normalPanelScrollAccumulator += Math.abs(e.deltaY);
    if (normalPanelScrollAccumulator >= normalPanelScrollThreshold) {
      if (e.deltaY > 0 && currentIdx < panels.length - 1) {
        if (currentIdx === 2) {
          scrollProgress = 1;
          updateCasesAnimations();
        }
        goToPanel(currentIdx + 1);
      } else if (e.deltaY < 0 && currentIdx > 0) {
        if (currentIdx === 4) {
          scrollProgress = 0;
          updateCasesAnimations();
        }
        goToPanel(currentIdx - 1);
      }
      normalPanelScrollAccumulator = 0;
    }
    scrollAccumulator = 0;
  }
});

// Touch/swipe for mobile
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
    if (Math.abs(diff) > 30) {
      if (isInCasesPanel) {
        if (diff > 0) { // Up
          if (scrollProgress < caseParagraphs.length) {
            scrollProgress += 1;
            updateCasesAnimations();
          } else if (currentIdx < panels.length - 1) {
            goToPanel(currentIdx + 1);
          }
        } else { // Down
          if (scrollProgress > 0) {
            scrollProgress -= 1;
            updateCasesAnimations();
          } else if (currentIdx > 0) {
            goToPanel(currentIdx - 1);
            // On returning to cases from contact, hide all
            if (currentIdx === 4) {
              scrollProgress = 0;
              updateCasesAnimations();
            }
          }
        }
      } else {
        if (diff > 0 && currentIdx < panels.length - 1) {
          if (currentIdx === 2) {
            scrollProgress = 1;
            updateCasesAnimations();
          }
          goToPanel(currentIdx + 1);
        } else if (diff < 0 && currentIdx > 0) {
          if (currentIdx === 4) {
            scrollProgress = 0;
            updateCasesAnimations();
          }
          goToPanel(currentIdx - 1);
        }
      }
    }
  }
  touchStartY = null;
  touchEndY = null;
}, false);


