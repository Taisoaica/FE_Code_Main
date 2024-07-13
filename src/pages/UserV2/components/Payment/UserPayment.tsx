import React, { useEffect, useState } from 'react'
import styles from './UserPayment.module.css'
import { getCustomerAppointments, getCustomerPayments, PaymentDetail } from '../../../../utils/api/UserAccountUtils';
import { Button } from 'reactstrap';

interface PaymentCardProps {
    payment: PaymentDetail;
    customerId: string;
    setActiveIndex: (index: number) => void;
    setSource: (index: number) => void;
}


const PaymentCard = ({ payment, setActiveIndex, customerId, setSource }: PaymentCardProps) => {
    const [paymentInfo, setPaymentInfo] = useState<string>('');

    const handleButtonClick = (payment: PaymentDetail) => {
        localStorage.setItem('bookId', payment.info.split(' ').pop());
        localStorage.setItem('paymentId', payment.id);
        setActiveIndex(4);
        setSource(0);
    }

    const formatAmountToVND = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            currencyDisplay: 'symbol',
            minimumFractionDigits: 0,
        }).format(amount);
    }

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

    const getAppointmentInfo = async (paymentInfo) => {
        const appointments = await getCustomerAppointments(customerId)
        const appointmentToDisplay = appointments.find(appointment => appointment.bookId == paymentInfo)
        setPaymentInfo(appointmentToDisplay?.clinicName)
    }

    useEffect(() => {
        const appointmentId = payment.info.split(' ').pop()
        getAppointmentInfo(appointmentId);
    }, [])

    return (
        <div className={styles.paymentCard}>
            <div className={styles.paymentHeader}>
                <h3>Thông tin thanh toán</h3>
            </div>
            <div className={styles.paymentDetails}>
                <p><strong>Thông tin: </strong>Thanh toán lịch hẹn ở phòng khám + {paymentInfo}</p>
                <p><strong>Giá trị: </strong>{formatAmountToVND(payment.amount)}</p>
                <p><strong>Thời gian thực hiện thanh toán: </strong>{formatDateAndTime(payment.createdTime)}</p>
                <Button onClick={() => handleButtonClick(payment)}>Xem chi tiết</Button>
            </div>
        </div>
    )
}

interface UserPaymentProps {
    setActiveIndex: (index: number) => void;
    setSource: (index: number) => void;
}

const UserPayment = ({ setActiveIndex, setSource }: UserPaymentProps) => {
    const [payments, setPayments] = useState<PaymentDetail[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [appointmentsPerPage] = useState(3);

    const id = localStorage.getItem('customerId');

    useEffect(() => {
        const fetchPayments = async () => {
            if (id) {
                try {
                    const payments = await getCustomerPayments(id);
                    if (payments) {
                        setPayments(payments);
                    } else {
                        console.log('Error fetching payments');
                    }
                } catch (error) {
                    console.log('Error fetching payments:', error);
                }
            }
        }
        fetchPayments();
    }, [id]);

    const indexOfLastPayment = currentPage * appointmentsPerPage;
    const indexOfFirstPayment = indexOfLastPayment - appointmentsPerPage;
    const currentPayments = payments.slice(indexOfFirstPayment, indexOfLastPayment);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className={styles.mainContentRightContainer}>
            <h2 className={styles.mainContentMiddleTitleHeading}>Danh sách Thanh toán</h2>
            <div className={styles.mainContentContainerBox}>
                {currentPayments.length > 0 ? (
                    currentPayments.map((payment) => (
                        <PaymentCard key={payment.id} payment={payment} setActiveIndex={setActiveIndex} customerId={id} setSource={setSource}/>
                    ))
                ) : (
                    <p className={styles.noPayments}>Không có thanh toán nào</p>
                )}
                <Pagination
                    appointmentsPerPage={appointmentsPerPage}
                    totalAppointments={payments.length}
                    paginate={paginate}
                    currentPage={currentPage}
                />
            </div>
        </div>
    )
}

interface PaginationProps {
    appointmentsPerPage: number;
    totalAppointments: number;
    paginate: (pageNumber: number) => void;
    currentPage: number;
}

const Pagination = ({ appointmentsPerPage, totalAppointments, paginate, currentPage }: PaginationProps) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalAppointments / appointmentsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className={styles.pagination}>
                {pageNumbers.map(number => (
                    <li key={number} className={currentPage === number ? styles.active : ''}>
                        <a onClick={() => paginate(number)} href="#!">
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default UserPayment