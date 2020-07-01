import * as cdk from '@aws-cdk/core';
import { Dashboard } from '@aws-cdk/aws-cloudwatch';
import { rows as summaryRows } from './summary-widgets';
import { rows as cdnRows } from './cdn-widgets';
import { rows as gatekeeperApiRows } from './gatekeeper-widgets';
import { rows as hoursApiRows } from './hours-widgets';
import { rows as directoryApiRows } from './directory-widgets';
import { rows as mapsApiRows } from './maps-widgets';
import { rows as contentApiRows } from './content-widgets';
import { rows as userPrefsApiRows } from './userprefs-widgets';
import { rows as classesApiRows } from './classes-widgets';

export class DashboardsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const start = "-PT24H";

    // All in one
    new Dashboard(this, 'AllServicesDashboard', {
      dashboardName: 'Library-Website-All-Services',
      start,
      widgets: [
        ...summaryRows,
        ...cdnRows,
        ...contentApiRows,
        ...gatekeeperApiRows,
        ...hoursApiRows,
        ...directoryApiRows,
        ...mapsApiRows,
        ...userPrefsApiRows,
        ...classesApiRows,
      ],
    });

    // Broken out into separate dashboards
    new Dashboard(this, 'SummaryDashboard', {
      dashboardName: 'Library-Website-Summary',
      start,
      widgets: summaryRows,
    });
    new Dashboard(this, 'CDNDashboard', {
      dashboardName: 'Library-Website-HTTP-CDN',
      start,
      widgets: cdnRows,
    });
    new Dashboard(this, 'ContentAPIDashboard', {
      dashboardName: 'Library-Website-Content-API',
      start,
      widgets: contentApiRows,
    });
    new Dashboard(this, 'GatekeeperAPIDashboard', {
      dashboardName: 'Library-Website-Gatekeeper-API',
      start,
      widgets: gatekeeperApiRows,
    });
    new Dashboard(this, 'HoursAPIDashboard', {
      dashboardName: 'Library-Website-Hours-API',
      start,
      widgets: hoursApiRows,
    });
    new Dashboard(this, 'DirectoryAPIDashboard', {
      dashboardName: 'Library-Website-Directory-API',
      start,
      widgets: directoryApiRows,
    });
    new Dashboard(this, 'MapsAPIDashboard', {
      dashboardName: 'Library-Website-Maps-API',
      start,
      widgets: mapsApiRows,
    });
    new Dashboard(this, 'UserPreferencesAPIDashboard', {
      dashboardName: 'Library-Website-UserPreferences-API',
      start,
      widgets: userPrefsApiRows,
    });
    new Dashboard(this, 'ClassesAPIDashboard', {
      dashboardName: 'Library-Website-Classes-API',
      start,
      widgets: classesApiRows,
    });
  }
}