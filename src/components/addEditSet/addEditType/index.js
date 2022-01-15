import React, {useEffect, useState} from "react";
import Modal from "react-modal";
import {addNewType, updateSetType, getSetTypes} from "../../../actions/type";
import {useDispatch, useSelector} from "react-redux";

const AddEditType = ({newSet, setNewSet, isEdit}) => {
    const [addTypeModal, setAddTypeModal] = useState(false);
    const [editTypeModal, setEditTypeModal] = useState(false);
    const [newType, setNewType] = useState({id: '', name: '', order: '', icon: ''});
    const [error, setError] = useState('')
    const types = useSelector((type) => type.typeReducer);
    const dispatch = useDispatch();


    useEffect(() => {
        getSetTypes(dispatch, newSet.category)
    }, [newSet.category]);

    const addUpdateType = (isUpdate) => {
        if (!newType.name || !newType.order) {
            setError('All Fields are Required')
        } else {
            isUpdate ? updateSetType(newType).then(() => getSetTypes(dispatch)) : addNewType(newType).then(() => getSetTypes(dispatch))
            setError('')
            setAddTypeModal(false)
            setEditTypeModal(false)
            setNewType({id: '', name: '', order: '', icon: ''})
        }
    }


    const getEditedType = (id) => {
        const typeFound = types.find(cat => cat.id === id)
        setEditTypeModal(true)
        setNewType(typeFound)
    }

    return (
        <>
            <label>Type</label>
            <select defaultValue={newSet.setTypeId || ''}
                    onChange={(e) => setNewSet({...newSet, setTypeId: parseInt(e.target.value)})}>
                <option value=''>Select Type</option>
                {types.map((cat, i) => <option key={i} value={cat.id}>{cat.name}</option>)}
            </select>

            <label className='no-value'/>
            <p className='no-value'>
                <span onClick={() => {
                    setAddTypeModal(true);
                    setError('')
                }}>Add</span>
                {newSet.type ? <span onClick={() => {
                    getEditedType(newSet.type);
                    setError('')
                }}>Edit</span> : ''}
            </p>

            <Modal
                isOpen={addTypeModal}
                ariaHideApp={false}
                onRequestClose={() => setAddTypeModal(false)}
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
                        <input disabled={isEdit} type='text' value={newType.name}
                               onChange={(e) => setNewType({...newType, name: e.target.value})}/>
                        <label>Order</label>
                        <input disabled={isEdit} type='number' value={newType.order}
                               onChange={(e) => setNewType({...newType, order: e.target.value})}/>
                    </div>
                </div>
                <p className='modal-error'>{error}</p>
                <hr/>
                <div className='modal-footer'>
                    <button className='button' onClick={() => {
                        setAddTypeModal(false)
                    }}>Cancel
                    </button>
                    <button className='button' onClick={() => addUpdateType(false)}>Add</button>
                </div>
            </Modal>


            <Modal
                isOpen={editTypeModal}
                ariaHideApp={false}
                onRequestClose={() => setEditTypeModal(false)}
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
                        <input disabled={isEdit} type='text' value={newType?.name}
                               onChange={(e) => setNewType({...newType, name: e.target.value})}/>
                        <label>Order</label>
                        <input disabled={isEdit} type='number' value={newType?.order}
                               onChange={(e) => setNewType({...newType, order: e.target.value})}/>
                        <label>Icon</label>
                        <input disabled={isEdit} type='text' value={newType.icon}
                               onChange={(e) => setNewType({...newType, icon: e.target.value})}/>
                    </div>
                </div>
                <p className='modal-error'>{error}</p>
                <hr/>
                <div className='modal-footer'>
                    <button className='button' onClick={() => {
                        setEditTypeModal(false)
                    }}>Cancel
                    </button>
                    <button className='button' onClick={() => addUpdateType(true)}>Save</button>
                </div>
            </Modal>


        </>
    )
}


export default AddEditType