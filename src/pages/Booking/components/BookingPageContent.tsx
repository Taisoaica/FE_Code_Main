import { Dispatch, SetStateAction, useState } from 'react';
import { Box, Breadcrumbs, Button, Link, Typography } from '@mui/material';
import UseMultipleStepForm from '../../../components/UseMultipleStepForm/UseMultipleStepForm';
import TypeOfBookingForm from './TypeOfBookingForm/TypeOfBookingForm';
import Calendar from './Calendar/Calendar';
import ConfirmationForm from './CofirmationForm/ConfirmationForm';
import CheckoutForm from './CheckoutForm/CheckoutForm';
import ServiceList from './ServicesList/ServiceList';
import { useNavigate, useParams } from 'react-router-dom';
import { BookingInformation, SetBookingInformation, PaymentInformation, BookingRegistrationModel } from '../../../utils/interfaces/interfaces';
import styles from './BookingPageContent.module.css';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { AppointmentRegistrationModel, createNewCustomerAppointment } from '../../../utils/api/BookingRegister';

import DentistList from './DentistList/DentistList';

const BookingPageContent = () => {
    const { clinicId } = useParams<{ clinicId: string }>();
    const navigator = useNavigate();

    // ================= Booking information =============================
    const [formData, setFormData]: [BookingInformation, SetBookingInformation] = useState({
        clinic: clinicId || '',
        typeOfBooking: '',
        date: '',
        dentist: '2',
        time: { id: '', start: '', end: '', slotId: 0 },
        serviceId: '',
        serviceName: ''
    });

    // const [formData2, setFormData2] = useState<BookingRegistrationModel>({
    //     TimeSlotId: formData.time.slotId.toString(),
    //     AppointmentType: "treatment",
    //     AppointmentDate: formData.date,
    //     CustomerId: 1,
    //     DentistId: parseInt(formData.dentist),
    //     ClinicId: parseInt(formData.clinic),
    //     ServiceId: formData.serviceId ? formData.serviceId : null,
    //     MaxRecurring: 0, 
    //     OriginalAppointment: null,
    //     Status: "booked"
    // });

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
        if (currentStep === 1) { // Type of booking step
            setFormData(prev => ({ ...prev, typeOfBooking: '' }));
        } else if (currentStep === 2) { // TimeSlots, Calendar step 
            setFormData(prev => ({ ...prev, time: { id: '', start: '', end: '', slotId: 0 }, date: '' }));
        }

        back();
    };


    // TimeSlotId: string;
    // AppointmentType: string;
    // AppointmentDate: string; // Use string or Date format as per your requirement
    // CustomerId: number;
    // DentistId: number;
    // ClinicId: number;
    // ServiceId: string;
    // MaxRecurring: number;
    // OriginalAppointment ?: string | null; // Use string format for Guid or null
    // Status: string;

    // // Constants
    // Checkup: string;
    // Treatment: string;


    const payload: AppointmentRegistrationModel = {
        TimeSlotId: formData.time.id.toString(),
        AppointmentType: 'treatment',
        AppointmentDate: formData.date,
        CustomerId: 1, // Assuming a fixed CustomerId for this example
        DentistId: parseInt(formData.dentist),
        ClinicId: parseInt(formData.clinic),
        ServiceId: formData.serviceId || '', // Ensure formData.serviceId is defined or provide a default value
        MaxRecurring: 0, // Assuming no recurrence for this example
        OriginalAppointment: null, // Initially set to null
        Status: 'booked'
    };

    const handleSubmit = async () => {
        try {
            const response = await createNewCustomerAppointment(payload);
            // Handle success response
            console.log('Appointment created:', response);
            // Optionally, navigate to a success page or update UI
        } catch (error) {
            // Handle error
            console.error('Failed to create appointment:', error);
            // Optionally, show an error message to the user
        }
    };


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
                        <Box className={styles.heading}>
                            Thông tin đặt khám
                        </Box>
                        <Box className={styles.informationTabContent}>
                            <Box><b>Phòng khám:</b> {formData.clinic}</Box>
                            <Box><b>Ngày khám:</b> {formData.date}</Box>
                            <Box><b>Slot:</b> {formData.time.start} - {formData.time.end}</Box>
                            <Box><b>Dịch vụ:</b> {formData.serviceName}</Box>
                        </Box>
                    </Box>
                    <Box className={styles.formContainer}>
                        {step}
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
        </Box >
    );
};

export default BookingPageContent;
