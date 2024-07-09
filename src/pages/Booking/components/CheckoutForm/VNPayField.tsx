import React, { SetStateAction } from 'react';
import { Box, TextField } from '@mui/material';
import { PaymentModel } from '../../../../utils/api/BookingRegister';

interface VNPayFieldProps {
    paymentData: PaymentModel;
    setPaymentData: (value: SetStateAction<PaymentModel>) => void;
    amount: number;
    orderID: string;
    orderDetail: string;
    handleAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const VNPayField = ({ paymentData, setPaymentData, amount, orderID, orderDetail, handleAmountChange }: VNPayFieldProps) => {
    return (
        <Box>
            <TextField
                label="Số tiền"
                value={amount}
                onChange={handleAmountChange}
                fullWidth
                margin="normal"
                type="number"
                inputProps={{ min: 0 }}
            />
            <TextField
                label="Mã đơn hàng"
                value={orderID}
                fullWidth
                margin="normal"
                InputProps={{
                    readOnly: true,
                }}
            />
            <TextField
                label="Thông tin đơn hàng"
                value={orderDetail}
                fullWidth
                margin="normal"
                InputProps={{
                    readOnly: true,
                }}
            />
        </Box>
    );
};

export default VNPayField;
