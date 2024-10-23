import { Button, Modal, Input, Select, Avatar, Form, message, Divider } from "antd";
import { useState } from "react";
import dashbaord from "./workspace.module.css";
import userImage from "@/app/assets/images/user.png";
import Image from "next/image";

interface CreateWorkspaceProps {
    name: string;
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
    workSpace: string;
    onSave: (workspaceName: string, anotherValue: string) => void;
    workspaceId: string ;
}

const { Option } = Select;

const users = [
    { id: 1, name: 'Candice Wu', username: '@candice', role: 'Admin', avatar: 'img/avatar1' },
    { id: 2, name: 'Demi Wilkinson', username: '@demi', role: 'User', avatar: 'img/avatar2' },
    { id: 3, name: 'Drew Cano', username: '@drew', role: 'User', avatar: 'img/avatar3' },
];

const CreateWorkspace: React.FC<CreateWorkspaceProps> = ({ isModalOpen, setIsModalOpen, workSpace, onSave, name, workspaceId }) => {
    const [workspaceName, setWorkspaceName] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [anotherValue, setAnotherValue] = useState<string>("");
    const [form] = Form.useForm();
    console.log("workspaceId", workspaceId)
    const handleOk = () => {
        if (!workspaceName.trim()) {
            message.error(`${name} name cannot be empty!`);
            return;
        }

        onSave(workspaceName, anotherValue);
        setIsModalOpen(false);
        setAnotherValue(workspaceId)
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
                    <h5>Create New {name}</h5>
                    <h6>You've created a new {name}! Invite colleagues to collaborate on this {name}.</h6>
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
                    Create {name}
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
                    name={name}
                    label={`${name} Name*`}
                    rules={[{ required: true, message: `Please enter ${name} name` }]}
                >
                    <Input
                        placeholder={`${name} Name`}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                        value={workspaceName}
                    />
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