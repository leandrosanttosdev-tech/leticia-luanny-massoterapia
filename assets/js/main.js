document.querySelectorAll('.js-year').forEach(function(el){ el.textContent = new Date().getFullYear(); });

// Ao recarregar, sempre volta ao topo em vez de restaurar a posição anterior
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

// Links internos rolam até a seção sem gravar "#secao" no endereço
// (senão, ao recarregar, o navegador pula de volta para ela)
document.addEventListener('click', function(e){
  var link = e.target.closest('a[href^="#"]');
  if (!link || link.getAttribute('href').length < 2) return;
  var target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
});

// Menu mobile: fecha ao escolher um link, tocar fora ou pressionar Esc
var mobileNav = document.querySelector('details.nav-mobile');
if (mobileNav) {
  var summary = mobileNav.querySelector('summary');
  var closeMenu = function(){
    mobileNav.removeAttribute('open');
    document.documentElement.classList.remove('menu-open');
  };

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

// Painel "Saiba mais" de cada serviço (conteúdo vem do <template> dentro do card)
var sheet = document.querySelector('dialog.svc-sheet');
if (sheet && typeof sheet.showModal === 'function') {
  document.querySelectorAll('.svc-more').forEach(function(button){
    button.addEventListener('click', function(){
      var card = button.closest('.svc-card');
      var details = card.querySelector('template.svc-details').content.cloneNode(true);
      sheet.querySelector('.sheet-tag').textContent = card.querySelector('.svc-tag').textContent;
      sheet.querySelector('#sheet-title').textContent = card.querySelector('h3').textContent;
      var gallery = details.querySelector('.sheet-gallery');
      sheet.querySelector('.sheet-media').replaceChildren(gallery);
      sheet.querySelector('.sheet-content').replaceChildren(details.querySelector('.sheet-info'));
      sheet.querySelector('.sheet-cta').href = button.dataset.wa;

      // indicadores da galeria (só quando há mais de uma foto)
      var dots = sheet.querySelector('.sheet-dots');
      dots.replaceChildren();
      if (gallery.children.length > 1) {
        for (var i = 0; i < gallery.children.length; i++) dots.appendChild(document.createElement('span'));
        var updateSheetDots = function(){
          var index = Math.round(gallery.scrollLeft / (gallery.clientWidth || 1));
          for (var j = 0; j < dots.children.length; j++) dots.children[j].classList.toggle('is-active', j === index);
        };
        gallery.addEventListener('scroll', updateSheetDots, { passive: true });
        updateSheetDots();
      }

      sheet.showModal();
      sheet.querySelector('.sheet-scroll').scrollTop = 0;
      gallery.scrollLeft = 0;
      document.documentElement.classList.add('sheet-open');
    });
  });
  sheet.querySelector('.sheet-close').addEventListener('click', function(){ sheet.close(); });
  // toque fora do painel (no fundo escurecido) fecha
  sheet.addEventListener('click', function(e){ if (e.target === sheet) sheet.close(); });
  sheet.addEventListener('close', function(){ if (!document.querySelector('dialog.book-sheet[open]')) document.documentElement.classList.remove('sheet-open'); });
} else {
  // navegador sem suporte a <dialog>: esconde o botão em vez de deixá-lo sem ação
  document.querySelectorAll('.svc-more').forEach(function(button){ button.hidden = true; });
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

// (a animação de "revelar ao rolar" agora fica em assets/js/animacoes.js, com a biblioteca Motion)

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

// Botões de WhatsApp sem repetição: o do cabeçalho e o flutuante só aparecem
// depois que o botão do hero sai da tela, e o flutuante some na chamada final.
(function(){
  var heroCta = document.querySelector('.hero-ctas');
  var finalCta = document.querySelector('.final-cta');
  if (!heroCta || !('IntersectionObserver' in window)) return;
  var root = document.documentElement;
  root.classList.add('cta-watch');
  new IntersectionObserver(function(entries){
    var e = entries[0];
    // "passou do hero" = botão fora da tela e acima da área visível
    root.classList.toggle('past-hero', !e.isIntersecting && e.boundingClientRect.top < 0);
  }).observe(heroCta);
  if (finalCta) {
    new IntersectionObserver(function(entries){
      root.classList.toggle('at-final', entries[0].isIntersecting);
    }, { rootMargin: '0px 0px -25% 0px' }).observe(finalCta);
  }
})();

// Agendamento: antes de abrir o WhatsApp, pede nome completo, idade e serviço(s)
// e monta a mensagem. Nada é armazenado nem enviado a servidor: os dados só vão
// na mensagem do WhatsApp. Sem suporte a <dialog>, os links abrem o WhatsApp direto.
(function(){
  var NUMBER = '5579998034464';
  var HELP = 'Ainda não sei, preciso de ajuda para escolher';
  var root = document.documentElement;
  var dlg = document.querySelector('dialog.book-sheet');
  if (!dlg || typeof dlg.showModal !== 'function') return;

  var form = dlg.querySelector('form');
  var nome = form.elements.nome, idade = form.elements.idade;
  var box = dlg.querySelector('#book-services');
  var errNome = dlg.querySelector('#err-nome'), errIdade = dlg.querySelector('#err-idade'), errServ = dlg.querySelector('#err-servicos');

  // opções de serviço geradas a partir dos cards, para nunca ficarem fora de sincronia
  var titles = Array.prototype.map.call(document.querySelectorAll('.svc-card:not(.cta) h3'), function(h){ return h.textContent.trim(); });
  titles.concat([HELP]).forEach(function(t, i){
    var label = document.createElement('label');
    label.className = 'chip' + (t === HELP ? ' chip-help' : '');
    var input = document.createElement('input');
    input.type = 'checkbox'; input.name = 'servico'; input.value = t;
    var span = document.createElement('span'); span.textContent = t;
    label.appendChild(input); label.appendChild(span);
    box.appendChild(label);
  });
  var boxes = Array.prototype.slice.call(box.querySelectorAll('input'));
  var helpBox = boxes[boxes.length - 1];

  // "ainda não sei" e os serviços específicos não se misturam
  box.addEventListener('change', function(e){
    if (e.target === helpBox && helpBox.checked) boxes.forEach(function(b){ if (b !== helpBox) b.checked = false; });
    else if (e.target !== helpBox && e.target.checked) helpBox.checked = false;
    errServ.textContent = '';
  });

  idade.addEventListener('input', function(){ idade.value = idade.value.replace(/\D/g, '').slice(0, 3); });
  [nome, idade].forEach(function(el){ el.addEventListener('input', function(){ el.removeAttribute('aria-invalid'); (el === nome ? errNome : errIdade).textContent = ''; }); });

  function openBook(preselect){
    form.reset();
    [errNome, errIdade, errServ].forEach(function(e){ e.textContent = ''; });
    [nome, idade].forEach(function(el){ el.removeAttribute('aria-invalid'); });
    boxes.forEach(function(b){ b.checked = preselect.indexOf(b.value) !== -1; });
    dlg.showModal();
    dlg.querySelector('.book-form').scrollTop = 0;
    // o painel de detalhes (se estava aberto) dispara "close" depois; garante o bloqueio de rolagem
    setTimeout(function(){ root.classList.add('sheet-open'); }, 0);
  }

  document.addEventListener('click', function(e){
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var t = e.target.closest('[data-agendar], .sheet-cta');
    if (!t) return;
    e.preventDefault();
    var pre = [];
    if (t.classList.contains('sheet-cta')) {
      pre = [document.querySelector('#sheet-title').textContent.trim()];
      var detalhes = document.querySelector('dialog.svc-sheet');
      if (detalhes && detalhes.open) detalhes.close();
    } else if (t.getAttribute('data-agendar') === 'ajuda') {
      pre = [HELP];
    }
    openBook(pre);
  });

  dlg.querySelector('.sheet-close').addEventListener('click', function(){ dlg.close(); });
  dlg.addEventListener('click', function(e){ if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', function(){ root.classList.remove('sheet-open'); form.reset(); });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var nomeVal = nome.value.replace(/[*_~`\r\n]/g, ' ').replace(/\s+/g, ' ').trim();
    var palavras = nomeVal.split(' ').filter(Boolean);
    var ok = true, primeiro = null;

    if (palavras.length < 2 || nomeVal.length < 5 || !/^[\p{L}][\p{L}'’.\- ]*$/u.test(nomeVal)) {
      errNome.textContent = 'Digite seu nome e sobrenome.'; nome.setAttribute('aria-invalid', 'true'); ok = false; primeiro = primeiro || nome;
    }
    var idadeNum = /^\d{1,3}$/.test(idade.value) ? parseInt(idade.value, 10) : NaN;
    if (!(idadeNum >= 1 && idadeNum <= 120)) {
      errIdade.textContent = 'Digite sua idade em números (ex.: 28).'; idade.setAttribute('aria-invalid', 'true'); ok = false; primeiro = primeiro || idade;
    }
    var escolhidos = boxes.filter(function(b){ return b.checked; }).map(function(b){ return b.value; });
    if (!escolhidos.length) { errServ.textContent = 'Escolha pelo menos um serviço.'; ok = false; primeiro = primeiro || boxes[0]; }
    if (!ok) { primeiro.focus(); return; }

    var texto = 'Olá, Letícia! Tudo bem?\n' +
      'Gostaria de agendar uma sessão de massoterapia.\n\n' +
      '*Nome:* ' + nomeVal + '\n' +
      '*Idade:* ' + idadeNum + ' anos\n' +
      '*Serviços:* ' + escolhidos.join(', ') + '\n\n' +
      'Poderia me informar os horários disponíveis?\n' +
      'Obrigado(a)!';
    var link = document.createElement('a');
    link.href = 'https://wa.me/' + NUMBER + '?text=' + encodeURIComponent(texto);
    link.target = '_blank'; link.rel = 'noopener';
    document.body.appendChild(link); link.click(); link.remove();

    // métricas: só os serviços escolhidos, nunca nome ou idade
    document.dispatchEvent(new CustomEvent('agendar:enviar', { detail: { servicos: escolhidos } }));
    dlg.close();
  });
})();
