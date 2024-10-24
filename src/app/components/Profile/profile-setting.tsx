"use client";

import React, { useState, useEffect } from "react";
import { Col, Row, Form, Input, Button, message, Modal, Divider, Tabs } from "antd";
import axios from "axios";
import { BaseURL } from "@/app/constants/index";
import { getAuthHeaders, decodeToken, refreshToken, getToken } from "@/utils/auth";
import { useEmail } from "@/app/context/emailContext";
import classes from "./profile.module.css";
import user from "@/app/assets/images/user.png";
import Image from "next/image";

interface ProfileSettingsModalProps {
    visible: boolean;
    onClose: () => void;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
}

const ProfileSettings: React.FC<ProfileSettingsModalProps> = ({ visible, onClose, firstName: initialFirstName, lastName: initialLastName, email }) => {
    const { setFirstName, setLastName } = useEmail();
    const [activeTab, setActiveTab] = useState("general");
    const [loading, setLoading] = useState(false);
    const [generalForm] = Form.useForm();
    const [securityForm] = Form.useForm();
    const [firstName, setLocalFirstName] = useState<string | null>(initialFirstName || null);
    const [lastName, setLocalLastName] = useState<string | null>(initialLastName || null);
    const [emailFromToken, setEmailFromToken] = useState<string | null>(email || null);

    useEffect(() => {
        const token = getToken();
        if (token) {
            const decodedToken = decodeToken(token);
            const emailFromDecodedToken = decodedToken?.email || "";
            setEmailFromToken(emailFromDecodedToken);
            generalForm.setFieldsValue({ email: emailFromDecodedToken });
        } else {
            message.error("Token is missing. Please log in again.");
        }
    }, [generalForm]);

    // Handler for updating name using getAuthHeaders
    const handleUpdateName = async (values: { firstName: string; lastName: string }) => {
        try {
            setLoading(true);

            const headers = await getAuthHeaders();
            const response = await axios.post(
                `${BaseURL}/users/update-name`,
                {
                    FirstName: values.firstName,
                    LastName: values.lastName,
                },
                { headers }
            );

            if (response.status === 200) {
                message.success(response.data.message || "Name updated successfully.");

                const refreshedToken = await refreshToken();
                if (refreshedToken) {
                    const decodedToken = decodeToken(refreshedToken);
                    setFirstName(decodedToken?.firstName || values.firstName);
                    setLastName(decodedToken?.lastName || values.lastName);
                }

                onClose();
            } else {
                message.error(response.data.error || "Failed to update name. Please try again.");
            }
        } catch (error) {
            message.error("An error occurred while updating the name.");
            console.error("Error updating name:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handler for resetting password
    const handleResetPassword = async (values: { password: string; newpass: string }) => {
        try {
            setLoading(true);
            const token = await refreshToken();
            if (!token) {
                message.error("Failed to refresh token. Please log in again.");
                return;
            }

            const response = await axios.post(
                `${BaseURL}/users/reset-password`,
                {
                    old_password: values.password,
                    new_password: values.newpass,
                    profileReset: true,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setLoading(false);
            if (response.status === 200) {
                message.success(response.data.message || "Password reset successfully.");
                onClose();
            } else {
                message.error(response.data.error || "Failed to reset password. Please try again.");
            }
        } catch (error) {
            setLoading(false);
            message.error("An error occurred while resetting password.");
        }
    };

    const items = [
        {
            key: "general",
            label: "General",
            children: (
                <div className={classes.generalTab}>
                    <Form
                        form={generalForm}
                        name="general"
                        onFinish={handleUpdateName}
                        layout="vertical"
                        initialValues={{
                            email: email || emailFromToken,
                            firstName: firstName || "",
                            lastName: lastName || ""
                        }}
                    >
                        <Form.Item label="Email" name="email">
                            <Input disabled />
                        </Form.Item>
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: "Please input your Name!" }]}
                        >
                            <Row gutter={16}>
                                <Col md={12} sm={24}>
                                    <Form.Item name="firstName" rules={[{ required: true, message: "First name is required!" }]}>
                                        <Input placeholder="First name" />
                                    </Form.Item>
                                </Col>
                                <Col md={12} sm={24}>
                                    <Form.Item name="lastName" rules={[{ required: true, message: "Last name is required!" }]}>
                                        <Input placeholder="Last name" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form.Item>

                        <Button type="primary" htmlType="submit" loading={loading} className="btn">
                            Save
                        </Button>
                    </Form>
                </div>
            ),
        },
        {
            key: "security",
            label: "Security",
            children: (
                <div className={classes.generalTab}>
                    <Form form={securityForm} name="security" onFinish={handleResetPassword} layout="vertical">
                        <Form.Item
                            label="Old Password"
                            name="password"
                            rules={[{ required: true, message: "Please enter your old password!" }]}
                        >
                            <Input.Password placeholder="Old Password" />
                        </Form.Item>
                        <Row gutter={16}>
                            <Col md={12} sm={12}>
                                <Form.Item
                                    label="New Password"
                                    name="newpass"
                                    rules={[
                                        { required: true, message: "Please enter your new password!" },
                                        { min: 8, message: "Password must be at least 8 characters long!" },
                                        {
                                            pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
                                            message: "Password must contain letters, numbers, and symbols!",
                                        },
                                    ]}
                                >
                                    <Input.Password placeholder="New Password" />
                                </Form.Item>
                            </Col>
                            <Col md={12} sm={12}>
                                <Form.Item
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    dependencies={["newpass"]}
                                    rules={[
                                        { required: true, message: "Please confirm your password!" },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue("newpass") === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error("The passwords do not match!"));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password placeholder="Confirm Password" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Button type="primary" htmlType="submit" loading={loading} className="btn">
                            Reset Password
                        </Button>
                    </Form>
                </div>
            ),
        },
    ];

    return (
        <Modal open={visible} onCancel={onClose} footer={null} centered>
            <div className={classes.profileModal}>
                <div className={classes.profileHeader}>
                    <div className={classes.profileImage}>
                        <Image src={user} alt="User Profile" width={45} height={45} />
                    </div>
                    <div className={classes.profileInfo}>
                        <h6>{`${firstName || ""} ${lastName || ""}`}</h6>
                        <p>{email || emailFromToken || ""}</p>
                    </div>
                </div>
                <Divider />
                <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)} items={items} className="profile_tab" />
            </div>
        </Modal>
    );
};

export default ProfileSettings;
