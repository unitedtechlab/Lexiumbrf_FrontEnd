import { getToken, decodeToken } from "@/utils/auth";
import { fetchOrdersByUser } from "@/app/API/api";

export const fetchUserOrderDetails = async () => {
    try {
        const token = getToken();
        if (!token) {
            throw new Error("No token found, please log in.");
        }

        // Fetch orders using the token
        const orderResponse = await fetchOrdersByUser(token);

        if (orderResponse && Array.isArray(orderResponse) && orderResponse.length > 0) {
            const firstOrder = orderResponse[0];

            if (firstOrder.planID === 3) {
                const decodedToken = decodeToken(token);

                if (decodedToken.plans && decodedToken.plans.length > 0) {
                    const superAdmin = decodedToken.plans[0].superAdmin;
                    return superAdmin;
                }
            } else {
                console.log("No enterprise plan detected.");
                return false;
            }
        } else {
            console.log("No orders found or invalid response.");
            return false;
        }
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};
