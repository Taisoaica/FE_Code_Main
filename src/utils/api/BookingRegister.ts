import { BookingInformation, BookingRegistrationModel } from "../interfaces/interfaces";
import { connection_path } from "../../constants/developments";
import axios, { AxiosRequestConfig } from "axios";
import { useNavigate } from "react-router-dom";


// export const handleBookingSuccess = async () => {
//     const api_url: string = connection_path.base_url + connection_path.booking.get_cus_booking;
//     const accessToken = localStorage.getItem('accessToken');

//     const configuration = {
//         method: "GET",
//         url: api_url,
//         headers: {
//             'Authorization': `Bearer ${accessToken}`
//         }
//     };

//     await axios(configuration)
//         .then(response => {
//             if (response.status == 200 && response.data.statusCode == 200) {
//                 const userInfo = response.data.content;

//             } else {
//                 console.log("error", response.data);
//             }
//         })
//         .catch(error => {
//             console.log(error);
//         })

// }

// export const handleBookingSuccess = async (): Promise<BookingInformationToSend> => {
//     const api_url: string = connection_path.base_url + connection_path.booking.get_cus_booking;
//     const accessToken = localStorage.getItem('accessToken');

//     const configuration = {
//         method: "GET",
//         url: api_url,
//         headers: {
//             'Authorization': `Bearer ${accessToken}`
//         }
//     };

//     try {
//         const response = await axios(configuration);
//         if (response.status === 200 && response.data.statusCode === 200) {
//             const userInfo = response.data.content;

//             return userInfo;
//         } else {
//             console.error('Error fetching booking info:', response.data);
//             throw new Error('Error fetching booking info');
//         }
//     } catch (error) {
//         console.error('Error fetching booking info:', error);
//         throw error;
//     }
// };


export interface ClinicServiceInfoModel {
    clinicServiceId: string;
    name: string;
    description: string;
    price: number;
    clinicId: number;
    categoryId: number;
    available: boolean;
    removed: boolean;
}

export const handleGetAllService = async (clinicId: number): Promise<ClinicServiceInfoModel[]> => {
    const api_url: string = `${connection_path.base_url}${connection_path.clinic.get_clinic_service}?clinicId=${clinicId}`;
    const config: AxiosRequestConfig = {
        method: 'GET',
        url: api_url,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    };

    try {
        const response = await axios(config);
        if (response.status === 200 && response.data.statusCode === 200) {
            const serviceList: ClinicServiceInfoModel[] = response.data.content;
            return serviceList;
        } else {
            console.error('Error:', response.data);
            throw new Error('Failed to fetch clinic services');
        }
    } catch (error) {
        console.error('Error fetching clinic services:', error);
        throw error;
    }
};

export interface DentistInfoViewModel {
    dentistId: number;
    fullname: string;
    username: string;
    email: string;
    phone: string;
    isActive: boolean;
    joinedDate?: Date | null;
    clinicId?: number | null;
    isOwner: boolean;
}


export const getAllDentist = async (id: string): Promise<DentistInfoViewModel[]> => {
    const api_url: string = `${connection_path.base_url}/booking/available/${id}/dentist`;
    const config: AxiosRequestConfig = {
        method: 'GET',
        url: api_url,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    };

    try {
        const response = await axios(config);
        if (response.status === 200 && response.data.statusCode === 200) {
            const dentistList: DentistInfoViewModel[] = response.data.content;
            return dentistList;
        } else {
            console.error('Error:', response.data);
            throw new Error('Failed to fetch clinic services');
        }
    } catch (error) {
        console.error('Error fetching clinic services:', error);
        throw error;
    }
}

export interface AppointmentRegistrationModel {
    TimeSlotId: string;
    AppointmentType: string;
    AppointmentDate: string; // Use string or Date format as per your requirement
    CustomerId: number;
    DentistId: number;
    ClinicId: number;
    ServiceId: string;
    MaxRecurring: number;
    OriginalAppointment?: string | null; // Use string format for Guid or null
    Status: string;
}

// export const createNewCustomerAppointment = async (appointmentData: AppointmentRegistrationModel): Promise<any> => {
//     const api_url = connection_path.base_url + connection_path.booking.place_book;

//     try {
//         const response = await axios.post(api_url, appointmentData, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
//             }
//         });

//         if (response.status === 201) {
//             console.log('Appointment created successfully:', response.data);
//             return response.data;
//         } else {
//             console.error('Failed to create appointment:', response.data);
//             throw new Error('Failed to create appointment');
//         }
//     } catch (error) {
//         console.error('Error creating appointment:', error);
//         throw error;
//     }
// };

export const createNewCustomerAppointment = async (
    appointmentData: AppointmentRegistrationModel,
    navigate: (path: string, options?: { state?: { bookingInfo: any } }) => void,
    formData: BookingInformation,
    clinicName: string): Promise<any> => {
    const api_url = connection_path.base_url + connection_path.booking.place_book;


    try {
        const response = await axios.post(api_url, appointmentData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (response.status === 201) {

            const bookingInfo = response.data;

            navigate('/success', { state: { bookingInfo, formData, clinicName} });

            return response.data;
        } else {
            console.error('Failed to create appointment:', response.data);
            throw new Error('Failed to create appointment');
        }
    } catch (error) {
        console.error('Error creating appointment:', error);
        throw error;
    }
};
