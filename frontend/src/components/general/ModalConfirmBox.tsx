import React, { ReactNode } from 'react';
import { Button, Modal } from 'react-bootstrap';

interface ModalConfirmBoxProps {
  showModal: boolean;
  title: string;
  body: ReactNode;
  handleClose: () => void;
  handleConfirm: () => void;
}

const ModalConfirmBox: React.FunctionComponent<ModalConfirmBoxProps> = ({
  showModal,
  title,
  body,
  handleClose,
  handleConfirm,
}) => {
  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          No
        </Button>
        <Button variant='primary' onClick={handleConfirm}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalConfirmBox;
