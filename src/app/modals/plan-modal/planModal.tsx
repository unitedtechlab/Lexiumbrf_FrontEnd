import React, { useEffect, useState } from "react";
import { Col, Row, Button, message, Empty, Modal } from "antd";
import { fetchUserPlan, clearCachedPlan, Plan, fetchOrdersByUser } from "@/utils/planUtils";
import axios from "axios";
import { getAuthHeaders } from "@/utils/auth";
import { BaseURL } from "@/app/constants/index";
import classes from "./plan.module.css";

interface PlanModalProps {
    open: boolean;
    title: string;
    onSubmit: (selectedPlanId: number) => void;
    onCancel: () => void;
    isLoading: boolean;
    setModalOpen: (open: boolean) => void;
}

const PlanModal: React.FC<PlanModalProps> = ({ open, title, onSubmit, onCancel, isLoading, setModalOpen }) => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Function to fetch orders and log Plan ID and Status
    const logFetchedOrderDetails = async () => {
        try {
            const headers = await getAuthHeaders();

            if (!headers.Authorization) {
                message.error("You must be logged in to fetch orders.");
                return;
            }

            const orders = await fetchOrdersByUser(headers.Authorization.split(" ")[1]);

            if (orders && orders.length > 0) {
                const { planID, status } = orders[0];
                // console.log("Fetched Plan ID:", planID);
                // console.log("Fetched Status:", status);

                if (status === "success") {
                    setModalOpen(false);
                    localStorage.setItem("orderStatus", "success");
                }
            } else {
                console.log("No orders found.");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    // Fetch plans when modal opens
    useEffect(() => {
        const fetchPlans = async () => {
            if (open) {
                setLoading(true);
                try {
                    const fetchedPlans = await fetchUserPlan();
                    if (fetchedPlans && fetchedPlans.length > 0) {
                        setPlans(fetchedPlans);
                    } else {
                        setPlans([]);
                        setError("No plans available at the moment.");
                    }
                } catch (error) {
                    console.error("Error fetching plans:", error);
                    setError("An error occurred while fetching plans.");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchPlans();
        logFetchedOrderDetails();

        return () => {
            if (!open) {
                clearCachedPlan();
            }
        };
    }, [open]);

    // Handle order creation separately
    const handleOrderCreation = async (planId: number, price: number) => {
        try {
            const headers = await getAuthHeaders();

            if (!headers.Authorization) {
                message.error("You must be logged in to place an order.");
                return;
            }

            const orderResponse = await axios.post(
                `${BaseURL}/orders`,
                { planID: planId, amount: price, status: "true" },
                { headers }
            );

            if (orderResponse.data.success) {
                message.success("Order placed successfully!");
                onSubmit(planId);
            } else {
                message.error(orderResponse.data.error.code || "Failed to create order. Please try again.");
            }

            logFetchedOrderDetails();
        } catch (error) {
            console.error("Order creation error:", error);
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.error.code || "An error occurred while creating the order.";
                message.error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            } else {
                message.error("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <Modal
            title={title}
            open={open}
            onCancel={onCancel}
            footer={null}
            centered
            width={"70%"}
        >
            <div className={classes.planWrapper}>
                <Row gutter={16}>
                    {error && <div className="error-message">{error}</div>}

                    {plans.length > 0 ? (
                        plans.map((plan) => (
                            <Col md={8} sm={24} key={plan.id}>
                                <div className={classes.planBox}>
                                    <div className={classes.planHeading}>
                                        <h6>{plan.name} Plan</h6>
                                        <div className={`flex gap-1 ${classes.planname}`}>
                                            <h2>${plan.price}</h2>
                                            <span>per month</span>
                                        </div>
                                        <p>
                                            Basic features for up to {plan.users_limit} user
                                            {plan.users_limit > 1 ? 's' : ''}.
                                        </p>
                                        <Button
                                            className={`btn ${classes.buybtn}`}
                                            onClick={() => handleOrderCreation(plan.id, plan.price)}
                                            disabled={loading || isLoading}
                                        >
                                            Buy Now
                                        </Button>
                                    </div>
                                    <div className={classes.planDescription}>
                                        <h6>FEATURES</h6>
                                        <p>Everything in our {plan.name} plan plus...</p>
                                        <ul className="list-style">
                                            <li>Supports file size up to {plan.file_size_limit}MB</li>
                                            <li>User Limit: {plan.users_limit} user{plan.users_limit > 1 ? 's' : ''}</li>
                                            <li>Supported file types: {plan.file_type}</li>
                                            <li>Plan Duration: {plan.duration} days</li>
                                            <li>Technical support during local business hours</li>
                                        </ul>
                                    </div>
                                </div>
                            </Col>
                        ))
                    ) : (
                        !loading && (
                            <div className="not-found">
                                <Empty description="No Plans Available" />
                            </div>
                        )
                    )}
                </Row>
            </div>
        </Modal>
    );
};

export default PlanModal;
