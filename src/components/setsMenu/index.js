import {types, typesIcons} from "../../config";
import NewSet from "../newSet";
import {getUser} from "../../actions/users";
import {useEffect, useState} from "react";
import './style.scss'

import logo from '../../images/avatar.jpg'
import {getURLParams} from "../../utils/getURLParams";
import Icon from "../icon";

const SetsMenu = ({changeCategory, isAdmin, userId, fetchData, data}) => {

    const [userInfo, setUserInfo] = useState({})

    const params = getURLParams()

    const fetchUser = async () => {
        const data = await getUser(userId)
        setUserInfo(data ? data[0] : {})
    }

    useEffect(() => {
        fetchUser()
    }, []);

    const getIcon = (name) => {
      const iconFound  =  typesIcons.find(icon => icon.name ===name)
        return iconFound && iconFound.iconClass
    }


    return (
        <nav className="menu" tabIndex="0">

            <header className="avatar">
                <div className="smartphone-menu-trigger"/>
                <img alt='' src={logo}/>
                <h2>{userInfo.name}</h2>
            </header>
            <ul className='sets-list'>
                {types[0].types.map((type, i) =>
                    <li className={params.type === type ? 'selected' : ''} key={i} onClick={() => changeCategory(type)}>
                        <Icon name={getIcon(type)} color="#cccccc" width={30} height={21} /> {type}
                    </li>
                )}
            </ul>

            {isAdmin && <NewSet data={data} fetchData={fetchData}/>}
        </nav>

    )
}
export default SetsMenu
