import * as widgets from "../widgets";
import { Shading } from "@aws-cdk/aws-cloudwatch";

const apiName = "userPreferences-prod";
const stage = "prod";
const methods: widgets.ApiResource[] = [
  { path: "/", methods: ["OPTIONS"] },
  { path: "/circHistory", methods: ["DELETE", "GET", "OPTIONS"] },
  { path: "/circHistory/{itemKey}", methods: ["DELETE", "OPTIONS"] },
  { path: "/favorites/{type}", methods: ["DELETE", "GET", "OPTIONS", "POST"] },
  {
    path: "/emailSubscription/{type}",
    methods: ["DELETE", "GET", "OPTIONS", "POST"],
  },
  {
    path: "/favorites/{type}/{itemKey}",
    methods: ["DELETE", "OPTIONS", "POST"],
  },
  { path: "/favorites", methods: ["OPTIONS"] },
  { path: "/simpleSetting/{type}", methods: ["GET", "OPTIONS", "POST"] },
  { path: "/simpleSetting", methods: ["OPTIONS"] },
  { path: "/circOptIn", methods: ["GET", "OPTIONS", "POST"] },
];
const lambdas: string[] = [
  "monarchLibguides-prod-hours",
  "monarchLibguides-prod-newEvent",
];
const desc = `
The User Preference API, which corresponds to the user preferences service, has **five endpoints that interact with a DynamoDB service** This API:

* Queries for circ history based on user id
* Updates the opt-in circ status for patrons
* Tracks email subscriptions
* Records favorite resources selected by patron
* Maintains the full list of settings for every patron account
`;
const header = widgets.header("User Preferences API", desc, 4);
const requests = widgets.apiRequests(apiName, stage);
const methodRequests = widgets.apiMethodRequests(apiName, stage, methods);
const errors = widgets.apiErrors(apiName, stage);
const methodErrors = widgets.apiMethodErrors(apiName, stage, methods);
const latencyP50 = widgets.apiLatency(apiName, stage, 50, [
  { label: "SLO", value: 500, fill: Shading.ABOVE },
]);
const methodLatencyP50 = widgets.apiMethodLatency(apiName, stage, 50, methods);
const latencyP95 = widgets.apiLatency(apiName, stage, 95, [
  { label: "SLO", value: 2500, fill: Shading.ABOVE },
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
