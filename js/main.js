// js/main.js - Landing page interactions
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');

      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
      }
    });
  }

  window.closeMobile = function() {
    if (mobileMenu) mobileMenu.classList.remove('open');
    const spans = document.querySelectorAll('.nav-hamburger span');
    if (spans.length) {
      spans[0].style.transform = '';
      spans[1].style.opacity = '1';
      spans[2].style.transform = '';
    }
  };

  console.log('%c✅ Mute Translator Landing Page Ready', 'color:#4f8aff; font-weight:bold');
});
