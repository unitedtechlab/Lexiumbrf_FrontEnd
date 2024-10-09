"use client";

import { useState } from "react";
import dynamic from 'next/dynamic';
import Image from "next/image";
import dashbaord from './dashboard.module.css';
import newWelcomeImg from '../../assets/images/new-welcome.png'
import groupVectorImg from '../../assets/images/group-vector.svg'
import Link from "next/link";

const Searchbar = dynamic(() => import('../../components/Searchbar/search'), { ssr: false });
const View = dynamic(() => import('../../components/GridListView/view'), { ssr: false });

export default function Dashboard() {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  return (
    <div className={dashbaord.dashboardWrapper}>
    <div className={`${dashbaord.topcontentWrapper} flex justify-space-between gap-1`}>
        <div className={dashbaord.searchContainer} >
            <div className={dashbaord.groupVector}>
                <Image src={groupVectorImg} alt="Group Vector Image" />
            </div>
            <Searchbar value={searchInput} onChange={handleSearchInputChange} />
        </div>
        <Link href="/create-workspace" className="btn-green">
            Create
        </Link>
    </div>

    <div className={dashbaord.welcomeWrapper}>
        <div className={dashbaord.welcomeImage}>
            <Image src={newWelcomeImg} alt="Welcome Image" width={600} height={600} loading="lazy" />
        </div>
        <div className={dashbaord.welcomeText}>
            <h4>Welcome to your Lexium Workspace!</h4>
            <h5>Upload a file, connect to a database, or explore sample datasets to get familiar with Bird Eye's powerful features.</h5>
        </div>
    </div>
</div>
  );
}
