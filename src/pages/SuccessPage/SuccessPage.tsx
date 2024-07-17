import React, { useEffect, useState } from 'react';
import UserLayout from '../../components/UserLayout';
import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate, useLocation } from 'react-router-dom';
import { confirmPayment } from '../../utils/api/BookingRegister';
import { getCustomerAppointments } from '../../utils/api/UserAccountUtils';
import { AppointmentViewModelFetch } from '../../utils/api/ClinicOwnerUtils';

const SuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [appointment, setAppointment] = useState<AppointmentViewModelFetch | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [queryId, setQueryId] = useState<string>('');
    const [paymentSource, setPaymentSource] = useState<'vnpay' | 'other'>('other');
    const [message, setMessage] = useState('');


    const getAppointmentTypeText = (type: string) => {
        switch (type) {
            case 'treatment':
                return 'Khám chữa trị';
            case 'checkup':
                return 'Khám'
            default:
                return type;
        }
    }

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


    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const paymentMethod = queryParams.get('paymentMethod');
        const isVnPayPayment = queryParams.has('vnp_TransactionStatus');

        if (isVnPayPayment) {
            setMessage('Thanh toán và đặt lịch thành công!');
            setPaymentSource('vnpay');
        } else if (paymentMethod === 'Other') {
            setMessage('Đặt lịch thành công!');
            setPaymentSource('other');
        }
    }, [location.search]);

    useEffect(() => {
        const confirmPaymentProcess = async () => {
            const queryParams = new URLSearchParams(location.search);
            if (paymentSource == 'vnpay') {
                const orderInfo = queryParams.get('vnp_OrderInfo');
                const appointmentIdFromOrderInfo = orderInfo.split(' ').pop();
                setQueryId(appointmentIdFromOrderInfo);
            } else {
                const appointmentId = queryParams.get('appointmentId');
            
                setQueryId(appointmentId);
            }

            try {
                if (queryParams.has('vnp_TransactionStatus')) {
                    // Handle VNPay specific logic here
                    const result = await confirmPayment(location.search);
                    if (result.success) {
                        console.log('Payment confirmed:', result);

                        const customerId = localStorage.getItem('customerId');
                        if (customerId) {
                            const appointments = await getCustomerAppointments(customerId);
                            const bookedAppointment = appointments.find(app => app.bookId === queryId);

                            if (bookedAppointment) {
                                setAppointment(bookedAppointment);
                            } else {
                                console.error('Appointment not found');
                            }
                        } else {
                            console.error('No customer ID found in localStorage');
                        }
                    } else {
                        console.error('Payment confirmation failed:', result.message);
                    }
                } else {
                    console.log('Other payment method detected, skipping payment confirmation.');
                    const customerId = localStorage.getItem('customerId');
                    if (customerId) {
                        const appointments = await getCustomerAppointments(customerId);
                        const bookedAppointment = appointments.find(app => app.bookId === queryId);

                        if (bookedAppointment) {
                            setAppointment(bookedAppointment);
                            setPaymentSource('other');
                        } else {
                            console.error('Appointment not found');
                        }
                    } else {
                        console.error('No customer ID found in localStorage');
                    }
                }
            } catch (error) {
                console.error('Error during payment confirmation:', error);
            }
            setIsLoading(false);
        };

        confirmPaymentProcess();
    }, [location.search, queryId]);

    if (isLoading) {
        return (
            <UserLayout>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            </UserLayout>
        );
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
                <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                <Typography variant="h4" component="h1" gutterBottom>
                    {/* {paymentSource === 'normal' ? 'Đặt khám thành công!' : 'Thanh toán thành công!'} */}
                    {message}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {paymentSource === 'vnpay'
                        ? 'Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Lịch hẹn của bạn đã được xác nhận.'
                        : 'Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Hãy xác nhận thanh toán ở phòng khám.'}
                </Typography>

                {appointment ? (
                    <Paper elevation={3} sx={{ padding: 2, marginTop: 3, width: '100%', maxWidth: 700, textAlign: 'left' }}>
                        <Typography variant="h6" component="h2" gutterBottom sx={{ textAlign: 'center' }}>
                            Chi tiết lịch hẹn của bạn:
                        </Typography>
                        <Typography>
                            <strong>Ngày:</strong> {appointment.appointmentDate}
                        </Typography>
                        <Typography>
                            <strong>Slot:</strong> {`${formatTime(appointment.appointmentTime)} - ${formatTime(appointment.expectedEndTime)}`}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Nha sĩ:</strong> {appointment.dentistFullname}
                        </Typography>
                        <Typography>
                            <strong>Hình thức khám:</strong> {getAppointmentTypeText(appointment.appointmentType)}
                        </Typography>
                        <Typography>
                            <strong>Dịch vụ:</strong> {appointment.selectedServiceName}
                        </Typography>
                    </Paper>
                ) : (
                    <Typography variant="body1" gutterBottom color="error">
                        Không thể tải thông tin lịch hẹn. Vui lòng kiểm tra trong mục "Lịch hẹn của tôi".
                    </Typography>
                )}

                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 4 }}
                    onClick={() => navigate('/')}
                >
                    Trở về trang chủ
                </Button>
            </Box>
        </UserLayout>
    );
};

export default SuccessPage;