import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const Footer: React.FunctionComponent = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <Container>
        <Grid container>
          <Grid item xs={12} className='text-center py-3'>
            <Typography variant='body1'>
              Orbitelco Shop &copy; {currentYear}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
