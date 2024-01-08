import React, { ReactNode } from 'react';
import { Container, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface FormContainerProps {
  children: ReactNode;
}

const FormContainer: React.FunctionComponent<FormContainerProps> = ({
  children,
}) => {
  const theme = useTheme();
  return (
    <Container maxWidth='sm'>
      <Paper
        elevation={2}
        sx={{ p: theme.spacing(3), maxWidth: theme.spacing(80) }}>
        {children}
      </Paper>
    </Container>
  );
};
export default FormContainer;
