import './style.scss'
import React, {useEffect, useState} from "react";
import {getSetWithNumbers} from "../../actions/set";
import logo from "../../images/avatar.jpg";
import Icon from "../icon";

const UserExchange = ({user, setId, yourNeedList, yourExchangeList, setTotal, setLoading}) => {
    const [data, setData] = useState({forMe: [], forHim: []})

    useEffect(() => {
        const userExchangeList = []
        const userNeedList = []

        let data = {forMe: [], forHim: []}
        const getData = async () => {
            const userSetNumbers = await getSetWithNumbers(setId, user.id)
            userSetNumbers[0]?.numbers?.forEach(nr => {
                if (nr.type === 2) {
                    userExchangeList.push(nr.number)
                }
                if (nr.type === 0 || nr.type === 3) {
                    userNeedList.push(nr.number)
                }
            })
            const forMeList =  yourNeedList.length ? yourNeedList.filter(value => userExchangeList.includes(value)) : []
            const forHimList = yourExchangeList.length ? userNeedList.filter(value => yourExchangeList.includes(value)) : []
            data = {
                forMe: forMeList,
                forHim: forHimList
            }
            setData(data)
            setLoading(false)
        }
        getData()
    }, [setId, user.id, yourExchangeList, yourNeedList]);

    if (data.forMe.length !== 0 || data.forHim.length !== 0) {
        setLoading(false)
        setTotal(1)
    }

    return (data.forMe.length === 0 && data.forHim.length === 0 ? '' :
        <div className='exchanges-grid'>
            <div className='exchange-row'>
                <div className='exchange-item left-item'>
                    <div className='set-title'>Can Give Me</div>
                    <div className='numbers-list'>
                        {data.forMe.length > 0 ? (
                            <div className='regular-numbers'>
                                {data.forMe.map((item, i) => <span key={i}>{item}</span>)}
                            </div>
                        ) : (
                            <div className='regular-numbers'>
                                <span className='no-numbers'>-</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className='exchange-item right-item'>
                    <div className='set-title'>Needs From Me</div>
                    <div className='numbers-list'>
                        {data.forHim.length > 0 ? (
                            <div className='regular-numbers'>
                                {data.forHim.map((item, i) => <span key={i}>{item}</span>)}
                            </div>
                        ) : (
                            <div className='regular-numbers'>
                                <span className='no-numbers'>-</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default UserExchange
