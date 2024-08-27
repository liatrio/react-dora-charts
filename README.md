# Introduction

This component library contains charts for the standard DORA metrics.

## Installation

You can install these components using the following command:

```sh
npm install https://github.com/liatrio/react-dora-charts/releases/download/v1.0.0/react-dora-charts-1.0.0.tgz
```

Or

```sh
yarn add react-dora-charts@https://github.com/liatrio/react-dora-charts/releases/download/v1.0.0/react-dora-charts-1.0.0.tgz
```

## Usage

To use these charts, you can do as follows:

```js
import { DeploymentFrequency, fetchData } from `react-dora-charts`
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

This is a component to display an At a Glance board for the 4 DORA Metrics and can be setup to either display trends or color coded scores

![Board](/screenshots/board_hover.png?raw=true "Board")

![Board with details](/screenshots/board_with_details.png?raw=true "Board with details")

![Board with trends](/screenshots/board_with_trends.png?raw=true "Board with trends")

### `DeploymentFrequencyGraph`

This is a component to display a graph of your deployments over the specified time period

![DeploymentFrequency](/screenshots/deployment_frequency.png?raw=true "DeploymentFrequency")

### `ChangeLeadTimeGraph`

This is a component to display a graph of your change lead time over the specified time period

![Change Lead Time](/screenshots/change_lead_time.png?raw=true "Change Lead Time")

### `ChangeFailureRateGraph`

This is a component to display a graph of your change failure rate over the specified time period

![Change Failure Rate](/screenshots/change_failure_rate.png?raw=true "Change Failure Rate")

### `RecoverTimeGraph`

This is a component to display a graph of your recover time over the specified time period

![Recover Time](/screenshots/recover_time.png?raw=true "Recover Time")

### `TrendGraph`

This is a component to display an the overall trend of the data supplied

![Overall Trend](/screenshots/trend_overall.png?raw=true "Overall Trend")

![Overall Trend with individual Metric Trends](/screenshots/trend_with_metrics.png?raw=true "Overall Trend with individual Metric Trends")

### `TrendIndicator`

This component is a trend indicator you can use to display in parent components

## Exposed Functions

### `fetchData`

This is the function your parent component should use to pull data to supply in the `data` property of the components

The parameters of this function are as follows:

An object (`FetchProps`) containing the following properties

* `api`:
  * This is the url to the API for gathering data.

* `getAuthHeaderValue` (*optional*):
  * This is a function that should provide the value of the `Authorization` HTTP Header for the `api`.
  * If not specified, no auth will be used

* `team` (*optional*):
  * The name of the team to show pull data for.

* `repositories` (*optional*):
  * A list of repository names to pull data for.

* `daysToPull` (*optional*):
  * The number of days in the past from the current date to pull data for
  * If not specified, 365 is the default

* `includeWeekendsInCalculations` (*optional*):
  * When calculating the averages for each metric in the `Board` component, this setting allows you to include/exclude weekends in those calculations.  This is useful when you don't have teams that work weekends.

* `holidays` (*optional*):
  * This field allows you to specify holidays for that your organization follows to exclude from the calculations for the `Board` component.

### `buildDoraStateForPeriod`

This function returns a `DoraState` object with information about each DORA Metric.

It takes the following values as parameters:

* `props` - An object contianing the [Component Properties](#component-properties)
* `data` - The data supplied by the `fetchData` function
* `start` - The start date of the period you want to know the trend for
* `end` - The end date of the period you want to know the trend for

To get the trend value, the evaluation will use the previous period of the same length agains your request period.

The `DoraState` object that is returned contains the following for each metric:

* `average` - Is the average of the metric of the supplied time frame
* `display` - Is a formated display string for `average` field including a postfix of hrs, days, mins, or % depending on the metric and time scale
* `color` - Is the color for the displays string based on the `colors` supplied in the component properties
* `trend` - Is whether this period measured is improving, falling behind, or staying even with the requested period
* `rank` - Is a enum of `Rank` that provides whether you are elite, high, medium, low or unknown for this metric

### `getDateDaysInPast` and `getDateDaysInPastUtc`

These functions are just shortcuts to get a Date a certain number of days in the past

## Component Properties

### Graph Component Properties

* `data`:
  * An array of `DoraRecord` objects used to display the graphs.

* `graphStart` (*optional*):
  * If not supplied this will default to 30 days in the past.
  * This value is used to determine the starting date for the charts.

* `graphEnd` (*optional*):
  * If not supplied, this will default to 1 day in the past.
  * This value is used to determine the ending date for the charts.

* `loading` (*optional*):
  * Boolean to allow a container component to control the loading status if it wants to supply `data`

* `includeWeekendsInCalculations` (*optional*):
  * When calculating the averages for each metric, this setting allows you to include/exclude weekends in those calculations.  This is useful when you don't have teams that work weekends.

* `metricThresholdSet` (*optional*):
  * This allows you to customize the metric thresholds used for determining the rank of each metric.  You only have to override the ones you need. There are defaults based on the official DORA Report that are used when these are not supplied.  This takes in a `MetricThresholdSet` object which contains a `MetricThresholds` object for each metric.

  The threshold values for `elite`, `high` and `medium` are measured in hours.  `low` is considered anything longer than medium, so it is not able to be supplied as a value in this object.

* `message` (*optional*):
  * This allows a parent component to display a custom message while it does something.  This setting overrides `loading` and the nodata state that happens if `data` is empty or the `api` returns no data

* `holidays` (*optional*):
  * This field allows you to specify holidays for that your organization follows to exclude from the calculations for the components

### Board Component Properties

* All the `Common Properties`

* `alwaysShowDetails` (*optional*):
  * This field controls whether the `Board` component shows the details on hover or statically below the icon

* `showTrends` (*optional*):
  * This field controls whether trends or rank base coloring is shown in the `Board` component

* `hideColors` (*optional*):
  * This allows you to change the `Board` component to hide the rank based coloring on the icons and instead just use a shade of purple

### Trend Component Properties

* `showIndividualTrends` (*optional*):
  * Enabling this property will show a line for each individual metric trend in addition to the overall DORA trend

### TrendIndicator Component Properties

* `trend`:
  * This is a `Trend` enum value that controls what is displayed inside

## Dependencies

These components rely on `data` being supplied to them.  We supply the [liatrio-dora-api](https://github.com/liatrio/liatrio-dora-api) to gather this data out of a Loki DB that is fed by our [liatrio-otel-collector](https://github.com/liatrio/liatrio-otel-collector).  If you want to create your own API, it just needs to return the [Data Schema](#data-schemas)

We also expose the `fetchData` function to fetch this data for you and do some preprocessing of the data before sending it into the components.  If you would like to use your own function you will need to examine the preprocessing done by this function and replicate it for yours.

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
