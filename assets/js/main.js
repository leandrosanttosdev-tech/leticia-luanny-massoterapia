document.querySelectorAll('.js-year').forEach(function(el){ el.textContent = new Date().getFullYear(); });

// Menu mobile: fecha ao escolher um link, tocar fora ou pressionar Esc
var mobileNav = document.querySelector('details.nav-mobile');
if (mobileNav) {
  var summary = mobileNav.querySelector('summary');
  var closeMenu = function(){ mobileNav.removeAttribute('open'); };

  mobileNav.querySelectorAll('nav a, .nav-backdrop').forEach(function(el){
    el.addEventListener('click', closeMenu);
  });
  document.addEventListener('click', function(e){
    if (mobileNav.open && !mobileNav.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && mobileNav.open) { closeMenu(); summary.focus(); }
  });
  mobileNav.addEventListener('toggle', function(){
    summary.setAttribute('aria-label', mobileNav.open ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    document.documentElement.classList.toggle('menu-open', mobileNav.open);
  });
}

// Cabeçalho encolhe ao rolar
var header = document.querySelector('header.site');
if (header) {
  var updateHeader = function(){ header.classList.toggle('is-scrolled', window.scrollY > 16); };
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}

// Carrossel de serviços: indicadores de posição (visíveis só no mobile)
var svcGrid = document.querySelector('.svc-grid');
if (svcGrid && svcGrid.children.length > 1) {
  var cards = svcGrid.children;
  var dots = document.createElement('div');
  dots.className = 'svc-dots';
  dots.setAttribute('aria-hidden', 'true');
  for (var i = 0; i < cards.length; i++) dots.appendChild(document.createElement('span'));
  svcGrid.after(dots);

  var ticking = false;
  var updateDots = function(){
    ticking = false;
    var step = cards[1].offsetLeft - cards[0].offsetLeft;
    var atEnd = svcGrid.scrollLeft + svcGrid.clientWidth >= svcGrid.scrollWidth - 2;
    var index = atEnd ? cards.length - 1 : Math.round(svcGrid.scrollLeft / (step || 1));
    for (var j = 0; j < dots.children.length; j++) dots.children[j].classList.toggle('is-active', j === index);
  };
  svcGrid.addEventListener('scroll', function(){
    if (!ticking) { ticking = true; requestAnimationFrame(updateDots); }
  }, { passive: true });
  updateDots();
}

if ('IntersectionObserver' in window) {
  // Barra de agendamento mobile: só aparece entre o hero e a seção de contato
  var bar = document.querySelector('.mobile-bar');
  var barTargets = document.querySelectorAll('section.hero, #contato, footer.site');
  if (bar && barTargets.length) {
    var inView = new Map();
    var barObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){ inView.set(entry.target, entry.isIntersecting); });
      var blocked = false;
      inView.forEach(function(visible){ if (visible) blocked = true; });
      bar.classList.toggle('is-visible', !blocked);
    });
    barTargets.forEach(function(el){ barObserver.observe(el); });
  }

  // Revela os blocos suavemente ao entrar na tela
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var revealEls = document.querySelectorAll('.value-item, .about-media, .about-copy, .section-head, .svc-grid, .how-step, .band-media, .band-copy, .final-cta .wrap');
    var revealObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function(el){
      // escalona itens irmãos (ex.: os 3 passos aparecem em sequência)
      var siblings = Array.prototype.filter.call(el.parentNode.children, function(s){ return s.classList.contains('reveal'); });
      el.style.transitionDelay = (siblings.length * 90) + 'ms';
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }
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
