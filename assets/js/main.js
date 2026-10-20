document.querySelectorAll('.js-year').forEach(function(el){ el.textContent = new Date().getFullYear(); });

// Fecha o menu mobile ao escolher um link ou tocar fora dele
var mobileNav = document.querySelector('details.nav-mobile');
if (mobileNav) {
  mobileNav.querySelectorAll('nav a').forEach(function(link){
    link.addEventListener('click', function(){ mobileNav.removeAttribute('open'); });
  });
  document.addEventListener('click', function(e){
    if (mobileNav.open && !mobileNav.contains(e.target)) mobileNav.removeAttribute('open');
  });
}
