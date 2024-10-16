"use client";

import { useState } from "react";
import dynamic from 'next/dynamic';
import Image from "next/image";
import dashbaord from './dashboard.module.css';
import welcomeImg from '../../assets/images/dashboard.png';
import { Button } from "antd";
import CreateWorkspace from "@/app/modals/create-workspace/create-workspace";

const Searchbar = dynamic(() => import('../../components/Searchbar/search'), { ssr: false });

export default function Dashboard() {
  const [searchInput, setSearchInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };
  const HandleCreateWorkspace = () => {
    setIsModalOpen(true);
  }

  return (
    <div className={dashbaord.dashboardWrapper}>
      <div className={`${dashbaord.searchView} flex justify-space-between gap-1`}>
        <Searchbar value={searchInput} onChange={handleSearchInputChange} />
        <Button className="btn" onClick={HandleCreateWorkspace}>Create</Button>
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

      {/* <CreateWorkspace
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        workSpace=""
        onSave={handleSaveWorkspace}
        name={'Workspace'}
      /> */}
    </div>
  );
}
