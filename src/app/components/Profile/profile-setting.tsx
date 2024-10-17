import { Button, Divider, Input, Modal, Tabs, Form, Row, Col, Upload, message } from 'antd';
import React, { useState } from 'react';
import classes from './profile.module.css';
import Image from "next/image";
import user from '@/app/assets/images/user.png';  // Default user image
import { UploadOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

interface ProfileSettingsModalProps {
    visible: boolean;
    onClose: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsModalProps> = ({ visible, onClose }) => {
    const [activeTab, setActiveTab] = useState('general');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);  // Store the uploaded image preview

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    // Handle before upload to restrict file type
    const beforeUpload = (file: any) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('You can only upload image files!');
        }
        return isImage || Upload.LIST_IGNORE;
    };

    // Handle file change event to preview uploaded image
    const handleChange = (info: any) => {
        if (info.file.status === 'done') {
            // Get the uploaded file URL and set it as the preview
            const reader = new FileReader();
            reader.onload = () => {
                setUploadedImage(reader.result as string);  // Preview uploaded image
            };
            reader.readAsDataURL(info.file.originFileObj);
        }
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="done" type="primary" onClick={onClose} className='btn'>
                    Done
                </Button>,
            ]}
            centered
        >
            <div className={classes.profileModal}>
                <div className={classes.profileHeader}>
                    <div className={classes.profileImage}>
                        {/* Display uploaded image or default image */}
                        <Image
                            src={uploadedImage || user}
                            alt="User Profile"
                            width={45}
                            height={45}
                        />
                    </div>
                    <div className={classes.profileInfo}>
                        <h5>Marci Fumons</h5>
                        <p>@marci</p>
                    </div>
                </div>
                <Divider />

                <Tabs activeKey={activeTab} onChange={(activeKey) => setActiveTab(activeKey)} className='profile_tab'>
                    <TabPane tab="General" key="general">
                        {activeTab === 'general' && (
                            <div className={classes.generalTab}>
                                <Form name="general">
                                    <Form.Item
                                        label="Name"
                                        name="name"
                                        rules={[{ required: true, message: 'Please input your Name!' }]}
                                    >
                                        <Row gutter={16}>
                                            <Col md={12} sm={24}>
                                                <Input placeholder='First name' />
                                            </Col>
                                            <Col md={12} sm={24}>
                                                <Input placeholder='Last name' />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                    <Divider />
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[{ type: 'email' }]}
                                    >
                                        <Row gutter={16}>
                                            <Col md={24} sm={24}>
                                                <Input placeholder='Email' />
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
                                            beforeUpload={beforeUpload}  // Restrict to image files only
                                            onChange={handleChange}     // Preview uploaded image
                                        >
                                            <Button icon={<UploadOutlined />}>Click to upload</Button>
                                        </Upload>
                                    </Form.Item>
                                </Form>
                            </div>
                        )}
                    </TabPane>
                    <TabPane tab="Security" key="security">
                        {activeTab === 'security' && (
                            <div className={classes.generalTab}>
                                <Form name="security">
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[{ type: 'email' }]}
                                    >
                                        <Row gutter={16}>
                                            <Col md={24} sm={24}>
                                                <Input placeholder='marci_fu@lexium.co.in' />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                    <Divider />

                                    <Form.Item
                                        label="Old Password"
                                        name="password"
                                    >
                                        <Row gutter={16}>
                                            <Col md={24} sm={24}>
                                                <Input placeholder='************' />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                    <Divider />

                                    <Form.Item
                                        label="New Password"
                                        name="newpass"
                                    >
                                        <Row gutter={16}>
                                            <Col md={12} sm={24}>
                                                <Input placeholder='********' />
                                            </Col>
                                            <Col md={12} sm={24}>
                                                <Input placeholder='Confirm Password' />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Form>
                            </div>
                        )}
                    </TabPane>
                </Tabs>

            </div>
        </Modal>
    );
};

export default ProfileSettings;
