import React, { useState, ReactNode } from 'react';
import { Alert } from 'react-bootstrap';
import axios, { AxiosResponse } from 'axios';

type THttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

interface IUseRequestProps {
  url: string;
  method: THttpMethod;
  body: {};
  onSuccess: any;
}

interface IUseRequestResponse {
  doRequest: () => Promise<any>;
  errors: React.ReactNode | null;
}

interface ISerializedError {
  message: string;
  field?: string;
}

const useRequest = ({
  url,
  method,
  body,
  onSuccess,
}: IUseRequestProps): IUseRequestResponse => {
  const [errors, setErrors] = useState<ReactNode | null>(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const res: AxiosResponse<any> = await axios[method](url, body);
      if (onSuccess) {
        onSuccess(res.data);
      }
      return res.data;
    } catch (error: any) {
      if (error.response) {
        // Axios error with a response
        if (error.response.data?.errors) {
          setErrors(
            <Alert variant='danger'>
              <ul className='my-0'>
                {error.response.data.errors.map((err: ISerializedError) => (
                  <li key={err.message}>{err.message}</li>
                ))}
              </ul>
            </Alert>
          );
        } else if (error.request) {
          setErrors(<Alert variant='danger'>Network Error</Alert>);
        } else {
          // Other errors
          setErrors(<Alert variant='danger'>{error.message}</Alert>);
        }
      }
    }
  };
  return { doRequest, errors };
};

export default useRequest;
