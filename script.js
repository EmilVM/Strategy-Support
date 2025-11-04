// Fade-in animation for case studies as user scrolls
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.15
  });

  // Observe all case items
  document.querySelectorAll('.case-item').forEach(item => {
    observer.observe(item);
  });
});
