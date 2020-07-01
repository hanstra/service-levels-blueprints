import * as widgets from "../widgets";
import { Shading } from "@aws-cdk/aws-cloudwatch";

const apiName = "contentfulmaps-prod";
const stage = "prod";
const methods: widgets.ApiResource[] = [
  { path: "/map", methods: ["OPTIONS"] },
  { path: "/map", methods: ["GET"] },
];
const lambdas: string[] = ["contentfulmaps-prod-mapquery"];
const desc = `
The Maps API, which corresponds to the contentful maps service, has **one endpoint that connects to Contentful** This service:

* Queries Contentful using item record data points to return the correct map URI
`;
const header = widgets.header("Maps API", desc, 3);
const requests = widgets.apiRequests(apiName, stage);
const methodRequests = widgets.apiMethodRequests(apiName, stage, methods);
const errors = widgets.apiErrors(apiName, stage);
const methodErrors = widgets.apiMethodErrors(apiName, stage, methods);
const latencyP50 = widgets.apiLatency(apiName, stage, 50);
const methodLatencyP50 = widgets.apiMethodLatency(apiName, stage, 50, methods);
const latencyP95 = widgets.apiLatency(apiName, stage, 95);
const methodLatencyP95 = widgets.apiMethodLatency(apiName, stage, 95, methods);
const lambdaSaturation = widgets.apiLambdaSaturation(lambdas);
const lambdaDurations = widgets.apiLambdaDurations(lambdas);
export const rows = [
  [header],
  [requests, methodRequests, errors, methodErrors],
  [latencyP95, methodLatencyP95, latencyP50, methodLatencyP50],
  [lambdaSaturation, lambdaDurations],
];
