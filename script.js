document.addEventListener('DOMContentLoaded', () => {
    const panels = document.querySelectorAll('.panel');
    const container = document.querySelector('.panels-container');
    const panelCount = panels.length;
    let currentIdx = 0;
    let isScrolling = false;

    // --- (UPDATED) Combined function for resizing and layout update ---
    const updateLayoutAndVh = () => {
        // First, calculate the true viewport height and set it as a CSS variable
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        // Then, immediately update the container's scroll position based on the new height
        // This keeps the current panel perfectly centered after a resize/rotation
        container.style.transform = `translateY(-${currentIdx * window.innerHeight}px)`;
    };

    // Run the function on initial load and whenever the window is resized
    updateLayoutAndVh();
    window.addEventListener('resize', updateLayoutAndVh);

    // --- Panel Navigation (uses new height calculation) ---
    function goToPanel(idx) {
        if (idx < 0 || idx >= panelCount || isScrolling) return;

        isScrolling = true;
        // The transform now uses the live, correct window height
        container.style.transform = `translateY(-${idx * window.innerHeight}px)`;
        currentIdx = idx;

        setTimeout(() => {
            isScrolling = false;
        }, 1000); // Match this to your CSS transition time
    }

    // --- Animate Cases on View (No changes needed here) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const caseItems = entry.target.querySelectorAll('.case-item');
                caseItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, index * 200);
                });
            }
        });
    }, {
        threshold: 0.5
    });
    document.querySelectorAll('#cases1, #cases2').forEach(panel => {
        if (panel) observer.observe(panel);
    });

    // --- Event Listeners (No changes needed here) ---
    document.addEventListener('wheel', (e) => {
        if (isScrolling) return;
        if (e.deltaY > 0) {
            goToPanel(currentIdx + 1);
        } else if (e.deltaY < 0) {
            goToPanel(currentIdx - 1);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (isScrolling) return;
        if ((e.key === 'ArrowDown' || e.key === 'ArrowRight')) {
            goToPanel(currentIdx + 1);
        }
        if ((e.key === 'ArrowUp' || e.key === 'ArrowLeft')) {
            goToPanel(currentIdx - 1);
        }
    });

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
            if (diff > 0) { // Swipe Up (goes to next panel)
                goToPanel(currentIdx + 1);
            } else { // Swipe Down (goes to previous panel)
                goToPanel(currentIdx - 1);
            }
        }
        touchStartY = null;
    });
});
