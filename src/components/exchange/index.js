import './style.scss'
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
    const [searchQuery, setSearchQuery] = useState('')

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
        return numberObj.number;
    };

    const closeModal = () => {
        setModal(false)
    }

    // Calculate totals for stats
    const getTotalStats = () => {
        let totalCanGet = 0;
        let totalCanGive = 0;
        
        exchangeResults.forEach(([user, exchanges]) => {
            exchanges.forEach(exchange => {
                totalCanGet += exchange.exchange.user2CanGive.length;
                totalCanGive += exchange.exchange.user1CanGive.length;
            });
        });
        
        return { totalCanGet, totalCanGive };
    };

    // Filter results based on search query
    const filteredResults = exchangeResults.filter(([user, exchanges]) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            user?.name?.toLowerCase().includes(query) ||
            user?.username?.toLowerCase().includes(query) ||
            user?.email?.toLowerCase().includes(query)
        );
    });

    const stats = getTotalStats();

    return (
        <div className="set-exchange-modal">
            <div className='modal-header modal-header--fixed'>
                <div className="modal-header__title">
                    <Icon name='search' color="#fff" width={20} height={20} />
                    <span>Exchanges for {set.name}</span>
                </div>
                <button
                    aria-label="Close"
                    onClick={closeModal}
                    className="close-modal-btn"
                >
                    <Icon name='close' color="#fff" width={20} height={20} />
                </button>
            </div>
            
            <div className='modal-content set-exchange-content'>
                <ConditionalRender if={loading}>
                    <div className="loading-container">
                        <div className="spinner">
                            <div className="spinner-item"/>
                            <div className="spinner-item"/>
                            <div className="spinner-item"/>
                            <div className="spinner-item"/>
                            <div className="spinner-item"/>
                        </div>
                        <p className="loading-text">Finding exchange partners...</p>
                    </div>
                </ConditionalRender>

                <ConditionalRender if={!loading && total > 0}>
                    {/* Stats Summary */}
                    <div className="exchange-stats exchange-stats--compact">
                        <div className="stat-card stat-card--users">
                            <div className="stat-icon">
                                <Icon name='users' color="#6366f1" width={20} height={20} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">{total}</span>
                                <span className="stat-label">Users</span>
                            </div>
                        </div>
                        <div className="stat-card stat-card--receive">
                            <div className="stat-icon">
                                <Icon name='download' color="#10b981" width={20} height={20} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">{stats.totalCanGet}</span>
                                <span className="stat-label">Can Get</span>
                            </div>
                        </div>
                        <div className="stat-card stat-card--give">
                            <div className="stat-icon">
                                <Icon name='upload' color="#f59e0b" width={20} height={20} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">{stats.totalCanGive}</span>
                                <span className="stat-label">Can Give</span>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="exchange-search">
                        <Icon name='search' color="#9ca3af" width={16} height={16} />
                        <input 
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button 
                                className="clear-search" 
                                onClick={() => setSearchQuery('')}
                                aria-label="Clear search"
                            >
                                <Icon name='close' color="#9ca3af" width={14} height={14} />
                            </button>
                        )}
                    </div>

                    {/* User Cards */}
                    <div className="exchange-users-list">
                        {filteredResults.map(([user, exchanges], userIndex) => {
                            const isCollapsed = collapsedUsers.has(user.id);
                            const userCanGet = exchanges.reduce((sum, e) => sum + e.exchange.user2CanGive.length, 0);
                            const userCanGive = exchanges.reduce((sum, e) => sum + e.exchange.user1CanGive.length, 0);
                            
                            return (
                                <div 
                                    key={userIndex} 
                                    className={`user-card ${isCollapsed ? 'user-card--collapsed' : ''}`}
                                >
                                    <div 
                                        className="user-card__header"
                                        onClick={() => toggleUserCollapse(user.id)}
                                    >
                                        <div className="user-card__avatar">
                                            <img alt={user?.username || user?.name} src={user?.logo || logo}/>
                                        </div>
                                        <div className="user-card__info">
                                            <h3 className="user-card__name">{user?.username || user?.name}</h3>
                                            <div className="user-card__meta">
                                                <span className="exchange-badge exchange-badge--receive">
                                                    <Icon name='download' color="#10b981" width={12} height={12} />
                                                    {userCanGet}
                                                </span>
                                                <span className="exchange-badge exchange-badge--give">
                                                    <Icon name='upload' color="#f59e0b" width={12} height={12} />
                                                    {userCanGive}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="user-card__actions">
                                            <a 
                                                href={`mailto:${user?.contactEmail || user?.email}`}
                                                className="contact-btn"
                                                onClick={(e) => e.stopPropagation()}
                                                title={user?.contactEmail || user?.email}
                                            >
                                                <Icon name='mail' color="#87CEFA" width={20} height={20} />
                                            </a>
                                            <button 
                                                className="expand-btn"
                                                aria-label={isCollapsed ? 'Expand' : 'Collapse'}
                                            >
                                                <Icon 
                                                    name={isCollapsed ? 'chevron-down' : 'chevron-up'} 
                                                    color="#9ca3af" 
                                                    width={20} 
                                                    height={20} 
                                                />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {!isCollapsed && (
                                        <div className="user-card__content">
                                            {exchanges.map((exchange, exchangeIndex) => (
                                                <div key={exchangeIndex} className="set-exchange-card">
                                                    <div className="set-exchange-card__body">
                                                        <div className="exchange-column exchange-column--receive">
                                                            <div className="exchange-column__header">
                                                                <Icon name='download' color="#10b981" width={14} height={14} />
                                                                <span>Can Give Me</span>
                                                            </div>
                                                            <div className="exchange-column__numbers">
                                                                {exchange.exchange.user2CanGive.length > 0 ? (
                                                                    <>
                                                                        {(() => {
                                                                            const regularNumbers = exchange.exchange.user2CanGive.filter(item => !item.extra);
                                                                            const extraNumbers = exchange.exchange.user2CanGive.filter(item => item.extra);
                                                                            return (
                                                                                <>
                                                                                    {regularNumbers.length > 0 && (
                                                                                        <div className="numbers-group">
                                                                                            {regularNumbers.map((item, i) => (
                                                                                                <span key={i} className="number-tag number-tag--receive">
                                                                                                    {formatNumberDisplay(item)}
                                                                                                </span>
                                                                                            ))}
                                                                                        </div>
                                                                                    )}
                                                                                    {extraNumbers.length > 0 && (
                                                                                        <div className="extra-section">
                                                                                            <span className="extra-label">
                                                                                                {exchange.set?.extraNumbersTitle || 'Extra'}
                                                                                            </span>
                                                                                            <div className="numbers-group">
                                                                                                {extraNumbers.map((item, i) => (
                                                                                                    <span key={i} className="number-tag number-tag--receive number-tag--extra">
                                                                                                        {formatNumberDisplay(item)}
                                                                                                    </span>
                                                                                                ))}
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                </>
                                                                            );
                                                                        })()}
                                                                    </>
                                                                ) : (
                                                                    <span className="no-items">None</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="exchange-divider"></div>
                                                        <div className="exchange-column exchange-column--give">
                                                            <div className="exchange-column__header">
                                                                <Icon name='upload' color="#f59e0b" width={14} height={14} />
                                                                <span>Need From Me</span>
                                                            </div>
                                                            <div className="exchange-column__numbers">
                                                                {exchange.exchange.user1CanGive.length > 0 ? (
                                                                    <>
                                                                        {(() => {
                                                                            const regularNumbers = exchange.exchange.user1CanGive.filter(item => !item.extra);
                                                                            const extraNumbers = exchange.exchange.user1CanGive.filter(item => item.extra);
                                                                            return (
                                                                                <>
                                                                                    {regularNumbers.length > 0 && (
                                                                                        <div className="numbers-group">
                                                                                            {regularNumbers.map((item, i) => (
                                                                                                <span key={i} className="number-tag number-tag--give">
                                                                                                    {formatNumberDisplay(item)}
                                                                                                </span>
                                                                                            ))}
                                                                                        </div>
                                                                                    )}
                                                                                    {extraNumbers.length > 0 && (
                                                                                        <div className="extra-section">
                                                                                            <span className="extra-label">
                                                                                                {exchange.set?.extraNumbersTitle || 'Extra'}
                                                                                            </span>
                                                                                            <div className="numbers-group">
                                                                                                {extraNumbers.map((item, i) => (
                                                                                                    <span key={i} className="number-tag number-tag--give number-tag--extra">
                                                                                                        {formatNumberDisplay(item)}
                                                                                                    </span>
                                                                                                ))}
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                </>
                                                                            );
                                                                        })()}
                                                                    </>
                                                                ) : (
                                                                    <span className="no-items">None</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {filteredResults.length === 0 && searchQuery && (
                        <div className="no-results">
                            <Icon name='search' color="#6b7280" width={48} height={48} />
                            <p>No matches found for "{searchQuery}"</p>
                        </div>
                    )}
                </ConditionalRender>

                <ConditionalRender if={showNoData}>
                    <div className="no-data-container">
                        <div className="no-data-icon">
                            <Icon name='search' color="#6b7280" width={64} height={64} />
                        </div>
                        <h3>No Exchanges Found</h3>
                        <p>No potential exchange partners found for this set.</p>
                    </div>
                </ConditionalRender>
            </div>
        </div>
    )
}
export default Exchange
