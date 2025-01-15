module.exports = {
    client: require('ganache-cli'),
    skipFiles: ['Migrations.sol'],
    configureYulOptimizer: true, 
    istanbulReporter: ['html', 'lcov'],
  }