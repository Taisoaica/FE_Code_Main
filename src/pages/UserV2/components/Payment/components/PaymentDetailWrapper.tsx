import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import PaymentDetailInfo from './PaymentDetailInfo';
import usePayments from '../../../../../hooks/usePayments';
import { getCustomerAppointments, PaymentDetail } from '../../../../../utils/api/UserAccountUtils';
import { AppointmentViewModelFetch } from '../../../../../utils/api/ClinicOwnerUtils';

interface PaymentDetailWrapperProps {
    setActiveIndex: (index: number) => void;
}

const AppointmentDetailWrapper = ({ setActiveIndex }: PaymentDetailWrapperProps) => {

    const { payments } = usePayments();
   
    return <PaymentDetailInfo setActiveIndex={setActiveIndex} payments={payments}/>;
}

export default AppointmentDetailWrapper
