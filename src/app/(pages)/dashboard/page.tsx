"use client";

import { useState, useEffect } from "react";
import { message } from "antd";
import dashboardStyles from "./dashboard.module.css";
import CreateModal from "@/app/modals/create-modal/create-modal";
import { fetchOrdersByUser, createEnterpriseAPI } from "@/app/API/api";
import { getToken } from "@/utils/auth";
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
        console.log("Fetched order response:", orderResponse);

        // Check if the response is valid and contains orders
        if (orderResponse && Array.isArray(orderResponse) && orderResponse.length > 0) {
          const firstOrder = orderResponse[0]; // Assuming you want the first order

          console.log("Order details:", firstOrder); // Log entire order
          console.log("Fetched plan ID:", firstOrder.planID); // Log planID for debugging

          // Check if planID is 3 and set the modal open
          if (firstOrder.planID === 3) {
            console.log("Enterprise plan detected. Opening modal...");
            setIsModalOpen(true);
          } else {
            console.log("No enterprise plan detected.");
          }
        } else {
          console.log("No orders found or invalid response.");
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
      if (!token) {
        throw new Error("No token found, please login.");
      }

      const response = await createEnterpriseAPI(enterpriseName);

      if (response && response.success) {
        message.success(response.message || "Enterprise created successfully!");
        setIsModalOpen(false);
      } else if (response?.error) {
        message.error(response.error || "Failed to create enterprise.");
      }
    } catch (error) {
      message.error("An unexpected error occurred. Please try again.");
    } finally {
      setModalLoading(false);
    }
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
          onCancel={() => message.warning("Please create an enterprise before proceeding.")}
          isLoading={modalLoading}
        />
      )}
    </>
  );
}

