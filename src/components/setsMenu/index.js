import NewSet from "../newSet";
import {changeCategory, getUserById} from "../../actions/users";
import {useEffect, useState} from "react";
import './style.scss'

import logo from '../../images/avatar.jpg'
import Icon from "../icon";
import {useDispatch, useSelector} from "react-redux";
import objectAssign from "object-assign";
import {getURLParams} from "../../utils/getURLParams";
import {getCategoriesWithSetTypes} from "../../actions/type";

const SetsMenu = ({isAdmin, fetchData, data}) => {
    const [userInfo, setUserInfo] = useState({})
    const filterParams = useSelector((filters) => objectAssign({}, getURLParams(), filters.filterReducer));

    const [menu, setMenu] = useState([])

    const dispatch = useDispatch();

    const fetchUser = async () => {
        const data = await getUserById(filterParams)
        if (!data.length) {
            window.location = '/'
        }
        setUserInfo(data ? data[0] : {})
    }

    useEffect(() => {
        getCategoriesWithSetTypes().then(setMenu)
    }, []);


    useEffect(() => {
        fetchUser().then(() => {})
    }, [filterParams.userId]);

    return (
        <nav className="menu" tabIndex="0">
            <header className="avatar">
                <div className="smartphone-menu-trigger"/>
                <img alt='' src={logo}/>
                <h2>{userInfo?.name}</h2>
            </header>
            <ul className='sets-list'>
                {menu.map((type, i) =>
                    <li className={parseInt(filterParams.type) === type.id ? 'selected' : ''} key={i}
                        onClick={() => changeCategory(dispatch, type.id)}>
                        <Icon name={type.icon} color="#cccccc" width={30} height={21}/> {type.displayName || type.name}
                    </li>
                )}
            </ul>

            {isAdmin && <NewSet data={data}  fetchData={fetchData}/>}
        </nav>
    )
}
export default SetsMenu
