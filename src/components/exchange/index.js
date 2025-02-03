import './style.scss'
import React, {useEffect, useState} from "react";
import {getUsers} from "../../actions/users";
import UserExchange from "./user-exchange";
import ConditionalRender from "../../utils/conditionalRender";
// import {getSetWithNumbers} from "../../actions/set";

const Exchange = ({set, setModal, userDetails, userInfo}) => {
    const [users, setUsers] = useState([])
    const [usersToShow, setUsersToShow] = useState([])
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0)
    const [justWithMe, setJustWithMe] = useState(false)
    const [showNoData, setShowNoData] = useState(false);

    useEffect(() => {
        if (!loading && total === 0) {
            const timer = setTimeout(() => setShowNoData(true), 300);
            return () => clearTimeout(timer);
        } else {
            setShowNoData(false);
        }
    }, [loading, total, usersToShow]);


    // const [myList, setMyList] = useState({need: [], have: []})

    const isMe = userInfo.id === userDetails.id;

    useEffect(() => {
        getUsers().then(res => {
            setUsers(res)
            setUsersToShow(res)
        })
    }, []);


    // useEffect(() => {
    //     const myNeedList = []
    //     const myExchangeList = []
    //
    //     const getData = async () => {
    //         const userSetNumbers = await getSetWithNumbers(set.id, userDetails.id)
    //         userSetNumbers[0]?.numbers?.forEach(nr => {
    //             if (nr.type === 2) {
    //                 myExchangeList.push(nr.number)
    //             }
    //             if (nr.type === 0 || nr.type === 3) {
    //                 myNeedList.push(nr.number)
    //             }
    //         })
    //         setMyList({need: myNeedList, have: myExchangeList})
    //     }
    //     getData()
    // }, [set.id, userDetails.id]);

    const yourExchangeList = []
    const yourNeedList = []

    set?.numbers?.forEach(nr => {
        if (nr.type === 2) {
            yourExchangeList.push(nr.number)
        }
        if (nr.type === 0 || nr.type === 3) {
            yourNeedList.push(nr.number)
        }
    })

    const closeModal = () => {
        setModal(false)
    }

    const compareWithMe = () => {
        if (justWithMe) {
            setJustWithMe(false)
            setUsersToShow(users)
        } else {
            setJustWithMe(true)
            setUsersToShow(users.filter(user => user.id === userDetails.id))
        }
    }

    return (
        <div>
            <div className='modal-header'>
                {set.name} - Trades for {userInfo.name}
            </div>
            <div className='modal-content'>
                <div className='exchange-table'>
                    {(!isMe && total) ?
                        <div className='compare-me'>
                            <input onChange={() => compareWithMe()} type="checkbox" id="horns" name="horns"/>
                            <label htmlFor="horns">Compare only with my list </label>
                        </div> : ''}
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
                                <p>Can Give {isMe ? 'Me' : userInfo.name}</p>
                            </div>
                            <div className='exchange-table__cell header'>
                                <p>Needs From {isMe ? 'Me' : userInfo.name}</p>
                            </div>
                        </div>
                    </ConditionalRender>
                    {usersToShow.map(user =>
                        <UserExchange yourExchangeList={yourExchangeList} yourNeedList={yourNeedList} user={user}
                                      setId={set.id} setTotal={setTotal} setLoading={setLoading} />
                    )}

                    <ConditionalRender if={showNoData}>
                        <p className='no-data'>No Data Found</p>
                    </ConditionalRender>
                </div>
            </div>
            <hr/>
            <div className='modal-footer'>
                <input className='button' type='button' value='Close'
                       onClick={() => closeModal()}/>
            </div>

        </div>

    )
}
export default Exchange
