export interface IError {
  status: string | number;
  message: string;
  stack?: string;
}

export type IStandardError = {
  message: string;
  stack?: string;
};

export type IErrorWithStatusAndErrorString = {
  status: string | number;
  error: string;
};

export type IErrorWithStatusAndData = {
  status: number;
  data: IStandardError;
};
