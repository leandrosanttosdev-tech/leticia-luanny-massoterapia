// Animações suaves com a biblioteca Motion (versão JavaScript, sem React).
// Só usa opacity e transform (leve para o celular). Não altera nenhuma funcionalidade:
// se a biblioteca não carregar ou o aparelho pedir movimento reduzido, o site funciona igual.
(function(){
  var root = document.documentElement;
  if (!root.classList.contains('motion') || !window.Motion) return;

  var animate = Motion.animate, inView = Motion.inView, hover = Motion.hover, press = Motion.press, stagger = Motion.stagger;
  var EASE = [0.22, 0.8, 0.2, 1];
  window.__motionOk = true;

  // 1) Entrada do topo: textos em sequência curta e foto com leve fade
  var heroCopy = Array.prototype.slice.call(document.querySelectorAll('.hero-copy > *'));
  var heroMedia = document.querySelector('.hero-media');
  if (heroCopy.length) {
    animate(heroCopy, { opacity: [0, 1], y: [18, 0] }, { duration: 0.7, ease: EASE, delay: stagger(0.09, { startDelay: 0.05 }) });
  }
  if (heroMedia) {
    animate(heroMedia, { opacity: [0, 1], scale: [0.98, 1] }, { duration: 0.9, ease: EASE, delay: 0.2 });
  }

  // 2) Blocos que aparecem ao rolar (mesmos blocos que já revelavam antes)
  var blocos = Array.prototype.slice.call(document.querySelectorAll(
    '.value-item, .about-media, .about-copy, .section-head, .svc-grid, .how-step, .band-media, .band-copy, .final-cta .wrap'
  ));
  blocos.forEach(function(el){
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
  });
  inView(blocos, function(el){
    // irmãos que entram juntos (ex.: os 3 passos) aparecem em sequência
    var irmaos = blocos.filter(function(b){ return b.parentNode === el.parentNode; });
    var atraso = Math.min(irmaos.indexOf(el) * 0.09, 0.3);
    animate(el, { opacity: 1, y: 0 }, { duration: 0.7, ease: EASE, delay: atraso }).finished.then(function(){
      el.style.opacity = '';
      el.style.transform = '';
    });
  }, { margin: '0px 0px -8% 0px' });

  // 3) Botões: leve destaque ao passar o mouse e ao apertar (hover só em aparelhos com mouse)
  hover('.btn', function(el){
    animate(el, { scale: 1.03 }, { duration: 0.2, ease: 'easeOut' });
    return function(){ animate(el, { scale: 1 }, { duration: 0.25, ease: 'easeOut' }); };
  });
  press('.btn', function(el){
    animate(el, { scale: 0.97 }, { duration: 0.12, ease: 'easeOut' });
    return function(){ animate(el, { scale: el.matches(':hover') ? 1.03 : 1 }, { duration: 0.2, ease: 'easeOut' }); };
  });

  // 4) Parallax suave nas fotos do topo e do "Sobre": a foto se move um pouco mais devagar que a página
  var amplitude = window.innerWidth < 700 ? '4%' : '5%';
  ['.hero-media figure', '.about-media figure'].forEach(function(seletor){
    var caixa = document.querySelector(seletor);
    var img = caixa && caixa.querySelector('img');
    if (!img) return;
    Motion.scroll(
      animate(img, { y: ['-' + amplitude, amplitude] }, { ease: 'linear' }),
      { target: caixa, offset: ['start end', 'end start'] }
    );
  });

  // 5) Ramo de folhas: depois de se desenhar, as folhas balançam de leve conforme a página é rolada
  var ramo = document.querySelector('.vine');
  var folhas = ramo ? Array.prototype.slice.call(ramo.querySelectorAll('.leaf')) : [];
  if (folhas.length) {
    var iniciarBalanco = function(){
      if (ramo.classList.contains('vine-live')) return;
      ramo.classList.add('vine-live');
      folhas.forEach(function(folha, i){
        var graus = (i % 2 ? 7 : -7) * (1 + (i % 3) * 0.15);
        Motion.scroll(animate(folha, { rotate: [0, graus, 0, -graus, 0] }, { ease: 'linear' }));
      });
    };
    // espera a última folha terminar de aparecer (animação de CSS) antes de assumir o controle
    folhas[folhas.length - 1].addEventListener('animationend', iniciarBalanco, { once: true });
    setTimeout(iniciarBalanco, 4500);
  }

  // 6) Formulário de agendamento: abre com as opções em sequência, fecha suavemente e "treme" no erro
  var dlg = document.querySelector('dialog.book-sheet');
  if (dlg) {
    var fecharOriginal = dlg.close.bind(dlg);
    var abrirOriginal = dlg.showModal.bind(dlg);
    var fechando = false;
    var animFechar = null;

    dlg.showModal = function(){
      // cancela qualquer animação de fechamento pendente e limpa suas sobras, para nunca reabrir invisível
      if (animFechar) { animFechar.cancel(); animFechar = null; }
      fechando = false;
      dlg.style.opacity = '';
      dlg.style.transform = '';
      abrirOriginal();
      animate(dlg.querySelectorAll('.chip'), { opacity: [0, 1], y: [8, 0] }, { duration: 0.35, ease: EASE, delay: stagger(0.05, { startDelay: 0.15 }) });
    };
    dlg.close = function(retorno){
      if (!dlg.open || fechando) return;
      fechando = true;
      var concluir = function(){
        if (!fechando) return;
        fechando = false;
        if (animFechar) { animFechar.cancel(); animFechar = null; }
        fecharOriginal(retorno);
        dlg.style.opacity = '';
        dlg.style.transform = '';
      };
      animFechar = animate(dlg, { opacity: [1, 0], y: [0, 24] }, { duration: 0.2, ease: 'easeIn' });
      animFechar.finished.then(concluir, function(){});
      // garantia: mesmo que a animação não rode (aba em segundo plano), o formulário fecha
      setTimeout(concluir, 600);
    };
    // a tecla Esc também fecha com a animação
    dlg.addEventListener('cancel', function(e){ e.preventDefault(); dlg.close(); });

    // tremida curta nos campos com erro (roda depois da validação do formulário)
    dlg.querySelector('form').addEventListener('submit', function(){
      setTimeout(function(){
        var alvos = Array.prototype.slice.call(dlg.querySelectorAll('input[aria-invalid="true"]'));
        var servicos = dlg.querySelector('#err-servicos');
        if (servicos && servicos.textContent) alvos.push(dlg.querySelector('.chips'));
        alvos.forEach(function(el){ animate(el, { x: [0, -6, 6, -4, 4, 0] }, { duration: 0.4, ease: 'easeOut' }); });
      }, 0);
    });
  }
})();
