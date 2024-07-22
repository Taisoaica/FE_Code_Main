import { IDentistModel, IServiceModel } from './../Interfaces/interfaces';
import { connection_path } from "../../constants/developments";
import axios, { Axios, AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { ClinicToDisplay } from "../interfaces/ClinicRegister/Clinic";
import { ClinicSlotRegistrationModel, Weekdays } from "../interfaces/AdminClinicOwner/Slots";
import { ClinicSlotInfoModel, ClinicSlotUpdateModel } from "../interfaces/ClinicRegister/Clinic";
import { IUserAccount } from "../interfaces/User/UserDefinition";
import { DentistInfoViewModel } from "../interfaces/AdminClinicOwner/DentistAccounts";
import HttpResponseModel from "../interfaces/HttpResponseModel/HttpResponseModel";
import { ClinicServiceInfoModel } from "./BookingRegister";
import { apiCallWithTokenRefresh } from "./apiCallWithRefreshToken";
import { IAPIResponseModel, IServiceCategoryModel, IServiceModel } from "../Interfaces/interfaces";

export const getClinicGeneralInfo = async (clinicId: string): Promise<ClinicToDisplay | null> => {
    const apiCall = async () => {
        const api_url: string = connection_path.base_url + connection_path.clinic.get_clinic_general_info + `${clinicId}`;

        try {
            const response = await axios.get(api_url);

            if (response.status === 200) {
                const data = response.data.content;
                const clinic: ClinicToDisplay = {
                    name: data.name,
                    description: data.description,
                    address: data.address,
                    phone: data.phone,
                    email: data.email,
                    openHour: data.openHour,
                    closeHour: data.closeHour,
                    status: data.status,
                    working: data.working,
                    id: data.id,
                    ownerId: data.ownerId,
                }
                return clinic;
            } else {
                console.log('Failed to get users');
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    return await apiCallWithTokenRefresh(apiCall);
}

export const updateClinicGeneralInfo = async (clinicInfo: ClinicToDisplay): Promise<void> => {
    const apiCall = async () => {
        const api_url = connection_path.base_url + connection_path.clinic.put_clinic_general_info;

        const configuration: AxiosRequestConfig = {
            method: 'PUT',
            url: api_url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            data: JSON.stringify(clinicInfo)
        };

        try {
            const response = await axios(configuration);
            if (response.status === 200) {
                console.log('Clinic info updated successfully:', response.data);
                alert('Clinic info updated successfully');
            } else {
                console.error('Failed to update clinic info:', response.statusText);
                throw new Error(`Failed to update clinic info: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Axios error:', error);
            throw new Error('Failed to update clinic info');
        }
    }
    return await apiCallWithTokenRefresh(apiCall);
}

export const fetchClinicStaff = async (): Promise<DentistInfoViewModel[]> => {
    const apiCall = async () => {
        const api_url = connection_path.base_url + connection_path.clinic.get_clinic_staff;
        const accessToken = localStorage.getItem('accessToken');
        const config: AxiosRequestConfig = {
            method: "GET",
            url: api_url,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        };

        try {
            const response = await axios(config);
            return response.data.content as DentistInfoViewModel[];
        } catch (error) {
            console.error('Error fetching clinic staff:', error);
            return [];
        }
    }
    return apiCallWithTokenRefresh(apiCall);
}

export interface DentistRegistrationModel {
    fullname: string;
    username: string;
    password: string;
    email: string;
}

export const registerDentist = async (dentistInfo: DentistRegistrationModel): Promise<void> => {
    const apiCall = async () => {
        const api_url = connection_path.base_url + connection_path.clinic.register_staff;
        const accessToken = localStorage.getItem('accessToken');

        const configuration: AxiosRequestConfig = {
            method: 'POST',
            url: api_url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            data: JSON.stringify(dentistInfo)
        };

        try {
            const response = await axios(configuration);
            if (response.status == 200) {
                console.log('Dentist registered successfully:', response.data);
            } else {
                console.error('Failed to register dentist:', response.statusText);
                throw new Error(`Failed to register dentist: ${response.statusText}`);
            }
        } catch (error) {
            console.error(error);
            throw new Error('Failed to register dentist');
        }
    }
    return await apiCallWithTokenRefresh(apiCall);
}

export const activateDentist = async (dentistId: number): Promise<HttpResponseModel<any>> => {
    const apiCall = async () => {
        const api_url = connection_path.base_url + connection_path.clinic.active_staff;
        const accessToken = localStorage.getItem('accessToken');
        const configuration: AxiosRequestConfig = {
            method: 'PUT',
            url: api_url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            params: {
                dentistId: dentistId
            }
        }

        try {
            const response = await axios(configuration);
            if (response.status === 200) {
                console.log('Dentist activated successfully:', response.data);
                return response.data;
            } else {
                console.error('Failed to activate dentist:', response.statusText);
                return {} as HttpResponseModel<any>;
            }
        } catch (error) {
            console.error(error);
            return {} as HttpResponseModel<any>;
        }
    }
    return await apiCallWithTokenRefresh(apiCall);
}

export const deactivateDentist = async (dentistId: number): Promise<HttpResponseModel<any>> => {
    const apiCall = async () => {
        const api_url = connection_path.base_url + connection_path.clinic.deactive_staff;
        const accessToken = localStorage.getItem('accessToken');

        const configuration: AxiosRequestConfig = {
            method: 'PUT',
            url: api_url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            params: {
                dentistId: dentistId
            }
        }

        try {
            const response = await axios(configuration);
            if (response.status === 200) {
                console.log('Dentist deactivated successfully:', response.data);
                return response.data;
            } else {
                console.error('Failed to deactivate dentist:', response.statusText);
                return {} as HttpResponseModel<any>;
            }
        } catch (error) {
            return {} as HttpResponseModel<any>;
            console.error('Axios error:', error);
        }
    }
    return await apiCallWithTokenRefresh(apiCall);
}

export const registerSlots = async (
    slot: ClinicSlotRegistrationModel,
): Promise<boolean> => {
    const apiCall = async () => {
        const api_url = connection_path.base_url + connection_path.clinic.post_clinic_schedule;

        const configuration: AxiosRequestConfig = {
            method: "POST",
            url: api_url,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
            data: {
                clinicId: slot.clinicId,
                slotId: slot.clinicSlotId,
                weekday: slot.weekday,
                maxTreatment: slot.maxTreatment,
                maxCheckup: slot.maxCheckup
            }
        };

        try {
            const response = await axios(configuration);
            if (response.status === 200) {
                // alert("Slots registered successfully");
                return true;
            } else {
                // alert("Failed to register slots");
                return false;
            }
        } catch (error) {
            console.error("Axios error:", error);
            return false; // Indicate failure
        }
    }
    return await apiCallWithTokenRefresh(apiCall);
};

export const getAllClinicSlots = async (clinicId: string): Promise<ClinicSlotInfoModel[][]> => {
    // const apiCall = async () => {
    const token = localStorage.getItem('accessToken');
    const api_url = `${connection_path.base_url}${connection_path.clinic.get_clinic_schedule.replace(':id', clinicId)}`;

    try {
        const response = await axios.get<HttpResponseModel<ClinicSlotInfoModel[]>>(
            api_url,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            }
        );

        if (response.status === 200) {
            const responseData = response.data;
            if (responseData.statusCode === 200) {
                if (responseData.content) {
                    const slotsFromAPI = responseData.content;
                    const convertedSlots: ClinicSlotInfoModel[][] = Array.from({ length: 7 }, () => []);
                    slotsFromAPI.forEach((slot) => {
                        const convertedSlot: ClinicSlotInfoModel = {
                            clinicSlotId: slot.clinicSlotId,
                            clinicId: slot.clinicId,
                            maxCheckup: slot.maxCheckup,
                            maxTreatment: slot.maxTreatment,
                            weekday: slot.weekday as Weekdays,
                            slotId: slot.slotId,
                            startTime: slot.startTime,
                            endTime: slot.endTime,
                            status: slot.status,
                        };
                        convertedSlots[slot.weekday].push(convertedSlot);
                    });

                    return convertedSlots;
                } else {
                    return [];
                }
            } else {
                throw new Error(responseData.message || 'Failed to fetch clinic slots');
            }
        } else {
            throw new Error('Failed to fetch clinic slots');
        }
    } catch (error) {
        console.error('Error fetching clinic slots:', error);
        throw error;
    }
    // }
    // return await apiCallWithTokenRefresh(apiCall);
};


export async function updateClinicSlot(slotInfo: ClinicSlotUpdateModel): Promise<boolean> {
    const apiCall = async () => {
        const api_url = connection_path.base_url + connection_path.clinic.put_clinic_schedule;


        const configuration: AxiosRequestConfig = {
            method: "PUT",
            url: api_url,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
            data: {
                slotId: slotInfo.slotId,
                maxTreatement: slotInfo.MaxTreatement,
                maxCheckup: slotInfo.MaxCheckup,
                status: slotInfo.Status
            }
        };

        try {
            const response = await axios(configuration);
            if (response.status === 200) {
                console.log("Slots updated successfully");
                return true;
            } else {
                console.error("Failed to update slots");
                return false;
            }
        } catch (error) {
            console.error("Axios error:", error);
            return true;
        }
    }
    return apiCallWithTokenRefresh(apiCall);
}

export const enableSlot = async (slotId: string, action: string): Promise<void> => {
    const apiCall = async () => {
        const end_point = action === "enable" ? "enable" : "disable";

        const api_url = connection_path.base_url + connection_path.clinic.post_clinic_schedule_status + `${slotId}/${end_point}`;

        const configuration: AxiosRequestConfig = {
            method: "PUT",
            url: api_url,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        };

        try {
            const response = await axios(configuration);
            if (response.status === 200) {
                console.log("Slot enabled successfully");
            } else {
                console.error("Failed to enable slot");
            }
        } catch (error) {
            console.error("Axios error:", error);
        }
    }
    return await apiCallWithTokenRefresh(apiCall);
}

export interface ClinicServiceRegistrationModel {
    serviceCategory: number;
    serviceName: string;
    serviceDescription: string;
    servicePrice: number;
    clinicId: number;
}

export const addClinicService = async (serviceInfo: ClinicServiceRegistrationModel): Promise<void> => {
    // const apiCall = async () => {
    const api_url = `${connection_path.base_url}${connection_path.clinic.post_clinic_service}`;
    const accessToken = localStorage.getItem('accessToken');

    const configuration: AxiosRequestConfig = {
        method: 'POST',
        url: api_url,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(serviceInfo)
    };

    try {
        const response = await axios(configuration);

        if (response.status === 200) {
            const service = response.data.content;
            const serviceId = service.clinicServiceId;
            if (serviceId) {
                await enableClinicService(serviceId);
            }
            alert("Adding service successfully");
        } else {
            console.error('Failed to add service:', response.statusText);
            throw new Error(`Failed to add service: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Axios error:', error);
        throw new Error('Failed to add service');
    }
    // }
    // return apiCallWithTokenRefresh(apiCall);
};

export const enableClinicService = async (serviceId: string): Promise<void> => {
    // const apiCall = async () => {
    const api_url = `${connection_path.base_url}${connection_path.clinic.enable_clinic_service.replace(':id', serviceId)}`;
    const accessToken = localStorage.getItem('accessToken');

    const configuration: AxiosRequestConfig = {
        method: 'PUT',
        url: api_url,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await axios(configuration);
        if (response) {
            console.log('Service enabled successfully:', response.data);
        } else {
            console.log('Failed to enable service:', response);
        }
    } catch (error) {
        console.error('Axios error:', error);
    }
    // }
    // return await apiCallWithTokenRefresh(apiCall);
}

export const updateClinicService = async (serviceInfo: ClinicServiceInfoModel): Promise<void> => {
    const apiCall = async () => {
        const api_url = `${connection_path.base_url}${connection_path.clinic.put_clinic_service}`;

        const configuration: AxiosRequestConfig = {
            method: 'PUT',
            url: api_url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            data: JSON.stringify(serviceInfo)
        };

        try {
            const response = await axios(configuration);
            if (response.status === 200) {
                console.log('Service updated successfully:', response.data);
                alert('Service updated successfully');
            } else {
                console.error('Failed to update service:', response.statusText);
                throw new Error(`Failed to update service: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Axios error:', error);
            throw new Error('Failed to update service');
        }
    }
    return await apiCallWithTokenRefresh(apiCall);
}

export interface AppointmentViewModel {
    appointmentDate: string;
    appointmentFee: number;
    clinicId: number;
    clinicSlotId: string;
    creationTime: string;
    customerId: number;
    cycleCount: number;
    dentistId: number;
    id: string;
    note: string;
    originalAppointment: string | null;
    paymentId: string | null;
    selectedService: string;
    status: string;
    type: string;
    slotStartTime?: string;
    slotEndTime?: string;
}

export interface AppointmentViewModelFetch {
    bookId: string;
    appointmentType: string;
    customerFullName: string;
    dentistFullname: string;
    appointmentTime: string;
    expectedEndTime: string;
    clinicName: string;
    clinicAddress: string;
    clinicPhone: string;
    finalFee: number;
    isRecurring: boolean;
    bookingStatus: string;
    selectedServiceName: string;
    appointmentDate: string;
}

export const getClinicAppointments = async (clinicId: string, from_date?: string, to_date?: string, from_time?: string, to_time?: string, requestOldItems?: boolean, page_size?: number, page_index?: number): Promise<AppointmentViewModel[]> => {
    // const apiCall = async () => {
    const api_url = connection_path.base_url + connection_path.booking.get_clinic_booking.replace(':id', clinicId);
    const configuration: AxiosRequestConfig = {
        method: 'GET',
        url: api_url,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        params: {
            from_date: from_date,
            to_date: to_date,
            from_time: from_time,
            to_time: to_time,
            requestOldItems: requestOldItems,
            page_size: page_size,
            page_index: page_index

        }

    }
    try {
        const response = await axios(configuration);
        if (response.status === 200) {
            return response.data.content;
        } else {
            console.error('Failed to fetch clinic appointments:', response.data);
            return [];
        }
    } catch (error) {
        console.error('Error fetching clinic appointments:', error);
        return [];
    }
    // }
    // return await apiCallWithTokenRefresh(apiCall);
};

export const getClinicAppointmentsWithClinicSlotId = async (clinicId: string, from_date?: Date, to_date?: Date, from_time?: string, to_time?: string, requestOldItems = true, page_size?: number, page_index?: number): Promise<AppointmentViewModel[]> => {
    const api_url = connection_path.base_url + connection_path.booking.get_clinic_booking.replace(':id', clinicId);
    const configuration: AxiosRequestConfig = {
        method: 'GET',
        url: api_url,
        headers: {
            'Content-Type': 'application/json',
        },
        params: {
            fromDate: from_date,
            toDate: to_date,
            fromTime: from_time,
            toTime: to_time,
            requestOldItems: requestOldItems,
            pageSize: page_size,
            pageIndex: page_index

        }
    }

    try {
        const response = await axios(configuration);
        if (response.status === 200) {
            const appointments: AppointmentViewModel[] = response.data.content;
            console.log(appointments);
            return appointments;
        } else {
            console.error('Failed to fetch clinic appointments:', response.data);
            return [];
        }
    } catch (error) {
        console.error('Error fetching clinic appointments:', error);
        return [];
    }
};

export const getDentistInfo = async (): Promise<IDentistModel | null> => {
    const apiCall = async () => {
        const requestconfig: AxiosRequestConfig = {
            baseURL: connection_path.base_url,
            url: connection_path.invoker.get_dentist_invoker,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        };

        const response_data: IDentistModel | null = await axios(requestconfig)
            .then((res: AxiosResponse<IAPIResponseModel<IDentistModel>>) => {
                const data: IDentistModel | null = res.data.content;
                return data;
            })
            .catch((error: unknown) => {
                if (error instanceof AxiosError) {
                    if (error.status == 401) {
                        throw error;
                    }

                    console.error(error.response?.data);
                }

                return null;
            });

        return response_data;
    }
    return apiCallWithTokenRefresh(apiCall);
};

export const getAllCategories = async (): Promise<IServiceCategoryModel[]> => {
    const apiCall = async () => {
        const configuration: AxiosRequestConfig = {
            method: 'GET',
            baseURL: connection_path.base_url,
            url: connection_path.clinic.service_categories,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            }
        };

        const response_data: IServiceCategoryModel[] = await axios(configuration)
            .then((res: AxiosResponse<HttpResponseModel<IServiceCategoryModel[]>>) => {
                const data: IServiceCategoryModel[] = res.data.content!;
                return data;
            })
            .catch((error: unknown) => {
                if (error instanceof AxiosError) {
                    console.error(error.response?.data)
                }

                const data: IServiceCategoryModel[] = [];
                return data;
            });

        return response_data;
    }

    return await apiCallWithTokenRefresh(apiCall);
};

export const getClinicServices = async (clinicId: number): Promise<ClinicServiceInfoModel[]> => {
    const apiCall = async () => {
        const configuration: AxiosRequestConfig = {
            method: 'GET',
            baseURL: connection_path.base_url,
            url: connection_path.clinic.get_clinic_service,
            params: {
                clinicId: clinicId,
            },
            headers: {
                // 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            }
        };

        const response_data: IServiceModel[] = await axios(configuration)
            .then((res: AxiosResponse<IAPIResponseModel<IServiceModel[]>>) => {
                const data: IServiceModel[] = res.data.content!;
                return data;
            })
            .catch((error: unknown) => {
                if (error instanceof AxiosError)
                    console.error(error.response?.data);
                return [];
            });

        return response_data;
    }

    return await apiCallWithTokenRefresh(apiCall);
};

export const getClinicServiceById = async (serviceId: string): Promise<ClinicServiceInfoModel | null> => {
    const apiCall = async () => {
        const configuration: AxiosRequestConfig = {
            method: 'GET',
            baseURL: connection_path.base_url,
            // url: `{connection_path.clinic.get_clinic_service}/${serviceId}`,
            url: connection_path.clinic.get_clinic_service + '/' +`${serviceId}`,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const response_data: IServiceModel | null = await axios(configuration)
            .then((res: AxiosResponse<IAPIResponseModel<IServiceModel>>) => {
                const data: IServiceModel | null = res.data.content;
                return data;
            })
            .catch((error: unknown) => {
                if (error instanceof AxiosError) {
                    if (error.response!.status == 401) {
                        throw error;
                    }
                }

                return {} as IServiceModel;
            });

        return response_data;
    }
    return await apiCallWithTokenRefresh(apiCall);
}
