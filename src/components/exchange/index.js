import '../global-exchange/style.scss'
import React, { useEffect, useState } from "react";
import { getUsers } from "../../actions/users";
import { getSetWithNumbers, getUsersWithSetInCollection } from "../../actions/set";
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

                // Get only users who have this specific set in their collection
                const usersWithSet = await getUsersWithSetInCollection(set.id, set.categoryId, set.setTypeId);

                if (!usersWithSet || usersWithSet.length === 0) {
                    setExchangeResults([]);
                    setTotal(0);
                    setLoading(false);
                    return;
                }

                // Get user details for users who have the set
                const allUsers = await getUsers();
                const userIdsWithSet = usersWithSet.map(su => su.usersId);
                const usersWithSetDetails = allUsers.filter(user => userIdsWithSet.includes(user.id));

                // Filter out current user
                const otherUsers = usersWithSetDetails.filter(user => user.id !== userDetails.id);

                // Process exchange results - group by user
                const userExchangeMap = new Map();

                for (const user of otherUsers) {
                    // Check for potential exchanges
                    const exchange = await checkSetExchange(set.id, user.id, userDetails.id);
                    if (exchange.hasExchange) {
                        userExchangeMap.set(user, [{
                            set: set,
                            exchange: exchange
                        }]);
                    }
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

    const checkSetExchange = async (setId, user1Id, user2Id) => {
        try {
            // Get numbers for both users for this set
            const user1Numbers = await getSetWithNumbers(setId, user1Id);
            const user2Numbers = await getSetWithNumbers(setId, user2Id);

            if (!user1Numbers[0]?.numbers || !user2Numbers[0]?.numbers) {
                return {hasExchange: false};
            }

            // Separate regular and extra numbers for each user with full number objects
            // Type 0 OR Type 3 = "I need this number" (both are needed)
            // Type 2 = "I have this for exchange" (only type 2 is exchangeable)
            const user1RegularExchange = user1Numbers[0].numbers.filter(n => n.type === 2 && !n.extra);
            const user1ExtraExchange = user1Numbers[0].numbers.filter(n => n.type === 2 && n.extra);
            const user1RegularNeed = user1Numbers[0].numbers.filter(n => (n.type === 0 || n.type === 3) && !n.extra);
            const user1ExtraNeed = user1Numbers[0].numbers.filter(n => (n.type === 0 || n.type === 3) && n.extra);

            const user2RegularExchange = user2Numbers[0].numbers.filter(n => n.type === 2 && !n.extra);
            const user2ExtraExchange = user2Numbers[0].numbers.filter(n => n.type === 2 && n.extra);
            const user2RegularNeed = user2Numbers[0].numbers.filter(n => (n.type === 0 || n.type === 3) && !n.extra);
            const user2ExtraNeed = user2Numbers[0].numbers.filter(n => (n.type === 0 || n.type === 3) && n.extra);

            // Check exchanges: regular with regular, extra with extra
            const user1CanGiveRegular = user1RegularExchange.filter(num => user2RegularNeed.some(n => n.number === num.number));
            const user2CanGiveRegular = user2RegularExchange.filter(num => user1RegularNeed.some(n => n.number === num.number));

            const user1CanGiveExtra = user1ExtraExchange.filter(num => user2ExtraNeed.some(n => n.number === num.number));
            const user2CanGiveExtra = user2ExtraExchange.filter(num => user1ExtraNeed.some(n => n.number === num.number));

            // Combine results
            const user1CanGive = [...user1CanGiveRegular, ...user1CanGiveExtra];
            const user2CanGive = [...user2CanGiveRegular, ...user2CanGiveExtra];

            return {
                hasExchange: user1CanGive.length > 0 || user2CanGive.length > 0,
                user1CanGive,
                user2CanGive
            };
        } catch (error) {
            console.error('Error checking set exchange:', error);
            return {hasExchange: false};
        }
    };

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
                                    <p><h2>{user?.name}</h2></p>
                                </div>
                                {!collapsedUsers.has(user.id) && (
                                    <p className='user-email'>
                                        <a href={`mailto:${user?.email}`}>
                                            <Icon name='mail' color="#87CEFA" width={30} height={21}
                                                  className="email-icon"/>
                                            <span title={user?.email} className="email-text">{user?.email}</span>
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
                                                <div className='exchange-item right-item'>
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
