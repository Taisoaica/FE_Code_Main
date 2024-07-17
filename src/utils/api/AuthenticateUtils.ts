import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { connection_path } from '../../constants/developments'; // Adjust the import according to your project structure
import { GoogleCredentialResponse } from '@react-oauth/google';
import { getAllUsers, UserInfoModel } from './SystemAdminUtils';

import decodeToken from "../../utils/decoder/accessTokenDecoder";
import { apiCallWithTokenRefresh } from './apiCallWithRefreshToken';

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
                    localStorage.set('remember', 'true');
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

export const handleLogin = async (event: React.FormEvent<HTMLFormElement>, navigate: (path: string) => void, redirectPath: string, remember: boolean) => {
    const apiCall = async () => {

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

                    localStorage.setItem('id', decodedToken.id as string);
                    const userId = Number(localStorage.getItem('id'));
                    localStorage.setItem('role', decodedToken.role as string);
                    const allUsers: UserInfoModel[] = await getAllUsers();
                  
                    const currentUser = allUsers.find(user => user.id === userId);
                    console.log('Current User:', currentUser)
                    if (currentUser) {
                        if (currentUser.role === 'Dentist') {
                            if (currentUser.isOwner) {
                                navigate('/admin/clinic-owner');
                            } else {
                                navigate('/dentist');
                            }
                        } else {
                            navigate(redirectPath || '/');
                        }
                    } else {
                        console.error('User not found in the list:', decodedToken.id);
                    }
                    // if (decodedToken.role === 'Dentist') {
                    //     navigate('/admin/clinic-owner');
                    // } else {
                    //     navigate(redirectPath || '/');
                    // }
                } else {
                    console.error('Invalid decoded token:', decodedToken);
                }

                if (remember) {
                    localStorage.setItem('remember', 'true');
                } else {
                    localStorage.removeItem('remember');
                }
            } else {
                console.log(response);
                alert("Không đăng nhập thành công");
            }
        } catch (error) {
            alert('Đăng nhập thất bại, vui lòng thử lại sau.');
            console.log(error);
        }
    }
    return await apiCallWithTokenRefresh(apiCall);
};

export const handleLogout = async (navigate: (path: string) => void) => {
    const accessToken = localStorage.getItem('accessToken');

    var refreshToken = localStorage.getItem('refreshToken');


    if (!accessToken) {
        console.error('Access token not found in localStorage');
        return;
    }
    localStorage.clear();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
};




export const handleRegister = async (event: React.FormEvent<HTMLFormElement>, onSuccess: () => void) => {
    const apiCall = async () => {

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

            if (response.status === 200) {

                onSuccess();

            } else {
                console.error('Register failed with status:', response.status);
            }
        } catch (error) {
            console.error('Register error:', error);
        }
    }
    return await apiCallWithTokenRefresh(apiCall);
};

export const activateUserAccount = async (userId: number, token: string) => {
    const apiCall = async () => {


        const api_url: string = `${connection_path.base_url}${connection_path.user.activate_user}`;

        const configuration: AxiosRequestConfig = {
            method: 'PUT',
            url: api_url,
            params: {
                userId,
                token,
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            console.log('Request Configuration:', configuration);
            const response = await axios(configuration);
            console.log('Activate User Account response:', response);

            if (response.status === 200) {
                console.log('User account activated successfully.');
            } else {
                console.error('Activate user account failed with status:', response.status);
            }
        } catch (error) {
            console.error('Activate user account error:', error);
        }
    }
    return await apiCallWithTokenRefresh(apiCall);
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


export const checkAuth = async (): Promise<boolean> => {
    const remember = localStorage.getItem('remember');
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
        return true;
    } else if (remember === "true" && refreshToken) {
        return await refreshAccessToken();
    }
    return false;
}

export const refreshAccessToken = async (): Promise<boolean> => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    const api_url: string = connection_path.base_url + connection_path.auth.refresh;
    const config: AxiosRequestConfig = {
        method: 'POST',
        url: api_url,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
        },
        data: {
            accessToken,
            refreshToken,
        }
    }

    try {
        const response = await axios(config);
        if (response.status == 200) {
            localStorage.setItem('accessToken', response.data.content.accessToken);

            localStorage.setItem('refreshToken', response.data.content.refreshToken);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error refreshing access token:', error);
        return false;
    }
}

export const handleForgetPass = async (event: React.FormEvent<HTMLFormElement>, email: string, navigate: (path: string) => void) => {
    event.preventDefault();
    try {
        const api_url: string = connection_path.base_url + connection_path.forgetpass.request;
        const response = await axios.post(api_url, null, { params: { email } });
        if (response.data.success) {
            navigate('/token');
        } else {
            console.error(response.data.message);
        }
    } catch (error) {
        console.error("Request error:", error);
    }
};

export const tokenForPass = async (event: React.FormEvent<HTMLFormElement>, token: string, navigate: (path: string) => void) => {
    event.preventDefault();
    try {
        const api_url: string = connection_path.base_url + connection_path.forgetpass.token;
        const response = await axios.post(api_url, { tokenValue: token });
        if (response.data.success) {
            localStorage.setItem('resetToken', token);
            navigate('/newpassword');
        } else {
            console.error(response.data.message);
        }
    } catch (error) {
        console.error("Token error:", error);
    }
};

export const handleResetPass = async (event: React.FormEvent<HTMLFormElement>, password: string, navigate: (path: string) => void) => {
    event.preventDefault();
    const token = localStorage.getItem('resetToken'); // Retrieve token from local storage
    if (!token) {
        console.error("No token found");
        return;
    }
    try {
        const api_url: string = connection_path.base_url + connection_path.forgetpass.reset;
        const response = await axios.post(api_url, { tokenValue: token, newPassword: password });
        if (response.data.success) {
            localStorage.removeItem('resetToken'); // Clear token from local storage
            navigate('/login');
        } else {
            console.error(response.data.message);
        }
    } catch (error) {
        console.error("Password change error:", error);
    }
};