import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { createNewUser, getUser } from "../../actions/users"; // Add getUser
import { jwtDecode } from "jwt-decode";

const LoginPage = ({ setUserDetails }) => {
    const responseGoogle = async (response) => {
        const decoded = jwtDecode(response.credential);

        // Extract user details
        const userDetails = {
            name: decoded.name,
            email: decoded.email,
            logo: decoded.picture,
            type: 1,
            fbId: decoded.sub,
        };

        // Step 1: Check if user exists in the database
        const existingUser = await getUser(userDetails);


        if (existingUser && existingUser.length > 0) {
            // Step 2: User exists, log them in
            console.log("User exists, logging in...");
            setUserDetails(existingUser[0]);
        } else {
            // Step 3: User does not exist, create a new one
            console.log("User not found, creating a new one...");
            await createNewUser(userDetails);
            setUserDetails(userDetails);
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
