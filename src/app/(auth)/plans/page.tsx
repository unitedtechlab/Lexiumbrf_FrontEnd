"use client";

import React, { useEffect, useState } from "react";
import { Col, Row, Divider, Button, message, Spin } from "antd";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BaseURL } from "@/app/constants/index";
import classes from "./plan.module.css";

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

    const handleBuyNow = (planId: number) => {
        router.push(`/purchase/${planId}`);
    };

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
                                        onClick={() => handleBuyNow(plan.id)}
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
