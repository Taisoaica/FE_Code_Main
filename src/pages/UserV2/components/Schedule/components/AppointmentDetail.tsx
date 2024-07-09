import React from 'react'
import { AppointmentViewModelFetch } from '../../../../../utils/api/ClinicOwnerUtils'
import styles from './AppointmentDetail.module.css'
import { createPayment, PaymentModel } from '../../../../../utils/api/BookingRegister';

interface AppointmentDetailProps {
    appointmentId: string;
    appointments: AppointmentViewModelFetch[];
    setActiveIndex: (index: number) => void;
}

const AppointmentDetail: React.FC<AppointmentDetailProps> = ({ appointmentId, appointments, setActiveIndex }) => {
    const appointment = appointments.find(app => app.bookId === appointmentId);


    const getStatusText = (status: string) => {
        switch (status) {
            case 'booked':
                return 'Đã đặt lịch';
            case 'pending':
                return 'Đang chờ xác nhận';
            case 'completed':
                return 'Đã hoàn thành';
            default:
                return status;
        }
    }

    const getAppointmentTypeText = (type: string) => {
        switch (type) {
            case 'treatment':
                return 'Khám chữa trị';
            case 'checkup':
                return 'Khám'
        }
    }

    const formatTime = (timeString: string) => {
        return timeString.slice(0, 5);
    }

    const handlePayment = async () => {
        const paymentPayload: PaymentModel = {
            appointmentId: appointment.bookId,
            amount: appointment.finalFee.toString(),
            orderInfo: `Thanh toán lịch hẹn ${appointment.bookId}`,
            returnUrl: 'http://localhost:5173/success'
        }
        try {
            const response = await createPayment(paymentPayload);
            if (response.status == 200) {
                console.log('Payment success');
            } else {
                console.error('Payment failed:', response);
            }
        } catch (error) { 
            console.log(error);
        }
    }


    if (!appointment) {
        return <div>Không tìm thấy lịch hẹn</div>
    }

    return (
        <div className={styles.mainContentRightContainer}>
            <h2 className={styles.mainContentMiddleTitleHeading}>Chi tiết lịch hẹn</h2>
            <div className={styles.mainContentContainerBox}>
                <div className={styles.appointmentDetails}>
                    <p><strong>Loại:</strong> {getAppointmentTypeText(appointment.appointmentType)}</p>
                    <p><strong>Ngày khám:</strong> {appointment.appointmentDate}</p>
                    <p><strong>Thời gian:</strong> {formatTime(appointment.appointmentTime)} - {formatTime(appointment.expectedEndTime)}</p>
                    <p><strong>Nha sĩ:</strong> {appointment.dentistFullname}</p>
                    <p><strong>Dịch vụ:</strong> {appointment.selectedServiceName}</p>
                    <p><strong>Phòng khám:</strong> {appointment.clinicName}</p>
                    <p><strong>Địa chỉ:</strong> {appointment.clinicAddress}</p>
                    <p><strong>Trạng thái:</strong> {getStatusText(appointment.bookingStatus)}</p>
                    <p><strong>Phí:</strong> {appointment.finalFee.toLocaleString()} VND</p>
                </div>
            </div>
            <div className={styles.buttonContainer}>
                <button className={styles.goBackButton} onClick={() => setActiveIndex(2)}>Trở về</button>
                {appointment.bookingStatus === 'pending' && (
                    <button className={styles.paymentButton} onClick={handlePayment}>Thanh toán</button>
                )}
            </div>
        </div>
    )
}

export default AppointmentDetail