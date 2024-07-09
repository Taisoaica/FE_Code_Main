import React, { useEffect, useState } from 'react'
import styles from './UserSchedule.module.css'
import { AppointmentViewModelFetch } from '../../../../utils/api/ClinicOwnerUtils';
import { getCustomerAppointments } from '../../../../utils/api/UserAccountUtils';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

interface AppointmentCardProps {
    appointment: AppointmentViewModelFetch;
    setActiveIndex: (index: number) => void;
}

const AppointmentCard = ({ appointment, setActiveIndex }: AppointmentCardProps) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric', })
    }

    const formatTime = (timeString: string) => {
        return timeString.slice(0, 5);
    }

    const handleButtonClick = (appointment: AppointmentViewModelFetch) => {
        localStorage.setItem('bookId', appointment.bookId);
        setActiveIndex(4);
    }

    const statusClass = () => {
        switch (appointment.bookingStatus) {
            case 'booked':
                return styles.booked;
            case 'pending':
                return styles.pending;
            case 'completed':
                return styles.completed;
            default:
                return '';
        }
    }

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

    return (
        <div className={styles.appointmentCard}>
            <div className={styles.appointmentHeader}>
                <h3>{getAppointmentTypeText(appointment.appointmentType)}</h3>
                <span className={`${styles.status} ${statusClass()}`}>{getStatusText(appointment.bookingStatus)}</span>
            </div>
            <div className={styles.appointmentDetails}>
                <p><strong>Ngày:</strong> {formatDate(appointment.appointmentDate)}</p>
                <p><strong>Thời gian bắt đầu:</strong> {formatTime(appointment.appointmentTime)}</p>
                <p><strong>Phòng khám:</strong> {appointment.clinicName}</p>
                <Button onClick={() => handleButtonClick(appointment)}>Xem chi tiết</Button>
            </div>
        </div>
    )
}

interface UserScheduleProps {
    setActiveIndex: (index: number) => void;
}

const UserSchedule = ({ setActiveIndex }: UserScheduleProps) => {
    const [appointments, setAppointments] = useState<AppointmentViewModelFetch[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [appointmentsPerPage] = useState(5);

    const id = JSON.parse(localStorage.getItem('id') || '{}');

    const fetchAppointments = async () => {
        try {
            const appointments = await getCustomerAppointments(id);
            if (appointments) {
                setAppointments(appointments);
            } else {
                console.log('fail to fetch appointments');
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchAppointments();
    }, [])

    const indexOfLastAppointment = currentPage * appointmentsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
    const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className={styles.mainContentRightContainer}>
            <h2 className={styles.mainContentMiddleTitleHeading}>Lịch khám</h2>
            <div className={styles.mainContentContainerBox}>
                {currentAppointments.length > 0 ? (
                    currentAppointments.map((appointment) => (
                        <AppointmentCard key={appointment.bookId} appointment={appointment} setActiveIndex={setActiveIndex} />
                    ))
                ) : (
                    <p className={styles.noAppointments}>No appointments scheduled.</p>
                )}
                <Pagination
                    appointmentsPerPage={appointmentsPerPage}
                    totalAppointments={appointments.length}
                    paginate={paginate}
                    currentPage={currentPage}
                />
            </div>
        </div>
    )
}

const Pagination = ({ appointmentsPerPage, totalAppointments, paginate, currentPage }) => {
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

export default UserSchedule