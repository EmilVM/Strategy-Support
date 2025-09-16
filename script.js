document.addEventListener('DOMContentLoaded', () => {
    const panels = document.querySelectorAll('.panel');
    const container = document.querySelector('.panels-container');
    let currentIdx = 0;
    let isScrolling = false;

    // --- Panel Navigation ---
    function goToPanel(idx) {
        if (idx < 0 || idx >= panels.length || isScrolling) return;

        isScrolling = true;
        container.style.transform = `translateY(-${idx * window.innerHeight}px)`;
        currentIdx = idx;

        // Reset scroll lock after transition ends
        setTimeout(() => {
            isScrolling = false;
        }, 1000); // 1000ms matches CSS transition time + buffer
    }

    // --- Animate Cases on View ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Find case items within the visible panel and add 'visible' class
                const caseItems = entry.target.querySelectorAll('.case-item');
                caseItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, index * 200); // Stagger the animation
                });
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the panel is visible
    });

    // Observe the two cases panels
    const cases1Panel = document.getElementById('cases1');
    const cases2Panel = document.getElementById('cases2');
    if (cases1Panel) observer.observe(cases1Panel);
    if (cases2Panel) observer.observe(cases2Panel);


    // --- Event Listeners ---
    let lastScrollTime = 0;
    document.addEventListener('wheel', (e) => {
        const now = Date.now();
        if (now - lastScrollTime < 50) return; // Debounce scroll
        if (isScrolling) return;

        if (e.deltaY > 0 && currentIdx < panels.length - 1) { // Scrolling Down
            goToPanel(currentIdx + 1);
        } else if (e.deltaY < 0 && currentIdx > 0) { // Scrolling Up
            goToPanel(currentIdx - 1);
        }
        lastScrollTime = now;
    });

    document.addEventListener('keydown', (e) => {
        if (isScrolling) return;
        if ((e.key === 'ArrowDown' || e.key === 'ArrowRight') && currentIdx < panels.length - 1) {
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
    });

    document.addEventListener('touchend', (e) => {
        if (touchStartY === null || isScrolling) return;
        let touchEndY = e.changedTouches[0].clientY;
        let diff = touchStartY - touchEndY;

        if (Math.abs(diff) > 50) { // Swipe threshold
            if (diff > 0 && currentIdx < panels.length - 1) { // Swipe Up (Scroll Down)
                goToPanel(currentIdx + 1);
            } else if (diff < 0 && currentIdx > 0) { // Swipe Down (Scroll Up)
                goToPanel(currentIdx - 1);
            }
        }
        touchStartY = null;
    });


    // --- Window Resize Handling ---
    function updatePanelsContainerHeight() {
        container.style.height = `${panels.length * window.innerHeight}px`;
        container.style.transform = `translateY(-${currentIdx * window.innerHeight}px)`;
    }
    window.addEventListener('resize', updatePanelsContainerHeight);
    updatePanelsContainerHeight(); // Initial call
});
