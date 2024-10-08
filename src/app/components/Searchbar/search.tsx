"use client"

import classes from './search.module.css'
import { BiSearch } from "react-icons/bi";
import { Button, Input } from 'antd';
import { ChangeEvent } from 'react';
import { FaThList, FaTh } from "react-icons/fa";

type SearchbarProps = {
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const Searchbar: React.FC<SearchbarProps> = ({ value, onChange }) => {
    return (
        <div className={`flex gap-1 ${classes.searchbar}`}>
            <Button className={classes.viewBtn}>
                <FaThList />
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
