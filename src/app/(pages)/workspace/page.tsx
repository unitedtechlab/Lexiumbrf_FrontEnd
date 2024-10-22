"use client";

import React, { useCallback, useEffect, useState } from 'react';
import styles from './workspace.module.css';
import Searchbar from '@/app/components/Searchbar/search';
import { Button, Dropdown, message, Empty } from 'antd';
import Image from "next/image";
import User1 from '@/app/assets/images/user.jpg';
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { BaseURL } from '@/app/constants';
import { getToken } from '@/utils/auth';
import axios from 'axios';
import RoleManagementModal from './modals/role-management/RoleManagementModal';
import CreateWorkspace from "@/app/modals/create-workspace/create-workspace";
import EditableModal from '@/app/modals/edit-modal/edit-modal';
import DeleteModal from '@/app/modals/delete-modal/delete-modal';
import type { MenuProps } from 'antd';
import BreadCrumb from "@/app/components/Breadcrumbs/breadcrumb";
import Link from 'next/link';

interface WorkspaceData {
    ID: string,
    accountID: string,
    createdAt: string,
    name: string,
    updatedAt: string
}
function Workspaces() {
    const [breadcrumbs, setBreadcrumbs] = useState<{ href: string; label: string }[]>([]);
    const [searchInput, setSearchInput] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [WorkspaceData, setWorkspaceData] = useState<{ [key: string]: WorkspaceData }>({});
    const [workspaceName, setWorkspaceName] = useState<string>("");
    const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [entityToDelete, setEntityToDelete] = useState({ name: '', id: '' });

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    };

    const HandleCreateWorkspace = () => {
        setIsModalOpen(true);
    };

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
        } catch (error) {
            message.error('Failed to fetch Workspace data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWorkspaceData();
        setBreadcrumbs([
            { href: `/dashboard`, label: `Dashboard` }
        ]);
    }, [fetchWorkspaceData]);

    const handleSaveWorkspace = async (workSpaceName: string) => {
        if (!workSpaceName.trim()) {
            message.error('Workspace name cannot be empty!');
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
            if (response.status === 200) {
                message.success('Workspace created successfully!');
                setIsModalOpen(false);
                setWorkspaceName('');
                fetchWorkspaceData();
            }
        } catch (error) {
            message.error('Failed to create Workspace');
        }
    };

    const handleMenuClick = (key: string) => {
        if (key === 'role_manage') {
            setIsRoleModalOpen(true);
        }
    };

    const handleEditSubmit = async (workSpaceName: string, workSpaceID: string) => {
        setLoading(true);
        try {
            const token = getToken();
            const response = await axios.put(`${BaseURL}/workspace?account-type=Enterprise`, {
                workSpaceName: workSpaceName,
                workSpaceID: workSpaceID,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                message.success('Workspace updated successfully!');
                setWorkspaceData((prevData) => ({
                    ...prevData,
                    [workSpaceID]: {
                        ...prevData[workSpaceID],
                        name: workSpaceName
                    }
                }));
                await fetchWorkspaceData();
            }
        } catch (error) {
            message.error('Failed to update Workspace.');
        } finally {
            setLoading(false);
            setIsEditModalOpen(false);
        }
    };

    const handleEditWorkspaceName = (ID: string) => {
        setCurrentWorkspaceId(ID);
        setIsEditModalOpen(true);
    };

    const handleCancel = () => {
        setIsEditModalOpen(false);
    };

    const handleOpenDeleteModal = (name: string, id: string) => {
        setEntityToDelete({ name, id });
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        setLoading(true);
        try {
            const token = getToken();
            const response = await axios.delete(`${BaseURL}/workspace?account-type=Enterprise&workspaceID=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                message.success('Workspace deleted successfully!');
                setWorkspaceData((prevData) => {
                    const updatedData = { ...prevData };
                    delete updatedData[id];
                    return updatedData;
                });
                setCurrentWorkspaceId(null);
            }
        } catch (error) {
            message.error('Failed to delete workspace.');
        } finally {
            setLoading(false);
            setIsDeleteModalOpen(false);
        }
    };

    const handleOk = () => {
        setIsDeleteModalOpen(false);
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
    };

    const items: (workspace: WorkspaceData) => MenuProps['items'] = (workspace) => [
        {
            label: 'User Management',
            key: 'user_manage',
        },
        {
            label: 'Role Management',
            key: 'role_manage',
            onClick: () => handleMenuClick('role_manage'),
        },
        {
            label: (
                <span style={{ color: "orange" }}>
                    Details
                </span>
            ),
            key: 'details',
        },
        {
            label: (
                <span style={{ color: "green" }}>
                    Edit
                </span>
            ),
            key: 'edit',
            onClick: () => {
                handleEditWorkspaceName(workspace.ID);
            },
        },
        {
            label: (
                <span style={{ color: "red" }}>
                    Delete
                </span>
            ),
            key: 'delete',
            onClick: () => {
                handleOpenDeleteModal(workspace.name, workspace.ID);
            },
        },
    ];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    };

    return (
        <div className={styles.workspacePage}>
            <BreadCrumb breadcrumbs={breadcrumbs} />
            <div className={`${styles.searchView} flex justify-space-between gap-1`}>
                <Searchbar value={searchInput} onChange={handleSearchInputChange} />
                <Button className="btn" onClick={HandleCreateWorkspace}>Create Workspace</Button>
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
                                    <h6>
                                        <Link href={`/project/${workspace.ID}`}>{workspace.name}</Link>
                                    </h6>
                                    <Dropdown menu={{ items: items(workspace) }} trigger={['click']}>
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
                    <div className='not-found'>
                        <Empty description="No Workspace exists" />
                    </div>
                )}
            </div>
            <CreateWorkspace
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                workSpace=""
                onSave={handleSaveWorkspace} name={'Workspace'} />

            <EditableModal open={isEditModalOpen}
                title="Edit Workspace"
                initialValue={currentWorkspaceId ? WorkspaceData[currentWorkspaceId]?.name : 'Edit Workspace Name'}
                fieldLabel="Workspace Name"
                onSubmit={(workSpaceName) => handleEditSubmit(workSpaceName, currentWorkspaceId!)}
                onCancel={handleCancel}
                isLoading={loading}
            />
            <DeleteModal
                open={isDeleteModalOpen}
                entityName={entityToDelete.name}
                entityId={entityToDelete.id}
                onDelete={handleDelete}
                onOk={handleOk}
                onCancel={handleDeleteCancel}
                isLoading={loading}
            />
            <RoleManagementModal
                isModalOpen={isRoleModalOpen}
                onClose={() => setIsRoleModalOpen(false)}  workspaceId={currentWorkspaceId!}              
            />

        </div>
    );
}

export default Workspaces;