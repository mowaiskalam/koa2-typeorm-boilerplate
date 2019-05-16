// tslint:disable no-unused-expression
import * as path from 'path';
import * as fs from 'fs';
import * as cognito from '@aws-cdk/aws-cognito';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';
import * as ec2 from '@aws-cdk/aws-ec2';

import config from '../config';

export class Stack extends cdk.Stack {
  private env = config.env;
  private prefix = `${config.prefix}-${config.env}`;
  private lambdaMap: any = {};
  private lambdas = [
    'create-heroes',
  ];
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.createLambdas();
    this.createCognito();
  }

  private async createLambdas() {
    const lambdaDir = path.join(__dirname, '../../lambda/');
    const mainConfigJson = fs.readFileSync(`${lambdaDir}project.${this.env}.json`, {
      encoding: 'utf8',
    });
    const lambdaConfig = JSON.parse(mainConfigJson);
    this.lambdas.forEach((funcName: string, index: number) => {
      const funcDir = `${lambdaDir}functions/${funcName}`;
      const funcConfig = this.getFunctionConfig(lambdaConfig, funcDir);
      const functionName = `${this.prefix}_${funcName}`;
      const functionId = functionName;
      const options: any = {
        functionName,
        role: this.getRoleFromArn(index, lambdaConfig.role),
        memorySize: +funcConfig.memory,
        timeout: cdk.Duration.seconds(+funcConfig.timeout),
        runtime: lambda.Runtime.NODEJS_10_X,
        handler: funcConfig.handler,
        code: lambda.Code.fromAsset(funcDir),
        environment: funcConfig.environment,
      };
      if (funcConfig.vpc) {
        options.securityGroups = funcConfig.vpc.securityGroups.map((item: string, i: number) => {
          return ec2.SecurityGroup.fromSecurityGroupId(this, `${funcName}_Group_${i}`, item);
        });
        options.vpcSubnets = {
          subnets: funcConfig.vpc.subnets,
        };
      }
      this.lambdaMap[functionName] = new lambda.Function(this, functionId, options);
    });
  }

  private createCognito() {
    const newUserPool = new cognito.UserPool(this, this.prefix, {
      userPoolName: this.prefix,
      signInAliases: {
        email: true,
      },
      customAttributes: {
        additionalParams: new cognito.StringAttribute({ minLen: 1, maxLen: 2048, mutable: true }),
      },
      userInvitation: {
        emailSubject: 'Your temporary password',
        emailBody: 'Your username is {username} and temporary password is {####}.',
        smsMessage: 'Your username is {username} and temporary password is {####}.',
      },
    });
  }

  private getFunctionConfig(config: any, funcDir: string) {
    const funcEnvConfig = `${funcDir}/function.${this.env}.json`;
    const funcConfig = `${funcDir}/function.json`;
    let secondaryConfig = null;
    if (fs.existsSync(funcEnvConfig)) {
      secondaryConfig = funcEnvConfig;
    } else if (fs.existsSync(funcConfig)) {
      secondaryConfig = funcConfig;
    }
    if (!secondaryConfig) {
      return config;
    }
    const funcJson = fs.readFileSync(secondaryConfig, { encoding: 'utf8' });
    const { environment, ...restConfig } = JSON.parse(funcJson);
    const updatedConfig = {
      ...config,
      ...restConfig,
    };
    if (environment) {
      updatedConfig.environment = {
        ...config.environment,
        ...environment,
      };
    }
    return updatedConfig;
  }

  private getRoleFromArn(index: number, arn: string) {
    return iam.Role.fromRoleArn(this, `Role${index}`, arn, {
      // Set 'mutable' to 'false' to use the role as-is and prevent adding new
      // policies to it. The default is 'true', which means the role may be
      // modified as part of the deployment.
      mutable: false,
    });
  }
}
