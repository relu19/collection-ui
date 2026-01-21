import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { authenticateWithGoogle } from "../../actions/users";
import notificationService from "../../services/notificationService";

const LoginPage = ({ setUserDetails }) => {
    const responseGoogle = async (response) => {
        try {
            // Send Google token to backend for verification and JWT generation
            const authResponse = await authenticateWithGoogle(response.credential);
            
            // Store JWT token and user data in localStorage
            localStorage.setItem('auth', JSON.stringify({
                token: authResponse.token,
                user: authResponse.user
            }));
            
            // Set user details in app state
            console.log("Login successful, setting user details...");
            setUserDetails(authResponse.user);
        } catch (error) {
            // Don't show error if it was already handled
            if (error?.handled) {
                return;
            }
            console.error('Login error:', error);
            notificationService.error('Login failed. Please try again.');
        }
    };

    return (
        <GoogleLogin
            onSuccess={responseGoogle}
            onError={() => {
                console.log('Login Failed');
            }}
        />
    );
};

export default LoginPage;
