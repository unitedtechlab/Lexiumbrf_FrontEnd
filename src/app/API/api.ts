import axios from 'axios';
import { BaseURL } from '@/app/constants/index';
import { getToken } from '@/utils/auth';
import { EnterpriseResponse } from '@/app/types/interface';

const getAuthHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
};


// Function to fetch enterprises
export const fetchEnterprisesAPI = async (): Promise<EnterpriseResponse | null> => {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('No token found, please log in.');
        }

        const response = await axios.get(`${BaseURL}/enterprises?account-type=Enterprise`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
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
            console.error('Failed to fetch enterprises:', response.data.error);
            return {
                success: false,
                data: [],
            };
        }
    } catch (error) {
        console.error('Error fetching enterprises:', error);
        return null;
    }
};

// Function to create an enterprise
export const createEnterpriseAPI = async (enterpriseName: string): Promise<any> => {
    try {
        const headers = getAuthHeaders();

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