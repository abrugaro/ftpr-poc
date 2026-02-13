# FTPR POC - First Time Pass Rate Proof of Concept

Thissss is a demonstration project for testing CI/CD metrics, specifically designed to help track First Time Pass Rate (FTPR) in Grafana dashboards.

## Project Overview

This project contains:
- A simple calculator implementation in Node.js
- Jest test suite
- GitHub Actions CI pipeline
- **Controllable CI pass/fail mechanism**

## Controlling CI Behavior

The key feature of this project is the ability to control whether CI passes or fails on demand. This is useful for testing Grafana dashboards that track PR merge success rates.

### How It Works

The project includes a special test file (`__tests__/ci-control.test.js`) that reads a `.ci-control` file to determine if it should pass or fail.

### Making CI Pass

1. Edit the `.ci-control` file and set its content to `pass`:
   ```bash
   echo "pass" > .ci-control
   ```

2. Commit and push:
   ```bash
   git add .ci-control
   git commit -m "CI should pass"
   git push
   ```

### Making CI Fail

1. Edit the `.ci-control` file and set its content to `fail`:
   ```bash
   echo "fail" > .ci-control
   ```

2. Commit and push:
   ```bash
   git add .ci-control
   git commit -m "CI should fail"
   git push
   ```

### Default Behavior

If the `.ci-control` file doesn't exist, CI will **pass** by default.

## Installation

```bash
npm install
```

## Running Tests Locally

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

## CI Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on:
- Push to `main`, `develop`, or `feature/**` branches
- Pull requests to `main` or `develop`

The pipeline:
1. Runs tests on Node.js 18.x and 20.x
2. Generates coverage reports
3. Uploads coverage artifacts

## Use Case: Grafana Metrics

This project is designed to help you test Grafana dashboards that track:
- **First Time Pass Rate (FTPR)**: Percentage of PRs that merge with CI passing on the first attempt
- **CI Success Rate**: Overall CI pass/fail ratio
- **Build Stability**: Tracking CI reliability over time

### Example Workflow for Testing

1. Create a PR with `.ci-control` set to `pass` → Merge (counts as first-time pass)
2. Create a PR with `.ci-control` set to `fail` → Fix → Change to `pass` → Merge (counts as retry)
3. Track these metrics in Grafana using GitHub API or webhook data

## Project Structure

```
ftpr-poc/
├── .github/
│   └── workflows/
│       └── ci.yml           # GitHub Actions CI configuration
├── __tests__/
│   ├── calculator.test.js   # Regular unit tests
│   └── ci-control.test.js   # CI control mechanism
├── src/
│   ├── calculator.js        # Calculator implementation
│   └── index.js             # Main entry point
├── .ci-control              # CI pass/fail control file
├── .gitignore
├── jest.config.js           # Jest configuration
├── package.json
└── README.md
```

## Example: Creating Test Data for Grafana

Here's a suggested workflow to generate test data:

1. **Successful first-time merge**:
   ```bash
   git checkout -b feature/successful-feature
   echo "pass" > .ci-control
   git add .
   git commit -m "Add successful feature"
   git push origin feature/successful-feature
   # Create PR and merge (CI will pass on first attempt)
   ```

2. **Failed then successful merge**:
   ```bash
   git checkout -b feature/failing-feature
   echo "fail" > .ci-control
   git add .
   git commit -m "Add feature (will fail CI)"
   git push origin feature/failing-feature
   # Create PR (CI will fail)

   echo "pass" > .ci-control
   git add .
   git commit -m "Fix CI"
   git push origin feature/failing-feature
   # CI will now pass, merge PR
   ```

## License

MIT
