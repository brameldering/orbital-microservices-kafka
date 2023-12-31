import React, { ReactNode } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

interface FormContainerProps {
  children: ReactNode;
}

const FormContainer: React.FunctionComponent<FormContainerProps> = ({
  children,
}) => {
  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Grid container justifyContent='center'>
        <Grid item xs={12} sm={10} md={8} lg={6} xl={6}>
          <Card variant='outlined' sx={{ p: 2, borderColor: '#606060' }}>
            <CardContent>{children}</CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
export default FormContainer;
