import React, { ReactNode } from 'react';
import Typography from '@mui/material/Typography';

interface FormTitleProps {
  children: ReactNode;
}

const FormTitle: React.FunctionComponent<FormTitleProps> = ({ children }) => {
  return (
    <Typography variant='h3' sx={{ mb: 3 }}>
      {children}
    </Typography>
  );
};

export default FormTitle;
