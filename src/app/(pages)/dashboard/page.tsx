"use client";

import { useState } from "react";
import dynamic from 'next/dynamic';
import Image from "next/image";
import dashbaord from './dashboard.module.css';
import welcomeImg from '../../assets/images/dashboard.png';
import { Button } from "antd";

const Searchbar = dynamic(() => import('../../components/Searchbar/search'), { ssr: false });
const View = dynamic(() => import('../../components/GridListView/view'), { ssr: false });

export default function Dashboard() {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  return (
    <div className={dashbaord.dashboardWrapper}>
      <div className={`${dashbaord.searchView} flex justify-space-between gap-1`}>
        <Searchbar value={searchInput} onChange={handleSearchInputChange} />
        <Button className="btn">Create</Button>
      </div>

      <div className={dashbaord.welcomeWrapper}>
        <div className={dashbaord.welcomeImage}>
          <Image src={welcomeImg} alt="Welcome Image" height={450} loading="lazy" />
        </div>
        <div className={dashbaord.welcomeText}>
          <h4>Welcome to your Lexium Workspace!</h4>
          <h5>Upload a file, connect to a database, or explore sample datasets to get familiar with Bird Eye's powerful features.</h5>
        </div>
      </div>
    </div>
  );
}
