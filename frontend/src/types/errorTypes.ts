export interface IError {
  status: number;
  message: string;
  stack?: string;
}

export type IStandardError = {
  message: string;
  stack?: string;
};

export type IErrorWithStatusAndData = {
  status: number;
  data: IStandardError;
};
