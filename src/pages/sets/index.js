import {
    getAllSetsWithNumbers,
} from "../../actions/set";
import {getCategories} from "../../actions/category";
import React, {useEffect} from "react";
import SetList from "../../components/setList";
import './style.scss'
import SetsMenu from "../../components/setsMenu";
import SetsInfo from "../../components/setsInfo";
import {useNavigate} from 'react-router-dom';
import {getStorageItem} from "../../storage";
import ConditionalRender from "../../utils/conditionalRender";
import {useDispatch, useSelector} from "react-redux";
import Footer from "../../components/footer";
import {getSetTypes} from "../../actions/type";


const SetsPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userDetails = getStorageItem('collector-data')
    const sets = useSelector((sets) => sets.setsReducer);
    const filterParams = useSelector((filters) => filters.filterReducer);

    // const checkIfValidPage = async () => {
    //     const categoryExists = await categories.find(cat => cat.id === parseInt(filterParams.category))
    //     const typeExists = await types.find(type => type.id === parseInt(filterParams.type) && type.categoryId === parseInt(filterParams.category))
    //     console.log('categoryExists', categoryExists)
    //     console.log('typeExists', typeExists)
    //     return !!categoryExists && !!typeExists
    // }

    useEffect(() => {
        getSetTypes(dispatch).then(() => {})
        getCategories(dispatch).then(() => {})
    }, []);

    useEffect(() => {
        const url = `/sets?cat=${filterParams.category}&type=${filterParams.type}&id=${filterParams.userId}-${filterParams.userPublicId}`
        navigate(url, {replace: true})
        getAllSetsWithNumbers(dispatch, filterParams).then(r => {})
        // const validPage = checkIfValidPage();
        // if (!checkIfValidPage()) {
        //     // window.location = '/'
        // } else {
        //     navigate(url, {replace: true})
        //     getAllSetsWithNumbers(dispatch, filterParams).then(r => {})
        // }
    }, [filterParams]);

    const isAdmin = userDetails ? userDetails.type === parseInt(process.env.REACT_APP_FACEBOOK_ADMIN_TYPE) : false
    const isMyPage = userDetails ? parseInt(userDetails.id) === parseInt(filterParams.userId) : false

    return (
        <div className='cl-content'>
            <div className='list-page'>
                <SetsMenu data={sets} fetchData={() => getAllSetsWithNumbers(dispatch, filterParams)} isAdmin={isAdmin}/>

                <div className='my-sets'>
                    <ConditionalRender if={sets.length}>
                        <SetList userDetails={userDetails} isMyPage={isMyPage} isAdmin={isAdmin} data={sets}
                                 fetchData={() => getAllSetsWithNumbers(dispatch, filterParams)}/>
                    </ConditionalRender>
                    <ConditionalRender if={!sets.length}>
                        <div className='set-wrapper no-set'>No sets added yet.</div>
                    </ConditionalRender>
                    <Footer />
                </div>

                <SetsInfo/>
            </div>

        </div>
    )
}
export default SetsPage

