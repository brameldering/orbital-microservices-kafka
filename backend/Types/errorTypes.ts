export interface IStandardError {
  message: string;
  stack?: string;
}

export interface IExtendedError {
  status: number;
  data: IStandardError;
}
