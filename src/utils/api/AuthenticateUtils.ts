import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { connection_path } from '../../constants/developments'; // Adjust the import according to your project structure
import { GoogleCredentialResponse } from '@react-oauth/google';
import { getAllUsers } from './SystemAdminUtils';

import decodeToken from "../../utils/decoder/accessTokenDecoder";

interface JwtPayload {
    role: string;
    id: string;
}

export const login = async (payload: { username: string; password: string }, navigate: (path: string) => void) => {
    const api_url: string = connection_path.base_url + connection_path.auth.login;

    const configuration: AxiosRequestConfig = {
        method: "POST",
        url: api_url,
        data: payload,
    };

    try {
        const response = await axios(configuration);

        if (response.status === 200 && response.data.content.accessToken !== undefined) {
            const { accessToken, refreshToken } = response.data.content;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            const decodedToken = decodeToken(accessToken);

            if (decodedToken && 'role' in decodedToken && 'id' in decodedToken) {
                localStorage.setItem('id', decodedToken.id as string);
                localStorage.setItem('role', decodedToken.role as string);


                if (decodedToken.role === 'Dentist') {
                    navigate('/admin/clinic-owner');
                } else {
                    navigate('/');
                }
            } else {
                console.error('Invalid decoded token:', decodedToken);
            }
        } else {
            console.log(response);
            alert("Không đăng nhập thành công");
        }
    } catch (error) {
        alert('Đăng nhập thất bại, vui lòng thử lại sau.');
        console.log(error);
    }
};
export const handleLogin = async (event: React.FormEvent<HTMLFormElement>, navigate: (path: string) => void, redirectPath: string) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const payload = {
        username: data.get('username'),
        password: data.get('password'),
    }

    const api_url: string = connection_path.base_url + connection_path.auth.login;

    const configuration: AxiosRequestConfig = {
        method: "POST",
        url: api_url,
        data: payload
    };

    try {
        const response = await axios(configuration);

        if (response.status === 200 && response.data.content.accessToken !== undefined) {
            const accessToken = response.data.content.accessToken;
            const refreshToken = response.data.content.refreshToken;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            const decodedToken = decodeToken(accessToken);

            if (decodedToken && 'role' in decodedToken && 'id' in decodedToken) {
                const users = await getAllUsers();

                const loggedInUser = Array.isArray(users) ? users.find(user => user.id.toString() === decodedToken.id) : null;

                if (loggedInUser) {
                    localStorage.setItem('userDetails', JSON.stringify(loggedInUser));
                }

                localStorage.setItem('id', decodedToken.id as string);
                localStorage.setItem('role', decodedToken.role as string);

                if (decodedToken.role === 'Dentist') {
                    navigate('/admin/clinic-owner');
                } else {
                    navigate(redirectPath || '/');
                }
            } else {
                console.error('Invalid decoded token:', decodedToken);
            }

        } else {
            console.log(response);
            alert("Không đăng nhập thành công");
        }
    } catch (error) {
        alert('Đăng nhập thất bại, vui lòng thử lại sau.');
        console.log(error);
    }
};

export const handleLogout = async (navigate: (path: string) => void) => {
    const accessToken = localStorage.getItem('accessToken');

    var refreshToken = localStorage.getItem('refreshToken');



    if (!accessToken) {
        console.error('Access token not found in localStorage');
        return;
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
};




export const handleRegister = async (event: React.FormEvent<HTMLFormElement>, onSuccess: () => void) => {
    const api_url: string = connection_path.base_url + connection_path.user.customer_register;

    const data = new FormData(event.currentTarget);

    const payload = {
        username: data.get('username'),
        email: data.get('email'),
        password: data.get('password'),
        clinicOwner: false,
        clinic: 0,
    };

    const configuration: AxiosRequestConfig = {
        method: 'POST',
        url: api_url,
        data: payload
    };

    try {
        const response = await axios(configuration);
        console.log('Register response:', response);

        if (response.status === 200) {
            onSuccess();

        } else {
            console.error('Register failed with status:', response.status);
            alert('Register failed');
        }
    } catch (error) {
        console.error('Register error:', error);
        alert('Register failed, please try again later.');
    }

};

export const handleGoogleOnSuccess = async (response: GoogleCredentialResponse, navigate: (path: string) => void) => {
    const api_url: string =
        connection_path.base_url + connection_path.auth.googleAuth;
    const configuration: AxiosRequestConfig = {
        method: "POST",
        url: api_url,
        data: { googleToken: response.credential },
        headers: { "Content-Type": "application/json" },
    };
    const axiosResponse: AxiosResponse<{
        accessToken: string;
        refreshToken: string;
        error: string;
        message: string;
    }> = await axios(configuration);

    console.log(axiosResponse);

    if (axiosResponse.data.accessToken !== undefined) {
        localStorage.setItem("accessToken", axiosResponse.data.accessToken);
        localStorage.setItem("refreshToken", axiosResponse.data.refreshToken);
        navigate("/");
    }
};
export const handleGoogleOnFailure = (navigate: (path: string) => void) => {
    navigate("/error404")
};


