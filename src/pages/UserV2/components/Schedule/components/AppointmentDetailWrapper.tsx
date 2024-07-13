import React from 'react'
import { useParams } from 'react-router-dom';
import AppointmentDetail from './AppointmentDetail';
import useAppointments from '../../../../../hooks/useAppointments';

interface AppointmentDetailWrapperProps {
    setActiveIndex: (index: number) => void;
    source: number
}

const AppointmentDetailWrapper = ({setActiveIndex, source} : AppointmentDetailWrapperProps) => {

    const id = localStorage.getItem('bookId');
    const { appointments } = useAppointments();

    return <AppointmentDetail appointmentId={id} appointments={appointments} setActiveIndex={setActiveIndex} source={source}/>;
}

export default AppointmentDetailWrapper