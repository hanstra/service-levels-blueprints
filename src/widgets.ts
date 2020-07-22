import {
  TextWidget,
  GraphWidget,
  LegendPosition,
  HorizontalAnnotation,
} from "@aws-cdk/aws-cloudwatch";
import * as metrics from "./metrics";

export interface ApiResource {
  path: string;
  methods: string[];
}
const flatten2DArray = (arr: any[][]) =>
  arr.reduce((acc, val) => acc.concat(val), []);

export const header = (name: string, desc: string, height?: number) =>
  new TextWidget({
    width: 24,
    height: height ?? 2,
    markdown: `\n# ${name}\n${desc}\n`,
  });
export const apiRequests = (
  apiName: string,
  stage: string,
  horizontalAnnotations?: HorizontalAnnotation[]
) =>
  new GraphWidget({
    title: "Requests",
    width: 6,
    height: 3,
    left: [metrics.apiRequests({ apiName, stage })],
    legendPosition: LegendPosition.HIDDEN,
    leftAnnotations: horizontalAnnotations ?? [],
  });
export const apiMethodRequests = (
  apiName: string,
  stage: string,
  resources: ApiResource[],
  horizontalAnnotations?: HorizontalAnnotation[]
) =>
  new GraphWidget({
    title: "Method Requests",
    width: 6,
    height: 3,
    left: flatten2DArray(
      resources.map((resource) =>
        resource.methods.map((method) =>
          metrics.apiRequests({
            apiName,
            stage,
            path: resource.path,
            method,
            label: `${method} ${resource.path}`,
          })
        )
      )
    ),
    leftYAxis: { label: "", showUnits: false },
    legendPosition: LegendPosition.HIDDEN,
    leftAnnotations: horizontalAnnotations ?? [],
  });
export const apiErrors = (
  apiName: string,
  stage: string,
  horizontalAnnotations?: HorizontalAnnotation[]
) => {
  const errors = metrics.apiErrors({ apiName, stage });
  return new GraphWidget({
    title: "Errors",
    width: 6,
    height: 3,
    left: [errors.rate4xx, errors.rate5xx],
    legendPosition: LegendPosition.HIDDEN,
    leftAnnotations: horizontalAnnotations ?? [],
    leftYAxis: { label: "Percent", showUnits: false, min: 0, max: 100 },
  });
};
export const apiMethodErrors = (
  apiName: string,
  stage: string,
  resources: ApiResource[],
  horizontalAnnotations?: HorizontalAnnotation[]
) => {
  let i = 0;
  const methodErrorRates = resources.map((resource) =>
    resource.methods.map(
      (method) =>
        metrics.apiErrors({
          apiName,
          stage,
          path: resource.path,
          method,
          metricIdx: i++,
          label: `${method} ${resource.path}`,
        }).rate5xx
    )
  );

  return new GraphWidget({
    title: "Method 5XX Errors",
    width: 6,
    height: 3,
    left: flatten2DArray(methodErrorRates),
    legendPosition: LegendPosition.HIDDEN,
    leftAnnotations: horizontalAnnotations ?? [],
    leftYAxis: { label: "Percent", showUnits: false, min: 0, max: 100 },
  });
};
export const apiLatency = (
  apiName: string,
  stage: string,
  percentile: number,
  horizontalAnnotations?: HorizontalAnnotation[]
) =>
  new GraphWidget({
    title: `Latency P${percentile}`,
    width: 6,
    height: 3,
    left: [metrics.apiLatency({ apiName, stage }, percentile)],
    legendPosition: LegendPosition.HIDDEN,
    leftAnnotations: horizontalAnnotations ?? [],
    leftYAxis: { label: "", showUnits: true },
  });
export const apiMethodLatency = (
  apiName: string,
  stage: string,
  percentile: number,
  resources: ApiResource[],
  horizontalAnnotations?: HorizontalAnnotation[]
) =>
  new GraphWidget({
    title: `Method Latency P${percentile}`,
    width: 6,
    height: 3,
    left: flatten2DArray(
      resources.map((resource) =>
        resource.methods.map((method) =>
          metrics.apiLatency(
            {
              apiName,
              stage,
              path: resource.path,
              method,
              label: `${method} ${resource.path}`,
            },
            percentile
          )
        )
      )
    ),
    legendPosition: LegendPosition.HIDDEN,
    leftAnnotations: horizontalAnnotations ?? [],
    leftYAxis: { label: "", showUnits: true },
  });
export const apiLambdaSaturation = (lambdas: string[]) =>
  new GraphWidget({
    title: "Lambda Saturation",
    width: 6,
    height: 3,
    left: lambdas.map((lambda) => metrics.lambdaConcurrentExecutions(lambda)),
    right: lambdas.map((lambda) => metrics.lambdaThrottles(lambda)),
    legendPosition: LegendPosition.HIDDEN,
    leftAnnotations: [{ label: "Concurrency Limit", value: 1000 }],
    leftYAxis: { label: "Concurrent Executions", showUnits: false },
    rightYAxis: { label: "Throttles", showUnits: false },
  });
export const apiLambdaDurations = (lambdas: string[]) =>
  new GraphWidget({
    title: "Lambda Duration",
    width: 6,
    height: 3,
    left: lambdas.map((lambda) => metrics.lambdaDurations(lambda)),
    legendPosition: LegendPosition.HIDDEN,
    leftAnnotations: [{ label: "Integration Timeout", value: 30000 }],
  });
export const cloudfrontErrors = (distributionId: string) => {
  const errors = metrics.cloudfrontErrors({ distributionId });
  return new GraphWidget({
    title: "Errors",
    width: 12,
    height: 3,
    left: [errors.rate4xx, errors.rate5xx],
    leftYAxis: { min: 0, max: 100 },
  });
};
export const cloudfrontLatency = (distributionId: string) =>
  new GraphWidget({
    title: "Cache Miss Latency",
    width: 12,
    height: 3,
    left: [metrics.cloudfrontLatency({ distributionId })],
    right: [metrics.cloudfrontCacheMisses({ distributionId })],
  });
