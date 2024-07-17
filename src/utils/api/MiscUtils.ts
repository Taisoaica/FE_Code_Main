import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { connection_path } from '../../constants/developments';
import { ClinicInfoModel, ClinicToDisplay } from '../interfaces/ClinicRegister/Clinic';
import { apiCallWithTokenRefresh } from './apiCallWithRefreshToken';

export async function getClinicInformation(id: string): Promise<ClinicInfoModel | null> {
    const apiCall = async () => {
        const api_url = connection_path.base_url + connection_path.clinic.get_clinic_general_info + id;
        const configuration: AxiosRequestConfig = {
            method: 'GET',
            url: api_url,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json' // Set content type as JSON
            }
        }
        try {
            const response: AxiosResponse = await axios(configuration);
            if (response.status === 200) {
                return response.data.content as ClinicInfoModel;
            }
            return null; // Handle non-200 status codes if needed
        } catch (error) {
            console.error('Error fetching clinic information:', error);
            return null;
        }
    }
    return await apiCallWithTokenRefresh(apiCall);
}

export const getAllClinics = async (
    searchTerm: string,
    pageSize: number,
    page: number,
    open?: string,
    close?: string
): Promise<{ content: ClinicToDisplay[], totalCount: number }> => {
    const apiCall = async () => {
        const api_url = `${connection_path.base_url}${connection_path.clinic.get_all_clinic}`;

        try {
            const response: AxiosResponse = await axios.get(api_url, {
                params: {
                    name: searchTerm || '',
                    open: open || '',
                    close: close || '',
                    page_size: pageSize || 100,
                    page: page || 1
                }
            });

            if (response.status === 200) {
                return {
                    content: response.data.content,
                    totalCount: response.data.totalCount
                };
            } else if (response.status === 400) {
                throw new Error('Failed to get clinic information');
                // navigator('error')
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error fetching clinics:', error.message);
            }
            throw error;
        }
    }
    return await apiCallWithTokenRefresh(apiCall);
};


export const cancelAppointment = async (appointmentId: string): Promise<void> => {
    const api_url = 'https://localhost:7163/cancel';
    const accessToken = localStorage.getItem('accessToken'); 
    const configuration: AxiosRequestConfig = {
        method: 'PUT', 
        url: api_url, 
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${accessToken}`, 
        },
        params: {
            book_id: appointmentId, 
        },
    };

    try {
        const response = await axios(configuration);
        if (response.status === 200) {
            alert('Appointment cancelled successfully.');
        } else {
            console.error(`Error cancelling appointment: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error cancelling appointment:', error);
    }
};
