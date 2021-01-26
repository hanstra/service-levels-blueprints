import * as cdk from "@aws-cdk/core";
import { Dashboard } from "@aws-cdk/aws-cloudwatch";
import { rows as summaryRows } from "./summary-widgets";
import { rows as cdnRows } from "./cdn-widgets";
import { ApiDashboard } from "../api-dashboard";

export class DashboardsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const start = "-PT24H";
    const slos = scope.node.tryGetContext("library-slos");

    new Dashboard(this, "SummaryDashboard", {
      dashboardName: "Library-Website-Summary",
      start,
      widgets: summaryRows,
    });

    new Dashboard(this, "CDNDashboard", {
      dashboardName: "Library-Website-HTTP-CDN",
      start,
      widgets: cdnRows,
    });

    new ApiDashboard(this, "ContentAPIDashboard", {
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
      slos,
    });

    new ApiDashboard(this, "GatekeeperAPIDashboard", {
      dashboardName: "Library-Website-Gatekeeper-API",
      start,
      headerName: "Gatekeeper API",
      apiName: "gatekeeper-prod",
      stage: "prod",
      desc: [
        "The Gatekeeper API has **four primary endpoints** that interact with three upstream services which are:",
        "",
        "* Primo",
        "* Aleph",
        "* ILLiad",
      ].join("\n"),
      slos,
    });

    new ApiDashboard(this, "AlephAPIDashboard", {
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
      slos,
    });

    new ApiDashboard(this, "PrimoAPIDashboard", {
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
      slos,
    });

    new ApiDashboard(this, "IlliadAPIDashboard", {
      dashboardName: "Library-Website-Illiad-Gateway-API",
      start,
      headerName: "Illiad Gateway API",
      headerSize: 2,
      apiName: "illiad-gateway-prod",
      stage: "prod",
      desc:
        "Used by Library Website to fetch pending and checked out items from ILLiad APIs.",
      slos,
    });

    new ApiDashboard(this, "LibCalGatewayAPIDashboard", {
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
      slos,
    });

    new ApiDashboard(this, "DirectoryAPIDashboard", {
      dashboardName: "Library-Website-Directory-API",
      start,
      headerName: "Directory API",
      apiName: "recommendEngine-prod",
      stage: "prod",
      desc: [
        "The Directory API, which corresponds to the User Preferences service, has **one endpoint that connects to the staff directory (Factotum)** This service:",
        "",
        "* Queries for staff information based on netid",
      ].join("\n"),
      slos,
    });

    new ApiDashboard(this, "MapsAPIDashboard", {
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
      slos,
    });

    new ApiDashboard(this, "UserPreferencesAPIDashboard", {
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
      slos,
    });

    new ApiDashboard(this, "ClassesAPIDashboard", {
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
      slos,
    });
  }
}
