import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import axios from 'axios';

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const res = await axios[method](url, body);
      if (onSuccess) {
        onSuccess(res.data);
      }
      return res.data;
    } catch (error) {
      setErrors(
        <Alert variant='danger'>
          <ul className='my-0'>
            {error.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </Alert>
      );
    }
  };
  return { doRequest, errors };
};
