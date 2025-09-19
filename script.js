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

    // --- (NEW) Click Listeners for Scroll Indicators ---
    document.querySelectorAll('.scroll-indicator').forEach(indicator => {
        indicator.addEventListener('click', () => goToPanel(currentIdx + 1));
    });

    document.querySelectorAll('.scroll-up-indicator').forEach(indicator => {
        indicator.addEventListener('click', () => goToPanel(currentIdx - 1));
    });


    // --- (MODIFIED FOR SMOOTHER MOBILE SCROLLING) ---
    let touchStartY = null;
    
    // 1. Removed { passive: true } so we can call preventDefault() in touchmove
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            touchStartY = e.touches[0].clientY;
        }
    });

    // 2. Added a touchmove listener to prevent browser's default pull-to-refresh
    document.addEventListener('touchmove', (e) => {
        if (isScrolling) {
            e.preventDefault();
        }
    }, { passive: false }); // Explicitly set passive to false

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
