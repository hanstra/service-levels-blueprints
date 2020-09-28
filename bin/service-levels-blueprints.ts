#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LibraryWebsiteServiceLevelsStack } from '../lib/library-website/service-levels-stack';
import { DashboardsStack as LibraryWebsiteDashboardsStack } from '../lib/library-website/dashboards-stack';

const app = new cdk.App();
new LibraryWebsiteDashboardsStack(app, 'dashboards-library-website');
new LibraryWebsiteServiceLevelsStack(app, 'service-levels-library-website');
