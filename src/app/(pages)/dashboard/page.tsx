"use client";

import { useState, useEffect } from "react";
import { message } from "antd";
import dashboardStyles from "./dashboard.module.css";
import { getAuthHeaders } from "@/utils/auth";
import { fetchOrdersByUser, createEnterpriseAPI, fetchEnterprisesAPI } from "@/app/API/api";
import Link from "next/link";
import Image from "next/image";
import welcomeImg from "../../assets/images/dashboard.png";
import PlanModal from '@/app/modals/plan-modal/planModal';
import CreateEnterpriseModal from '@/app/modals/create-modal/create-modal';

export default function Dashboard() {
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(true);
  const [isCreateEnterpriseModalOpen, setIsCreateEnterpriseModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [enterpriseModalLoading, setEnterpriseModalLoading] = useState(false);

  // Fetch enterprise data on page load to determine modal state
  const fetchEnterpriseData = async () => {
    try {
      const enterpriseData = await fetchEnterprisesAPI();
      if (enterpriseData?.data && enterpriseData.success) {
        // console.log("Fetched Enterprise Data:", enterpriseData.data);

        const { accountID } = enterpriseData.data[0] || {};
        if (!accountID || accountID === null) {
          console.log("Account ID is null or undefined, opening create enterprise modal.");
          setIsCreateEnterpriseModalOpen(true);
        }
      } else {
        console.log("No enterprise data found, opening create enterprise modal.");
        setIsCreateEnterpriseModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching enterprise data:", error);
      message.error("An error occurred while fetching enterprise data.");
    }
  };

  useEffect(() => {
    // Fetch and check orders when the component loads
    const checkUserOrders = async () => {
      try {
        const headers = await getAuthHeaders();
        if (!headers.Authorization) {
          message.error("No valid token found. Please log in.");
          return;
        }

        const orders = await fetchOrdersByUser(headers.Authorization.split(" ")[1]);

        if (orders && orders.length > 0) {
          const { planID, status } = orders[0];
          // console.log("Fetched Plan ID:", planID);
          // console.log("Fetched Status:", status);

          // If Plan ID is 3 (Enterprise) and status is 'success', open the enterprise modal
          if (planID === 3 && status === "success") {
            setIsPlanModalOpen(false);
            fetchEnterpriseData();
          }
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        message.error("An error occurred while checking your orders.");
      }
    };

    checkUserOrders();
  }, []);

  const handlePlanModalSubmit = async (selectedPlanId: number) => {
    setModalLoading(true);
    try {
      const headers = await getAuthHeaders();
      if (!headers.Authorization) {
        message.error("No valid token found. Please log in.");
        return;
      }

      message.success("Plan selected successfully!");
      setIsPlanModalOpen(false);

      // After plan is selected, fetch orders again to check the planID
      const orders = await fetchOrdersByUser(headers.Authorization.split(" ")[1]);
      if (orders && orders.length > 0) {
        const { planID, status } = orders[0];

        if (planID === 3 && status === "success") {
          fetchEnterpriseData();
        }
      }
    } catch (error) {
      console.error("Error handling plan submission:", error);
      message.error("Failed to process the selected plan.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleEnterpriseModalSubmit = async (enterpriseName: string) => {
    setEnterpriseModalLoading(true);
    try {
      const response = await createEnterpriseAPI(enterpriseName);
      if (response.success) {
        message.success("Enterprise created successfully!");
        setIsCreateEnterpriseModalOpen(false);
        fetchEnterpriseData();
      } else {
        message.error(response.error || "Failed to create enterprise.");
      }
    } catch (error) {
      console.error("Error creating enterprise:", error);
      message.error("An error occurred while creating the enterprise.");
    } finally {
      setEnterpriseModalLoading(false);
    }
  };

  const handleEnterpriseModalCancel = () => {
    setIsCreateEnterpriseModalOpen(false);
  };

  const handlePlanModalCancel = () => {
    setIsPlanModalOpen(false);
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

      {/* Plan Modal */}
      {isPlanModalOpen && (
        <PlanModal
          open={isPlanModalOpen}
          title="Choose Your Plan"
          onSubmit={handlePlanModalSubmit}
          onCancel={handlePlanModalCancel}
          isLoading={modalLoading}
          setModalOpen={setIsPlanModalOpen}
        />
      )}

      {/* Create Enterprise Modal */}
      {isCreateEnterpriseModalOpen && (
        <CreateEnterpriseModal
          open={isCreateEnterpriseModalOpen}
          title="Create Your Enterprise"
          fieldLabel="Enterprise Name"
          onSubmit={handleEnterpriseModalSubmit}
          onCancel={handleEnterpriseModalCancel}
          isLoading={enterpriseModalLoading}
        />
      )}
    </>
  );
}
