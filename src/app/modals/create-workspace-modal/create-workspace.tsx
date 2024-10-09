import { Button, Modal, Input, Select, Avatar } from "antd";
import { useState } from "react";
import dashbaord from "@/app/(pages)/dashboard/dashboard.module.css";
import userImage from "@/app/assets/images/user.png";
// import classes from './createworkspace.module.css';
interface CreateWorkspaceProps {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
    workSpace: string;
    onSave: (selectedColumns: string[]) => void;
}

const { Option } = Select;

const users = [
    { id: 1, name: 'Candice Wu', username: '@candice', role: 'Admin', avatar: 'path/to/avatar1' },
    { id: 2, name: 'Demi Wilkinson', username: '@demi', role: 'User', avatar: 'path/to/avatar2' },
    { id: 3, name: 'Drew Cano', username: '@drew', role: 'User', avatar: 'path/to/avatar3' },
];

const CreateWorkspace: React.FC<CreateWorkspaceProps> = ({ isModalOpen, setIsModalOpen, workSpace, onSave }) => {
    const [workspaceName, setWorkspaceName] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    const handleOk = () => {
        onSave(selectedMembers);
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <Modal
            title={
                <div  className={dashbaord.modalTitle}>
                    <Avatar.Group maxCount={3}>
                        {users.map((user) => (
                            <Avatar key={user.id} src={user.avatar} />
                        ))}
                    </Avatar.Group>
                    <h3>Create New Workspace</h3>
                    <h5>You've created a new workspace! Invite colleagues to collaborate on this workspace.</h5>
                </div>
            }
            centered
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel} className={dashbaord.btnCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk} className={dashbaord.btnGreen}>
                    Create Workspace
                </Button>,
            ]}
        >
            <div style={{ marginBottom: 16 }}>
                <label>Workspace name*</label>
                <Input
                    placeholder="e.g. Linear"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                />
            </div>

            <div style={{ marginBottom: 16 }}>
                <label>Members</label>
                <Select
                    mode="multiple"
                    placeholder="e.g. Linear"
                    value={selectedMembers}
                    onChange={setSelectedMembers}
                    style={{ width: '100%' }}
                >
                    {users.map((user) => (
                        <Option key={user.id} value={user.username}>
                            <Avatar src={user.avatar} style={{ marginRight: 8 }} />
                            {user.name} <span style={{ color: 'gray' }}>({user.role})</span>
                        </Option>
                    ))}
                </Select>
            </div>
        </Modal>
    );
};

export default CreateWorkspace;
