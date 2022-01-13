import {
    editSet,
    addSetNumbers,
    changeNumberStatus,
    deleteSetAndNumbers,
    markAllAtOnce,
    removeSetNumbers
} from "../../actions/set";
import React, {useState} from "react";
import Modal from "react-modal";
import './style.scss'
import AvailableSets from "../availableSets";
import ConditionalRender from "../../utils/conditionalRender";
import Icon from "../icon";
import NoImage from '../../images/noImage.png'
import AddEditSet from "../addEditSet";

const SetList = ({userDetails, data, fetchData, isAdmin, isMyPage}) => {

    const [modalData, setModalData] = useState();
    const [editModal, setEditModal] = useState();
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const getTotal = (set, total) => {
        return total ? set.numbers.length : set.numbers.filter(s => s.type === 1 || s.type === 2 || s.type === 3).length
    }

    const changeStatus = (nr) => {
        changeNumberStatus(nr).then(() => fetchData())
    }

    const collection = data.filter(sets => sets.inCollection).sort((a, b) => a?.order - b?.order)
    const remaining = data.filter(sets => !sets.inCollection).sort((a, b) => a?.order - b?.order)

    const changeStatusBulk = (set, type, userId) => {
        markAllAtOnce(set, type, userId).then(() => fetchData())
    }

    const getClassName = (type) => {
        switch (type) {
            case 0:
                return 'missing'
            case 1:
                return 'default'
            case 2:
                return 'double'
            case 3:
                return 'damaged'
            default:
                return 'missing'
        }
    }

    const removeSetToCollection = (elem) => {
        removeSetNumbers(elem, userDetails.id).then(() => fetchData())
        setModalOpen(false)
    }

    const deleteSet = (set) => {
        deleteSetAndNumbers(set).then(() => fetchData())
        setModalOpen(false)
    }


    const addSetToCollection = (set) => {
        const elem = {
            setId: set.id,
            userId: userDetails.id,
            maxNr: set.maxNr,
            minNr: set.minNr,
        }
        addSetNumbers(elem).then(() => fetchData())
    }

    const openModal = (data) => {
        setModalData(data)
        setModalOpen(true)
    }

    return (
        <div>
            <ConditionalRender if={isMyPage}>
                {editMode ?
                    <p className='edit-sets'><a onClick={() => setEditMode(false)}>Close Edit</a></p> :
                    <p className='edit-sets' onClick={() => setEditMode(true)}>
                        <a onClick={() => setEditMode(false)}>Add / Edit Sets</a></p>}
            </ConditionalRender>

            <ConditionalRender if={!collection.length && isMyPage}>
                <div className='set-wrapper no-set'><p>No sets added yet. You need to add <Icon name='add'
                                                                                                color="#cccccc"
                                                                                                width={15}
                                                                                                height={15}/> some sets
                    from Available Sets list</p>
                </div>
            </ConditionalRender>

            <ConditionalRender if={!collection.length && !isMyPage}>
                <div className='set-wrapper no-set'>No sets added yet.</div>
            </ConditionalRender>

            <ConditionalRender if={collection.length}>
                {collection.map((elem, i) =>
                    <div key={i} className='set-wrapper'>

                        <ConditionalRender if={isAdmin && editMode}>
                            <Icon onClick={() => openModal({...elem, remove: false, delete: true})} name='delete'
                                  color="#cccccc" width={15} height={15}/>
                        </ConditionalRender>

                        <ConditionalRender if={isAdmin && editMode}>
                            <Icon onClick={() => setEditModal(elem)} name='edit'
                                  color="#cccccc" width={15} height={15}/>
                        </ConditionalRender>

                        <ConditionalRender if={isMyPage && editMode}>
                            <Icon onClick={() => openModal({...elem, remove: true, delete: false})} name='remove'
                                  color="#cccccc" width={15} height={15}/>
                        </ConditionalRender>
                        <div className='set-content'>

                            <div className='set-list'>
                                <p className='set-title'>
                                    <a href={elem.link} rel="noreferrer" target='_blank'>{elem.name}</a>
                                </p>
                                <div className={`set-numbers ${userDetails && 'pointer'}`}>
                                    {elem?.numbers.map((item, i) => {
                                        return (
                                            <span key={i}
                                                  onClick={() => userDetails && editMode ? changeStatus(item) : {}}
                                                  className={`set-number ${getClassName(item.type)}`}>{item.number}</span>
                                        )
                                    })}
                                </div>
                                <div className='set-statistics'>
                                    <span>{`${getTotal(elem, false)} out of ${getTotal(elem, true)}`}</span>
                                    <ConditionalRender if={isMyPage && editMode}>
                                        <div className='bulk-actions'>
                                            <Icon onClick={() => changeStatusBulk(elem, 1, userDetails.id)} name='check'
                                                  color="#cccccc" width={15} height={15}/>
                                            <Icon onClick={() => changeStatusBulk(elem, 2, userDetails.id)}
                                                  name='double-check'
                                                  color="#cccccc" width={15} height={15}/>
                                            <Icon onClick={() => changeStatusBulk(elem, 0, userDetails.id)}
                                                  name='uncheck'
                                                  color="#cccccc" width={15} height={15}/>
                                        </div>
                                    </ConditionalRender>
                                </div>
                            </div>
                            <div
                                className={`set-image ${elem?.numbers.length < 31 ? 'half' : elem?.numbers.length > 99 ? 'double' : 'default'}`}>
                                <img alt='' src={elem?.image || NoImage}/>
                            </div>
                        </div>

                    </div>
                )}
            </ConditionalRender>


            <ConditionalRender if={isMyPage && editMode && remaining.length}>
                <AvailableSets userDetails={userDetails} remainingSets={remaining}
                               addSetToCollection={addSetToCollection}/>
            </ConditionalRender>

            <Modal
                isOpen={modalOpen}
                ariaHideApp={false}
                onRequestClose={() => setModalOpen(false)}
                contentLabel="Confirm Modal"
                className="page-modal"
                overlayClassName="modal-overlay"
                closeTimeoutMS={500}
            >
                <div className='modal-header'>
                    {`${!modalData?.delete ? 'Remove Set' : 'Delete Set'}`}
                </div>

                <div className='modal-content'>
                    {!modalData?.delete ?
                        <p>{`Are you sure you want to remove ${modalData?.name} from your collection?`} </p> :
                        <p>{`Are you sure you want to delete ${modalData?.name}?`} </p>}
                </div>
                <hr/>
                <div className='modal-footer'>
                    <button className='button' onClick={() => setModalOpen(false)}>No</button>
                    <button className='button'
                            onClick={() => modalData?.delete ? deleteSet(modalData) : removeSetToCollection(modalData)}>Yes
                    </button>
                </div>
            </Modal>


            <Modal
                isOpen={!!editModal}
                ariaHideApp={false}
                onRequestClose={() => setEditModal(false)}
                contentLabel="Edit Set"
                className="page-modal"
                overlayClassName="modal-overlay"
                closeTimeoutMS={500}
            >
                <AddEditSet
                    data={editModal}
                    fetchData={fetchData}
                    setModal={(val) => setEditModal(val)}
                    onSave={(data) => editSet(data).then(() => fetchData())}
                />

            </Modal>

        </div>

    )
}
export default SetList
