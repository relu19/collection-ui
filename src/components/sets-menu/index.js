import {types} from "../../config";
import './style.scss'

const SetsMenu = ({changeCategory}) => {
    return (
        <div>
            <ul className='sets-list'>
                {types[0].types.map((type, i) =>
                    <li key={i} onClick={() => changeCategory(type)}>{type}</li>
                )}
            </ul>

        </div>

    )
}
export default SetsMenu
