import * as widgets from "./widgets";
import { DashboardProps, GraphWidget, Shading } from "@aws-cdk/aws-cloudwatch";
import { Dashboard } from "@aws-cdk/aws-cloudwatch";
import { ApiLatencySLO } from "@ndlib/ndlib-cdk/lib/slos/types";
import { Construct } from "@aws-cdk/core";

export interface ApiDashboardProps extends DashboardProps {
  /**
   * Value to use as the header of the dashboard.
   */
  headerName: string;

  /**
   * How big to make the header. You may need to adjust this
   * based on the size of your description.
   * Default is 3.
   */
  headerSize?: number;

  /**
   * A brief description of what this API does.
   */
  desc: string;

  /**
   * Name of the API to base metrics on.
   */
  apiName: string;

  /**
   * Stage of the API to base metrics on.
   */
  stage: string;

  /**
   * If there are any Latency SLOs that match the api name in the given slos,
   * it will add additional widgets to track those. Supports multiple latency
   * bands for different percentiles.
   */
  slos: any[];
}

export class ApiDashboard extends Dashboard {
  /**
   * Creates a dashboard with debug/informational metrics for an API Gateway.
   * It will create widgets to track requests, errors and latencies for the
   * API, all of its methods, and any lambda integrations. Assumes that method
   * names and lambda names begin with the api name.
   */
  constructor(scope: Construct, id: string, props: ApiDashboardProps) {
    const { headerName, apiName, stage, desc, slos, headerSize } = props;
    const lambdas: string[] = [apiName];
    const header = widgets.header(headerName, desc, headerSize ?? 3);
    const requests = widgets.apiRequests(apiName, stage);
    const methodRequests = widgets.apiMethodRequests(apiName, stage);
    const errors = widgets.apiErrors(apiName, stage);
    const methodErrors = widgets.apiMethodErrors(apiName, stage);

    const latencyWidgets: GraphWidget[] = [];
    const latencySlos: any[] = slos.filter(
      (slo: any) => slo.apiName === apiName && slo.type === "ApiLatency"
    );
    latencySlos.forEach((slo: ApiLatencySLO) => {
      latencyWidgets.push(
        widgets.apiLatency(apiName, stage, slo.sloThreshold * 100, [
          { label: "SLO", value: slo.latencyThreshold, fill: Shading.ABOVE },
        ])
      );
      latencyWidgets.push(
        widgets.apiMethodLatency(apiName, stage, slo.sloThreshold * 100)
      );
    });
    if (latencySlos.length === 0) {
      latencyWidgets.push(widgets.apiLatency(apiName, stage, 99.7));
      latencyWidgets.push(widgets.apiMethodLatency(apiName, stage, 99.7));
    }

    const lambdaSaturation = widgets.apiLambdaSaturation(lambdas);
    const lambdaDurations = widgets.apiLambdaDurations(lambdas);
    const defaultProps = {
      widgets: [
        [header],
        [requests, methodRequests, errors, methodErrors],
        latencyWidgets,
        [lambdaSaturation, lambdaDurations],
      ],
    };

    super(scope, id, { ...defaultProps, ...props });
  }
}
