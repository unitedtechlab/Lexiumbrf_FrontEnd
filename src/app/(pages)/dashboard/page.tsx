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
    setIsModalOpen(true); // Automatically open modal when the page loads
  }, []);

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleModalSubmit = async (enterpriseName: string) => {
    setModalLoading(true);

    try {
      const token = getToken(); // Retrieve token from local storage

      if (!token) {
        throw new Error('No token found, please login.');
      }

      console.log("Submitting enterpriseName:", enterpriseName); // Logging for debugging

      // Make a POST request to create an enterprise using the backend API
      const response = await axios.post(
        `${BaseURL}/enterprises?account-type=Enterprise`,
        {
          "EnterpriseName": enterpriseName // Ensure the key matches the backend expectations exactly
        },
        {
          headers: {
            "Content-Type": "application/json", // Ensure the content type is set
            "Authorization": `Bearer ${token}`, // Include the Bearer token for authentication
          },
        }
      );

      // Check if the response contains success status
      if (response.data && response.data.success) {
        message.success(`Enterprise "${enterpriseName}" created successfully!`);
        setIsModalOpen(false);
      } else if (response.data && response.data.token) {
        // Fallback: If success is not explicitly returned but token exists
        message.success(`Enterprise "${enterpriseName}" created successfully!`);
        setIsModalOpen(false);
      } else {
        message.error(`Failed to create enterprise: ${response.data?.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      // Handle backend response errors
      console.error("API Error:", error);

      if (axios.isAxiosError(error) && error.response) {
        // Log full backend response for debugging
        console.log("Backend Response:", error.response.data);

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
