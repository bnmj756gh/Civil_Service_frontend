// Simple CodeceptJS configuration

exports.config = {
  name: 'functional',
  output: './functional-output/functional/reports',
  helpers: {
    Playwright: {
      url: 'https://localhost:3100',
      show: process.env.TEST_HEADLESS === 'false',
      browser: 'chromium',
      waitForTimeout: 10000,
      waitForAction: 1000,
      waitForNavigation: 'networkidle0',
      ignoreHTTPSErrors: true,
    }
  },
  tests: './*_test.{js,ts}',
  gherkin: {
    features: './src/test/functional/features/**/*.feature',
    steps: [
      './src/test/steps/common.ts',
      './src/test/steps/task-steps.ts',
      './src/test/steps/error-steps.ts'
    ]
  },
  plugins: {
    allure: {
      enabled: true,
      require: '@codeceptjs/allure-legacy',
    },
    pauseOnFail: {
      enabled: process.env.TEST_HEADLESS === 'false',
    },
    retryFailedStep: {
      enabled: true,
    },
    tryTo: {
      enabled: true,
    },
    screenshotOnFail: {
      enabled: true,
      fullPageScreenshots: true,
    },
  },
};