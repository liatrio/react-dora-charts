# React DORA Charts

[![CodeQL](https://github.com/liatrio/react-dora-charts/actions/workflows/codeql.yml/badge.svg)](https://github.com/liatrio/react-dora-charts/actions/workflows/codeql.yml) [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) [![Release](https://github.com/liatrio/react-dora-charts/actions/workflows/release.yml/badge.svg?branch=main)](https://github.com/liatrio/react-dora-charts/actions/workflows/release.yml) ![GitHub top language](https://img.shields.io/github/languages/top/liatrio/react-dora-charts)

This component library contains charts for the standard DORA metrics.

## Installation

You can install these components using the following command:

```sh
npm install @liatrio/react-dora-charts
```

Or

```sh
yarn add @liatrio/react-dora-charts
```

## Usage

To use these charts, you can do as follows:

```js
import { DeploymentFrequency, fetchData } from `@liatrio/react-dora-charts`
...
const fetchedData = fetchData(fetchProps, onSuccess, onFailure)
...
<div style={{width: "600px", height: "400px"}}>
    <DeploymentFrequencyGraph data={fetchedData} />
</div>

```

It is important that the chart component be wrapped in an element of some size somewhere up the tree, otherwise the chart may have unexpected behavior.

## Exposed Components

### `Board`

This is a component to display an At a Glance board for the 4 DORA Metrics and can be setup to either display trends or color coded scores.

![Board](/screenshots/board_hover.png?raw=true 'Board')

![Board with details](/screenshots/board_with_details.png?raw=true 'Board with details')

![Board with trends](/screenshots/board_with_trends.png?raw=true 'Board with trends')

### `DeploymentFrequencyGraph`

This is a component to display a graph of your deployments over the specified time period.

![DeploymentFrequency](/screenshots/deployment_frequency.png?raw=true 'DeploymentFrequency')

### `ChangeLeadTimeGraph`

This is a component to display a graph of your change lead time over the specified time period.

![Change Lead Time](/screenshots/change_lead_time.png?raw=true 'Change Lead Time')

### `ChangeFailureRateGraph`

This is a component to display a graph of your change failure rate over the specified time period.

![Change Failure Rate](/screenshots/change_failure_rate.png?raw=true 'Change Failure Rate')

### `RecoverTimeGraph`

This is a component to display a graph of your recover time over the specified time period.

![Recover Time](/screenshots/recover_time.png?raw=true 'Recover Time')

### `TrendGraph`

This is a component to display the overall trend of the data supplied.

![Overall Trend](/screenshots/trend_overall.png?raw=true 'Overall Trend')

![Overall Trend with individual Metric Trends](/screenshots/trend_with_metrics.png?raw=true 'Overall Trend with individual Metric Trends')

### `TrendIndicator`

This component is a trend indicator you can use to display in parent components.

## Exposed Functions

### `fetchData`

Use this function to create the `data` parameter for the components.

This function takes a (`FetchProps`) object with the following properties.

| Field                           | Required | Description                                                                                                                                                                                                        |
| ------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api`                           | true     | This is the url to the API for gathering data.                                                                                                                                                                     |
| `getAuthHeaderValue`            | false    | This is a function that should provide the value of the `Authorization` HTTP Header for the `api`.<br>If not specified, no auth will be used.                                                                      |
| `team`                          | false    | The name of the team to show pull data for.                                                                                                                                                                        |
| `repositories`                  | false    | A list of repository names to pull data for.                                                                                                                                                                       |
| `daysToPull`                    | false    | The number of days in the past from the current date to pull data for<br>If not specified, 365 is the default.                                                                                                     |
| `includeWeekendsInCalculations` | false    | When calculating the averages for each metric in the `Board` component, this setting allows you to include/exclude weekends in those calculations.<br>This is useful when you don't have teams that work weekends. |
| `holidays`                      | false    | This field allows you to specify holidays that your organization follows to exclude from the calculations for the `Board` component.                                                                               |

### `buildDoraStateForPeriod`

This function returns a `DoraState` object with information about each DORA Metric.

It takes the following values as parameters:

| Parameter | Description                                                            |
| --------- | ---------------------------------------------------------------------- |
| `props`   | An object containing the [Component Properties](#component-properties) |
| `data`    | The data supplied by the `fetchData` function                          |
| `start`   | The start date of the period you want to know the trend for            |
| `end`     | The end date of the period you want to know the trend for              |

To get the trend value, the evaluation will use the previous period of the same length against your request period.

The `DoraState` object that is returned contains the following for each metric:

| Field     | Description                                                                                                                         |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `average` | The average of the metric of the supplied time frame.                                                                               |
| `display` | A formatted display string for `average` field including a postfix of hrs, days, mins, or % depending on the metric and time scale. |
| `color`   | The color for the displays string based on the `colors` supplied in the component properties.                                       |
| `trend`   | Whether this period measured is improving, falling behind, or staying even with the requested period.                               |
| `rank`    | An enum of `Rank` that provides whether you are elite, high, medium, low or unknown for this metric.                                |

### `getDateDaysInPast` and `getDateDaysInPastUtc`

These functions are just shortcuts to get a Date a certain number of days in the past

## Component Properties

### Graph Component Properties

| Property                        | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------- | :------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data`                          |   true   | An array of `DoraRecord` objects used to display the graphs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `graphStart`                    |  false   | If not supplied this will default to 30 days in the past.<br>This value is used to determine the starting date for the charts.                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `graphEnd`                      |  false   | If not supplied, this will default to 1 day in the past.<br>This value is used to determine the ending date for the charts.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `loading`                       |  false   | Boolean to allow a container component to control the loading status as it waits to supply `data`.                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `includeWeekendsInCalculations` |  false   | When calculating the averages for each metric, this setting allows you to include/exclude weekends in those calculations.<br>This is useful when you don't have teams that work weekends.                                                                                                                                                                                                                                                                                                                                                             |
| `metricThresholdSet`            |  false   | This allows you to customize the metric thresholds used for determining the rank of each metric. You only have to override the ones you need. There are defaults based on the official DORA Report that are used when these are not supplied.<br>This takes in a `MetricThresholdSet` object which contains a `MetricThresholds` object for each metric.<br>The threshold values for `elite`, `high` and `medium` are measured in hours. `low` is considered anything longer than medium, so it is not able to be supplied as a value in this object. |
| `message`                       |  false   | This allows a parent component to display a custom message while it does something. This setting overrides `loading` and the no data state that happens if `data` is empty or the `api` returns no data.                                                                                                                                                                                                                                                                                                                                              |
| `holidays`                      |  false   | This field allows you to specify holidays that your organization follows to exclude from the calculations for the components.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `theme`                         |  false   | This field allows you to supply the `Theme` (dark, light) to the chart for styling purposes. You can alternatively just make sure that `data-theme='light\|dark'` is used on an ancestor of the component.                                                                                                                                                                                                                                                                                                                                            |

### Board Component Properties

- All the `Common Properties`

| Property            | Required | Description                                                                                                                          |
| ------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `alwaysShowDetails` | false    | This field controls whether the `Board` component shows the details on hover or statically below the icon.                           |
| `showTrends`        | false    | This field controls whether trends or rank base coloring is shown in the `Board` component.                                          |
| `hideColors`        | false    | This allows you to change the `Board` component to hide the rank based coloring on the icons and instead just use a shade of purple. |

### Trend Component Properties

- All the `Common Properties`

| Property               | Required | Description                                                                                                     |
| ---------------------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| `showIndividualTrends` | false    | Enabling this property will show a line for each individual metric trend in addition to the overall DORA trend. |

### TrendIndicator Component Properties

| Property | Required | Description                                                          |
| -------- | -------- | -------------------------------------------------------------------- |
| `trend`  | true     | This is a `Trend` enum value that controls what is displayed inside. |

## Dependencies

These components rely on `data` being supplied to them. We supply the [liatrio-dora-api](https://github.com/liatrio/liatrio-dora-api) to gather this data out of a Loki DB that is fed by our [liatrio-otel-collector](https://github.com/liatrio/liatrio-otel-collector). If you want to create your own API, it just needs to return the [Data Schema](#data-schemas).

We also expose the `fetchData` function to fetch this data for you and do some preprocessing of the data before sending it into the components. If you would like to use your own function you will need to examine the preprocessing done by this function and replicate it for yours.

## Data Schemas

The data schema for each chart is as follows:

```schema
{
    records: [{
      repository: string
      team: string
      title?: string
      user?: string
      sha: string
      status: boolean
      failed_at?: Date
      merged_at?: Date
      created_at: Date
      fixed_at?: Date
      deploy_url: string
      fixed_url?: string
      change_url: string
      issue_url?: string
    }, ...]
}
```

## Testing

### Unit Tests

Basic unit tests can be found in the [tests](./tests/) directory. They can be run with `npm test`

### Visual Diffs via Playwright

This project includes visual diff tests that are run via Playwright. They are used to ensure that the components are functioning and displaying correctly. Each component has its own set of visual diff tests that test the functionality of that component.

| File                                                                         | Description                                                                       |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [playwright.config.js](./playwright/playwright.config.js)                    | This file contains the configuration for the Playwright tests.                    |
| [playwright/test_parameters.yaml](./playwright/test_parameters.yaml)         | This file contains the test parameters.                                           |
| [playwright/playwright.dockerfile](./playwright/playwright.dockerfile)       | This Dockerfile is used to build a Docker image for running the Playwright tests. |
| [playwright/tests/components.test.js](./playwright/tests/components.test.js) | This file contains the main test logic.                                           |
| [playwright/helpers/utils.js](./playwright/helpers/utils.js)                 | This file contains utility functions used by the tests.                           |
| [playwright/helpers/constants.js](./playwright/helpers/constants.js)         | This file contains constants used by the tests.                                   |

To run the Playwright tests, use the following commands:

| Command                                      | Description                                                                                |
| -------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `npm run playwright`                         | Runs all the tests. See [note about docker usage](#note-about-docker-usage).               |
| `npm run playwright:smoke-test`              | Runs a subset of the tests.<br>Useful for debugging.                                       |
| `npm run playwright:show-report`             | Shows the most recent test report.<br>Can be used to view reports for test run via Docker. |
| `npm run playwright:update-snapshots`        | Updates the snapshots. See [note about docker usage](#note-about-docker-usage).            |
| `npm run playwright:docker:build`            | Builds the Docker image.                                                                   |
| `npm run playwright:docker`                  | Runs the tests in a Docker container.                                                      |
| `npm run playwright:docker:update-snapshots` | Updates the snapshots in a Docker container.                                               |

You can also run a subset of the tests using tags, for example:

```sh
npx playwright test --grep @component-board
npx playwright test --grep @dataset-low
```

#### Note about updating snapshots

⚠️ Be extra cautious when updating snapshots. Any changes to the snapshots need to be manually reviewed for accuracy before committing them.

#### Note about Docker usage

To ensure consistency in the snapshots across different machines (local dev vs. CI), the Playwright tests are run in a Docker container. Running the tests locally is useful for creating and debugging, but all snapshots should be updated via the `playwright:docker:update-snapshots` command.

## Contributing

See [Contributing to React Dora Charts](./CONTRIBUTING).
