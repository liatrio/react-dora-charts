# CHANGELOG

## v1.1.1 (2024-08-31)

### Chore

* chore: add Playwright tests and configurations (#9)

* feat: add Playwright tests and configurations

- Updated &#39;.gitignore&#39; to include Playwright-related files
- Added Playwright test scripts to &#39;package.json&#39;
- Created Playwright helper functions in &#39;helpers/constants.js&#39; and &#39;helpers/utils.js&#39;
- Configured Playwright in &#39;playwright.config.js&#39;
- Added a Playwright test for the Board component in &#39;tests/board_component.test.js&#39;

* feat: add utility functions and enhance board component tests

- Added &#39;selectDataSet&#39; function to select a data set in Storybook preview.
- Added &#39;setCheckBox&#39; function to set the value of a checkbox in Storybook preview.
- Enhanced board component tests to include multiple data sets and checkboxes.
- Configured tests to run in parallel mode.
- Simplified test setup with &#39;beforeEach&#39; hook.

* feat: add message box functionality

- Implement &#39;setMessageBox&#39; function in &#39;utils.js&#39; to fill the message input
- Add test case for message functionality in &#39;board_component.test.js&#39;
- Include snapshot for message test case

* feat: loading test parameters from a yaml config

- Added &#39;js-yaml&#39; dependency to &#39;package.json&#39; and &#39;package-lock.json&#39;.
- Created &#39;test_parameters.yaml&#39; to store test parameters for Playwright tests.
- Updated &#39;constants.js&#39; to load test parameters from &#39;test_parameters.yaml&#39;.
- Refactored &#39;board_component.test.js&#39; to use dynamic test parameters from &#39;constants.js&#39;.

* chore: rename tests

* feat: add tests for all components

- Added &#39;component_name&#39; to test parameters in &#39;test_parameters.yaml&#39;
- Included &#39;has_message_field&#39; and &#39;checkbox_labels&#39; for each component
- Updated &#39;components.test.js&#39; to use &#39;component_name&#39; in test descriptions

* test: update checkbox label and snapshots

- Update &#39;NO_CHECKBOX&#39; label to &#39;NO_CHECKBOX_CHANGE&#39; in test parameters.
- Remove redundant &#39;No Options&#39; test case.
- Add new snapshot files for various data sets and checkbox combinations.
- Ensure all test cases reflect the updated checkbox label.

* chore: update playwright config with settings from &#39;init playwright@latest&#39;

* ci: add Playwright tests to GitHub Actions workflow

- Added a new job &#39;test-playwright&#39; to the GitHub Actions workflow in &#39;code_validation.yml&#39;.
- Configured the job to run on &#39;ubuntu-latest&#39; with a timeout of 10 minutes.
- Included steps to checkout the repository, set up Node.js, install dependencies, run Playwright tests, and upload the Playwright report as an artifact.
- Updated &#39;package.json&#39; to rename the Playwright test script from &#39;test:playwright:ci&#39; to &#39;test:playwright:ui&#39;.

* ci: update Playwright configuration and GitHub action

- Added a name for the Playwright Tests job in the GitHub Actions workflow.
- Set a timeout of 10 minutes for the Playwright Tests job.
- Added steps to install Playwright browsers and run Playwright tests in the GitHub Actions workflow.
- Configured the Playwright web server to use &#39;npm run storybook-ci&#39; command and &#39;http://127.0.0.1:6006&#39; URL.

* chore: update CI configuration and Playwright reporter

- Increase timeout for Playwright tests from 10 to 30 minutes in GitHub Actions workflow
- Update Playwright reporter configuration to use &#39;github&#39; reporter in CI and &#39;list&#39; reporter locally

* chore: add Docker support for Playwright tests

- Add &#39;.dockerignore&#39; file to exclude unnecessary files from Docker builds
- Update &#39;.gitignore&#39; to include Playwright test results
- Modify GitHub Actions workflow to use Node.js 18.20.4 container
- Simplify Playwright test scripts in &#39;package.json&#39;
- Add Dockerfile for Playwright in &#39;playwright/playwright.dockerfile&#39;

* chore: update Playwright scripts and Dockerfile

- Add &#39;playwright:show-report&#39; and &#39;playwright:update-snapshots&#39; scripts
- Modify &#39;playwright:docker:run&#39; scripts to include volume mounting and remove container after run
- Change local reporter to &#39;html&#39; in Playwright config
- Update Dockerfile to install Playwright browsers with dependencies
- Set user to &#39;node&#39; and adjust file ownership in Dockerfile
- Prevent browser from opening test report in Dockerfile

* fix: remove debug helper

* refactor: optimize Playwright Dockerfile

- Consolidated Playwright installation into a multi-stage build
- Switched to using node:18.20.4-slim for a smaller base image
- Simplified RUN commands and removed redundant installations
- Ensured proper user permissions and working directory setup

* test: update image snapshots to be based on running in docker

* test: add tags to component tests

- Added &#39;test.describe&#39; block for better test organization
- Introduced &#39;testTagDetails&#39; to include tags for components, datasets, and checkboxes
- Updated test cases to use &#39;testTagDetails&#39; for improved tagging and filtering

* fix: add smoketest option for running a small set of tests

* chore: update Playwright configuration

- Set retries to 0 regardless of CI environment
- Increase workers to 2 on CI
- Change reporter to &#39;html&#39; for all environments

* refactor: test only the Storybook preview instead of entire page

- Added &#39;verifyStorybookPreview&#39; function to check visibility and take a screenshot of the Storybook preview.
- Updated &#39;setMessageBox&#39; function documentation.
- Replaced direct screenshot assertions with &#39;verifyStorybookPreview&#39; in &#39;components.test.js&#39;.

* test: update snapshots to reflect change in visual diff area

* chore: simplify playwright docker commands

* refactor: streamline Playwright config and scripts

- Simplified Playwright test script commands in package.json
- Moved Playwright config file to root directory
- Updated import paths in Playwright config file

* ci: run tests in official Playwright container

This saves us having to run the browser installs for every CI job

* docs: update README with instructions for playwright tests

* test: update snapshots to handle updates from theme feature add ([`76bb42a`](https://github.com/liatrio/react-dora-charts/commit/76bb42ad96a4d647f3d2d78534f5717f4b32d298))

### Fix

* fix: Theme enum export is not correct (#15)

* fix: streamline this enum to just be a string instead of number

* fix: make sure we export the enum correctly

* chore: adjust some naming

* chore: run prettier

* chore: update version in readme ([`4016ea9`](https://github.com/liatrio/react-dora-charts/commit/4016ea9d802df3843c925bcaf4f3a760ac6d1d40))

## v1.1.0 (2024-08-30)

### Chore

* chore: initial tests passing and added to code validation (#8) ([`6f0a3c3`](https://github.com/liatrio/react-dora-charts/commit/6f0a3c3662b04c796615bdb23fdc7c4f26077031))

### Ci

* ci: add code scanning with codeql and badge (#7) ([`fb3eff7`](https://github.com/liatrio/react-dora-charts/commit/fb3eff714fd13c53733b360099232769dc1d2fcf))

### Feature

* feat: theme support (#11)

* fix: add global.css for themeing, update board and icons to use css modules

* fix: update board tooltip css

* fix: update loader css

* fix: update tooltip css

* fix: update chart css

* fix: update graph to use proper tick color and apply data attribute for theme

* fix: remove bad import

* fix: fix issues with styling and theming

* chore: update readme

* fix: prettier

---------

Co-authored-by: root &lt;root@Tegia.localdomain&gt; ([`f1cacce`](https://github.com/liatrio/react-dora-charts/commit/f1cacce6327dd2a5847a9b38c10ae7b8ac5bb411))

## v1.0.0 (2024-08-28)

### Breaking

* feat!: Initial Checkin ([`e4d6fae`](https://github.com/liatrio/react-dora-charts/commit/e4d6fae52f3f9a8b03a6f1d8e851311c1b97a1a7))

### Unknown

* Initial commit ([`852dd54`](https://github.com/liatrio/react-dora-charts/commit/852dd5464456f3765d4aa48c01fdfde8f4e97825))
