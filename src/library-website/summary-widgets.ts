import {
  Metric,
  GraphWidget,
  Statistic,
  LegendPosition,
  MathExpression,
} from "@aws-cdk/aws-cloudwatch";
import { Duration } from "@aws-cdk/core";
import * as metrics from "../metrics";

/**
 * Converts an array of metrics to an object who's keys are the m#,
 * where # is the indices of the original array. Ex:
 *   [ 'a', 'b' ] becomes the object { m0: 'a', m1: 'b' }
 *
 * @param array Array to convert
 */
const convertArrayToObject = (array: any[]) => {
  const initialValue = {};
  return array.reduce((obj, item, idx) => {
    return {
      ...obj,
      [`m${idx}`]: item,
    };
  }, initialValue);
};

const apis = [
  {
    apiName: "contentfuldirect-prod",
    stage: "prod",
    label: "Content API",
    color: "#ff7f0e",
  },
  {
    apiName: "contentfulmaps-prod",
    stage: "prod",
    label: "Maps API",
    color: "#2ca02c",
  },
  {
    apiName: "recommendEngine-prod",
    stage: "prod",
    label: "Directory API",
    color: "#d62728",
  },
  {
    apiName: "libcal-gateway-prod",
    stage: "prod",
    label: "LibCal Gateway API",
    color: "#9467bd",
  },
  {
    apiName: "gatekeeper-prod",
    stage: "prod",
    label: "GateKeeper API",
    color: "#8c564b",
  },
  {
    apiName: "classesAPI-prod",
    stage: "prod",
    label: "Classes API",
    color: "#e377c2",
  },
  {
    apiName: "userPreferences-prod",
    stage: "prod",
    label: "User Preferences API",
    color: "#7f7f7f",
  },
];
const lambdas: string[] = [
  "classesAPI-prod",
  "contentfuldirect-prod",
  "recommendEngine-prod",
  "gatekeeper-prod",
  "contentfulmaps-prod",
  "libcal-gateway-prod",
  "userPreferences-prod",
];
const cdnDistributionId = "E1560Z89H1UDHK";

const apiRequestMetrics = apis.map((api) => metrics.apiRequests(api));
const cdnRequestMetrics = metrics.cloudfrontRequests({
  distributionId: cdnDistributionId,
  label: "HTTP CDN",
  color: "#1f77b4",
});
const trafficPerServiceMetric = new MathExpression({
  label: " ",
  expression: "METRICS()/PERIOD(m0)",
  usingMetrics: convertArrayToObject([cdnRequestMetrics, ...apiRequestMetrics]),
});
const trafficPerService = new GraphWidget({
  title: "Traffic per Service",
  width: 24,
  height: 4,
  left: [trafficPerServiceMetric],
  leftYAxis: { label: "Requests/s", showUnits: false, min: 0 },
  legendPosition: LegendPosition.BOTTOM,
});

const apiErrorRates = apis.map(
  (api, i) => metrics.apiErrors({ ...api, metricIdx: i }).rate5xx
);
const cdnErrorsMetrics = metrics.cloudfrontErrors({
  distributionId: cdnDistributionId,
  label: "HTTP CDN",
  color: "#1f77b4",
}).rate5xx;
const errorsPerService = new GraphWidget({
  title: "Errors per Service",
  width: 24,
  height: 4,
  left: [cdnErrorsMetrics, ...apiErrorRates],
  legendPosition: LegendPosition.BOTTOM,
  leftYAxis: { label: "Percent", showUnits: false, min: 0, max: 100 },
});

const apiLatencies = apis.map((api, i) => metrics.apiLatency(api, 95));
const cdnLatency = metrics.cloudfrontLatency({
  distributionId: cdnDistributionId,
  label: "HTTP CDN (Cache Miss Only)",
  color: "#1f77b4",
});
const latenciesPerService = new GraphWidget({
  title: "Latencies per Service",
  width: 24,
  height: 4,
  left: [cdnLatency, ...apiLatencies],
  legendPosition: LegendPosition.BOTTOM,
  leftYAxis: { label: "", showUnits: true },
});

const concurrentExecutions = lambdas.map((lambda) =>
  metrics.lambdaConcurrentExecutions(lambda)
);
const lambdaSaturations = new GraphWidget({
  title: "Lambda Saturation",
  width: 24,
  height: 4,
  left: concurrentExecutions,
  legendPosition: LegendPosition.HIDDEN,
  leftAnnotations: [{ label: "Concurrency Limit", value: 1000 }],
  leftYAxis: { label: "Concurrent Executions", showUnits: false },
  rightYAxis: { label: "Throttles", showUnits: false },
});

const lambdaDurations = new GraphWidget({
  title: "Lambda Duration",
  width: 24,
  height: 4,
  left: lambdas.map((lambda) => metrics.lambdaDurations(lambda)),
  legendPosition: LegendPosition.HIDDEN,
  leftAnnotations: [{ label: "Integration Timeout", value: 30000 }],
});

export const rows = [
  [trafficPerService],
  [errorsPerService],
  [latenciesPerService],
  [lambdaSaturations],
  [lambdaDurations],
];
