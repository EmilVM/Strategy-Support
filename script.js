const panels = document.querySelectorAll('.panel');
const container = document.querySelector('.panels-container');
const caseParagraphs = document.querySelectorAll('.case-paragraph');
let currentIdx = 0;
let scrollProgress = 0; // Track scroll progress within cases panel
let isInCasesPanel = false;

function goToPanel(idx) {
  if (idx < 0 || idx >= panels.length) return;
  container.style.transform = `translateY(-${idx * window.innerHeight}px)`;
  currentIdx = idx;
  
  // Reset cases animations when leaving cases panel
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
    const threshold = (index + 1) * 0.25; // 25%, 50%, 75%, 100%
    if (scrollProgress >= threshold) {
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

// Arrow keys
document.addEventListener('keydown', (e) => {
  if (isInCasesPanel) {
    // Handle scroll within cases panel
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      scrollProgress = Math.min(1, scrollProgress + 0.25);
      updateCasesAnimations();
      if (scrollProgress >= 1 && currentIdx < panels.length - 1) {
        goToPanel(currentIdx + 1);
      }
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      scrollProgress = Math.max(0, scrollProgress - 0.25);
      updateCasesAnimations();
      if (scrollProgress <= 0 && currentIdx > 0) {
        goToPanel(currentIdx - 1);
      }
    }
  } else {
    // Normal panel navigation
    if ((e.key === 'ArrowRight' || e.key === 'ArrowDown') && currentIdx < panels.length - 1) {
      if (currentIdx === 2) { // Moving to cases panel from work
        scrollProgress = 0.25; // Start with first paragraph visible
        updateCasesAnimations();
      }
      goToPanel(currentIdx + 1);
    }
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowUp') && currentIdx > 0) {
      if (currentIdx === 4) { // Moving to cases panel from contact
        scrollProgress = 1; // Start with all paragraphs visible
        updateCasesAnimations();
      }
      goToPanel(currentIdx - 1);
    }
  }
});

// Mouse wheel
let lastScrollTime = 0;
let scrollAccumulator = 0;
const scrollThreshold = 250; // Amount of scroll needed to trigger next paragraph
let normalPanelScrollAccumulator = 0;
const normalPanelScrollThreshold = 200; // Amount of scroll needed for normal panel transitions

document.addEventListener('wheel', (e) => {
  const now = Date.now();
  if (now - lastScrollTime < 50) return; // Reduced throttle for smoother accumulation
  lastScrollTime = now;

  if (isInCasesPanel) {
    // Accumulate scroll delta
    scrollAccumulator += Math.abs(e.deltaY);
    if (scrollAccumulator >= scrollThreshold) {
      // Handle scroll within cases panel
      if (e.deltaY > 0) {
        if (scrollProgress < 1) {
          scrollProgress = Math.min(1, scrollProgress + 0.25);
          updateCasesAnimations();
        } else {
          // At end of cases - need extra scroll to move to contact
          scrollAccumulator += Math.abs(e.deltaY); // Keep accumulating
          if (scrollAccumulator >= scrollThreshold * 2 && currentIdx < panels.length - 1) {
            setTimeout(() => goToPanel(currentIdx + 1), 300);
            scrollAccumulator = 0;
          }
        }
      } else {
        if (scrollProgress > 0) {
          scrollProgress = Math.max(0, scrollProgress - 0.25);
          updateCasesAnimations();
        } else {
          // At beginning of cases - need extra scroll to move to work
          scrollAccumulator += Math.abs(e.deltaY); // Keep accumulating
          if (scrollAccumulator >= scrollThreshold * 2 && currentIdx > 0) {
            setTimeout(() => goToPanel(currentIdx - 1), 300);
            scrollAccumulator = 0;
          }
        }
      }
      // Reset accumulator only if we're still within the 0-1 range
      if (scrollProgress > 0 && scrollProgress < 1) {
        scrollAccumulator = 0;
      }
    }
  } else {
    // Normal panel navigation with accumulation
    normalPanelScrollAccumulator += Math.abs(e.deltaY);
    if (normalPanelScrollAccumulator >= normalPanelScrollThreshold) {
      if (e.deltaY > 0 && currentIdx < panels.length - 1) {
        if (currentIdx === 2) { // Moving to cases panel from work
          scrollProgress = 0.25; // Start with first paragraph visible
          updateCasesAnimations();
        }
        goToPanel(currentIdx + 1);
      } else if (e.deltaY < 0 && currentIdx > 0) {
        if (currentIdx === 4) { // Moving to cases panel from contact
          scrollProgress = 1; // Start with all paragraphs visible
          updateCasesAnimations();
        }
        goToPanel(currentIdx - 1);
      }
      normalPanelScrollAccumulator = 0; // Reset accumulator
    }
    scrollAccumulator = 0; // Reset when not in cases panel
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
    if (Math.abs(diff) > 40) {
      if (isInCasesPanel) {
        // Handle swipe within cases panel
        if (diff > 0) { // Swipe up
          scrollProgress = Math.min(1, scrollProgress + 0.25);
          updateCasesAnimations();
          if (scrollProgress >= 1 && currentIdx < panels.length - 1) {
            setTimeout(() => goToPanel(currentIdx + 1), 200);
          }
        } else { // Swipe down
          scrollProgress = Math.max(0, scrollProgress - 0.25);
          updateCasesAnimations();
          if (scrollProgress <= 0 && currentIdx > 0) {
            setTimeout(() => goToPanel(currentIdx - 1), 200);
          }
        }
      } else {
        // Normal panel navigation
        if (diff > 0 && currentIdx < panels.length - 1) {
          if (currentIdx === 2) { // Moving to cases panel from work
            scrollProgress = 0.25; // Start with first paragraph visible
            updateCasesAnimations();
          }
          goToPanel(currentIdx + 1);
        } else if (diff < 0 && currentIdx > 0) {
          if (currentIdx === 4) { // Moving to cases panel from contact
            scrollProgress = 1; // Start with all paragraphs visible
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
