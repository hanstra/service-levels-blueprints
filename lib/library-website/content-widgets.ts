import * as widgets from '../widgets';
import { Shading } from '@aws-cdk/aws-cloudwatch';

const apiName = "contentfuldirect-prod";
const stage = "prod";
const methods: widgets.ApiResource[] = [
  { path: "/archiveSecure", methods: ["OPTIONS", "GET"] },
  { path: "/livequery", methods: ["OPTIONS", "GET"]},
  { path: "/preview/query", methods: ["OPTIONS", "GET"] },
  { path: "/purl", methods: ["OPTIONS", "GET"] },
  { path: "/purlSecure", methods: ["OPTIONS", "GET"] },
  { path: "/query", methods: ["OPTIONS", "GET"] },
  { path: "/secureQuery", methods: ["OPTIONS", "GET"] },
];
const lambdas: string[] = [
  "contentfuldirect-prod-archivequery",
  "contentfuldirect-prod-directquery",
  "contentfuldirect-prod-purlquery",
]
const header = widgets.header("Content API", "Brief description");
const requests = widgets.apiRequests(apiName, stage);
const methodRequests = widgets.apiMethodRequests(apiName, stage, methods);
const errors = widgets.apiErrors(apiName, stage);
const methodErrors = widgets.apiMethodErrors(apiName, stage, methods);
const latencyP95 = widgets.apiLatency(apiName, stage, 95,
  [{ "label": "SLO", "value": 300, "fill": Shading.ABOVE }],
);
const methodLatencyP95 = widgets.apiMethodLatency(apiName, stage, 95, methods);
const lambdaSaturation = widgets.apiLambdaSaturation(lambdas);
const lambdaDurations = widgets.apiLambdaDurations(lambdas);
export const rows = [
  [header],
  [requests, methodRequests, errors, methodErrors],
  [latencyP95, methodLatencyP95],
  [lambdaSaturation,lambdaDurations],
];