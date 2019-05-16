export interface IResponse {
  meta: IMetaData;
  data?: any;
}

export interface IMetaData {
  status: number;
  message: string;
  stack?: string;
}
