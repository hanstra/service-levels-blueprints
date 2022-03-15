import { Fn, StackProps, Stack } from "aws-cdk-lib";
import {
  SLOAlarms,
  SLOAlarmsDashboard,
  SLOPerformanceDashboard,
} from "@ndlib/ndlib-cdk2";
import { CfnDashboard } from "aws-cdk-lib/aws-cloudwatch";
import * as subs from "aws-cdk-lib/aws-sns-subscriptions";
import { Construct } from "constructs";

export class LibraryWebsiteServiceLevelsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const slos = scope.node.tryGetContext("library-slos");
    const alarmsDash = new SLOAlarmsDashboard(this, "AlarmsDashboard", {
      slos,
      dashboardName: "SLO-Alarms-Library-Website",
    });
    const perfDash = new SLOPerformanceDashboard(this, "PerformanceDashboard", {
      slos,
      dashboardName: "SLO-Performance-Library-Website",
    });

    const alarmsDashboardName = Fn.ref(
      (alarmsDash.node.defaultChild as CfnDashboard).logicalId
    );
    const alarms = new SLOAlarms(this, "Alarms", {
      slos,
      dashboardLink: `https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=Library-Website-Summary`,
      runbookLink:
        "https://github.com/ndlib/TechnologistsPlaybook/tree/master/run-books",
      alarmsDashboardLink: `https://console.aws.amazon.com/cloudwatch/home?region=${
        Stack.of(this).region
      }#dashboards:name=${alarmsDashboardName}`,
    });

    alarms.alarms.forEach(
      (alarm) =>
        (alarm.parentAlarm.alarmDescription +=
          "SLOs: https://docs.google.com/document/d/1-paQMPqATFgUxDyER55Gd1J_JtWS8SWOo_KkWbLnu6w/edit\n")
    );
    const email = scope.node.tryGetContext("duty-officer-email");

    if (email && email !== "") {
      alarms.topics.High.addSubscription(new subs.EmailSubscription(email));
      alarms.topics.Low.addSubscription(new subs.EmailSubscription(email));
    }

    // Can't do this till https://github.com/aws/aws-cdk/pull/7883 is merged and released
    // const text = scope.node.tryGetContext('text');
    // if(text && text !== '')
    //   alarms.topics.High.addSubscription(new subs.SmsSubscription(text));
  }
}
