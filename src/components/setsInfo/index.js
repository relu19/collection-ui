import './style.scss'
import Icon from "../icon";
import React from "react";

const SetsInfo = () => {
    return (
        <nav className="right-menu" tabIndex="1">
            <div className="smartphone-menu-trigger"/>
            <div/>
            <div className='set-info'>
                <div><p>I Have <Icon name='check' color="#cccccc" width={15} height={15} /></p></div>
                <div><p>I Have For Exchange <Icon name='double-check' color="#cccccc" width={15} height={15} /></p></div>
                <div><p>I Need <Icon name='uncheck' color="#cccccc" width={15} height={15} /></p></div>
                <div><p>I Have In Bad Condition</p></div>
                <div><p>Use <Icon name='check' color="#cccccc" width={15} height={15} /> <Icon name='double-check' color="#cccccc" width={15} height={15} /> <Icon name='uncheck' color="#cccccc" width={15} height={15} /> to mark all</p></div>
            </div>
        </nav>
    )
}
export default SetsInfo
