"use client";

import React, { useEffect, useState } from 'react';
import styles from '../project.module.css';
import Searchbar from '@/app/components/Searchbar/search';
import { Button, Dropdown, Empty, message } from 'antd';
import Image from "next/image";
import User1 from '@/app/assets/images/user.jpg';
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import BreadCrumb from "@/app/components/Breadcrumbs/breadcrumb";
import CreateProjectModal from '@/app/modals/create-workspace/create-workspace';
import { fetchProjectsAPI, createProjectAPI } from '@/app/API/projects';

interface ProjectPageProps {
    params: {
        id: number;
    };
}

const Projects = ({ params }: ProjectPageProps) => {
    const { id: workSpaceID } = params;
    const [breadcrumbs, setBreadcrumbs] = useState<{ href: string; label: string }[]>([]);
    const [searchInput, setSearchInput] = useState('');
    const [projects, setProjects] = useState<any[]>([]);
    const convertWorkspaceId = workSpaceID.toString();

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    };

    useEffect(() => {
        setBreadcrumbs([{ href: `/workspace`, label: `Workspace` }]);
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        const projectsData = await fetchProjectsAPI(convertWorkspaceId);
        if (projectsData) {
            setProjects(projectsData);
        }
    };

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

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleSave = async (projectName: string, workSpaceID: string) => {
        const success = await createProjectAPI(projectName, workSpaceID);
        if (success) {
            setIsModalOpen(false);
            fetchProjects();
        }
    };

    return (
        <div className={styles.workspacePage}>
            <BreadCrumb breadcrumbs={breadcrumbs} />
            <div className={`${styles.searchView} flex justify-space-between gap-1`}>
                <Searchbar value={searchInput} onChange={handleSearchInputChange} />
                <Button className="btn" onClick={showModal}>Create Project</Button>
            </div>

            <div className={styles.workspaceWrapper}>
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <div className={`flex gap-1 ${styles.workspaceBox}`} key={project.id}>
                            <div className={styles.times}>
                                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className={styles.nameList}>
                                <div className={`flex gap-1 ${styles.dropdownList}`}>
                                    <h6>{project.name}</h6>
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
                    ))
                ) : (
                    <div className="not-found">
                        <Empty description="No Projects exist" />
                    </div>
                )}
            </div>

            <CreateProjectModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                workSpace="Project"
                onSave={(projectName, workSpaceID) => handleSave(projectName, workSpaceID)}
                name="Project"
                workspaceId={convertWorkspaceId}
            />
        </div>
    );
};

export default Projects;
