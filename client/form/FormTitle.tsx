import React, { ReactNode } from 'react';

interface FormTitleProps {
  children: ReactNode;
}

const FormTitle: React.FunctionComponent<FormTitleProps> = ({ children }) => {
  return <h2 className='mb-3'>{children}</h2>;
};

export default FormTitle;
