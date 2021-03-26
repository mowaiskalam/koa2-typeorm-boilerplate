export enum AwsCognitoAttributes {
  FIRST_NAME = 'given_name',
  LAST_NAME = 'family_name',
  EMAIL = 'email',
  COGNITO_ID = 'sub',
  EMAIL_VERIFIED = 'email_verified',
  USER_STATUS = 'cognito:user_status',
  HAS_ONBOARDED = 'custom:hasOnboarded',
  IS_FIRST_LOGIN = 'custom:isFirstLogin',
  CONNECT_USER_ID = 'custom:connectId',
  // name has been mapped with name because we want to do search on social email
  // which is not possible in custom attributes
  SOCIAL_EMAIL = 'name',
  PICTURE_URL = 'picture',
  USER_TYPE = 'custom:userType',
}

export enum AwsCognitoUserStatus {
  EXTERNAL_PROVIDER = 'EXTERNAL_PROVIDER',
}

export enum SocialAuthenticationTypes {
  GOOGLE = 'Google',
  FACEBOOK = 'Facebook',
}
