import React, { useEffect, useState } from 'react'
import styles from './UserSchedule.module.css'
import { AppointmentViewModelFetch } from '../../../../utils/api/ClinicOwnerUtils';
import { getCustomerAppointments } from '../../../../utils/api/UserAccountUtils';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

interface AppointmentCardProps {
    appointment: AppointmentViewModelFetch;
    setActiveIndex: (index: number) => void;
    setSource: (index: number) => void;
}

const AppointmentCard = ({ appointment, setActiveIndex, setSource }: AppointmentCardProps) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    const formatTime = (timeString: string) => {
        return timeString.slice(0, 5);
    }

    const handleButtonClick = (appointment: AppointmentViewModelFetch) => {
        localStorage.setItem('bookId', appointment.bookId);
        setActiveIndex(4);
        setSource(1);
    }

    const statusClass = () => {
        switch (appointment.bookingStatus) {
            case 'booked':
                return styles.booked;
            case 'pending':
                return styles.pending;
            case 'completed':
                return styles.completed;
            case 'canceled':
                return styles.canceled;
            case 'finished':
                return styles.finished;
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
            case 'canceled':
                return 'Đã hủy';
            case 'finished':
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
                return 'Khám';
            default:
                return '';
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
    setSource: (index: number) => void;
}

const UserSchedule = ({ setActiveIndex, setSource }: UserScheduleProps) => {
    const [appointments, setAppointments] = useState<AppointmentViewModelFetch[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [appointmentsPerPage] = useState(3);
    const [filter, setFilter] = useState('all');
    const [clinicFilter, setClinicFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('closest');
    const [clinics, setClinics] = useState<string[]>([]);

    const id = localStorage.getItem('customerId');

    const fetchAppointments = async () => {
        try {
            const allAppointments = await getCustomerAppointments(id);
            if (allAppointments) {
                setAppointments(allAppointments);

                // Extract unique clinic names for filtering
                const uniqueClinics = [...new Set(allAppointments.map(appointment => appointment.clinicName))];
                setClinics(uniqueClinics);
            } else {
                console.log('fail to fetch appointments');
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(event.target.value);
        setCurrentPage(1);
    }

    const handleClinicChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setClinicFilter(event.target.value);
        setCurrentPage(1);
    }

    const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setDateFilter(event.target.value);
    }

    // const filteredAppointments = filter === 'all'
    //     ? appointments
    //     : appointments.filter(appointment => appointment.bookingStatus === filter);

    const filteredAppointments = appointments
        .filter(appointment => (filter === 'all' || appointment.bookingStatus === filter) &&
            (clinicFilter === 'all' || appointment.clinicName === clinicFilter))
        .sort((a, b) => {
            if (dateFilter === 'closest') {
                return new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime();
            } else if (dateFilter === 'latest') {
                return new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime();
            }
            return 0;
        });

    const indexOfLastAppointment = currentPage * appointmentsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
    const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className={styles.mainContentRightContainer}>
            <h2 className={styles.mainContentMiddleTitleHeading}>Lịch khám</h2>
            <div className={styles.filterContainer}>
                <select value={filter} onChange={handleFilterChange}>
                    <option value="all">Tất cả</option>
                    <option value="pending">Đang chờ xác nhận</option>
                    <option value="booked">Đã đặt lịch</option>
                    <option value="finished">Đã hoàn thành</option>
                    <option value="canceled">Đã hủy</option>
                </select>

                <select value={clinicFilter} onChange={handleClinicChange}>
                    <option value="all">Tất cả phòng khám</option>
                    {clinics.map(clinic => (
                        <option key={clinic} value={clinic}>{clinic}</option>
                    ))}
                </select>
                <select value={dateFilter} onChange={handleDateChange}>
                    <option value="closest">Gần nhất</option>
                    <option value="latest">Mới nhất</option>
                </select>

            </div>
            <div className={styles.mainContentContainerBox}>
                {currentAppointments.length > 0 ? (
                    currentAppointments.map((appointment) => (
                        <AppointmentCard key={appointment.bookId} appointment={appointment} setActiveIndex={setActiveIndex} setSource={setSource} />
                    ))
                ) : (
                    <p className={styles.noAppointments}>Không có lịch hẹn</p>
                )}
                <Pagination
                    appointmentsPerPage={appointmentsPerPage}
                    totalAppointments={filteredAppointments.length}
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

export default UserSchedule;
