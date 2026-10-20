document.querySelectorAll('.js-year').forEach(function(el){ el.textContent = new Date().getFullYear(); });

// Menu mobile: fecha ao escolher um link, tocar fora ou pressionar Esc
var mobileNav = document.querySelector('details.nav-mobile');
if (mobileNav) {
  var summary = mobileNav.querySelector('summary');
  var closeMenu = function(){ mobileNav.removeAttribute('open'); };

  mobileNav.querySelectorAll('nav a').forEach(function(link){
    link.addEventListener('click', closeMenu);
  });
  document.addEventListener('click', function(e){
    if (mobileNav.open && !mobileNav.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && mobileNav.open) { closeMenu(); summary.focus(); }
  });
  mobileNav.addEventListener('toggle', function(){
    summary.setAttribute('aria-label', mobileNav.open ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
  });
}

// Destaca no menu a seção visível
var navLinks = document.querySelectorAll('nav.nav-desktop a[href^="#"]');
if ('IntersectionObserver' in window && navLinks.length) {
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (!entry.isIntersecting) return;
      navLinks.forEach(function(link){
        link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach(function(link){
    var section = document.querySelector(link.getAttribute('href'));
    if (section) observer.observe(section);
  });
}
