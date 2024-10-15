"use client";

import React, { useState } from 'react';
import styles from './workspace.module.css';
import Searchbar from '@/app/components/Searchbar/search';
import { Button, Dropdown, message } from 'antd';
import Image from "next/image";
import User1 from '@/app/assets/images/user.jpg';
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import CreateWorkspace from "@/app/modals/create-workspace/create-workspace";
import RoleManagementModal from './modals/role-management/RoleManagementModal';
import DeleteModal from '@/app/modals/delete-modal/delete-modal';

function Workspaces() {
    const [searchInput, setSearchInput] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [entityToDelete, setEntityToDelete] = useState<{ name: string; id: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    };

    const HandleCreateWorkspace = () => {
        setIsModalOpen(true);
    };

    const handleMenuClick = (key: string, entityName: string, entityId: string) => {
        if (key === 'role_manage') {
            setIsRoleModalOpen(true);
        } else if (key === 'delete') {
            setEntityToDelete({ name: entityName, id: entityId });
            setIsDeleteModalOpen(true);
        }
    };

    const handleDelete = async (entityId: string) => {
        setIsLoading(true);
        try {
            // Call your API to delete the entity here
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
            message.success('Deleted successfully');
        } catch (error) {
            message.error('Failed to delete entity');
        } finally {
            setIsLoading(false);
            setIsDeleteModalOpen(false);
        }
    };

    const items = (entityName: string, entityId: string) => [
        {
            label: 'User Management',
            key: 'user_manage',
        },
        {
            label: 'Role Management',
            key: 'role_manage',
            onClick: () => handleMenuClick('role_manage', entityName, entityId),
        },
        {
            label: 'Details',
            key: 'details',
        },
        {
            label: 'Delete',
            key: 'delete',
            onClick: () => handleMenuClick('delete', entityName, entityId),
        },
        {
            label: 'Edit',
            key: 'edit',
        },
    ];

    return (
        <div className={styles.workspacePage}>
            <div className={`${styles.searchView} flex justify-space-between gap-1`}>
                <Searchbar value={searchInput} onChange={handleSearchInputChange} />
                <Button className="btn" onClick={HandleCreateWorkspace}>Create</Button>
            </div>

            <div className={styles.workspaceWrapper}>
                {['KaiNest Workspace', 'Another Workspace'].map((workspace, index) => (
                    <div key={index} className={`flex gap-1 ${styles.workspaceBox}`}>
                        <div className={styles.times}>
                            <span>April, 08</span>
                        </div>
                        <div className={styles.nameList}>
                            <div className={`flex gap-1 ${styles.dropdownList}`}>
                                <h6>{workspace}</h6>
                                <Dropdown menu={{ items: items(workspace, `id-${index}`) }} trigger={['click']}>
                                    <Button
                                        onClick={(e) => {
                                            e.preventDefault();
                                        }}
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
                ))}
            </div>

            <CreateWorkspace
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                workSpace=""
                onSave={(selectedColumns: string[]) => {
                    console.log('Selected columns:', selectedColumns);
                }}
            />

            <RoleManagementModal
                isModalOpen={isRoleModalOpen}
                onClose={() => setIsRoleModalOpen(false)}
            />

            {entityToDelete && (
                <DeleteModal
                    open={isDeleteModalOpen}
                    entityName={entityToDelete.name}
                    entityId={entityToDelete.id}
                    onDelete={handleDelete}
                    onOk={() => setIsDeleteModalOpen(false)}
                    onCancel={() => setIsDeleteModalOpen(false)}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
}

export default Workspaces;
