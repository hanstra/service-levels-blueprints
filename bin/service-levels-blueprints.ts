#!/usr/bin/env node
import 'source-map-support/register';
import { App, Aspects } from 'aws-cdk-lib';
import { StackTags } from "@ndlib/ndlib-cdk2";
import { LibraryWebsiteServiceLevelsStack } from '../src/library-website/service-levels-stack';
import { DashboardsStack as LibraryWebsiteDashboardsStack } from '../src/library-website/dashboards-stack';

const app = new App();
new LibraryWebsiteDashboardsStack(app, 'dashboards-library-website');
new LibraryWebsiteServiceLevelsStack(app, 'service-levels-library-website');
Aspects.of(app).add(new StackTags())