import {types} from "../../config";
import NewSet from "../newSet";
import {changeCategory, getUserById} from "../../actions/users";
import {useEffect, useState} from "react";
import './style.scss'

import logo from '../../images/avatar.jpg'
import Icon from "../icon";
import {useDispatch, useSelector} from "react-redux";
import objectAssign from "object-assign";
import {getURLParams} from "../../utils/getURLParams";

const SetsMenu = ({isAdmin, fetchData, data}) => {
    const [userInfo, setUserInfo] = useState({})
    const filterParams = useSelector((filters) => objectAssign({}, getURLParams(), filters.filterReducer));
    const dispatch = useDispatch();

    const fetchUser = async () => {
        const data = await getUserById(filterParams)
        if (!data.length) {
            window.location = '/'
        }
        setUserInfo(data ? data[0] : {})
    }

    useEffect(() => {
        fetchUser()
    }, [filterParams.userId]);

    const getIcon = (name) => {
        const iconFound = types[0].types.find(icon => icon.name === name)
        return iconFound && iconFound.iconClass
    }

    return (
        <nav className="menu" tabIndex="0">
            <header className="avatar">
                <div className="smartphone-menu-trigger"/>
                <img alt='' src={logo}/>
                <h2>{userInfo?.name}</h2>
            </header>
            <ul className='sets-list'>
                {types[0].types.map((type, i) =>
                    <li className={filterParams.type === type.name ? 'selected' : ''} key={i}
                        onClick={() => changeCategory(dispatch, type.name)}>
                        <Icon name={getIcon(type.name)} color="#cccccc" width={30} height={21}/> {type.displayName || type.name}
                    </li>
                )}
            </ul>

            {isAdmin && <NewSet data={data}  fetchData={fetchData}/>}
        </nav>
    )
}
export default SetsMenu
