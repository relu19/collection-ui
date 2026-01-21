import './style.scss'
import Icon from "../icon";
import React from "react";

const SetsInfo = ({editMode}) => {
    return (
        <nav className="right-menu" tabIndex="1">
            <div className="smartphone-menu-trigger">
                <span className="trigger-arrow">‹</span>
                <span className="trigger-label">Legend</span>
                <span className="trigger-icon">ℹ</span>
            </div>
            <div className='set-info'>
                <div className='legend-item'>
                    <span className='color-indicator owned'></span>
                    <p>Got it {editMode && <Icon name='check' color="#ffffff" width={15} height={15} />}</p>
                </div>
                <div className='legend-item'>
                    <span className='color-indicator trading'></span>
                    <p>Trading {editMode && <Icon name='double-check' color="#28a745" width={15} height={15} />}</p>
                </div>
                <div className='legend-item'>
                    <span className='color-indicator looking'></span>
                    <p>Looking for {editMode && <Icon name='uncheck' color="#e74c3c" width={15} height={15} />}</p>
                </div>
                <div className='legend-item'>
                    <span className='color-indicator damaged'></span>
                    <p>Damaged</p>
                </div>
                {editMode && <div className='legend-tip'><p>Click
                    <Icon name='check' color="#ffffff" width={15} height={15} />
                    <Icon name='double-check' color="#28a745" width={15} height={15} />
                    <Icon name='uncheck' color="#e74c3c" width={15} height={15} /> to mark all</p></div>}
                <div className='suggestion'>
                    <span className='suggestion-title'>Missing a set?</span>
                    <span>Suggest additions or share feedback</span>
                    <a href="mailto:plesciuc.relu@gmail.com">Get in touch →</a>
                </div>
            </div>
        </nav>
    )
}
export default SetsInfo
