import { BookingRegistrationModel } from "../interfaces/interfaces";
import { connection_path } from "../../constants/developments";
import axios, { AxiosRequestConfig } from "axios";



// export const handleBookingRegister = async (payload: BookingRegistrationModel, navigate: (path: string, state?: any) => void) => {
//     const api_url: string = connection_path.base_url + connection_path.booking.place_book;

//     const configuration = {
//         method: "POST",
//         url: api_url,
//         data: payload,
//         headers: {
//             'Content-Type': 'application/json' 
//         }
//     };

//     await axios(configuration)
//         .then(response => {
//             if (response.status === 200) {
//                 console.log("Booking successful");
//                 navigate('/success', { state: { bookingInfo: payload } });
//             } else {
//                 console.log(response);
//                 alert("Booking failed");
//             }
//         })
//         .catch(error => {
//             alert('Booking failed, please try again later.')
//             console.log(error);
//         })
// };

export const handleBookingSuccess = async () => {
    const api_url: string = connection_path.base_url + connection_path.booking.get_cus_booking;
    const accessToken = localStorage.getItem('accessToken');

    const configuration = {
        method: "GET",
        url: api_url,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    };

    await axios(configuration)
        .then(response => {
            if (response.status == 200 && response.data.statusCode == 200) {
                const userInfo = response.data.content;
                console.log(userInfo);
            } else {
                console.log("error", response.data);
            }
        })
        .catch(error => {
            console.log(error);
        })

}

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
            return serviceList; // Return the fetched service list
        } else {
            console.error('Error:', response.data);
            throw new Error('Failed to fetch clinic services');
        }
    } catch (error) {
        console.error('Error fetching clinic services:', error);
        throw error; // Rethrow the error to be handled by the caller
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

export const createNewCustomerAppointment = async (appointmentData: AppointmentRegistrationModel): Promise<any> => {
    const api_url = connection_path.base_url + connection_path.booking.place_book;

    try {
        const response = await axios.post(api_url, appointmentData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // Add authorization header if required
            }
        });

        if (response.status === 201) {
            console.log('Appointment created successfully:', response.data);
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
