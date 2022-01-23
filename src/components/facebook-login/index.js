import FacebookLogin from "react-facebook-login";
import {createNewUser} from "../../actions/users";

const FaceBookLogin = ({setUserDetails}) => {


    const responseFacebook = (response) => {
        createNewUser(response).then(() => setUserDetails(response))
    }
    return (
        <FacebookLogin
                appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                fields="name,email,picture"
                callback={responseFacebook}
                autoLoad={true}
                disableMobileRedirect={true}
                cssClass='button'
            />
    )
}
export default FaceBookLogin