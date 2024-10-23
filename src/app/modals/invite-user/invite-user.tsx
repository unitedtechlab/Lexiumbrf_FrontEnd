import React from 'react';
import { Modal, Button, message } from 'antd';
import axios from 'axios';
import { BaseURL } from '@/app/constants';
import { getToken } from '@/utils/auth';

interface InviteModalProps {
    isModalVisible: boolean;
    onClose: () => void;
    onAccept: () => void;
    onDecline: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ isModalVisible, onClose, onAccept, onDecline }) => {
    const handleApiCall = async (inviteResponse: boolean) => {
        try {
            const token = getToken();
            if (!token) {
                throw new Error('No token found, please login.');
            }
            const response = await axios.put(`${BaseURL}/enterprise_users`,
                {
                    inviteResponse: inviteResponse.toString(),
                    accountID: 23
                },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200 && response.data.success) {
                message.success(inviteResponse ? 'Invite Accepted' : 'Invite Declined');
                onClose();
            } else {
                message.error('Something went wrong. Please try again.');
            }
        } catch (error) {
            message.error('Error occurred while processing your request.');
        }
    };
    return (
        <Modal
            title="You've been invited!"
            open={isModalVisible}
            onCancel={onClose}
            footer={[
                <Button key="decline" onClick={() => handleApiCall(false)} danger>
                    Decline
                </Button>,
                <Button key="accept" onClick={() => handleApiCall(true)} type="primary">
                    Accept
                </Button>,
            ]}
        >
            <p>Do you want to accept the invitation?</p>
        </Modal>
    );
};

export default InviteModal;
