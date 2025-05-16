
# Package.json Scripts Documentation

This document outlines the available npm scripts in the project, explaining their purpose and providing usage examples.

## Available Scripts

### Development Scripts

#### `dev`

**Purpose**: Starts the development server with hot-reloading enabled.

**Usage**:
```bash
npm run dev
```

**Example output**:
```
> infiworld-crypto-hub@0.1.0 dev
> vite

  VITE v5.0.12  ready in 234 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: http://192.168.1.5:8080/
```

#### `build`

**Purpose**: Creates a production-ready build of the application.

**Usage**:
```bash
npm run build
```

**Example output**:
```
> infiworld-crypto-hub@0.1.0 build
> vite build

vite v5.0.12 building for production...
✓ 1021 modules transformed.
dist/index.html                    4.62 kB │ gzip: 1.89 kB
dist/assets/index-395b9376.css   157.82 kB │ gzip: 21.12 kB
dist/assets/index-c7e05d10.js    301.54 kB │ gzip: 94.58 kB
✓ built in 8.36s
```

#### `preview`

**Purpose**: Serves the production build locally for preview.

**Usage**:
```bash
npm run build
npm run preview
```

**Example output**:
```
> infiworld-crypto-hub@0.1.0 preview
> vite preview

  ➜  Local:   http://localhost:4173/
  ➜  Network: http://192.168.1.5:4173/
```

### Testing Scripts

#### `test`

**Purpose**: Runs all Jest tests in the project.

**Usage**:
```bash
npm test
```

**Example output**:
```
> infiworld-crypto-hub@0.1.0 test
> jest

 PASS  src/hooks/__tests__/usePaymentData.test.ts
 PASS  src/utils/__tests__/payment-utils.test.ts

Test Suites: 2 passed, 2 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        3.42 s
Ran all test suites.
```

#### `test:watch`

**Purpose**: Runs Jest in watch mode, re-running tests when files change.

**Usage**:
```bash
npm run test:watch
```

**Example output**:
```
> infiworld-crypto-hub@0.1.0 test:watch
> jest --watch

Watch Usage
 › Press a to run all tests.
 › Press f to run only failed tests.
 › Press q to quit watch mode.
 › Press p to filter by a filename regex pattern.
 › Press t to filter by a test name regex pattern.
 › Press Enter to trigger a test run.
```

### Linting and Formatting Scripts

#### `lint`

**Purpose**: Runs ESLint to identify code quality issues.

**Usage**:
```bash
npm run lint
```

**Example output**:
```
> infiworld-crypto-hub@0.1.0 lint
> eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0

✨ No ESLint warnings or errors
```

#### `format`

**Purpose**: Formats code using Prettier according to project standards.

**Usage**:
```bash
npm run format
```

**Example output**:
```
> infiworld-crypto-hub@0.1.0 format
> prettier --write "src/**/*.{js,jsx,ts,tsx,json,css}"

src/App.tsx 42ms
src/main.tsx 10ms
...
```

### Deployment Scripts

#### `deploy`

**Purpose**: Builds the application and deploys it using GitHub Pages.

**Usage**:
```bash
npm run deploy
```

**Example output**:
```
> infiworld-crypto-hub@0.1.0 deploy
> gh-pages -d dist

Published
```

### Supabase Scripts

#### `supabase:start`

**Purpose**: Starts the local Supabase development environment.

**Usage**:
```bash
npm run supabase:start
```

**Example output**:
```
> infiworld-crypto-hub@0.1.0 supabase:start
> supabase start

Started supabase local development setup.

         API URL: http://localhost:54321
     GraphQL URL: http://localhost:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
```

#### `supabase:push`

**Purpose**: Pushes local schema changes to the remote Supabase project.

**Usage**:
```bash
npm run supabase:push
```

**Example output**:
```
> infiworld-crypto-hub@0.1.0 supabase:push
> supabase db push

Supabase schema changes have been pushed to the remote project.
```

## Combining Scripts

Some tasks may require running multiple scripts in sequence. Here are some common combinations:

### Full Development Workflow

```bash
# Start local Supabase
npm run supabase:start

# In another terminal, start the dev server
npm run dev
```

### Production Deployment Workflow

```bash
# Run tests
npm test

# If tests pass, build and deploy
npm run build
npm run deploy
```

### Code Quality Check Before Commit

```bash
# Format code
npm run format

# Run linter
npm run lint

# Run tests
npm test
```

## Environment-specific Scripts

Different environments may require specific configurations. Use the following pattern:

```bash
# Development environment
npm run dev

# Production build
npm run build

# Staging deployment
NODE_ENV=staging npm run deploy
```

## Custom Script Shortcuts

You can create your own npm script shortcuts by adding them to the `package.json` file. For example:

```json
"scripts": {
  "start:all": "concurrently \"npm run supabase:start\" \"npm run dev\""
}
```

Then run with:

```bash
npm run start:all
```

This will start both the Supabase local environment and the development server simultaneously.
