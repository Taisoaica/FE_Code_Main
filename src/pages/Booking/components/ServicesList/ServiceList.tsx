import React, { useEffect, useState } from 'react'
import { clinicServices } from '../../../../utils/mockData'
import styles from './ServiceList.module.css'
import { SetBookingInformation } from '../../../../utils/interfaces/interfaces';
import { ClinicServiceInfoModel, handleGetAllService } from '../../../../utils/api/BookingRegister';
import { useParams } from 'react-router-dom';

interface ServiceListProps {
    setFormData: SetBookingInformation,
    onStepComplete: () => void,
}

const ServiceList = ({ setFormData, onStepComplete }: ServiceListProps) => {
    const [clinicServices, setClinicServices] = useState<ClinicServiceInfoModel[]>([]);
    const { clinicId } = useParams<{ clinicId?: string }>(); 
   
    useEffect(() => {
        const fetchServices = async () => {
            try {
                if (clinicId) {
                    const parsedClinicId = parseInt(clinicId, 10);
                    const services = await handleGetAllService(parsedClinicId);
                    setClinicServices(services);
                }
            } catch (error) {
                console.error('Failed to fetch clinic services:', error);
            }
        };

        fetchServices();
    }, []);

    const handleServiceClick = (serviceId: string) => {
        setFormData(prevState => ({
            ...prevState,
            serviceId: serviceId,
            serviceName: clinicServices.find(service => service.clinicServiceId === serviceId)?.name || '',
            servicePrice: clinicServices.find(service => service.clinicServiceId === serviceId)?.price || 0
        }));
        onStepComplete();
    };

    return (
        <div className={styles.container}>
            <div className={styles.headingBox}>
                <div className={styles.heading}>Chọn dịch vụ khám</div>
            </div>
            <div className={styles.contentBox}>
                {/* <div className={styles.toolbar}>
                    <div className={styles.searchbar}>
                        <input type="text" placeholder="Tìm kiếm dịch vụ" className={styles.searchInput} />
                    </div>
                </div> */}
                <div className={styles.list}>
                    {clinicServices.map((service) => (
                        <div key={service.clinicServiceId} className={styles.item} onClick={() => handleServiceClick(service.clinicServiceId)}>
                            {service.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ServiceList