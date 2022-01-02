import {
    addSet,
    addSetNumbers,
    changeNumberStatus,
    getAllSetsWithNumbers,
    getUser, removeSetNumbers
} from "../../actions/actions";
import {useEffect, useState} from "react";
import FaceBookLogin from "../../components/facebook-login";
import './style.scss'
import {types} from "../../config";
import {getStorageItem} from "../../storage";

const HomeScreen = () => {

    const [newSet, setNewSet] = useState({name: '', min: 1, max: 70, link: '', image: ''});
    const [data, dataSet] = useState([])
    const [userDetails, setUserDetails] = useState(getStorageItem('collector-data'))
    const [loggedUser, setLoggedUser] = useState({id: null, isAdmin: false});


    const fetchData = async () => {
        dataSet(await getAllSetsWithNumbers(loggedUser.id))
    }

    useEffect(() => {
        fetchData()
    }, [loggedUser]);

    useEffect(() => {
        const fetchUser = async () => {
            const userInfo = await getUser(userDetails)
            setLoggedUser({id: userInfo[0].id, isAdmin: userInfo[0].type === 0})
        }
        fetchUser()
    }, [userDetails]);

    const changeStatus = (nr) => {
        changeNumberStatus(nr).then(() => fetchData())
    }

    const collection = data.filter(sets => sets.type === 'inCollection')
    const remaining = data.filter(sets => sets.type === 'remaining')

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

    const addSetToCollection = (set) => {
        const elem = {
            setId: set.id,
            userId: loggedUser.id,
            maxNr: set.maxNr,
            minNr: set.minNr,
        }
        addSetNumbers(elem).then(() => fetchData())
    }


    const removeSetToCollection = (elem) => {
        console.log(elem)
        removeSetNumbers(elem, loggedUser.id).then(() => fetchData())
    }
    console.log('data', data)

    return (
        <div>
            <FaceBookLogin userDetails={userDetails} setUserDetails={setUserDetails}/>
            {collection && collection.map((elem, i) =>
                <div key={i} className='set-wrapper'>
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

                    {loggedUser.id && <div onClick={() => removeSetToCollection(elem)}>remove from collection</div>}
                </div>
            )}
            {remaining && remaining.map((elem, i) =>
                <div key={i} className='set-wrapper'>
                    <p className='set-title'>
                        <a href={elem.link} rel="noreferrer" target='_blank'>{elem.name}</a>
                    </p>
                    {loggedUser.id && <div onClick={() => addSetToCollection(elem)}>add to collection</div>}
                </div>
            )}
            {loggedUser.isAdmin &&
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
        </div>
    )
}


export default HomeScreen