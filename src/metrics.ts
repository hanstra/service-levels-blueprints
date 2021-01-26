import { Metric, Statistic, MathExpression } from "@aws-cdk/aws-cloudwatch";
import { Duration } from "@aws-cdk/core";

export interface ApiMetricProps {
  apiName: string;
  stage: string;
  path?: string;
  method?: string;
  label?: string;
  color?: string;
  metricIdx?: number;
}

const apiDimensions = (props: ApiMetricProps) => ({
  ...{ ApiName: props.apiName, Stage: props.stage },
  ...(props.path ? { Resource: props.path } : {}), // Merge Resource path into dimensions if given
  ...(props.method ? { Method: props.method } : {}), // Merge Resource method into dimensions if given
});

export const apiRequests = (props: ApiMetricProps) =>
  new Metric({
    region: "us-east-1",
    namespace: "AWS/ApiGateway",
    metricName: "Count",
    dimensions: apiDimensions(props),
    label: props.label ?? "Requests",
    period: Duration.minutes(5),
    statistic: Statistic.SUM,
    color: props.color,
  });

export const apiErrors = (props: ApiMetricProps) => {
  const dimensions = apiDimensions(props);
  const idx = props.metricIdx ?? 0;
  const errors4xx = new Metric({
    region: "us-east-1",
    namespace: "AWS/ApiGateway",
    metricName: "4XXError",
    dimensions,
    label: "4xx",
    period: Duration.minutes(5),
    statistic: Statistic.SUM,
  });
  const errors5xx = new Metric({
    region: "us-east-1",
    namespace: "AWS/ApiGateway",
    metricName: "5XXError",
    dimensions,
    label: "5xx",
    period: Duration.minutes(5),
    statistic: Statistic.SUM,
  });
  const requests = new Metric({
    region: "us-east-1",
    namespace: "AWS/ApiGateway",
    metricName: "Count",
    dimensions,
    label: "Requests",
    period: Duration.minutes(5),
    statistic: Statistic.SUM,
  });

  return {
    rate4xx: new MathExpression({
      label: props.label ?? "4xx",
      color: props.color,
      expression: `errors4xx_${idx}/requests_${idx}*100`,
      usingMetrics: {
        [`requests_${idx}`]: requests,
        [`errors4xx_${idx}`]: errors4xx,
      },
    }),
    rate5xx: new MathExpression({
      label: props.label ?? "5xx",
      color: props.color,
      expression: `errors5xx_${idx}/requests_${idx}*100`,
      usingMetrics: {
        [`requests_${idx}`]: requests,
        [`errors5xx_${idx}`]: errors5xx,
      },
    }),
  };
};

export const apiLatency = (props: ApiMetricProps, percentile: number) =>
  new Metric({
    region: "us-east-1",
    namespace: "AWS/ApiGateway",
    metricName: "Latency",
    dimensions: apiDimensions(props),
    label: props.label ?? "Latency",
    period: Duration.minutes(5),
    statistic: `p${percentile}`,
    color: props.color,
  });

export const lambdaConcurrentExecutions = (lambda: string) =>
  new MathExpression({
    expression: `SEARCH('{AWS/Lambda,FunctionName} MetricName=ConcurrentExecutions FunctionName=${lambda}', 'Maximum', ${Duration.minutes(
      5
    ).toSeconds()})`,
    label: " ", // blank out the label so it displays the found function name
    usingMetrics: {},
  });

export const lambdaThrottles = (lambda: string) =>
  new MathExpression({
    expression: `SEARCH('{AWS/Lambda,FunctionName} MetricName=Throttles FunctionName=${lambda}', 'Maximum', ${Duration.minutes(
      5
    ).toSeconds()})`,
    label: " ", // blank out the label so it displays the found function name
    usingMetrics: {},
  });

export const lambdaDurations = (lambda: string) =>
  new MathExpression({
    expression: `SEARCH('{AWS/Lambda,FunctionName} MetricName=Duration FunctionName=${lambda}', 'p99.7', ${Duration.minutes(
      5
    ).toSeconds()})`,
    label: " ", // blank out the label so it displays the found function name
    usingMetrics: {},
  });

export interface CloudfrontMetricProps {
  distributionId: string;
  label?: string;
  color?: string;
}

export const cloudfrontRequests = (props: CloudfrontMetricProps) =>
  new Metric({
    region: "us-east-1",
    namespace: "AWS/CloudFront",
    metricName: "Requests",
    dimensions: { Region: "Global", DistributionId: props.distributionId },
    label: props.label ?? "Requests",
    period: Duration.minutes(5),
    statistic: Statistic.SUM,
    color: props.color,
  });

export const cloudfrontErrors = (props: CloudfrontMetricProps) => ({
  rate4xx: new Metric({
    region: "us-east-1",
    namespace: "AWS/CloudFront",
    metricName: "4xxErrorRate",
    dimensions: { Region: "Global", DistributionId: props.distributionId },
    label: props.label ?? "4xx",
    period: Duration.minutes(5),
    statistic: Statistic.AVERAGE,
    color: props.color,
  }),
  rate5xx: new Metric({
    region: "us-east-1",
    namespace: "AWS/CloudFront",
    metricName: "5xxErrorRate",
    dimensions: { Region: "Global", DistributionId: props.distributionId },
    label: props.label ?? "5xx",
    period: Duration.minutes(5),
    statistic: Statistic.AVERAGE,
    color: props.color,
  }),
});

export const cloudfrontLatency = (props: CloudfrontMetricProps) =>
  new Metric({
    region: "us-east-1",
    namespace: "AWS/CloudFront",
    metricName: "OriginLatency",
    label: props.label ?? "Cache Miss Latency",
    dimensions: { Region: "Global", DistributionId: props.distributionId },
    period: Duration.minutes(5),
    statistic: "p95",
    color: props.color,
  });

export const cloudfrontCacheMisses = (props: CloudfrontMetricProps) =>
  new Metric({
    region: "us-east-1",
    namespace: "AWS/CloudFront",
    metricName: "OriginLatency",
    dimensions: { Region: "Global", DistributionId: props.distributionId },
    label: props.label ?? "Cache Miss Count",
    period: Duration.minutes(5),
    statistic: Statistic.SAMPLE_COUNT,
    color: props.color,
  });
