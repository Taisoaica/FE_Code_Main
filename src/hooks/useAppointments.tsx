import React, { useEffect, useState } from 'react'
import { getCustomerAppointments } from '../utils/api/UserAccountUtils'
import { AppointmentViewModelFetch } from '../utils/api/ClinicOwnerUtils'

const useAppointments = () => {
    const [appointments, setAppointments] = useState<AppointmentViewModelFetch[]>([]);

    useEffect(() => {
        const fetchedAppointments = async () => {
            const id = localStorage.getItem('customerId');
            try {
                const fetchedAppointments = await getCustomerAppointments(id);
                if (fetchedAppointments) {
                    setAppointments(fetchedAppointments);
                } else {
                    console.log('Failed to fetch appointments');
                }
            } catch (error) { 
                console.log(error);
            }
        };

        fetchedAppointments();
    }, [])

    return { appointments };
}

export default useAppointments