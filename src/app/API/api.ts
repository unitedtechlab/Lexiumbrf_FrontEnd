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
        const headers = getAuthHeaders();
        if (!headers['Authorization']) {
            throw new Error('No token found, please log in.');
        }

        const url = `${BaseURL}/enterprises?account-type=Enterprise`;
        const response = await axios.get(url, { headers });
        const rawData = response.data.data;

        if (!Array.isArray(rawData)) {
            return {
                success: response.data.success,
                data: [rawData],
            };
        }

        return {
            success: response.data.success,
            data: rawData,
        };
    } catch (error) {
        console.error('Error fetching enterprises:', error);
        return null;
    }
};
