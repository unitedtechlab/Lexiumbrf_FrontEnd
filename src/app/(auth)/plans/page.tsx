"use client";

import React, { useEffect, useState } from "react";
import { Col, Row, Button, message, Empty } from "antd";
import { useRouter } from "next/navigation";
import axios from "axios";
import { fetchPlansAPI } from "@/app/API/api";
import classes from "./plan.module.css";
import Image from "next/image";
import Logo from '@/app/assets/images/logo.png';
import { getToken, refreshToken } from "@/utils/auth";
import { BaseURL } from '@/app/constants/index';

interface Plan {
    id: number;
    name: string;
    price: number;
    users_limit: number;
    file_size_limit: number;
    duration: number;
    file_type: string;
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
                const plansData = await fetchPlansAPI();
                setPlans(plansData || []);
                setError(null);
            } catch (error) {
                console.error("Error fetching plans:", error);
                setError("An error occurred while fetching plans.");
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const handleOrderCreation = async (planId: number, price: number) => {
        let token = getToken();

        if (!token) {
            token = await refreshToken();
        }

        if (!token) {
            message.error("You must be logged in to place an order.");
            router.push("/signin");
            return;
        }

        try {
            const response = await axios.post(`${BaseURL}/orders`, {
                planID: planId,
                amount: price,
                status: "true",
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.data.success) {
                message.success("Order placed successfully!");
                router.push("/dashboard");
            } else {
                message.error(response.data.error.code || "Failed to create order. Please try again.");
            }
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
        <div className={`${classes.planWrapper}`}>
            <div className="container">
                <div className={classes.logoWrapper}>
                    <Image src={Logo} alt="Logo" width={200} />
                </div>
                <div className={classes.headerWrapper}>
                    <p>Individual and Teams Plans</p>
                    <h2>Choose Your Best Plan for Your Business</h2>
                </div>

                {error && <div className="error-message">{error}</div>}

                <Row gutter={16}>
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
                                        <p>Basic features for up to {plan.users_limit} user{plan.users_limit > 1 ? 's' : ''}</p>
                                        <Button
                                            className={`btn ${classes.buybtn}`}
                                            onClick={() => handleOrderCreation(plan.id, plan.price)}
                                            disabled={loading}
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
        </div>
    );
}
