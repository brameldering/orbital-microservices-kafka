export interface ErrorDataType {
  message: string;
  stack: string;
}

export interface ErrorType {
  status: number;
  data: ErrorDataType;
}
