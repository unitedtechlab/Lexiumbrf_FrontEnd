"use client";

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button } from 'antd';
import Image from 'next/image';
import Logo from '@/app/assets/images/logo.png';
import CollapsedLogo from '@/app/assets/images/logo-collapsed.svg';
import sidebarStyles from './sidebar.module.css';
// import { useTheme } from '../../context/ThemeContext';
import Link from 'next/link';
import { BiGitBranch } from "react-icons/bi";
import { FaFileLines } from "react-icons/fa6";
import { RiDashboard2Fill } from "react-icons/ri";
import { BiSolidPlaneTakeOff } from "react-icons/bi";

const { Sider } = Layout;

type SidebarMenuProps = {
    collapsed: boolean;
    onCollapse: () => void;
};

// type Theme = 'light' | 'dark';

// const isValidTheme = (theme: string): theme is Theme => {
//     return theme === 'light' || theme === 'dark';
// };

const SidebarMenu = ({ collapsed, onCollapse }: SidebarMenuProps) => {
    // const { theme, setTheme } = useTheme();
    const [selectedKeys, setSelectedKeys] = useState<string[]>(['1']);

    // useEffect(() => {
    //     const storedTheme = localStorage.getItem('theme');
    //     if (storedTheme && isValidTheme(storedTheme)) {
    //         setTheme(storedTheme);
    //     }
    // }, [setTheme]);

    const sidebarItems = [
        {
            key: '1',
            icon: <RiDashboard2Fill />,
            label: <Link href="/dashboard">Workspace</Link>,
        },
        {
            key: '2',
            icon: <FaFileLines />,
            label: <Link href="/create-workspace">Dashboard & Visualization</Link>,
        },
        {
            key: '4',
            icon: <BiSolidPlaneTakeOff />,
            label: <Link href="/data-storage">Workflows & Rules</Link>,
        },
        {
            key: '5',
            icon: <BiGitBranch />,
            label: <Link href="/workflows-list">Rules Management</Link>,
        },
    ];

    const handleMenuClick = (key: string) => {
        setSelectedKeys([key]);
    };

    // const handleThemeChange = (newTheme: Theme) => {
    //     setTheme(newTheme);
    //     localStorage.setItem('theme', newTheme);
    // };

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
                defaultSelectedKeys={['1']}
                selectedKeys={selectedKeys}
                items={sidebarItems}
                onClick={({ key }) => handleMenuClick(key)}
            />
            {/* <div className={sidebarStyles.lightDarkWrapper}>
                <div className={`${sidebarStyles.lightDarkmode} lightDarkmode`}>
                    <Button className={`${sidebarStyles.lightdarkBTN} lightdarkBTN ${theme === 'light' ? sidebarStyles.active : ''}`} onClick={() => handleThemeChange('light')} disabled={theme === 'light'}>
                        <BiSun />Light
                    </Button>
                    <Button className={`${sidebarStyles.lightdarkBTN} lightdarkBTN ${theme === 'dark' ? sidebarStyles.active : ''}`} onClick={() => handleThemeChange('dark')} disabled={theme === 'dark'}>
                        <BiMoon />Dark
                    </Button>
                </div>
            </div> */}
        </Sider>
    );
};

export default SidebarMenu;
