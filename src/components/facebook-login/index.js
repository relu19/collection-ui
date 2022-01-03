import FacebookLogin from "react-facebook-login";
import {createNewUser} from "../../actions/users";

const FaceBookLogin = ({userDetails, setUserDetails}) => {


    const responseFacebook = (response) => {
        createNewUser(response).then(() => setUserDetails(response))
    }
    return (
        <FacebookLogin
                appId="355705533027242"
                fields="name,email,picture"
                callback={responseFacebook}
                autoLoad={false}
                cssClass="fb-login-button"
            />
    )
}
export default FaceBookLogin