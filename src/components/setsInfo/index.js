import './style.scss'

const SetsInfo = () => {
    return (
        <nav className="right-menu" tabIndex="1">
            <div className="smartphone-menu-trigger"/>
            <div/>
            <div className='set-info'>
                <div><p>I Have <i className="fas fa-check" /></p></div>
                <div><p>I Have For Exchange <i className="fas fa-check-double" /></p></div>
                <div><p>I Need <i className="fas fa-ban" /></p></div>
                <div><p>I Have In Bad Condition</p></div>
                <div><p>Use <i className="fas fa-check" />  <i className="fas fa-check-double" /> <i className="fas fa-ban" /> to mark all</p></div>
            </div>
        </nav>



    )
}
export default SetsInfo
