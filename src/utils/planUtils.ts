import axios from 'axios';
import { BaseURL } from '@/app/constants/index';
import { getAuthHeaders } from '@/utils/auth';

let cachedPlans: Plan[] | null = null;

export interface Plan {
    length: number;
    id: number;
    name: string;
    file_type: string;
    file_size_limit: number;
    price: number;
    users_limit: number;
    duration: number;
    created_at: string;
    updated_at: string;
}

// Function to fetch and cache the user’s plans
export const fetchUserPlan = async (): Promise<Plan[] | null> => {
    if (cachedPlans) {
        return cachedPlans;
    }

    try {
        const headers = await getAuthHeaders();
        if (!headers.Authorization) {
            throw new Error('No valid token found. Please log in.');
        }

        const response = await axios.get(`${BaseURL}/plans`, {
            headers,
        });
        if (response.data.success && response.data.data && response.data.data.plans) {
            cachedPlans = response.data.data.plans;
            return cachedPlans;

        } else {
            console.error('Failed to fetch user plans:', response.data.error || 'Invalid response structure');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user plans:', error);
        return null;
    }
};

export const clearCachedPlan = () => {
    cachedPlans = null;
};



export const fetchOrdersByUser = async (token: string) => {
    try {
        const response = await axios.get(`${BaseURL}/orders`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
            return response.data.data.data;
        } else {
            console.error("Unexpected response structure:", response.data);
            return null;
        }
    } catch (error) {
        console.error("Error fetching orders:", error);
        return null;
    }
};
