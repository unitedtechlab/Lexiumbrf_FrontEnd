"use client"

import classes from './search.module.css'
import { BiSearch } from "react-icons/bi";
import { Button, Input } from 'antd';
import { ChangeEvent } from 'react';
import { FaThList, FaTh } from "react-icons/fa";
import Image from "next/image";
import groupVectorImg from '../../assets/images/group-vector.svg'

type SearchbarProps = {
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const Searchbar: React.FC<SearchbarProps> = ({ value, onChange }) => {
    return (
        <div className={`flex gap-1 ${classes.searchbar}`}>
            <Button className={classes.viewBtn}>
                {/* <FaThList /> */}
                <Image src={groupVectorImg} alt="Group Vector Image" />
            </Button>
            <Input
                size="large"
                prefix={<BiSearch />}
                placeholder="Search..."
                value={value}
                onChange={onChange}
                className={classes.searchwrapper}
            />
        </div>
    );
};

export default Searchbar;
