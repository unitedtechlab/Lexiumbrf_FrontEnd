import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, message, Input } from 'antd';
import { Enterprise } from '@/app/types/interface';
import { fetchEnterprisesAPI, editEnterpriseAPI } from '@/app/API/api';
import classes from './modal.module.css';
import { FaRegEdit } from "react-icons/fa";

const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toISOString().split('T')[0];
};

interface EnterpriseModalProps {
    open: boolean;
    title: string;
    onCancel: () => void;
    onSubmit: (enterpriseName: string) => Promise<void>;
    isLoading: boolean;
}

const EnterpriseModal: React.FC<EnterpriseModalProps> = ({ open, title, onSubmit, onCancel, isLoading }) => {
    const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingEnterprise, setEditingEnterprise] = useState<Enterprise | null>(null);
    const [enterpriseName, setEnterpriseName] = useState("");

    useEffect(() => {
        if (open) {
            fetchEnterprises();
        }
    }, [open]);

    const fetchEnterprises = async () => {
        setLoading(true);
        try {
            const data = await fetchEnterprisesAPI();
            if (data && data.success) {
                setEnterprises(data.data);
            } else {
                message.error('Failed to fetch enterprises.');
            }
        } catch (error) {
            console.error('Error fetching enterprises:', error);
            message.error('Error fetching enterprises. Check console for details.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (record: Enterprise) => {
        setEditingEnterprise(record);
        setEnterpriseName(record.accountname);
    };

    const handleUpdate = async () => {
        if (!editingEnterprise) return;

        try {
            const updatedEnterprise = {
                ...editingEnterprise,
                accountname: enterpriseName,
            };

            const response = await editEnterpriseAPI(updatedEnterprise);
            if (response && response.success) {
                message.success(`Enterprise "${enterpriseName}" updated successfully!`);
                fetchEnterprises();
                setEditingEnterprise(null);
                setEnterpriseName("");
            } else {
                message.error(`Failed to update enterprise: ${response.data?.error?.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error updating enterprise:", error);
            if (error instanceof Error) {
                message.error(`Error updating enterprise: ${error.message}`);
            } else {
                message.error("An unexpected error occurred. Please check the console for details.");
            }
        }
    };

    const columns = [
        {
            title: 'Enterprise Name',
            dataIndex: 'accountname',
            key: 'accountname',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt: string) => formatDate(createdAt),
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (updatedAt: string) => formatDate(updatedAt),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: Enterprise) => (
                <Button type="link" className={classes.editbtn} onClick={() => handleEdit(record)}>
                    <FaRegEdit />
                </Button>
            ),
        },
    ];

    return (
        <Modal
            title={title}
            open={open}
            onCancel={onCancel}
            confirmLoading={isLoading}
            centered
            cancelText="Cancel"
            footer={[
                <Button key="cancel" onClick={onCancel} className="btn btn-outline">
                    Cancel
                </Button>,
            ]}
        >
            <div className={classes.modalBody}>
                <Table
                    dataSource={enterprises}
                    columns={columns}
                    rowKey="accountID"
                    pagination={false}
                    loading={loading}
                />
                {editingEnterprise && (
                    <div className={`flex gap-1 ${classes.editFrom}`}>
                        <Input
                            value={enterpriseName}
                            onChange={(e) => setEnterpriseName(e.target.value)}
                            placeholder="Enter new enterprise name"
                        />
                        <Button type="primary" onClick={handleUpdate} className='btn btn-sm'>
                            Update
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default EnterpriseModal;
