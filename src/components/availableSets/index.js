import './style.scss'
import Icon from "../icon";
import React from "react";

const AvailableSets = ({userDetails, remainingSets, addToCollection}) => {
    return (
        <div>
            <h2 className='sub-title'>Available Sets</h2>
            <div className='set-wrapper available-sets'>
                {remainingSets.map((elem, i) =>
                    <div className='add-set' key={i}>
                        <a href={elem.link} rel="noreferrer" className='add-set-title' target='_blank'>{elem.name}</a>
                        {userDetails.id &&
                            <Icon onClick={() => addToCollection(elem, userDetails.id)}  name='add' color="#cccccc" width={20} height={20} />}
                    </div>
                )}
            </div>

        </div>

    )
}
export default AvailableSets
