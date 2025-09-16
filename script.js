document.addEventListener('DOMContentLoaded', () => {
    const panels = document.querySelectorAll('.panel');
    const container = document.querySelector('.panels-container');
    const panelCount = panels.length;
    let currentIdx = 0;
    let isScrolling = false;

    // --- Panel Navigation ---
    function goToPanel(idx) {
        if (idx < 0 || idx >= panelCount) return;

        isScrolling = true;
        container.style.transform = `translateY(-${idx * 100}vh)`;
        currentIdx = idx;

        // Reset scroll lock after the CSS transition ends
        setTimeout(() => {
            isScrolling = false;
        }, 1000); // This duration should match your CSS transition time plus a small buffer.
    }

    // --- Animate Cases on View ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const caseItems = entry.target.querySelectorAll('.case-item');
                caseItems.forEach((item, index) => {
                    // Stagger the animation for a nice effect
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, index * 200);
                });
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the panel is visible
    });

    // Observe both cases panels
    document.querySelectorAll('#cases1, #cases2').forEach(panel => {
        if (panel) observer.observe(panel);
    });


    // --- Event Listeners ---
    document.addEventListener('wheel', (e) => {
        if (isScrolling) return;

        if (e.deltaY > 0) { // Scrolling Down
            goToPanel(currentIdx + 1);
        } else if (e.deltaY < 0) { // Scrolling Up
            goToPanel(currentIdx - 1);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (isScrolling) return;
        if ((e.key === 'ArrowDown' || e.key === 'ArrowRight') && currentIdx < panelCount - 1) {
            goToPanel(currentIdx + 1);
        }
        if ((e.key === 'ArrowUp' || e.key === 'ArrowLeft') && currentIdx > 0) {
            goToPanel(currentIdx - 1);
        }
    });

    // Touch events for mobile
    let touchStartY = null;
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            touchStartY = e.touches[0].clientY;
        }
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        if (touchStartY === null || isScrolling) return;
        let touchEndY = e.changedTouches[0].clientY;
        let diff = touchStartY - touchEndY;

        if (Math.abs(diff) > 50) { // Swipe threshold
            if (diff > 0) { // Swipe Up (Scroll Down)
                goToPanel(currentIdx + 1);
            } else { // Swipe Down (Scroll Up)
                goToPanel(currentIdx - 1);
            }
        }
        touchStartY = null;
    });


    // --- Window Resize Handling ---
    function updateLayout() {
      // Use vh units for transform to avoid issues with window.innerHeight
      container.style.transform = `translateY(-${currentIdx * 100}vh)`;
    }
    window.addEventListener('resize', updateLayout);
});
