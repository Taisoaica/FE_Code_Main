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
    const [paymentSource, setPaymentSource] = useState<'normal' | 'detail' | null>(null);

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
        const confirmPaymentProcess = async () => {
            const queryParams = new URLSearchParams(location.search);
            const orderInfo = queryParams.get('vnp_OrderInfo') || '';
            const appointmentId = orderInfo.split(' ').pop();

            if (!appointmentId) {
                console.error('No appointmentId found in the orderInfo');
                setIsLoading(false);
                return;
            }

            try {
                const result = await confirmPayment(location.search);
                if (result.success) {
                    console.log('Payment confirmed:', result);

                    const customerId = localStorage.getItem('id');
                    if (customerId) {
                        const appointments = await getCustomerAppointments(customerId);
                        const bookedAppointment = appointments.find(app => app.bookId === appointmentId);

                        if (bookedAppointment) {
                            setAppointment(bookedAppointment);
                            setPaymentSource(bookedAppointment.bookingStatus === 'booked' ? 'normal' : 'detail');
                        } else {
                            console.error('Appointment not found');
                        }
                    } else {
                        console.error('No customer ID found in localStorage');
                    }
                } else {
                    console.error('Payment confirmation failed:', result.message);
                }
            } catch (error) {
                console.error('Error during payment confirmation:', error);
            }
            setIsLoading(false);
        };

        confirmPaymentProcess();
    }, [location.search]);

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
                    {paymentSource === 'normal' ? 'Đặt khám thành công!' : 'Thanh toán thành công!'}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {paymentSource === 'normal'
                        ? 'Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Lịch hẹn của bạn đã được xác nhận.'
                        : 'Cảm ơn bạn đã hoàn tất thanh toán. Lịch hẹn của bạn đã được cập nhật.'}
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