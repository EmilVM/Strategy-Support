// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

// Hero animations
gsap.from('.hero-title', { duration: 1.2, y: -50, opacity: 0, ease: 'power3.out' });
gsap.from('.hero-subtitle', { duration: 1.2, y: 30, opacity: 0, delay: 0.3, ease: 'power3.out' });
// Neon flicker on tag
gsap.to('.neon-tag', { opacity: 0.8, repeat: -1, yoyo: true, ease: 'power1.inOut', duration: 0.4 });

// Scroll-triggered nav visibility
const nav = document.querySelector('.sticky-nav');
const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
  if (window.scrollY > hero.offsetHeight - 60) {
    nav.classList.add('visible');
  } else {
    nav.classList.remove('visible');
  }
});

// Animate cases with staggered content
gsap.utils.toArray('.case').forEach(el => {
  const items = el.querySelectorAll('h3, p');
  gsap.from(items, {
    scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' },
    y: 40, opacity: 0, stagger: 0.2, duration: 1, ease: 'power2.out'
  });
});

// Phone reveal
document
  .getElementById('reveal-phone')
  .addEventListener('click', function() {
    const phoneEl = document.getElementById('phone-number');
    phoneEl.classList.remove('hidden');
    this.style.display = 'none';
  });


