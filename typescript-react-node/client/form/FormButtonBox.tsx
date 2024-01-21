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
        justifyContent: 'flex-end',
        mt: 2,
        mb: 2,
        gap: 2, // this provides a gap between the buttons
        ...props.sx, // This allows for additional styling
      }}
      {...props}>
      {children}
    </Box>
  );
};

export default FormButtonBox;
