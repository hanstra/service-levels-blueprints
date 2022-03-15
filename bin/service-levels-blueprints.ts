#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { LibraryWebsiteServiceLevelsStack } from '../src/library-website/service-levels-stack';
import { DashboardsStack as LibraryWebsiteDashboardsStack } from '../src/library-website/dashboards-stack';

const app = new cdk.App();
new LibraryWebsiteDashboardsStack(app, 'dashboards-library-website');
new LibraryWebsiteServiceLevelsStack(app, 'service-levels-library-website');
