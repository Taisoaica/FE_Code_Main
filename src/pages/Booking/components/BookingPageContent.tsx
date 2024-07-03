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
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { AppointmentRegistrationModel, createNewCustomerAppointment } from '../../../utils/api/BookingRegister';
import DentistList from './DentistList/DentistList';
import axios from 'axios';

const BookingPageContent = () => {
    const { clinicId } = useParams<{ clinicId: string }>();
    const location = useLocation();
    const clinicName = location.state?.clinicName || '';
    const navigate = useNavigate();
    // ================= Booking information =============================
    const [formData, setFormData]: [BookingInformation, SetBookingInformation] = useState({
        clinic: clinicId || '',
        typeOfBooking: '',
        date: '',
        dentist: '',
        time: { id: '', start: '', end: '', slotId: 0 },
        serviceId: '',
        serviceName: ''
    });

    const [paymentData, setPaymentData]: [PaymentInformation, Dispatch<SetStateAction<PaymentInformation>>] = useState({
        paymentMethod: '',
        amount: '',
        orderID: '',
        orderDetail: '',
    });
    // ================================================================


    const { steps, currentStep, step, isFirstStep, isFinalStep, next, back } = UseMultipleStepForm([
        // <TypeOfBookingForm formData={formData} setFormData={setFormData} onStepComplete={() => next()} />,
        <ServiceList setFormData={setFormData} onStepComplete={() => next()} />,
        <DentistList setFormData={setFormData} onStepComplete={() => next()} />,
        <Calendar
            formData={formData}
            setFormData={setFormData}
            onStepComplete={() => next()}
        />,
        <CheckoutForm paymentData={paymentData} setPaymentData={setPaymentData} />,
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

    const getCurrentDateInGmtPlus7 = () => {
        const currentDate = new Date();


        const gmtPlus7Offset = 7 * 60;
        const gmtPlus7Date = new Date(currentDate.getTime() + (gmtPlus7Offset * 60 * 1000));

        return gmtPlus7Date;
    };

    const getCreateDateInGmtPlus7 = () => {
        const gmtPlus7Date = getCurrentDateInGmtPlus7();

        const year = gmtPlus7Date.getFullYear();
        const month = String(gmtPlus7Date.getMonth() + 1).padStart(2, '0');
        const day = String(gmtPlus7Date.getDate()).padStart(2, '0');
        const hours = String(gmtPlus7Date.getHours()).padStart(2, '0');
        const minutes = String(gmtPlus7Date.getMinutes()).padStart(2, '0');
        const seconds = String(gmtPlus7Date.getSeconds()).padStart(2, '0');

        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    };

    const getExpireDateInGmtPlus7 = () => {
        const gmtPlus7Date = getCurrentDateInGmtPlus7();
        gmtPlus7Date.setMinutes(gmtPlus7Date.getMinutes() + 15);

        const year = gmtPlus7Date.getFullYear();
        const month = String(gmtPlus7Date.getMonth() + 1).padStart(2, '0');
        const day = String(gmtPlus7Date.getDate()).padStart(2, '0');
        const hours = String(gmtPlus7Date.getHours()).padStart(2, '0');
        const minutes = String(gmtPlus7Date.getMinutes()).padStart(2, '0');
        const seconds = String(gmtPlus7Date.getSeconds()).padStart(2, '0');

        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    };

    const handleSubmit = async () => {
        try {
            const customerId = localStorage.getItem('id');
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
                Status: 'booked'
            };

            await createNewCustomerAppointment(payload, navigate, formData, clinicName)
            if (paymentData.paymentMethod === 'VNPay') {
                console.log(paymentData.orderDetail)
                console.log(paymentData.orderID)
                const response = await axios.get('https://localhost:7128/api/payment/paymentUrl', {
                    params: {
                        amount: 1200000,
                        info: paymentData.orderDetail,
                        orderInfo: paymentData.orderID,
                        bookingInfo: JSON.stringify(payload),
                        formData: JSON.stringify(formData),
                        clinicName: clinicName
                    }
                });

                if (response.status === 200) {
                    const { paymentUrl } = response.data;

                    window.location.href = paymentUrl;
                } else {
                    console.error('Failed to generate payment URL');
                }

            } else {
                console.error('Invalid payment method');
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
                <Breadcrumbs separator={<Typography sx={{ color: '#FFFFFF', mx: 1, fontWeight: 'bold' }}>/</Typography>}>
                    <Link underline="hover" href="/" sx={{ fontSize: 22, color: ' #F8F8F8' }}>
                        Trang chủ
                    </Link>
                    <Box sx={{ fontSize: 24, color: ' #F8F8F8' }}>Trang đặt khám</Box>
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
                                <Button variant="text" className={styles.backButton} onClick={handleBack}>
                                    <ArrowBack />
                                    Quay lại
                                </Button>
                            )}
                            {currentStep == 2 && <Button variant="text" className={styles.nextButton} onClick={() => next()}>
                                <ArrowForward />
                                Xác nhận
                            </Button>}
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
