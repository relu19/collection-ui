import React from 'react';
import './style.scss'
import UsersList from "../../components/users-list";

const HomeScreen = () => {

    return (
        <div className='cl-content'>
            <UsersList  setUsersModal={ () => {}} />
        </div>
    )
}


export default HomeScreen