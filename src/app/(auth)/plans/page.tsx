"use client";

import React, { useEffect, useState } from "react";
import { Col, Row, Divider, Button, message, Spin } from "antd";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BaseURL } from "@/app/constants/index";
import classes from "./plan.module.css";
import { getToken, setToken } from "@/utils/auth";

interface Plan {
    id: number;
    name: string;
    price: number;
    users_limit: number;
    file_size_limit: number;
    duration: number;
    file_type: string;
}
interface Order {
    plan_id: number;
    amount: number;
}

export default function Plans() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchPlans = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${BaseURL}/plans`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.data.success) {
                    setPlans(response.data.data.plans || []);
                } else {
                    setError("Failed to load plans. Please try again.");
                }
            } catch (error) {
                setError("An error occurred while fetching plans.");
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const fetchPlanOrder = async (order: Order) => {
        setLoading(true);
        try {
            const token = getToken();
            const response = await axios.post(`${BaseURL}/orders`,
                {
                    plan_id: order.plan_id,
                    amount: order.amount,
                }
                , {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
            console.log("response order", response)
            if (response.data.success) {
                const { token: newToken, message: successMessage } = response.data.data;
                message.success(successMessage || "Order placed successfully.");
                setToken(newToken);
                router.push("/dashboard");
            } else {
                setError("Failed to place your order. Please try again.");
            }
        } catch (error) {
            setError("An error occurred while ordering you plan.");
        } finally {
            setLoading(false);
        }
    };

    // const handleBuyNow = (planId: number) => {
    //     router.push(`/purchase/${planId}`);
    // };

    if (loading) {
        return (
            <div className="loading-spinner">
                <Spin />
            </div>
        );
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className={`${classes.planWrapper} flex`}>
            <div className="container">
                <div className={classes.headerWrapper}>
                    <h4>Choose Your Best Plan for Your Business</h4>
                    <p>
                        Individual and Teams <b>Plan</b>
                    </p>
                </div>

                <Row gutter={16}>
                    {plans.length > 0 ? (
                        plans.map((plan) => (
                            <Col md={8} sm={24} key={plan.id}>
                                <div className={classes.planBox}>
                                    <h6>{plan.name}</h6>
                                    <h2>${plan.price}</h2>
                                    <span>per month</span>
                                    <span>max {plan.users_limit} user{plan.users_limit > 1 ? 's' : ''}</span>
                                    <Button
                                        className="btn"
                                        onClick={() => fetchPlanOrder({ plan_id: plan.id, amount: plan.price })}
                                    >
                                        Buy Now
                                    </Button>
                                    <Divider />
                                    <ul className="list-style">
                                        <li>Supports file size up to {plan.file_size_limit}MB</li>
                                        <li>User Limit: {plan.users_limit} user{plan.users_limit > 1 ? 's' : ''}</li>
                                        <li>Supported file types: {plan.file_type}</li>
                                        <li>Plan Duration: {plan.duration} days</li>
                                        <li>Technical support during local business hours</li>
                                    </ul>
                                </div>
                            </Col>
                        ))
                    ) : (
                        <div>No plans available</div>
                    )}
                </Row>
            </div>
        </div>
    );
}
