import {addSet} from "../../actions/set";
import React, {useState} from "react";
import Modal from "react-modal";
import './style.scss';
import AddEditSet from "../addEditSet";


const NewSet = ({data, fetchData}) => {

    const [modal, setModal] = useState(false);

    return (<div>
            <button className='button-new-set' onClick={() => setModal(true)}>Add new Set</button>
            <Modal
                isOpen={!!modal}
                onRequestClose={() => setModal(false)}
                contentLabel="My dialog"
                className="page-modal"
                ariaHideApp={false}
                overlayClassName="modal-overlay"
                closeTimeoutMS={500}
            >
                <AddEditSet
                    data={data}
                    fetchData={fetchData}
                    setModal={(val) => setModal(val)}
                    onSave={(setData) => addSet(setData).then(() => fetchData())}
                />

            </Modal>


        </div>

    )
}


export default NewSet