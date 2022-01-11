import ConditionalRender from "../../utils/conditionalRender";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getUsers} from "../../actions/users";
import logo from "../../images/avatar.jpg";
import './style.scss'

const UsersList = () => {

    const [users, setUsers] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        getUsers().then(setUsers)
    }, []);

    return (
        <ConditionalRender if={users && users.length}>
            <div className='users-list'>
                {users && users.map((user,i) =>
                    <div key={i} className='user-info'
                         onClick={() => navigate(`/sets?cat=wrappers&type=Turbo&id=${user.id}-${user.publicId}`)}>
                        <img alt='' src={logo}/><span>{user.name}</span></div>
                )}
            </div>
        </ConditionalRender>
    )
}


export default UsersList