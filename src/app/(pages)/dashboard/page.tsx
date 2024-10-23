"use client";

import { useState, useEffect } from "react";
import { message } from "antd";
import dashboardStyles from "./dashboard.module.css";
import CreateModal from "@/app/modals/create-modal/create-modal";
import { fetchOrdersByUser, createEnterpriseAPI, fetchEnterprisesAPI } from "@/app/API/api";
import { getToken, refreshToken, setToken } from "@/utils/auth";
import Link from "next/link";
import Image from "next/image";
import welcomeImg from "../../assets/images/dashboard.png";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchUserOrderDetails = async () => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error("No token found, please log in.");
        }


        // Fetch orders using the token
        const orderResponse = await fetchOrdersByUser(token);

        if (orderResponse && Array.isArray(orderResponse) && orderResponse.length > 0) {
          const firstOrder = orderResponse[0];

          if (firstOrder.planID === 3) {
            // console.log("Enterprise plan detected. Opening modal...");
            setIsModalOpen(true);
          } else {
            console.log("No enterprise plan detected.");
          }
        } else {
          console.log("No orders found or invalid response.");
        }


        // Fetch enterprise details
        const fetchEnterprise = await fetchEnterprisesAPI();
        // console.log(fetchEnterprise?.data, "fetchEnterprise fetchEnterprise");

        // if (fetchEnterprise?.data && fetchEnterprise.data.length > 0) {
        //   const accountID = fetchEnterprise.data[0].accountID;
        //   console.log("Account ID:", accountID);
        // } else {
        //   console.log("account not created");
        // }

        if (Boolean(fetchEnterprise?.data && fetchEnterprise.data[0].accountID)) {
          setIsModalOpen(false)
          // console.log("bboobobobob", Boolean(fetchEnterprise?.data && fetchEnterprise.data[0].accountID))
        }


      } catch (error) {
        console.error("Error fetching orders:", error);
        message.error("An error occurred while fetching order details.");
      }
    };

    fetchUserOrderDetails();
  }, []);

  const handleModalSubmit = async (enterpriseName: string) => {
    setModalLoading(true);
    try {
      const token = getToken();
      // console.log("Current token before creating enterprise:", token);

      if (!token) {
        throw new Error("No token found, please login.");
      }

      // Create the enterprise
      const response = await createEnterpriseAPI(enterpriseName);

      if (response && response.success) {
        message.success(response.message || "Enterprise created successfully!");

        const refreshedToken = await refreshToken();

        if (refreshedToken) {
          const fetchEnterprise = await fetchEnterprisesAPI();
          // console.log(fetchEnterprise?.data, "fsdfksjkfs fsjfkskfsdkfj sdf");

          if (fetchEnterprise?.data && fetchEnterprise.data.length > 0) {
            const accountID = fetchEnterprise.data[0].accountID;
            // console.log("Account ID after enterprise creation:", accountID);
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
    setIsModalOpen(false)
  }

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
          // onCancel={() => message.warning("Please create an enterprise before proceeding.")}
          isLoading={modalLoading}
        />
      )}
    </>
  );
}
