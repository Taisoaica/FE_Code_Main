import { Dispatch, SetStateAction, useState } from 'react';
import { Box, Breadcrumbs, Button, Link, Typography } from '@mui/material';
import UseMultipleStepForm from '../../../components/UseMultipleStepForm/UseMultipleStepForm';
import TypeOfBookingForm from './TypeOfBookingForm/TypeOfBookingForm';
import Calendar from './Calendar/Calendar';
import ConfirmationForm from './CofirmationForm/ConfirmationForm';
import CheckoutForm from './CheckoutForm/CheckoutForm';
import ServiceList from './ServicesList/ServiceList';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BookingInformation, SetBookingInformation, PaymentInformation, BookingRegistrationModel } from '../../../utils/interfaces/interfaces';
import styles from './BookingPageContent.module.css';
import { ArrowBack } from '@mui/icons-material';
import { AppointmentRegistrationModel, createNewCustomerAppointment, PaymentModel, createPayment } from '../../../utils/api/BookingRegister';
import DentistList from './DentistList/DentistList';
import HomeIcon from '@mui/icons-material/Home';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { app } from '../../../../firebase';
import { getAllCustomer } from '../../../utils/api/SystemAdminUtils';

const BookingPageContent = () => {
    const { clinicId } = useParams<{ clinicId: string }>();
    const location = useLocation();
    const clinicName = location.state?.clinicName || '';
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState<string>('Other');
    // ================= Booking information =============================
    const [formData, setFormData]: [BookingInformation, SetBookingInformation] = useState({
        clinic: clinicId || '',
        typeOfBooking: '',
        date: '',
        dentist: '',
        time: { id: '', start: '', end: '', slotId: 0 },
        serviceId: '',
        serviceName: '',
        servicePrice: 0,
    });

    const [paymentData, setPaymentData]: [PaymentModel, Dispatch<SetStateAction<PaymentModel>>] = useState({
        appointmentId: '',
        amount: formData.servicePrice,
        orderInfo: '',
        returnUrl: ''
    });

    const handlePaymentMethodChange = (method: string) => {
        setPaymentMethod(method);
    };

    const { steps, currentStep, step, isFirstStep, isFinalStep, next, back } = UseMultipleStepForm([
        <ServiceList setFormData={setFormData} onStepComplete={() => next()} />,
        <DentistList setFormData={setFormData} onStepComplete={() => next()} />,
        <Calendar
            formData={formData}
            setFormData={setFormData}
            onStepComplete={() => next()}
        />,
        <CheckoutForm paymentData={paymentData} setPaymentData={setPaymentData} setPaymentMethodCallback={handlePaymentMethodChange} price={formData.servicePrice}/>,
    ]);

    const handleBack = () => {
        if (currentStep === 1) {
            setFormData(prev => ({ ...prev, typeOfBooking: '' }));
        } else if (currentStep === 2) {
            setFormData(prev => ({ ...prev, dentist: '', dentistName: '' }));
        }
        else if (currentStep === 3) {
            setFormData(prev => ({ ...prev, time: { id: '', start: '', end: '', slotId: 0 }, date: '' }));
        }

        back();
    };

    const handleSubmit = async () => {
        try {
            const customerId = localStorage.getItem('customerId');
            if (!customerId || isNaN(parseInt(customerId))) {
                console.error('Invalid Customer ID');
                return;
            }

            const payload: AppointmentRegistrationModel = {
                TimeSlotId: formData.time.id.toString(),
                AppointmentType: 'treatment',
                AppointmentDate: formData.date,
                CustomerId: parseInt(customerId),
                DentistId: parseInt(formData.dentist),
                ClinicId: parseInt(formData.clinic),
                ServiceId: formData.serviceId || '',
                MaxRecurring: 0,
                OriginalAppointment: null,
                Status: 'pending'
            };

            const response = await createNewCustomerAppointment(payload)

            if (response.success) {
                if (paymentMethod === 'VNPay') {
                    if (response.content.bookId) {
                        const paymentPayload: PaymentModel = {
                            appointmentId: response.content.bookId,
                            orderInfo: `Thanh toan dich vu kham benh ${response.content.bookId}`,
                            returnUrl: 'http://localhost:5173/success'
                        };

                        try {
                            const paymentResponse = await createPayment(paymentPayload);
                            if (paymentResponse && paymentResponse.content) {
                                console.log(paymentResponse)
                                // window.location.href = paymentResponse.content;
                            } else {
                                console.error('Invalid payment response:', paymentResponse);
                            }
                        } catch (paymentError) {
                            console.error('Payment creation failed:', paymentError);
                        }
                    } else {
                        console.error('Unexpected content format:', response.content);
                    }
                } else {
                    try {
                        const paymentResponse = await createPayment(paymentPayload);

                        console.log('Booking successfully');
                    }
                    catch (paymentError) {
                        console.error("Payment creation failed", paymentError);
                    }
                    navigate('/success?paymentMethod=Other&appointmentId=' + response.content.bookId);
                }
            } else if (response && response.statusCode === 400) {
                console.error(response.message);
                alert(response.message);
            } else {
                console.error('Unexpected response format:', response);
            }
        } catch (error) {
            console.error('Failed to create appointment:', error);
        }
    };

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
        <Box className={styles.container}>
            <Box className={styles.breadcrumbsContainer}>
                <Breadcrumbs
                    separator={<Typography sx={{ color: 'rgba(255,255,255,0.7)', mx: 1, fontWeight: 'bold' }}>/</Typography>}
                    sx={{
                        '& .MuiBreadcrumbs-ol': {
                            alignItems: 'center',
                        },
                    }}
                >
                    <Link
                        underline="hover"
                        href="/"
                        sx={{
                            fontSize: 18,
                            color: 'rgba(255,255,255,0.9)',
                            textDecoration: 'none',
                            '&:hover': {
                                color: '#FFFFFF',
                                textDecoration: 'underline',
                            },
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
                        Trang chủ
                    </Link>
                    <Typography
                        sx={{
                            fontSize: 18,
                            color: '#FFFFFF',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <BookmarkIcon sx={{ mr: 0.5, fontSize: 20 }} />
                        Trang đặt khám
                    </Typography>
                </Breadcrumbs>
            </Box>
            <Box className={styles.contentBox}>
                {/* <Box className={`${styles.content} ${currentStep === 2 ? styles.step2 : ''}`}> */}
                <Box className={styles.content} >
                    <Box className={styles.informationTab}>
                        <Box className={styles.informationTabContent}>
                            <Box className={styles.heading}>
                                Thông tin đặt khám
                            </Box>
                            <Box className={styles.body}>
                                <Box><b>Phòng khám:</b> {clinicName || 'Chưa chọn'}</Box>
                                <Box><b>Ngày khám:</b> {formData.date || 'Chưa chọn'}</Box>
                                <Box><b>Bác sĩ:</b> {formData.dentistName || 'Chưa chọn'}</Box>
                                <Box><b>Slot:</b> {formData.time.start && formData.time.end ? `${formatTime(formData.time.start)} - ${formatTime(formData.time.end)}` : 'Chưa chọn'}</Box>
                                <Box><b>Dịch vụ:</b> {formData.serviceName || 'Chưa chọn'}</Box>
                            </Box>
                        </Box>
                        <Box className={`${styles.buttonContainer} ${currentStep === 2 ? styles.step2 : ''}`}>
                            {!isFirstStep && (
                                <Button variant="outlined" className={styles.backButton} onClick={handleBack}>
                                    <ArrowBack />
                                    Quay lại
                                </Button>
                            )}
                            {/* {(currentStep == 3) && <Button variant="outlined" className={styles.nextButton} onClick={() => next()}>
                                <ArrowForward />
                                Xác nhận
                            </Button>} */}
                            {isFinalStep && <Button variant="contained" color="primary" type="submit" onClick={() => handleSubmit()}
                            >Xác nhận</Button>}
                        </Box>
                    </Box>
                    <Box className={styles.formContainer}>
                        {step}
                    </Box>
                </Box>
            </Box>
        </Box >
    );
};

export default BookingPageContent;
