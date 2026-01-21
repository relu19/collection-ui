import ConditionalRender from "../../utils/conditionalRender";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {changeFilters, deleteUserAndNumbers, getUsers} from "../../actions/users";
import logo from "../../images/avatar.jpg";
import './style.scss'
import {getURLParams} from "../../utils/getURLParams";
import {useDispatch} from "react-redux";
import Modal from "react-modal";
import Icon from "../icon";
import {getStorageItem} from "../../storage";
import notificationService from "../../services/notificationService";

const UsersList = ({setUsersModal}) => {

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true);
    const [modalData, setModalData] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userDetails = getStorageItem('collector-data')
    const ADMIN_TYPE = 114;
    const isAdmin = userDetails && userDetails.name ? userDetails.type === ADMIN_TYPE : false
    const isLoggedIn = userDetails && userDetails.name

    const params = getURLParams()

    useEffect(() => {
        getUsers().then(setUsers)
    }, []);

    useEffect(() => {
        if(users && users.length) {
            setLoading(false)
        }
    }, [users]);

    const deleteUser = async (userToDelete) => {
        try {
            await deleteUserAndNumbers(userToDelete, userDetails);
            setModalData(null);
            // Refresh the users list
            const updatedUsers = await getUsers();
            setUsers(updatedUsers);
        } catch (error) {
            console.error('Error deleting user:', error);
            notificationService.error('Failed to delete user. ' + (error.message || 'Please try again.'));
            setModalData(null);
        }
    }

    const goToUserPage = (user) => {
        const filters = {
            categoryId: params.category || 1,
            setTypeId: params.type || 11,
            userId: user.id,
            userContactEmail: user.contactEmail,
        }
        changeFilters(dispatch, filters)
        const url = `/sets?cat=${filters.categoryId}&type=${filters.setTypeId}&id=${filters.userId}`
        navigate(url)
        setUsersModal(false)
    }
    return (
        <div>
            <ConditionalRender if={loading}>
                <div className="spinner">
                    <div className="spinner-item"/>
                    <div className="spinner-item"/>
                    <div className="spinner-item"/>
                    <div className="spinner-item"/>
                    <div className="spinner-item"/>
                </div>
            </ConditionalRender>
            <ConditionalRender if={!loading && users?.length}>
                <div className='users-list'>
                    {users && users.map((user, i) =>
                        <div key={i} className='user-info'>
                            <ConditionalRender if={isAdmin}>
                                <Icon onClick={(e) => {
                                    e.stopPropagation();
                                    setModalData(user);
                                }} name='delete'
                                      color="#cccccc" width={14} height={14}/>
                            </ConditionalRender>
                            <div onClick={() => goToUserPage(user)}>
                                <div className="user-avatar-wrapper">
                                    <img alt='' src={user.logo || logo}/>
                                </div>
                                <div className="user-content">
                                    <span className="user-name">{user.username || user.name}</span>
                                    {isLoggedIn && user.email && <span className="user-email">{user.email}</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    <Modal
                        isOpen={!!modalData}
                        ariaHideApp={false}
                        onRequestClose={() => setModalData(null)}
                        contentLabel="Confirm Modal"
                        className="page-modal"
                        overlayClassName="modal-overlay"
                        closeTimeoutMS={500}
                    >
                        <div className='modal-header'>
                            Delete User
                        </div>

                        <div className='modal-content'>
                            Are you sure you want to delete this user?
                        </div>
                        <hr/>
                        <div className='modal-footer'>
                            <button className='button' onClick={() => setModalData(null)}>No</button>
                            <button className='button'
                                    onClick={() => deleteUser(modalData)}>Yes
                            </button>
                        </div>
                    </Modal>

                </div>
            </ConditionalRender>
        </div>

    )
}


export default UsersList