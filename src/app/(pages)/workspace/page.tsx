"use client";

import React, { useState } from 'react';
import styles from './workspace.module.css';
import Searchbar from '@/app/components/Searchbar/search';
import { Button, Dropdown } from 'antd';
import Image from "next/image";
import User1 from '@/app/assets/images/user.jpg';
import { HiOutlineDotsHorizontal } from "react-icons/hi";

function Workspaces() {
    const [searchInput, setSearchInput] = useState("");

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
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
            label: 'Delete',
            key: 'delete',
        },
    ];

    return (
        <div className={styles.workspacePage}>
            <div className={`${styles.searchView} flex justify-space-between gap-1`}>
                <Searchbar value={searchInput} onChange={handleSearchInputChange} />
                <Button className="btn">Create</Button>
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
        </div>
    );
}

export default Workspaces;