import React, { useEffect, useState } from 'react'
import { getCustomerPayments } from '../utils/api/UserAccountUtils'
import { PaymentDetail } from '../utils/api/UserAccountUtils'; 

const usePayments = () => {
    const [payments, setPayments] = useState<PaymentDetail[]>([]);

    useEffect(() => {
        const fetchedPayments = async () => {
            const id = localStorage.getItem('customerId');
            try {
                const fetchedAppointments = await getCustomerPayments(id);
                if (fetchedAppointments) {
                    setPayments(fetchedAppointments);
                } else {
                    console.log('Failed to fetch appointments');
                }
            } catch (error) { 
                console.log(error);
            }
        };

        fetchedPayments();
    }, [])

    return { payments };
}

export default usePayments