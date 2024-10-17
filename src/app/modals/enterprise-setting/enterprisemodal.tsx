import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Table, message } from 'antd';
import axios from 'axios';
import { BaseURL } from "@/app/constants/index";
import { getToken, setToken } from "@/utils/auth";
import classes from "./modal.module.css"

interface EnterpriseModalProps {
    open: boolean;
    title: string;
    onSubmit: (value: string) => void;
    onCancel: () => void;
    isLoading: boolean;
}

const EnterpriseModal: React.FC<EnterpriseModalProps> = ({ open, title, onSubmit, onCancel, isLoading }) => {
    const [enterprises, setEnterprises] = useState<Array<{ id: number, name: string }>>([]);

    const handleOk = async () => {
        try {
            console.log("Validation success:");
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    const columns = [
        {
            title: 'Enterprise Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: { id: number, name: string }) => (
                <Button type="link" >
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
                    save
                </Button>,
            ]}
        >
            <div className={classes.modalBody}>
                <Table
                    dataSource={enterprises}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                />
            </div>
        </Modal>
    );
};

export default EnterpriseModal;
