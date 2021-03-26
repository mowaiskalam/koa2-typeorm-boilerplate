#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Stack } from '../lib/stack';

import config from '../config';

const app = new cdk.App();
const stack = new Stack(app, 'Stack', {
  env: {
    region: config.awsRegion,
    account: config.account,
  },
});
