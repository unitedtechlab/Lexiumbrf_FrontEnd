import { Button, Modal, Input, Select, Avatar, Form, Divider } from "antd";
import { useState } from "react";
import dashbaord from "./workspace.module.css";
import userImage from "@/app/assets/images/user.png";
import Image from "next/image";

interface CreateWorkspaceProps {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
    workSpace: string;
    onSave: (selectedColumns: string[]) => void;
}

const { Option } = Select;

const users = [
    { id: 1, name: 'Candice Wu', username: '@candice', role: 'Admin', avatar: 'img/avatar1' },
    { id: 2, name: 'Demi Wilkinson', username: '@demi', role: 'User', avatar: 'img/avatar2' },
    { id: 3, name: 'Drew Cano', username: '@drew', role: 'User', avatar: 'img/avatar3' },
];

const CreateWorkspace: React.FC<CreateWorkspaceProps> = ({ isModalOpen, setIsModalOpen, workSpace, onSave }) => {
    const [workspaceName, setWorkspaceName] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [form] = Form.useForm();

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
                <div className={dashbaord.ModalHeader}>
                    <div className={dashbaord.userimages}>
                        <Image src={userImage} alt="user image" width={48} height={48} />
                        <Image src={userImage} alt="user image" width={56} height={56} />
                        <Image src={userImage} alt="user image" width={48} height={48} />
                    </div>
                    <h5>Create New Workspace</h5>
                    <h6>You've created a new workspace! Invite colleagues to collaborate on this workspace.</h6>
                </div>
            }
            centered
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel} className="btn btn-outline">
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk} className="btn">
                    Create Workspace
                </Button>,
            ]}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                className="custom_form"
            >
                <Form.Item
                    name="name"
                    label="Workspace Name*"
                >
                    <Input placeholder="Workspace Name" onChange={(e) => setWorkspaceName(e.target.value)} />
                </Form.Item>
                <Divider />
                <Form.Item
                    name="members"
                    label="Members"
                >
                    <Select
                        mode="multiple"
                        placeholder="e.g. Linear"
                        value={selectedMembers}
                        onChange={setSelectedMembers}
                        optionLabelProp="label"
                        style={{ width: '100%' }}
                    >
                        {users.map((user) => (
                            <Option key={user.id} value={user.username} label={user.name}>
                                <div className={`flex gap-1 ${dashbaord.options}`}>
                                    <Image src={userImage} alt="user image" width={38} height={38} />
                                    <div className={dashbaord.selectlist}>
                                        <p>{user.name}</p>
                                        <span>{user.role}</span>
                                    </div>
                                </div>
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateWorkspace;
