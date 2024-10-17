"use client";

import React, { useMemo, useState } from "react";
import { Dropdown, Space, Avatar, message, MenuProps } from "antd";
import { BiSolidChevronDown, BiLogOut } from "react-icons/bi";
import { VscSettings } from "react-icons/vsc";
import { MdOutlineQuestionMark } from "react-icons/md";
import { FaUsersCog } from "react-icons/fa";
import { FaArrowTurnUp } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import userImage from "@/app/assets/images/user.png";
import { useEmail } from "@/app/context/emailContext";
import { removeToken } from "@/utils/auth";
import ProfileSettings from "../Profile/profile-setting";
import AccountSettings from "../Account/account-setting";
import EnterpriseModal from "@/app/modals/enterprise-setting/enterprisemodal";

const Header: React.FC = () => {
  const router = useRouter();
  const { email, first_name, last_name, setEmail, setFirstName, setLastName } = useEmail();
  const [selectedAccount, setSelectedAccount] = useState("Marci Fumons");
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isAccountModalVisible, setIsAccountModalVisible] = useState(false);
  const [isEnterpriseModalVisible, setIsEnterpriseModalVisible] = useState(false); // State for EnterpriseModal
  const [isEnterpriseLoading, setIsEnterpriseLoading] = useState(false); // State for loading

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

  const handleEnterpriseSubmit = async (enterpriseName: string) => {
    // Handle the submission of the enterprise name here
    setIsEnterpriseLoading(true);
    console.log("Enterprise created:", enterpriseName);

    setTimeout(() => {
      message.success(`Enterprise "${enterpriseName}" created successfully!`);
      setIsEnterpriseLoading(false);
      setIsEnterpriseModalVisible(false);
    }, 1000); // Simulate server request
  };

  const items: MenuProps['items'] = useMemo(() => [
    {
      label: (<a onClick={() => setIsProfileModalVisible(true)}> <VscSettings /> Profile Settings </a>),
      key: "0",
    },
    {
      label: (<a onClick={() => setIsAccountModalVisible(true)}> <MdOutlineQuestionMark /> Account Settings </a>),
      key: "1",
    },
    {
      label: <Link href="/"><FaArrowTurnUp /> View Workspace</Link>,
      key: "2",
    },
    {
      label: (<a onClick={() => setIsEnterpriseModalVisible(true)}> <FaUsersCog /> Enterprise Setting </a>), // Show EnterpriseModal
      key: "3",
    },
    {
      label: (
        <div className="account-switch">
          <h5 className="switch-account-title">Switch Account</h5>
          <div className="account-item">
            <div className="account-content">
              <Avatar size="large" src={<Image src={userImage} alt="Marci Fumons" priority width={50} height={50} />} />
              <div className="account-name-wrapper">
                <h5 className="account-name">Marci Fumons</h5>
                <h6 className="account-role">Super Admin</h6>
              </div>
            </div>
            <input
              type="radio"
              name="account"
              checked={selectedAccount === "Marci Fumons"}
              onChange={() => setSelectedAccount("Marci Fumons")}
            />
          </div>
          <div className="account-item">
            <div className="account-content">
              <Avatar size="large" src={<Image src={userImage} alt="Arun Varghese" priority width={50} height={50} />} />
              <div className="account-name-wrapper">
                <h5 className="account-name">Arun Varghese</h5>
                <h6 className="account-role">User</h6>
              </div>
            </div>
            <input
              type="radio"
              name="account"
              checked={selectedAccount === "Arun Varghese"}
              onChange={() => setSelectedAccount("Arun Varghese")}
            />
          </div>
        </div>
      ),
      key: "4",
    },
    {
      type: "divider",
    },
    {
      label: <a onClick={handleLogout}><BiLogOut /> Sign Out</a>,
      key: "5",
    },
  ], [selectedAccount]);

  return (
    <>
      <Dropdown menu={{ items }} trigger={["click"]} className="nav_dropdown">
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <Avatar size="large" src={<Image src={userImage} alt="User Image" priority width={40} height={40} />} />
            <h6>
              <span>{first_name && last_name ? `${first_name} ${last_name}` : email}</span>
              <span className="user-role">{selectedAccount === "Marci Fumons" ? "Super Admin" : "User"}</span>
            </h6>
            <BiSolidChevronDown />
          </Space>
        </a>
      </Dropdown>

      <ProfileSettings visible={isProfileModalVisible} onClose={() => setIsProfileModalVisible(false)} />
      <AccountSettings visible={isAccountModalVisible} onClose={() => setIsAccountModalVisible(false)} />
      <EnterpriseModal
        open={isEnterpriseModalVisible}
        title="Enterprise Settings"
        onSubmit={handleEnterpriseSubmit}
        onCancel={() => setIsEnterpriseModalVisible(false)}
        isLoading={isEnterpriseLoading}
      />
    </>
  );
};

export default Header;
