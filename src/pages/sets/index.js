import {
    getAllSetsWithNumbers,
} from "../../actions/set";
import React, {useEffect, useState} from "react";
import SetList from "../../components/setList";
import './style.scss'
import SetsMenu from "../../components/setsMenu";
import SetsInfo from "../../components/setsInfo";
import {useNavigate} from 'react-router-dom';
import {getStorageItem} from "../../storage";
import {getURLParams} from "../../utils/getURLParams";
import ConditionalRender from "../../utils/conditionalRender";


const SetsPage = () => {
    const params = getURLParams()
    const [data, dataSet] = useState([])

    const [searchParams, setSearchParams] = useState(params)
    const userDetails = getStorageItem('collector-data')

    const navigate = useNavigate();
    const fetchData = async () => {
        dataSet(await getAllSetsWithNumbers(searchParams))
    }


    useEffect(() => {
        fetchData()
        navigate(`?cat=${searchParams.category}&type=${searchParams.type}&id=${searchParams.userPublicId}`)
    }, [searchParams]);

    const changeFilters = (val) => {
        setSearchParams({...searchParams, type: val})
    }

    const isAdmin = userDetails ? userDetails.type === parseInt(process.env.REACT_APP_FACEBOOK_ADMIN_TYPE) : false
    const isMyPage = userDetails ? parseInt(userDetails.id) === parseInt(searchParams.userId) : false

    return (
        <div className='cl-content'>
            <div className='list-page'>
                <SetsMenu data={data} fetchData={fetchData} isAdmin={isAdmin} userId={searchParams.userId}
                          changeCategory={(val) => changeFilters(val)}/>

                <div className='my-sets'>
                    <ConditionalRender if={data.length}>
                        <SetList userDetails={userDetails} isMyPage={isMyPage} isAdmin={isAdmin} data={data}
                                 fetchData={fetchData}/>
                    </ConditionalRender>
                    <ConditionalRender if={!data.length}>
                        <div className='set-wrapper no-set'>No sets added yet.</div>
                    </ConditionalRender>
                </div>

                <SetsInfo/>
            </div>

        </div>
    )
}
export default SetsPage

