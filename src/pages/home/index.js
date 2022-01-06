import Header from "../../components/header";
import {useState} from "react";
import {getStorageItem} from "../../storage";
import {Helmet} from "react-helmet";
import React from 'react';
import SetsPage from "../../components/sets-page";
import './style.scss'

const HomeScreen = () => {

    const [userDetails, setUserDetails] = useState(getStorageItem('collector-data'))


    return (
        <div className='cl-content'>
            <Helmet>
                <meta charSet="utf-8" />
            </Helmet>
            <Header userDetails={userDetails} setUserDetails={setUserDetails}/>
                <SetsPage userDetails={userDetails}/>
        </div>
    )
}


export default HomeScreen