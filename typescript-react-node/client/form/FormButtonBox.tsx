import React, { ReactNode } from 'react';
import Box, { BoxProps } from '@mui/material/Box';

interface FormButtonBoxProps extends BoxProps {
  children: ReactNode; // You can add more custom props here if needed
}

const FormButtonBox: React.FC<FormButtonBoxProps> = ({
  children,
  ...props
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 2,
        mb: 2,
        ...props.sx, // This allows for additional styling
      }}
      {...props}>
      {children}
    </Box>
  );
};

export default FormButtonBox;
