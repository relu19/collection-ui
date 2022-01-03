import FaceBookLogin from "../facebook-login";
import {deleteStorageItem, setStorageItem} from "../../storage";
import {getUser} from "../../actions/users";
// https://www.npmjs.com/package/react-pure-modal
import PureModal from 'react-pure-modal';
import 'react-pure-modal/dist/react-pure-modal.min.css';
import {useState} from "react";
import './style.scss'



const Header = ({userDetails, setUserDetails}) => {

    const [modal, setModal] = useState(false);


    const fetchUser = async (data) => {
        const userInfo = await getUser(data)
        const userId = userInfo.length && userInfo[0].id
        const userType = userInfo.length && userInfo[0].type
        const userData = {...data, id: userId, god: userType === 114}
        setUserDetails(userData)
        setModal(false)
        setStorageItem('collector-data', userData)
    }

    const logOutUser = () => {
        deleteStorageItem('collector-data')
        window.location.reload();
    }

    console.log('process.env.FACEBOOK_ID', process.env.FACEBOOK_ID)


    console.log('userDetails', userDetails)
    return (
        <div className='cl-header'>
            {!userDetails &&   <div className='header-data'><div/><a onClick={() => setModal(true)}>Log In</a></div>}
            {userDetails && <div className='header-data'><div className='user-info'><img alt={''} src={userDetails?.picture?.data?.url} /> <p>{userDetails?.name}</p></div><a onClick={() => logOutUser()}>Log Out</a></div>}

            <PureModal
                header="Log In / Sign Up"
                isOpen={modal}
                width='350px'
                onClose={() => {setModal(false)}}

                footer={
                    <div className='pop-up-buttons'>
                       <FaceBookLogin userDetails={userDetails} setUserDetails={fetchUser}/>
                    </div>
                }
            >
                <p>Create an account so you can add your own collection and share it with others</p>

            </PureModal>
        </div>
    )
}
export default Header