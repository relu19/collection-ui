import {deleteStorageItem, getStorageItem, setStorageItem} from "../../storage";
import { authenticateWithGoogle, updateProfile, getUserById } from "../../actions/users";
import React, {useState, useEffect, useRef} from "react";
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
    const [editProfileModal, setEditProfileModal] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [profileForm, setProfileForm] = useState({ username: '', contactEmail: '' });
    const [formErrors, setFormErrors] = useState({ username: '', contactEmail: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [modalUserData, setModalUserData] = useState(null);
    const dropdownRef = useRef(null);
    
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

    // Helper function to get current user data
    const getCurrentUser = () => {
        try {
            const authData = JSON.parse(localStorage.getItem('auth'));
            if (authData?.user && authData.user.name && authData.user.email) {
                return authData.user;
            }
        } catch (e) {
            // Ignore parse errors
        }
        const oldData = getStorageItem('collector-data');
        if (oldData && oldData.name && oldData.email) {
            return oldData;
        }
        return null;
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    // Initialize form when opening edit modal and refresh userDetails
    useEffect(() => {
        if (editProfileModal) {
            // Refresh userDetails from storage to ensure we have latest data
            const refreshedUser = getCurrentUser();
            const currentUserDetails = refreshedUser || userDetails;
            
            if (currentUserDetails) {
                // Only update userDetails if we got a refreshed user that's different
                if (refreshedUser && (!userDetails || refreshedUser.id !== userDetails.id)) {
                    setUserDetails(refreshedUser);
                    setModalUserData(refreshedUser);
                } else if (userDetails) {
                    setModalUserData(userDetails);
                }
                
                // Set form values, ensuring we use the most up-to-date data
                const userForForm = refreshedUser || userDetails || currentUserDetails;
                setProfileForm({
                    username: userForForm.username || '',
                    contactEmail: userForForm.contactEmail || ''
                });
            }
            setFormErrors({ username: '', contactEmail: '' });
        } else {
            setModalUserData(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editProfileModal]);

    const validateForm = () => {
        const errors = { username: '', contactEmail: '' };
        let isValid = true;

        // Validate username (optional, but if provided must be valid)
        if (profileForm.username && profileForm.username.trim() !== '') {
            if (profileForm.username.length < 3) {
                errors.username = 'Username must be at least 3 characters';
                isValid = false;
            } else if (!/^[a-zA-Z0-9_]+$/.test(profileForm.username)) {
                errors.username = 'Username can only contain letters, numbers, and underscores';
                isValid = false;
            }
        }

        // Validate contact email (optional, but if provided must be valid)
        if (profileForm.contactEmail && profileForm.contactEmail.trim() !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(profileForm.contactEmail)) {
                errors.contactEmail = 'Please enter a valid email address';
                isValid = false;
            }
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSaveProfile = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSaving(true);
        try {
            // Verify we have auth token before making request
            let authData = JSON.parse(localStorage.getItem('auth'));
            if (!authData?.token) {
                alert('Your session has expired. Please log in again.');
                logOutUser();
                return;
            }

            // Always send username and contactEmail, even if empty (to allow clearing)
            const updateData = {
                username: profileForm.username.trim(),
                contactEmail: profileForm.contactEmail.trim()
            };
            
            await updateProfile(userDetails.id, updateData);

            // Fetch updated user data from backend to get the complete updated user object
            try {
                const updatedUserArray = await getUserById({ userId: userDetails.id });
                const updatedUser = Array.isArray(updatedUserArray) && updatedUserArray.length > 0 
                    ? updatedUserArray[0] 
                    : null;
                
                if (updatedUser) {
                    // Update local storage with updated user data
                    // Create a new object to ensure React detects the state change
                    const newUserData = { ...userDetails, ...updatedUser };
                    if (authData) {
                        authData.user = { ...authData.user, ...updatedUser };
                        localStorage.setItem('auth', JSON.stringify(authData));
                    }
                    setStorageItem('collector-data', newUserData);
                    // Use functional update to ensure React detects the change
                    setUserDetails(() => ({ ...newUserData }));
                } else {
                    // If fetch fails, update with what we sent
                    const updatedUserData = { ...userDetails, ...updateData };
                    if (authData) {
                        authData.user = { ...authData.user, ...updateData };
                        localStorage.setItem('auth', JSON.stringify(authData));
                    }
                    setStorageItem('collector-data', updatedUserData);
                    setUserDetails(updatedUserData);
                }
            } catch (fetchError) {
                // If fetch fails, update with what we sent
                const updatedUserData = { ...userDetails, ...updateData };
                if (authData) {
                    authData.user = { ...authData.user, ...updateData };
                    localStorage.setItem('auth', JSON.stringify(authData));
                }
                setStorageItem('collector-data', updatedUserData);
                setUserDetails(updatedUserData);
            }
            
            setEditProfileModal(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
            if (error.message === 'Authentication required' || error.message?.includes('401')) {
                alert('Your session has expired. Please log in again.');
                logOutUser();
            } else {
                alert('Failed to update profile. Please try again.');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const logOutUser = () => {
        localStorage.removeItem('auth');
        deleteStorageItem('collector-data'); // Clean up old storage too
        setUserDetails(null);
        setDropdownOpen(false);
        window.location = '/';
    }

    const responseGoogle = async (response) => {
        try {
            // Send Google token to backend for verification and JWT generation
            const authResponse = await authenticateWithGoogle(response.credential);
            
            // Check if we got valid data
            if (!authResponse.token || !authResponse.user) {
                console.error("Invalid response from server:", authResponse);
                
                // Show specific error message if available
                const errorMsg = authResponse.error?.message || 'Unknown error';
                alert(`Login failed: ${errorMsg}\n\nPlease contact support if this persists.`);
                return;
            }
            
            // Store JWT token and user data
            localStorage.setItem('auth', JSON.stringify({
                token: authResponse.token,
                user: authResponse.user
            }));
            
            // Also store in old format for compatibility
            setStorageItem('collector-data', authResponse.user);
            
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
                {userDetails?.name && <div className='user-info-wrapper' ref={dropdownRef}>
                    <div className='user-info' onClick={() => {
                        // Refresh user data when opening dropdown to ensure we have latest
                        const refreshed = getCurrentUser();
                        if (refreshed) {
                            setUserDetails(refreshed);
                        }
                        setDropdownOpen(!dropdownOpen);
                    }}>
                        <div className='user-avatar'>
                            <img alt={userDetails?.username || userDetails?.name || ''} src={userDetails?.logo || ''}/>
                            <div className='user-status'></div>
                        </div>
                        <div className='user-details'>
                            <span className='user-name'>{userDetails?.username || userDetails?.name || ''}</span>
                            <span className='user-email'>{userDetails?.contactEmail || userDetails?.email || ''}</span>
                        </div>
                        <div className='dropdown-arrow'>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    {dropdownOpen && (
                        <div className='user-dropdown'>
                            <div className='dropdown-item' onClick={() => {
                                setEditProfileModal(true);
                                setDropdownOpen(false);
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Edit Profile
                            </div>
                            <div className='dropdown-item' onClick={() => {
                                setLogOutModal(true);
                                setDropdownOpen(false);
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Log Out
                            </div>
                        </div>
                    )}
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
                                setConsentModal(false);
                            }}
                        />
                    </div>
                </div>
                <hr/>
                <div className='modal-footer'>
                    <button className='button' onClick={() => setConsentModal(false)}>Cancel                    </button>
                </div>
            </Modal>

            <Modal
                isOpen={editProfileModal}
                onRequestClose={() => setEditProfileModal(false)}
                contentLabel="Edit Profile"
                className="page-modal"
                ariaHideApp={false}
                overlayClassName="modal-overlay"
                closeTimeoutMS={500}
            >
                <div className='modal-header'>
                    Edit Profile
                    <button
                        aria-label="Close"
                        onClick={() => setEditProfileModal(false)}
                        className="close-modal-btn"
                    >
                        ×
                    </button>
                </div>

                <div className='modal-content edit-profile-content'>
                    <div className='form-group'>
                        <label>Name</label>
                        <input 
                            type="text" 
                            value={(modalUserData || userDetails)?.name || ''} 
                            readOnly 
                            className="read-only-input"
                        />
                    </div>

                    <div className='form-group'>
                        <label>Email</label>
                        <input 
                            type="email" 
                            value={(modalUserData || userDetails)?.email || ''} 
                            readOnly 
                            className="read-only-input"
                        />
                    </div>

                    <div className='form-group'>
                        <label>Username</label>
                        <input 
                            type="text" 
                            value={profileForm.username}
                            onChange={(e) => {
                                setProfileForm({ ...profileForm, username: e.target.value });
                                if (formErrors.username) {
                                    setFormErrors({ ...formErrors, username: '' });
                                }
                            }}
                            className={formErrors.username ? 'error-input' : ''}
                            placeholder="Enter username (optional)"
                        />
                        {formErrors.username && <span className="error-message">{formErrors.username}</span>}
                    </div>

                    <div className='form-group'>
                        <label>Contact Email</label>
                        <input 
                            type="email" 
                            value={profileForm.contactEmail}
                            onChange={(e) => {
                                setProfileForm({ ...profileForm, contactEmail: e.target.value });
                                if (formErrors.contactEmail) {
                                    setFormErrors({ ...formErrors, contactEmail: '' });
                                }
                            }}
                            className={formErrors.contactEmail ? 'error-input' : ''}
                            placeholder="Enter contact email (optional)"
                        />
                        {formErrors.contactEmail && <span className="error-message">{formErrors.contactEmail}</span>}
                    </div>
                </div>
                <hr/>
                <div className='modal-footer'>
                    <button className='button' onClick={() => setEditProfileModal(false)} disabled={isSaving}>
                        Cancel
                    </button>
                    <button className='button blue' onClick={handleSaveProfile} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </Modal>
        </div>
    )
}
export default Header