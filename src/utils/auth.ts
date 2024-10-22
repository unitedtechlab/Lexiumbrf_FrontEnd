import { TOKEN_KEY } from '@/app/constants/index';
import axios from 'axios';
import { BaseURL } from "@/app/constants/index";

export const setToken = (token: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
    }
};


export const getToken = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem(TOKEN_KEY);
        return token;
    }
    return null;
};


export const removeToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
    }
};

export const isValidToken = (token: string) => {
    try {
        const decodedToken = decodeToken(token);
        return decodedToken.exp * 1000 > Date.now();
    } catch (error) {
        return false;
    }
};

export const decodeToken = (token: string) => {
    return JSON.parse(atob(token.split('.')[1]));
};

export const isBrowser = () => typeof window !== 'undefined';

// Function to refresh the token
export const refreshToken = async () => {
    try {
        const response = await axios.get(`${BaseURL}/latest_token`, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.data.token) {
            setToken(response.data.token);
            return response.data.token;
        }
    } catch (error) {
        console.error("Error refreshing token:", error);
    }
    return null;
};
