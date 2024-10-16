"use client";

import React, { useCallback, useEffect, useState } from 'react';
import styles from '../workspace/workspace.module.css';
import Searchbar from '@/app/components/Searchbar/search';
import { Button, Dropdown, Menu, message } from 'antd';
import Image from "next/image";
import User1 from '@/app/assets/images/user.jpg';
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { BaseURL } from "@/app/constants/index";
import axios from "axios";
import { getToken } from '@/utils/auth';
import CreateWorkspace from '@/app/modals/create-workspace/create-workspace';
import EditableModal from '@/app/modals/edit-modal/edit-modal';
import type MenuInfo from 'rc-menu';

interface EnterpriseData {
    accountID: string,
    accountname: string,
    createdAt: string,
    updatedAt: string
}
function EnterprisePage() {
    const [searchInput, setSearchInput] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [enterpriseData, setEnterpriseData] = useState<EnterpriseData | null>(null);  // Store enterprise data
    const [loading, setLoading] = useState<boolean>(false);
    const [enterpriseName, setEnterpriseName] = useState<string>("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchEnterpriseData = useCallback(async () => {
        try {
            const token = getToken();
            setLoading(true);
            const response = await axios.get(`${BaseURL}/enterprises?account-type=Enterprise`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEnterpriseData(response.data.data);  // Set the fetched data
            setLoading(false);
        } catch (error) {
            message.error('Failed to fetch enterprise data');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEnterpriseData();
    }, [fetchEnterpriseData]);

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    };

    const handleSaveEnterprise = async (enterpriseName: string) => {
        if (!enterpriseName.trim()) {
            console.log("empty", enterpriseName)
            message.error('Enterprise name cannot be empty!');
            return;
        }
        try {
            const token = getToken();
            const response = await axios.post(`${BaseURL}/enterprises?account-type=Enterprise`, {
                enterpriseName: enterpriseName,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("response", response);
            if (response.status === 200) {
                message.success('Enterprise created successfully!');
                setIsModalOpen(false);
                setEnterpriseName('');
                fetchEnterpriseData();
            }
        } catch (error) {
            message.error('Failed to create enterprise');
        }
    };

    const HandleCreateEnterprise = () => {
        setIsModalOpen(true);
    }
    const handleEditEnterpriseName = () => {
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (enterpriseName: string, othervalue: string) => {
        setLoading(true);
        try {
            const token = getToken();
            const response = await axios.put(`${BaseURL}/enterprises?account-type=Enterprise`, {
                enterpriseName: enterpriseName,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                message.success('Enterprise updated successfully!');
                setEnterpriseData((prevData) =>
                    prevData ? { ...prevData, accountname: enterpriseName } : null
                );
            }
        } catch (error) {
            message.error('Failed to update enterprise.');
        } finally {
            setLoading(false);
            setIsEditModalOpen(false);
        }
    };

    const handleCancel = () => {
        setIsEditModalOpen(false);
    };
    const items = [
        {
            label: 'User Management',
            key: 'user_manage',
        },
        {
            label: 'Role Management',
            key: 'role_manage',
        },
        {
            label: 'Details',
            key: 'details',
        },
        {
            label: 'Edit',
            key: 'edit',
            onClick: () => {
                handleEditEnterpriseName();
            },
        },
        {
            label: 'Delete',
            key: 'delete',
        },
    ];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    };

    return (
        <div className={styles.workspacePage}>
            <div className={`${styles.searchView} flex justify-space-between gap-1`}>
                <Searchbar value={searchInput} onChange={handleSearchInputChange} />
                <Button className="btn" onClick={HandleCreateEnterprise}>Create</Button>
            </div>

            <div className={styles.workspaceWrapper}>
                <div className={`flex gap-1 ${styles.workspaceBox}`}>
                    <div className={styles.times}>
                        <span>{enterpriseData ? formatDate(enterpriseData.createdAt) : 'Date'}</span>
                    </div>
                    <div className={styles.nameList}>
                        <div className={`flex gap-1 ${styles.dropdownList}`}>
                            <h6>{enterpriseData?.accountname || 'No Enterprise Found'}</h6>
                            <Dropdown overlay={
                                <Menu>
                                    {items.map(item => (
                                        <Menu.Item key={item.key} onClick={item.onClick}>
                                            {item.label}
                                        </Menu.Item>
                                    ))}
                                </Menu>
                            } trigger={['click']}>
                                <Button onClick={(e) => e.preventDefault()} className={styles.btnDropdown}>
                                    <HiOutlineDotsHorizontal />
                                </Button>
                            </Dropdown>
                        </div>
                        <div className={styles.usersImages}>
                            <Image src={User1} alt="Users Image" width={26} height={26} loading="lazy" />
                            <Image src={User1} alt="Users Image" width={26} height={26} loading="lazy" />
                            <Image src={User1} alt="Users Image" width={26} height={26} loading="lazy" />
                            <Image src={User1} alt="Users Image" width={26} height={26} loading="lazy" />
                        </div>
                    </div>
                </div>
            </div>

            <CreateWorkspace
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                workSpace="Enterprise"
                onSave={handleSaveEnterprise} name={'Enterprise'} />

            <EditableModal
                open={isEditModalOpen}
                title="Edit Enterprise"
                initialValue={enterpriseData?.accountname || ''}
                fieldLabel="Enterprise Name"
                onSubmit={(enterpriseName: string, someOtherValue: string) => handleEditSubmit(enterpriseName, "someOtherValue")}
                onCancel={handleCancel}
                isLoading={loading}
            />
        </div>
    );
}

export default EnterprisePage;