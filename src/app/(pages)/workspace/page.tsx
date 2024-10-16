"use client";

import React, { useCallback, useEffect, useState } from 'react';
import styles from './workspace.module.css';
import Searchbar from '@/app/components/Searchbar/search';
import { Button, Dropdown, message } from 'antd';
import Image from "next/image";
import User1 from '@/app/assets/images/user.jpg';
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import CreateWorkspace from "@/app/modals/create-workspace/create-workspace";
import RoleManagementModal from './modals/role-management/RoleManagementModal';
import EditableModal from '@/app/modals/edit-modal/edit-modal';
import { BaseURL } from '@/app/constants';
import { getToken } from '@/utils/auth';
import axios from 'axios';

interface WorkspaceData {
    ID: string,
    accountID: string,
    createdAt: string,
    name: string,
    updatedAt: string
}
function Workspaces() {
    const [searchInput, setSearchInput] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [WorkspaceData, setWorkspaceData] = useState<{ [key: string]: WorkspaceData }>({});
    const [workspaceName, setWorkspaceName] = useState<string>("");
    const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null);

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    };
    const HandleCreateWorkspace = () => {
        setIsModalOpen(true);
    }
    const fetchWorkspaceData = useCallback(async () => {
        try {
            const token = getToken();
            setLoading(true);
            const response = await axios.get(`${BaseURL}/workspace?account-type=Enterprise`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setWorkspaceData(response.data.data.workspace); 
            setLoading(false);
        } catch (error) {
            message.error('Failed to fetch enterprise data');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWorkspaceData();
    }, [fetchWorkspaceData]);

    const handleSaveWorkspace = async (workSpaceName: string) => {
        if (!workSpaceName.trim()) {
            console.log("empty", workSpaceName)
            message.error('Enterprise name cannot be empty!');
            return;
        }
        try {
            const token = getToken();
            const response = await axios.post(`${BaseURL}/workspace?account-type=Enterprise`, {
                workSpaceName: workSpaceName,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("response", response);
            if (response.status === 200) {
                message.success('Enterprise created successfully!');
                setIsModalOpen(false);
                setWorkspaceName('');
                fetchWorkspaceData();
            }
        } catch (error) {
            message.error('Failed to create enterprise');
        }
    }
    const handleMenuClick = (key: string) => {
        if (key === 'role_manage') {
            setIsRoleModalOpen(true);
        }
    }

    const handleEditSubmit = async (workSpaceName: string, workSpaceID: string) => {
        setLoading(true);
        try {
            const token = getToken();
            const response = await axios.put(`${BaseURL}/enterprises?account-type=Enterprise`, {
                workSpaceName: workSpaceName,
                workSpaceID: workSpaceID,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                message.success('Enterprise updated successfully!');
                setWorkspaceData((prevData) => ({
                    ...prevData,
                    [workSpaceID]: {
                        ...prevData[workSpaceID],
                        name: workSpaceName
                    }
                }));
            }
        } catch (error) {
            message.error('Failed to update enterprise.');
        } finally {
            setLoading(false);
            setIsEditModalOpen(false);
        }
    }

    const handleEditWorkspaceName = (ID :string) => {
        setCurrentWorkspaceId(ID); 
        setIsEditModalOpen(true);
    };

    const handleCancel = () => {
        setIsEditModalOpen(false);
    };

    const items = (ID: string) => [
        {
            label: 'User Management',
            key: 'user_manage',
        },
        {
            label: 'Role Management',
            key: 'role_manage',
            onClick: () => handleMenuClick('role_manage')
        },
        {
            label: 'Details',
            key: 'details',
        },
        {
            label: 'Edit',
            key: 'edit',
            onClick: () => {
                handleEditWorkspaceName(ID);
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
                <Button className="btn" onClick={HandleCreateWorkspace}>Create</Button>
            </div>

            <div className={styles.workspaceWrapper}>
                {Object.keys(WorkspaceData).length > 0 ? (
                    Object.values(WorkspaceData).map((workspace: WorkspaceData) => (
                        <div key={workspace.ID} className={`flex gap-1 ${styles.workspaceBox}`}>
                            <div className={styles.times}>
                                <span>{formatDate(workspace.createdAt)}</span>
                            </div>
                            <div className={styles.nameList}>
                                <div className={`flex gap-1 ${styles.dropdownList}`}>
                                    <h6>{workspace.name}</h6>
                                    <Dropdown menu={{ items: items(workspace.ID) }}trigger={['click']}>
                                        <Button
                                            onClick={(e) => e.preventDefault()}
                                            className={styles.btnDropdown}
                                        >
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
                    ))
                ) : (
                    <p>No Workspace exists</p>
                )}
            </div>
            <CreateWorkspace
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                workSpace=""
                onSave={handleSaveWorkspace} name={'Workspace'} />

            <EditableModal
                open={isEditModalOpen}
                title="Edit Enterprise"
                initialValue={"WorkspaceData?.accountname"}
                fieldLabel="Enterprise Name"
               onSubmit={(workSpaceName) => handleEditSubmit(workSpaceName, currentWorkspaceId!)}
                onCancel={handleCancel}
                isLoading={loading}
            />
            <RoleManagementModal
                isModalOpen={isRoleModalOpen}
                onClose={() => setIsRoleModalOpen(false)}
            />

        </div>
    );
}

export default Workspaces;