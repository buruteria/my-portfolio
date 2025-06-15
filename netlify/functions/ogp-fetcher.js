const cheerio = require('cheerio');

const fetchHTML = async (url) => {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    if (!response.ok) {
      // console.log(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
      return null;
    }
    return await response.text();
  } catch (error) {
    // console.error(`Error fetching URL: ${url}`, error);
    return null;
  }
};

const getRelativeUrl = (baseUrl, relativePath) => {
    if (!relativePath) return null;
    try {
        const url = new URL(relativePath, baseUrl);
        return url.href;
    } catch (e) {
        return null;
    }
};

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let url;
  try {
    const body = JSON.parse(event.body);
    url = body.url;
    if (!url) {
      return { statusCode: 400, body: 'URL is required' };
    }
  } catch (e) {
    return { statusCode: 400, body: 'Invalid JSON body' };
  }

  const html = await fetchHTML(url);
  if (!html) {
    return { statusCode: 500, body: `Failed to fetch HTML from ${url}` };
  }

  const $ = cheerio.load(html);

  const getMetaTag = (name) => $(`meta[property="og:${name}"]`).attr('content') || $(`meta[name="${name}"]`).attr('content') || null;

  const baseUrl = new URL(url).origin;
  let favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href');
  
  if (favicon) {
      favicon = getRelativeUrl(url, favicon);
  } else {
      favicon = `${baseUrl}/favicon.ico`;
  }
  
  const ogpData = {
    title: getMetaTag('title') || $('title').text() || 'No title found',
    description: getMetaTag('description') || 'No description found',
    image: getMetaTag('image'),
    siteName: getMetaTag('site_name') || new URL(url).hostname,
    favicon: favicon,
    url: url
  };

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ogpData),
  };
}; 