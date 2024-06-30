import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { connection_path } from '../../constants/developments'; // Adjust the import according to your project structure
import { GoogleCredentialResponse } from '@react-oauth/google';

import decodeToken from "../../utils/decoder/accessTokenDecoder";

interface JwtPayload {
    role: string;
    id: string;
}


export const handleLogin = async (event: React.FormEvent<HTMLFormElement>, navigate: (path: string) => void) => {
    event.preventDefault();

    //    Dữ liệu về form
    const data = new FormData(event.currentTarget);

    //    Dữ liệu sau khi điền vào form
    const payload = {
        userName: data.get('username'),
        password: data.get('password'),
    }

    //    Chuỗi kết nối tới server backend
    //!   LƯU Ý: KHÔNG THAY ĐỔI TRỰC TIẾP CHUỖI KẾT NỐI TẠI ĐÂY (Fix cứng)
    //==  Chỉ thay đổi dữ liệu của "connection_path" trong file src/constants/developments
    const api_url: string = connection_path.base_url + connection_path.auth.login;

    const configuration: AxiosRequestConfig = {
        method: "POST",
        url: api_url,
        data: payload
    };

    await axios(configuration)

        .then(response => {
            console.log("Response:", response.data.content);

            if (response.status === 200 && response.data.content.accessToken !== undefined) {

                var accessToken = response.data.content.accessToken;
                var refreshToken = response.data.content.refreshToken;

                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);

                const decodedToken = decodeToken(accessToken);
                //  Thành công thì cho về trang người dùng
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

            }
            else {
                console.log(response);
                alert("Không đăng nhập thành công");
            }
        })
        .catch(error => {
            alert('Đăng nhập thất bại, vui lòng thử lại sau.')
            console.log(error);
        })
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


