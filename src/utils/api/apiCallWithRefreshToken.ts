import { refreshAccessToken } from "./AuthenticateUtils";

export const apiCallWithTokenRefresh = async (apiCall, ...params) => {
    let result;
    try {
        result = await apiCall(...params);
    } catch (error) {
        if (error.response && error.response.status === 401) {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                result = await apiCall(...params);
            } else {
                throw new Error('Session expired, please log in again');
            }
        } else {
            throw error;
        }
    }
    return result;
};
