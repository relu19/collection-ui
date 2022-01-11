import ConditionalRender from "../../utils/conditionalRender";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getUsers} from "../../actions/users";
import logo from "../../images/avatar.jpg";
import './style.scss'
import {getURLParams} from "../../utils/getURLParams";

const UsersList = ({setUsersModal}) => {

    const [users, setUsers] = useState([])
    const navigate = useNavigate();

    const params = getURLParams()

    useEffect(() => {
        getUsers().then(setUsers)
    }, []);

    const goToUserPage = (user) => {
        navigate(params ? `/sets?cat=${params.category}&type=${params.type}&id=${user.id}-${user.publicId}` : `/sets?cat=wrappers&type=Turbo&id=${user.id}-${user.publicId}`)
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