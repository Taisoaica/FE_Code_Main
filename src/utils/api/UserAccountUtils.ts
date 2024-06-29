import { IUserAccount } from "../interfaces/User/UserDefinition"
import { connection_path } from "../../constants/developments"
import axios from "axios";

export const getUserData = async (): Promise<IUserAccount> => {
    const api_url: string = connection_path.base_url + connection_path.user.customer ;
    const token = localStorage.getItem('accessToken');

    console.log(token, "token")

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
            console.log(user, "api")
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


export const putUserData = async (userData: IUserAccount) => {
    const userId = localStorage.getItem('id');

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
            return response.data;
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error updating user data:', error);
        throw error; 
    }

};