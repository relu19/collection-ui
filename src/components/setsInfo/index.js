import './style.scss'
import Icon from "../icon";
import React from "react";

const SetsInfo = ({editMode}) => {
    return (
        <nav className="right-menu" tabIndex="1">
            <div className="smartphone-menu-trigger"/>
            <div/>
            <div className='set-info'>
                <div><p>I Have  {editMode &&<Icon name='check' color="#cccccc" width={15} height={15} />}</p></div>
                <div><p>I Have For Exchange  {editMode &&<Icon name='double-check' color="#cccccc" width={15} height={15} />}</p></div>
                <div><p>I Need  {editMode &&<Icon name='uncheck' color="#cccccc" width={15} height={15} />}</p></div>
                <div><p>I Have In Bad Condition</p></div>
                {editMode && <div><p>Use <Icon name='check' color="#cccccc" width={15} height={15} /> <Icon name='double-check' color="#cccccc" width={15} height={15} /> <Icon name='uncheck' color="#cccccc" width={15} height={15} /> to mark all</p></div>}
                <p className='suggestion'>If you want a specific set to be added or have some suggestions send me an email: <a href="mailto:relu1919@yahoo.com">relu1919@yahoo.com</a></p>
            </div>
        </nav>
    )
}
export default SetsInfo
