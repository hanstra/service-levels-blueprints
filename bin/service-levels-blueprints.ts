#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LibraryWebsiteServiceLevelsStack } from '../lib/library-website-service-levels-stack';
import { MarbleServiceLevelsStack } from '../lib/marble-service-levels-stack';

const app = new cdk.App();
new LibraryWebsiteServiceLevelsStack(app, 'service-levels-library-website');
new MarbleServiceLevelsStack(app, 'service-levels-marble');
