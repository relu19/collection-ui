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
import { Link } from "react-router-dom";

const Header = () => {

    const [logInModal, setLogInModal] = useState(false);
    const [logOutModal, setLogOutModal] = useState(false);
    const [usersModal, setUsersModal] = useState(false);
    const [consentModal, setConsentModal] = useState(false);
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
                    <button className="google-signin-btn" onClick={() => setConsentModal(true)}>
                        Sign in with Google
                    </button>
                </ConditionalRender>
                {userDetails?.name && <div className='user-info' onClick={() => setLogOutModal(true)}>
                    <div className='user-avatar'>
                        <img alt={userDetails?.name} src={userDetails?.logo}/>
                        <div className='user-status'></div>
                    </div>
                    <div className='user-details'>
                        <span className='user-name'>{userDetails?.name}</span>
                        <span className='user-email'>{userDetails?.email}</span>
                    </div>
                    <div className='logout-icon'>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
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

                    <p className='center-align'>
                        <button className="google-signin-btn" onClick={() => {
                            setLogInModal(false);
                            setConsentModal(true);
                        }}>
                            Sign in with Google
                        </button>
                    </p>
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


            <Modal
                isOpen={consentModal}
                onRequestClose={() => setConsentModal(false)}
                contentLabel="Google Sign In Consent"
                className="page-modal consent-modal"
                ariaHideApp={false}
                overlayClassName="modal-overlay"
                closeTimeoutMS={500}
            >
                <div className='modal-header'>
                    Sign in with Google
                </div>

                <div className='modal-content'>
                    <p className="consent-message">
                        By signing in with Google, you agree that Collectors Hub may access your public Google profile information (name, email address, and profile picture) to create and display your user account.
                    </p>
                    
                    <p className="consent-links">
                        See our <Link to="/privacy" onClick={() => setConsentModal(false)}>Privacy Policy</Link> and <Link to="/terms" onClick={() => setConsentModal(false)}>Terms of Service</Link>
                    </p>

                    <div className='center-align' style={{ marginTop: '20px' }}>
                        <GoogleLogin
                            onSuccess={(response) => {
                                setConsentModal(false);
                                responseGoogle(response);
                            }}
                            onError={() => {
                                console.log('Login Failed');
                                setConsentModal(false);
                            }}
                        />
                    </div>
                </div>
                <hr/>
                <div className='modal-footer'>
                    <button className='button' onClick={() => setConsentModal(false)}>Cancel</button>
                </div>
            </Modal>
        </div>
    )
}
export default Header