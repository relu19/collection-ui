import {types} from "../../config";
import {
    addSet,
    addSetNumbers,
    changeNumberStatus,
    deleteSetAndNumbers,
    getAllSetsWithNumbers,
    removeSetNumbers
} from "../../actions/set";
import {useEffect, useState} from "react";
import './style.scss'
import PureModal from "react-pure-modal";

const SetList = ({userDetails}) => {

    const [newSet, setNewSet] = useState({name: '', min: 1, max: 70, link: '', image: ''});
    const [data, dataSet] = useState([])
    const [showRemovePopUp, setShowRemovePopUp] = useState(null)
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


    console.log('userDetails', userDetails)

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
        setShowRemovePopUp(false)
    }

    const deleteSet = (set) => {
        deleteSetAndNumbers(set).then(() => fetchData())
    }

    const getTotal = (set, total) => {
        return total ? set.numbers.length : set.numbers.filter(s=> s.type === 1 || s.type === 2 || s.type === 3).length
    }

    return (
        <div>
            {collection && collection.map((elem, i) =>
                <div key={i} className='set-wrapper'>
                    <div onClick={() => setShowRemovePopUp(elem)} className='remove-set'/>
                    <div className='set-content'>
                        <div  className='set-list'>
                            <p className='set-title'>
                                <a href={elem.link} rel="noreferrer" target='_blank'>{elem.name}</a>
                                {userDetails?.god && <span onClick={() => deleteSet(elem)}>delete set</span>}
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
                            <img src={elem?.image} />
                        </div>
                    </div>
                    <div className='set-statistic'>{`You have ${getTotal(elem, false)} out of ${getTotal(elem, true)}` }</div>
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
            {userDetails?.god &&
                <div>
                    <input type='text' value={newSet.name}
                           onChange={(e) => setNewSet({...newSet, name: e.target.value})}/>
                    <input type='number' value={newSet.min}
                           onChange={(e) => setNewSet({...newSet, min: parseInt(e.target.value)})}/>
                    <input type='number' value={newSet.max}
                           onChange={(e) => setNewSet({...newSet, max: parseInt(e.target.value)})}/>
                    <select onChange={(e) => setNewSet({...newSet, type: e.target.value})}>
                        <option value=''>Select Category</option>
                        {types.map((type, i) =>
                            <option key={i} value={type}>{type}</option>)
                        }
                    </select>
                    <input type='text' value={newSet.link}
                           onChange={(e) => setNewSet({...newSet, link: e.target.value})}/>
                    <input type='text' value={newSet.image}
                           onChange={(e) => setNewSet({...newSet, image: e.target.value})}/>

                    <input type='text' value={data.length}
                           onChange={(e) => setNewSet({...newSet, order: e.target.value})}/>
                    <input type='button' value='Add'
                           onClick={() => addSet(newSet, userDetails).then(() => fetchData())}/>
                </div>}

            <PureModal
                header="Remove Set"
                isOpen={showRemovePopUp}
                width='350px'
                onClose={() => setShowRemovePopUp(false)}

                footer={
                    <div>
                        <button onClick={() => setShowRemovePopUp(false)}>Cancel</button>
                        <button onClick={() => removeSetToCollection(showRemovePopUp)}>Yes</button>
                    </div>
                }
            >
                <p>Are you sure you want to remove this set from your collection?</p>

            </PureModal>
        </div>
    )
}
export default SetList

