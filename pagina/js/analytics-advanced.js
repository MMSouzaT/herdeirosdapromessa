/**
 * Sistema Avançado de Analytics - Herdeiros da Promessa
 * Este sistema coleta dados detalhados para otimização de conversão e retenção
 */

(function() {
  'use strict';

  // ========================================
  // CONFIGURAÇÃO
  // ========================================
  const CONFIG = {
    GA_ID: 'G-7RYQMMDY9V',
    GTM_ID: 'GTM-NB6D5WMV',
    DEBUG: false, // Ative para ver logs no console
    
    // Limites de tempo para análise
    TIME_THRESHOLDS: {
      engaged: 10, // 10 segundos = usuário engajado
      serious: 30, // 30 segundos = usuário sério
      veryInterested: 60, // 1 minuto = muito interessado
      readyToBuy: 120 // 2 minutos = pronto para comprar
    },
    
    // Seções para rastrear tempo
    TRACKED_SECTIONS: [
      'hero',
      'video-section',
      'historias-biblicas',
      'ilustracoes-biblicas',
      'beneficios',
      'bonus',
      'comprar',
      'faq'
    ]
  };

  // ========================================
  // UTILIDADES
  // ========================================
  const Utils = {
    log: function(...args) {
      if (CONFIG.DEBUG) {
        console.log('[Analytics]', ...args);
      }
    },
    
    sendEvent: function(eventName, params = {}) {
      if (typeof gtag !== 'undefined') {
        gtag('event', eventName, params);
        this.log('Evento enviado:', eventName, params);
      }
      
      // Também envia para dataLayer (GTM)
      if (typeof window.dataLayer !== 'undefined') {
        window.dataLayer.push({
          event: eventName,
          ...params
        });
      }
    },
    
    getDeviceType: function() {
      const width = window.innerWidth;
      if (width < 768) return 'mobile';
      if (width < 1024) return 'tablet';
      return 'desktop';
    },
    
    getScrollPercent: function() {
      const h = document.documentElement;
      const b = document.body;
      const st = 'scrollTop';
      const sh = 'scrollHeight';
      return Math.round((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100);
    },
    
    formatTime: function(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}m ${secs}s`;
    }
  };

  // ========================================
  // RASTREAMENTO DE SESSÃO E USUÁRIO
  // ========================================
  const SessionTracker = {
    sessionId: null,
    startTime: null,
    userId: null,
    
    init: function() {
      this.sessionId = this.getOrCreateSessionId();
      this.userId = this.getOrCreateUserId();
      this.startTime = Date.now();
      
      // Rastreia início da sessão
      Utils.sendEvent('session_start', {
        session_id: this.sessionId,
        user_id: this.userId,
        device_type: Utils.getDeviceType(),
        screen_width: window.innerWidth,
        screen_height: window.innerHeight,
        referrer: document.referrer,
        landing_page: window.location.pathname,
        utm_source: this.getUrlParam('utm_source'),
        utm_medium: this.getUrlParam('utm_medium'),
        utm_campaign: this.getUrlParam('utm_campaign')
      });
    },
    
    getOrCreateSessionId: function() {
      let sessionId = sessionStorage.getItem('hp_session_id');
      if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('hp_session_id', sessionId);
      }
      return sessionId;
    },
    
    getOrCreateUserId: function() {
      let userId = localStorage.getItem('hp_user_id');
      if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('hp_user_id', userId);
      }
      return userId;
    },
    
    getUrlParam: function(param) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param) || 'none';
    },
    
    getSessionDuration: function() {
      return Math.floor((Date.now() - this.startTime) / 1000);
    }
  };

  // ========================================
  // RASTREAMENTO DE CLIQUES DETALHADO
  // ========================================
  const ClickTracker = {
    init: function() {
      document.addEventListener('click', this.handleClick.bind(this));
    },
    
    handleClick: function(e) {
      const element = e.target;
      const elementInfo = this.getElementInfo(element);
      
      // Rastreia todos os cliques
      Utils.sendEvent('element_click', {
        element_type: elementInfo.type,
        element_text: elementInfo.text,
        element_class: elementInfo.classes,
        element_id: elementInfo.id,
        element_url: elementInfo.url,
        page_section: elementInfo.section,
        click_position_x: e.clientX,
        click_position_y: e.clientY,
        session_duration: SessionTracker.getSessionDuration()
      });
      
      // Rastreamento específico de CTAs
      if (this.isCTA(element)) {
        const ctaType = this.getCTAType(element);
        Utils.sendEvent('cta_click', {
          cta_type: ctaType,
          cta_text: elementInfo.text,
          cta_position: elementInfo.section,
          time_to_click: SessionTracker.getSessionDuration(),
          scroll_depth: Utils.getScrollPercent()
        });
      }
      
      // Rastreamento de botões de compra
      if (this.isPurchaseButton(element)) {
        Utils.sendEvent('purchase_button_click', {
          button_text: elementInfo.text,
          button_position: elementInfo.section,
          time_to_click: SessionTracker.getSessionDuration(),
          scroll_depth: Utils.getScrollPercent(),
          device_type: Utils.getDeviceType()
        });
      }
      
      // Rastreamento de FAQ
      if (element.closest('details')) {
        const summary = element.closest('details').querySelector('summary');
        Utils.sendEvent('faq_interaction', {
          question: summary ? summary.textContent.trim() : 'unknown',
          action: element.closest('details').open ? 'close' : 'open'
        });
      }
    },
    
    getElementInfo: function(element) {
      const closest = element.closest('a, button, [role="button"]') || element;
      return {
        type: closest.tagName.toLowerCase(),
        text: closest.textContent.trim().substring(0, 100),
        classes: closest.className,
        id: closest.id,
        url: closest.href || '',
        section: this.findSection(closest)
      };
    },
    
    findSection: function(element) {
      const sections = {
        'hero': element.closest('header'),
        'video-section': element.closest('section')?.textContent?.includes('vídeo') ? element.closest('section') : null,
        'historias': element.closest('section')?.textContent?.includes('Histórias') ? element.closest('section') : null,
        'ilustracoes': element.closest('section')?.textContent?.includes('Ilustrações') ? element.closest('section') : null,
        'faq': element.closest('section')?.querySelector('details') ? element.closest('section') : null
      };
      
      for (const [name, section] of Object.entries(sections)) {
        if (section) return name;
      }
      return 'unknown';
    },
    
    isCTA: function(element) {
      const text = element.textContent.toLowerCase();
      const ctaKeywords = ['quero', 'garantir', 'adquirir', 'comprar', 'assinar', 'começar'];
      return ctaKeywords.some(keyword => text.includes(keyword));
    },
    
    getCTAType: function(element) {
      const text = element.textContent.toLowerCase();
      if (text.includes('comprar') || text.includes('garantir')) return 'primary_cta';
      if (text.includes('explorar') || text.includes('ver')) return 'secondary_cta';
      return 'other_cta';
    },
    
    isPurchaseButton: function(element) {
      const href = element.href || element.closest('a')?.href || '';
      return href.includes('pay.cakto.com.br') || href.includes('#comprar');
    }
  };

  // ========================================
  // RASTREAMENTO DE SCROLL E ENGAJAMENTO
  // ========================================
  const ScrollTracker = {
    scrollDepths: [10, 25, 50, 75, 90, 100],
    trackedDepths: {},
    maxScroll: 0,
    sectionTimes: {},
    currentSection: null,
    sectionStartTime: null,
    
    init: function() {
      window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 500));
      this.initSectionTracking();
    },
    
    handleScroll: function() {
      const scrollPercent = Utils.getScrollPercent();
      
      // Rastreia profundidade de scroll
      this.scrollDepths.forEach(depth => {
        if (scrollPercent >= depth && !this.trackedDepths[depth]) {
          this.trackedDepths[depth] = true;
          Utils.sendEvent('scroll_depth', {
            depth: depth,
            time_to_depth: SessionTracker.getSessionDuration(),
            device_type: Utils.getDeviceType()
          });
        }
      });
      
      // Rastreia scroll máximo
      if (scrollPercent > this.maxScroll) {
        this.maxScroll = scrollPercent;
      }
      
      // Rastreia tempo em seções
      this.trackSectionTime();
    },
    
    initSectionTracking: function() {
      CONFIG.TRACKED_SECTIONS.forEach(sectionId => {
        this.sectionTimes[sectionId] = 0;
      });
    },
    
    trackSectionTime: function() {
      const sections = document.querySelectorAll('section, header');
      let foundSection = null;
      
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2;
        
        if (isVisible && !foundSection) {
          foundSection = section.id || this.getSectionName(section);
        }
      });
      
      if (foundSection !== this.currentSection) {
        // Envia tempo da seção anterior
        if (this.currentSection && this.sectionStartTime) {
          const timeSpent = Math.floor((Date.now() - this.sectionStartTime) / 1000);
          this.sectionTimes[this.currentSection] = (this.sectionTimes[this.currentSection] || 0) + timeSpent;
          
          Utils.sendEvent('section_time', {
            section: this.currentSection,
            time_spent: timeSpent,
            total_time: this.sectionTimes[this.currentSection]
          });
        }
        
        // Inicia nova seção
        this.currentSection = foundSection;
        this.sectionStartTime = Date.now();
      }
    },
    
    getSectionName: function(section) {
      if (section.tagName === 'HEADER') return 'hero';
      const text = section.textContent.toLowerCase();
      if (text.includes('vídeo')) return 'video-section';
      if (text.includes('história')) return 'historias-biblicas';
      if (text.includes('ilustra')) return 'ilustracoes-biblicas';
      if (text.includes('benefício')) return 'beneficios';
      if (text.includes('bônus')) return 'bonus';
      if (text.includes('comprar') || text.includes('adquira')) return 'comprar';
      if (text.includes('dúvida')) return 'faq';
      return 'unknown';
    },
    
    throttle: function(func, delay) {
      let lastCall = 0;
      return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
          lastCall = now;
          func(...args);
        }
      };
    }
  };

  // ========================================
  // RASTREAMENTO DE INTERAÇÃO COM VÍDEO
  // ========================================
  const VideoTracker = {
    init: function() {
      const video = document.getElementById('videoAutoPlay') || document.querySelector('video');
      if (!video) return;
      
      let quartiles = {25: false, 50: false, 75: false, 100: false};
      
      video.addEventListener('play', () => {
        Utils.sendEvent('video_play', {
          video_id: 'main_video',
          time_to_play: SessionTracker.getSessionDuration()
        });
      });
      
      video.addEventListener('pause', () => {
        Utils.sendEvent('video_pause', {
          video_id: 'main_video',
          current_time: Math.floor(video.currentTime),
          percent_watched: Math.floor((video.currentTime / video.duration) * 100)
        });
      });
      
      video.addEventListener('timeupdate', () => {
        const percent = Math.floor((video.currentTime / video.duration) * 100);
        
        Object.keys(quartiles).forEach(quartile => {
          if (percent >= quartile && !quartiles[quartile]) {
            quartiles[quartile] = true;
            Utils.sendEvent('video_progress', {
              video_id: 'main_video',
              progress: quartile
            });
          }
        });
      });
      
      video.addEventListener('ended', () => {
        Utils.sendEvent('video_complete', {
          video_id: 'main_video',
          time_to_complete: SessionTracker.getSessionDuration()
        });
      });
    }
  };

  // ========================================
  // RASTREAMENTO DE FORMULÁRIOS E INPUTS
  // ========================================
  const FormTracker = {
    init: function() {
      // Rastreia focus em inputs
      document.addEventListener('focus', (e) => {
        if (e.target.matches('input, textarea, select')) {
          Utils.sendEvent('form_field_focus', {
            field_name: e.target.name || e.target.id || 'unknown',
            field_type: e.target.type
          });
        }
      }, true);
      
      // Rastreia preenchimento de formulários
      document.addEventListener('input', this.throttle((e) => {
        if (e.target.matches('input, textarea')) {
          Utils.sendEvent('form_field_input', {
            field_name: e.target.name || e.target.id || 'unknown',
            has_value: e.target.value.length > 0
          });
        }
      }, 1000));
    },
    
    throttle: function(func, delay) {
      let timeout = null;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
      };
    }
  };

  // ========================================
  // RASTREAMENTO DE COMPORTAMENTO DE COMPRA
  // ========================================
  const PurchaseFunnelTracker = {
    funnelSteps: {
      page_view: false,
      video_watched: false,
      scrolled_50: false,
      viewed_price: false,
      clicked_cta: false,
      reached_checkout: false
    },
    
    init: function() {
      this.trackFunnelStep('page_view');
      this.observePriceSection();
      this.observeCheckoutSection();
    },
    
    trackFunnelStep: function(step) {
      if (!this.funnelSteps[step]) {
        this.funnelSteps[step] = true;
        
        Utils.sendEvent('funnel_step', {
          step: step,
          time_from_start: SessionTracker.getSessionDuration(),
          steps_completed: Object.values(this.funnelSteps).filter(v => v).length
        });
        
        // Calcula taxa de abandono em cada etapa
        const totalSteps = Object.keys(this.funnelSteps).length;
        const completedSteps = Object.values(this.funnelSteps).filter(v => v).length;
        const funnelProgress = Math.floor((completedSteps / totalSteps) * 100);
        
        Utils.sendEvent('funnel_progress', {
          progress_percent: funnelProgress,
          current_step: step
        });
      }
    },
    
    observePriceSection: function() {
      const priceElements = document.querySelectorAll('[class*="price"], [class*="19,90"], [class*="valor"]');
      if (priceElements.length === 0) return;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.trackFunnelStep('viewed_price');
          }
        });
      }, { threshold: 0.5 });
      
      priceElements.forEach(el => observer.observe(el));
    },
    
    observeCheckoutSection: function() {
      const checkoutSection = document.getElementById('comprar');
      if (!checkoutSection) return;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.trackFunnelStep('reached_checkout');
            
            Utils.sendEvent('checkout_section_viewed', {
              time_to_checkout: SessionTracker.getSessionDuration(),
              scroll_depth: Utils.getScrollPercent()
            });
          }
        });
      }, { threshold: 0.3 });
      
      observer.observe(checkoutSection);
    }
  };

  // ========================================
  // RASTREAMENTO DE HESITAÇÃO E ABANDONO
  // ========================================
  const HesitationTracker = {
    mouseLeaveCount: 0,
    idleTime: 0,
    idleTimer: null,
    
    init: function() {
      // Detecta intenção de saída
      document.addEventListener('mouseout', (e) => {
        if (e.clientY < 0) {
          this.mouseLeaveCount++;
          
          Utils.sendEvent('exit_intent', {
            mouse_leave_count: this.mouseLeaveCount,
            time_on_page: SessionTracker.getSessionDuration(),
            scroll_depth: Utils.getScrollPercent(),
            max_scroll: ScrollTracker.maxScroll
          });
        }
      });
      
      // Detecta inatividade
      this.resetIdleTimer();
      ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, () => this.resetIdleTimer());
      });
      
      // Detecta antes de sair da página
      window.addEventListener('beforeunload', () => {
        this.trackPageExit();
      });
    },
    
    resetIdleTimer: function() {
      clearTimeout(this.idleTimer);
      this.idleTimer = setTimeout(() => {
        Utils.sendEvent('user_idle', {
          idle_time: 30,
          time_on_page: SessionTracker.getSessionDuration()
        });
      }, 30000); // 30 segundos
    },
    
    trackPageExit: function() {
      const sessionDuration = SessionTracker.getSessionDuration();
      
      Utils.sendEvent('page_exit', {
        session_duration: sessionDuration,
        max_scroll: ScrollTracker.maxScroll,
        pages_viewed: 1,
        video_watched: PurchaseFunnelTracker.funnelSteps.video_watched,
        reached_checkout: PurchaseFunnelTracker.funnelSteps.reached_checkout,
        engagement_level: this.getEngagementLevel(sessionDuration)
      });
    },
    
    getEngagementLevel: function(duration) {
      if (duration < CONFIG.TIME_THRESHOLDS.engaged) return 'bounce';
      if (duration < CONFIG.TIME_THRESHOLDS.serious) return 'low';
      if (duration < CONFIG.TIME_THRESHOLDS.veryInterested) return 'medium';
      if (duration < CONFIG.TIME_THRESHOLDS.readyToBuy) return 'high';
      return 'very_high';
    }
  };

  // ========================================
  // RASTREAMENTO DE PERFORMANCE
  // ========================================
  const PerformanceTracker = {
    init: function() {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = window.performance.timing;
          const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
          const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
          
          Utils.sendEvent('page_performance', {
            page_load_time: Math.round(pageLoadTime / 1000),
            dom_ready_time: Math.round(domReadyTime / 1000),
            device_type: Utils.getDeviceType()
          });
        }, 0);
      });
    }
  };

  // ========================================
  // RASTREAMENTO DE ERROS
  // ========================================
  const ErrorTracker = {
    init: function() {
      window.addEventListener('error', (e) => {
        Utils.sendEvent('javascript_error', {
          error_message: e.message,
          error_source: e.filename,
          error_line: e.lineno,
          page: window.location.pathname
        });
      });
    }
  };

  // ========================================
  // INICIALIZAÇÃO
  // ========================================
  function init() {
    // Aguarda o DOM estar pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    
    Utils.log('Iniciando sistema avançado de analytics...');
    
    // Inicializa todos os módulos
    SessionTracker.init();
    ClickTracker.init();
    ScrollTracker.init();
    VideoTracker.init();
    FormTracker.init();
    PurchaseFunnelTracker.init();
    HesitationTracker.init();
    PerformanceTracker.init();
    ErrorTracker.init();
    
    Utils.log('Sistema de analytics inicializado com sucesso!');
  }

  // Inicia o sistema
  init();

})();
