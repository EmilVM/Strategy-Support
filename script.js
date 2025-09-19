document.addEventListener('DOMContentLoaded', () => {
    const panels = document.querySelectorAll('.panel');
    const container = document.querySelector('.panels-container');
    const panelCount = panels.length;
    let currentIdx = 0;
    let isScrolling = false;

    // --- (UPDATED) Combined function for resizing and layout update ---
    const updateLayoutAndVh = () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        container.style.transform = `translateY(-${currentIdx * window.innerHeight}px)`;
    };

    updateLayoutAndVh();
    window.addEventListener('resize', updateLayoutAndVh);

    // --- Panel Navigation ---
    function goToPanel(idx) {
        if (idx < 0 || idx >= panelCount || isScrolling) return;

        isScrolling = true;
        container.style.transform = `translateY(-${idx * window.innerHeight}px)`;
        currentIdx = idx;

        setTimeout(() => {
            isScrolling = false;
        }, 1000); 
    }

    // --- Animate Cases on View ---
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

    // --- Event Listeners ---
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
    
    // --- (MODIFIED) Event Listeners for Scroll Indicators (Desktop Click & Mobile Tap) ---
    const setupIndicatorListeners = (selector, panelIncrement) => {
        document.querySelectorAll(selector).forEach(indicator => {
            // For mobile, use 'touchend' for an immediate response.
            indicator.addEventListener('touchend', (e) => {
                e.preventDefault(); // This stops the browser from firing a 'click' event afterwards.
                goToPanel(currentIdx + panelIncrement);
            });
            // For desktop, use the standard 'click' event.
            indicator.addEventListener('click', () => {
                // On mobile, this event is prevented by the 'touchend' listener above.
                // On desktop, it works as intended.
                goToPanel(currentIdx + panelIncrement);
            });
        });
    };

    setupIndicatorListeners('.scroll-indicator', 1);      // Down arrows
    setupIndicatorListeners('.scroll-up-indicator', -1);  // Up arrows


    // --- (MODIFIED FOR SMOOTHER MOBILE SCROLLING) ---
    let touchStartY = null;
    
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            touchStartY = e.touches[0].clientY;
        }
    });

    document.addEventListener('touchmove', (e) => {
        if (isScrolling) {
            e.preventDefault();
        }
    }, { passive: false });

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
