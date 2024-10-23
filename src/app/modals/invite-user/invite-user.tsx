import React from 'react';
import { Modal, Button } from 'antd';

interface InviteModalProps {
    isModalVisible: boolean;
    onClose: () => void;
    onAccept: () => void;
    onDecline: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ isModalVisible, onClose, onAccept, onDecline }) => {
    return (
        <Modal
            title="You've been invited!"
            open={isModalVisible}
            onCancel={onClose}
            footer={[
                <Button key="decline" onClick={onDecline} className="btn btn-delete">
                    Decline
                </Button>,
                <Button  className="btn" key="accept" onClick={onAccept} type="primary">
                    Accept
                </Button>,
            ]}
        >
            <p>Do you want to accept the invitation?</p>
        </Modal>
    );
};

export default InviteModal;
