const config = {
  requireModule: ['ts-node/register'],
  require: [
    'tests/bdd/support/**/*.ts',
    'tests/bdd/steps/**/*.ts'
  ],
  format: [
    'progress-bar',
    'html:test-results/cucumber-report.html',
    'json:test-results/cucumber-report.json'
  ],
  formatOptions: {
    snippetInterface: 'async-await'
  }
};

export default config;