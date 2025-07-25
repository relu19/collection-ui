import {
    editSet,
    changeNumberStatus,
    deleteSetAndNumbers,
    markAllAtOnce,
    addSetToCollection, removeFromCollection
} from "../../actions/set";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import './style.scss'
import AvailableSets from "../availableSets";
import ConditionalRender from "../../utils/conditionalRender";
import Icon from "../icon";
import NoImage from '../../images/noImage.png'
import AddEditSet from "../addEditSet";
import { useDispatch, useSelector } from "react-redux";
import Exchange from "../exchange";
import { getUserById } from "../../actions/users";
import objectAssign from "object-assign";
import { getURLParams } from "../../utils/getURLParams";
import NoData from "../no-date-modal";

const SetList = ({userDetails, data, fetchData, isAdmin, isMyPage, editMode, setEditMode}) => {
    const [modalData, setModalData] = useState();
    const [editModal, setEditModal] = useState();
    const [showExchange, setShowExchange] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [searchFilter, setSearchFilter] = useState('');
    const [collectionList, setCollectionList] = useState([]);
    const filterParams = useSelector((filters) => objectAssign({}, getURLParams(), filters.filterReducer));
    const [userInfo, setUserInfo] = useState({})

    // [{"number":"000","desc":"Panini Stamp"}]
    //
    // const test3 = [{"number":"PSS","desc":"Panini Logo"}],
    //     { "number": "CC-A", "desc": "Copa Mundial de la FIFA 2010" },
    //     { "number": "CC-B", "desc": "Zakumi" },
    //     { "number": "CC-C", "desc": "El Aeroplano" },
    //     { "number": "CC-D", "desc": "El Arquero" },
    //     { "number": "CC-E", "desc": "La Mecedora" },
    //     { "number": "CC-F", "desc": "El Robot" },
    //     { "number": "CC-G", "desc": "El Bote" },
    //     { "number": "CC-H", "desc": "El Rockero" },
    //     { "number": "CC-T", "desc": "Trophy Tour" }
    // ];

    const getTotal = (set, total) => {
        return total ? set.numbers.length : set.numbers.filter(s => s.type === 1 || s.type === 2 || s.type === 3).length
    }

    const shouldExchange = (set) => {
        let canExchange = false
        // let result = { missing: 0, swap: 0}
        // set.numbers.forEach(nr => {
        //     if (nr.type === 2 || nr.type === 3) {
        //         result.swap = 1
        //     }
        //     if (nr.type === 0) {
        //         result.missing = 1
        //     }
        // })
        // return result
        set.numbers.forEach(nr => {
            if (nr.type === 2 || nr.type === 3 || nr.type === 0) {
                canExchange = true
            }
        })
        return canExchange
    }

    const fetchUser = async () => {
        const data = await getUserById(filterParams)
        if (!data.length) {
            window.location = '/'
        }
        setUserInfo(data ? data[0] : {})
    }

    useEffect(() => {
        fetchUser().then(() => {
        })
    }, [filterParams.userId]);

    useEffect(() => {
        const list = data.list.filter(sets => sets.inCollection).sort((a, b) => a?.order - b?.order)
        const filteredList = list.filter(value => {
            return value.name.toLowerCase().match(new RegExp(searchFilter, 'g'))
        })
        setCollectionList(filteredList)
    }, [data, data.list]);

    const collection = data.list.filter(sets => sets.inCollection).sort((a, b) => a?.order - b?.order)

    const remaining = data.list.filter(sets => !sets.inCollection).sort((a, b) => a?.order - b?.order)


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
        setSearchFilter(searchWord)
        const filteredList = collection.filter(value => {
            return value.name.toLowerCase().match(new RegExp(searchWord, 'g'))
        })
        setCollectionList(filteredList)
    }

    const changeBulkStatus = (elem, type, id) => {
        setLoading(true)
        markAllAtOnce(dispatch, elem, type, id).then(() => setLoading(false))
    }

    const getExtraNumbersClassName = (list, set) => {
        const groupName = set.group
        // search if parent set is in collection
        const findSetsWithSameGroup = list.filter(item => item.group && item.group === groupName && item.inCollection)

        // if parent set is in collection and set has extra numbers add class
        return findSetsWithSameGroup.length > 1 && set.extraNumbers ? 'extra-numbers' : ''
    }

    return (
        <div>
            <ConditionalRender if={isMyPage}>
                <div className='set-list-header'>
                    <input type="search" className="set-search" placeholder="Search set..."
                           onChange={(e) => filterSeries(e)}/>
                    {editMode ?
                        <p className='edit-sets'><span onClick={() => setEditMode(false)}>Close Edit</span></p> :
                        <p className='edit-sets' onClick={() => setEditMode(true)}>
                            <span onClick={() => setEditMode(false)}>Edit</span></p>}

                </div>
            </ConditionalRender>

            <ConditionalRender if={!collection.length && isMyPage}>
                <div className='set-wrapper no-set'><p>No sets added to your collection. Click <span
                    onClick={() => setEditMode(!editMode)} className='edit-sets'>Edit</span> then add (<Icon name='add'
                                                                                                             color="#cccccc"
                                                                                                             width={15}
                                                                                                             height={15}/>)
                    sets from "Available Sets" list bellow</p>
                </div>
            </ConditionalRender>

            <ConditionalRender if={!collection.length && !isMyPage}>
                <div className='set-wrapper no-set'>No sets added yet.</div>
            </ConditionalRender>

            <ConditionalRender if={collection.length}>
                {!isMyPage && <div className='set-list-header'>
                    <input type="search" className="set-search"
                           placeholder="Search set..."
                           onChange={(e) => filterSeries(e)}/></div>}

                {collectionList.map((elem, i) =>
                    <div key={i} className={`set-wrapper ${getExtraNumbersClassName(collectionList, elem)}`}>
                        {/*<div key={i} className={`set-wrapper ${elem.extraNumbers ? 'extra-numbers' : ''}`}>*/}
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
                                <p className={`set-title ${getExtraNumbersClassName(collectionList, elem)}`}>
                                    <a href={elem.link} rel="noreferrer" target='_blank'>{elem.name} <span>🔗</span></a>
                                    <ConditionalRender if={isMyPage}>
                                        {editMode ? <span onClick={() => setEditMode(false)}>Edit Mode</span> :
                                            <span className='view-alert'
                                                  onClick={() => setEditMode(true)}>View Mode</span>}
                                    </ConditionalRender>
                                </p>
                                <div className={`set-numbers ${userDetails && 'pointer'}`}>
                                    {/* Separate and sort main and extra numbers */}
                                    {(() => {
                                        if (!elem?.numbers) return null;
                                        // Separate main and extra numbers
                                        const mainNumbers = elem.numbers.filter(n => !n.extra).sort((a, b) => Number(a.number) - Number(b.number));
                                        const extraNumbers = elem.numbers.filter(n => n.extra);
                                        const userId = userDetails?.id;
                                        return (
                                            <>
                                                {/* Only show main numbers if minNr and maxNr are not both 114 (special case for extra-only sets) */}
                                                {!(elem.minNr === 114 && elem.maxNr === 114) && mainNumbers.map((item, i) => {
                                                    const isMine = userId && item.userId === userId;
                                                    return (
                                                        <span title={item.desc || ''} key={`main-${item.number}`}
                                                              onClick={() => isMine && editMode && !loading ? changeStatus(item, elem) : console.log('nope')}
                                                              className={`set-number ${getClassName(item.type)} ${editMode ? 'active' : ''} ${loading ? 'loading' : ''} ${isMine ? 'pointer' : ''}`}>{item.number}</span>
                                                    );
                                                })}
                                                <ConditionalRender if={extraNumbers.length > 0}>
                                                    <ConditionalRender if={mainNumbers.length === 0 || extraNumbers.length < mainNumbers.length}>
                                                        <p className='extra-numbers-title'>{elem.extraNumbersTitle || 'Extra Numbers'}</p>
                                                    </ConditionalRender>
                                                    <div className='extra-numbers-content set-numbers'>

                                                        {extraNumbers.map((item, i) => {
                                                            const isMine = userId && item.userId === userId;
                                                            return (
                                                                <span title={item.desc || ''}
                                                                      key={`extra-${item.number}`}
                                                                      onClick={() => isMine && editMode && !loading ? changeStatus(item, elem) : console.log('nope')}
                                                                      className={`set-number ${getClassName(item.type)} ${editMode ? 'active' : ''} ${loading ? 'loading' : ''} ${isMine ? 'pointer' : ''}`}>{item.number}</span>
                                                            );
                                                        })}

                                                    </div>
                                                </ConditionalRender>
                                            </>
                                        );
                                    })()}
                                </div>
                                <div className='set-statistics'>
                                    <span>{`${getTotal(elem, false)} out of ${getTotal(elem, true)}`}
                                        {shouldExchange(elem) ?
                                            <span onClick={() => setShowExchange(elem)}
                                                  className='exchange'>{!isMyPage ? `Search trades for ${userInfo.name} ` : 'Find users for trade'}</span> : ''}
                                        {isMyPage && <span> 🔍</span>}
                                    </span>
                                    <ConditionalRender if={isMyPage && editMode}>
                                        <div className='bulk-actions'>
                                            <div className={`bulk-button${loading ? ' disabled' : ''}`}
                                                 onClick={() => !loading ? changeBulkStatus(elem, 1, userDetails.id) : undefined}>
                                                <Icon
                                                    name='check'
                                                    title='Add all'
                                                    color="#cccccc" width={15} height={15}/>
                                                {loading && <div className="sline"/>}
                                            </div>
                                            <div className={`bulk-button${loading ? ' disabled' : ''}`}
                                                 onClick={() => !loading ? changeBulkStatus(elem, 2, userDetails.id) : undefined}>
                                                <Icon
                                                    title='Add all for trade'
                                                    name='double-check'
                                                    color="#cccccc" width={15} height={15}/>
                                                {loading && <div className="sline"/>}
                                            </div>
                                            <div className={`bulk-button${loading ? ' disabled' : ''}`}
                                                 onClick={() => !loading ? changeBulkStatus(elem, 0, userDetails.id) : undefined}>
                                                <Icon
                                                    title='Remove all'
                                                    name='uncheck'
                                                    color="#cccccc" width={15} height={15}/>
                                                {loading && <div className="sline"/>}
                                            </div>
                                        </div>
                                    </ConditionalRender>
                                </div>
                            </div>
                            <ConditionalRender
                                if={elem.minNr !== elem.maxNr || !getExtraNumbersClassName(collectionList, elem)}>
                                <div
                                    className={`set-image ${elem?.numbers.length < 31 ? 'half' : elem?.numbers.length > 99 ? 'double' : 'default'}`}>
                                    <img alt='' src={`/inserts/${elem?.image.toString()}` || NoImage}/>
                                </div>
                            </ConditionalRender>
                        </div>
                    </div>
                )}
            </ConditionalRender>


            <ConditionalRender if={isMyPage && editMode && remaining.length}>
                <AvailableSets userDetails={userDetails} remainingSets={remaining}
                               addToCollection={!loading ? addToCollection : () => {
                               }}/>
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
                            onClick={() => modalData?.delete ? deleteSet(modalData) : !loading ? removeSetFromCollection(modalData) : () => {
                            }}>Yes
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
                    onSave={(data) => editSet(dispatch, data, userDetails?.id)}
                />

            </Modal>


            <Modal
                isOpen={!!showExchange}
                ariaHideApp={false}
                onRequestClose={() => setShowExchange(null)}
                contentLabel="Exchange"
                className="page-modal wide"
                overlayClassName="modal-overlay"
                closeTimeoutMS={500}
            >
                {userDetails ? showExchange &&
                    <Exchange userInfo={userInfo} userDetails={userDetails} set={showExchange}
                              setModal={(val) => setShowExchange(val)}/> :
                    <NoData setModal={(val) => setShowExchange(val)}/>}
            </Modal>
        </div>

    )
}
export default SetList
