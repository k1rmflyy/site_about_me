
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- 1. Появление секций ----------
const revealItems = document.querySelectorAll('.hero, .section, .footer');
revealItems.forEach((el) => el.classList.add('reveal'));
const showAll = () => revealItems.forEach((el) => el.classList.add('is-in'));

if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    },
    { threshold: 0.12 }
  );
  revealItems.forEach((el) => io.observe(el));
  setTimeout(showAll, 1400);
} else {
  showAll();
}

// ---------- 2. Подсветка активного пункта меню ----------
const navLinks = Array.from(document.querySelectorAll('.nav__links a'));
const sections = navLinks.map((l) => document.querySelector(l.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window) {
  const navIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = '#' + entry.target.id;
        navLinks.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === id));
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((s) => navIo.observe(s));
}

// ---------- 3. Редкий «сбой» имени (усиленный глитч на миг) ----------
(function nameGlitch() {
  const el = document.querySelector('.hero__name');
  if (!el || reduceMotion) return;
  const kick = () => {
    el.style.textShadow = '3px 0 rgba(0,224,213,.9), -3px 0 rgba(197,15,36,.9), 0 0 60px rgba(197,15,36,.4)';
    el.style.transform = 'translateX(' + (Math.random() * 6 - 3).toFixed(1) + 'px)';
    setTimeout(() => { el.style.textShadow = ''; el.style.transform = ''; }, 90);
    setTimeout(kick, 2600 + Math.random() * 4200);
  };
  setTimeout(kick, 2000);
})();
