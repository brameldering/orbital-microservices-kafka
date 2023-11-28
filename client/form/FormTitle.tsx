import React, { ReactNode } from 'react';

interface FormTitleProps {
  children: ReactNode;
}

const FormTitle: React.FunctionComponent<FormTitleProps> = ({ children }) => {
  return <h1 className='mb-3'>{children}</h1>;
};

export default FormTitle;
