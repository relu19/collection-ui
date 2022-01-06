import {
    getAllSetsWithNumbers,
} from "../../actions/set";
import React, {useEffect, useState} from "react";
import NewSet from "../new-set";
import SetList from "../set-list";
import './style.scss'
import SetsMenu from "../sets-menu";
import SetsInfo from "../sets-info";

const SetsPage = ({userDetails}) => {

    const [data, dataSet] = useState([])
    const [category, setCategory] = useState('Turbo')

    const fetchData = async () => {
        dataSet(userDetails ? await getAllSetsWithNumbers(userDetails.id, category) : [])
    }

    useEffect(() => {
        fetchData()
    }, [userDetails, category]);



    const isAdmin = userDetails && userDetails.type === parseInt(process.env.REACT_APP_FACEBOOK_ADMIN_TYPE)



    return (
        <div>
            <div className='list-page'>
                <div className='sets-menu'>
                    <SetsMenu changeCategory={setCategory}/>
                    {isAdmin && <NewSet userDetails={userDetails} data={data} fetchData={fetchData}/>}
                </div>

                <div className='my-sets'>
                    <h2 className='sub-title'>{category}</h2>
                    <SetList userDetails={userDetails} data={data} fetchData={fetchData}/>
                </div>
                <div className='page-info'>
                    <SetsInfo />
                </div>
            </div>

        </div>
    )
}
export default SetsPage

