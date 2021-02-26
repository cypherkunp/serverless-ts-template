import type { AWS } from '@serverless/typescript';

import { helloWorld } from './src/functions';

const serverlessConfiguration: AWS = {
  service: 'serverless-helloworld',
  frameworkVersion: '2',
  useDotenv: true,
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-offline'],
  provider: {
    stage: '${opt:stage}',
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      DEBUG_LAMBDA: 'true',
    },
    lambdaHashingVersion: '20201221',
  },
  functions: { helloWorld },
};

module.exports = serverlessConfiguration;
