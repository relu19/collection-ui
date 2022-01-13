import {types} from "../../config";
import {addSet} from "../../actions/set";
import React, {useState} from "react";
import Modal from "react-modal";
import './style.scss';


const NewSet = ({data, fetchData}) => {


    const defaultState = {
        name: '', minNr: 1, maxNr: 70, link: '', image: '', category: '', type: '', order: data.length
    }
    const [newSet, setNewSet] = useState(defaultState);
    const [modal, setModal] = useState(false);
    const [error, setError] = useState('');


    const getCategoryOptions = () => {
        const options = types.find(cat => cat.category === newSet.category)
        return options.types.map((type, i) => <option selected={type === newSet.type} key={i}
                                                      value={type}>{type}</option>)
    }

    const closeModal = () => {
        setModal(false)
        setError('')
    }

    const addNewSet = () => {
        if (!newSet.name || !newSet.minNr || !newSet.maxNr || !newSet.category || !newSet.type || !newSet.order || !newSet.link || !newSet.image) {
            setError('All Fields are Required')
        } else {
            setError('')
            addSet(newSet).then(() => fetchData())
            setModal(false)
            setNewSet(defaultState)
        }
    }

    return (<div>
            <button className='button-new-set' onClick={() => setModal(true)}>Add new Set</button>
            <Modal
                isOpen={modal}
                onRequestClose={() => setModal(false)}
                contentLabel="My dialog"
                className="page-modal"
                ariaHideApp={false}
                overlayClassName="modal-overlay"
                closeTimeoutMS={500}
            >


                <div className='modal-header'>
                    Add a New Set
                </div>

                <div className='modal-content'>
                    <div className='modal-form'>
                        <span>
                            Set Name
                        </span>
                        <input type='text' value={newSet.name}
                               onChange={(e) => setNewSet({...newSet, name: e.target.value})}/>
                        <span>
                            First Number
                        </span>
                        <input type='number' value={newSet.minNr}
                               onChange={(e) => setNewSet({...newSet, minNr: parseInt(e.target.value)})}/>
                        <span>
                            Last Number
                        </span>
                        <input type='number' value={newSet.maxNr}
                               onChange={(e) => setNewSet({...newSet, maxNr: parseInt(e.target.value)})}/>


                        <span>
                            Category
                        </span>
                        <select onChange={(e) => setNewSet({...newSet, category: e.target.value, type: ''})}>
                            <option value=''>Select Category</option>
                            {types.map((type, i) => <option key={i} value={type.category}>{type.category}</option>)}
                        </select>

                        <span>
                            Type
                        </span>
                        <select disabled={!newSet.category}
                                onChange={(e) => setNewSet({...newSet, type: e.target.value})}>
                            <option value=''>Select Type</option>
                            {newSet.category && getCategoryOptions()}
                        </select>

                        <span>
                            Set Link
                        </span>
                        <input type='text' value={newSet.link}
                               onChange={(e) => setNewSet({...newSet, link: e.target.value})}/>

                        <span>
                            Set Image Link
                        </span>
                        <input type='text' value={newSet.image}
                               onChange={(e) => setNewSet({...newSet, image: e.target.value})}/>

                        <span>
                            Set Order
                        </span>
                        <input type='number' value={newSet.order}
                               onChange={(e) => setNewSet({...newSet, order: parseInt(e.target.value)})}/>

                    </div>
                </div>
                <p className='modal-error'>{error}</p>
                <hr/>
                <div className='modal-footer'>
                    <input className='button' type='button' value='Cancel'
                           onClick={() => closeModal()}/>
                    <input className='button' type='button' value='Add'
                           onClick={() => addNewSet()}/>
                </div>

            </Modal>


        </div>

    )
}


export default NewSet