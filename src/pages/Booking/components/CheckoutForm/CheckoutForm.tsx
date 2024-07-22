import { Box, Checkbox, FormControl, FormControlLabel, FormHelperText, FormLabel } from '@mui/material';
import React, { SetStateAction, useState } from 'react';
import styles from './CheckoutForm.module.css';
import VNPayField from './VNPayField';
import { PaymentModel } from '../../../../utils/api/BookingRegister';

interface CheckoutFormProps {
    paymentData: PaymentModel;
    setPaymentData: (value: SetStateAction<PaymentModel>) => void;
    setPaymentMethodCallback: (method: string) => void;
    price: number
}

const CheckoutForm = ({ paymentData, setPaymentData, setPaymentMethodCallback, price }: CheckoutFormProps) => {
    const [paymentMethod, setPaymentMethod] = useState<string>('Other');
    const [orderID, setOrderID] = useState<string>(paymentData.appointmentId);
    const [orderDetail, setOrderDetail] = useState<string>(paymentData.orderInfo);
    const [totalAmount, setTotalAmount] = useState(paymentData.amount);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        // setShowVNPayFields(value === 'VNPay');

        if (value === 'VNPay') {
            const newOrderID = Math.floor(Math.random() * 1000000).toString();
            setOrderID(newOrderID);
            setPaymentMethod(value);
            setPaymentData(prev => ({
                ...prev,
                appointmentId: newOrderID,
                orderInfo: 'Thanh toan dich vu kham benh',
                returnUrl: 'https://localhost:7163/api/payment/vnpay/success'
            }));
            setPaymentMethodCallback('VNPay')
        } else {
            setOrderID('');
            setPaymentMethod(value);
            setPaymentMethodCallback('Other')
            setPaymentData(prev => ({
                ...prev,
                appointmentId: '',
                returnUrl: ''
            }));

        }
    };

    return (
        <Box className={styles.checkoutContainer}>
            <Box className={styles.heading}>
                Chọn hình thức thanh toán
            </Box>

            <Box sx={{ width: '100%' }} className={styles.content}>
                <Box className={styles.checkoutContent}>
                    <FormControl className={styles.paymentMethod}>
                        <FormLabel sx={{ fontSize: '25px' }}>Hình thức thanh toán</FormLabel>
                        <FormControlLabel
                            sx={{
                                fontSize: '1.2rem',
                                '& .MuiSvgIcon-root': {
                                    fontSize: 32,
                                },
                            }}
                            control={<Checkbox
                                sx={{
                                    '&.Mui-checked': {
                                        color: '#249dec',
                                    },
                                    '& svg': {
                                        fontSize: 24,
                                    }
                                }}
                                checked={paymentMethod === 'VNPay'}
                                onChange={handlePaymentMethodChange}
                                value="VNPay" />}
                            label="VN Pay"
                        />
                        <FormControlLabel
                            sx={{
                                fontSize: '1.2rem',
                                '& .MuiSvgIcon-root': {
                                    fontSize: 32,
                                },
                            }}
                            control={<Checkbox
                                sx={{
                                    '&.Mui-checked': {
                                        color: '#249dec',
                                    },
                                    '& svg': {
                                        fontSize: 24,
                                    }
                                }}
                                checked={paymentMethod === 'Other'}
                                onChange={handlePaymentMethodChange}
                                value="Other" />}
                            label="Thanh toán tại quầy"
                        />
                        {!paymentMethod && <FormHelperText error>Vui lòng chọn phương thức thanh toán</FormHelperText>}
                    </FormControl>

                    <Box className={styles.paymentInfoBox}>
                        {/* <Box className={styles.paymentInfoItem}>
                            <span className={styles.paymentInfoLabel}>Tổng tiền dịch vụ:</span>
                            <span>{formatCurrency(totalAmount)}</span>
                        </Box>
                        <Box className={styles.paymentInfoItem}>
                            <span className={styles.paymentInfoLabel}>Tổng tiền khám:</span>
                            <span>{formatCurrency(totalAmount)}</span>
                        </Box>
                        <Box className={styles.paymentInfoItem}>
                            <span className={styles.paymentInfoLabel}>TỔNG CỘNG:</span>
                            <span>{formatCurrency(totalAmount)}</span>
                        </Box> */}
                        <Box className={styles.paymentInfoItem}>
                            <span className={styles.paymentInfoLabel}>Tổng tiền dịch vụ:</span>
                            <span>{formatCurrency(price)}</span>
                        </Box>
                        <Box className={styles.paymentInfoItem}>
                            <span className={styles.paymentInfoLabel}>TỔNG CỘNG:</span>
                            <span>{formatCurrency(price)}</span>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>

    );
};

export default CheckoutForm;
