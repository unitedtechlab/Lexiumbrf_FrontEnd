import { Button, Divider, Input, Modal, Tabs, Form, Row, Col, Upload, message } from 'antd';
import React, { useState } from 'react';
import classes from './profile.module.css';
import Image from "next/image";
import user from '@/app/assets/images/user.png';
import { UploadOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { TabPane } = Tabs;

interface ProfileSettingsModalProps {
    visible: boolean;
    onClose: () => void;
    firstName: string | null; // Add prop for first name
    lastName: string | null;  // Add prop for last name
    email: string | null;     // Add prop for email
}

const ProfileSettings: React.FC<ProfileSettingsModalProps> = ({ visible, onClose, firstName, lastName, email }) => {
    const [activeTab, setActiveTab] = useState('general');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const beforeUpload = (file: any) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('You can only upload image files!');
        }
        return isImage || Upload.LIST_IGNORE;
    };

    const handleChange = (info: any) => {
        if (info.file.status === 'done') {
            const reader = new FileReader();
            reader.onload = () => {
                setUploadedImage(reader.result as string);
            };
            reader.readAsDataURL(info.file.originFileObj);
        }
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            centered
        >
            <div className={classes.profileModal}>
                <div className={classes.profileHeader}>
                    <div className={classes.profileImage}>
                        <Image src={uploadedImage || user} alt="User Profile" width={45} height={45} />
                    </div>
                    <div className={classes.profileInfo}>
                        <h6>{`${firstName || ''} ${lastName || ''}`}</h6>
                        <p>{email || ''}</p>
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
                                                <Input placeholder='First name' defaultValue={firstName || ''} />
                                            </Col>
                                            <Col md={12} sm={24}>
                                                <Input placeholder='Last name' defaultValue={lastName || ''} />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                    <Divider />
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                    >
                                        <Row gutter={16}>
                                            <Col md={24} sm={24}>
                                                <Input defaultValue={email || ''} disabled />
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
                                <Button key="done" type="primary" className='btn'>Save</Button>
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
                                    >
                                        <Row gutter={16}>
                                            <Col md={24} sm={24}>
                                                <Input defaultValue={email || ''} disabled />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                    {/* <div className={`text-right ${classes.resetlink}`}>
                                        <Link href="/" className={classes.resetbtn}>Reset Password</Link>
                                    </div> */}
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

                                <Button key="done" type="primary" className='btn'>Reset Password</Button>
                            </div>
                        )}
                    </TabPane>
                </Tabs>
            </div>
        </Modal>
    );
};

export default ProfileSettings;
