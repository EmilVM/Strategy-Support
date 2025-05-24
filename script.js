const panels = document.querySelectorAll('.panel');
const container = document.querySelector('.panels-container');
const caseParagraphs = document.querySelectorAll('.case-paragraph');
const CASE_COUNT = caseParagraphs.length;
let currentIdx = 0;
let scrollProgress = 0; // 0 to CASE_COUNT
let isInCasesPanel = false;

function goToPanel(idx, fromDirection = null) {
  if (idx < 0 || idx >= panels.length) return;
  container.style.transform = `translateY(-${idx * window.innerHeight}px)`;
  currentIdx = idx;

  if (idx !== 3) {
    isInCasesPanel = false;
    scrollProgress = 0;
    updateCasesAnimations();
  } else {
    isInCasesPanel = true;
    // When coming from CONTACT, show all cases.
    if (fromDirection === 'up') {
      scrollProgress = CASE_COUNT;
      updateCasesAnimations();
    } else if (fromDirection === 'down') {
      scrollProgress = 1;
      updateCasesAnimations();
    }
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

// KEYBOARD NAV
document.addEventListener('keydown', (e) => {
  if (isInCasesPanel) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      if (scrollProgress < CASE_COUNT) {
        scrollProgress += 1;
        updateCasesAnimations();
      } else {
        // Require an extra scroll at the end before leaving
        if (typeof window._casesExtraScroll === 'undefined' || !window._casesExtraScroll) {
          window._casesExtraScroll = true;
        } else if (currentIdx < panels.length - 1) {
          goToPanel(currentIdx + 1, 'up');
          window._casesExtraScroll = false;
        }
      }
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      // THIS BLOCK IS NEW: If all cases are visible and user scrolls up, immediately hide and go to Work
      if (scrollProgress === CASE_COUNT) {
        scrollProgress = 0;
        updateCasesAnimations();
        goToPanel(currentIdx - 1, 'down');
        window._casesExtraScroll = false;
      } else if (scrollProgress > 0) {
        scrollProgress -= 1;
        updateCasesAnimations();
        window._casesExtraScroll = false;
      } else if (currentIdx > 0) {
        goToPanel(currentIdx - 1, 'down');
      }
    }
  } else {
    if ((e.key === 'ArrowRight' || e.key === 'ArrowDown') && currentIdx < panels.length - 1) {
      if (currentIdx === 2) {
        goToPanel(currentIdx + 1, 'down');
      } else {
        goToPanel(currentIdx + 1);
      }
    }
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowUp') && currentIdx > 0) {
      if (currentIdx === 4) {
        scrollProgress = CASE_COUNT;
        updateCasesAnimations();
        goToPanel(currentIdx - 1, 'up');
      } else {
        goToPanel(currentIdx - 1);
      }
    }
  }
});

// MOUSE WHEEL
let lastScrollTime = 0;
let scrollAccumulator = 0;
const scrollThreshold = 120;
let normalPanelScrollAccumulator = 0;
const normalPanelScrollThreshold = 120;

document.addEventListener('wheel', (e) => {
  const now = Date.now();
  if (now - lastScrollTime < 40) return;
  lastScrollTime = now;

  if (isInCasesPanel) {
    scrollAccumulator += Math.abs(e.deltaY);
    if (scrollAccumulator >= scrollThreshold) {
      if (e.deltaY > 0) {
        if (scrollProgress < CASE_COUNT) {
          scrollProgress += 1;
          updateCasesAnimations();
          window._casesExtraScroll = false;
        } else {
          // Extra scroll to leave
          if (typeof window._casesExtraScroll === 'undefined' || !window._casesExtraScroll) {
            window._casesExtraScroll = true;
          } else if (currentIdx < panels.length - 1) {
            goToPanel(currentIdx + 1, 'up');
            window._casesExtraScroll = false;
          }
        }
      } else {
        // THIS BLOCK IS NEW: If all cases are visible and user scrolls up, immediately hide and go to Work
        if (scrollProgress === CASE_COUNT) {
          scrollProgress = 0;
          updateCasesAnimations();
          goToPanel(currentIdx - 1, 'down');
          window._casesExtraScroll = false;
        } else if (scrollProgress > 0) {
          scrollProgress -= 1;
          updateCasesAnimations();
          window._casesExtraScroll = false;
        } else if (currentIdx > 0) {
          goToPanel(currentIdx - 1, 'down');
        }
      }
      scrollAccumulator = 0;
    }
  } else {
    normalPanelScrollAccumulator += Math.abs(e.deltaY);
    if (normalPanelScrollAccumulator >= normalPanelScrollThreshold) {
      if (e.deltaY > 0 && currentIdx < panels.length - 1) {
        if (currentIdx === 2) {
          goToPanel(currentIdx + 1, 'down');
        } else {
          goToPanel(currentIdx + 1);
        }
      } else if (e.deltaY < 0 && currentIdx > 0) {
        if (currentIdx === 4) {
          scrollProgress = CASE_COUNT;
          updateCasesAnimations();
          goToPanel(currentIdx - 1, 'up');
        } else {
          goToPanel(currentIdx - 1);
        }
      }
      normalPanelScrollAccumulator = 0;
    }
    scrollAccumulator = 0;
  }
});

// TOUCH / SWIPE
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
          if (scrollProgress < CASE_COUNT) {
            scrollProgress += 1;
            updateCasesAnimations();
            window._casesExtraScroll = false;
          } else {
            if (typeof window._casesExtraScroll === 'undefined' || !window._casesExtraScroll) {
              window._casesExtraScroll = true;
            } else if (currentIdx < panels.length - 1) {
              goToPanel(currentIdx + 1, 'up');
              window._casesExtraScroll = false;
            }
          }
        } else { // Down
          // THIS BLOCK IS NEW: If all cases are visible and user scrolls up, immediately hide and go to Work
          if (scrollProgress === CASE_COUNT) {
            scrollProgress = 0;
            updateCasesAnimations();
            goToPanel(currentIdx - 1, 'down');
            window._casesExtraScroll = false;
          } else if (scrollProgress > 0) {
            scrollProgress -= 1;
            updateCasesAnimations();
            window._casesExtraScroll = false;
          } else if (currentIdx > 0) {
            goToPanel(currentIdx - 1, 'down');
          }
        }
      } else {
        if (diff > 0 && currentIdx < panels.length - 1) {
          if (currentIdx === 2) {
            goToPanel(currentIdx + 1, 'down');
          } else {
            goToPanel(currentIdx + 1);
          }
        } else if (diff < 0 && currentIdx > 0) {
          if (currentIdx === 4) {
            scrollProgress = CASE_COUNT;
            updateCasesAnimations();
            goToPanel(currentIdx - 1, 'up');
          } else {
            goToPanel(currentIdx - 1);
          }
        }
      }
    }
  }
  touchStartY = null;
  touchEndY = null;
}, false);




