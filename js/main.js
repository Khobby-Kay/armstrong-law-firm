(function () {
  'use strict';

  function initHeroSlider() {
    var slides = document.querySelectorAll('.hero__slide');
    var dotsContainer = document.querySelector('.hero__dots');
    var currentSlide = 0;
    var slideInterval;

    if (!slides.length || !dotsContainer) return;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.classList.add('hero__dot');
      if (i === 0) dot.classList.add('hero__dot--active');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', function () {
        goToSlide(i);
        resetInterval();
      });
      dotsContainer.appendChild(dot);
    });

    var dots = dotsContainer.querySelectorAll('.hero__dot');

    function goToSlide(index) {
      slides[currentSlide].classList.remove('hero__slide--active');
      dots[currentSlide].classList.remove('hero__dot--active');
      currentSlide = (index + slides.length) % slides.length;
      slides[currentSlide].classList.add('hero__slide--active');
      dots[currentSlide].classList.add('hero__dot--active');
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function resetInterval() {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 6000);
    }

    slideInterval = setInterval(nextSlide, 6000);
  }

  function initTestimonialsSlider() {
    var testimonialTrack = document.querySelector('.testimonials__track');
    var testimonialPrev = document.querySelector('.testimonials__btn--prev');
    var testimonialNext = document.querySelector('.testimonials__btn--next');
    var testimonialIndex = 0;

    if (!testimonialTrack) return;

    var testimonials = testimonialTrack.querySelectorAll('.testimonial');
    var total = testimonials.length;

    function goToTestimonial(index) {
      testimonialIndex = (index + total) % total;
      testimonialTrack.style.transform = 'translateX(-' + (testimonialIndex * 100) + '%)';
    }

    if (testimonialPrev) testimonialPrev.addEventListener('click', function () { goToTestimonial(testimonialIndex - 1); });
    if (testimonialNext) testimonialNext.addEventListener('click', function () { goToTestimonial(testimonialIndex + 1); });

    setInterval(function () { goToTestimonial(testimonialIndex + 1); }, 8000);
  }

  function isMobileNav() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  function openMobileNav() {
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');
    var navOverlay = document.getElementById('navOverlay');

    if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
    if (navMenu) navMenu.classList.add('active');
    if (navOverlay) {
      navOverlay.classList.add('active');
      navOverlay.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');
    var navOverlay = document.getElementById('navOverlay');

    if (navToggle) {
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
    if (navMenu) navMenu.classList.remove('active');
    if (navOverlay) {
      navOverlay.classList.remove('active');
      navOverlay.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
  }

  function initMobileNav() {
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');
    var navOverlay = document.getElementById('navOverlay');

    if (!navToggle || !navMenu || navToggle.dataset.bound === 'true') return;
    navToggle.dataset.bound = 'true';

    navToggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (navMenu.classList.contains('active')) {
        closeMobileNav();
      } else {
        navToggle.classList.add('active');
        openMobileNav();
      }
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', closeMobileNav);
    }

    navMenu.querySelectorAll('.nav__item--dropdown > .nav__link--parent').forEach(function (parentLink) {
      parentLink.addEventListener('click', function (e) {
        if (!isMobileNav()) return;
        var item = parentLink.closest('.nav__item--dropdown');
        if (!item) return;
        if (item.classList.contains('nav__dropdown--open')) {
          closeMobileNav();
          return;
        }
        e.preventDefault();
        document.querySelectorAll('.nav__item--dropdown').forEach(function (other) {
          if (other !== item) other.classList.remove('nav__dropdown--open');
        });
        item.classList.add('nav__dropdown--open');
      });
    });

    navMenu.querySelectorAll('a').forEach(function (link) {
      if (link.classList.contains('nav__link--parent')) return;
      link.addEventListener('click', closeMobileNav);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobileNav();
    });

    window.addEventListener('resize', function () {
      if (!isMobileNav()) {
        closeMobileNav();
        document.querySelectorAll('.nav__item--dropdown').forEach(function (item) {
          item.classList.remove('nav__dropdown--open');
        });
      }
    });
  }

  function initHeaderScroll() {
    var header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', function () {
      header.classList.toggle('header--scrolled', window.scrollY > 50);
    });
  }

  function initScrollTop() {
    var scrollTopBtn = document.getElementById('scrollTop');
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', function () {
      scrollTopBtn.classList.toggle('scroll-top--visible', window.scrollY > 500);
    });

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function showToast(message) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add('toast--visible');
    });

    setTimeout(function () {
      toast.classList.remove('toast--visible');
      setTimeout(function () { toast.remove(); }, 400);
    }, 3000);
  }

  function initForms() {
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        showToast('Thank you! We will contact you shortly to confirm your appointment.');
        contactForm.reset();
      });
    }

    document.querySelectorAll('#newsletterForm').forEach(function (newsletterForm) {
      newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();
        showToast('Successfully subscribed to our newsletter!');
        newsletterForm.reset();
      });
    });
  }

  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    function animate(el) {
      var target = parseFloat(el.getAttribute('data-count')) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1600;
      var start = null;

      function step(timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      }

      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach(function (el) { observer.observe(el); });
  }

  function initFaq() {
    var items = document.querySelectorAll('.faq__item');
    if (!items.length) return;

    items.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (!item.open) return;
        items.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      });
    });
  }

  function initScrollAnimations() {
    var animateElements = document.querySelectorAll(
      '.expertise-teaser li, .practice-list__item, .about__metric, .highlights__item, .team__card, .insights__card, .why__card, .process__step, .industries__item, .testimonial-card, .faq__item'
    );

    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    animateElements.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  function initAll() {
    if (document.body.dataset.appInit === 'true') return;
    document.body.dataset.appInit = 'true';

    initHeroSlider();
    initTestimonialsSlider();
    initMobileNav();
    initHeaderScroll();
    initScrollTop();
    initForms();
    initCounters();
    initFaq();
    initScrollAnimations();
  }

  document.addEventListener('layoutReady', initAll);

  if (document.getElementById('navToggle')) {
    initAll();
  }
})();
