import { StackProps, Stack, Construct } from "@aws-cdk/core";
import { ServerlessApiDashboard, CloudfrontDashboard, SummaryDashboard } from "@ndlib/ndlib-cdk";
import { ApiLatencySLO } from "@ndlib/ndlib-cdk/lib/slos/types";

export class DashboardsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const start = "-PT24H";
    const slos = scope.node.tryGetContext("library-slos");

    new SummaryDashboard(this, "SummaryDashboard", {
      dashboardName: "Library-Website-Summary",
      start,
      services: [
        {
          typeName: 'Cloudfront',
          distributionId: 'E1560Z89H1UDHK',
          label: 'HTTP CDN',
          color: '#1f77b4',
        },
        {
          typeName: 'APIGateway',
          apiName: 'contentfuldirect-prod',
          stage: 'prod',
          label: 'Content API',
          color: '#ff7f0e',
        },
        {
          typeName: 'APIGateway',
          apiName: 'contentfulmaps-prod',
          stage: 'prod',
          label: 'Maps API',
          color: '#2ca02c',
        },
        {
          typeName: 'APIGateway',
          apiName: 'libcal-gateway-prod',
          stage: 'prod',
          label: 'LibCal Gateway API',
          color: '#d62728',
        },
        {
          typeName: 'APIGateway',
          apiName: 'aleph-gateway-prod',
          stage: 'prod',
          label: 'Aleph Gateway API',
          color: '#9467bd',
        },
        {
          typeName: 'APIGateway',
          apiName: 'illiad-gateway-prod',
          stage: 'prod',
          label: 'Illiad Gateway API',
          color: '#8c564b',
        },
        {
          typeName: 'APIGateway',
          apiName: 'primo-gateway-prod',
          stage: 'prod',
          label: 'Primo Gateway API',
          color: '#e377c2',
        },
        {
          typeName: 'APIGateway',
          apiName: 'classesAPI-prod',
          stage: 'prod',
          label: 'Classes API',
          color: '#c7c7c7',
        },
        {
          typeName: 'APIGateway',
          apiName: 'userPreferences-prod',
          stage: 'prod',
          label: 'User Preferences API',
          color: '#7f7f7f',
        },
      ],
      lambdaNames: [
        'classesAPI-prod',
        'contentfuldirect-prod',
        'contentfulmaps-prod',
        'libcal-gateway-prod',
        'aleph-gateway-prod',
        'illiad-gateway-prod',
        'primo-gateway-prod',
        'userPreferences-prod',
      ]
    });

    new CloudfrontDashboard(this, "CDNDashboard", {
      dashboardName: "Library-Website-HTTP-CDN",
      distributionId: "E1560Z89H1UDHK",
      start,
      headerName: "HTTP CDN",
      desc: [
        "",
        "Usurper is the single page application that is the front end for the library website. ",
        "",
        "* This originates from an S3 bucket where the page is stored along with javascript, image and CSS assets. ",
        "* There are three redundant nginX servers that have this CloudFront as their source.",
        "",
        "**We are measuring the number of cache misses and the latency when a cache miss occurs relative to this CloudFront.**",
        "",
      ].join("\n"),
    });


    // Filters and maps Latency SLOs to latencyPercentiles expected by ServerlessApiDashboard
    const slosToLatencyPercentiles = (slos: ApiLatencySLO[], apiName: string) => {
      const filteredSlos = slos.filter(
        (slo: ApiLatencySLO) => slo.apiName === apiName && slo.type === 'ApiLatency',
      )
      if(filteredSlos.length === 0)
        return undefined
      return filteredSlos.map(slo => ({ percentile: slo.sloThreshold, threshold: slo.latencyThreshold, thresholdLabel: 'SLO'}))
    }

    new ServerlessApiDashboard(this, "ContentAPIDashboard", {
      dashboardName: "Library-Website-Content-API",
      start,
      headerName: "Content API",
      apiName: "contentfuldirect-prod",
      stage: "prod",
      desc: [
        "The content API **has seven primary endpoints that interact with the Contentful API** and pass data through to the calling application. This gateway provides the following data:",
        "",
        "* Secure Archive Retention Policy data",
        "* Permanent URL (PURL) data",
        "* Library website content",
      ].join("\n"),
      latencyPercentiles: slosToLatencyPercentiles(slos, "contentfuldirect-prod"),
    });

    new ServerlessApiDashboard(this, "AlephAPIDashboard", {
      dashboardName: "Library-Website-Aleph-Gateway-API",
      start,
      headerName: "Aleph Gateway API",
      headerSize: 3,
      apiName: "aleph-gateway-prod",
      stage: "prod",
      desc: [
        "Proxies requests to the upstream Aleph API (in some cases directly to the Aleph Database) for the Library Website and Primo front ends.",
        "Used by Primo front end to get the record information needed to query the Primo Gateway API for physical location.",
        "Used by the Library Website to:",
        "* Retrieve and update user and item information",
        "* Get checked out items, previously checked out items, and pending requests",
      ].join("\n"),
      latencyPercentiles: slosToLatencyPercentiles(slos, "aleph-gateway-prod"),
    });

    new ServerlessApiDashboard(this, "PrimoAPIDashboard", {
      dashboardName: "Library-Website-Primo-Gateway-API",
      start,
      headerName: "Primo Gateway API",
      headerSize: 2,
      apiName: "primo-gateway-prod",
      stage: "prod",
      desc: [
        "Primo Gateway is primarily used by the Primo front end to get physical location information. It will also be",
        "used by the Library Website front end to get user information from primo including saved searches and favorited items.",
      ].join("\n"),
      latencyPercentiles: slosToLatencyPercentiles(slos, "primo-gateway-prod"),
    });

    new ServerlessApiDashboard(this, "IlliadAPIDashboard", {
      dashboardName: "Library-Website-Illiad-Gateway-API",
      start,
      headerName: "Illiad Gateway API",
      headerSize: 2,
      apiName: "illiad-gateway-prod",
      stage: "prod",
      desc: "Used by Library Website to fetch pending and checked out items from ILLiad APIs.",
      latencyPercentiles: slosToLatencyPercentiles(slos, "illiad-gateway-prod"),
    });

    new ServerlessApiDashboard(this, "LibCalGatewayAPIDashboard", {
      dashboardName: "Library-Website-LibCalGateway-API",
      start,
      headerName: "LibCal Gateway API",
      apiName: "libcal-gateway-prod",
      stage: "prod",
      desc: [
        "The Libcal Gateway API utilizes the Springshare LibCal App to:",
        "",
        "* Provide hours information.",
        "* Manage space/seating information.",
      ].join("\n"),
      latencyPercentiles: slosToLatencyPercentiles(slos, "libcal-gateway-prod"),
    });

    new ServerlessApiDashboard(this, "MapsAPIDashboard", {
      dashboardName: "Library-Website-Maps-API",
      start,
      headerName: "Maps API",
      apiName: "contentfulmaps-prod",
      stage: "prod",
      desc: [
        "The Maps API, which corresponds to the contentful maps service, has **one endpoint that connects to Contentful** This service:",
        "",
        "* Queries Contentful using item record data points to return the correct map URI",
      ].join("\n"),
      latencyPercentiles: slosToLatencyPercentiles(slos, "contentfulmaps-prod"),
    });

    new ServerlessApiDashboard(this, "UserPreferencesAPIDashboard", {
      dashboardName: "Library-Website-UserPreferences-API",
      start,
      headerName: "User Preferences API",
      headerSize: 4,
      apiName: "userPreferences-prod",
      stage: "prod",
      desc: [
        "The User Preference API, which corresponds to the user preferences service, has **five endpoints that interact with a DynamoDB service** This API:",
        "",
        "* Queries for circ history based on user id",
        "* Updates the opt-in circ status for patrons",
        "* Tracks email subscriptions",
        "* Records favorite resources selected by patron",
        "* Maintains the full list of settings for every patron account",
      ].join("\n"),
      latencyPercentiles: slosToLatencyPercentiles(slos, "userPreferences-prod"),
    });

    new ServerlessApiDashboard(this, "ClassesAPIDashboard", {
      dashboardName: "Library-Website-Classes-API",
      start,
      headerName: "Classes API",
      apiName: "classesAPI-prod",
      stage: "prod",
      desc: [
        "The Classes API, which corresponds to the User Preferences service, has **one endpoint that connects to the Reserves system** This service:",
        "",
        "* Queries for course enrollment and reserves based on user id",
      ].join("\n"),
      latencyPercentiles: slosToLatencyPercentiles(slos, "classesAPI-prod"),
    });
  }
}
