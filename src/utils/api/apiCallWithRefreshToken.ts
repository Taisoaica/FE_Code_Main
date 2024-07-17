import { refreshAccessToken } from "./AuthenticateUtils";

export const apiCallWithTokenRefresh = async (apiCall, ...params) => {
    try {
        return await apiCall(...params);
    } catch (error: unknown) {
        if (error.response.status === 401) {
            const refreshed = await refreshAccessToken();

            if (refreshed) {
                return await apiCall(...params);
            }
        }
    }
};
