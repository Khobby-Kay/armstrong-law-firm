(function () {
  'use strict';

  var pages = {
    home: { label: 'Home', path: 'index.html' },
    about: { label: 'About Us', path: 'about.html' },
    team: { label: 'Our Team', path: 'team.html' },
    careers: { label: 'Careers', path: 'careers.html' },
    expertise: { label: 'Expertise', path: 'expertise.html' },
    corporate: { label: 'Corporate & Commercial', path: 'corporate-commercial.html' },
    dispute: { label: 'Dispute Resolution', path: 'dispute-resolution.html' },
    compliance: { label: 'Regulatory Compliance', path: 'regulatory-compliance.html' },
    realestate: { label: 'Real Estate & Construction', path: 'real-estate.html' },
    employment: { label: 'Employment & Immigration', path: 'employment-immigration.html' },
    technology: { label: 'Technology & IP', path: 'technology-ip.html' },
    energy: { label: 'Energy & Natural Resources', path: 'energy-resources.html' },
    family: { label: 'Family, Trust & Probate', path: 'family-trust-probate.html' },
    highlights: { label: 'Work Highlights', path: 'highlights.html' },
    publications: { label: 'Publications', path: 'publications.html' },
    newsletter: { label: 'Newsletter', path: 'newsletter.html' },
    testimonials: { label: 'Client Testimonials', path: 'testimonials.html' },
    support: { label: 'Business Support', path: 'business-support.html' },
    contact: { label: 'Contact', path: 'contact.html' },
    disclaimer: { label: 'Disclaimer Notice', path: 'disclaimer.html' }
  };

  function isActive(key) {
    return document.body.dataset.page === key ? ' nav__link--active' : '';
  }

  function headerHTML() {
    return (
      '<header class="header" id="header">' +
        '<nav class="nav container">' +
          '<a href="index.html" class="nav__logo">' +
            '<img src="images/logo.png" alt="Armstrong Law Firm" class="nav__logo-img">' +
          '</a>' +
          '<button type="button" class="nav__toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
          '<ul class="nav__menu" id="navMenu">' +
            '<li class="nav__item nav__item--dropdown">' +
              '<a href="about.html" class="nav__link nav__link--parent' + isActive('about') + isActive('team') + isActive('careers') + '">The Firm</a>' +
              '<ul class="nav__dropdown">' +
                '<li><a href="about.html">About Us</a></li>' +
                '<li><a href="team.html">Our Team</a></li>' +
                '<li><a href="careers.html">Careers</a></li>' +
              '</ul>' +
            '</li>' +
            '<li class="nav__item nav__item--dropdown">' +
              '<a href="expertise.html" class="nav__link nav__link--parent' + isActive('expertise') + isActive('corporate') + isActive('dispute') + isActive('compliance') + isActive('realestate') + '">Expertise</a>' +
              '<ul class="nav__dropdown">' +
                '<li><a href="corporate-commercial.html">Corporate & Commercial</a></li>' +
                '<li><a href="dispute-resolution.html">Dispute Resolution</a></li>' +
                '<li><a href="regulatory-compliance.html">Regulatory Compliance</a></li>' +
                '<li><a href="real-estate.html">Real Estate & Construction</a></li>' +
              '</ul>' +
            '</li>' +
            '<li class="nav__item"><a href="highlights.html" class="nav__link' + isActive('highlights') + '">Work Highlights</a></li>' +
            '<li class="nav__item nav__item--dropdown">' +
              '<a href="publications.html" class="nav__link nav__link--parent' + isActive('publications') + isActive('newsletter') + isActive('testimonials') + '">Insights</a>' +
              '<ul class="nav__dropdown">' +
                '<li><a href="publications.html">Publications</a></li>' +
                '<li><a href="newsletter.html">Newsletter</a></li>' +
                '<li><a href="testimonials.html">Client Testimonials</a></li>' +
              '</ul>' +
            '</li>' +
            '<li class="nav__item"><a href="contact.html" class="nav__link' + isActive('contact') + '">Contact</a></li>' +
            '<li class="nav__item nav__item--cta">' +
              '<a href="contact.html" class="btn btn--primary btn--sm">Book Appointment</a>' +
            '</li>' +
          '</ul>' +
        '</nav>' +
      '</header>' +
      '<div class="nav__overlay" id="navOverlay" aria-hidden="true"></div>'
    );
  }

  function footerHTML() {
    return (
      '<footer class="footer">' +
        '<div class="container">' +
          '<div class="footer__grid">' +
            '<div class="footer__brand">' +
              '<a href="index.html" class="nav__logo">' +
                '<img src="images/logo.png" alt="Armstrong Law Firm" class="nav__logo-img">' +
              '</a>' +
              '<p>Your trusted advisors in corporate, commercial, and dispute resolution law.</p>' +
            '</div>' +
            '<div class="footer__col">' +
              '<h4>Expertise</h4>' +
              '<ul>' +
                '<li><a href="corporate-commercial.html">Corporate & Commercial</a></li>' +
                '<li><a href="dispute-resolution.html">Dispute Resolution</a></li>' +
                '<li><a href="regulatory-compliance.html">Regulatory Compliance</a></li>' +
                '<li><a href="real-estate.html">Real Estate</a></li>' +
              '</ul>' +
            '</div>' +
            '<div class="footer__col">' +
              '<h4>Insights</h4>' +
              '<ul>' +
                '<li><a href="publications.html">Publications</a></li>' +
                '<li><a href="newsletter.html">Newsletter</a></li>' +
                '<li><a href="testimonials.html">Testimonials</a></li>' +
                '<li><a href="highlights.html">Work Highlights</a></li>' +
              '</ul>' +
            '</div>' +
            '<div class="footer__col">' +
              '<h4>Contact</h4>' +
              '<ul>' +
                '<li><a href="tel:+233301234567">+233 30 123 4567</a></li>' +
                '<li><a href="mailto:info@armstronglaw.com">info@armstronglaw.com</a></li>' +
                '<li>12 Independence Avenue, Ridge</li>' +
                '<li>Accra, Ghana</li>' +
              '</ul>' +
            '</div>' +
          '</div>' +
          '<div class="footer__bottom">' +
            '<p>&copy; 2026 Armstrong Law Firm. All Rights Reserved.</p>' +
            '<a href="disclaimer.html">Disclaimer Notice</a>' +
          '</div>' +
        '</div>' +
      '</footer>'
    );
  }

  var headerEl = document.getElementById('site-header');
  var footerEl = document.getElementById('site-footer');

  if (headerEl) headerEl.innerHTML = headerHTML();
  if (footerEl) footerEl.innerHTML = footerHTML();

  document.dispatchEvent(new Event('layoutReady'));
})();
