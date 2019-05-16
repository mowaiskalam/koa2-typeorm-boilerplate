import { decode } from 'jsonwebtoken';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import {
  AdminConfirmSignUpRequest,
  AdminDeleteUserRequest,
} from 'aws-sdk/clients/cognitoidentityserviceprovider';

import { AwsCognitoAttributes, SocialAuthenticationTypes } from '../enums/aws';
import { ICognitoUser } from '../interfaces/cognito';
import config from '../../config';
import { getLoggerInstance } from '../utils/logger';

const logger = getLoggerInstance();
const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();

export const fetchUser = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.getUser({ AccessToken: token }, (err: any, user) => {
      if (err) {
        err.isAwsCognito = true;
        return reject(err);
      }
      return resolve(reformatUser(user));
    });
  });
};

export const decodeIdToken = async (token: string): Promise<any> => {
  const decodedIdToken: any = decode(token, { complete: true });
  if (decodedIdToken) {
    return transformIdTokenData(decodedIdToken);
  }
  return null;
};

const transformIdTokenData = (decodedIdToken: any) => {
  const user: any = {
    username: decodedIdToken.payload['cognito:username'],
  };
  Object.keys(decodedIdToken.payload).forEach((key: any) => {
    user[key] = decodedIdToken.payload[key];
  });
  return user;
};

export const forgotPassword = (
  email: string,
): Promise<CognitoIdentityServiceProvider.Types.AdminResetUserPasswordResponse> => {
  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.adminResetUserPassword(
      {
        Username: email,
        UserPoolId: config.aws.cognitoPoolID,
      },
      (err: any, res) => {
        if (err) {
          err.isAwsCognito = true;
          return reject(err);
        }
        return resolve(res);
      },
    );
  });
};

// TODO: will need updated typings
const reformatUser = (cognitoUser: CognitoIdentityServiceProvider.GetUserResponse): any => {
  const user: any = {
    username: cognitoUser.Username,
  };
  cognitoUser.UserAttributes.forEach(attr => {
    user[attr.Name] = attr.Value;
  });
  return user;
};

export const disableUser = (
  username: string,
): Promise<CognitoIdentityServiceProvider.AdminUpdateUserAttributesResponse> => {
  const params: CognitoIdentityServiceProvider.Types.AdminDisableUserRequest = {
    Username: username,
    UserPoolId: config.aws.cognitoPoolID,
  };
  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.adminDisableUser(params, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

export const enableUser = (
  username: string,
): Promise<CognitoIdentityServiceProvider.AdminUpdateUserAttributesResponse> => {
  const params: CognitoIdentityServiceProvider.Types.AdminEnableUserRequest = {
    Username: username,
    UserPoolId: config.aws.cognitoPoolID,
  };
  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.adminEnableUser(params, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

export const findByEmail = (email: string): Promise<ICognitoUser[]> => {
  const params = {
    Filter: `email = \"${email}\"`,
    UserPoolId: config.aws.cognitoPoolID as string,
  };
  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.listUsers(params, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve((result.Users && reformatUsersList(result.Users)) || []);
    });
  });
};

export const findByCognitoId = (id: string): Promise<any> => {
  const params = {
    Filter: `sub = \"${id}\"`,
    UserPoolId: config.aws.cognitoPoolID,
  };
  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.listUsers(params, (err, result) => {
      if (err) {
        return reject(err);
      }

      resolve(result.Users && reformatUsersList(result.Users)[0]);
    });
  });
};

export const adminConfirmSignUp = (username: string): Promise<void> => {
  const params: AdminConfirmSignUpRequest = {
    Username: username,
    UserPoolId: config.aws.cognitoPoolID,
  };
  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.adminConfirmSignUp(params, err => {
      if (err) {
        return reject(err);
      }

      resolve(undefined);
    });
  });
};

export const deleteUserFromCognito = (username: string) => {
  const params: AdminDeleteUserRequest = {
    Username: username,
    UserPoolId: config.aws.cognitoPoolID,
  };
  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.adminDeleteUser(params, err => {
      if (err) {
        return reject(err);
      }

      resolve(undefined);
    });
  });
};

const reformatUsersList = (
  cognitoUsers: CognitoIdentityServiceProvider.Types.UsersListType,
): ICognitoUser[] => {
  const users: ICognitoUser[] = [];
  cognitoUsers.forEach((cognitoUser: CognitoIdentityServiceProvider.Types.UserType) => {
    const user: any = {
      userName: cognitoUser.Username,
      userStatus: cognitoUser.UserStatus,
    };
    if (cognitoUser.Attributes) {
      cognitoUser.Attributes.forEach(attr => {
        if (attr.Name === AwsCognitoAttributes.FIRST_NAME) {
          user.firstName = attr.Value;
        } else if (attr.Name === AwsCognitoAttributes.LAST_NAME) {
          user.lastName = attr.Value;
        } else if (attr.Name === AwsCognitoAttributes.SOCIAL_EMAIL) {
          user.socialEmail = attr.Value;
        } else if (attr.Name === AwsCognitoAttributes.EMAIL) {
          user.email = attr.Value;
        } else if (attr.Name === AwsCognitoAttributes.EMAIL_VERIFIED) {
          user.emailVerified = (attr.Value && attr.Value.toLowerCase() === 'true') || false;
        } else if (attr.Name === AwsCognitoAttributes.CONNECT_USER_ID) {
          user.connectId = attr.Value;
        }
      });
    }
    users.push(user);
  });
  return users;
};

export const getSocialAuthenticationType = (cognitoUserName: string) => {
  if (cognitoUserName.startsWith(SocialAuthenticationTypes.GOOGLE)) {
    return SocialAuthenticationTypes.GOOGLE;
  } else if (cognitoUserName.startsWith(SocialAuthenticationTypes.FACEBOOK)) {
    return SocialAuthenticationTypes.FACEBOOK;
  }
  return null;
};

export const authenticateUser = (USERNAME: string, PASSWORD: string) => {
  const params = {
    AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
    ClientId: config.aws.clientId,
    UserPoolId: config.aws.cognitoPoolID,
    AuthParameters: {
      USERNAME,
      PASSWORD,
    },
  };
  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.adminInitiateAuth(params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.AuthenticationResult);
      }
    });
  });
};
