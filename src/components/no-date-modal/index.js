import React from "react";

const NoData = ({setModal}) => {

    return (
        <div>
            <div className='modal-header'>
                Error
            </div>
            <div className='modal-content'>
                <div className='exchange-table'>
                    <p className='no-data'>Add something in your collection first</p>
                </div>
            </div>
            <hr/>
            <div className='modal-footer'>
                <input className='button' type='button' value='Close'
                       onClick={() => setModal()}/>
            </div>
        </div>

    )
}
export default NoData
