import { useState, ReactNode } from 'react';
import axios, { AxiosResponse } from 'axios';

type THttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

interface IUseRequestProps {
  url: string;
  method: THttpMethod;
  onSuccess: any;
}

interface IUseRequestResponse {
  // eslint-disable-next-line no-unused-vars
  doRequest: (props: { body: any }) => Promise<any>;
  error: any | null;
  isProcessing: boolean;
}

const useRequest = ({
  url,
  method,
  onSuccess,
}: IUseRequestProps): IUseRequestResponse => {
  const [error, setError] = useState<ReactNode | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const doRequest = async ({ body }: { body: any }) => {
    try {
      setIsProcessing(true);
      setError(null);
      console.log('doRequest: body: ', body);
      const res: AxiosResponse<any> = await axios[method](url, body);
      if (onSuccess) {
        onSuccess(res.data);
      }
      return res.data;
    } catch (error: any) {
      setError(error);
    } finally {
      setIsProcessing(false);
    }
  };
  return { doRequest, isProcessing, error };
};

export default useRequest;
