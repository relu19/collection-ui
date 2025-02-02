import React, { useState } from 'react';
import ForgotPasswordForm from "./forgot-password";
import SignupForm from "./sign-up";

const LoginPage = ({ setUserDetails }) => {
    const [isSignedUp, setIsSignedUp] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const handleSignupSubmit = async ({ email, password }) => {
        // Call your backend API for signup and send confirmation email
        // Example: await signupApi(email, password);
        setIsSignedUp(true);
    };

    const handleForgotPasswordSubmit = async (email) => {
        // Call backend to send password reset email
        // Example: await forgotPasswordApi(email);
        setIsForgotPassword(true);
    };


    const EmailConfirmation = () => (
        <div>
            <h2>Email Confirmation</h2>
            <p>Please check your email for a confirmation link.</p>
        </div>
    );


    return (
        <div>
            {!isSignedUp && !isForgotPassword ? (
                <SignupForm onSubmit={handleSignupSubmit}/>
            ) : isForgotPassword ? (
                <ForgotPasswordForm onSubmit={handleForgotPasswordSubmit}/>
            ) : (
                <EmailConfirmation/>
            )}
        </div>
    );
}

export default LoginPage;
