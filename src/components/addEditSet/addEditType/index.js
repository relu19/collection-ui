import React, {useState} from "react";
import Modal from "react-modal";
import {addNewType, removeSetType, updateSetType} from "../../../actions/type";
import {getSetsFotThisType} from "../../../actions/set";

const DEFAULT_STATE = {id: '', name: '', order: '', icon: ''}


const AddEditType = ({newSet, setNewSet, categories, update, setError}) => {
    const [addTypeModal, setAddTypeModal] = useState(false);
    const [editTypeModal, setEditTypeModal] = useState(false);
    const [deleteTypeModal, setDeleteTypeModal] = useState(null);
    const [newType, setNewType] = useState(DEFAULT_STATE);
    const [actionError, setActionError] = useState('')
    const setTypes = categories?.find(cat => cat.id === newSet.categoryId)
    const types = setTypes?.categoryTypes || []


    const addUpdateType = (isUpdate) => {
        if (!newType.name || !newType.order) {
            setActionError('All Fields are Required')
        } else {
            isUpdate ? updateSetType(newType).then(() => update()) : addNewType(newType, newSet.categoryId).then(() => update())
            setActionError('')
            setAddTypeModal(false)
            setEditTypeModal(false)
            setNewType(DEFAULT_STATE)
        }
    }

    const getEditedType = (id) => {
        const typeFound = types.find(cat => cat.id === id)
        setEditTypeModal(true)
        setNewType(typeFound)
    }

    const deleteSetTpe = async (id) => {
        const hasSets = await getSetsFotThisType(id)
        const typeFound = types.find(cat => cat.id === id)

        if (hasSets.length) {
            const setsArray = hasSets.map(function (el) {
                return el.name;
            });
            const errorMessage = `Can't delete, it has sets assigned: ${JSON.stringify(setsArray)} `
            setError(errorMessage)
            setDeleteTypeModal(null)
        } else {
            removeSetType(typeFound).then(() => update())
            setNewSet({...newSet, setTypeId: ''})
            setDeleteTypeModal(null)
        }
    }


    return (
        <>
            <label>Type*</label>
            <select disabled={!newSet.categoryId}
                    onChange={(e) => {
                        setNewSet({...newSet, setTypeId: parseInt(e.target.value)});
                        setError('')
                    }}>
                <option selected={!newSet.setTypeId} value=''>Select Type</option>
                {types.map((type, i) => <option key={i} selected={newSet.setTypeId === type.id}
                                                value={type.id}>{type.name}</option>)}
            </select>

            <label className='no-value'/>
            <p className='no-value'>
                {newSet.categoryId && <span onClick={() => {
                    setAddTypeModal(true);
                    setActionError('')
                }}>Add</span>}
                {newSet.setTypeId ? <span className='edit' onClick={() => {
                    getEditedType(newSet.setTypeId);
                    setActionError('')
                }}>Edit</span> : ''}
                {newSet.setTypeId ? <span className='delete' onClick={() => {
                    setDeleteTypeModal(newSet.setTypeId);
                    setActionError('')
                }}>Delete</span> : ''}
            </p>

            <Modal
                isOpen={addTypeModal}
                ariaHideApp={false}
                onRequestClose={() => {
                    setAddTypeModal(false);
                    setNewType(DEFAULT_STATE)
                }}
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
                        <label>Category</label>
                        <input type='text' disabled value={categories?.find(cat => cat.id === newSet.categoryId)?.name}/>
                        <label>Name</label>
                        <input type='text' value={newType.name}
                               onChange={(e) => setNewType({...newType, name: e.target.value})}/>
                        <label>Order</label>
                        <input type='number' value={newType.order}
                               onChange={(e) => setNewType({...newType, order: e.target.value})}/>
                        <label>Icon</label>
                        <input type='text' value={newType.icon}
                               onChange={(e) => setNewType({...newType, icon: e.target.value})}/>
                    </div>
                </div>
                <p className='modal-error'>{actionError}</p>
                <hr/>
                <div className='modal-footer'>
                    <button className='button' onClick={() => {
                        setAddTypeModal(false);
                        setNewType(DEFAULT_STATE)
                    }}>Cancel
                    </button>
                    <button className='button' onClick={() => addUpdateType(false)}>Add</button>
                </div>
            </Modal>


            <Modal
                isOpen={editTypeModal}
                ariaHideApp={false}
                onRequestClose={() => {setAddTypeModal(false); setNewType(DEFAULT_STATE)}}
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
                        <label>Category</label>
                        <input type='text' disabled value={categories?.find(cat => cat.id === newSet.categoryId)?.name}/>
                        <label>Name</label>
                        <input type='text' value={newType?.name}
                               onChange={(e) => setNewType({...newType, name: e.target.value})}/>
                        <label>Order</label>
                        <input type='number' value={newType?.order}
                               onChange={(e) => setNewType({...newType, order: e.target.value})}/>
                        <label>Icon</label>
                        <input type='text' value={newType.icon}
                               onChange={(e) => setNewType({...newType, icon: e.target.value})}/>
                    </div>
                </div>
                <p className='modal-error'>{actionError}</p>
                <hr/>
                <div className='modal-footer'>
                    <button className='button' onClick={() => {setEditTypeModal(false); setNewType(DEFAULT_STATE)}}>Cancel
                    </button>
                    <button className='button' onClick={() => addUpdateType(true)}>Save</button>
                </div>
            </Modal>


            <Modal
                isOpen={!!deleteTypeModal}
                ariaHideApp={false}
                onRequestClose={() => setDeleteTypeModal(null)}
                contentLabel="Confirm Modal"
                className="page-modal"
                overlayClassName="modal-overlay"
                closeTimeoutMS={500}
            >
                <div className='modal-header'>
                    Add Category
                </div>

                <div className='modal-content'>
                    <p>Are you Sure you want to delete this set type?</p>
                </div>
                <p className='modal-error'>{actionError}</p>
                <hr/>
                <div className='modal-footer'>
                    <button className='button' onClick={() => {
                        setDeleteTypeModal(null)
                    }}>Cancel
                    </button>
                    <button className='button' onClick={() => deleteSetTpe(deleteTypeModal)}>Yes</button>
                </div>
            </Modal>
        </>
    )
}


export default AddEditType