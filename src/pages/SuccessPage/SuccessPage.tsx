import React, { useEffect, useState } from 'react';
import UserLayout from '../../components/UserLayout';
import { Box, Typography, Button, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookingInformation } from '../../utils/interfaces/interfaces';
import axios from 'axios';
import HmacSHA512 from 'crypto-js/hmac-sha512';
import encHex from 'crypto-js/enc-hex';

interface LocationState {
    bookingInfo: any;
    formData: BookingInformation;
    clinicName: string;
}

const SuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(window.location.search);
    const vnp_SecureHash = queryParams.get('vnp_SecureHash');
    const bookingInfoString = queryParams.get('bookingInfo');
    const formDataString = queryParams.get('formData');
    const clinicName = queryParams.get('clinicName');

    const bookingInfo = bookingInfoString ? JSON.parse(bookingInfoString) : null;
    const formData: BookingInformation = formDataString ? JSON.parse(formDataString) : null;

    const [isValid, setIsValid] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPaymentStatus = async () => {
            try {
                const queryParams = new URLSearchParams(window.location.search);
                const vnp_SecureHash = queryParams.get('vnp_SecureHash');
                console.log(vnp_SecureHash, 'secure hash')
                const secretKey = '6QM5P5RAQA6J49BJUYUIMPOL9PFFBOAD';

                const secureHashData = new URLSearchParams(window.location.search)
                    .toString()
                    .replace(`&vnp_SecureHash=${vnp_SecureHash}`, '');

                // const secureHash = HmacSHA512(secureHashData, secretKey)
                //     .toString(encHex)

                const secureHash = HmacSHA512(secureHashData, secretKey)
                    .toString(encHex)
                
                console.log(secureHash, 'computed secure hash')

                if (secureHash === vnp_SecureHash) {
                    const queryParamsObj = Object.fromEntries(queryParams.entries());
                    console.log(queryParamsObj)
                    const response = await axios.get('https://localhost:7128/api/payment/payment/confirm', { params: queryParamsObj });

                    if (response.status === 200) {
                        const { Message, ErrorCode } = response.data;

                        console.log(response.data)
                        if (ErrorCode === '00') {
                            setMessage(Message);
                            setIsValid(true);
                        } else {
                            setMessage(`Thanh toán không thành công. Mã lỗi: ${ErrorCode}`);
                        }
                    } else {
                        setMessage('Xác nhận thanh toán không thành công.');
                    }
                } else {
                    setMessage('Mã bảo mật không hợp lệ.');
                }
            } catch (error) {
                console.error('Failed to confirm payment:', error);
                setMessage('Xác nhận thanh toán không thành công.');
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentStatus();
    }, []);



    function formatTime(time: string): string {
        if (!time || !time.includes(':')) {
            return '';
        }

        const [hours, minutes] = time.split(':');

        if (isNaN(Number(hours)) || isNaN(Number(minutes))) {
            return '';
        }

        return `${hours}:${minutes}`;
    }

    return (
        <UserLayout>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    padding: '20px',
                    textAlign: 'center'
                }}
            >
                {/* {isValid ? ( */}
                    <>
                        <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                        <Typography variant="h4" component="h1" gutterBottom>
                            Đặt khám thành công!
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Lịch hẹn của bạn đã được xác nhận.
                        </Typography>

                        <Paper elevation={3} sx={{ padding: 2, marginTop: 3, width: '100%', maxWidth: 700, textAlign: 'left' }}>
                            <Typography variant="h6" component="h2" gutterBottom sx={{ textAlign: 'center' }}>
                                Chi tiết lịch hẹn của bạn:
                            </Typography>
                            <Typography>
                                <strong>Ngày:</strong> {bookingInfo?.content.appointmentDate}
                            </Typography>
                            <Typography>
                                <strong>Slot:</strong> {formData?.time?.start && formData?.time?.end ? `${formatTime(formData.time.start)} - ${formatTime(formData.time.end)}` : 'N/A'}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Nha sĩ:</strong> {formData?.dentistName}
                            </Typography>
                            <Typography>
                                <strong>Hình thức khám:</strong> {bookingInfo?.type === 'treatment' ? 'Khám' : 'Chữa'}
                            </Typography>
                            <Typography>
                                <strong>Dịch vụ:</strong> {formData?.serviceName}
                            </Typography>
                        </Paper>

                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 4 }}
                            onClick={() => navigate('/')}
                        >
                            Trở về trang chủ
                        </Button>
                    </>
                {/* ) : (
                    <Typography variant="h6" component="h2" gutterBottom>
                        Thanh toán không thành công. Vui lòng thử lại.
                    </Typography>
                )} */}
            </Box>
        </UserLayout>
    );
};

export default SuccessPage;
