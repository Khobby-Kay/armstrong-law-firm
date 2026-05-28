const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const config = JSON.parse(fs.readFileSync(path.join(root, 'site.config.json'), 'utf8'));

function escapeAttr(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function pageUrl(fileName) {
  if (fileName === 'index.html') {
    return config.siteUrl + '/';
  }
  return config.siteUrl + '/' + fileName;
}

function buildSocialMeta(fileName, title, description) {
  const pageImage = config.pageImages && config.pageImages[fileName];
  const imagePath = pageImage ? pageImage.image : config.defaultImage;
  const imageAlt = pageImage ? pageImage.imageAlt : config.defaultImageAlt;
  const imageUrl = config.siteUrl + imagePath;
  const url = pageUrl(fileName);

  return [
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

function stripExistingSocialMeta(content) {
  return content
    .replace(/\s*<link rel="canonical"[^>]*>\n?/g, '\n')
    .replace(/\s*<meta property="og:[^"]+"[^>]*>\n?/g, '\n')
    .replace(/\s*<meta name="twitter:[^"]+"[^>]*>\n?/g, '\n');
}

fs.readdirSync(root)
  .filter((file) => file.endsWith('.html'))
  .forEach((fileName) => {
    const filePath = path.join(root, fileName);
    let content = fs.readFileSync(filePath, 'utf8');

    const titleMatch = content.match(/<title>([^<]+)<\/title>/);
    const descriptionMatch = content.match(/<meta name="description" content="([^"]*)">/);

    if (!titleMatch || !descriptionMatch) {
      console.warn('Skipping ' + fileName + ' — missing title or description');
      return;
    }

    content = stripExistingSocialMeta(content);

    const socialMeta = buildSocialMeta(fileName, titleMatch[1], descriptionMatch[1]);
    const marker = '<link rel="apple-touch-icon" href="images/logo.png">';

    if (!content.includes(marker)) {
      console.warn('Skipping ' + fileName + ' — favicon marker not found');
      return;
    }

    content = content.replace(marker, marker + '\n' + socialMeta);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + fileName);
  });
