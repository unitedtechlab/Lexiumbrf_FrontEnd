import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, message } from 'antd';
import { Enterprise } from '@/app/types/interface';
import { fetchEnterprisesAPI } from '@/app/API/api';
import classes from './modal.module.css';

const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toISOString().split('T')[0];
};

interface EnterpriseModalProps {
    open: boolean;
    title: string;
    onSubmit: (value: string) => void;
    onCancel: () => void;
    isLoading: boolean;
}

const EnterpriseModal: React.FC<EnterpriseModalProps> = ({ open, title, onSubmit, onCancel, isLoading }) => {
    const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
    const [loading, setLoading] = useState(false);

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

    const handleOk = async () => {
        try {
        } catch (error) {
            console.error("Validation failed:", error);
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
            render: (text: string, record: { accountID: number, accountname: string }) => (
                <Button type="link">
                    Edit
                </Button>
            ),
        },
    ];

    return (
        <Modal
            title={title}
            open={open}
            onOk={handleOk}
            onCancel={onCancel}
            confirmLoading={isLoading}
            centered
            cancelText="Cancel"
            footer={[
                <Button key="cancel" onClick={onCancel} className="btn btn-outline">
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleOk}
                    className="btn"
                >
                    Save
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
            </div>
        </Modal>
    );
};

export default EnterpriseModal;
