const Prometheus = require('prom-client');

/**
 * @param suffix - metrics name suffix
 * request counter
 */
function requestCountGenerator(labelNames, suffix = '') {
  return new Prometheus.Counter({
    name: `http_requests_total${suffix}`,
    help: 'Counter for total requests received',
    labelNames,
  });
}

/**
 * @param {!Array} buckets - array of numbers, representing the buckets for
 * @param suffix - metrics name suffix
 * request duration
 */
function requestDurationGenerator(labelNames, buckets, suffix = '') {
  return new Prometheus.Histogram({
    name: `http_request_duration_seconds${suffix}`,
    help: 'Duration of HTTP requests in seconds',
    labelNames,
    buckets,
  });
}

/**
 * @param {!Array} buckets - array of numbers, representing the buckets for
 * @param suffix - metrics name suffix
 * request length
 */
function requestLengthGenerator(labelNames, buckets, suffix = '') {
  return new Prometheus.Histogram({
    name: `http_request_length_bytes${suffix}`,
    help: 'Content-Length of HTTP request',
    labelNames,
    buckets,
  });
}

/**
 * @param {!Array} buckets - array of numbers, representing the buckets for
 * @param suffix - metrics name suffix
 * response length
 */
function responseLengthGenerator(labelNames, buckets, suffix = '') {
  return new Prometheus.Histogram({
    name: `http_response_length_bytes${suffix}`,
    help: 'Content-Length of HTTP response',
    labelNames,
    buckets,
  });
}

module.exports = {
  requestCountGenerator,
  requestDurationGenerator,
  requestLengthGenerator,
  responseLengthGenerator,
};
