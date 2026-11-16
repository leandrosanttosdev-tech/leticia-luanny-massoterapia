// Marca a página como "pronta para animar" antes da primeira pintura, para o topo
// não aparecer e sumir. Não roda para quem pediu movimento reduzido no aparelho.
// Se a biblioteca de animação não carregar em 3s, o conteúdo é liberado sem animação.
(function(){
  var root = document.documentElement;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.classList.add('motion');
  setTimeout(function(){
    if (!window.__motionOk) root.classList.remove('motion');
  }, 3000);
})();
