import React, { ReactNode } from 'react';
import { Box, TableContainer, Table, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Style table to make a black header
// const StyledTable = styled(Table)(({ theme }) => ({
//   '& thead th': {
//     backgroundColor: theme.palette.mode === 'dark' ? '#0a0d16' : 'YOUR_LIGHT_MODE_COLOR',
//     color:  theme.palette.text.primary,
//     fontWeight: 'bold',
//   },
// });

interface FormTableProps {
  children: ReactNode;
}

const FormTable: React.FunctionComponent<FormTableProps> = ({ children }) => {
  const theme = useTheme();
  return (
    <Box sx={{ maxWidth: theme.spacing(100), margin: 'auto' }}>
      <TableContainer component={Paper}>
        <Table aria-label='table' size='small'>
          {children}
        </Table>
      </TableContainer>
    </Box>
  );
};
export default FormTable;
