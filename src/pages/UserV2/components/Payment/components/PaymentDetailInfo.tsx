import React, { useEffect, useState } from 'react'
import { AppointmentViewModelFetch } from '../../../../../utils/api/ClinicOwnerUtils'
import styles from './PaymentDetail.module.css'
import { getCustomerAppointments, PaymentDetail } from '../../../../../utils/api/UserAccountUtils';

interface PaymentDetailProps {
    setActiveIndex: (index: number) => void;
    payments: PaymentDetail[] | null;
}

const PaymentDetailInfo: React.FC<PaymentDetailProps> = ({ setActiveIndex, payments }: PaymentDetailProps) => {
    const [payment, setPayment] = useState<PaymentDetail>();
    const [appointment, setAppointment] = useState<AppointmentViewModelFetch>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const appointmentId = localStorage.getItem('bookId');
    const paymentId = localStorage.getItem('paymentId');
    const customerId = localStorage.getItem('customerId');

    const formatDateAndTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }) + ` lúc ${date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        })}`;
    }

    const formatAmountToVND = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            currencyDisplay: 'symbol',
            minimumFractionDigits: 0,
        }).format(amount);
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const appointments = await getCustomerAppointments(customerId);
                if (appointments) {
                    const appointment = appointments.find(app => app.bookId = appointmentId);
                    setAppointment(appointment);
                }
                if (payments) {
                    const payment = payments.find(pay => pay.id = paymentId);
                    setPayment(payment);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [payments])

    console.log(payments);
    console.log(appointment);
    console.log(payment)

    // if (isLoading) {
    //     return <div className={styles.loadingState}>Đang tải thông tin...</div>;
    // }

    return (
        <div className={styles.mainContentRightContainer}>
            <h2 className={styles.mainContentMiddleTitleHeading}>Chi tiết thanh toán</h2>
            <div className={styles.mainContentContainerBox}>
                <div className={styles.paymentDetails}>
                    <p><strong>Thông tin:</strong> Thanh toán lịch hẹn ở phòng khám {appointment.clinicName}</p>
                    <p><strong>Giá trị:</strong> {formatAmountToVND(payment.amount)}</p>
                    <p><strong>Thời gian thực hiện thanh toán:</strong> {formatDateAndTime(payment.createdTime)}</p>
                    <p><strong>Ngày hẹn:</strong> {appointment.bookingDate}</p>
                    <p><strong>Giờ hẹn:</strong> {appointment.bookingTime}</p>
                    <p><strong>Trạng thái lịch hẹn:</strong> {appointment.bookingStatus}</p>
                </div>
            </div>
            <div className={styles.buttonContainer}>
                <button className={styles.goBackButton} onClick={() => setActiveIndex(1)}>Trở về</button>
            </div>
        </div>
    )
}

export default PaymentDetailInfo