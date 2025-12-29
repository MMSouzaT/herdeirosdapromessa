// Google Analytics 4 - Herdeiros da Promessa
// Substitua 'G-XXXXXXXXXX' pelo seu ID de Medição do Google Analytics

(function() {
  // Configuração do Google Analytics
  const GA_MEASUREMENT_ID = 'G-7RYQMMDY9V'; // ⚠️ SUBSTITUA ESTE ID

  // Carrega o script do Google Analytics
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Inicializa o gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    'send_page_view': true,
    'anonymize_ip': true // LGPD compliance
  });

  // Eventos personalizados úteis
  
  // Rastreia cliques em links externos
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href && !link.href.includes(window.location.hostname)) {
      gtag('event', 'click', {
        'event_category': 'external_link',
        'event_label': link.href,
        'transport_type': 'beacon'
      });
    }
  });

  // Rastreia downloads de PDF
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href && link.href.toLowerCase().includes('.pdf')) {
      gtag('event', 'file_download', {
        'event_category': 'downloads',
        'event_label': link.href,
        'file_extension': 'pdf'
      });
    }
  });

  // Rastreia scroll depth (profundidade de rolagem)
  let scrollDepths = [25, 50, 75, 100];
  let scrollTracked = {};
  
  window.addEventListener('scroll', function() {
    const scrollPercent = Math.round(
      (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
    );
    
    scrollDepths.forEach(function(depth) {
      if (scrollPercent >= depth && !scrollTracked[depth]) {
        scrollTracked[depth] = true;
        gtag('event', 'scroll', {
          'event_category': 'engagement',
          'event_label': depth + '%',
          'value': depth
        });
      }
    });
  });

  // Rastreia tempo na página
  let startTime = new Date();
  window.addEventListener('beforeunload', function() {
    let timeSpent = Math.round((new Date() - startTime) / 1000); // em segundos
    gtag('event', 'timing_complete', {
      'name': 'time_on_page',
      'value': timeSpent,
      'event_category': 'engagement'
    });
  });

  // Rastreia cliques em botões de compra (Evento de Conversão)
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href && link.href.includes('pay.cakto.com.br')) {
      gtag('event', 'purchase_click', {
        'event_category': 'conversao',
        'event_label': 'Botao de Compra - Cakto',
        'value': 19.90,
        'currency': 'BRL',
        'button_text': link.textContent.trim(),
        'page_url': window.location.pathname
      });
      
      // Também envia como evento de conversão do Google Analytics
      gtag('event', 'begin_checkout', {
        'currency': 'BRL',
        'value': 19.90,
        'items': [{
          'item_name': 'Colecao Herdeiros da Promessa',
          'price': 19.90,
          'quantity': 1
        }]
      });
    }
  });

})();
