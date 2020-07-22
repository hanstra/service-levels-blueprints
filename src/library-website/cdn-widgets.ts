import * as widgets from "../widgets";
import { Shading } from "@aws-cdk/aws-cloudwatch";

const distributionId = "E1560Z89H1UDHK";
const desc = `
Usurper is the single page application that is the front end for the library website. 

* This originates from an S3 bucket where the page is stored along with javascript, image and CSS assets. 
* There are three redundant nginX servers that have this CloudFront as their source.

**We are measuring the number of cache misses and the latency when a cache miss occurs relative to this CloudFront.**
`;

export const rows = [
  [widgets.header("HTTP CDN", desc, 3)],
  [
    widgets.cloudfrontErrors(distributionId),
    widgets.cloudfrontLatency(distributionId),
  ],
];
