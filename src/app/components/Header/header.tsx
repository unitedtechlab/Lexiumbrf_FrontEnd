"use client";

import React, { useMemo } from "react";
import { BiSolidChevronDown } from "react-icons/bi";
import { Dropdown, Space, Avatar, message } from "antd";
import type { MenuProps } from "antd";
import Link from "next/link";
import Image from "next/image";
import userImage from "@/app/assets/images/user.png";
import { useRouter } from "next/navigation";
import { useEmail } from "@/app/context/emailContext";
import { removeToken } from "@/utils/auth";
import { VscSettings } from "react-icons/vsc";
import { MdOutlineQuestionMark } from "react-icons/md";
import { FaUsersCog } from "react-icons/fa";
import { FaArrowTurnUp } from "react-icons/fa6";
import { BiLogOut } from "react-icons/bi";

const Header: React.FC = () => {
  const router = useRouter();
  const { email, first_name, last_name, setEmail, setFirstName, setLastName } = useEmail();

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("email");
    localStorage.removeItem("first_name");
    localStorage.removeItem("last_name");
    setEmail(null);
    setFirstName(null);
    setLastName(null);

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('token')) {
      urlParams.delete('token');
      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
      window.history.replaceState({}, '', newUrl);
    }

    message.success("Logged out successfully");
    router.push("/signin");
  };

  const items = useMemo((): MenuProps['items'] => [
    {
      label: <Link href="/"><VscSettings /> Profile Settings</Link>,
      key: "0",
    },
    {
      label: <Link href="/"><MdOutlineQuestionMark /> Account Settings</Link>,
      key: "1",
    },
    {
      label: <Link href="/"><FaUsersCog /> User Settings</Link>,
      key: "2",
    },
    {
      label: <Link href="/"><FaArrowTurnUp /> Workspace</Link>,
      key: "3",
    },
    {
      type: "divider",
    },
    {
      label: <a onClick={handleLogout}><BiLogOut /> Logout</a>,
      key: "4",
    },
  ], []);

  return (
    <Dropdown menu={{ items }} trigger={["click"]} className="nav_dropdown">
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <Avatar size="large" src={<Image src={userImage} alt="User Image" priority width={40} height={40} />} />
          <h6>
            <span>{first_name && last_name ? `${first_name} ${last_name}` : email}</span>
            <span className="user-role">Admin</span>
          </h6>
          <BiSolidChevronDown />
        </Space>
      </a>
    </Dropdown>
  );
};

export default Header;
