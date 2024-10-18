// planUtils.ts
import { getToken } from "@/utils/auth";
import axios from "axios";
import { BaseURL } from "@/app/constants/index";

// Define a type for plans
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

// Fetch the current user's plan information
export const fetchUserPlan = async (): Promise<Plan | null> => {
    try {
        const token = getToken();
        if (!token) {
            throw new Error("No token found, please log in.");
        }

        const response = await axios.get(`${BaseURL}/plans`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.data && response.data.success) {
            return response.data.data.plan; // Assuming the API returns the user's current plan
        } else {
            console.error("Failed to fetch user plan:", response.data.error);
            return null;
        }
    } catch (error) {
        console.error("Error fetching user plan:", error);
        return null;
    }
};

// Check if the user has access to a specific feature based on their plan ID
export const hasAccessToFeature = (planId: number, requiredPlanId: number): boolean => {
    return planId === requiredPlanId;
};
