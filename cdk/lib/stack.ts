// tslint:disable no-unused-expression
import * as cognito from '@aws-cdk/aws-cognito';
import * as cdk from '@aws-cdk/core';

import config from '../config';

export class Stack extends cdk.Stack {
  private prefix = `${config.prefix}-${config.env}`;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.createCognito();
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
}
