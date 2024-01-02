import React, { ReactNode } from 'react';
import { Box, TableContainer, Table, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface FormTableProps {
  children: ReactNode;
}

const FormTable: React.FunctionComponent<FormTableProps> = ({ children }) => {
  const theme = useTheme();
  return (
    <Box sx={{ maxWidth: theme.spacing(100), margin: 'auto' }}>
      <TableContainer component={Paper}>
        <Table aria-label='simple table' size='small'>
          {children}
        </Table>
      </TableContainer>
    </Box>
  );
};
export default FormTable;
