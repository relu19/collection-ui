import Header from "../../components/header";
import SetList from "../../components/set-list";
import {useState} from "react";
import {getStorageItem} from "../../storage";
import {Helmet} from "react-helmet";
import React from 'react';
import './style.scss'

const HomeScreen = () => {

    const [userDetails, setUserDetails] = useState(getStorageItem('collector-data'))


    return (
        <div className='cl-content'>
            <Helmet>
                <meta charSet="utf-8" />
            </Helmet>
            <Header userDetails={userDetails} setUserDetails={setUserDetails}/>
            <div className='page-content'>
                <SetList userDetails={userDetails}/>
            </div>
        </div>
    )
}


export default HomeScreen