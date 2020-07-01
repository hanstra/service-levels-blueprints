import * as widgets from "../widgets";
import { Shading } from "@aws-cdk/aws-cloudwatch";

const apiName = "monarchLibguides-prod";
const stage = "prod";
const methods: widgets.ApiResource[] = [
  { path: "/hours", methods: ["OPTIONS", "GET"] },
  { path: "/newevent", methods: ["OPTIONS", "POST"] },
];
const lambdas: string[] = [
  "monarchLibguides-prod-hours",
  "monarchLibguides-prod-newEvent",
];
const header = widgets.header("Hours API", "Brief description");
const requests = widgets.apiRequests(apiName, stage);
const methodRequests = widgets.apiMethodRequests(apiName, stage, methods);
const errors = widgets.apiErrors(apiName, stage);
const methodErrors = widgets.apiMethodErrors(apiName, stage, methods);
const latencyP50 = widgets.apiLatency(apiName, stage, 50, [
  { label: "SLO", value: 1000, fill: Shading.ABOVE },
]);
const methodLatencyP50 = widgets.apiMethodLatency(apiName, stage, 50, methods);
const latencyP95 = widgets.apiLatency(apiName, stage, 95, [
  { label: "SLO", value: 2000, fill: Shading.ABOVE },
]);
const methodLatencyP95 = widgets.apiMethodLatency(apiName, stage, 95, methods);
const lambdaSaturation = widgets.apiLambdaSaturation(lambdas);
const lambdaDurations = widgets.apiLambdaDurations(lambdas);
export const rows = [
  [header],
  [requests, methodRequests, errors, methodErrors],
  [latencyP95, methodLatencyP95, latencyP50, methodLatencyP50],
  [lambdaSaturation, lambdaDurations],
];
