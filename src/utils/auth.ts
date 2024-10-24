import axios from 'axios';
import { BaseURL } from '@/app/constants/index';
import { message } from 'antd';

const TOKEN_KEY = 'auth_token';

// Function to store the token in localStorage
export const setToken = (token: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
    }
};

// Function to get the token from localStorage
export const getToken = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem(TOKEN_KEY);
        return token;
    }
    return null;
};

// Function to remove the token from localStorage
export const removeToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
    }
};

// Function to decode the token payload (assumes JWT structure)
export const decodeToken = (token: string) => {
    return JSON.parse(atob(token.split('.')[1]));
};

// Function to check if the token is still valid based on its expiration time
export const isValidToken = (token: string) => {
    try {
        const decodedToken = decodeToken(token);
        return decodedToken.exp * 1000 > Date.now();
    } catch (error) {
        return false;
    }
};

// Function to refresh the token 
export const refreshToken = async (): Promise<string | null> => {
    try {
        const currentToken = getToken();
        if (!currentToken) {
            message.error("No current token found in localStorage.");
            return null;
        }
        console.log(currentToken, "currentToken currentToken")

        const response = await axios.get(`${BaseURL}/latest_token`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${currentToken}`,
            },
        });
        console.log("sadasdasdasdasdasdasdasdsad", response.data.data, "response currentToken")

        if (response.data && response.data.data && response.data.data.token) {
            const newToken = response.data.data.token;
            setToken(newToken);
            console.log(newToken, "newToken newToken newToken")
            return newToken;

        } else {
            message.error("Failed to refresh token: No token in response.");
            return null;
        }
    } catch (error) {
        console.error("Error refreshing token:", error);
        message.error("Error refreshing token. Please log in again.");
        return null;
    }
};

// Function to get authorization headers with token for API requests
export const getAuthHeaders = async () => {
    let token = getToken();

    if (!token) {
        token = await refreshToken();
    }

    if (!token) {
        message.error("Failed to retrieve a valid token.");
        return {};
    }

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
};


export const isBrowser = () => typeof window !== 'undefined';