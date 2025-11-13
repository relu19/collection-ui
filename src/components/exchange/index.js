import '../global-exchange/style.scss'
import React, { useEffect, useState } from "react";
import { getSetExchanges } from "../../actions/set";
import ConditionalRender from "../../utils/conditionalRender";
import Icon from "../icon";
import logo from "../../images/avatar.jpg";

const Exchange = ({set, setModal, userDetails, userInfo}) => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0)
    const [showNoData, setShowNoData] = useState(false);
    const [exchangeResults, setExchangeResults] = useState([])
    const [collapsedUsers, setCollapsedUsers] = useState(new Set())

    const toggleUserCollapse = (userId) => {
        setCollapsedUsers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(userId)) {
                newSet.delete(userId);
            } else {
                newSet.add(userId);
            }
            return newSet;
        });
    };

    useEffect(() => {
        if (!loading && total === 0) {
            const timer = setTimeout(() => setShowNoData(true), 300);
            return () => clearTimeout(timer);
        } else {
            setShowNoData(false);
        }
    }, [loading, total]);

    const isMe = userInfo.id === userDetails.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Use the new backend endpoint for much faster performance
                const setExchangesData = await getSetExchanges(set.id, userDetails.id);
                
                if (!setExchangesData.exchanges || setExchangesData.exchanges.length === 0) {
                    setExchangeResults([]);
                    setTotal(0);
                    setLoading(false);
                    return;
                }

                // Convert backend data to frontend format
                const userExchangeMap = new Map();
                
                for (const userExchange of setExchangesData.exchanges) {
                    // Create user object
                    const user = {
                        id: userExchange.userId,
                        name: userExchange.userName,
                        email: userExchange.userEmail,
                        logo: userExchange.userLogo
                    };
                    
                    // Convert exchanges to frontend format
                    const exchanges = userExchange.exchanges.map(exchange => ({
                        set: {
                            id: exchange.setId,
                            name: exchange.setName
                        },
                        exchange: {
                            hasExchange: true,
                            user1CanGive: exchange.user1CanGive,
                            user2CanGive: exchange.user2CanGive
                        }
                    }));
                    
                    userExchangeMap.set(user, exchanges);
                }

                setExchangeResults(Array.from(userExchangeMap.entries()));
                setTotal(userExchangeMap.size);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setUsers([]);
                setExchangeResults([]);
                setLoading(false);
            }
        };

        fetchData();
    }, [set.id, userDetails.id]);



    const formatNumberDisplay = (numberObj) => {
        // Always show the number, not the description
        return numberObj.number;
    };

    const closeModal = () => {
        setModal(false)
    }

    return (
        <div>
            <div className='modal-header modal-header--fixed'>
                <span>Exchanges for {set.name}</span>
                <button
                    aria-label="Close"
                    onClick={closeModal}
                    className="close-modal-btn"
                >
                    ×
                </button>
            </div>
            <div
                className='modal-content'
                style={{maxHeight: '60vh', overflowY: 'auto'}}
            >
                <div className='exchange-table'>
                    <ConditionalRender if={loading}>
                        <div className="spinner">
                            <div className="spinner-item"/>
                            <div className="spinner-item"/>
                            <div className="spinner-item"/>
                            <div className="spinner-item"/>
                            <div className="spinner-item"/>
                        </div>
                    </ConditionalRender>
                    <ConditionalRender if={!loading && total}>
                        <div className='exchange-table__row'>
                            <div className='exchange-table__cell header'>
                                <p>User</p>
                            </div>
                            <div className='exchange-table__cell header'>
                                <div className='sub-header-labels'>
                                    <div className='sub-header-label'>Can Give Me</div>
                                    <div className='sub-header-label'>Need From Me</div>
                                </div>
                            </div>
                        </div>
                    </ConditionalRender>

                    {exchangeResults.map(([user, exchanges], userIndex) => (
                        <div key={userIndex}
                             className={`exchange-table__row ${collapsedUsers.has(user.id) ? 'collapsed' : ''}`}>
                            <button
                                className='collapse-toggle'
                                onClick={() => toggleUserCollapse(user.id)}
                                aria-label={collapsedUsers.has(user.id) ? 'Expand' : 'Collapse'}
                            >
                                {collapsedUsers.has(user.id) ? '+' : '-'}
                            </button>
                            <div className='exchange-table__cell user-cell'>
                                <div className='user-info'>
                                    <img alt='' src={user?.logo || logo}/>
                                    <p><h2>{user?.username || user?.name}</h2></p>
                                </div>
                                {!collapsedUsers.has(user.id) && (
                                    <p className='user-email'>
                                        <a href={`mailto:${user?.contactEmail || user?.email}`}>
                                            <Icon name='mail' color="#87CEFA" width={30} height={21}
                                                  className="email-icon"/>
                                            <span title={user?.contactEmail || user?.email} className="email-text">{user?.contactEmail || user?.email}</span>
                                        </a>
                                    </p>
                                )}
                            </div>
                            <div className='exchange-table__cell exchanges-cell'>
                                {!collapsedUsers.has(user.id) && (
                                    <div className='exchanges-grid'>
                                        {exchanges.map((exchange, exchangeIndex) => (
                                            <div key={exchangeIndex} className='exchange-row'>
                                                <div className='exchange-item left-item'>
                                                    <div className='set-title'>{exchange.set?.name}</div>
                                                    <div className='numbers-list'>
                                                        {exchange.exchange.user2CanGive.length ?
                                                            (() => {
                                                                const regularNumbers = exchange.exchange.user2CanGive.filter(item => !item.extra);
                                                                const extraNumbers = exchange.exchange.user2CanGive.filter(item => item.extra);
                                                                return (
                                                                    <>
                                                                        {regularNumbers.length > 0 && (
                                                                            <div className='regular-numbers'>
                                                                                {regularNumbers.map((item, i) => <span
                                                                                    key={i}>{formatNumberDisplay(item)}</span>)}
                                                                            </div>
                                                                        )}
                                                                        {extraNumbers.length > 0 && (
                                                                            <>
                                                                                <p className='extra-numbers-title'>{exchange.set?.extraNumbersTitle || 'Extra Numbers'}</p>
                                                                                <div className='regular-numbers'>
                                                                                    {extraNumbers.map((item, i) => <span
                                                                                        key={i}>{formatNumberDisplay(item)}</span>)}
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </>
                                                                );
                                                            })() :
                                                            <div className='regular-numbers'>
                                                                <span className='no-numbers'>-</span>
                                                            </div>
                                                        }
                                                    </div>



                                                </div>
                                                <div className='exchange-item right-item'>



                                                    <div className='set-title'>{exchange.set?.name}</div>
                                                    <div className='numbers-list'>
                                                        {exchange.exchange.user1CanGive.length ?
                                                            (() => {
                                                                const regularNumbers = exchange.exchange.user1CanGive.filter(item => !item.extra);
                                                                const extraNumbers = exchange.exchange.user1CanGive.filter(item => item.extra);
                                                                return (
                                                                    <>
                                                                        {regularNumbers.length > 0 && (
                                                                            <div className='regular-numbers'>
                                                                                {regularNumbers.map((item, i) => <span
                                                                                    key={i}>{formatNumberDisplay(item)}</span>)}
                                                                            </div>
                                                                        )}
                                                                        {extraNumbers.length > 0 && (
                                                                            <>
                                                                                <p className='extra-numbers-title'>{exchange.set?.extraNumbersTitle || 'Extra Numbers'}</p>
                                                                                <div className='regular-numbers'>
                                                                                    {extraNumbers.map((item, i) => <span
                                                                                        key={i}>{formatNumberDisplay(item)}</span>)}
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </>
                                                                );
                                                            })() :
                                                            <div className='regular-numbers'>
                                                                <span className='no-numbers'>-</span>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    <ConditionalRender if={showNoData}>
                        <p className='no-data'>
                            No potential exchanges found.
                        </p>
                    </ConditionalRender>
                </div>
            </div>
        </div>
    )
}
export default Exchange
