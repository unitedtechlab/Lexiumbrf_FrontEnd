"use client";

import { useState, useEffect } from "react";
import { message } from "antd";
import dashboardStyles from "./dashboard.module.css";
import CreateModal from "@/app/modals/create-modal/create-modal";
import { fetchOrdersByUser, createEnterpriseAPI, fetchEnterprisesAPI } from "@/app/API/api";
import { getAuthHeaders } from "@/utils/auth"; // Use getAuthHeaders to manage tokens
import Link from "next/link";
import Image from "next/image";
import welcomeImg from "../../assets/images/dashboard.png";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchUserOrderDetails = async () => {
      try {
        // Get authorization headers (with token management)
        const headers = await getAuthHeaders();

        if (!headers.Authorization) {
          throw new Error("No valid token found. Please log in.");
        }

        // Fetch orders using the token in headers
        const orderResponse = await fetchOrdersByUser(headers.Authorization);

        if (orderResponse && Array.isArray(orderResponse) && orderResponse.length > 0) {
          const firstOrder = orderResponse[0];

          if (firstOrder.planID === 3) {
            // Enterprise plan detected, open modal
            setIsModalOpen(true);
          } else {
            console.log("No enterprise plan detected.");
          }
        } else {
          console.log("No orders found or invalid response.");
        }

        // Fetch enterprise details
        const fetchEnterprise = await fetchEnterprisesAPI();

        if (fetchEnterprise?.data && fetchEnterprise.data[0].accountID) {
          setIsModalOpen(false); // Close modal if enterprise exists
        }
      } catch (error) {
        console.error("Error fetching orders or enterprises:", error);
        message.error("An error occurred while fetching order details.");
      }
    };

    fetchUserOrderDetails();
  }, []);

  const handleModalSubmit = async (enterpriseName: string) => {
    setModalLoading(true);
    try {
      // Get authorization headers
      const headers = await getAuthHeaders();

      if (!headers.Authorization) {
        throw new Error("No token found, please login.");
      }

      // Create the enterprise
      const response = await createEnterpriseAPI(enterpriseName);

      if (response && response.success) {
        message.success(response.message || "Enterprise created successfully!");

        // Refresh the token after enterprise creation
        const refreshedHeaders = await getAuthHeaders();

        if (refreshedHeaders.Authorization) {
          const fetchEnterprise = await fetchEnterprisesAPI();

          if (fetchEnterprise?.data && fetchEnterprise.data.length > 0) {
            const accountID = fetchEnterprise.data[0].accountID;
            console.log("Account ID after enterprise creation:", accountID);
          } else {
            console.log("No enterprise account found after creation.");
          }
        } else {
          console.error("Failed to refresh token after enterprise creation.");
        }

        setIsModalOpen(false);
      } else if (response?.error) {
        message.error(response.error || "Failed to create enterprise.");
      }
    } catch (error) {
      console.error("Error during enterprise creation or token refresh:", error);
      message.error("An unexpected error occurred. Please try again.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={dashboardStyles.welcomeWrapper}>
        <div className={dashboardStyles.welcomeImage}>
          <Image
            className={dashboardStyles.welcomeImg}
            src={welcomeImg}
            alt="Welcome Image"
            loading="lazy"
          />
        </div>
        <div className={dashboardStyles.welcomeText}>
          <h4>Welcome to your Lexium Workspace!</h4>
          <h5>
            Upload a file, connect to a database, or explore sample datasets to
            get familiar with Bird Eye's powerful features.
          </h5>
          <Link href="/workspace" className="btn">
            Go to Workspace
          </Link>
        </div>
      </div>

      {isModalOpen && (
        <CreateModal
          open={isModalOpen}
          title="Create an Enterprise"
          fieldLabel="Enterprise Name"
          onSubmit={handleModalSubmit}
          onCancel={handleModalCancel}
          isLoading={modalLoading}
        />
      )}
    </>
  );
}
