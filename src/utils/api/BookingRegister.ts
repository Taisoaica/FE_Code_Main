import { PaymentModel } from './BookingRegister';
import { APIResponseModel, BookingInformation, BookingRegistrationModel, IAPIResponseModel, IPaymentModel } from "../interfaces/interfaces";
import { connection_path } from "../../constants/developments";
import axios, { AxiosRequestConfig } from "axios";
import { useNavigate } from "react-router-dom";
import { apiCallWithTokenRefresh } from "./apiCallWithRefreshToken";
import { refreshAccessToken } from "./AuthenticateUtils";
import { AppointmentViewModel } from './ClinicOwnerUtils';

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
    const apiCall = async () => {
        const api_url: string = `${connection_path.base_url}${connection_path.clinic.get_clinic_service}?clinicId=${clinicId}`;
        const config: AxiosRequestConfig = {
            method: 'GET',
            url: api_url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        };
        const response = await axios(config);
        if (response.status === 200 && response.data.statusCode === 200) {
            return response.data.content;
        } else {
            throw new Error('Failed to fetch clinic services');
        }
    };

    return await apiCallWithTokenRefresh(apiCall);
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
    // const apiCall = async () => {
    const api_url: string = `${connection_path.base_url}/booking/available/${id}/dentist`;
    const config: AxiosRequestConfig = {
        method: 'GET',
        url: api_url,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    };
    const response = await axios(config);
    if (response.status === 200 && response.data.statusCode === 200) {
        return response.data.content;
    } else {
        throw new Error('Failed to fetch clinic services');
    }
    // };
    // return await apiCallWithTokenRefresh(apiCall);
}

export interface AppointmentRegistrationModel {
    TimeSlotId: string;
    AppointmentType: string;
    AppointmentDate: string;
    CustomerId: number;
    DentistId: number;
    ClinicId: number;
    ServiceId: string;
    MaxRecurring: number;
    OriginalAppointment?: string | null;
    Status: string;
}


export const createNewCustomerAppointment = async (
    appointmentData: AppointmentRegistrationModel
): Promise<APIResponseModel<AppointmentViewModel>> => {
    const api_url = connection_path.base_url + connection_path.booking.place_book;

    try {
        const response = await axios.post(api_url, appointmentData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (response.status === 201) {
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


export interface PaymentModel {
    appointmentId: string;
    orderInfo: string;
    returnUrl: string;
}

export const createPayment = async (paymentData: PaymentModel): Promise<any> => {
    const api_url = connection_path.base_url + connection_path.booking.create_payment;

    const config: AxiosRequestConfig = {
        method: 'POST',
        url: api_url,
        headers: {
            'Content-Type': 'application/json',
        },
        data: paymentData
    }
    try {
        const response = await axios(config);
        console.log('Payment response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating payment:', error);
        throw error;
    }
}

export const confirmPayment = async (paymentData: string): Promise<any> => {
    const api_url = connection_path.base_url + connection_path.booking.confirm_payment + paymentData;

    const config: AxiosRequestConfig = {
        method: 'GET',
        url: api_url,
        headers: {
            'Content-Type': 'application/json',
        }
    }

    try {
        const response = await axios(config);
        if (response.status === 200) {
            return response.data;
        } else {
            console.error('Failed to confirm payment:', response.data);
        }
    } catch (error) {
        console.error('Error confirming payment:', error);
    }
}

export const CreateCashPayment = async(paymentData: PaymentModel): Promise<IAPIResponseModel<IPaymentModel>> => {
    
}