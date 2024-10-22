"use client";

import React, { useState, useEffect } from "react";
import { Col, Row, Form, Input, Button, message, Modal, Divider, Tabs, Upload } from "antd";
import Image from "next/image";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import classes from "./profile.module.css";
import user from "@/app/assets/images/user.png";
import { BaseURL } from "@/app/constants/index";
import { getToken, refreshToken, decodeToken } from "@/utils/auth";

interface ProfileSettingsModalProps {
    visible: boolean;
    onClose: () => void;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
}

const ProfileSettings: React.FC<ProfileSettingsModalProps> = ({ visible, onClose, firstName, lastName, email }) => {
    const [activeTab, setActiveTab] = useState("general");
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [generalForm] = Form.useForm();
    const [securityForm] = Form.useForm();
    const searchParams = useSearchParams();
    const [emailFromToken, setEmailFromToken] = useState<string | null>(null);

    useEffect(() => {
        const token = getToken();

        if (token) {
            const decodedToken = decodeToken(token);
            const emailFromDecodedToken = decodedToken?.email || "";

            if (emailFromDecodedToken) {
                setEmailFromToken(emailFromDecodedToken);
                generalForm.setFieldsValue({ email: emailFromDecodedToken });
            } else {
                message.error("Invalid token. Please log in again.");
            }
        } else {
            message.error("Token is missing. Please log in again.");
        }
    }, [generalForm]);

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const beforeUpload = (file: any) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            message.error("You can only upload image files!");
        }
        return isImage || Upload.LIST_IGNORE;
    };

    const handleChange = (info: any) => {
        if (info.file.status === "done") {
            const reader = new FileReader();
            reader.onload = () => {
                setUploadedImage(reader.result as string);
            };
            reader.readAsDataURL(info.file.originFileObj);
        }
    };

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
                    }
                }
            );

            setLoading(false);
            if (response.status === 200) {
                message.success(response.data.message || "Password updated successfully.");
                onClose();
            } else {
                message.error(response.data.error || "Failed to update password. Please try again.");
            }
        } catch (error) {
            setLoading(false);
            message.error("An error occurred. Please try again.");
        }
    };

    const items = [
        {
            key: "general",
            label: "General",
            children: (
                <div className={classes.generalTab}>
                    <Form form={generalForm} name="general">
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: "Please input your Name!" }]}
                        >
                            <Row gutter={16}>
                                <Col md={12} sm={24}>
                                    <Input placeholder="First name" defaultValue={firstName || ""} />
                                </Col>
                                <Col md={12} sm={24}>
                                    <Input placeholder="Last name" defaultValue={lastName || ""} />
                                </Col>
                            </Row>
                        </Form.Item>
                        <Divider />
                        <Form.Item label="Email" name="email">
                            <Row gutter={16}>
                                <Col md={24} sm={24}>
                                    <Input defaultValue={email || emailFromToken || ""} disabled />
                                </Col>
                            </Row>
                        </Form.Item>
                        <Divider />
                        <Form.Item
                            name="upload"
                            label="Upload"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                name="image"
                                listType="picture"
                                beforeUpload={beforeUpload}
                                onChange={handleChange}
                            >
                                <Button icon={<UploadOutlined />}>Click to upload</Button>
                            </Upload>
                        </Form.Item>
                    </Form>
                    <Button key="done" type="primary" className="btn">
                        Save
                    </Button>
                </div>
            ),
        },
        {
            key: "security",
            label: "Security",
            children: (
                <div className={classes.generalTab}>
                    <Form form={securityForm} name="security" onFinish={handleResetPassword}>
                        <Form.Item
                            label="Old Password"
                            name="password"
                            rules={[{ required: true, message: "Please enter your old password!" }]}
                        >
                            <Input.Password placeholder="Old Password" />
                        </Form.Item>
                        <Form.Item
                            label="New Password"
                            name="newpass"
                            rules={[
                                { required: true, message: "Please enter your new password!" },
                                { min: 8, message: "Password must be at least 8 characters long!" },
                                {
                                    pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
                                    message: "It must contain letters, numbers, and symbols!",
                                },
                            ]}
                        >
                            <Input.Password placeholder="New Password" />
                        </Form.Item>
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
                        <Button type="primary" htmlType="submit" loading={loading}>
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
                        <Image src={uploadedImage || user} alt="User Profile" width={45} height={45} />
                    </div>
                    <div className={classes.profileInfo}>
                        <h6>{`${firstName || ""} ${lastName || ""}`}</h6>
                        <p>{email || emailFromToken || ""}</p>
                    </div>
                </div>
                <Divider />

                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key)}
                    items={items}
                    className="profile_tab"
                />
            </div>
        </Modal>
    );
};

export default ProfileSettings;
