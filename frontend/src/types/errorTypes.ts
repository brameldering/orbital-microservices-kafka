export interface IErrorDataType {
  message: string;
  stack: string;
}

export interface IErrorType {
  status: number;
  data: IErrorDataType;
}
