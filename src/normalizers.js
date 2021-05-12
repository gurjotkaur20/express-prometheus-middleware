const UrlValueParser = require('url-value-parser');
const url = require('url');

// ATTENTION! urlValueParser is a singleton!
let urlValueParser;

function normalizePath(req, opts) {
  // originalUrl is taken, because url and path can be changed
  // by middlewares such as 'router'. Note: this function is called onFinish
  /// i.e. always in the tail of the middleware chain
  let path = url.parse(req.originalUrl || req.url).pathname;

  const normalizePath = opts && opts.normalizePath;
  if (Array.isArray(normalizePath)) {
    for (const tuple of normalizePath) {
      if (!Array.isArray(tuple) || tuple.length !== 2) {
        throw new Error('Bad tuple provided in normalizePath option, expected: [regex, replacement]');
      }
      const regex = typeof tuple[0] === 'string' ? RegExp(tuple[0]) : tuple[0];
      if (regex.test(path)) {
        path = path.replace(regex, tuple[1]);
        return path;
      }
      
    }
  }

  if (!urlValueParser) {
    urlValueParser = new UrlValueParser(opts && opts.urlValueParser);
  }
  return urlValueParser.replacePathValues(path);
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
