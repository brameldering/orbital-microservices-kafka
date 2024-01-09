import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const Loader: React.FC = () => {
  return (
    <CircularProgress
      sx={{
        width: 100,
        height: 100,
        margin: 'auto',
        display: 'block',
      }}
    />
  );
};

export default Loader;
