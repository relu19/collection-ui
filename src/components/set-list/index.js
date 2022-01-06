import {
    addSetNumbers,
    changeNumberStatus,
    deleteSetAndNumbers,
    markAllAtOnce,
    removeSetNumbers
} from "../../actions/set";
import {useState} from "react";
import Modal from "react-modal";
import './style.scss'
import AvailableSets from "../available-sets";
import ConditionalRender from "../../utils/conditional-render";

const SetList = ({userDetails, data, fetchData}) => {

    const [modalData, setModalData] = useState();

    const getTotal = (set, total) => {
        return total ? set.numbers.length : set.numbers.filter(s => s.type === 1 || s.type === 2 || s.type === 3).length
    }

    const changeStatus = (nr) => {
        changeNumberStatus(nr).then(() => fetchData())
    }

    const collection = data.filter(sets => sets.inCollection)
    const remaining = data.filter(sets => !sets.inCollection)

    const changeStatusBulk = (set, type, userId) => {
        console.log('set', set)
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
        setModalData(null)
    }

    const deleteSet = (set) => {
        deleteSetAndNumbers(set).then(() => fetchData())
        setModalData(null)
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

    return (
        <div>
            <ConditionalRender if={!collection.length}>
                <div className='no-set'>No set added yet. You need to add(<i className="fas fa-plus-square"/>) some set
                    from Available Sets list
                </div>
            </ConditionalRender>

            <ConditionalRender if={collection.length}>
                {collection.map((elem, i) =>
                    <div key={i} className='set-wrapper'>

                        <i onClick={() => setModalData({...elem, remove: false, delete: true})}
                           className="fas fa-minus-circle pointer remove-set left"/>
                        <i onClick={() => setModalData({...elem, remove: true, delete: false})}
                           className="fas fa-trash-alt pointer remove-set right"/>
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
                            <div
                                className={`set-image ${elem?.numbers.length < 31 ? 'half' : elem?.numbers.length > 99 ? 'double' : 'default'}`}>
                                <img alt='' src={elem?.image}/>
                            </div>
                        </div>
                        <div className='set-statistics'>
                            <span>{`You have ${getTotal(elem, false)} out of ${getTotal(elem, true)}`}</span>
                            <div className='bulk-actions'>
                                <i title='I Have All' onClick={() => changeStatusBulk(elem, 1, userDetails.id)}
                                   className="fas fa-check"/>
                                <i title='I Have All Twice' onClick={() => changeStatusBulk(elem, 2, userDetails.id)}
                                   className="fas fa-check-double"/>
                                <i title='I Have None' onClick={() => changeStatusBulk(elem, 0, userDetails.id)}
                                   className="fas fa-ban"/>
                            </div>
                        </div>

                    </div>
                )}
            </ConditionalRender>


            <ConditionalRender if={remaining.length}>
                <AvailableSets userDetails={userDetails} remainingSets={remaining}
                               addSetToCollection={addSetToCollection}/>
            </ConditionalRender>
            <Modal
                isOpen={!!modalData}
                onRequestClose={() => setModalData(null)}
                contentLabel="My dialog"
                className="page-modal"
                ariaHideApp={false}
                overlayClassName="modal-overlay"
                closeTimeoutMS={500}
            >
                {!modalData?.delete ?
                    <p>{`Are you sure you want to remove ${modalData?.name} from your collection?`} </p> :
                    <p>{`Are you sure you want to delete ${modalData?.name}?`} </p>}
                <div className='modal-buttons'>
                    <button onClick={() => setModalData(null)}>No</button>
                    <button
                        onClick={() => modalData?.delete ? deleteSet(modalData) : removeSetToCollection(modalData)}>Yes
                    </button>
                </div>
            </Modal>

        </div>

    )
}
export default SetList
