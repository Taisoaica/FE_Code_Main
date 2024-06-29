import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { connection_path } from '../../constants/developments';




export interface ClinicServiceCategoryRegistrationModel {
    Name: string;
}

export interface ClinicServiceCategoryModel {
    id: number;
    name: string;
}

export const addCategory = async (category: ClinicServiceCategoryRegistrationModel): Promise<ClinicServiceCategoryModel[] | string> => {
    const api_url: string = connection_path.base_url + connection_path.admin.register_service;
    const accessToken = localStorage.getItem('accessToken');

    const configuration: AxiosRequestConfig = {
        method: 'POST',
        url: api_url,
        data: category,
        headers: {
            'Authorization': `${accessToken}`,
            'Content-Type': 'application/json' // Set content type as JSON
        }
    };

    try {
        const response: AxiosResponse = await axios(configuration);
        if (response.status === 200) {
            return response.data.content; // Assuming response.data contains the updated list of categories
        } else {
            const errorMessage = `Failed to add category: ${response.statusText}`;
            throw new Error(errorMessage);
        }
    } catch (error: any) {
        let errorMessage = '';
        if (error.response) {
            if (error.response.status === 401) {
                errorMessage = 'Unauthorized: User is not authenticated.';
            } else {
                errorMessage = `HTTP Error ${error.response.status}: ${error.response.statusText}`;
            }
        } else if (error.request) {
            errorMessage = 'Network Error: No response received from the server.';
        } else {
            errorMessage = `Error: ${error.message}`;
        }
        throw new Error(errorMessage);
    }
};


export const getAllCategories = async (): Promise<ClinicServiceCategoryModel[]> => {
    const api_url: string = connection_path.base_url + connection_path.admin.register_service;
    const accessToken = localStorage.getItem('accessToken');

    const configuration: AxiosRequestConfig = {
        method: 'GET',
        url: api_url,
        headers: {
            'Authorization': `${accessToken}`,
            'Content-Type': 'application/json' // Set content type as JSON
        }
    };

    try {
        const response: AxiosResponse = await axios(configuration);
        if (response.status === 200) {
            return response.data.content; // Assuming response.data contains the list of categories
        } else {
            const errorMessage = `Failed to fetch categories: ${response.statusText}`;
            throw new Error(errorMessage);
        }
    } catch (error: any) {
        let errorMessage = '';
        if (error.response) {
            if (error.response.status === 401) {
                errorMessage = 'Unauthorized: User is not authenticated.';
            } else {
                errorMessage = `HTTP Error ${error.response.status}: ${error.response.statusText}`;
            }
        } else if (error.request) {
            errorMessage = 'Network Error: No response received from the server.';
        } else {
            errorMessage = `Error: ${error.message}`;
        }
        throw new Error(errorMessage);
    }
};


export interface ClinicInfoModel {
    id: number;
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    openHour: string; // Assuming TimeOnly is serialized as string
    closeHour: string; // Assuming TimeOnly is serialized as string
    ownerId: number;
    working: boolean;
    status: string;
}

export const getAllClinics = async (page: number = 1): Promise<ClinicInfoModel[] | string> => {
    const api_url: string = `${connection_path.base_url}${connection_path.admin.get_clinics}?page=${page}`;
    const accessToken = localStorage.getItem('accessToken');

    const configuration: AxiosRequestConfig = {
        method: 'GET',
        url: api_url,
        headers: {
            'Authorization': `${accessToken}`,
            'Content-Type': 'application/json' // Set content type as JSON
        }
    };


    try {
        const response: AxiosResponse = await axios(configuration);
        if (response.status === 200) {
            return response.data.content; // Assuming response.data contains the list of clinics
        } else {
            const errorMessage = `Failed to fetch clinics: ${response.statusText}`;
            throw new Error(errorMessage);
        }
    } catch (error: any) {
        let errorMessage = '';
        if (error.response) {
            if (error.response.status === 401) {
                errorMessage = 'Unauthorized: User is not authenticated.';
            } else {
                errorMessage = `HTTP Error ${error.response.status}: ${error.response.statusText}`;
            }
        } else if (error.request) {
            errorMessage = 'Network Error: No response received from the server.';
        } else {
            errorMessage = `Error: ${error.message}`;
        }
        throw new Error(errorMessage);
    }
};


export interface UserInfoModel {
    id: number;
    username: string;
    passwordHash: string;
    salt: string;
    email: string;
    phone: string;
    fullname: string;
    role: string;
    isActive: boolean;
    isRemoved: boolean;
    joinedDate: string; // Assuming joinedDate is serialized as string
    customerId?: number;
    birthdate?: string; // Assuming birthdate is serialized as string
    sex: string;
    insurance: string;
    dentistId?: number;
    clinicId?: number;
    isOwner: boolean;
}

export const getAllUsers = async (): Promise<UserInfoModel[] | string> => {
    const api_url: string = `${connection_path.base_url}${connection_path.admin.get_users}`;
    const accessToken = localStorage.getItem('accessToken');

    const configuration: AxiosRequestConfig = {
        method: 'GET',
        url: api_url,
        headers: {
            'Authorization': `${accessToken}`,
            'Content-Type': 'application/json' // Set content type as JSON
        }
    };

    try {
        const response: AxiosResponse = await axios(configuration);
        if (response.status === 200) {
            return response.data.content; // Assuming response.data contains the list of users
        } else {
            const errorMessage = `Failed to fetch users: ${response.statusText}`;
            throw new Error(errorMessage);
        }
    } catch (error: any) {
        let errorMessage = '';
        if (error.response) {
            if (error.response.status === 401) {
                errorMessage = 'Unauthorized: User is not authenticated.';
            } else {
                errorMessage = `HTTP Error ${error.response.status}: ${error.response.statusText}`;
            }
        } else if (error.request) {
            errorMessage = 'Network Error: No response received from the server.';
        } else {
            errorMessage = `Error: ${error.message}`;
        }
        throw new Error(errorMessage);
    }
};

export const verifyClinicStatus = async (clinicId: number): Promise<any> => {
    const api_url = `${connection_path.base_url}${connection_path.admin.verify_clinic.replace(':id', clinicId.toString())}`;
    const configuration: AxiosRequestConfig = {
        method: 'PUT',
        url: api_url,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json' // Set content type as JSON
        }
    };

    try {
        const response: AxiosResponse = await axios(configuration);

        if (response.status === 200) {
            return response.data; // Assuming response.data contains the updated clinic information
        } else {
            throw new Error(`Failed to verify clinic: ${response.statusText}`);
        }
    } catch (error: any) {
        let errorMessage = '';
        if (error.response) {
            if (error.response.status === 401) {
                errorMessage = 'Unauthorized: User is not authenticated.';
            } else {
                errorMessage = `HTTP Error ${error.response.status}: ${error.response.statusText}`;
            }
        } else if (error.request) {
            errorMessage = 'Network Error: No response received from the server.';
        } else {
            errorMessage = `Error: ${error.message}`;
        }
        throw new Error(errorMessage);
    }
};