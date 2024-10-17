"use client";

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button } from 'antd';
import Image from 'next/image';
import Logo from '@/app/assets/images/logo.png';
import CollapsedLogo from '@/app/assets/images/logo-collapsed.svg';
import sidebarStyles from './sidebar.module.css';
import Link from 'next/link';
import { BiGitBranch } from "react-icons/bi";
import { FaFileLines } from "react-icons/fa6";
import { RiDashboard2Fill } from "react-icons/ri";
import { BiSolidPlaneTakeOff, BiSolidUserDetail } from "react-icons/bi";

const { Sider } = Layout;

type SidebarMenuProps = {
    collapsed: boolean;
    onCollapse: () => void;
};

const SidebarMenu = ({ collapsed, onCollapse }: SidebarMenuProps) => {
    const [selectedKeys, setSelectedKeys] = useState<string[]>(['1']);

    const sidebarItems = [
        {
            key: '1',
            icon: <RiDashboard2Fill />,
            label: <Link href="/workspace">Workspace</Link>,
        },
        {
            key: '2',
            icon: <FaFileLines />,
            label: <Link href="/create-workspace">Dashboard & Visualization</Link>,
        },
        {
            key: '3',
            icon: <BiSolidPlaneTakeOff />,
            label: <Link href="/data-storage">Workflows & Rules</Link>,
        },
        {
            key: '4',
            icon: <BiGitBranch />,
            label: <Link href="/workflows-list">Rules Management</Link>,
        },
        {
            key: '5',
            icon: <BiSolidUserDetail />,
            label: <Link href="/userManagement">User Management</Link>,
        },
    ];

    const handleMenuClick = (key: string) => {
        setSelectedKeys([key]);
    };


    return (
        <Sider trigger={null} collapsible collapsed={collapsed} className={sidebarStyles.sidebarMain} theme="light" width={280}>
            <div className={sidebarStyles.logo}>
                <Link href="/dashboard">
                    <Image src={collapsed ? CollapsedLogo : Logo} alt='logo image' width={collapsed ? 50 : 220} priority />
                </Link>
            </div>
            <Menu
                className="menuSider"
                theme="light"
                mode="inline"
                // defaultSelectedKeys={['1']}
                selectedKeys={selectedKeys}
                items={sidebarItems}
                onClick={({ key }) => handleMenuClick(key)}
            />
        </Sider>
    );
};

export default SidebarMenu;
