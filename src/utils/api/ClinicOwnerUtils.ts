import { connection_path } from "../../constants/developments";
import axios, { Axios, AxiosRequestConfig, AxiosResponse } from "axios";
import { ClinicToDisplay } from "../interfaces/ClinicRegister/Clinic";
import { ClinicSlotRegistrationModel, Weekdays } from "../interfaces/AdminClinicOwner/Slots";
import { ClinicSlotInfoModel, ClinicSlotUpdateModel } from "../interfaces/ClinicRegister/Clinic";
import { IUserAccount } from "../interfaces/User/UserDefinition";
import { DentistInfoViewModel } from "../interfaces/AdminClinicOwner/DentistAccounts";
import HttpResponseModel from "../interfaces/HttpResponseModel/HttpResponseModel";
import { ClinicServiceInfoModel } from "./BookingRegister";

export const getClinicGeneralInfo = async (clinicId: string): Promise<ClinicToDisplay | null> => {
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
                id: 0,
                ownerId: 0
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

export const fetchDentistInfo = async (): Promise<HttpResponseModel<DentistInfoViewModel>> => {
    const api_url = connection_path.base_url + connection_path.invoker.get_dentist_invoker;
    const accessToken = localStorage.getItem('accessToken');
    const config: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${accessToken}`  // Include the access token in the Authorization header
        }
    };

    try {
        const response = await axios.get<HttpResponseModel<DentistInfoViewModel>>(api_url, config);
        return response.data;
    } catch (error) {
        console.error('Error fetching dentist info:', error);
        return {
            statusCode: 500,
            message: 'Failed to fetch dentist info',
            detail: '',
        };
    }
};

export const registerSlots = async (
    slot: ClinicSlotRegistrationModel,
): Promise<boolean> => {
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
            console.log("Slots registered successfully");
            return true;
        } else {
            console.error("Failed to register slots");
            return false;
        }
    } catch (error) {
        console.error("Axios error:", error);
        return false; // Indicate failure
    }
};
export const getAllClinicSlots = async (): Promise<ClinicSlotInfoModel[][]> => {
    const clinicId = 1; // Replace with your actual clinic ID or pass it as a parameter
    const token = localStorage.getItem('accessToken');
    const api_url = `${connection_path.base_url}${connection_path.clinic.get_clinic_schedule.replace(':id', clinicId.toString())}`;

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

                    // Initialize a 2D array for each weekday
                    const convertedSlots: ClinicSlotInfoModel[][] = Array.from({ length: 7 }, () => []);

                    // Map API response to ClinicSlotInfoModel format
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
        throw error; // Handle or rethrow the error as needed
    }
};


export async function updateClinicSlot(slotInfo: ClinicSlotUpdateModel): Promise<void> {

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
        } else {
            console.error("Failed to update slots");
        }
    } catch (error) {
        console.error("Axios error:", error);
    }
}

export const enableSlot = async (slotId: string, action: string): Promise<void> => {
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

export interface ClinicServiceRegistrationModel {
    serviceCategory: number;
    serviceName: string;
    serviceDescription: string;
    servicePrice: number;
    clinicId: number;
}

export const addClinicService = async (serviceInfo: ClinicServiceRegistrationModel): Promise<void> => {
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
            console.log('Service added successfully:', response.data);
            // Optionally return response data or handle success scenario
        } else {
            console.error('Failed to add service:', response.statusText);
            throw new Error(`Failed to add service: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Axios error:', error);
        throw new Error('Failed to add service');
    }
};

export const getClinicServices = async (clinicId: number): Promise<ClinicServiceInfoModel[]> => {
    const api_url = `${connection_path.base_url}${connection_path.clinic.get_clinic_service}?clinicId=${clinicId}`;
    const accessToken = localStorage.getItem('accessToken');

    const configuration: AxiosRequestConfig = {
        method: 'GET',
        url: api_url,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response: AxiosResponse = await axios(configuration);
        if (response.status === 200) {
            return response.data.content; // Assuming response.data contains the list of clinic services
        } else {
            throw new Error(`Failed to fetch clinic services: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Axios error:', error);
        throw new Error('Failed to fetch clinic services');
    }
};

export interface AppointmentViewModel {
    BookId: string;
    appointmentType: string;
    CustomerFullName: string;
    DentistFullname: string;
    AppointmentDate: string; // Use string or Date format as per your requirement
    CreationTime: string; // Use string or Date format as per your requirement
    AppointmentTime: string; // Use string or Date format as per your requirement
    ExpectedEndTime: string; // Use string or Date format as per your requirement
    PatientNumber: number;
    ClinicName: string;
    ClinicAddress: string;
    ClinicPhone: string;
    SelectedServiceName: string;
    FinalFee: number;
    IsRecurring: boolean;
    BookingStatus: string;
}

export const getClinicAppointments = async (clinicId: number, from_date?: Date, to_date?: Date, from_time?: string, to_time?: string, requestOldItems = true, page_size?: number, page_index?: number): Promise<AppointmentViewModel[]> => {
    const api_url = connection_path.base_url + connection_path.booking.get_clinic_booking.replace(':id', clinicId.toString());
    console.log('Fetching clinic appointments:', api_url);
    try {
        const response = await axios.get(api_url, {
            params: {
                from_date: from_date?.toISOString(),
                to_date: to_date?.toISOString(),
                from_time,
                to_time,
                requestOldItems,
                page_size,
                page_index
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // Add authorization header if required
            }
        });

        if (response.status === 200) {
            console.log('Clinic appointments fetched successfully:', response.data);
            const appointments: AppointmentViewModel[] = response.data.content; // Assuming content is an array of AppointmentViewModel
            return appointments;
        } else {
            console.error('Failed to fetch clinic appointments:', response.data);
            throw new Error('Failed to fetch clinic appointments');
        }
    } catch (error) {
        console.error('Error fetching clinic appointments:', error);
        throw error;
    }
};
