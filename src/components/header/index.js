import FaceBookLogin from "../facebook-login";
import {deleteStorageItem, setStorageItem} from "../../storage";
import {getUser} from "../../actions/users";
import React, {useState} from "react";
import './style.scss';
import Modal from "react-modal";


const Header = ({userDetails, setUserDetails}) => {

    const [modal, setModal] = useState(false);


    const fetchUser = async (data) => {
        const userInfo = await getUser(data)
        const userId = userInfo.length && userInfo[0].id
        const userType = userInfo.length && userInfo[0].type
        const userData = {...data, id: userId, type: userType}
        setUserDetails(userData)
        setModal(false)
        setStorageItem('collector-data', userData)
    }

    const logOutUser = () => {
        deleteStorageItem('collector-data')
        window.location.reload();
    }

    return (
        <div className='cl-header'>
            {!userDetails && <div className='header-data'>
                <div/>
                <span onClick={() => setModal(true)}>Log In</span></div>}
            {userDetails && <div className='header-data'>
                <div className='user-info'><img alt={''} src={userDetails?.picture?.data?.url}/>
                    <p>{userDetails?.name}</p></div>
                <span onClick={() => logOutUser()}>Log Out</span></div>}

            <Modal
                isOpen={modal}
                onRequestClose={() => setModal(false)}
                contentLabel="My dialog"
                className="page-modal"
                overlayClassName="modal-overlay"
                closeTimeoutMS={500}
            >
                <p>Create an account so you can add your own collection and share it with others</p>
                <div className='modal-buttons'>
                    <button onClick={() => setModal(false)}>Cancel</button>
                    <FaceBookLogin userDetails={userDetails} setUserDetails={fetchUser}/>
                </div>
            </Modal>

        </div>
    )
}
export default Header