const url = require('url');
const UrlValueParser = require('url-value-parser');

/**
 * Normalizes urls paths.
 *
 * This function replaces route params like ids, with a placeholder, so we can
 * set the metrics label, correctly. E.g., both routes
 *
 * - /api/v1/user/1
 * - /api/v1/user/2
 *
 * represents the same logical route, and we want to group them together,
 * hence the need for the normalization.
 */
function normalizePath(req, options) {
  // ATTENTION! urlValueParser is a singleton!
  let urlValueParser;
  // originalUrl is taken, because url and path can be changed
  // by middlewares such as 'router'. Note: this function is called onFinish
  /// i.e. always in the tail of the middleware chain
  let path = url.parse(req.originalUrl || req.url).pathname;

  const normalizePath = options && options.normalizePath;
  if (Array.isArray(normalizePath)) {
    for (const tuple of normalizePath) {
      if (!Array.isArray(tuple) || tuple.length !== 2) {
        throw new Error('Bad tuple provided in normalizePath option, expected: [regex, replacement]');
      }
      const regex = typeof tuple[0] === 'string' ? RegExp(tuple[0]) : tuple[0];
      if(regex.test(path)) {
        path = path.replace(regex, tuple[1]);
        break;
      }
    }
  }
  /*
  if (!urlValueParser) {
    urlValueParser = new UrlValueParser(options && options.urlValueParser);
  }
  return urlValueParser.replacePathValues(path);
  */
 return path;
};

/**
 * Normalizes http status codes.
 *
 * Returns strings in the format (2|3|4|5)XX.
 *
 * @param {!number} status - status code of the requests
 * @returns {string} the normalized status code.
 */
function normalizeStatusCode(status) {
  if (status >= 200 && status < 300) {
    return '2XX';
  }

  if (status >= 300 && status < 400) {
    return '3XX';
  }

  if (status >= 400 && status < 500) {
    return '4XX';
  }

  return '5XX';
}

module.exports = {
  normalizePath,
  normalizeStatusCode,
};
