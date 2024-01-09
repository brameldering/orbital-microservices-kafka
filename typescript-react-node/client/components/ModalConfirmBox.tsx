import React, { ReactNode } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

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
  return (
    <Dialog open={showModal} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{body}</DialogContent>
      <DialogActions>
        <Button color='secondary' onClick={handleClose}>
          No
        </Button>
        <Button color='primary' onClick={handleConfirm}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalConfirmBox;
