import {
    editSet,
    changeNumberStatus,
    deleteSetAndNumbers,
    markAllAtOnce,
    addSetToCollection, removeFromCollection
} from "../../actions/set";
import React, {useEffect, useState} from "react";
import Modal from "react-modal";
import './style.scss'
import AvailableSets from "../availableSets";
import ConditionalRender from "../../utils/conditionalRender";
import Icon from "../icon";
import NoImage from '../../images/noImage.png'
import AddEditSet from "../addEditSet";
import {useDispatch} from "react-redux";

const SetList = ({userDetails, data, fetchData, isAdmin, isMyPage, editMode, setEditMode}) => {
    const [modalData, setModalData] = useState();
    const [editModal, setEditModal] = useState();
    const [modalOpen, setModalOpen] = useState(false);
    const [viewModeAlert, setViewModeAlert] = useState(false);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [collectionList, setCollectionList] = useState([]);

    const getTotal = (set, total) => {
        return total ? set.numbers.length : set.numbers.filter(s => s.type === 1 || s.type === 2 || s.type === 3).length
    }

    useEffect(() => {
        setCollectionList(data.filter(sets => sets.inCollection).sort((a, b) => a?.order - b?.order))
    }, [data]);

    const collection = data.filter(sets => sets.inCollection).sort((a, b) => a?.order - b?.order)
    const remaining = data.filter(sets => !sets.inCollection).sort((a, b) => a?.order - b?.order)

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

    const removeSetFromCollection = (elem) => {
        setLoading(true)
        removeFromCollection(dispatch, elem, userDetails.id).then(() => setLoading(false))
        setModalOpen(false)
    }

    const deleteSet = (set) => {
        deleteSetAndNumbers(dispatch, set)
        setModalOpen(false)
    }

    const addToCollection = (set, userId) => {
        setLoading(true)
        const elem = {
            categoryId: set.categoryId,
            usersId: userId,
            setTypeId: set.setTypeId,
            setId: set.id,
        }
        addSetToCollection(dispatch, elem).then(() => setLoading(false))
    }

    const setAlert = () => {
        setViewModeAlert(true)
        setTimeout(() => {
            setViewModeAlert(false)
        }, 200);
    }

    const openModal = (data) => {
        setModalData(data)
        setModalOpen(true)
    }

    const changeStatus = (item, elem) => {
        setLoading(true)
        changeNumberStatus(dispatch, item, elem).then(() => setLoading(false))
    }


    const filterSeries = (e) => {
        const searchWord = e.target.value.toLowerCase()
        const filteredList = collection.filter(value => {
            return value.name.toLowerCase().match(new RegExp(searchWord, 'g'))
        })
        setCollectionList(filteredList)
    }

    const changeBulkStatus = (elem, type, id) => {
        setLoading(true)
        markAllAtOnce(dispatch, elem, type, id).then(() => setLoading(false))
    }


    return (
        <div>
            <ConditionalRender if={isMyPage}>
                {editMode ?
                    <p className='edit-sets'><span onClick={() => setEditMode(false)}>Close Edit</span></p> :
                    <p className='edit-sets' onClick={() => setEditMode(true)}>
                        <span onClick={() => setEditMode(false)}>Add / Edit Sets</span></p>}
            </ConditionalRender>

            <ConditionalRender if={!collection.length && isMyPage}>
                <div className='set-wrapper no-set'><p>No sets added yet. You need to add <Icon name='add' color="#cccccc" width={15} height={15}/> some sets from Available Sets list</p>
                </div>
            </ConditionalRender>

            <ConditionalRender if={!collection.length && !isMyPage}>
                <div className='set-wrapper no-set'>No sets added yet.</div>
            </ConditionalRender>

            <ConditionalRender if={collection.length}>
                <input type="search" className="set-search" placeholder = "Search set..."
                       onChange = {(e) => filterSeries(e) }/>
                {collectionList.map((elem, i) =>
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
                                    <ConditionalRender if={isMyPage}>
                                        {editMode ? <span onClick={() => setEditMode(false)}>Edit Mode</span> :
                                            <span className={viewModeAlert ? 'view-alert' : ''}
                                                  onClick={() => setEditMode(true)}>View Mode</span>}
                                    </ConditionalRender>
                                </p>
                                <div className={`set-numbers ${userDetails && 'pointer'}`}>
                                    {elem?.numbers.map((item, i) => {
                                        return (
                                            <span key={i}
                                                  onClick={() => userDetails && editMode && !loading ? changeStatus(item, elem) : setAlert()}
                                                  className={`set-number ${getClassName(item.type)} ${editMode ? 'active' : ''} ${loading ? 'loading' : ''}`}>{item.number}</span>
                                        )
                                    })}
                                </div>
                                <div className='set-statistics'>
                                    <span>{`${getTotal(elem, false)} out of ${getTotal(elem, true)}`}</span>
                                    <ConditionalRender if={isMyPage && editMode}>
                                        <div className='bulk-actions'>
                                            <Icon onClick={() => !loading ? changeBulkStatus(elem, 1, userDetails.id) : () => {}}
                                                  name='check'
                                                  color="#cccccc" width={15} height={15}/>
                                            <Icon onClick={() =>  !loading ? changeBulkStatus(elem, 2, userDetails.id) : () => {}}
                                                  name='double-check'
                                                  color="#cccccc" width={15} height={15}/>
                                            <Icon onClick={() =>  !loading ? changeBulkStatus(elem, 0, userDetails.id) : () => {}}
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
                               addToCollection={!loading ? addToCollection : () => {}}/>
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
                            onClick={() => modalData?.delete ? deleteSet(modalData) : !loading ? removeSetFromCollection(modalData) : () => {}}>Yes
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
                    onSave={(data) => editSet(data)}
                />

            </Modal>
        </div>

    )
}
export default SetList
