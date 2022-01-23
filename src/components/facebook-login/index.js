import FacebookLogin from "react-facebook-login";
import {createNewUser} from "../../actions/users";

const FaceBookLogin = ({setUserDetails}) => {


    const responseFacebook = (response) => {
        createNewUser(response).then(() => setUserDetails(response))
    }

    const isFacebookApp = () => {
        const ua = navigator.userAgent || navigator.vendor || window.opera;
        return (
            ua.indexOf('FBAN') > -1 ||
            ua.indexOf('FBAV') > -1 ||
            ua.indexOf('Instagram') > -1
        );
    };

    return (
        <FacebookLogin
                appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                fields="name,email,picture"
                callback={responseFacebook}
                disableMobileRedirect={!isFacebookApp()}
                autoLoad={isFacebookApp()}
                cssClass='button'
            />
    )
}
export default FaceBookLogin