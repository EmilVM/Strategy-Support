[cite_start]const panels = document.querySelectorAll('.panel'); [cite: 1]
[cite_start]const container = document.querySelector('.panels-container'); [cite: 1]
[cite_start]const caseParagraphs = document.querySelectorAll('.case-paragraph'); [cite: 1]
[cite_start]const CASE_COUNT = caseParagraphs.length; [cite: 1]
[cite_start]let currentIdx = 0; [cite: 1]
[cite_start]let scrollProgress = 0; [cite: 2]
[cite_start]let isInCasesPanel = false; [cite: 2]

[cite_start]function goToPanel(idx, fromDirection = null) { [cite: 3]
  [cite_start]if (idx < 0 || idx >= panels.length) return; [cite: 3]
  [cite_start]container.style.transform = `translateY(-${idx * window.innerHeight}px)`; [cite: 4]
  [cite_start]currentIdx = idx; [cite: 4]

  // CHANGED: The cases panel is now at index 4
  [cite_start]if (idx !== 4) { [cite: 4]
    [cite_start]isInCasesPanel = false; [cite: 4]
    [cite_start]scrollProgress = 0; [cite: 5]
    [cite_start]updateCasesAnimations(); [cite: 5]
  } else {
    [cite_start]isInCasesPanel = true; [cite: 5]
    [cite_start]if (fromDirection === 'up') { [cite: 6]
      [cite_start]scrollProgress = CASE_COUNT; [cite: 6]
      [cite_start]updateCasesAnimations(); [cite: 7]
    [cite_start]} else if (fromDirection === 'down') { [cite: 7]
      [cite_start]scrollProgress = 1; [cite: 7]
      [cite_start]updateCasesAnimations(); [cite: 7]
    [cite_start]} [cite: 8]
  }
}

[cite_start]function updateCasesAnimations() { [cite: 8]
  [cite_start]caseParagraphs.forEach((paragraph, index) => { [cite: 8]
    [cite_start]if (scrollProgress > index) { [cite: 8]
      [cite_start]paragraph.classList.add('visible'); [cite: 8]
    } else {
      [cite_start]paragraph.classList.remove('visible'); [cite: 8]
    }
  });
[cite_start]} [cite: 9]

[cite_start]function updatePanelsContainerHeight() { [cite: 9]
  [cite_start]container.style.height = `${panels.length * window.innerHeight}px`; [cite: 9]
  [cite_start]container.style.transform = `translateY(-${currentIdx * window.innerHeight}px)`; [cite: 9]
}
[cite_start]window.addEventListener('resize', updatePanelsContainerHeight); [cite: 9]
[cite_start]updatePanelsContainerHeight(); [cite: 9]

[cite_start]document.addEventListener('keydown', (e) => { [cite: 10]
  [cite_start]if (isInCasesPanel) { [cite: 10]
    [cite_start]if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { [cite: 10]
      [cite_start]if (scrollProgress < CASE_COUNT) { [cite: 10]
        [cite_start]scrollProgress += 1; [cite: 10]
        [cite_start]updateCasesAnimations(); [cite: 10]
      } else {
        [cite_start]if (typeof window._casesExtraScroll === 'undefined' || !window._casesExtraScroll) { [cite: 10]
          [cite_start]window._casesExtraScroll = true; [cite: 11]
        [cite_start]} else if (currentIdx < panels.length - 1) { [cite: 11]
          [cite_start]goToPanel(currentIdx + 1, 'up'); [cite: 11]
          [cite_start]window._casesExtraScroll = false; [cite: 11]
        }
      }
    }
    [cite_start]if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { [cite: 11]
      [cite_start]if (scrollProgress === CASE_COUNT) { [cite: 12]
        [cite_start]scrollProgress = 0; [cite: 12]
        [cite_start]updateCasesAnimations(); [cite: 12]
        [cite_start]goToPanel(currentIdx - 1, 'down'); [cite: 12]
        [cite_start]window._casesExtraScroll = false; [cite: 12]
      [cite_start]} else if (scrollProgress > 0) { [cite: 12]
        [cite_start]scrollProgress -= 1; [cite: 12]
        [cite_start]updateCasesAnimations(); [cite: 13]
        [cite_start]window._casesExtraScroll = false; [cite: 13]
      [cite_start]} else if (currentIdx > 0) { [cite: 13]
        [cite_start]goToPanel(currentIdx - 1, 'down'); [cite: 13]
      [cite_start]} [cite: 14]
    }
  } else {
    [cite_start]if ((e.key === 'ArrowRight' || e.key === 'ArrowDown') && currentIdx < panels.length - 1) { [cite: 14]
      // CHANGED: The work panel is now at index 3
      [cite_start]if (currentIdx === 3) { [cite: 14]
        [cite_start]goToPanel(currentIdx + 1, 'down'); [cite: 14]
      [cite_start]} else { [cite: 15]
        [cite_start]goToPanel(currentIdx + 1); [cite: 15]
      [cite_start]} [cite: 16]
    }
    [cite_start]if ((e.key === 'ArrowLeft' || e.key === 'ArrowUp') && currentIdx > 0) { [cite: 16]
      // CHANGED: The contact panel is now at index 5
      [cite_start]if (currentIdx === 5) { [cite: 16]
        [cite_start]scrollProgress = CASE_COUNT; [cite: 16]
        [cite_start]updateCasesAnimations(); [cite: 17]
        [cite_start]goToPanel(currentIdx - 1, 'up'); [cite: 17]
      [cite_start]} else { [cite: 17]
        [cite_start]goToPanel(currentIdx - 1); [cite: 17]
      [cite_start]} [cite: 18]
    }
  }
[cite_start]}); [cite: 18]

[cite_start]let lastScrollTime = 0; [cite: 18]
[cite_start]let scrollAccumulator = 0; [cite: 18]
[cite_start]const scrollThreshold = 120; [cite: 19]
[cite_start]let normalPanelScrollAccumulator = 0; [cite: 19]
[cite_start]const normalPanelScrollThreshold = 120; [cite: 19]

[cite_start]document.addEventListener('wheel', (e) => { [cite: 20]
  [cite_start]const now = Date.now(); [cite: 20]
  [cite_start]if (now - lastScrollTime < 40) return; [cite: 20]
  [cite_start]lastScrollTime = now; [cite: 20]

  [cite_start]if (isInCasesPanel) { [cite: 20]
    [cite_start]scrollAccumulator += Math.abs(e.deltaY); [cite: 20]
    [cite_start]if (scrollAccumulator >= scrollThreshold) { [cite: 20]
      [cite_start]if (e.deltaY > 0) { [cite: 20]
        [cite_start]if (scrollProgress < CASE_COUNT) { [cite: 20]
          [cite_start]scrollProgress += 1; [cite: 20]
          [cite_start]updateCasesAnimations(); [cite: 20]
          [cite_start]window._casesExtraScroll = false; [cite: 20]
        [cite_start]} else { [cite: 21]
          [cite_start]if (typeof window._casesExtraScroll === 'undefined' || !window._casesExtraScroll) { [cite: 21]
            [cite_start]window._casesExtraScroll = true; [cite: 21]
          [cite_start]} else if (currentIdx < panels.length - 1) { [cite: 21]
            [cite_start]goToPanel(currentIdx + 1, 'up'); [cite: 21]
            [cite_start]window._casesExtraScroll = false; [cite: 21]
          [cite_start]} [cite: 22]
        }
      } else {
        [cite_start]if (scrollProgress === CASE_COUNT) { [cite: 22]
          [cite_start]scrollProgress = 0; [cite: 22]
          [cite_start]updateCasesAnimations(); [cite: 22]
          [cite_start]goToPanel(currentIdx - 1, 'down'); [cite: 23]
          [cite_start]window._casesExtraScroll = false; [cite: 23]
        [cite_start]} else if (scrollProgress > 0) { [cite: 23]
          [cite_start]scrollProgress -= 1; [cite: 23]
          [cite_start]updateCasesAnimations(); [cite: 24]
          [cite_start]window._casesExtraScroll = false; [cite: 24]
        [cite_start]} else if (currentIdx > 0) { [cite: 24]
          [cite_start]goToPanel(currentIdx - 1, 'down'); [cite: 24]
        [cite_start]} [cite: 25]
      }
      [cite_start]scrollAccumulator = 0; [cite: 25]
    [cite_start]} [cite: 26]
  } else {
    [cite_start]normalPanelScrollAccumulator += Math.abs(e.deltaY); [cite: 26]
    [cite_start]if (normalPanelScrollAccumulator >= normalPanelScrollThreshold) { [cite: 27]
      [cite_start]if (e.deltaY > 0 && currentIdx < panels.length - 1) { [cite: 27]
        // CHANGED: The work panel is now at index 3
        [cite_start]if (currentIdx === 3) { [cite: 27]
          [cite_start]goToPanel(currentIdx + 1, 'down'); [cite: 27]
        [cite_start]} else { [cite: 28]
          [cite_start]goToPanel(currentIdx + 1); [cite: 28]
        [cite_start]} [cite: 29]
      [cite_start]} else if (e.deltaY < 0 && currentIdx > 0) { [cite: 29]
        // CHANGED: The contact panel is now at index 5
        [cite_start]if (currentIdx === 5) { [cite: 29]
          [cite_start]scrollProgress = CASE_COUNT; [cite: 29]
          [cite_start]updateCasesAnimations(); [cite: 30]
          [cite_start]goToPanel(currentIdx - 1, 'up'); [cite: 30]
        [cite_start]} else { [cite: 30]
          [cite_start]goToPanel(currentIdx - 1); [cite: 30]
        [cite_start]} [cite: 31]
      }
      [cite_start]normalPanelScrollAccumulator = 0; [cite: 31]
    [cite_start]} [cite: 32]
    [cite_start]scrollAccumulator = 0; [cite: 32]
  }
[cite_start]}); [cite: 32]

[cite_start]let touchStartY = null; [cite: 32]
[cite_start]let touchEndY = null; [cite: 32]
[cite_start]container.addEventListener('touchstart', function(e) { [cite: 33]
  [cite_start]if (e.touches.length === 1) { [cite: 33]
    [cite_start]touchStartY = e.touches[0].clientY; [cite: 33]
  }
[cite_start]}, false); [cite: 33]
[cite_start]container.addEventListener('touchmove', function(e) { [cite: 34]
  [cite_start]if (e.touches.length === 1) { [cite: 34]
    [cite_start]touchEndY = e.touches[0].clientY; [cite: 34]
  }
[cite_start]}, false); [cite: 34]
[cite_start]container.addEventListener('touchend', function(e) { [cite: 35]
  [cite_start]if (touchStartY !== null && touchEndY !== null) { [cite: 35]
    [cite_start]let diff = touchStartY - touchEndY; [cite: 35]
    [cite_start]if (Math.abs(diff) > 30) { [cite: 35]
      [cite_start]if (isInCasesPanel) { [cite: 35]
        [cite_start]if (diff > 0) { [cite: 35]
          [cite_start]if (scrollProgress < CASE_COUNT) { [cite: 35]
            [cite_start]scrollProgress += 1; [cite: 35]
            [cite_start]updateCasesAnimations(); [cite: 35]
            [cite_start]window._casesExtraScroll = false; [cite: 36]
          [cite_start]} else { [cite: 36]
            [cite_start]if (typeof window._casesExtraScroll === 'undefined' || !window._casesExtraScroll) { [cite: 36]
              [cite_start]window._casesExtraScroll = true; [cite: 36]
            [cite_start]} else if (currentIdx < panels.length - 1) { [cite: 36]
              [cite_start]goToPanel(currentIdx + 1, 'up'); [cite: 36]
              [cite_start]window._casesExtraScroll = false; [cite: 37]
            }
          }
        } else {
          [cite_start]if (scrollProgress === CASE_COUNT) { [cite: 37]
            [cite_start]scrollProgress = 0; [cite: 37]
            [cite_start]updateCasesAnimations(); [cite: 38]
            [cite_start]goToPanel(currentIdx - 1, 'down'); [cite: 38]
            [cite_start]window._casesExtraScroll = false; [cite: 39]
          [cite_start]} else if (scrollProgress > 0) { [cite: 39]
            [cite_start]scrollProgress -= 1; [cite: 39]
            [cite_start]updateCasesAnimations(); [cite: 40]
            [cite_start]window._casesExtraScroll = false; [cite: 40]
          [cite_start]} else if (currentIdx > 0) { [cite: 40]
            [cite_start]goToPanel(currentIdx - 1, 'down'); [cite: 40]
          [cite_start]} [cite: 41]
        }
      } else {
        [cite_start]if (diff > 0 && currentIdx < panels.length - 1) { [cite: 41]
          // CHANGED: The work panel is now at index 3
          [cite_start]if (currentIdx === 3) { [cite: 41]
            [cite_start]goToPanel(currentIdx + 1, 'down'); [cite: 41]
          [cite_start]} else { [cite: 42]
            [cite_start]goToPanel(currentIdx + 1); [cite: 42]
          [cite_start]} [cite: 43]
        [cite_start]} else if (diff < 0 && currentIdx > 0) { [cite: 43]
          // CHANGED: The contact panel is now at index 5
          [cite_start]if (currentIdx === 5) { [cite: 43]
            [cite_start]scrollProgress = CASE_COUNT; [cite: 43]
            [cite_start]updateCasesAnimations(); [cite: 44]
            [cite_start]goToPanel(currentIdx - 1, 'up'); [cite: 44]
          [cite_start]} else { [cite: 44]
            [cite_start]goToPanel(currentIdx - 1); [cite: 44]
          [cite_start]} [cite: 45]
        }
      }
    }
  }
  [cite_start]touchStartY = null; [cite: 45]
  [cite_start]touchEndY = null; [cite: 46]
[cite_start]}, false); [cite: 46]



