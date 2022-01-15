import React, {useEffect, useState} from "react";
import Modal from "react-modal";
import {addNewCategory, getCategories, updateCategory} from "../../../actions/category";
import {useDispatch, useSelector} from "react-redux";

const AddEditCategory = ({newSet, setNewSet, isEdit}) => {
    const [addCategoryModal, setAddCategoryModal] = useState(false);
    const [editCategoryModal, setEditCategoryModal] = useState(false);
    const [newCategory, setNewCategory] = useState({id: '', name: '', order: ''});
    const [error, setError] = useState('')
    const categories = useSelector((category) => category.categoryReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        getCategories(dispatch)
    }, []);

    const addUpdateCategory = (isUpdate) => {
        if (!newCategory.name || !newCategory.order) {
            setError('All Fields are Required')
        } else {
            isUpdate ? updateCategory(newCategory).then(() => getCategories(dispatch)) : addNewCategory(newCategory).then(() => getCategories(dispatch))
            setError('')
            setAddCategoryModal(false)
            setEditCategoryModal(false)
            setNewCategory({id: '', name: '', order: ''})
        }
    }


    const getEditedCategory = (id) => {
        const categoryFound = categories.find(cat => cat.id === id)
        setEditCategoryModal(true)
        setNewCategory(categoryFound)
    }

    return (
        <>
            <label>Category</label>
            <select defaultValue={newSet.categoryId}
                    onChange={(e) => setNewSet({...newSet, category: parseInt(e.target.value), type: ''})}>
                <option value={undefined}>Select Category</option>
                {categories.map((cat, i) => <option key={i} value={cat.id}>{cat.name}</option>)}
            </select>

            <label className='no-value'/>
            <p className='no-value'>
                <span onClick={() => {
                    setAddCategoryModal(true);
                    setError('')
                }}>Add</span>
                {newSet.category ? <span onClick={() => {
                    getEditedCategory(newSet.category);
                    setError('')
                }}>Edit</span> : ''}
            </p>

            <Modal
                isOpen={addCategoryModal}
                ariaHideApp={false}
                onRequestClose={() => setAddCategoryModal(false)}
                contentLabel="Confirm Modal"
                className="page-modal"
                overlayClassName="modal-overlay"
                closeTimeoutMS={500}
            >
                <div className='modal-header'>
                    Add Category
                </div>

                <div className='modal-content'>
                    <div className='modal-form'>
                        <label>Name</label>
                        <input disabled={isEdit} type='text' value={newCategory.name}
                               onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}/>
                        <label>Order</label>
                        <input disabled={isEdit} type='number' value={newCategory.order}
                               onChange={(e) => setNewCategory({...newCategory, order: e.target.value})}/>
                    </div>
                </div>
                <p className='modal-error'>{error}</p>
                <hr/>
                <div className='modal-footer'>
                    <button className='button' onClick={() => {
                        setAddCategoryModal(false)
                    }}>Cancel
                    </button>
                    <button className='button' onClick={() => addUpdateCategory(false)}>Add</button>
                </div>
            </Modal>


            <Modal
                isOpen={editCategoryModal}
                ariaHideApp={false}
                onRequestClose={() => setEditCategoryModal(false)}
                contentLabel="Confirm Modal"
                className="page-modal"
                overlayClassName="modal-overlay"
                closeTimeoutMS={500}
            >
                <div className='modal-header'>
                    Add Category
                </div>

                <div className='modal-content'>

                    <div className='modal-form'>
                        <label>Name</label>
                        <input disabled={isEdit} type='text' value={newCategory?.name}
                               onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}/>
                        <label>Order</label>
                        <input disabled={isEdit} type='number' value={newCategory?.order}
                               onChange={(e) => setNewCategory({...newCategory, order: e.target.value})}/>
                    </div>
                </div>
                <p className='modal-error'>{error}</p>
                <hr/>
                <div className='modal-footer'>
                    <button className='button' onClick={() => {
                        setEditCategoryModal(false)
                    }}>Cancel
                    </button>
                    <button className='button' onClick={() => addUpdateCategory(true)}>Save</button>
                </div>
            </Modal>


        </>
    )
}


export default AddEditCategory