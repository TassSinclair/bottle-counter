'use strict';

const config = {
  buttonPin: 'GPIO4',
  isDev: isDev()
};

function isDev() {
  return !!process.argv.find(item => item === 'dev');
}

module.exports = config;