"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { message } from "antd";
import dashboardStyles from "./dashboard.module.css";
import welcomeImg from "../../assets/images/dashboard.png";
import CreateModal from "@/app/modals/create-modal/create-modal";
import { createEnterpriseAPI, fetchEnterprisesAPI } from "@/app/API/api";
import { getToken } from "@/utils/auth";
import Link from "next/link";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [accountID, setAccountID] = useState<number | null>(null);

  useEffect(() => {
    const fetchEnterprises = async () => {
      try {
        const response = await fetchEnterprisesAPI();
        if (response && response.success) {
          const enterprises = Array.isArray(response.data) ? response.data : [response.data];
          console.log("Fetched enterprises:", enterprises);

          const existingAccount = enterprises.find(enterprise => enterprise.accountID !== null);
          if (existingAccount) {
            setAccountID(existingAccount.accountID);
          } else {
            setIsModalOpen(true);
          }
        } else {
          setIsModalOpen(true);
        }
      } catch (error) {
        console.error("Error fetching enterprises:", error);
        setIsModalOpen(true);
      }
    };

    fetchEnterprises();
  }, []);


  const handleModalSubmit = async (enterpriseName: string) => {
    setModalLoading(true);

    try {
      const token = getToken();
      if (!token) {
        throw new Error("No token found, please login.");
      }

      const response = await createEnterpriseAPI(enterpriseName);

      if (response && response.success) {
        message.success(`Enterprise "${enterpriseName}" created successfully!`);
        setIsModalOpen(false);
        setAccountID(response.data.accountID);
      } else {
        message.error(`Failed to create enterprise: ${response.data?.error?.message || "Unknown error"}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setModalLoading(false);
    }
  };


  return (
    <>
      <div className={dashboardStyles.welcomeWrapper}>
        <div className={dashboardStyles.welcomeImage}>
          <Image className={dashboardStyles.welcomeImg} src={welcomeImg} alt="Welcome Image" loading="lazy" />
        </div>
        <div className={dashboardStyles.welcomeText}>
          <h4>Welcome to your Lexium Workspace!</h4>
          <h5>
            Upload a file, connect to a database, or explore sample datasets to get familiar with Bird Eye's
            powerful features.
          </h5>
          <Link href="/workspace" className="btn">Go to Workspace</Link>
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

    </>
  );
}
