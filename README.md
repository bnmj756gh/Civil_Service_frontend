# Civil Service Frontend

A Node.js Express web application for task management built with TypeScript, Nunjucks templating, and the GOV.UK Design System.

## Prerequisites

- Node.js 18+
- Yarn package manager
- Civil Service Backend API running on port 4000

## Setup

1. **Install dependencies:**
   ```bash\powershell
   yarn install
   ```

2. **Playwright Browser Setup:**
   Install Playwright browser for functional testing:

   ```bash\powershell
   npx playwright install chromium
   ```

3. **Environment Setup:**
   The application expects the backend API to be running at `http://localhost:4000`. Make sure the Civil Service Backend is started before running the frontend.

## Running the Application

### Development Mode
```bash\powershell
yarn start:dev
```
The application will start on `https://localhost:3100` with hot reloading enabled.

### Production Mode
```bash\powershell
yarn build
yarn start
```

## Testing

### Unit Tests
Run Jest unit tests:
```bash\powershell
yarn test:unit
```

### Integration Tests
Run integration tests:
```bash\powershell
yarn test:integration
```

### Functional Tests
Run end-to-end tests with CodeceptJS and Playwright:
```bash\powershell
yarn test:functional
```

**Prerequisites for functional tests:**
- Application must be running (`yarn start:dev`)
- Backend API must be running
- Tests run against `https://localhost:3100`

### Run All Tests
```bash\powershell
yarn test:unit && yarn test:integration && yarn test:functional
```

## Functional Test Configuration

### CodeceptJS Configuration
- **Browser**: Chromium (via Playwright)
- **Features**: Located in `src/test/functional/features/`
- **Step Definitions**: Located in `src/test/steps/`
- **Screenshots**: Saved to `functional-output/functional/reports/` on test failures


## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Templating**: Nunjucks
- **Styling**: GOV.UK Design System
- **Testing**: Jest (unit, integration), CodeceptJS with Playwright (functional)
