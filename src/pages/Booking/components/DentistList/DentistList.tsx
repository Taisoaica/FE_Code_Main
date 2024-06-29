import React, { useState, useEffect } from 'react';
import styles from './DentistList.module.css';
import { SetBookingInformation } from '../../../../utils/interfaces/interfaces';
import { getAllDentist, DentistInfoViewModel } from '../../../../utils/api/BookingRegister';

interface DentistListProps {
    setFormData: SetBookingInformation;
    onStepComplete: () => void;
}

const DentistList = ({ setFormData, onStepComplete }: DentistListProps) => {
    const [dentistList, setDentistList] = useState<DentistInfoViewModel[]>([]);

    useEffect(() => {
        const fetchDentists = async () => {
            try {
                const dentists = await getAllDentist('1');
                setDentistList(dentists);
            } catch (error) {
                console.error('Error fetching dentists:', error);
                // Handle error fetching data
            }
        };

        fetchDentists();
    }, []);

    const handleDentistClick = (dentistId: number) => {
        const selectedDentist = dentistList.find(dentist => dentist.dentistId === dentistId);
        if (selectedDentist) {
            setFormData(prevState => ({
                ...prevState,
                dentist: selectedDentist.dentistId.toString(),
                dentistName: selectedDentist.fullname,
            }));
            onStepComplete();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.headingBox}>
                <div className={styles.heading}>Chọn Nha Sĩ</div>
            </div>
            <div className={styles.contentBox}>
                <div className={styles.list}>
                    {dentistList.map((dentist) => (
                        <div key={dentist.dentistId} className={styles.item} onClick={() => handleDentistClick(dentist.dentistId)}>
                            <div className={styles.dentistName}>{dentist.fullname}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DentistList;
