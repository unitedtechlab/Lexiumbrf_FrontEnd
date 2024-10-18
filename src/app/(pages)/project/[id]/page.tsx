"use client";

import React, { useEffect, useState } from 'react';
import styles from '../project.module.css';
import Searchbar from '@/app/components/Searchbar/search';
import { Button, Dropdown } from 'antd';
import Image from "next/image";
import User1 from '@/app/assets/images/user.jpg';
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import BreadCrumb from "@/app/components/Breadcrumbs/breadcrumb";

function Projects() {
    const [breadcrumbs, setBreadcrumbs] = useState<{ href: string; label: string }[]>([]);
    const [searchInput, setSearchInput] = useState("");

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    };

    useEffect(() => {
        setBreadcrumbs([
            { href: `/workspace`, label: `Workspace` }
        ]);
    }, []);

    const items = [
        {
            label: 'User Management',
            key: 'user_manage',
        },
        {
            label: 'Edit',
            key: 'edit',
        },
        {
            label: 'Delete',
            key: 'delete',
        },
    ];

    return (
        <div className={styles.workspacePage}>
            <BreadCrumb breadcrumbs={breadcrumbs} />
            <div className={`${styles.searchView} flex justify-space-between gap-1`}>
                <Searchbar value={searchInput} onChange={handleSearchInputChange} />
                <Button className="btn">Create Project</Button>
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

export default Projects;