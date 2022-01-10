import './style.scss'

const AvailableSets = ({userDetails, remainingSets, addSetToCollection}) => {
    return (
        <div>
            <h2 className='sub-title'>Available Sets</h2>
            <div className='set-wrapper available-sets'>
                {remainingSets.map((elem, i) =>
                    <div className='add-set' key={i}>
                        <a href={elem.link} rel="noreferrer" className='add-set-title' target='_blank'>{elem.name}</a>
                        {userDetails.id && <i onClick={() => addSetToCollection(elem)} className="add-set-icon fas fa-plus-square" />}
                    </div>
                )}
            </div>

        </div>

    )
}
export default AvailableSets
