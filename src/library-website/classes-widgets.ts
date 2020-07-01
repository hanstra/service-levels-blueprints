import * as widgets from "../widgets";
import { Shading } from "@aws-cdk/aws-cloudwatch";

const apiName = "classesAPI-prod";
const stage = "prod";
const methods: widgets.ApiResource[] = [
  {
    path: "/courses",
    methods: ["GET", "OPTIONS"],
  },
];
const lambdas: string[] = ["classesAPI-prod-passthrough"];
const header = widgets.header("Classes API", "Brief description");
const requests = widgets.apiRequests(apiName, stage);
const methodRequests = widgets.apiMethodRequests(apiName, stage, methods);
const errors = widgets.apiErrors(
  apiName,
  stage
  // [{ "label": "SLO", "value": 1, "fill": "above" }]
);
const methodErrors = widgets.apiMethodErrors(apiName, stage, methods);
const latencyP75 = widgets.apiLatency(apiName, stage, 75, [
  { label: "SLO", value: 2000, fill: Shading.ABOVE },
]);
const methodLatencyP75 = widgets.apiMethodLatency(apiName, stage, 75, methods);
const latencyP95 = widgets.apiLatency(apiName, stage, 95, [
  { label: "SLO", value: 3500, fill: Shading.ABOVE },
]);
const methodLatencyP95 = widgets.apiMethodLatency(apiName, stage, 95, methods);
const lambdaSaturation = widgets.apiLambdaSaturation(lambdas);
const lambdaDurations = widgets.apiLambdaDurations(lambdas);
export const rows = [
  [header],
  [requests, methodRequests, errors, methodErrors],
  [latencyP95, methodLatencyP95, latencyP75, methodLatencyP75],
  [lambdaSaturation, lambdaDurations],
];
