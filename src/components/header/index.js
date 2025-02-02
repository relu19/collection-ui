import LoginPage from "../google-login";
import {deleteStorageItem, getStorageItem, setStorageItem} from "../../storage";
import {getUser} from "../../actions/users";
import React, {useState} from "react";
import Modal from "react-modal";
import './style.scss';
import UsersList from "../users-list";


const Header = () => {

    const [logInModal, setLogInModal] = useState(false);
    const [logOutModal, setLogOutModal] = useState(false);
    const [usersModal, setUsersModal] = useState(false);
    const [userDetails, setUserDetails] = useState(getStorageItem('collector-data'))

    const fetchUser = async (data) => {
        const userInfo = await getUser(data)

        const userId = userInfo?.length && userInfo[0].id
        const userType = userInfo?.length && userInfo[0].type
        const userData = {...data, id: userId, type: userType || 1, logo: data?.picture?.data?.url }
        setUserDetails(userData)
        setLogInModal(false)
        userInfo ? setStorageItem('collector-data', userData) : deleteStorageItem('collector-data')
        window.location = '/';
    }

    const logOutUser = () => {
        deleteStorageItem('collector-data')
        window.location = '/';
    }

    return (
        <div className='cl-header'>
            <div className='header-data'>
                <span className='collector-select' onClick={() => setUsersModal(true)}>Select Collector</span>
                {/*{!userDetails?.name && <span className='pointer' onClick={() => setLogInModal(true)}>Add your collection</span>}*/}
                {userDetails?.name && <div className='user-info' onClick={() => setLogOutModal(true)}>
                    <img alt={''} src={userDetails?.picture?.data?.url}/>
                    <p>{userDetails?.name}</p>
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

                </div>
                <LoginPage userDetails={userDetails} setUserDetails={fetchUser}/>
                <hr/>
                <p className='note'>*By creating an account you agree that your data will be saved and associated with any sets you
                    add to your collection</p>
                <div className='modal-footer'>
                    <button className='button' onClick={() => setLogInModal(false)}>Cancel</button>
                </div>
            </Modal>


            <Modal
                isOpen={usersModal}
                onRequestClose={() => setLogInModal(false)}
                contentLabel="My dialog"
                className="page-modal"
                ariaHideApp={false}
                overlayClassName="modal-overlay"
                closeTimeoutMS={500}
            >
                <div className='modal-header'>
                    Select Collector
                </div>

                <div className='modal-content'>
                    <UsersList setUsersModal={setUsersModal}/>
                </div>
                <hr/>
                <div className='modal-footer'>
                    <button className='button' onClick={() => setUsersModal(false)}>Close</button>
                    <button className='button blue' onClick={() => {setUsersModal(false); setLogInModal(true)}}>Add your own collection</button>
                </div>
            </Modal>
        </div>
    )
}
export default Header