import {deleteStorageItem, getStorageItem, setStorageItem} from "../../storage";
import { authenticateWithGoogle } from "../../actions/users";
import React, {useState, useEffect} from "react";
import Modal from "react-modal";
import './style.scss';
import UsersList from "../users-list";
import { GoogleLogin } from "@react-oauth/google";
import ConditionalRender from "../../utils/conditionalRender";
import { Link } from "react-router-dom";

const Header = () => {

    const [logInModal, setLogInModal] = useState(false);
    const [logOutModal, setLogOutModal] = useState(false);
    const [usersModal, setUsersModal] = useState(false);
    const [consentModal, setConsentModal] = useState(false);
    
    // Initialize user from new auth system OR old storage
    const getInitialUser = () => {
        try {
            // First check new JWT auth
            const authData = JSON.parse(localStorage.getItem('auth'));
            if (authData?.user) {
                return authData.user;
            }
        } catch (e) {
            // Ignore parse errors
        }
        
        // Fall back to old storage format
        return getStorageItem('collector-data');
    };
    
    const [userDetails, setUserDetails] = useState(getInitialUser());

    const logOutUser = () => {
        localStorage.removeItem('auth');
        deleteStorageItem('collector-data'); // Clean up old storage too
        setUserDetails(null);
        window.location = '/';
    }

    const responseGoogle = async (response) => {
        try {
            // Send Google token to backend for verification and JWT generation
            const authResponse = await authenticateWithGoogle(response.credential);
            
            // Check if we got valid data
            if (!authResponse.token || !authResponse.user) {
                console.error("Invalid response from server:", authResponse);
                alert('Login failed: Invalid response from server. Please try again.');
                return;
            }
            
            // Store JWT token and user data
            localStorage.setItem('auth', JSON.stringify({
                token: authResponse.token,
                user: authResponse.user
            }));
            
            // Also store in old format for compatibility
            setStorageItem('collector-data', authResponse.user);
            
            console.log("Login successful!", authResponse.user);
            
            // Update state BEFORE redirect
            setUserDetails(authResponse.user);
            
            // Small delay to ensure state updates, then reload to refresh everything
            setTimeout(() => {
                window.location.reload();
            }, 100);
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again. Check console for details.');
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