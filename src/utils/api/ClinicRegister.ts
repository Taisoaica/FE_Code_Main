import { ClinicRegistrationModel } from "../interfaces/ClinicRegister/Clinic";
import { UserRegistrationModel } from "../interfaces/User/UserDefinition";
import { connection_path } from "../../constants/developments";
import { login } from "./AuthenticateUtils";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { apiCallWithTokenRefresh } from "./apiCallWithRefreshToken";
import { IAPIResponseModel, IClinicModel, IClinicRegistrationModel} from "../interfaces/interfaces";

export const handleClinicRegister = async (payload: ClinicRegistrationModel, navigate: (path: string, state?: any) => void) => {
    const apiCall = async () => {
        const api_url: string = connection_path.base_url + connection_path.user.clinic_register;

        const configuration = {
            method: "POST",
            url: api_url,
            data: payload,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const response = await axios(configuration);

            if (response.status === 200) {

                const loginPayload = {
                    username: payload.OwnerUserName,
                    password: payload.OwnerPassword,
                };

                await login(loginPayload, navigate);

            } else {
                console.log(response);
                alert("Register failed");
            }
        } catch (error) {
            alert('Register failed, please try again later.');
            console.log(error);
        }
    }
    return await apiCallWithTokenRefresh(apiCall);
};


export const handleOwnerRegister = async (payload: UserRegistrationModel) => {
    const apiCall = async () => {
        const api_url = connection_path.base_url + connection_path.clinic.register_clinic_owner;

        const configuration = {
            method: "POST",
            url: api_url,
            data: payload,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const response = await axios(configuration);
            const { statusCode, message } = response.data;

            if (statusCode === 200) {
                console.log("Register successful");
                return statusCode;
            } else {
                alert("Register failed: " + message);
                return statusCode;
            }
        } catch (error) {
            alert('Register failed, please try again later.');
            console.log(error);
            return null;
        }
    }
    return await apiCallWithTokenRefresh(apiCall);
}

// Currently does not auto-login.
export const handleClinicRegistration = async (payload: IClinicRegistrationModel) : Promise<IAPIResponseModel<IClinicModel | null>> => {
    
    const formatTime = (time: string) => {
        const [hour, minute] = time.split(':');
        return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:00`;
    };

    payload.OpenHour = formatTime(payload.OpenHour);
    payload.CloseHour = formatTime(payload.CloseHour);

    const configuration: AxiosRequestConfig<ClinicRegistrationModel> = {
        method: 'POST',
        baseURL: connection_path.base_url,
        url:connection_path.clinic.register_clinic,
        headers: {'Content-Type': 'application/json'},
        data: payload,
    }

    const response_data: IAPIResponseModel<IClinicModel | null> = await axios(configuration)
    .then( (res) => 
        {
            const data: IAPIResponseModel<IClinicModel | null> = res.data;
            console.log(`Axios response: ${res.status}`);
            console.log(data);
            return data;
        })
    .catch( (error: AxiosError<IAPIResponseModel<IClinicModel|null>>) =>
        {
            const data: IAPIResponseModel<IClinicModel | null> = error.response!.data;
            console.log(`Axios response: ${error.message} | ${error.cause} | ${error.code}`);
            console.log(data);
            return data;
        }
    );

    return response_data;
}