import React from 'react'
import { useParams } from 'react-router-dom';
import AppointmentDetail from './AppointmentDetail';
import useAppointments from '../../../../../hooks/useAppointments';

interface AppointmentDetailWrapperProps {
    setActiveIndex: (index: number) => void;
}

const AppointmentDetailWrapper = ({setActiveIndex} : AppointmentDetailWrapperProps) => {

    const id = localStorage.getItem('bookId');
    const { appointments } = useAppointments();

    return <AppointmentDetail appointmentId={id} appointments={appointments} setActiveIndex={setActiveIndex}/>;
}

export default AppointmentDetailWrapper