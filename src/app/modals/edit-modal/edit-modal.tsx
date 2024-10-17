import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Form, message } from 'antd';

interface EditableModalProps {
    open: boolean;
    title: string;
    initialValue: string;
    fieldLabel: string;
    onSubmit: (newValue: string, anotherValue: string) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const EditableModal: React.FC<EditableModalProps> = ({
    open,
    title,
    initialValue,
    fieldLabel,
    onSubmit,
    onCancel,
    isLoading = false
}) => {
    const [form] = Form.useForm();
    const [value, setValue] = useState(initialValue);
    const [internalLoading, setInternalLoading] = useState(false);
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
        if (open) {
            form.setFieldsValue({ name: initialValue });
            validateInput(initialValue);
        }
    }, [initialValue, open]);

    const validateInput = (inputValue: string) => {
        const isEmpty = inputValue.trim() === '';
        setIsValid(!isEmpty);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        validateInput(newValue);
    };

    const handleOk = async () => {
        if (!isValid) {
            message.error(`The ${fieldLabel.toLowerCase()} cannot be empty!`);
            return;
        }
        setInternalLoading(true);
        try {
            await onSubmit(value, initialValue);
            // message.success(`${title} updated successfully!`);
            setInternalLoading(false);
            onCancel();
        } catch (error) {
            setInternalLoading(false);
            message.error(`Failed to update ${title.toLowerCase()}.`);
        }
    };

    return (
        <Modal
            title={title}
            centered
            open={open}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel} className="btn btn-outline">
                    Cancel
                </Button>,
                <Button
                    key="ok"
                    type="primary"
                    onClick={handleOk}
                    className="btn"
                    loading={internalLoading || isLoading}
                    disabled={!isValid}
                >
                    Save
                </Button>,
            ]}
        >
            <Form
                form={form}
                name="editable"
                layout="vertical"
                initialValues={{ name: initialValue }}
                onFinish={handleOk}
            >
                <Form.Item
                    name="name"
                    label={fieldLabel}
                    rules={[
                        {
                            required: true,
                            message: `Please input the ${fieldLabel.toLowerCase()}!`,
                        },
                        {
                            min: 3,
                            message: `The ${fieldLabel.toLowerCase()} must be at least 3 characters.`,
                        },
                    ]}
                >
                    <Input
                        value={value}
                        onChange={handleInputChange}
                        placeholder={`Enter ${fieldLabel.toLowerCase()}`}
                    />
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default EditableModal;
