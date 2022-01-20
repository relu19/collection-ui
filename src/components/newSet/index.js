import {addSet} from "../../actions/set";
import React, {useState} from "react";
import Modal from "react-modal";
import './style.scss';
import AddEditSet from "../addEditSet";
import {useDispatch} from "react-redux";


const NewSet = ({data, userId}) => {
    const [modal, setModal] = useState(false);
    const dispatch = useDispatch();

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
                    setModal={(val) => setModal(val)}
                    onSave={(setData) => addSet(dispatch, setData, userId)}
                />

            </Modal>


        </div>

    )
}


export default NewSet