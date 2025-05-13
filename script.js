// Animate the hero title
gsap.from(".hero-title", {
  duration: 1.2,
  y: -50,
  opacity: 0,
  ease: "power3.out"
});

// Animate the subtitle slightly after
gsap.from(".hero-subtitle", {
  duration: 1.2,
  y: 30,
  opacity: 0,
  delay: 0.3,
  ease: "power3.out"
});
