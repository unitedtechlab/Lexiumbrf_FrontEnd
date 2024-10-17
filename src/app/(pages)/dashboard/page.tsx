"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import dynamic from 'next/dynamic';
import Image from "next/image";
import { Button, message } from "antd";
import dashbaord from './dashboard.module.css';
import welcomeImg from '../../assets/images/dashboard.png';
import CreateModal from "@/app/modals/create-modal/create-modal";
import { BaseURL } from "@/app/constants/index";
import { getToken } from "@/utils/auth";

const Searchbar = dynamic(() => import('../../components/Searchbar/search'), { ssr: false });

export default function Dashboard() {
  const [searchInput, setSearchInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const enterpriseCreated = localStorage.getItem("enterpriseCreated");
    if (!enterpriseCreated) {
      setIsModalOpen(true);
    }
  }, []);

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleModalSubmit = async (enterpriseName: string) => {
    setModalLoading(true);

    try {
      const token = getToken();

      if (!token) {
        throw new Error('No token found, please login.');
      }

      const response = await axios.post(
        `${BaseURL}/enterprises?account-type=Enterprise`,
        {
          "EnterpriseName": enterpriseName
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        message.success(`Enterprise "${enterpriseName}" created successfully!`);
        setIsModalOpen(false);
        localStorage.setItem("enterpriseCreated", "true");
      } else if (response.data && response.data.token) {
        message.success(`Enterprise "${enterpriseName}" created successfully!`);
        setIsModalOpen(false);
        localStorage.setItem("enterpriseCreated", "true");
      } else {
        message.error(`Failed to create enterprise: ${response.data?.error?.message || 'Unknown error'}`);
      }
    }
    catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const statusCode = error.response.status;
        if (statusCode === 400 && error.response.data.error?.message === "account already exists for this userID") {
          message.error("Account already exists for this user. Please try with a different account.");
        } else if (statusCode === 403 && error.response.data.error?.message === "you do not have permission to access this resource") {
          message.error("You do not have permission to create an enterprise. Please check your subscription.");
        } else {
          const errorMessage = error.response.data.error?.message || "Failed to create enterprise. Check server logs for details.";
          message.error(errorMessage);
        }
      } else {
        message.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className={dashbaord.dashboardWrapper}>
      <div className={`${dashbaord.searchView} flex justify-space-between gap-1`}>
        <Searchbar value={searchInput} onChange={handleSearchInputChange} />
        <Button className="btn" onClick={() => setIsModalOpen(true)}>Create</Button>
      </div>

      <div className={dashbaord.welcomeWrapper}>
        <div className={dashbaord.welcomeImage}>
          <Image src={welcomeImg} alt="Welcome Image" height={380} loading="lazy" />
        </div>
        <div className={dashbaord.welcomeText}>
          <h4>Welcome to your Lexium Workspace!</h4>
          <h5>Upload a file, connect to a database, or explore sample datasets to get familiar with Bird Eye's powerful features.</h5>
        </div>
      </div>

      <CreateModal
        open={isModalOpen}
        title="Create an Enterprise"
        fieldLabel="Enterprise Name"
        onSubmit={handleModalSubmit}
        onCancel={() => message.warning("Please create an enterprise before proceeding.")}
        isLoading={modalLoading}
      />
    </div>
  );
}
