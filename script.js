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
gsap.registerPlugin(ScrollTrigger);

// Flicker effect on “– for hire”
gsap.to(".hero-title", {
  textShadow: "0 0 8px #f0f",
  repeat: -1,
  yoyo: true,
  ease: "power1.inOut",
  duration: 0.4
});


gsap.from("#case-lyca", {
  scrollTrigger: {
    trigger: "#case-lyca",
    start: "top 80%", // animation starts when the top of the case is 80% down the viewport
    toggleActions: "play none none none"
  },
  y: 50,            // slide up from 50px below
  opacity: 0,       // fade in from invisible
  duration: 1.2,    // animation duration in seconds
  ease: "power3.out"
});
