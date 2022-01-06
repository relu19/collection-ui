import './style.scss'

const SetsInfo = () => {
    return (
        <div className='set-info'>
            <div><p>I Have It <i className="fas fa-check" /></p></div>
            <div><p>I Have It For Exchange <i className="fas fa-check-double" /></p></div>
            <div><p>I Need It <i className="fas fa-ban" /></p></div>
            <div><p>I Have It in Bad Condition</p></div>
            <div><p>Use <i className="fas fa-check" />  <i className="fas fa-check-double" /> <i className="fas fa-ban" /> to mark all at once</p></div>
        </div>

    )
}
export default SetsInfo
