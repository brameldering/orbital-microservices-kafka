import React, { ReactNode } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { secondaryButtonStyles } from 'styles/theme';

interface ModalConfirmBoxProps {
  showModal: boolean;
  title: string;
  body: ReactNode;
  handleClose: () => void;
  handleConfirm: () => void;
}

const ModalConfirmBox: React.FC<ModalConfirmBoxProps> = ({
  showModal,
  title,
  body,
  handleClose,
  handleConfirm,
}) => {
  const theme = useTheme();
  return (
    <Dialog open={showModal} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{body}</DialogContent>
      <DialogActions>
        <Button
          id='BUTTON_modal_yes'
          variant='outlined'
          color='primary'
          onClick={handleConfirm}>
          Yes
        </Button>
        <Button
          id='BUTTON_modal_cancel'
          variant='outlined'
          color='primary'
          sx={{ ...secondaryButtonStyles(theme) }}
          onClick={handleClose}>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalConfirmBox;
