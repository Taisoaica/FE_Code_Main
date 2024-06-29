import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { connection_path } from '../../constants/developments';
import { ClinicInfoModel, ClinicToDisplay } from '../interfaces/ClinicRegister/Clinic';

export async function getClinicInformation(id: string): Promise<ClinicInfoModel | null> {
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

export const getAllClinics = async (searchTerm: string, pageSize: number, page: number): Promise<{ content: ClinicToDisplay[], totalCount: number }> => {
    const api_url = `${connection_path.base_url}${connection_path.clinic.get_all_clinic}`;

    try {
        const response: AxiosResponse = await axios.get(api_url, {
            params: {
                search: searchTerm || '',
                page_size: pageSize || 0,
                page: page || 1,
            }
        });

        if (response.status === 200) {
            const clinicsData: ClinicToDisplay[] = response.data.content;
            console.log(clinicsData);
            return {
                content: response.data.content,
                totalCount: response.data.totalCount
            };
        } else {
            throw new Error('Failed to get clinic information');
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching clinics:', error.message);
        }
        throw error;
    }
};