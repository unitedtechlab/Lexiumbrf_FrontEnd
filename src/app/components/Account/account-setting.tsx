"use client";

import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Table, Space, Modal, message } from "antd";
import { fetchUserPlan, fetchOrdersByUser, Plan } from '@/utils/planUtils';
import style from "./account.module.css";
import { getToken } from "@/utils/auth";

interface AccountSettingsModalProps {
    visible: boolean;
    onClose: () => void;
}

const AccountSettings: React.FC<AccountSettingsModalProps> = ({ visible, onClose }) => {
    const [currentPlanID, setCurrentPlanID] = useState<number | null>(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [subscriptionPlans, setSubscriptionPlans] = useState<Plan[]>([]);
    const [loadingPlans, setLoadingPlans] = useState(false);
    const [loadingOrders, setLoadingOrders] = useState(false);

    const billingData = [
        {
            key: '1',
            order: '#0121',
            invoice: 'May_Invoice#1254',
            billingDate: 'Dec 1, 2023',
            paymentType: 'Credit Card',
            status: 'Successful',
        },
        {
            key: '2',
            order: '#0125',
            invoice: 'June_Invoice#1254',
            billingDate: 'Dec 1, 2023',
            paymentType: 'Debit Card',
            status: 'Failed',
        },
        {
            key: '3',
            order: '#0128',
            invoice: 'July_Invoice#1254',
            billingDate: 'Dec 1, 2023',
            paymentType: 'Bank Transfer',
            status: 'Successful',
        },
    ];

    const columns = [
        {
            title: 'Order No.',
            dataIndex: 'order',
            key: 'order',
        },
        {
            title: 'Invoice',
            dataIndex: 'invoice',
            key: 'invoice',
        },
        {
            title: 'Billing Date',
            dataIndex: 'billingDate',
            key: 'billingDate',
        },
        {
            title: 'Payment Type',
            dataIndex: 'paymentType',
            key: 'paymentType',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: '',
            key: 'action',
            render: (text: string, record: any) => (
                <Space size="middle">
                    <Button className={style.downloadbtn} type="link">Download</Button>
                </Space>
            ),
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[]) => {
            setSelectedRowKeys(selectedKeys);
        },
        selections: false,
    };

    useEffect(() => {
        const fetchPlansAndOrders = async () => {
            setLoadingPlans(true);
            setLoadingOrders(true);
            try {
                // Fetch plans
                const plans = await fetchUserPlan();
                if (plans) {
                    setSubscriptionPlans(plans);
                } else {
                    message.error("Failed to load subscription plans.");
                }

                // Fetch current order
                const token = getToken();
                if (token) {
                    const orders = await fetchOrdersByUser(token);
                    if (orders && orders.length > 0) {
                        const currentOrder = orders[0];
                        setCurrentPlanID(currentOrder.planID);
                    }
                }
            } catch (error) {
                console.error("Error fetching plans or orders:", error);
                message.error("An error occurred while fetching subscription plans or orders.");
            } finally {
                setLoadingPlans(false);
                setLoadingOrders(false);
            }
        };

        if (visible) {
            fetchPlansAndOrders();
        }
    }, [visible]);

    return (
        <Modal
            title=""
            open={visible}
            onCancel={onClose}
            footer={null}
            width={1200}
            centered
            className={style.noBottomBorder}
        >
            <Card title="Subscription" bordered={true} className={style.cardContainer}>
                <h6>Choose your perfect Subscription plan and pay easily</h6>
                <Row gutter={16} style={{ marginTop: 20 }}>
                    {subscriptionPlans.length > 0 ? (
                        subscriptionPlans.map((plan, index) => (
                            <Col span={8} key={index}>
                                <Card bordered className={style.CardWrapper}>
                                    <div className={style.card}>
                                        <div className={style.container}>
                                            <h3 className={style.heading}>{plan.name}</h3>
                                            <p className={style.para}>
                                                {plan.users_limit} users, {plan.file_size_limit}MB file size limit
                                            </p>
                                        </div>
                                        <div className={style.pricepermonth}>
                                            <h5>
                                                ${plan.price.toLocaleString()}
                                                <span className={style.month}>/ month</span>
                                            </h5>
                                        </div>
                                    </div>
                                    {plan.id === currentPlanID ? (
                                        <Space>
                                            <Button type="default" disabled>Current Plan</Button>
                                            <Button danger style={{ border: "none" }}>Cancel Subscription</Button>
                                        </Space>
                                    ) : (
                                        <Space>
                                            <Button type="primary" onClick={() => setCurrentPlanID(plan.id)} disabled={loadingPlans || loadingOrders}>
                                                Choose Plan
                                            </Button>
                                            <Button type="link">Learn more</Button>
                                        </Space>
                                    )}
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p>No subscription plans available</p>
                    )}
                </Row>
            </Card>

            <Card title="Billing Information" bordered={true} style={{ marginTop: 30 }} className={style.Table}>
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={billingData}
                    pagination={false}
                />
            </Card>
        </Modal>
    );
};

export default AccountSettings;
