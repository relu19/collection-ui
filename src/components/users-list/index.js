import ConditionalRender from "../../utils/conditionalRender";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {changeFilters, getUsers} from "../../actions/users";
import logo from "../../images/avatar.jpg";
import './style.scss'
import {getURLParams} from "../../utils/getURLParams";
import {useDispatch,} from "react-redux";

const UsersList = ({setUsersModal}) => {

    const [users, setUsers] = useState([])
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const params = getURLParams()

    useEffect(() => {
        getUsers().then(setUsers)
    }, []);


    const goToUserPage = (user) => {
        const filters = {
            category: params.category || 'wrappers',
            type: params.type || 'Turbo',
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
                    <div key={i} className='user-info'
                         onClick={() => goToUserPage(user)}>
                        <img alt='' src={logo}/><span>{user.name}</span></div>
                )}
            </div>
        </ConditionalRender>
    )
}


export default UsersList