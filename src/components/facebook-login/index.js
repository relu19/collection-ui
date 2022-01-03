import FacebookLogin from "react-facebook-login";
import {deleteStorageItem, setStorageItem} from "../../storage";
import {createNewUser} from "../../actions/users";

const FaceBookLogin = ({userDetails, setUserDetails}) => {


    const responseFacebook = (response) => {
        setStorageItem('collector-data', response)
        createNewUser(response).then(() => setUserDetails(response))
    }


    const logOutUser = () => {
        deleteStorageItem('collector-data')
        window.location.reload();
    }

    return (
        <div>
            {!userDetails ? <FacebookLogin
                appId="355705533027242"
                autoLoad={true}
                fields="name,email,picture"
                callback={responseFacebook}
                cssClass="my-facebook-button-class"
                icon="fa-facebook"
            /> : <div onClick={() => logOutUser()}>Log Out</div>}
        </div>
    )
}
export default FaceBookLogin