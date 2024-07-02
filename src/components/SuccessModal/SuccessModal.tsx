import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import styles from './SuccessModal.module.css'; // Import CSS Module

interface SuccessModalProps {
  open: boolean;
  handleClose: () => void;
  message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ open, handleClose, message }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box className={styles.modalContent}>
        <Typography variant="h6" className={styles.title}>
          Success
        </Typography>
        <Typography variant="body1" className={styles.message}>
          {message}
        </Typography>
        <Button onClick={handleClose} variant="contained" color="primary" className={styles.button}>
          OK
        </Button>
      </Box>
    </Modal>
  );
};

export default SuccessModal;