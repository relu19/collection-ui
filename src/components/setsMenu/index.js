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

const SetsMenu = ({isAdmin, data}) => {
    const [userInfo, setUserInfo] = useState({})
    const filterParams = useSelector((filters) => objectAssign({}, getURLParams(), filters.filterReducer));
    const [clicked, setClicked] = useState(0);
    const dispatch = useDispatch();

    const menu = useSelector((categories) => categories.categoriesReducer);


    const handleToggle = (index) => {
        setClicked(index)
    };

    const fetchUser = async () => {
        const data = await getUserById(filterParams)
        if (!data.length) {
            window.location = '/'
        }
        setUserInfo(data ? data[0] : {})
    }

    useEffect(() => {
        getCategoriesWithSetTypes(dispatch)
    }, []);


    useEffect(() => {
        fetchUser().then(() => {})
    }, [filterParams.userId]);

    const toggleMenu = (id) => {
        const menuHeader = document.getElementById(id + 'header');
        const menu = document.getElementById(id);
        menuHeader.classList.toggle('expanded');
        const menuHeight = menu.style.maxHeight
        if (!menuHeight || menuHeight=== '500px') {
            menu.style.maxHeight = '0'
        } else {
            menu.style.maxHeight = '500px'
        }
    }

    return (
        <nav className="menu" tabIndex="0">
            <header className="avatar">
                <div className="smartphone-menu-trigger"/>
                <img alt='' src={userInfo?.logo || logo}/>
                <h2>{userInfo?.name}</h2>
            </header>
            <ul>
                {menu && menu.map((category, i) =>
                    <li key={i} onClick={() => handleToggle(i)}  className={`${clicked === i ? 'active' : ''}`}>
                        <div onClick={() => toggleMenu(category.id + '' + i)} id={category.id + '' + i + 'header'} className='menu-header'>{category.name}</div>
                        <ul id={category.id + '' + i} className={`sets-list`}>
                            {category.categoryTypes.map((type, j) =>
                                <li className={parseInt(filterParams.setTypeId) === type.id ? 'selected' : ''} key={j}
                                    onClick={() => {changeCategory(dispatch, category.id, type.id); handleToggle(i)}}>
                                    <Icon name={type.icon} color="#cccccc" width={30} height={21}/> {type.name}
                                </li>
                            )}
                        </ul>
                    </li>
                )}
            </ul>
            {isAdmin ? <NewSet userId={userInfo.id} data={data} /> : <div />}
        </nav>
    )
}
export default SetsMenu
