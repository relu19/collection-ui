import {deleteStorageItem, getStorageItem, setStorageItem} from "../../storage";
import { createNewUser, getUser } from "../../actions/users";
import React, {useState} from "react";
import Modal from "react-modal";
import './style.scss';
import UsersList from "../users-list";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import ConditionalRender from "../../utils/conditionalRender";
import LoginPage from "../google-login";

const Header = () => {

    const [logInModal, setLogInModal] = useState(false);
    const [logOutModal, setLogOutModal] = useState(false);
    const [usersModal, setUsersModal] = useState(false);
    const [userDetails, setUserDetails] = useState(getStorageItem('collector-data'))

    const fetchUser = async (data) => {
        const userInfo = await getUser(data);

        if (!userInfo?.length) {
            deleteStorageItem('collector-data');
            return;
        }

        const userId = userInfo[0].id;
        const userType = userInfo[0].type ?? 1;
        const userData = {
            ...data,
            id: userId,
            type: userType,
            logo: data?.logo
        };

        setUserDetails(userData);
        setStorageItem('collector-data', userData);

        window.location = '/';
    };

    const logOutUser = () => {
        deleteStorageItem('collector-data')
        window.location = '/';
    }

    const responseGoogle = async (response) => {
        const decoded = jwtDecode(response.credential);

        // Extract user details
        const userDetails = {
            name: decoded.name,
            email: decoded.email,
            logo: decoded.picture,
            type: 1,
            fbId: decoded.sub,
        };

        // Step 1: Check if user exists in the database
        const existingUser = await getUser(userDetails);

        if (existingUser && existingUser.length > 0) {
            // Step 2: User exists, log them in
            console.log("User exists, logging in...");
            await fetchUser(existingUser[0]);
        } else {
            // Step 3: User does not exist, create a new one
            console.log("User not found, creating a new one...");
            await createNewUser(userDetails);
            await fetchUser(userDetails);
        }
    };

    return (
        <div className='cl-header'>
            <div className='header-data'>
                <span className='collector-select' onClick={() => setUsersModal(true)}>Collector</span>
                {/*{!userDetails?.name && <span className='pointer' onClick={() => setLogInModal(true)}>Add your collection</span>}*/}

                <ConditionalRender if={!userDetails?.name}>
                    <GoogleLogin
                        onSuccess={responseGoogle}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                    />
                </ConditionalRender>
                {userDetails?.name && <div className='user-info' onClick={() => setLogOutModal(true)}>
                    <img alt={''} src={userDetails?.logo}/>
                    <p>{userDetails?.name} (Log Out)</p>
                </div>}
            </div>

            <Modal
                isOpen={logOutModal}
                onRequestClose={() => setLogOutModal(false)}
                contentLabel="My dialog"
                className="page-modal"
                ariaHideApp={false}
                overlayClassName="modal-overlay"
                closeTimeoutMS={500}
            >
                <div className='modal-header'>
                    Log Out
                </div>

                <div className='modal-content'>
                    <p>Are you sure you want to log out</p>
                </div>
                <hr/>
                <div className='modal-footer'>
                    <button className='button' onClick={() => setLogOutModal(false)}>No</button>
                    <button className='button' onClick={() => logOutUser()}>Yes</button>
                </div>
            </Modal>


            <Modal
                isOpen={logInModal}
                onRequestClose={() => setLogInModal(false)}
                contentLabel="My dialog"
                ariaHideApp={false}
                className="page-modal"
                overlayClassName="modal-overlay"
                closeTimeoutMS={500}
            >
                <div className='modal-header'>
                    Log In
                </div>

                <div className='modal-content'>
                    <p>Create an account so you can add your own collection and share it with others</p>

                    <p className='center-align'><LoginPage userDetails={userDetails} setUserDetails={fetchUser}/></p>
                </div>
                <hr/>
                {/*<p className='note'>*By creating an account you agree that your data will be saved and associated with any sets you*/}
                {/*    add to your collection</p>*/}
                <div className='modal-footer'>
                    <button className='button' onClick={() => setLogInModal(false)}>Cancel</button>
                </div>
            </Modal>


            <Modal
                isOpen={usersModal}
                onRequestClose={() => setUsersModal(false)}
                contentLabel="My dialog"
                className="page-modal"
                ariaHideApp={false}
                overlayClassName="modal-overlay"
                closeTimeoutMS={500}
            >
                <div className='modal-header'>
                    Collector

                    <button
                        aria-label="Close"
                        onClick={() => setUsersModal(false)}
                        className="close-modal-btn"
                    >
                        ×
                    </button>
                </div>

                <div className='modal-content'>
                    <UsersList setUsersModal={setUsersModal}/>
                </div>
                <hr/>
                <div className='modal-footer'>
                    <button className='button' onClick={() => setUsersModal(false)}>Close</button>
                    <ConditionalRender if={!userDetails?.name}>
                        <button className='button blue' onClick={() => {
                            setUsersModal(false);
                            setLogInModal(true)
                        }}>Add your own collection
                        </button>
                    </ConditionalRender>
                </div>
            </Modal>
        </div>
    )
}
export default Header