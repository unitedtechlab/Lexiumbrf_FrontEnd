"use client";

import { Button, Divider, Input, Tag, message, Pagination } from 'antd';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import classes from './user.module.css';
import { BaseURL } from '@/app/constants';
import { getToken } from '@/utils/auth';
import { AiOutlinePaperClip } from 'react-icons/ai';
import Papa from 'papaparse';

interface UserSettingsModalProps {
    visible: boolean;
    onClose: () => void;
}

interface InvitedUser {
    username: string;
    inviteStatus: string;
    userID: number;
    accountID: number;
}

const UserSettings: React.FC<UserSettingsModalProps> = ({ }) => {
    const [memberInput, setMemberInput] = useState<string>('');
    const [invitedUsers, setInvitedUsers] = useState<InvitedUser[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(3);

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedUsers = invitedUsers.slice(startIndex, startIndex + pageSize);
    console.log("invitedUsers", invitedUsers)
    const fetchInvitedUsers = async () => {
        try {
            const token = getToken();
            if (!token) {
                throw new Error('No token found, please login.');
            }
            const response = await axios.get(`${BaseURL}/enterprise_users?account-type=Enterprise`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const users = response.data.data;
            const userList = Object.keys(users).map(key => ({
                username: key,
                inviteStatus: users[key].InviteStatus,
                userID: users[key].UserID,
                accountID: users[key].AccountID,
            }));
            setInvitedUsers(userList);
            // localStorage.setItem('invitedUsers', JSON.stringify(userList));
        } catch (error) {
            console.error('Error fetching invited users:', error);
        }
    };

    useEffect(() => {
        fetchInvitedUsers();
    }, []);

    const isUserInvited = (username: string): boolean => {
        return invitedUsers.some(user => user.username === username);
    };

    const sendInvite = async (member: string) => {
        if (isUserInvited(member)) {
            message.info(`User ${member} has already been invited.`);
            return;
        }

        try {
            const token = getToken();
            if (!token) {
                throw new Error('No token found, please login.');
            }

            const response = await axios.post(
                `${BaseURL}/enterprise_users?account-type=Enterprise`,
                { emails: [member] },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            message.success(`Invite sent successfully to ${member}!`);
            const newUser = {
                username: member,
                inviteStatus: response.data?.inviteStatus,
                userID: response.data?.userID,
                accountID: response.data?.accountID,
            };

            setInvitedUsers(prevUsers => [...prevUsers, newUser]);
            setMemberInput('');
            fetchInvitedUsers();
        } catch (error) {
            // message.error(`Failed to send invite to ${member}.`);
            console.error('Error:', error);
        }
    };

    const deleteInvitedUser = async (userID: number) => {
        try {
            const token = getToken();
            if (!token) {
                throw new Error('No token found, please login.');
            }
            await axios.delete(`${BaseURL}/enterprise_users?account-type=Enterprise&userID=${userID}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            setInvitedUsers(prevUsers => prevUsers.filter(user => user.userID !== userID));
            message.success(`User deleted successfully!`);
            fetchInvitedUsers();
        } catch (error) {
            // message.error('Failed to delete user.');
            console.error('Error deleting user:', error);
        }
    };

    const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            Papa.parse(file, {
                complete: (result: { data: string[][]; }) => {
                    const csvData = result.data as string[][];
                    const usernames = csvData.map((row) => row[0]);
                    usernames.forEach(username => sendInvite(username));
                },
                header: false,
            });
        }
    };

    const editInvitedUser = async (userID: number, inviteResponse: string) => {
        try {
            const token = getToken();
            if (!token) {
                throw new Error('No token found, please login.');
            }

            const data = {
                inviteResponse: inviteResponse,
                accountID: userID,
            };

            const response = await axios.put(`${BaseURL}/enterprise_users`, data, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            message.success('User invite response updated successfully!');
            setInvitedUsers(prevUsers =>
                prevUsers.map(user =>
                    user.userID === userID ? { ...user, inviteStatus: inviteResponse } : user
                )
            );

        } catch (error) {
            // message.error('Failed to update invite response.');
            console.error('Error editing user:', error);
        }
    };
    const handleCopySharableLink = async () => {
        try {
            const token = getToken();
            if (!token) {
                throw new Error('No token found, please login.');
            }
            const response = await axios.post(
                `${BaseURL}/accounts/create-invite`,
                { account_id: 23 }, 
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            const inviteLink = response.data?.data?.invite_link;
            if (inviteLink) {
                navigator.clipboard.writeText(inviteLink);
                message.success('Sharable link copied to clipboard!');
            } else {
                message.error('Failed to retrieve invite link.');
            }
        } catch (error) {
            console.error('Error generating invite link:', error);
            message.error('Failed to generate invite link.');
        }
    };

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
                {/* <Button className={` ${classes.upgradeButton}`}>Upgrade plan</Button> */}
            </div>

            <div className={`flex gap-1 ${classes.inviteInputSection}`}>
                <div className={`selectCustom ${classes.selectField}`}>
                    <Input
                        placeholder="Add members by username"
                        value={memberInput}
                        onChange={(e) => setMemberInput(e.target.value)}
                        onPressEnter={() => sendInvite(memberInput)}
                        className='custom-input'
                    />
                </div>
                <div className={classes.csvUploadSection}>
                    <label htmlFor="csvUpload" className={classes.csvLabel}>
                        <AiOutlinePaperClip className={classes.attachmentIcon} />
                        Invite by Email (Multiple users by uploading CSV)
                        <input id="csvUpload" type="file" accept=".csv" onChange={handleCSVUpload} className={classes.csvInput} />
                    </label>
                </div>
                <Button type="primary" className={`btn btn-sm ${classes.inviteBtn}`} onClick={handleCopySharableLink}>
                    <AiOutlinePaperClip fontSize={18} />Copy Sharable Link
                </Button>
                <Button type="primary" className={`btn btn-outline btn-sm ${classes.inviteBtn}`} onClick={() => sendInvite(memberInput)}>
                    Invite User
                </Button>
            </div>

            <Divider />

            <h5>Invited Members</h5>
            <table className={classes.invitedMembersTable}>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Invite Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers.map((user) => (
                        <tr key={user.userID}>
                            <td>{user.username}</td>
                            <td>
                                <Tag color={user.inviteStatus === 'NOT_REGISTERED' ? 'orange' : 'green'}>
                                    {user.inviteStatus}
                                </Tag>
                            </td>
                            <td>
                                <Button className={classes.deletebtn} type="link" danger onClick={() => deleteInvitedUser(user.userID)}>
                                    Delete
                                </Button>
                                {/* <Button className={classes.editbtn} onClick={() => editInvitedUser(user.userID, 'true')}>Edit Invite</Button> */}
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>

            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={invitedUsers.length}
                onChange={(page, pageSize) => {
                    setCurrentPage(page);
                    setPageSize(pageSize);
                }}
                showSizeChanger
                showQuickJumper
                className={classes.pagination}
            />
        </div>
    );
};

export default UserSettings;