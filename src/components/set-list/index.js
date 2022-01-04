import {
    addSetNumbers,
    changeNumberStatus,
    deleteSetAndNumbers,
    getAllSetsWithNumbers, markAllAtOnce,
    removeSetNumbers
} from "../../actions/set";
import React, {useEffect, useState} from "react";
import './style.scss'
import Modal from "react-modal";
import NewSet from "../new-set";

const SetList = ({userDetails}) => {

    const [data, dataSet] = useState([])
    const [modalData, setModalData] = useState();
    const collection = data.filter(sets => sets.type === 'inCollection')
    const remaining = data.filter(sets => sets.type === 'remaining')

    const fetchData = async () => {
        dataSet(userDetails ? await getAllSetsWithNumbers(userDetails.id) : [])
    }

    useEffect(() => {
        const fetchData = async () => {
            dataSet(userDetails ? await getAllSetsWithNumbers(userDetails.id) : [])
        }

        fetchData()
    }, [userDetails]);

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

    const changeStatus = (nr) => {
        changeNumberStatus(nr).then(() => fetchData())
    }

    const changeStatusBulk = (set, type, userId) => {
        markAllAtOnce(set, type, userId).then(() => fetchData())
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


    const removeSetToCollection = (elem) => {
        removeSetNumbers(elem, userDetails.id).then(() => fetchData())
        setModalData(null)
    }

    const deleteSet = (set) => {
        console.log('set', set)
        deleteSetAndNumbers(set).then(() => fetchData())
        setModalData(null)
    }

    const getTotal = (set, total) => {
        return total ? set.numbers.length : set.numbers.filter(s => s.type === 1 || s.type === 2 || s.type === 3).length
    }

    const isAdmin = userDetails && userDetails.type === parseInt(process.env.REACT_APP_FACEBOOK_ADMIN_TYPE)

    return (
        <div>
            {collection && collection.map((elem, i) =>
                <div key={i} className='set-wrapper'>

                    <div onClick={() => setModalData({...elem, remove: false, delete: true})}
                         className='delete-set'>Delete Set
                    </div>
                    <div onClick={() => setModalData({...elem, remove: true, delete: false})} className='remove-set'/>
                    <div className='set-content'>
                        <div className='set-list'>
                            <p className='set-title'>
                                <a href={elem.link} rel="noreferrer" target='_blank'>{elem.name}</a>
                            </p>
                            <div className={`set-numbers ${userDetails && 'pointer'}`}>
                                {elem?.numbers.map((item, i) => {
                                    return (
                                        <span key={i} onClick={() => userDetails ? changeStatus(item) : {}}
                                              className={`set-number ${getClassName(item.type)}`}>{item.number}</span>
                                    )
                                })}
                            </div>
                        </div>
                        <div className='set-image'>
                            <img alt='' src={elem?.image}/>
                        </div>
                    </div>
                    <div
                        className='set-statistic'>{`You have ${getTotal(elem, false)} out of ${getTotal(elem, true)}`}</div>


                    <div onClick={() => changeStatusBulk(elem, 1, userDetails.id)}>I Have All</div>
                    <div onClick={() => changeStatusBulk(elem, 0, userDetails.id)}>I Have None</div>
                    <div onClick={() => changeStatusBulk(elem, 2, userDetails.id)}>I All For Exchange</div>
                </div>
            )}
            {remaining && remaining.map((elem, i) =>
                <div key={i} className='set-wrapper'>
                    <p className='set-title'>
                        <a href={elem.link} rel="noreferrer" target='_blank'>{elem.name}</a>
                    </p>
                    {userDetails.id && <div onClick={() => addSetToCollection(elem)}>add to collection</div>}
                </div>
            )}

            {isAdmin && <NewSet userDetails={userDetails} data={data} fetchData={fetchData} />}
            <Modal
                isOpen={!!modalData}
                onRequestClose={() => setModalData(null)}
                contentLabel="My dialog"
                className="page-modal"
                ariaHideApp={false}
                overlayClassName="modal-overlay"
                closeTimeoutMS={500}
            >
                {modalData?.delete ?
                    <p>{`Are you sure you want to remove ${modalData?.name} from your collection?`} </p> :
                    <p>{`Are you sure you want to delete ${modalData?.name}?`} </p>}
                <div className='modal-buttons'>
                    <button onClick={() => setModalData(null)}>Cancel</button>
                    <button
                        onClick={() => modalData?.delete ? deleteSet(modalData) : removeSetToCollection(modalData)}>Yes
                    </button>
                </div>
            </Modal>
        </div>
    )
}
export default SetList

