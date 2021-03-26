export interface IUser {
  connectId: string;
  userName?: string;
}
export interface ICognitoUser extends IUser {
  cognitoId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  userName: string;
  userStatus: string;
  emailVerified: boolean;
  hasOnboarded: string;
  isFirstLogin: string;
  salesforceId?: string;
  pictureUrl?: string | null;
  socialEmail?: string;
  roleIds?: number[];
  isSocialLogin: boolean;
  tenantId: string;
  organizationId?: number;
  emailSignature?: string;
  clientSourcing?: boolean;
}

export interface IUpdateCognitoUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  socialEmail?: string;
  hasOnboarded?: boolean;
  emailVerified?: boolean;
  isFirstLogin?: boolean;
  connectId?: string;
  pictureKey?: string;
  userType?: string;
}
