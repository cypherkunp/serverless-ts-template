import log from 'lambda-log';

log.options.dynamicMeta = function (message) {
  return {
    timestamp: new Date().toISOString(),
  };
};

if (process.env.DEBUG_LAMBDA === 'true') {
  log.options.debug = true;
}

export default log;
