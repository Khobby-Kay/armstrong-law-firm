const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const config = JSON.parse(fs.readFileSync(path.join(root, 'site.config.json'), 'utf8'));
const today = new Date().toISOString().slice(0, 10);

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function absoluteUrl(routePath) {
  if (routePath === '/') return config.siteUrl + '/';
  return config.siteUrl + routePath;
}

function pageUrl(fileName) {
  const page = config.pages.find((entry) => entry.file === fileName);
  return absoluteUrl(page ? page.path : '/' + fileName);
}

function buildSocialMeta(fileName, title, description) {
  const pageImage = config.pageImages && config.pageImages[fileName];
  const imagePath = pageImage ? pageImage.image : config.defaultImage;
  const imageAlt = pageImage ? pageImage.imageAlt : config.defaultImageAlt;
  const imageUrl = absoluteUrl(imagePath);
  const url = pageUrl(fileName);

  return [
    '  <meta name="robots" content="index, follow, max-image-preview:large">',
    '  <meta name="author" content="' + escapeAttr(config.siteName) + '">',
    '  <meta name="theme-color" content="' + config.themeColor + '">',
    '  <link rel="alternate" hreflang="' + config.language + '" href="' + url + '">',
    '  <link rel="canonical" href="' + url + '">',
    '  <meta property="og:type" content="website">',
    '  <meta property="og:site_name" content="' + escapeAttr(config.siteName) + '">',
    '  <meta property="og:locale" content="' + config.locale + '">',
    '  <meta property="og:title" content="' + escapeAttr(title) + '">',
    '  <meta property="og:description" content="' + escapeAttr(description) + '">',
    '  <meta property="og:url" content="' + url + '">',
    '  <meta property="og:image" content="' + imageUrl + '">',
    '  <meta property="og:image:alt" content="' + escapeAttr(imageAlt) + '">',
    '  <meta name="twitter:card" content="summary_large_image">',
    '  <meta name="twitter:title" content="' + escapeAttr(title) + '">',
    '  <meta name="twitter:description" content="' + escapeAttr(description) + '">',
    '  <meta name="twitter:image" content="' + imageUrl + '">',
    '  <meta name="twitter:image:alt" content="' + escapeAttr(imageAlt) + '">'
  ].join('\n');
}

function organizationSchema() {
  return {
    '@type': 'LegalService',
    '@id': config.siteUrl + '/#organization',
    name: config.siteName,
    url: config.siteUrl + '/',
    logo: absoluteUrl(config.defaultImage),
    image: absoluteUrl(config.defaultImage),
    telephone: config.business.telephone,
    email: config.business.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: config.business.address.streetAddress,
      addressLocality: config.business.address.addressLocality,
      addressRegion: config.business.address.addressRegion,
      postalCode: config.business.address.postalCode || undefined,
      addressCountry: config.business.address.addressCountry
    },
    areaServed: config.business.areaServed,
    priceRange: config.business.priceRange
  };
}

function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': config.siteUrl + '/#website',
    url: config.siteUrl + '/',
    name: config.siteName,
    inLanguage: config.language,
    publisher: { '@id': config.siteUrl + '/#organization' }
  };
}

function buildPageSchema(pageConfig, title, description) {
  const url = absoluteUrl(pageConfig.path);
  const graph = [
    organizationSchema(),
    websiteSchema(),
    {
      '@type': 'WebPage',
      '@id': url + '#webpage',
      url: url,
      name: title,
      description: description,
      isPartOf: { '@id': config.siteUrl + '/#website' },
      about: { '@id': config.siteUrl + '/#organization' },
      inLanguage: config.language
    }
  ];

  if (pageConfig.dataPage === 'contact') {
    graph.push({
      '@type': 'ContactPage',
      '@id': url + '#contactpage',
      url: url,
      name: title,
      description: description,
      isPartOf: { '@id': config.siteUrl + '/#website' }
    });
  }

  if (pageConfig.breadcrumb && pageConfig.breadcrumb.length > 1) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': url + '#breadcrumb',
      itemListElement: pageConfig.breadcrumb.map(function (crumb, index) {
        return {
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: absoluteUrl(crumb.path)
        };
      })
    });
  }

  if (pageConfig.dataPage === 'home') {
    graph.push({
      '@type': 'ProfessionalService',
      '@id': url + '#service',
      name: config.siteName,
      url: config.siteUrl + '/',
      image: absoluteUrl((config.pageImages['index.html'] || {}).image || config.defaultImage),
      description: description,
      provider: { '@id': config.siteUrl + '/#organization' }
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph
  };
}

function buildSchemaScript(pageConfig, title, description) {
  const schema = buildPageSchema(pageConfig, title, description);
  return '  <script type="application/ld+json">' + JSON.stringify(schema, null, 2).replace(/\n/g, '\n  ') + '</script>';
}

function stripExistingSeoBlocks(content) {
  return content
    .replace(/\s*<meta name="robots"[^>]*>\n?/g, '\n')
    .replace(/\s*<meta name="author"[^>]*>\n?/g, '\n')
    .replace(/\s*<meta name="theme-color"[^>]*>\n?/g, '\n')
    .replace(/\s*<link rel="alternate" hreflang="[^"]+"[^>]*>\n?/g, '\n')
    .replace(/\s*<link rel="canonical"[^>]*>\n?/g, '\n')
    .replace(/\s*<meta property="og:[^"]+"[^>]*>\n?/g, '\n')
    .replace(/\s*<meta name="twitter:[^"]+"[^>]*>\n?/g, '\n')
    .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/g, '\n');
}

function writeSitemap() {
  const urls = config.pages
    .map(function (page) {
      return [
        '  <url>',
        '    <loc>' + absoluteUrl(page.path) + '</loc>',
        '    <lastmod>' + today + '</lastmod>',
        '    <changefreq>' + page.changefreq + '</changefreq>',
        '    <priority>' + page.priority.toFixed(1) + '</priority>',
        '  </url>'
      ].join('\n');
    })
    .join('\n');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    ''
  ].join('\n');

  fs.writeFileSync(path.join(root, 'sitemap.xml'), xml, 'utf8');
}

function writeRobots() {
  const robots = [
    'User-agent: *',
    'Allow: /',
    '',
    'Sitemap: ' + config.siteUrl + '/sitemap.xml',
    ''
  ].join('\n');

  fs.writeFileSync(path.join(root, 'robots.txt'), robots, 'utf8');
}

function updateHtmlPages() {
  config.pages.forEach(function (pageConfig) {
    const filePath = path.join(root, pageConfig.file);
    if (!fs.existsSync(filePath)) {
      console.warn('Missing page file: ' + pageConfig.file);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const titleMatch = content.match(/<title>([^<]+)<\/title>/);
    const descriptionMatch = content.match(/<meta name="description" content="([^"]*)">/);

    if (!titleMatch || !descriptionMatch) {
      console.warn('Skipping ' + pageConfig.file + ' — missing title or description');
      return;
    }

    content = stripExistingSeoBlocks(content);

    const socialMeta = buildSocialMeta(pageConfig.file, titleMatch[1], descriptionMatch[1]);
    const schemaScript = buildSchemaScript(pageConfig, titleMatch[1], descriptionMatch[1]);
    const marker = '<link rel="apple-touch-icon" href="images/logo.png">';

    if (!content.includes(marker)) {
      console.warn('Skipping ' + pageConfig.file + ' — favicon marker not found');
      return;
    }

    content = content.replace(marker, marker + '\n' + socialMeta + '\n' + schemaScript);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated SEO for ' + pageConfig.file);
  });
}

writeSitemap();
writeRobots();
updateHtmlPages();
console.log('Generated sitemap.xml and robots.txt');
