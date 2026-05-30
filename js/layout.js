(function () {
  'use strict';

  var CONTACT = {
    phoneDisplay: '+233 30 123 4567',
    phoneHref: 'tel:+233301234567',
    email: 'info@armstronglaw.com'
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
                '<li><a href="corporate-commercial.html">Corporate &amp; Commercial</a></li>' +
                '<li><a href="dispute-resolution.html">Dispute Resolution</a></li>' +
                '<li><a href="regulatory-compliance.html">Regulatory Compliance</a></li>' +
                '<li><a href="real-estate.html">Real Estate &amp; Construction</a></li>' +
                '<li><a href="employment-immigration.html">Employment &amp; Immigration</a></li>' +
                '<li><a href="technology-ip.html">Technology &amp; IP</a></li>' +
                '<li><a href="energy-resources.html">Energy &amp; Natural Resources</a></li>' +
                '<li><a href="family-trust-probate.html">Family, Trust &amp; Probate</a></li>' +
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
              '<a href="contact.html" class="btn btn--primary btn--sm">Book Consultation</a>' +
            '</li>' +
          '</ul>' +
        '</nav>' +
      '</header>' +
      '<div class="nav__overlay" id="navOverlay" aria-hidden="true"></div>'
    );
  }

  function footerHTML() {
    var year = new Date().getFullYear();
    return (
      '<footer class="footer footer--clean">' +
        '<div class="container">' +
          '<div class="footer__clean-top">' +
            '<div class="footer__brand footer__brand--clean">' +
              '<a href="index.html" class="nav__logo">' +
                '<img src="images/logo.png" alt="Armstrong Law Firm" class="nav__logo-img">' +
              '</a>' +
              '<p>Trusted advisors in corporate, commercial, and dispute resolution law.</p>' +
            '</div>' +
            '<nav class="footer__clean-links" aria-label="Footer">' +
              '<a href="about.html">About</a>' +
              '<a href="expertise.html">Expertise</a>' +
              '<a href="publications.html">Insights</a>' +
              '<a href="contact.html">Contact</a>' +
            '</nav>' +
            '<div class="footer__clean-contact">' +
              '<a href="' + CONTACT.phoneHref + '">' + CONTACT.phoneDisplay + '</a>' +
              '<a href="mailto:' + CONTACT.email + '">' + CONTACT.email + '</a>' +
            '</div>' +
          '</div>' +
          '<div class="footer__bottom">' +
            '<p>&copy; ' + year + ' Armstrong Law Firm. All Rights Reserved.</p>' +
            '<nav class="footer__legal" aria-label="Legal">' +
              '<a href="disclaimer.html">Disclaimer</a>' +
            '</nav>' +
          '</div>' +
        '</div>' +
      '</footer>'
    );
  }

  var headerEl = document.getElementById('site-header');
  var footerEl = document.getElementById('site-footer');

  if (headerEl) headerEl.innerHTML = headerHTML();
  if (footerEl) footerEl.innerHTML = footerHTML();

  if (!document.querySelector('.skip-link')) {
    var skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = '#main';
    skip.textContent = 'Skip to content';
    document.body.insertBefore(skip, document.body.firstChild);
  }

  document.dispatchEvent(new Event('layoutReady'));
})();
