import FacebookLogin from '@greatsumini/react-facebook-login';
import {createNewUser} from "../../actions/users";

const FaceBookLogin = ({setUserDetails}) => {


    const responseFacebook = (response) => {
        createNewUser(response).then(() => setUserDetails(response))
    }
    return (
        <FacebookLogin
                appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                fields="name,email,picture"
                // onSuccess={responseFacebook}
                style={{
                    backgroundColor: '#4267b2',
                    color: '#fff',
                    fontSize: '16px',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
                onProfileSuccess={responseFacebook}
            />
    )
}
export default FaceBookLogin