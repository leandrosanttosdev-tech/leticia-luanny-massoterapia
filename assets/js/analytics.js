// Configuração de métricas.
// Preencha os IDs abaixo para ativar; enquanto estiverem vazios, nada é carregado.
var ANALYTICS_CONFIG = {
  ga4Id: '',      // Google Analytics 4, ex.: 'G-XXXXXXXXXX'
  metaPixelId: '' // Meta Pixel (Facebook/Instagram), ex.: '123456789012345'
};

(function(config){
  if (config.ga4Id) {
    var gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + config.ga4Id;
    document.head.appendChild(gaScript);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', config.ga4Id);
  }

  if (config.metaPixelId) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', config.metaPixelId);
    window.fbq('track', 'PageView');
  }

  if (!config.ga4Id && !config.metaPixelId) return;

  // Registra cliques nos canais de contato
  function channelOf(href){
    if (href.indexOf('wa.me') !== -1) return 'whatsapp';
    if (href.indexOf('instagram.com') !== -1) return 'instagram';
    if (href.indexOf('tel:') === 0) return 'telefone';
    return null;
  }

  document.addEventListener('click', function(e){
    var link = e.target.closest('a[href]');
    if (!link) return;
    var channel = channelOf(link.getAttribute('href'));
    if (!channel) return;
    var label = (link.textContent.trim() || link.getAttribute('aria-label') || '').replace(/\s+/g, ' ');
    var card = link.closest('.svc-card, .svc-sheet');
    var service = card && card.querySelector('h3');
    if (service) label += ' - ' + service.textContent.trim();
    var location = 'flutuante';
    if (link.closest('.svc-sheet')) location = 'detalhes-servico';
    else if (link.closest('header')) location = 'cabecalho';
    else if (link.closest('footer')) location = 'rodape';
    else if (link.closest('section')) location = link.closest('section').id || link.closest('section').className.split(' ')[0];

    if (window.gtag) {
      window.gtag('event', 'clique_contato', { canal: channel, botao: label, local: location });
    }
    if (window.fbq) {
      window.fbq('track', 'Contact', { content_name: channel + ' - ' + label });
    }
  });
})(ANALYTICS_CONFIG);
