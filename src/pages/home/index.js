import {addSet, changeNumberStatus, getAllSetsWithNumbers} from "../../actions/actions";
import {useEffect, useState} from "react";
import './style.scss'

const HomeScreen  = () => {

    const [newSet, setNewSet] = useState({name: '', min: 1, max: 70, link: '', image: ''});
    const [data, dataSet] = useState([])


    const fetchData = async () => {
        dataSet(await getAllSetsWithNumbers())
    }


    useEffect(() => {
        fetchData()
    }, []);

   const changeStatus = (nr) => {
       changeNumberStatus(nr).then(() => fetchData())
    }

    const getClassName = (type) =>{
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

    const types = ['Turbo', 'Other']

    return (
        <div>
            {data && data.map((elem, i) =>
                <div key={i} className='set-wrapper'>
                    <p className='set-title'>
                        <a href={elem.link} rel="noreferrer" target='_blank'>{elem.name}</a>
                    </p>
                    <div className='set_numbers'>
                        {elem?.numbers.map((item, i) => {
                            return (
                                <span key={i} onClick={() => changeStatus(item)} className={`set-number ${getClassName(item.type)}`}>{item.number}</span>
                            )
                        })}
                    </div>

                </div>
            )}
            <input type='text' value={newSet.name} onChange={(e) => setNewSet({...newSet, name: e.target.value})}/>
            <input type='number' value={newSet.min} onChange={(e) => setNewSet({...newSet, min: parseInt(e.target.value)})}/>
            <input type='number' value={newSet.max} onChange={(e) => setNewSet({...newSet, max: parseInt(e.target.value)})}/>
            <select onChange={(e) => setNewSet({...newSet, type: e.target.value})}>
                <option value=''>Select Category</option>
                {types.map((type,i) =>
                <option key={i} value={type}>{type}</option>)
                }
            </select>
            <input type='text' value={newSet.link} onChange={(e) => setNewSet({...newSet, link: e.target.value})}/>
            <input type='text' value={newSet.image} onChange={(e) => setNewSet({...newSet, image: e.target.value})}/>
            <input type='button' value='Add' onClick={() => addSet(newSet)}/>
        </div>
    )
}


export default HomeScreen