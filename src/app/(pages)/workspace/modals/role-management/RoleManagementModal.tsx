import React, { useState, useEffect } from 'react';
import { Modal, Checkbox, Table, Button, Divider } from 'antd';
import axios from 'axios';
import { RoleData, RoleManagementModalProps } from '@/app/types/workspace';
import { getToken } from '@/utils/auth';
import { BaseURL } from '@/app/constants';

const RoleManagementModal: React.FC<RoleManagementModalProps> = ({ isModalOpen, onClose, workspaceId }) => {
    const [dataSource, setDataSource] = useState<RoleData[]>([]);
    const [invitedUsers, setInvitedUsers] = useState<any[]>([]);
    const functionalities = ['Data Upload', 'Pre validation', 'Pre processing', 'Clean Data Management'];

    const fetchInvitedUsers = async () => {
        try {
            const token = getToken();
            if (!token) {
                throw new Error('No token found, please login.');
            }
            const response = await axios.get(`${BaseURL}/roles?account-type=Enterprise&workspaceID=20`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });    
            console.log('API Response:', response); 
    
            const usersData = response.data.data.users; 
            setInvitedUsers(usersData);
            console.log("`Invited Users`:", usersData);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    // const transformedData = invitedUsers.flatMap((user) =>
    //     functionalities.map((functionality) => ({
    //         key: `${user.userID}-${functionality}`,
    //         functionality,
    //         adminRead: user.adminRead || false,
    //         adminWrite: user.adminWrite || false,
    //         userRead: user.userRead || false,
    //         userWrite: user.userWrite || false,
    //     }))
    // );

    useEffect(() => {
        if (isModalOpen) {
            fetchInvitedUsers();
        }
    }, [isModalOpen]);
    
    useEffect(() => {
        console.log('Invited Users:', invitedUsers); // Check what is inside invitedUsers
        if (invitedUsers) {
            const transformedData = invitedUsers.flatMap((user) =>
                functionalities.map((functionality) => ({
                    key: `${user.userID}-${functionality}`,
                    functionality,
                    adminRead: user.adminRead,
                    adminWrite: user.adminWrite,
                    userRead: user.userRead,
                    userWrite: user.userWrite,
                }))
            );
            setDataSource(transformedData);
        }
    }, [invitedUsers]);

    const handleCheckboxChange = (key: string, field: keyof RoleData) => (e: any) => {
        const updatedData = dataSource.map((item) => {
            if (item.key === key) {
                return { ...item, [field]: e.target.checked };
            }
            return item;
        });
        setDataSource(updatedData);
    };

    const columns = [
        {
            title: 'Functionality',
            dataIndex: 'functionality',
            key: 'functionality',
        },
        {
            title: 'Admin',
            children: [
                {
                    title: 'Read',
                    dataIndex: 'adminRead',
                    key: 'adminRead',
                    render: (_: any, record: RoleData) => (
                        <Checkbox
                            checked={record.adminRead}
                            onChange={handleCheckboxChange(record.key, 'adminRead')}
                        />
                    ),
                },
                {
                    title: 'Write',
                    dataIndex: 'adminWrite',
                    key: 'adminWrite',
                    render: (_: any, record: RoleData) => (
                        <Checkbox
                            checked={record.adminWrite}
                            onChange={handleCheckboxChange(record.key, 'adminWrite')}
                        />
                    ),
                },
            ],
        },
        {
            title: 'User',
            children: [
                {
                    title: 'Read',
                    dataIndex: 'userRead',
                    key: 'userRead',
                    render: (_: any, record: RoleData) => (
                        <Checkbox
                            checked={record.userRead}
                            onChange={handleCheckboxChange(record.key, 'userRead')}
                        />
                    ),
                },
                {
                    title: 'Write',
                    dataIndex: 'userWrite',
                    key: 'userWrite',
                    render: (_: any, record: RoleData) => (
                        <Checkbox
                            checked={record.userWrite}
                            onChange={handleCheckboxChange(record.key, 'userWrite')}
                        />
                    ),
                },
            ],
        },
    ];

    return (
        <Modal
            open={isModalOpen}
            onCancel={onClose}
            title="Role Management"
            footer={[
                <Button key="addRole" type="link">
                    Add New Role
                </Button>,
                <Button className="btn" key="done" type="primary" onClick={onClose}>
                    Done
                </Button>,
            ]}
        >
            <p>Manage roles for invited users and functionalities.</p>
            <Divider />
            <Table columns={columns} dataSource={dataSource} pagination={false} />
        </Modal>
    );
};

export default RoleManagementModal;
