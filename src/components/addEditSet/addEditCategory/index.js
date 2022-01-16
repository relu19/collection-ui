import React, {useState} from "react";
import Modal from "react-modal";
import {addNewCategory, removeCategory, updateCategory} from "../../../actions/category";

const AddEditCategory = ({newSet, setNewSet, categories, update, setError}) => {
    const [addCategoryModal, setAddCategoryModal] = useState(false);
    const [editCategoryModal, setEditCategoryModal] = useState(false);
    const [deleteCategoryModal, setDeleteCategoryModal] = useState(null);
    const [newCategory, setNewCategory] = useState({id: '', name: '', order: ''});
    const [actionError, setActionError] = useState('')

    const addUpdateCategory = (isUpdate) => {
        if (!newCategory.name || !newCategory.order) {
            setActionError('All Fields are Required')
        } else {
            isUpdate ? updateCategory(newCategory).then(() => update()) : addNewCategory(newCategory).then(() => update())
            setActionError('')
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

    const deleteCategory = (id) => {
        const categoryFound = categories.find(cat => cat.id === id)
        if (categoryFound.categoryTypes.length) {
            setError('Can\'t delete, it has set type assigned')
            setDeleteCategoryModal(null)
        } else {
            removeCategory(categoryFound).then(() => update())
            setNewSet({...newSet, categoryId: ''})
            setDeleteCategoryModal(null)
        }
    }

    return (
        <>
            <label>Category</label>
            <select onChange={(e) => {
                setNewSet({...newSet, categoryId: parseInt(e.target.value), setTypeId: ''});
                setError('')
            }}>
                <option value=''>Select Category</option>
                {categories.map((cat, i) => <option key={i} selected={newSet.categoryId === cat.id}
                                                    value={cat.id}>{cat.name}</option>)}
            </select>

            <label className='no-value'/>
            <p className='no-value'>
                <span onClick={() => {
                    setAddCategoryModal(true);
                    setActionError('')
                }}>Add</span>
                {newSet.categoryId ? <span className='edit' onClick={() => {
                    getEditedCategory(newSet.categoryId);
                    setActionError('')
                }}>Edit</span> : ''}
                {newSet.categoryId ? <span className='delete' onClick={() => {
                    setDeleteCategoryModal(newSet.categoryId);
                    setActionError('')
                }}>Delete</span> : ''}
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
                        <input type='text' value={newCategory.name}
                               onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}/>
                        <label>Order</label>
                        <input type='number' value={newCategory.order}
                               onChange={(e) => setNewCategory({...newCategory, order: e.target.value})}/>
                    </div>
                </div>
                <p className='modal-error'>{actionError}</p>
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
                        <input type='text' value={newCategory?.name}
                               onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}/>
                        <label>Order</label>
                        <input type='number' value={newCategory?.order}
                               onChange={(e) => setNewCategory({...newCategory, order: e.target.value})}/>
                    </div>
                </div>
                <p className='modal-error'>{actionError}</p>
                <hr/>
                <div className='modal-footer'>
                    <button className='button' onClick={() => {
                        setEditCategoryModal(false)
                    }}>Cancel
                    </button>
                    <button className='button' onClick={() => addUpdateCategory(true)}>Save</button>
                </div>
            </Modal>

            <Modal
                isOpen={!!deleteCategoryModal}
                ariaHideApp={false}
                onRequestClose={() => setDeleteCategoryModal(null)}
                contentLabel="Confirm Modal"
                className="page-modal"
                overlayClassName="modal-overlay"
                closeTimeoutMS={500}
            >
                <div className='modal-header'>
                    Add Category
                </div>

                <div className='modal-content'>
                    <p>Are you Sure you want to delete this category?</p>
                </div>
                <p className='modal-error'>{actionError}</p>
                <hr/>
                <div className='modal-footer'>
                    <button className='button' onClick={() => {
                        setDeleteCategoryModal(null)
                    }}>Cancel
                    </button>
                    <button className='button' onClick={() => deleteCategory(deleteCategoryModal)}>Yes</button>
                </div>
            </Modal>
        </>
    )
}


export default AddEditCategory