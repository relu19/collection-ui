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
import ConditionalRender from "../../utils/conditionalRender";
import {useSelector} from "react-redux";
import {types} from "../../config";


const SetsPage = () => {
    const [data, dataSet] = useState([])
    const navigate = useNavigate();

    const userDetails = getStorageItem('collector-data')

    const filterParams = useSelector((filters) => filters.filterReducer);

    const fetchData = async () => {
        dataSet(await getAllSetsWithNumbers(filterParams))
    }

    const checkIfValidPage = () => {
        const categoryExists = types.find(type => type.category === filterParams.category)
        const typeExists = categoryExists && categoryExists.types.find(type => type === filterParams.type)
        return !!categoryExists && !!typeExists
    }


    useEffect(() => {
        const url = `/sets?cat=${filterParams.category}&type=${filterParams.type}&id=${filterParams.userId}-${filterParams.userPublicId}`
        if (!checkIfValidPage()) {
            window.location = '/'
        } else {
            navigate(url, {replace: true})
            fetchData()
        }
    }, [filterParams]);

    const isAdmin = userDetails ? userDetails.type === parseInt(process.env.REACT_APP_FACEBOOK_ADMIN_TYPE) : false
    const isMyPage = userDetails ? parseInt(userDetails.id) === parseInt(filterParams.userId) : false

    return (
        <div className='cl-content'>
            <div className='list-page'>
                <SetsMenu data={data} fetchData={fetchData} isAdmin={isAdmin}/>

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

