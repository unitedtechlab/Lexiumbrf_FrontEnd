import axios from 'axios';
import { BaseURL } from '@/app/constants/index';
import { getToken, refreshToken } from '@/utils/auth';
import { Enterprise, EnterpriseResponse } from '@/app/types/interface';

const getAuthHeaders = async () => {
    let token = getToken();

    // Refresh token if it's invalid or missing
    if (!token) {
        token = await refreshToken();
    }

    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
};


// Function to fetch enterprises
export const fetchEnterprisesAPI = async (): Promise<EnterpriseResponse | null> => {
    try {
        const headers = await getAuthHeaders();

        if (!headers['Authorization']) {
            throw new Error('No token found, please log in.');
        }

        const response = await axios.get(`${BaseURL}/enterprises?account-type=Enterprise`, {
            headers,
        });

        if (response.data && response.data.success) {
            const rawData = response.data.data;
            if (Array.isArray(rawData)) {
                return {
                    success: true,
                    data: rawData,
                };
            } else if (rawData && typeof rawData === 'object') {
                return {
                    success: true,
                    data: [rawData],
                };
            } else {
                console.warn('No valid enterprise data found, returning empty array.');
                return {
                    success: false,
                    data: [],
                };
            }
        } else {
            return {
                success: false,
                error: response.data.error || 'Failed to fetch enterprises',
            };
        }
    } catch (error: unknown) {
        let errorMessage = 'An error occurred while fetching enterprises.';
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error.code || errorMessage;
            }
        }

        return {
            success: false,
            error: errorMessage,
        };
    }
};

// Function to create an enterprise
export const createEnterpriseAPI = async (enterpriseName: string): Promise<any> => {
    try {
        const headers = await getAuthHeaders();

        if (!headers['Authorization']) {
            throw new Error('No token found, please log in.');
        }

        const response = await axios.post(
            `${BaseURL}/enterprises?account-type=Enterprise`,
            { "EnterpriseName": enterpriseName },
            { headers }
        );

        return response.data;
    } catch (error) {
        console.error('Error creating enterprise:', error);
        throw error;
    }
};

// Function to Edit an enterprise

export const editEnterpriseAPI = async (enterprise: Enterprise): Promise<any> => {
    try {
        const headers = await getAuthHeaders();

        if (!headers['Authorization']) {
            throw new Error('No token found, please log in.');
        }

        const response = await axios.put(
            `${BaseURL}/enterprises?account-type=Enterprise`,
            {
                accountID: enterprise.accountID,
                enterpriseName: enterprise.accountname,
            },
            { headers }
        );

        return response.data;
    } catch (error) {
        console.error('Error updating enterprise:', error);
        throw error;
    }
};



// Fetch user plans API
export const fetchPlansAPI = async (): Promise<any> => {
    try {
        const response = await axios.get(`${BaseURL}/plans`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.data.success && response.data.data && response.data.data.plans) {
            return response.data.data.plans;
        } else {
            throw new Error("Failed to load plans.");
        }
    } catch (error) {
        console.error('Error fetching plans:', error);
        throw error;
    }
};


// Fetch orders based on user ID
export const fetchOrdersByUser = async (token: string) => {
    try {
        const response = await axios.get(`${BaseURL}/orders`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        // Log the full response for debugging
        console.log("Full order response:", response);

        if (response.data && response.data.data && Array.isArray(response.data.data)) {
            console.log("Order data:", response.data.data); // Log order data
            return response.data.data; // Return the orders array
        } else {
            console.error("Unexpected response structure:", response.data);
            return null;
        }
    } catch (error) {
        console.error("Error fetching orders:", error);
        return null;
    }
};
