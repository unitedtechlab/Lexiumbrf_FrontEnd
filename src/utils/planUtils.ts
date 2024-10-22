import axios from 'axios';
import { BaseURL } from '@/app/constants/index';
import { getToken, refreshToken } from '@/utils/auth';

let cachedPlan: Plan | null = null;

export interface Plan {
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

// Function to fetch and cache the user’s plan
export const fetchUserPlan = async (): Promise<Plan | null> => {
    if (cachedPlan) {
        return cachedPlan;
    }

    try {
        let token = getToken();
        if (!token) {
            token = await refreshToken();
        }

        if (!token) {
            throw new Error('No token found. Please log in.');
        }

        // Make sure you are hitting the correct endpoint to fetch the user's plan
        const response = await axios.get(`${BaseURL}/plans`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.data && response.data.success && response.data.data) {
            cachedPlan = response.data.data.plan;
            return cachedPlan;
        } else {
            console.error('Failed to fetch user plan:', response.data.error);
            return null;
        }
    } catch (error) {
        console.error('Error fetching user plan:', error);
        return null;
    }
};

export const clearCachedPlan = () => {
    cachedPlan = null;
};
