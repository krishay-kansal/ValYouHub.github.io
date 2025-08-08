// AOS initialization for scroll animations
// This script uses AOS (Animate On Scroll) library
// https://michalsnik.github.io/aos/
document.addEventListener('DOMContentLoaded', function () {
  if (window.AOS) {
    AOS.init({
      duration: 1200,
      once: true,
      easing: 'ease-in-out',
    });
  }
});
