import * as widgets from "../widgets";
import { Shading } from "@aws-cdk/aws-cloudwatch";

const apiName = "gatekeeper-prod";
const stage = "prod";
const methods: widgets.ApiResource[] = [
  { path: "/location", methods: ["GET"] },
  { path: "/aleph/{systemId}", methods: ["GET"] },
  { path: "/aleph/borrowed", methods: ["OPTIONS", "GET"] },
  { path: "/aleph/circhistory", methods: ["GET"] },
  { path: "/aleph/pending", methods: ["OPTIONS", "GET"] },
  { path: "/aleph/renew", methods: ["OPTIONS", "POST"] },
  { path: "/aleph/user", methods: ["OPTIONS", "GET"] },
  { path: "/illiad/all", methods: ["GET"] },
  { path: "/illiad/borrowed", methods: ["OPTIONS", "GET"] },
  { path: "/illiad/pending", methods: ["GET", "OPTIONS"] },
];
const lambdas: string[] = [
  "gatekeeper-prod-aleph",
  "gatekeeper-prod-alephCircHistory",
  "gatekeeper-prod-alephQuery",
  "gatekeeper-prod-alephRenew",
  "gatekeeper-prod-alephUserInfo",
  "gatekeeper-prod-illiad",
  "gatekeeper-prod-location",
  "gatekeeper-prod-aleph",
  "gatekeeper-prod-alephCircHistory",
  "gatekeeper-prod-alephQuery",
  "gatekeeper-prod-alephRenew",
  "gatekeeper-prod-alephUserInfo",
  "gatekeeper-prod-illiad",
  "gatekeeper-prod-location",
];
const desc = `
The Gatekeeper API has **four primary endpoints** that interact with three upstream services which are:

* Primo
* Aleph
* ILLiad
`;
const header = widgets.header("Gatekeeper API", desc, 3);
const requests = widgets.apiRequests(apiName, stage);
const methodRequests = widgets.apiMethodRequests(apiName, stage, methods);
const errors = widgets.apiErrors(apiName, stage);
const methodErrors = widgets.apiMethodErrors(apiName, stage, methods);
const latencyP75 = widgets.apiLatency(apiName, stage, 75, [
  { label: "SLO", value: 2000, fill: Shading.ABOVE },
]);
const methodLatencyP75 = widgets.apiMethodLatency(apiName, stage, 75, methods);
const latencyP95 = widgets.apiLatency(apiName, stage, 95, [
  { label: "SLO", value: 7000, fill: Shading.ABOVE },
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
