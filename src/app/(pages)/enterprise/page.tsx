"use client";

import React, { useEffect, useState } from 'react';
import styles from '../workspace/workspace.module.css';
import Searchbar from '@/app/components/Searchbar/search';
import { Button, Dropdown, message } from 'antd';
import Image from "next/image";
import User1 from '@/app/assets/images/user.jpg';
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { BaseURL } from "@/app/constants/index";
import axios from "axios";

function EnterprisePage() {
    const [searchInput, setSearchInput] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [enterpriseData, setEnterpriseData] = useState<any[]>([]);  // Store enterprise data
    const [loading, setLoading] = useState<boolean>(false);  // Loading state

    useEffect(() => {
        const fetchEnterpriseData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/enterprises', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`  // Assuming token is stored in localStorage
                    }
                });
                setEnterpriseData(response.data);  // Set the fetched data
                setLoading(false);
            } catch (error) {
                message.error('Failed to fetch enterprise data');
                setLoading(false);
            }
        };

        fetchEnterpriseData();
    }, []);

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    };
    const HandleCreateWorkspace = () => {
        setIsModalOpen(true);
    }

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
                <div className={`flex gap-1 ${styles.workspaceBox}`}>
                    <div className={styles.times}>
                        <span>April, 08</span>
                    </div>
                    <div className={styles.nameList}>
                        <div className={`flex gap-1 ${styles.dropdownList}`}>
                            <h6>KaiNest Enterprise</h6>
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
                            <h6>KaiNest Enterprise</h6>
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
                            <h6>KaiNest Enterprise</h6>
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

export default EnterprisePage;