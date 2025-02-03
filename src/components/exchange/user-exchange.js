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
        <div className='exchange-table__row'>
            <div className='exchange-table__cell'>
                <div className='user-info'>
                    <img alt='' src={user?.logo || logo}/>
                    <p><h2>{user?.name}</h2></p>
                </div>
                <p className='user-info'><Icon name='mail' color="#000" width={30} height={21}/><a href={`mailto:${user?.email}`}>{user?.email}</a></p>
                <p className='user-info'><Icon name='phone' color="#000" width={30} height={21}/>N/A</p>
            </div>
            <div className='exchange-table__cell get'>
    {data.forMe.length ? data.forMe.map(item => <span>{item}</span>) : ''}
                </div>
                <div className='exchange-table__cell give'>
                    {data.forHim.length ? data.forHim.map(item => <span>{item}</span>) : ''}
                </div>
            </div>
    )
}
export default UserExchange
