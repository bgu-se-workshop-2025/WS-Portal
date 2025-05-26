import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Modal,
  IconButton,
  Stack,
} from '@mui/material';
import TransactionView, { TransactionViewProps, getPaymentMethodLabel } from './TransactionView';
import CloseIcon from '@mui/icons-material/Close';

interface TransactionListProps {
  transactions: TransactionViewProps[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionViewProps | null>(null);

  const handleOpen = (transaction: TransactionViewProps) => {
    setSelectedTransaction(transaction);
  };

  const handleClose = () => {
    setSelectedTransaction(null);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Stack spacing={2}>
        {transactions.map((transaction, index) => (
          <Box
            key={index}
            onClick={() => handleOpen(transaction)}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: '#f3f4ff',
              cursor: 'pointer',
              transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out',
              '&:hover': {
                transform: 'translate3d(0, -3px, 0)',
                backgroundColor: '#e0e1fa',
              },
              boxShadow: 1,
            }}
          >
            <Typography variant="subtitle1" fontWeight={500}>
              Buyer: {transaction.buyerName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Date: {new Date(transaction.dateTime).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Payment Method: {getPaymentMethodLabel(transaction.paymentDetails.paymentMethod)}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Modal open={!!selectedTransaction} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute' as const,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          {selectedTransaction && <TransactionView {...selectedTransaction} />}
        </Box>
      </Modal>
    </Box>
  );
};

export default TransactionList;