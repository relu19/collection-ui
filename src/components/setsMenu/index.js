import NewSet from "../newSet";
import { changeCategory, getUserById } from "../../actions/users";
import React, { useEffect, useState, useCallback } from "react";
import './style.scss'

import logo from '../../images/avatar.jpg'
import Icon from "../icon";
import { useDispatch, useSelector } from "react-redux";
import objectAssign from "object-assign";
import { getURLParams } from "../../utils/getURLParams";
import { getCategoriesWithSetTypes } from "../../actions/type";
import { getStorageItem } from "../../storage";
import ConditionalRender from "../../utils/conditionalRender";
import { closeMobileMenu } from "../../utils/closeMobileMenu";

const SetsMenu = ({isAdmin, data}) => {
    const [userInfo, setUserInfo] = useState({})
    const filterParams = useSelector((filters) => objectAssign({}, getURLParams(), filters.filterReducer));
    const [expandedIndex, setExpandedIndex] = useState(0); // Start with first menu item expanded
    const dispatch = useDispatch();

    const menu = useSelector((categories) => categories.categoriesReducer);

    const fetchUser = useCallback(async () => {
        const userData = await getUserById(filterParams)
        if (!userData.length) {
            window.location = '/'
        }
        setUserInfo(userData ? userData[0] : {})
    }, [filterParams]);

    useEffect(() => {
        getCategoriesWithSetTypes(dispatch).catch((err) => {
            // Error is already handled by the notification service
            if (err?.handled) {
                return;
            }
            console.error('Error loading categories:', err);
        });
    }, [dispatch]);

    useEffect(() => {
        fetchUser().catch((err) => {
            // Error is already handled by the notification service
            if (err?.handled) {
                return;
            }
            console.error('Error loading user:', err);
        });
    }, [fetchUser]);

    const toggleMenu = (index) => {
        // Toggle: if clicking the same menu, close it; otherwise open the new one
        setExpandedIndex(expandedIndex === index ? -1 : index);
    };

    // Calculate max height based on screen size
    const getMaxHeight = (isExpanded) => {
        if (!isExpanded) return '0';
        const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
        return screenHeight <= 900 ? '200px' : '450px';
    };

    const userDetails = getStorageItem('collector-data')

    return (
        <nav className="menu" tabIndex="0">
            <header className="avatar">
                <div className="smartphone-menu-trigger">
                     <span></span>
                     <span></span>
                     <span></span>
                </div>
                <img alt='' src={userInfo?.logo || logo}/>
                <h2>{userInfo?.username || userInfo?.name}</h2>
                <ConditionalRender if={userDetails?.id}>
                    <div className="email-container">
                        <p className="email-text">
                                <a title={userInfo?.contactEmail || userInfo?.email} href={`mailto:${userInfo?.contactEmail || userInfo?.email}`}>
                                {(userInfo?.contactEmail || userInfo?.email)?.split('@')[0].length > 15 ? (
                                    <>
                                        {(userInfo?.contactEmail || userInfo?.email)?.split('@')[0]}<br />
                                        <span className="email-domain">@{(userInfo?.contactEmail || userInfo?.email)?.split('@')[1]}</span>
                                    </>
                                ) : (
                                    userInfo?.contactEmail || userInfo?.email
                                )}
                            </a>
                        </p>
                    </div>
                </ConditionalRender>
                <ConditionalRender if={!userDetails?.id}>
                    <span className="email-container">(Log In to see contact details)</span>
                </ConditionalRender>
            </header>
            <ul>
            {menu && menu.map((category, i) => {
                const isExpanded = expandedIndex === i;
                return (
                    <li key={category.id} className={isExpanded ? 'active' : ''}>
                        <div 
                            onClick={() => toggleMenu(i)} 
                            className={`menu-header ${isExpanded ? 'expanded' : ''}`}
                        >
                            {category.name}
                        </div>
                        <ul 
                            className="sets-list"
                            style={{ maxHeight: getMaxHeight(isExpanded) }}
                        >
                            {category.categoryTypes.map((type) =>
                                <li 
                                    className={parseInt(filterParams.setTypeId) === type.id ? 'selected' : ''} 
                                    key={type.id}
                                    onClick={() => {
                                        changeCategory(dispatch, category.id, type.id);
                                        closeMobileMenu();
                                    }}
                                >
                                    <Icon name={type.icon} color="#cccccc" width={30} height={21}/> {type.name}
                                </li>
                            )}
                        </ul>
                    </li>
                );
            })}
            </ul>
            {isAdmin ? <NewSet userId={userInfo.id} data={data} /> : <div />}
        </nav>
    )
}
export default SetsMenu
