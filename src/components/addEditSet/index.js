import React, {useEffect, useState} from "react";
import './style.scss';
import AddEditCategory from "./addEditCategory";
import AddEditType from "./addEditType";
import {getCategoriesWithSetTypes} from "../../actions/type";
import {useDispatch, useSelector} from "react-redux";


const AddEditSet = ({data, setModal, onSave, fetchData}) => {
    const length = data?.length || 0
    const lastOrder = data.length ? data[length - 1].order + 1 : 0
    const defaultState = {
        id: data?.id,
        name: data?.name || '',
        minNr: data?.minNr || 1,
        maxNr: data?.maxNr || 70,
        link: data?.link || '',
        image: data?.image || '',
        extraNumbers: data?.extraNumbers || '',
        group: data?.group || '',
        categoryId: data?.categoryId || '',
        setTypeId: data?.setTypeId || '',
        order: data?.order || lastOrder
    }

    const [newSet, setNewSet] = useState(defaultState);
    const categories = useSelector((cat) => cat.categoriesReducer);
    const [error, setError] = useState('')
    const dispatch = useDispatch();

    const isEdit = !!data?.name

    const updateCategories = () => {
        getCategoriesWithSetTypes(dispatch)
    }

    useEffect(() => {
        updateCategories()
    }, []);


    const closeModal = () => {
        setModal(false)
        setError('')
    }

    const onSaveClick = () => {
        const { name, minNr, maxNr, categoryId, setTypeId, order, link, image } = newSet;

        if (
            !name ||
            minNr === null || minNr === undefined ||
            maxNr === null || maxNr === undefined ||
            !categoryId ||
            !setTypeId ||
            !order ||
            !link ||
            !image
        ) {
            setError('Fields with * are Required');
        } else {
            setError('');
            onSave(newSet).then(() => fetchData());
            setModal(false);
            setNewSet(defaultState);
        }
    };

    return (<div>
            <div className='modal-header'>
                {!data.name ? 'Add a New Set' : 'Edit Set'}
            </div>
            <div className='modal-content'>
                <div className='modal-form'>
                    <label>Set Name*</label>
                    <input type='text' value={newSet.name}
                           onChange={(e) => setNewSet({...newSet, name: e.target.value})}/>

                    <label>First Number*</label>
                    <input type='number' value={newSet.minNr}
                           onChange={(e) => setNewSet({...newSet, minNr: parseInt(e.target.value)})}/>

                    <label>Last Number*</label>
                    <input type='number' value={newSet.maxNr}
                           onChange={(e) => setNewSet({...newSet, maxNr: parseInt(e.target.value)})}/>

                    <AddEditCategory update={updateCategories} categories={categories} newSet={newSet} setNewSet={setNewSet} isEdit={isEdit} setError={setError}/>
                    <AddEditType update={updateCategories} categories={categories} newSet={newSet}
                                 setNewSet={setNewSet} isEdit={isEdit} setError={setError}/>

                    <label>Set Link*</label>
                    <input type='text' value={newSet.link}
                           onChange={(e) => setNewSet({...newSet, link: e.target.value})}/>

                    <label>Set Image*</label>
                    <input type='text' value={newSet.image}
                           onChange={(e) => setNewSet({...newSet, image: e.target.value})}/>

                    <label>Set Order*</label>
                    <input type='number' value={newSet.order}
                           onChange={(e) => setNewSet({...newSet, order: parseInt(e.target.value)})}/>

                    <label>Group</label>
                    <input type='text' value={newSet.group}
                           onChange={(e) => setNewSet({...newSet, group: e.target.value})}/>

                    <label>Extra Numbers</label>
                    <input type='text' value={newSet.extraNumbers}
                           onChange={(e) => setNewSet({...newSet, extraNumbers: e.target.value})}/>

                </div>
            </div>
            <p className='modal-error'>{error}</p>
            <hr/>
            <div className='modal-footer'>
                <input className='button' type='button' value='Cancel'
                       onClick={() => closeModal()}/>
                <input className='button' type='button' value='Save'
                       onClick={() => onSaveClick()}/>
            </div>
        </div>

    )
}


export default AddEditSet