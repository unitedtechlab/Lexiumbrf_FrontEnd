"use client";

import { Button, Divider, Select, Modal, Tag, Avatar } from 'antd';
import React, { useState } from 'react';
import classes from './user.module.css';
import Image from "next/image";
import userImage from "@/app/assets/images/user.png";

interface UserSettingsModalProps {
    visible: boolean;
    onClose: () => void;
}

const UserSettings: React.FC<UserSettingsModalProps> = ({ visible, onClose }) => {
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const memberOptions = [
        { value: 'Richard', label: 'Richard', avatar: userImage, status: "Accepted", },
        { value: 'Sophia', label: 'Sophia', avatar: userImage, status: "Rejected", },
        { value: 'Ryan', label: 'Ryan', avatar: userImage, status: "Invite Sent", },
    ];

    return (
        <div className={classes.userSettingModal}>
            <div className={classes.headerWrap}>
                <h5>Members</h5>
                <p>Manage who has access to this Enterprise.</p>
            </div>
            <Divider />

            <div className={`flex gap-1 ${classes.manageMembersSection}`}>
                <div className={classes.userText}>
                    <h6>Manage members</h6>
                    <p>To manage administrators, upgrade to enterprise pro plan.</p>
                </div>
                <Button className={classes.upgradeButton}>Upgrade plan</Button>
            </div>

            <div className={`flex gap-1 ${classes.inviteInputSection}`}>
                <div className={`select-custom ${classes.selectField}`}>
                    <Select
                        mode="multiple"
                        placeholder="Add members by username"
                        value={selectedMembers}
                        onChange={setSelectedMembers}
                        optionLabelProp="label"
                        className={classes.memberSelect}
                    >
                        {memberOptions.map((option) => (
                            <Select.Option key={option.value} value={option.value} label={option.label}>
                                <div className={`flex gap-1 ${classes.options}`}>
                                    <div className={`flex gap-1 ${classes.optionsName}`}>
                                        <Image src={option.avatar} alt={option.label} width={38} height={38} />
                                        <div className={classes.selectlist}>
                                            <h6>{option.label}</h6>
                                            <span>@{option.value.toLowerCase()}</span>
                                        </div>
                                    </div>
                                    <div className={`flex ${classes.optionBtns}`}>
                                        <Tag color={
                                            option.status === "Accepted"
                                                ? "green"
                                                : option.status === "Rejected"
                                                    ? "red"
                                                    : "orange"
                                        }>
                                            {option.status}
                                        </Tag>
                                        <Button type="link" className={classes.revokeButton}>Revoke</Button>
                                    </div>
                                </div>
                            </Select.Option>
                        ))}
                    </Select>
                </div>
                <div className='flex gap-1 no-wrap'>
                    <Button type="primary" className={`btn btn-outline ${classes.inviteBtn}`}>
                        Add Users
                    </Button>
                    <Button type="primary" className={`btn ${classes.inviteBtn}`}>
                        Send Invite
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UserSettings;
