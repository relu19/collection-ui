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

const UsersList = ({setUsersModal}) => {

    const [users, setUsers] = useState([])
    const [modalData, setModalData] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userDetails = getStorageItem('collector-data')
    const isAdmin = userDetails ? userDetails.type === parseInt(process.env.REACT_APP_FACEBOOK_ADMIN_TYPE) : false

    const params = getURLParams()

    useEffect(() => {
        getUsers().then(setUsers)
    }, []);


    const deleteUser = (set) => {
        deleteUserAndNumbers(set).then(() => window.location = '/')
        setModalData(false)
    }

    const goToUserPage = (user) => {
        const filters = {
            category: params.category || 1,
            type: params.type || 1,
            userId: user.id,
            userPublicId: user.publicId,
        }
        changeFilters(dispatch, filters)
        const url = `/sets?cat=${filters.category}&type=${filters.type}&id=${filters.userId}-${filters.userPublicId}`
        navigate(url)
        setUsersModal(false)
    }

    return (
        <ConditionalRender if={users && users.length}>
            <div className='users-list'>
                {users && users.map((user, i) =>
                    <div key={i} className='user-info'>
                        <ConditionalRender if={isAdmin}>
                            <Icon onClick={() => setModalData(user)} name='delete'
                                  color="#cccccc" width={15} height={15}/>
                        </ConditionalRender>
                        <div onClick={() => goToUserPage(user)}>
                            <img alt='' src={logo}/><span>{user.name}</span></div>

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
    )
}


export default UsersList