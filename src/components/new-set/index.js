import {types} from "../../config";
import {addSet} from "../../actions/set";
import React, {useState} from "react";
import Modal from "react-modal";


const NewSet = ({userDetails, data, fetchData}) => {
    const [newSet, setNewSet] = useState({name: '', minNr: 1, maxNr: 70, link: '', image: '', category: '', type: '', order: data.length});
    const [modalData, setModalData] = useState();


    const getCategoryOptions = () => {
        const options = types.find(cat => cat.category === newSet.category)
        return options.types.map((type, i) =>
            <option selected={type === newSet.type} key={i} value={type}>{type}</option>)
    }

    return (
        <div>
            <button onClick={() => setModalData({})}>Add new Set</button>
            <Modal
                isOpen={!!modalData}
                onRequestClose={() => setModalData(null)}
                contentLabel="My dialog"
                className="page-modal"
                ariaHideApp={false}
                overlayClassName="modal-overlay"
                closeTimeoutMS={500}
            >
                <input type='text' value={newSet.name}
                       onChange={(e) => setNewSet({...newSet, name: e.target.value})}/>
                <input type='number' value={newSet.minNr}
                       onChange={(e) => setNewSet({...newSet, minNr: parseInt(e.target.value)})}/>
                <input type='number' value={newSet.maxNr}
                       onChange={(e) => setNewSet({...newSet, maxNr: parseInt(e.target.value)})}/>


                <select onChange={(e) => setNewSet({...newSet, category: e.target.value, type: ''})}>
                    <option value=''>Select Category</option>
                    {types.map((type, i) =>
                        <option key={i} value={type.category}>{type.category}</option>)
                    }
                </select>

                <select disabled={!newSet.category} onChange={(e) => setNewSet({...newSet, type: e.target.value})}>
                    <option value=''>Select Type</option>
                    {newSet.category && getCategoryOptions()}
                </select>

                <input type='text' value={newSet.link}
                       onChange={(e) => setNewSet({...newSet, link: e.target.value})}/>
                <input type='text' value={newSet.image}
                       onChange={(e) => setNewSet({...newSet, image: e.target.value})}/>

                <input type='number' value={newSet.order}
                       onChange={(e) => setNewSet({...newSet, order: parseInt(e.target.value)})}/>
                <input type='button' value='Add'
                       onClick={() => addSet(newSet, userDetails).then(() => fetchData())}/>
            </Modal>


        </div>

    )
}


export default NewSet