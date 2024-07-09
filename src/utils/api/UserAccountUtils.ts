import { IUserAccount } from "../interfaces/User/UserDefinition"
import { connection_path } from "../../constants/developments"
import { checkAuth } from "./AuthenticateUtils";
import axios from "axios";
import { AppointmentViewModelFetch } from "./ClinicOwnerUtils";
import { UserInfoModel } from "./SystemAdminUtils";
import { apiCallWithTokenRefresh } from "./apiCallWithRefreshToken";

export const getUserData = async (): Promise<IUserAccount> => {
    const apiCall = async () => {

        const api_url: string = connection_path.base_url + connection_path.user.customer;

        const config = {
            method: 'GET',
            url: api_url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
            },
        };

        try {
            const response = await axios(config);
            console.log('response:', response)
            if (response.status === 200) {
                const user: IUserAccount = response.data.content;
                console.log('Fetch user data successfully');
                return user;
            } else {
                console.log('Failed to fetch user');
                return {} as IUserAccount;
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            return {} as IUserAccount;
        }
    }
    return await apiCallWithTokenRefresh(apiCall);
}


export const putUserData = async (userData: UserInfoModel) => {
    const apiCall = async () => {
        const api_url: string = `${connection_path.base_url}${connection_path.user.customer_update}`;

        const config = {
            method: "PUT",
            url: api_url,
            data: userData,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
            },
        }

        try {
            const response = await axios(config);
            if (response.status = 200) {
                alert("User updated successfully");
                return response.data;
            } else {
                console.error('Failed to update user data');
            }
        } catch (error) {
            console.error('Error updating user data:', error);
            throw error;
        }
    }
    return await apiCallWithTokenRefresh(apiCall);
};

export const getCustomerAppointments = async (customerId: string, from_date?: Date, to_date?: Date, from_time?: string, to_time?: string, requestOldItems = true, page_size?: number, page_index?: number): Promise<AppointmentViewModelFetch[]> => {
    const apiCall = async () => {
        const api_url: string = connection_path.base_url + connection_path.booking.get_customer_booking.replace(':id', customerId);

        const config = {
            method: 'GET',
            url: api_url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
            },
            params: {
                from_date: from_date ? from_date.toISOString() : undefined,
                to_date: to_date ? to_date.toISOString() : undefined,
                from_time,
                to_time,
                requestOldItems,
                page_size,
                page_index
            }
        }

        // const isAuthenticated = await checkAuth();
        // if (!isAuthenticated) {
        //     console.error('User is not authenticated');
        //     return [];
        // }


        try {
            const response = await axios(config)
            if (response.status == 200) {
                console.log("User appointments");
                return response.data.content;
            } else {
                console.log("Failed to fetch appointment")
                return [];
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    return await apiCallWithTokenRefresh(apiCall);
}