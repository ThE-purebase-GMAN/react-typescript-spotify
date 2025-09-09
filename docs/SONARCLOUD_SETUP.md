# SonarCloud Setup Instructions

This project uses SonarCloud for code quality analysis. To enable SonarCloud analysis in your GitHub Actions workflow, you need to set up the SONAR_TOKEN secret.

## Setup Steps:

1. **Go to SonarCloud**: Visit https://sonarcloud.io
2. **Login**: Use your GitHub account to login
3. **Import Repository**:
   - Click on the "+" button in the top right
   - Select "Analyze new project"
   - Choose this repository from your GitHub organization
4. **Get Organization and Project Key**:
   - Note your organization key (should be `frank-mendez`)
   - Note your project key (should be `frank-mendez_react-typescript-spotify`)
5. **Generate Token**:
   - Go to your SonarCloud account settings
   - Navigate to Security > Generate Token
   - Create a token with appropriate permissions
6. **Add Secret to GitHub**:
   - Go to your GitHub repository settings
   - Navigate to Secrets and variables > Actions
   - Add a new secret named `SONAR_TOKEN`
   - Paste your SonarCloud token as the value

## Configuration Files:

- `sonar-project.properties`: Contains the SonarCloud project configuration
- `.github/workflows/pull_request.yml`: Contains the GitHub Actions workflow with SonarCloud analysis
- `vitest.config.ts`: Configured to generate LCOV coverage reports for SonarCloud

## Workflow Behavior:

- SonarCloud analysis will only run on pull requests from the main repository (not forks)
- The analysis includes code coverage from your test suite
- Results will be posted as comments on your pull requests
- The workflow will be skipped if the SONAR_TOKEN secret is not configured

## Troubleshooting:

- Ensure the project key and organization in `sonar-project.properties` match your SonarCloud setup
- Make sure the SONAR_TOKEN secret has the correct permissions
- Check that your SonarCloud project is properly configured to analyze TypeScript/React code
