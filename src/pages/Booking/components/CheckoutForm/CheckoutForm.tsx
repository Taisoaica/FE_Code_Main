// import { Box, Button, Checkbox, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
// import React, { SetStateAction, useEffect, useState } from 'react'
// import styles from './CheckoutForm.module.css'
// import VNPayField from './VNPayField';

// interface CheckoutFormProps {
//     paymentData: { paymentMethod: string, amount: string, orderID: string, orderDetail: string },
//     setPaymentData: (value: SetStateAction<{ paymentMethod: string, amount: string, orderID: string, orderDetail: string }>) => void;
// }

// const CheckoutForm = ({ paymentData, setPaymentData }: CheckoutFormProps) => {
//     const [paymentMethod, setPaymentMethod] = useState<string>('');
//     const [amount, setAmount] = useState<string>('');
//     const [orderID, setOrderID] = useState<string>('');
//     const [orderDetail, setOrderDetail] = useState<string>('Thanh toán dịch vụ khám bệnh');
//     const [showVNPayFields, setShowVNPayFields] = useState(false);
//     const [totalAmount, setTotalAmount] = useState(1200000);


//     const formatCurrency = (amount: number) => {
//         return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
//     };

//     const handleVNPayClick = () => {
//         if (paymentMethod === 'VNPay') {
//             const vnp_TmnCode = 'EJ7ER0OG';
//             const vnp_HashSecret = '6QM5P5RAQA6J49BJUYUIMPOL9PFFBOAD';

//             const data = {
//                 vnp_Version: '2.1.0',
//                 vnp_TmnCode,
//                 vnp_Amount: (totalAmount * 100).toString(),
//                 vnp_Command: 'pay',
//                 vnp_CreateDate: new Date().toISOString().replace(/[-:.TZ]/g, '').substring(0, 14),
//                 vnp_CurrCode: 'VND',
//                 vnp_IpAddr: '127.0.0.1',
//                 vnp_Locale: 'vn',
//                 vnp_OrderInfo: orderDetail,
//                 vnp_ReturnUrl: 'http://localhost:5173/success',
//                 vnp_TxnRef: orderIDQ
//             };

//             const queryString = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');

//             // Generate secure hash
//             const secureHash = hmacSHA512(vnp_HashSecret, queryString);
//             const requestUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?${queryString}&vnp_SecureHash=${secureHash}`;

//             window.location.href = requestUrl;
//         }
//     };

//     const hmacSHA512 = (key: string, data: string) => {
//         const encoder = new TextEncoder();
//         const keyBytes = encoder.encode(key);
//         const dataBytes = encoder.encode(data);
//         return crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-512' }, false, ['sign'])
//             .then(key => crypto.subtle.sign('HMAC', key, dataBytes))
//             .then(signature => {
//                 return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
//             });
//     };

//     const handlePaymentMethodChange = (event: SelectChangeEvent<string>) => {
//         const { value } = event.target;
//         setPaymentMethod(value);
//         setShowVNPayFields(value === 'VNPay');

//         if (value === 'VNPay') {
//             const newOrderID = Math.floor(Math.random() * 1000000).toString();
//             setOrderID(newOrderID);
//             setPaymentData(prev => ({
//                 ...prev,
//                 paymentMethod: value,
//                 orderID: newOrderID,
//                 orderDetail: 'Thanh toán dịch vụ khám bệnh'
//             }));
//             handleVNPayClick();
//         } else {
//             setOrderID('');
//             setPaymentData(prev => ({
//                 ...prev,
//                 paymentMethod: value,
//                 orderID: '',
//             }));
//         }
//     };

//     const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setAmount(event.target.value);
//         setPaymentData(prev => ({
//             ...prev,
//             amount: event.target.value
//         }));
//     };

//     return (
//         <Box className={styles.checkoutContainer}>
//             <Box className={styles.heading}>
//                 Chọn hình thức thanh toán
//             </Box>

//             <Box sx={{ width: '100%' }} className={styles.content}>
//                 <Box className={styles.checkoutContent}>
//                     <FormControl className={styles.paymentMethod}>
//                         <FormLabel sx={{ fontSize: '25px' }}>Hình thức thanh toán</FormLabel>
//                         <FormControlLabel
//                             sx={{
//                                 fontSize: '1.2rem',
//                                 '& .MuiSvgIcon-root': {
//                                     fontSize: 32,
//                                 },
//                             }}
//                             control={<Checkbox
//                                 sx={{
//                                     '&.Mui-checked': {
//                                         color: '#249dec',
//                                     },
//                                     '& svg': {
//                                         fontSize: 24,
//                                     }
//                                 }}
//                                 checked={paymentMethod === 'VNPay'}
//                                 onChange={handlePaymentMethodChange}
//                                 value="VNPay" />}
//                             label="VN Pay"
//                         />
//                         <FormControlLabel
//                             sx={{
//                                 fontSize: '1.2rem',
//                                 '& .MuiSvgIcon-root': {
//                                     fontSize: 32,
//                                 },
//                             }}
//                             control={<Checkbox
//                                 sx={{
//                                     '&.Mui-checked': {
//                                         color: '#249dec',
//                                     },
//                                     '& svg': {
//                                         fontSize: 24,
//                                     }
//                                 }}
//                                 checked={paymentMethod === 'Other'} onChange={handlePaymentMethodChange} value="Other" />}
//                             label="Hình thức khác"
//                         />
//                         {!setPaymentMethod && <FormHelperText error>Vui lòng chọn phương thức thanh toán</FormHelperText>}
//                     </FormControl>

//                     <Box className={styles.paymentInfoBox}>
//                         <Box className={styles.paymentInfoItem}>
//                             <span className={styles.paymentInfoLabel}>Tổng tiền dịch vụ:</span>
//                         </Box>
//                         <Box className={styles.paymentInfoItem}>
//                             <span className={styles.paymentInfoLabel}>Tổng tiền khám:</span>
//                         </Box>
//                         {/* <Box className={styles.paymentInfoItem}>
//                             <span className={styles.paymentInfoLabel}>Phí tiện ích + Phí TGTT:</span>
//                             <span>13.200 VNĐ</span>
//                         </Box> */}
//                         <Box className={styles.paymentInfoItem}>
//                             <span className={styles.paymentInfoLabel}>TỔNG CỘNG:</span>
//                             <span>{formatCurrency(totalAmount)}</span>
//                         </Box>
//                     </Box>
//                     {showVNPayFields && (
//                         <div className={styles.vnpayFields}>
//                             <VNPayField
//                                 paymentData={paymentData}
//                                 setPaymentData={setPaymentData}
//                                 amount={formatCurrency(totalAmount)}
//                                 orderID={orderID}
//                                 orderDetail={orderDetail}
//                                 handleAmountChange={handleAmountChange}
//                             />
//                         </div>
//                     )}
//                 </Box>
//             </Box>
//         </Box>

//     )
// }
// export default CheckoutForm

import { Box, Checkbox, FormControl, FormControlLabel, FormHelperText, FormLabel } from '@mui/material';
import React, { SetStateAction, useState } from 'react';
import styles from './CheckoutForm.module.css';
import VNPayField from './VNPayField';

interface CheckoutFormProps {
    paymentData: { paymentMethod: string, amount: string, orderID: string, orderDetail: string },
    setPaymentData: (value: SetStateAction<{ paymentMethod: string, amount: string, orderID: string, orderDetail: string }>) => void;
}

const CheckoutForm = ({ paymentData, setPaymentData }: CheckoutFormProps) => {
    const [paymentMethod, setPaymentMethod] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [orderID, setOrderID] = useState<string>('');
    const [orderDetail, setOrderDetail] = useState<string>('Thanh toán dịch vụ khám bệnh');
    const [showVNPayFields, setShowVNPayFields] = useState(false);
    const [totalAmount, setTotalAmount] = useState(1200000); // Example amount in VND

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPaymentMethod(value);
        setShowVNPayFields(value === 'VNPay');

        if (value === 'VNPay') {
            const newOrderID = Math.floor(Math.random() * 1000000).toString();
            setOrderID(newOrderID);
            setPaymentData(prev => ({
                ...prev,
                paymentMethod: value,
                orderID: newOrderID,
                orderDetail: 'Thanh toan dich vu kham benh'
            }));
        } else {
            setOrderID('');
            setPaymentData(prev => ({
                ...prev,
                paymentMethod: value,
                orderID: '',
            }));
        }
    };

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(event.target.value);
        setPaymentData(prev => ({
            ...prev,
            amount: event.target.value
        }));
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
                            label="Hình thức khác"
                        />
                        {!paymentMethod && <FormHelperText error>Vui lòng chọn phương thức thanh toán</FormHelperText>}
                    </FormControl>

                    <Box className={styles.paymentInfoBox}>
                        <Box className={styles.paymentInfoItem}>
                            <span className={styles.paymentInfoLabel}>Tổng tiền dịch vụ:</span>
                        </Box>
                        <Box className={styles.paymentInfoItem}>
                            <span className={styles.paymentInfoLabel}>Tổng tiền khám:</span>
                        </Box>
                        <Box className={styles.paymentInfoItem}>
                            <span className={styles.paymentInfoLabel}>TỔNG CỘNG:</span>
                            <span>{formatCurrency(totalAmount)}</span>
                        </Box>
                    </Box>
                    {showVNPayFields && (
                        <div className={styles.vnpayFields}>
                            <VNPayField
                                paymentData={paymentData}
                                setPaymentData={setPaymentData}
                                amount={formatCurrency(totalAmount)}
                                orderID={orderID}
                                orderDetail={orderDetail}
                                handleAmountChange={handleAmountChange}
                            />
                        </div>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default CheckoutForm;
