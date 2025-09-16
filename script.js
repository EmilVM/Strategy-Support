document.addEventListener('DOMContentLoaded', () => {
    // --- START: NEW CODE FOR VIEWPORT HEIGHT ---
    const setVhProperty = () => {
        // We get the inner height of the window and set a CSS custom property
        // We multiply by 0.01 to get a value equivalent to 1% of the height (like 1vh)
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set the value on initial load
    setVhProperty();
    // Reset the value whenever the window is resized
    window.addEventListener('resize', setVhProperty);
    // --- END: NEW CODE ---


    const panels = document.querySelectorAll('.panel');
    const container = document.querySelector('.panels-container');
    const panelCount = panels.length;
    let currentIdx = 0;
    let isScrolling = false;

    // --- Panel Navigation (UPDATED) ---
    function goToPanel(idx) {
        if (idx < 0 || idx >= panelCount) return;

        isScrolling = true;
        // Use window.innerHeight for a precise pixel-based transform
        container.style.transform = `translateY(-${idx * window.innerHeight}px)`;
        currentIdx = idx;

        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }

    // ... (Your IntersectionObserver code remains the same) ...
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
    

    // ... (Your event listeners for wheel, keydown, touch events remain the same) ...
    document.addEventListener('wheel', (e) => {
        if (isScrolling) return;
        if (e.deltaY > 0) { goToPanel(currentIdx + 1); } 
        else if (e.deltaY < 0) { goToPanel(currentIdx - 1); }
    });
    // ... (other listeners) ...


    // --- Window Resize Handling (UPDATED) ---
    function updateLayout() {
      // Also use window.innerHeight here for consistency on resize
      container.style.transform = `translateY(-${currentIdx * window.innerHeight}px)`;
    }
    // Remove the old 'resize' listener, as the new 'setVhProperty' handles it.
    // window.addEventListener('resize', updateLayout); // REMOVE THIS LINE
    
    // You can keep the 'updateLayout' function and call it within 'setVhProperty' if needed,
    // but the CSS change below should make it largely unnecessary.
    // For simplicity, just removing the listener is the cleanest first step.
});
