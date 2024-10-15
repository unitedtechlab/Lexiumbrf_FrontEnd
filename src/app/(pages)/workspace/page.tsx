"use client";

import React, { useState } from 'react';
import styles from './workspace.module.css';
import Searchbar from '@/app/components/Searchbar/search';
import { Button, Dropdown } from 'antd';
import Image from "next/image";
import User1 from '@/app/assets/images/user.jpg';
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import CreateWorkspace from "@/app/modals/create-workspace/create-workspace";
import RoleManagementModal from './modals/role-management/RoleManagementModal';

function Workspaces() {
    const [searchInput, setSearchInput] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    };
    const HandleCreateWorkspace = () => {
        setIsModalOpen(true);
    }
    const handleMenuClick = (key: string) => {
        if (key === 'role_manage') {
            setIsRoleModalOpen(true);
        }
        // Add other menu handling logic here
    }

    const items = [
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
            label: 'Delete',
            key: 'delete',
        },
    ];

    return (
        <div className={styles.workspacePage}>
            <div className={`${styles.searchView} flex justify-space-between gap-1`}>
                <Searchbar value={searchInput} onChange={handleSearchInputChange} />
                <Button className="btn" onClick={HandleCreateWorkspace}>Create</Button>
            </div>

            <div className={styles.workspaceWrapper}>
                <div className={`flex gap-1 ${styles.workspaceBox}`}>
                    <div className={styles.times}>
                        <span>April, 08</span>
                    </div>
                    <div className={styles.nameList}>
                        <div className={`flex gap-1 ${styles.dropdownList}`}>
                            <h6>KaiNest Workspace</h6>
                            <Dropdown menu={{ items }} trigger={['click']}>
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

                <div className={`flex gap-1 ${styles.workspaceBox}`}>
                    <div className={styles.times}>
                        <span>April, 08</span>
                    </div>
                    <div className={styles.nameList}>
                        <div className={`flex gap-1 ${styles.dropdownList}`}>
                            <h6>KaiNest Workspace</h6>
                            <Dropdown menu={{ items }} trigger={['click']}>
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

                <div className={`flex gap-1 ${styles.workspaceBox}`}>
                    <div className={styles.times}>
                        <span>April, 08</span>
                    </div>
                    <div className={styles.nameList}>
                        <div className={`flex gap-1 ${styles.dropdownList}`}>
                            <h6>KaiNest Workspace</h6>
                            <Dropdown menu={{ items }} trigger={['click']}>
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

        </div>
    );
}

export default Workspaces;