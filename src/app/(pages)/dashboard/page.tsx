"use client";

import { useState, useEffect } from "react";
import { message } from "antd";
import dashboardStyles from "./dashboard.module.css";
import { getAuthHeaders } from "@/utils/auth";
import Link from "next/link";
import Image from "next/image";
import welcomeImg from "../../assets/images/dashboard.png";
import PlanModal from '@/app/modals/plan-modal/planModal';
import CreateEnterpriseModal from '@/app/modals/create-modal/create-modal'

export default function Dashboard() {
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);

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
    } catch (error) {
      console.error("Error handling plan submission:", error);
      message.error("Failed to process the selected plan.");
    } finally {
      setModalLoading(false);
    }
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
    </>
  );
}
